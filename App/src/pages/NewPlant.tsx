import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AppHeader } from '@/components/AppHeader'
import { ChatBubble } from '@/components/ChatBubble'
import { ResponseBubble } from '@/components/ResponseBubble'
import { Button } from '@/components/Button'
import { PhotoUpload } from '@/components/PhotoUpload'
import { useProjects } from '@/lib/store'
import {
  describeGeolocationError,
  getCurrentPosition,
  hemisphereFromCountry,
  hemisphereFromLatitude,
} from '@/lib/location'
import type { PlantProject } from '@/lib/types'

interface Question {
  id: keyof Pick<
    PlantProject,
    | 'name'
    | 'variety'
    | 'varietySource'
    | 'varietyLabelNote'
    | 'location'
    | 'plantedWhen'
    | 'personalMeaning'
  >
  pipAsks: string
  placeholder: string
  optional?: boolean
  multiline?: boolean
}

/**
 * Answers matching this (blank, "not sure," "don't know," and similar) mean
 * the gardener doesn't actually know the variety — see advanceStep's skip
 * logic below, which uses this to decide whether "Where did you find that
 * out?" makes sense to ask next.
 */
function isUnknownVarietyAnswer(value: string) {
  const v = value.trim().toLowerCase()
  if (!v) return true
  return /\b(not sure|unsure|no idea|no clue|(don'?t|do not|dont) know|unknown|not known)\b/.test(v)
}

const QUESTIONS: Question[] = [
  { id: 'name', pipAsks: 'What would you like to call this rose?', placeholder: "Sarah's Rose" },
  {
    id: 'variety',
    pipAsks: 'What type of rose is this?',
    placeholder: "Iceberg, or 'not sure'",
    optional: true,
  },
  {
    // Only reached when 'variety' above got an actual answer — see
    // advanceStep's skip logic below. Asking "where did you find that out?"
    // about an answer the gardener never really gave ("not sure," a plain
    // skip) didn't make sense.
    id: 'varietySource',
    pipAsks: 'Where did you find that out?',
    placeholder: 'A nursery label',
    optional: true,
  },
  {
    // Always asked next regardless of the variety/varietySource path above —
    // a label can carry a lot more than just the variety name (a plant
    // code, breeder, care notes), so this is worth asking about even when
    // the gardener already gave a confident variety answer, and even when
    // they don't know the variety at all but still have the label itself.
    id: 'varietyLabelNote',
    pipAsks:
      'Is there a nursery label? Jot down anything on it worth keeping, and add a photo below if you have one.',
    placeholder: 'Plant code, breeder, care notes…',
    optional: true,
    multiline: true,
  },
  {
    id: 'location',
    pipAsks: "Where is your rose growing? I'll use this to understand your local season.",
    // Unused — this question gets its own custom two-path UI below instead
    // of the generic text input (see the `question.id === 'location'` branch).
    placeholder: '',
  },
  {
    id: 'plantedWhen',
    pipAsks:
      "Roughly when did you plant this rose, or how long has it been in this spot? A rough idea is fine — I use this to check it's established enough to prune safely.",
    placeholder: "About 3 years ago, or 'not sure'",
    optional: true,
  },
  {
    id: 'personalMeaning',
    pipAsks: 'Would you like to record why this rose is special to you?',
    placeholder: "My sister gave it to me...",
    optional: true,
    multiline: true,
  },
]

type LocationStep = 'choose' | 'geolocating' | 'manual'

// One extra step after all the QUESTIONS: a chance to add a cover photo
// right now, while the rose is already in front of the gardener (or at
// least top of mind) — see the PHOTO_STEP render branch below for why this
// couldn't just stay something Journey.tsx asks for later.
const PHOTO_STEP = QUESTIONS.length

/**
 * One conversational question at a time, matching Marie's Story chapter 1.
 *
 * Saves progressively rather than only at the very end: the plant's record
 * is created as soon as the (required) name question is answered, and each
 * later answer is written with its own save as soon as it's given. A
 * gardener who closes the app partway through the questionnaire keeps
 * whatever they'd already told Pip, instead of losing the whole thing
 * because the flow never reached the final question.
 */
export function NewPlant() {
  const navigate = useNavigate()
  const { addProject, updateProject } = useProjects()

  const [projectId] = useState(() => crypto.randomUUID())
  const [created, setCreated] = useState(false)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [draft, setDraft] = useState('')
  const [saving, setSaving] = useState(false)
  // The onboarding cover-photo step's own state — kept local rather than
  // read from useProjects()' live project data, since this whole page works
  // from local answer state and only creates the real record partway
  // through (see advance() below).
  const [photoPath, setPhotoPath] = useState<string | undefined>()
  // A photo of the nursery tag itself, offered alongside the "what kind of
  // rose is it" question — same local-state reasoning as photoPath above.
  const [labelPhotoPath, setLabelPhotoPath] = useState<string | undefined>()
  // This whole questionnaire lives on one route (/new-plant) — step just
  // moves through QUESTIONS/PHOTO_STEP locally — so AppHeader's generic
  // per-route Back target has no idea a step even exists; without this,
  // Back from the 3-dot menu jumped straight out to the library from any
  // question, the same bug already fixed for the pruning journey (see
  // Journey.tsx's own history stack). Each step index is pushed here right
  // before advanceStep moves forward, and goBack below pops it — including
  // the skip-ahead over "Where did you find that out?" when the variety
  // answer didn't call for it, since a skipped index is simply never pushed
  // in the first place, so going back skips it too, symmetrically.
  const [history, setHistory] = useState<number[]>([])

  const isPhotoStep = step === PHOTO_STEP

  // The location question's own sub-flow — either "use my location" (the
  // browser's Geolocation API, no external service needed) or manual entry
  // as three separate fields (town/city, region/state, country) rather
  // than one free-text blob, so a country is always identifiable enough to
  // look up a hemisphere from, without needing any autocomplete/geocoding
  // service either.
  const [locationStep, setLocationStep] = useState<LocationStep>('choose')
  const [geoError, setGeoError] = useState<string | null>(null)
  const [manualCity, setManualCity] = useState('')
  const [manualRegion, setManualRegion] = useState('')
  const [manualCountry, setManualCountry] = useState('')

  const question = isPhotoStep ? null : QUESTIONS[step]
  const canAdvance = !!question && (question.optional || draft.trim().length > 0)

  /**
   * overrideValue lets the "Skip this one" button pass an explicit empty
   * answer instead of relying on `draft` — calling setDraft('') and then
   * advance() in the same click read the still-stale `draft` from before
   * the state update landed, so skipping while text was typed but not
   * cleared silently saved that text instead of skipping it.
   */
  async function advance(overrideValue?: string) {
    if (!question) return // photo step has its own controls, not this one
    const value = (overrideValue ?? draft).trim()
    const next = { ...answers, [question.id]: value }
    setAnswers(next)
    setSaving(true)

    if (!created) {
      // The first question is always 'name' (it's the only required one
      // before this point), so this is the earliest moment a real plant
      // record can exist. Everything else starts at a safe default and
      // fills in as each later question is answered.
      await addProject({
        id: projectId,
        name: value || 'My Rose',
        variety: 'Unknown variety',
        varietySource: '',
        location: '',
        plantedWhen: undefined,
        personalMeaning: undefined,
        createdAt: new Date().toISOString(),
        observations: [],
        progressPhotos: [],
        notes: [],
        journeyCloseUpPhotoPaths: [],
        journeyComplete: false,
      })
      setCreated(true)
    } else if (value) {
      // A skipped optional question leaves the default set at creation
      // alone rather than overwriting it with a blank.
      await updateProject(projectId, { [question.id]: value } as Partial<PlantProject>)
    }

    setSaving(false)
    advanceStep(next)
  }

  function advanceStep(next: Record<string, string>) {
    let nextIndex = step + 1
    // "Where did you find that out?" only makes sense if the gardener
    // actually said what kind of rose it is — asking it after a plain skip,
    // "not sure," or "don't know" had no real answer to be "that" about.
    // Skips straight to the nursery-label question next either way (see
    // QUESTIONS above) — that one's asked regardless of this path.
    if (
      QUESTIONS[step]?.id === 'variety' &&
      isUnknownVarietyAnswer(next.variety ?? '') &&
      QUESTIONS[nextIndex]?.id === 'varietySource'
    ) {
      nextIndex += 1
    }
    if (nextIndex < QUESTIONS.length) {
      setHistory((prev) => [...prev, step])
      setStep(nextIndex)
      setDraft(next[QUESTIONS[nextIndex].id] ?? '')
      return
    }
    if (step < PHOTO_STEP) {
      // Just answered the last text question — one more step before
      // onboarding wraps up: a chance to add a cover photo now. This can't
      // just wait for Journey.tsx's own 'photos' phase, because a young rose
      // that isn't established enough to prune yet may never reach that
      // phase at all (see the photo step's ChatBubble below) — added after
      // feedback that a first-year rose's gardener could otherwise go a
      // full season without ever being offered the chance to attach one.
      setHistory((prev) => [...prev, step])
      setStep(PHOTO_STEP)
      return
    }
    // Onboarding's job ends here — the plant is saved and its journal now
    // has somewhere to live in the Library. It deliberately does NOT drop
    // the gardener straight into a pruning journey: that's a real, guided
    // decision (with its own safety checklist and "is this rose even
    // established enough yet" gate) that shouldn't be sprung on someone the
    // moment they finish naming a plant. From the Library, opening this
    // plant's own page (PlantProject.tsx) offers "Begin journey" alongside
    // progress photos and notes, so starting a journey is something the
    // gardener chooses to do next, not something onboarding decided for them.
    navigate('/library')
  }

  /** Used by the location sub-flow instead of advance() — it saves several fields at once, not one draft string. */
  async function commitLocation(patch: Partial<PlantProject>) {
    setSaving(true)
    await updateProject(projectId, patch)
    setSaving(false)
    advanceStep({ ...answers, location: patch.location ?? '' })
  }

  async function useMyLocation() {
    setGeoError(null)
    setLocationStep('geolocating')
    try {
      const position = await getCurrentPosition()
      const { latitude, longitude } = position.coords
      await commitLocation({
        location: 'Current location',
        locationMethod: 'geolocation',
        latitude,
        longitude,
        hemisphere: hemisphereFromLatitude(latitude),
      })
    } catch (err) {
      const message =
        err && typeof err === 'object' && 'code' in err
          ? describeGeolocationError(err as GeolocationPositionError)
          : 'Something went wrong getting your location. Enter it manually below.'
      setGeoError(message)
      setLocationStep('choose')
    }
  }

  function submitManualLocation() {
    const city = manualCity.trim()
    const region = manualRegion.trim()
    const country = manualCountry.trim()
    if (!city || !country) return

    commitLocation({
      location: [city, region, country].filter(Boolean).join(', '),
      locationMethod: 'manual',
      locationCity: city,
      locationRegion: region || undefined,
      locationCountry: country,
      hemisphere: hemisphereFromCountry(country),
    })
  }

  // Pops the history stack above and restores that step, so "Back" from the
  // 3-dot menu steps through the questionnaire one question at a time
  // instead of leaving it for the library. The location question's own
  // manual/choose sub-flow isn't tracked in `history` (it's a detour within
  // a single step, not a step of its own) — unwound first, one layer at a
  // time, the same way its inline "Back" link already does.
  function goBack() {
    if (question?.id === 'location' && locationStep !== 'choose') {
      setLocationStep('choose')
      setGeoError(null)
      return
    }
    if (history.length === 0) {
      navigate('/library')
      return
    }
    const prevStep = history[history.length - 1]
    setHistory((prev) => prev.slice(0, -1))
    setStep(prevStep)
    setDraft(answers[QUESTIONS[prevStep]?.id] ?? '')
    setLocationStep('choose')
    setGeoError(null)
  }

  return (
    <div className="flex h-full flex-col">
      <AppHeader onBack={goBack} />

      <div className="flex-1 overflow-y-auto px-4 pb-6 pt-6">
        <motion.div
          key={isPhotoStep ? 'photo' : question!.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {isPhotoStep ? (
            <>
              <ChatBubble>
                Would you like to add a photo of {answers.name || 'your rose'} for your journal? You
                can take one now or upload one from your device. If not, it's totally fine to skip
                this for now.
              </ChatBubble>
              <ResponseBubble>
                <div className="mb-3 w-2/3">
                  {/* slot="overview" / overviewPhotoPath — the cover photo only, kept
                      deliberately separate from Journey.tsx's journey-overview/
                      journey-close-up slots. Those are re-captured fresh every pruning
                      journey (which can start years after this one), so this photo
                      never pre-fills — and never gets pre-filled by — that step. */}
                  <PhotoUpload
                    label="Cover photo"
                    profileId={projectId}
                    slot="overview"
                    path={photoPath}
                    onChange={(path) => {
                      setPhotoPath(path)
                      updateProject(projectId, { overviewPhotoPath: path })
                    }}
                    className="aspect-square"
                  />
                </div>
                <Button onClick={() => navigate('/library')}>
                  {photoPath ? "That's everything — save" : 'Skip for now — save'}
                </Button>
                <p className="mt-2 text-center text-xs text-pip-text-soft">
                  {!photoPath &&
                    `You can always add one later from ${answers.name || 'this plant'}'s own page. `}
                  You'll find {answers.name || 'this rose'} waiting in your library — the pruning
                  journey can start whenever you're ready.
                </p>
              </ResponseBubble>
            </>
          ) : (
            <>
              <ChatBubble>{question!.pipAsks}</ChatBubble>

              <ResponseBubble>
                {question!.id === 'location' ? (
              locationStep === 'choose' ? (
                <div className="flex flex-col gap-2.5">
                  {geoError && <p className="text-xs text-red-600">{geoError}</p>}
                  <Button onClick={useMyLocation}>Use my current location</Button>
                  <Button variant="secondary" onClick={() => setLocationStep('manual')}>
                    Enter it manually
                  </Button>
                </div>
              ) : locationStep === 'geolocating' ? (
                <p className="text-sm text-pip-text-soft">Getting your location…</p>
              ) : (
                <div className="flex flex-col gap-2.5">
                  <input
                    autoFocus
                    value={manualCity}
                    onChange={(e) => setManualCity(e.target.value)}
                    placeholder="Town / city"
                    className="input w-full"
                  />
                  <input
                    value={manualRegion}
                    onChange={(e) => setManualRegion(e.target.value)}
                    placeholder="Region / state (optional)"
                    className="input w-full"
                  />
                  <input
                    value={manualCountry}
                    onChange={(e) => setManualCountry(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === 'Enter' &&
                      manualCity.trim() &&
                      manualCountry.trim() &&
                      submitManualLocation()
                    }
                    placeholder="Country"
                    className="input w-full"
                  />
                  <Button
                    disabled={saving || !manualCity.trim() || !manualCountry.trim()}
                    onClick={submitManualLocation}
                  >
                    {saving ? 'Saving…' : 'Next'}
                  </Button>
                  <button
                    onClick={() => setLocationStep('choose')}
                    className="text-sm text-pip-text-soft underline"
                  >
                    Back
                  </button>
                </div>
              )
            ) : (
              <>
                {question!.multiline ? (
                  <textarea
                    autoFocus
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder={question!.placeholder}
                    rows={3}
                    className="input resize-none w-full"
                  />
                ) : (
                  <input
                    autoFocus
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && canAdvance && advance()}
                    placeholder={question!.placeholder}
                    className="input w-full"
                  />
                )}

                {question!.id === 'varietyLabelNote' && (
                  <div className="mt-3">
                    <p className="mb-1.5 text-xs font-medium text-pip-text-soft">
                      Label photo (optional)
                    </p>
                    <div className="w-1/2">
                      <PhotoUpload
                        label="Label photo"
                        profileId={projectId}
                        slot="variety-label"
                        path={labelPhotoPath}
                        onChange={(path) => {
                          setLabelPhotoPath(path)
                          updateProject(projectId, { varietyLabelPhotoPath: path })
                        }}
                        className="aspect-square"
                      />
                    </div>
                  </div>
                )}

                <div className="mt-3 flex flex-col gap-2">
                  <Button disabled={!canAdvance || saving} onClick={() => advance()}>
                    {saving ? 'Saving…' : 'Next'}
                  </Button>
                  {question!.optional && (
                    <button
                      disabled={saving}
                      onClick={() => advance('')}
                      className="text-sm text-pip-text-soft underline disabled:opacity-40"
                    >
                      Skip this one
                    </button>
                  )}
                </div>
              </>
            )}
              </ResponseBubble>
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}

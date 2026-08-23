import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AppHeader } from '@/components/AppHeader'
import { ChatBubble } from '@/components/ChatBubble'
import { ResponseBubble } from '@/components/ResponseBubble'
import { Button } from '@/components/Button'
import { PhotoPlaceholder } from '@/components/PhotoPlaceholder'
import { PhotoUpload } from '@/components/PhotoUpload'
import { JourneyCloseUps } from '@/components/JourneyCloseUps'
import { DecisionChoices } from '@/components/DecisionChoices'
import { InfoModal } from '@/components/InfoModal'
import { useProjects } from '@/lib/store'
import { observationScript } from '@/data/observationScript'
import {
  evaluateRecentlyPlantedFallback,
  evaluateRecentlyPlantedPrimary,
} from '@/lib/suitabilityGates'
import type {
  RecentlyPlantedFallbackSignals,
  RecentlyPlantedGateResult,
  RecentlyPlantedPrimaryAnswer,
} from '@/lib/suitabilityGates'
import type { ObservationOutcome, ObservationRecord, SafetyChecklistEntry, Choice } from '@/lib/types'

// "It wasn't planted or moved recently" used to live here as a static,
// self-attesting checklist item. It's now its own real check — the
// 'planted-primary' / 'planted-fallback' phases below, driven by
// PKR-SGT-000002 — so it's been removed from this list rather than left as
// a duplicate, unconnected question.
//
// Every other item here is still a plain self-attestation — the gardener
// checks a box on their own judgment, with nothing behind it verifying the
// answer. `help`, where present, is a "?" a gardener can tap for guidance
// on how to judge that item themselves; it does not change what checking
// the box means or feed into any gate logic.
//
// This list is NOT a gate: continuing past it doesn't require every box
// checked. No cutting decision has been made yet at this point in the
// journey — that happens later, per observation, in the 'decide' phase, so
// blocking progress here on an unconfident "I don't know" (which the
// stress/damage help text explicitly invites) was stricter than the actual
// stakes at this screen warrant. What the gardener actually checked or left
// unchecked when they continued is still saved (see safetyChecklist below)
// so there's an honest record that the checklist — including the tool
// condition, gear, and access items — was genuinely shown to them.
interface SafetyItem {
  label: string
  /**
   * Sourced only from content a Founder has actually approved — never
   * written fresh here. Left undefined where no approved content exists
   * yet, rather than inventing something that sounds plausible.
   */
  help?: string
}

const SAFETY_ITEMS: SafetyItem[] = [
  {
    label: 'The rose is dormant, not in active growth',
    // Verbatim from PKR-SGT-000001's approved Question/Check, its "Still
    // dormant" Acceptable Answer, and its AF-3 Preserved Uncertainty caveat
    // (PKR-SGT-BUSHROSE-DORMANCY-01-submission.md — content Founder-approved
    // 23 Aug 2026, Version 1.0). That PKR's Status is still Draft —
    // Dependency-Blocked (an unrelated "not sure"-wording gap and an open
    // caveat-design question — see Project_Backlog.md), so this is shown as
    // plain informational text, not wired as an actual gate the way
    // PKR-SGT-000002 is in the phases below. If that record's approved
    // wording changes, this needs updating to match.
    help: "Look closely at the buds along your rose's canes. Has active new growth already begun — buds swelling, breaking open, or new leaves emerging anywhere on the plant — or does it still appear dormant?\n\nStill dormant (check the box): buds are tight and closed, or just beginning to swell, with no new leaves open anywhere on the plant.\n\nIf your climate is mild or unusually warm, judge this by bud state specifically — not by whether the leaves have dropped. In milder climates a rose doesn't always lose all its leaves, and buds can sometimes break earlier than expected.",
  },
  {
    label: 'No serious stress, damage or disease',
    // No FRD/ARC research exists for this item at all yet (tracked in
    // Project_Backlog.md under "Remaining Suitability Gate areas"). This is
    // process guidance only — it makes no diagnostic claims — rather than
    // inventing what "serious stress or damage" looks like without
    // approved evidence behind it.
    help: "Pip doesn't have specific guidance yet for spotting stress, damage or disease — that research hasn't been done. If you're at all unsure, the honest choice is to leave this box unchecked. That won't stop you continuing, but it's worth taking the extra care that implies, and considering asking an experienced local gardener to take a look with you before you actually cut anything.",
  },
  { label: 'Secateurs are clean and sharp' },
  { label: 'Gloves and eye protection are ready' },
  { label: 'The rose is safely accessible' },
]

/** PKR-SGT-000002's Fallback Check — the three AF-2 signals, asked only when the gardener doesn't know the planting date. */
const FALLBACK_QUESTIONS: { key: keyof RecentlyPlantedFallbackSignals; label: string }[] = [
  { key: 'activeNewGrowth', label: 'Is it putting out active new growth right now?' },
  {
    key: 'caneCountAboveBaseline',
    label: 'Does it have noticeably more canes than a newly bought rose (more than about 3)?',
  },
  { key: 'baseFeelsFirm', label: 'Does the base feel firmly rooted when you gently test it?' },
]

type Phase = 'safety' | 'planted-primary' | 'planted-fallback' | 'photos' | 'observe' | 'decide' | 'summary'

export function Journey() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getProject, updateProject, addObservation, addJourneyCloseUpPhoto, removeJourneyCloseUpPhoto, loading } =
    useProjects()
  const project = id ? getProject(id) : undefined

  const [phase, setPhase] = useState<Phase>('safety')
  const [checked, setChecked] = useState<boolean[]>(() => SAFETY_ITEMS.map(() => false))
  const [helpIndex, setHelpIndex] = useState<number | null>(null)
  const [savingSafety, setSavingSafety] = useState(false)
  const [fallbackSignals, setFallbackSignals] = useState<Partial<RecentlyPlantedFallbackSignals>>({})
  const [gateResult, setGateResult] = useState<RecentlyPlantedGateResult | null>(null)
  const [obsIndex, setObsIndex] = useState(0)
  const [records, setRecords] = useState<ObservationRecord[]>([])
  const [revealed, setRevealed] = useState(false)
  const [showWhy, setShowWhy] = useState(false)
  const [saving, setSaving] = useState(false)
  const [pendingCutConfirm, setPendingCutConfirm] = useState(false)
  const uncheckedCount = checked.filter((v) => !v).length
  const fallbackComplete = FALLBACK_QUESTIONS.every((q) => fallbackSignals[q.key] !== undefined)

  if (loading) {
    return <div className="p-6 text-sm text-pip-text-soft">Loading…</div>
  }

  if (!project) {
    return (
      <div className="p-6 text-sm text-pip-text-soft">
        Couldn't find that plant. <button className="underline" onClick={() => navigate('/library')}>Back to your plants</button>
      </div>
    )
  }

  // Which observations this journey is allowed to offer, per PKR-SGT-000002.
  // Established (or the gate hasn't run yet, e.g. still mid-onboarding data)
  // gets the full script; a restricted result limits it to dead wood only.
  const allowedObservations =
    gateResult && gateResult.status === 'restricted'
      ? observationScript.filter((o) => gateResult.allowedObservationIds.includes(o.id))
      : observationScript
  const current = allowedObservations[obsIndex]

  // What the gardener actually left unchecked on the safety screen (see
  // continueFromSafety below) — undefined/empty if the checklist was never
  // saved (e.g. an older plant from before this existed), in which case
  // there's nothing to warn about and none is shown. Read back here, right
  // before the one genuinely irreversible action in the journey, rather
  // than only at the earlier informational screen — that's the point where
  // "was safety actually considered" matters most.
  const uncheckedSafetyLabels = (project.safetyChecklist ?? [])
    .filter((item) => !item.checked)
    .map((item) => item.label)

  // Continuing past the safety checklist no longer requires every box
  // checked (see the SAFETY_ITEMS comment above for why) — but what the
  // gardener actually checked or left unchecked is saved here, immediately,
  // as an honest record that the checklist was genuinely shown to them.
  async function continueFromSafety() {
    setSavingSafety(true)
    const safetyChecklist: SafetyChecklistEntry[] = SAFETY_ITEMS.map((item, i) => ({
      label: item.label,
      checked: checked[i],
    }))
    await updateProject(project!.id, {
      safetyChecklist,
      safetyAcknowledgedAt: new Date().toISOString(),
    })
    setSavingSafety(false)
    setPhase('planted-primary')
  }

  function choosePrimary(answer: RecentlyPlantedPrimaryAnswer) {
    const result = evaluateRecentlyPlantedPrimary(answer)
    if (result === 'needs-fallback') {
      setPhase('planted-fallback')
      return
    }
    setGateResult(result)
    setPhase('photos')
  }

  function submitFallback() {
    if (!fallbackComplete) return
    const result = evaluateRecentlyPlantedFallback(fallbackSignals as RecentlyPlantedFallbackSignals)
    setGateResult(result)
    setPhase('photos')
  }

  function beginObservations() {
    setRevealed(false)
    setShowWhy(false)
    setPendingCutConfirm(false)
    setPhase('observe')
  }

  // Gate on DecisionChoices' "Cut" button — not the whole checklist, and not
  // the other three choices, since cutting is the one irreversible action
  // here. If the gardener left something unchecked on the safety screen,
  // interrupt with a confirmation naming exactly what they weren't sure
  // about, instead of recording the cut straight away. Anything else
  // (leave / decide later / get help) or a cut with nothing unchecked
  // proceeds immediately, same as before.
  function chooseDecision(choice: Choice) {
    if (choice === 'cut' && uncheckedSafetyLabels.length > 0) {
      setPendingCutConfirm(true)
      return
    }
    recordChoice(choice)
  }

  function recordOutcome(outcome: ObservationOutcome) {
    setRecords((prev) => [
      ...prev,
      {
        id: current.id,
        feature: current.feature,
        pipProposal: current.pipProposal,
        comparisonNote: current.comparisonNote,
        outcome,
        correction: current.suggestedNote,
      },
    ])
    setPhase('decide')
  }

  function recordChoice(choice: Choice) {
    setPendingCutConfirm(false)
    const last = records[records.length - 1]
    const completed = last ? { ...last, choice } : null
    setRecords((prev) => prev.map((r, i) => (i === prev.length - 1 ? { ...r, choice } : r)))

    // Save this observation immediately, rather than waiting until the whole
    // journey is done — see addObservation's comment in store.ts for why.
    if (completed && project) {
      addObservation(project.id, completed)
    }

    if (obsIndex + 1 < allowedObservations.length) {
      setObsIndex(obsIndex + 1)
      setRevealed(false)
      setShowWhy(false)
      setPhase('observe')
    } else {
      setPhase('summary')
    }
  }

  async function finish() {
    setSaving(true)
    // Each observation was already saved as it was completed (see
    // recordChoice above) — this just marks the journey as complete. Wait
    // for it to land before navigating, since the plant page does its own
    // independent fetch and navigating too early can outrace the write.
    await updateProject(project!.id, { journeyComplete: true })
    navigate(`/plant/${project!.id}`)
  }

  const topLabel =
    phase === 'safety'
      ? 'Before we begin'
      : phase === 'planted-primary' || phase === 'planted-fallback'
        ? 'One more check before we begin'
        : phase === 'photos'
          ? 'A clear look at the rose'
          : phase === 'observe' || phase === 'decide'
            ? `Observation ${obsIndex + 1} of ${allowedObservations.length}`
            : "Sarah's summary — check it before we save"

  return (
    <div className="flex h-full flex-col">
      <AppHeader />

      {/* Pip stays near the top, right after his message. Everything below — whether
          it's a checklist, a photo, or buttons — is the gardener's turn, so it all
          lives in one natural scrolling flow instead of being split into separate panes. */}
      <div className="flex-1 overflow-y-auto px-4 pb-6 pt-2">
        <p className="text-xs font-medium uppercase tracking-wide text-pip-text-soft">{project.name}</p>
        <h1 className="font-heading mb-4 text-xl">{topLabel}</h1>

        <motion.div
          key={phase + obsIndex + String(revealed) + String(pendingCutConfirm)}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {phase === 'safety' && (
            <>
              <ChatBubble>
                We'll check a few things before you decide what to cut. You can leave, decide
                later or get experienced local help at any point.
              </ChatBubble>
              <ResponseBubble showAskField>
                <div className="flex flex-col gap-2">
                  {SAFETY_ITEMS.map((item, i) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-2 rounded-xl bg-pip-bg px-4 py-3 text-sm"
                    >
                      <button
                        onClick={() =>
                          setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)))
                        }
                        className="flex flex-1 items-center gap-3 text-left"
                      >
                        <span
                          className={cn(
                            'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2',
                            checked[i]
                              ? 'border-pip-primary bg-pip-primary text-white'
                              : 'border-pip-border',
                          )}
                        >
                          {checked[i] && <Check size={13} strokeWidth={3} />}
                        </span>
                        {item.label}
                      </button>
                      {item.help && (
                        <button
                          onClick={() => setHelpIndex(i)}
                          aria-label={`How can I tell? ${item.label}`}
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-pip-border text-xs font-semibold text-pip-text-soft"
                        >
                          ?
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="pt-3">
                  {uncheckedCount > 0 && (
                    <p className="mb-2 text-xs text-pip-text-soft">
                      Not checked yet: {SAFETY_ITEMS.filter((_, i) => !checked[i])
                        .map((item) => item.label)
                        .join('; ')}
                      . That's alright — nothing gets cut yet, and what you've told Pip here is
                      saved either way. Take your time, or continue and stay extra careful.
                    </p>
                  )}
                  <Button
                    variant={uncheckedCount > 0 ? 'secondary' : 'primary'}
                    disabled={savingSafety}
                    onClick={continueFromSafety}
                  >
                    {savingSafety
                      ? 'Saving…'
                      : uncheckedCount > 0
                        ? 'Continue anyway'
                        : 'Looks good, continue'}
                  </Button>
                </div>
              </ResponseBubble>

              {helpIndex !== null && SAFETY_ITEMS[helpIndex].help && (
                <InfoModal title="How can I tell?" onClose={() => setHelpIndex(null)}>
                  {SAFETY_ITEMS[helpIndex].help!.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className={idx > 0 ? 'mt-2.5' : undefined}>
                      {paragraph}
                    </p>
                  ))}
                </InfoModal>
              )}
            </>
          )}

          {phase === 'planted-primary' && (
            <>
              <ChatBubble>
                One more thing first — I don't want to guide you into pruning a rose that isn't
                ready for it yet.
                {project.plantedWhen && (
                  <>
                    {' '}
                    You mentioned earlier it was planted "{project.plantedWhen}" — I'd rather
                    double-check the exact answer here than go on a rough memory, since it
                    affects what's safe to do today.
                  </>
                )}{' '}
                Has this rose been growing in this spot for about three years or more?
              </ChatBubble>
              <ResponseBubble showAskField>
                <div className="flex flex-col gap-2">
                  <Button onClick={() => choosePrimary('established')}>
                    Yes, three years or more
                  </Button>
                  <Button variant="secondary" onClick={() => choosePrimary('recent')}>
                    No, it's more recent than that
                  </Button>
                  <Button variant="secondary" onClick={() => choosePrimary('unknown')}>
                    I'm not sure
                  </Button>
                </div>
              </ResponseBubble>
            </>
          )}

          {phase === 'planted-fallback' && (
            <>
              <ChatBubble>
                That's alright — plenty of gardeners aren't sure. Let's check three signs
                together, since I'd rather be careful than guess.
              </ChatBubble>
              <ResponseBubble showAskField>
                <div className="flex flex-col gap-3">
                  {FALLBACK_QUESTIONS.map((q) => (
                    <div key={q.key} className="rounded-xl bg-pip-bg px-4 py-3">
                      <p className="mb-2 text-sm">{q.label}</p>
                      <div className="flex gap-2">
                        <Button
                          className="flex-1"
                          variant={fallbackSignals[q.key] === true ? 'primary' : 'secondary'}
                          onClick={() => setFallbackSignals((s) => ({ ...s, [q.key]: true }))}
                        >
                          Yes
                        </Button>
                        <Button
                          className="flex-1"
                          variant={fallbackSignals[q.key] === false ? 'primary' : 'secondary'}
                          onClick={() => setFallbackSignals((s) => ({ ...s, [q.key]: false }))}
                        >
                          No
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-3">
                  <Button disabled={!fallbackComplete} onClick={submitFallback}>
                    Continue
                  </Button>
                </div>
              </ResponseBubble>
            </>
          )}

          {phase === 'photos' && (
            <>
              {/* One Pip, one bubble — the restricted-gate reason (when there is
                  one) leads into the same message rather than getting its own
                  separate ChatBubble, which would render a second Pip avatar
                  stacked above this one. */}
              <ChatBubble>
                {gateResult && gateResult.status === 'restricted' && <>{gateResult.reason} </>}
                Take a clear overview from base to tips, then a few close-ups of where stems
                cross or look uncertain.
              </ChatBubble>
              <ResponseBubble showAskField>
                {/* journey-overview / the close-up gallery below, not the plain
                    'overview' slot — a pruning journey can start years after a
                    plant was added (see the recently-planted gate above), so its
                    onboarding cover photo may no longer show what the plant
                    actually looks like. Both are always captured fresh for this
                    journey rather than pre-filled from it. */}
                <p className="mb-1.5 text-xs font-medium text-pip-text-soft">Overview</p>
                <div className="mb-4 w-1/2">
                  <PhotoUpload
                    label="Overview"
                    profileId={project.id}
                    slot="journey-overview"
                    path={project.journeyOverviewPhotoPath}
                    onChange={(path) => updateProject(project.id, { journeyOverviewPhotoPath: path })}
                    className="aspect-square"
                  />
                </div>
                <p className="mb-1.5 text-xs font-medium text-pip-text-soft">Close-ups</p>
                <div className="mb-3">
                  <JourneyCloseUps
                    paths={project.journeyCloseUpPhotoPaths}
                    onAdd={(file) => addJourneyCloseUpPhoto(project.id, project.journeyCloseUpPhotoPaths, file)}
                    onRemove={(path) => removeJourneyCloseUpPhoto(project.id, project.journeyCloseUpPhotoPaths, path)}
                  />
                </div>
                {(!project.journeyOverviewPhotoPath || project.journeyCloseUpPhotoPaths.length === 0) && (
                  <p className="mb-2 text-xs text-pip-text-soft">
                    Add an overview and at least one close-up to continue — they'll stay in{' '}
                    {project.name}'s journal afterwards, alongside what you decide.
                  </p>
                )}
                <Button
                  disabled={!project.journeyOverviewPhotoPath || project.journeyCloseUpPhotoPaths.length === 0}
                  onClick={beginObservations}
                >
                  Photos look good
                </Button>
              </ResponseBubble>
            </>
          )}

          {phase === 'observe' && current && !revealed && (
            <>
              <ChatBubble>
                {current.pipProposal} Would you like me to show you what I'm seeing?
              </ChatBubble>
              <ResponseBubble showAskField>
                {showWhy && (
                  <p className="mb-3 rounded-xl bg-pip-secondary/60 px-3.5 py-2.5 text-xs text-pip-text-soft">
                    {current.comparisonNote}
                  </p>
                )}
                <div className="flex gap-3">
                  <Button className="flex-1" onClick={() => setRevealed(true)}>
                    Show Me
                  </Button>
                  <Button className="flex-1" variant="secondary" onClick={() => setShowWhy(true)}>
                    Why?
                  </Button>
                </div>
              </ResponseBubble>
            </>
          )}

          {phase === 'observe' && current && revealed && (
            <>
              <ChatBubble>{current.pipProposal}</ChatBubble>
              <ResponseBubble showAskField>
                <PhotoPlaceholder label={current.feature} className="mb-3 aspect-video" />
                <p className="mb-3 rounded-xl bg-pip-secondary/60 px-3.5 py-2.5 text-xs text-pip-text-soft">
                  {current.comparisonNote}
                </p>
                <p className="mb-3 text-sm font-medium">Check the actual rose. What do you see?</p>
                <div className="flex flex-col gap-2">
                  <Button onClick={() => recordOutcome('confirmed')}>Yes, I can see that</Button>
                  <Button variant="secondary" onClick={() => recordOutcome('corrected')}>
                    Not quite — it looks different
                  </Button>
                  <Button variant="secondary" onClick={() => recordOutcome('unresolved')}>
                    I can't tell
                  </Button>
                </div>
              </ResponseBubble>
            </>
          )}

          {phase === 'decide' && current && !pendingCutConfirm && (
            <>
              <ChatBubble>
                Based on what you confirmed, here are the choices for this observation.
              </ChatBubble>
              <ResponseBubble showAskField>
                <DecisionChoices onChoose={chooseDecision} />
              </ResponseBubble>
            </>
          )}

          {phase === 'decide' && current && pendingCutConfirm && (
            <>
              <ChatBubble>
                Before you cut — earlier, on the safety check, you told me you weren't sure
                about: {uncheckedSafetyLabels.join('; ')}. Cutting live wood you're not
                confident about can genuinely harm the rose, so it's worth pausing on this one.
                Are you sure you want to go ahead?
              </ChatBubble>
              <ResponseBubble showAskField>
                <div className="flex flex-col gap-2">
                  <Button onClick={() => recordChoice('cut')}>
                    Yes, I'm confident — I'll go ahead and cut
                  </Button>
                  <Button variant="secondary" onClick={() => setPendingCutConfirm(false)}>
                    Let me choose again
                  </Button>
                </div>
              </ResponseBubble>
            </>
          )}

          {phase === 'summary' && (
            <>
              <ChatBubble>
                Here's what we looked at together. Correct anything before it becomes part of{' '}
                {project.name}'s history.
              </ChatBubble>
              <ResponseBubble showAskField>
                <div className="mb-3 flex flex-col gap-2.5">
                  {records.map((r) => (
                    <div key={r.id} className="rounded-xl bg-pip-bg p-3.5">
                      <p className="text-sm font-medium">{r.feature}</p>
                      <p className="mt-0.5 text-xs text-pip-text-soft">{r.correction}</p>
                      <p className="mt-1.5 text-xs font-medium capitalize text-pip-primary">
                        {r.choice?.replace('-', ' ') ?? 'No decision recorded'}
                      </p>
                    </div>
                  ))}
                </div>
                <Button disabled={saving} onClick={finish}>
                  {saving ? 'Saving…' : `Save to ${project.name}'s journal`}
                </Button>
              </ResponseBubble>
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}

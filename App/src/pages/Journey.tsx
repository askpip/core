import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AppHeader } from '@/components/AppHeader'
import { ChatBubble } from '@/components/ChatBubble'
import { ResponseBubble } from '@/components/ResponseBubble'
import { Button } from '@/components/Button'
import { PhotoUpload } from '@/components/PhotoUpload'
import { JourneyCloseUps } from '@/components/JourneyCloseUps'
import { DecisionChoices } from '@/components/DecisionChoices'
import { InfoModal } from '@/components/InfoModal'
import { useProjects } from '@/lib/store'
import { usePlantPhotoUrl } from '@/lib/photos'
import { askPipAboutDeadWood } from '@/lib/pipObserve'
import { CONFIDENCE_EXPLANATIONS } from '@/data/confidenceDefinitions'
import {
  ADVISORY_EVERY_N_CUTS,
  CARE_DISCLOSURE,
  DORMANCY_GATE,
  MAKING_THE_CUT,
  ROSE_TYPE_GATE,
  SUCKER_REMOVAL,
  SUCKER_STEPS,
  publishedCare,
  sourcesFor,
  type CareGuidance,
  type DecisionOption,
  type ObservationDef,
  type RoseTypeAnswerId,
  type Statement,
} from '@/data/pkr'
import {
  evaluateDormancy,
  evaluateRecentlyPlantedFallback,
  evaluateRecentlyPlantedPrimary,
  evaluateRoseType,
  sessionObservations,
} from '@/lib/suitabilityGates'
import type {
  DormancyAnswer,
  RecentlyPlantedFallbackSignals,
  RecentlyPlantedGateResult,
  RecentlyPlantedPrimaryAnswer,
} from '@/lib/suitabilityGates'
import type { Choice, ObservationOutcome, ObservationRecord, SafetyChecklistEntry } from '@/lib/types'

/*
 * The guided pruning journey. All gardener-facing horticultural wording comes
 * from Published PKRs via data/pkr.ts; this file only routes between them.
 *
 * Order: safety checklist → rose type (PKR-SGT-000003) → recently planted
 * (PKR-SGT-000002) → dormancy (PKR-SGT-000001 v1.1) → photos → each allowed
 * observation, looped until the gardener says there are no more → basic care
 * when a gate limited the session → summary.
 *
 * PKR Standard §5.1: "Doesn't match" and "Not sure" never reach Cut. The only
 * Doesn't-match route to a decision is the framework's defined old-wood path
 * (PKR-OBS-000006), which is its own decision, not the confirmed one.
 */

interface SafetyItem {
  label: string
  help?: string
}

// The dormancy item that used to live here as a self-attested checkbox is now
// the interactive PKR-SGT-000001 step below. The recently-planted item became
// PKR-SGT-000002's own step earlier. The rest remain plain self-attestation.
const SAFETY_ITEMS: SafetyItem[] = [
  {
    label: 'No serious stress, damage or disease',
    help: "Pip doesn't have specific guidance yet for spotting stress, damage or disease — that research hasn't been done. If you're at all unsure, the honest choice is to leave this box unchecked. That won't stop you continuing, but it's worth taking the extra care that implies, and considering asking an experienced local gardener to take a look with you before you actually cut anything.",
  },
  { label: 'Secateurs are clean and sharp' },
  { label: 'Gloves and eye protection are ready' },
  { label: 'The rose is safely accessible' },
]

const FALLBACK_QUESTIONS: { key: keyof RecentlyPlantedFallbackSignals; label: string }[] = [
  { key: 'activeNewGrowth', label: 'Is it putting out active new growth right now?' },
  { key: 'caneCountAboveBaseline', label: 'Does it have noticeably more canes than a newly bought rose (more than about 3)?' },
  { key: 'baseFeelsFirm', label: 'Does the base feel firmly rooted when you gently test it?' },
]

type Phase =
  | 'safety'
  | 'rose-type'
  | 'rose-finder'
  | 'journal-only'
  | 'planted-primary'
  | 'planted-fallback'
  | 'dormancy'
  | 'dormancy-not-sure'
  | 'removal-intro'
  | 'photos'
  | 'observe'
  | 'decide'
  | 'tools'
  | 'cut-guide'
  | 'advisory'
  | 'any-more'
  | 'care'
  | 'summary'

/** Steps within one observation instance. */
type ObsStep = 'look' | 'confirm' | 'not-sure' | 'sucker-union' | 'sucker-no-union'

/** Which decision is on screen: after Confirmed, after the framework's old-wood Doesn't match, or after a final Not sure. */
type DecidePath = 'confirmed' | 'doesnt-match' | 'not-sure'

interface Snapshot {
  phase: Phase
  obsIndex: number
  obsStep: ObsStep
  decidePath: DecidePath
}

function ConfidenceTag({ level }: { level?: Statement['confidence'] }) {
  if (!level) return null
  return (
    <span className="ml-1.5 whitespace-nowrap rounded-full bg-pip-secondary px-2 py-0.5 text-[10px] font-medium text-pip-text-soft">
      {level === 'Approved default' ? 'approved default' : `${level} confidence`}
    </span>
  )
}

function StatementList({ items }: { items: Statement[] }) {
  return (
    <ul className="flex flex-col gap-1.5">
      {items.map((s) => (
        <li key={s.text} className="rounded-xl bg-pip-bg px-3.5 py-2.5 text-xs leading-relaxed">
          {s.text}
          <ConfidenceTag level={s.confidence} />
        </li>
      ))}
    </ul>
  )
}

function CareBlock({ care }: { care: CareGuidance }) {
  return (
    <div className="mb-3">
      <p className="mb-1 text-sm font-medium">{care.heading}</p>
      {care.label && <p className="mb-1.5 text-xs italic text-pip-text-soft">{care.label}</p>}
      <StatementList items={care.items} />
    </div>
  )
}

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
  const [roseType, setRoseType] = useState<RoseTypeAnswerId | null>(null)
  const [fallbackSignals, setFallbackSignals] = useState<Partial<RecentlyPlantedFallbackSignals>>({})
  const [gateResult, setGateResult] = useState<RecentlyPlantedGateResult | null>(null)
  const [dormancyAnswer, setDormancyAnswer] = useState<DormancyAnswer | null>(null)
  const [showDormancyHelp, setShowDormancyHelp] = useState(false)
  const [obsIndex, setObsIndex] = useState(0)
  const [obsStep, setObsStep] = useState<ObsStep>('look')
  const [decidePath, setDecidePath] = useState<DecidePath>('confirmed')
  const [records, setRecords] = useState<ObservationRecord[]>([])
  const [pendingOutcome, setPendingOutcome] = useState<ObservationOutcome>('confirmed')
  const [pendingChoice, setPendingChoice] = useState<DecisionOption | null>(null)
  const [lastNote, setLastNote] = useState<string | null>(null)
  const [cutsThisSession, setCutsThisSession] = useState(0)
  const [toolsShown, setToolsShown] = useState(false)
  const [saving, setSaving] = useState(false)
  const [pendingTraceConfirm, setPendingTraceConfirm] = useState(false)
  const [pendingCutConfirm, setPendingCutConfirm] = useState(false)
  const [pendingHelpInfo, setPendingHelpInfo] = useState(false)
  const [showConfidenceInfo, setShowConfidenceInfo] = useState(false)
  const [showSourcesInfo, setShowSourcesInfo] = useState(false)
  const [aiRequested, setAiRequested] = useState(false)
  const [aiAnswer, setAiAnswer] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiFailed, setAiFailed] = useState(false)
  const [history, setHistory] = useState<Snapshot[]>([])

  const uncheckedCount = checked.filter((v) => !v).length
  const fallbackComplete = FALLBACK_QUESTIONS.every((q) => fallbackSignals[q.key] !== undefined)
  const recentlyPlantedRestricted = gateResult?.status === 'restricted'
  const dormancyPassed = dormancyAnswer ? evaluateDormancy(dormancyAnswer) === 'passes' : true
  const limitedSession = recentlyPlantedRestricted || !dormancyPassed
  const allowed = sessionObservations({ recentlyPlantedRestricted, dormancyPassed })
  const current: ObservationDef | undefined = allowed[obsIndex]
  const removalOnly = !dormancyPassed

  // Pip's live look (Edge Function pip-observe-dead-wood) exists only for
  // dead wood, the one observation with the per-signal content it was built
  // from (PKR-OBS-000001). It never blocks the journey.
  const deadWoodPhotoPath = project?.journeyCloseUpPhotoPaths?.[0] ?? project?.journeyOverviewPhotoPath
  const deadWoodPhotoUrl = usePlantPhotoUrl(
    phase === 'observe' && current?.key === 'dead-wood' ? deadWoodPhotoPath : undefined,
  )

  useEffect(() => {
    if (phase !== 'observe' || !aiRequested || current?.key !== 'dead-wood' || !deadWoodPhotoPath) return
    if (aiAnswer || aiLoading) return
    let cancelled = false
    setAiLoading(true)
    setAiFailed(false)
    askPipAboutDeadWood(deadWoodPhotoPath)
      .then((answer) => {
        if (!cancelled) setAiAnswer(answer)
      })
      .catch((err) => {
        console.error('Pip live assessment failed:', err)
        if (!cancelled) setAiFailed(true)
      })
      .finally(() => {
        if (!cancelled) setAiLoading(false)
      })
    return () => {
      cancelled = true
    }
    // See the note in git history: aiAnswer/aiLoading are guards only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, aiRequested, current?.key, deadWoodPhotoPath])

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

  const uncheckedSafetyLabels = (project.safetyChecklist ?? []).filter((item) => !item.checked).map((item) => item.label)

  function resetTransient() {
    setPendingTraceConfirm(false)
    setPendingCutConfirm(false)
    setPendingHelpInfo(false)
    setShowConfidenceInfo(false)
    setShowSourcesInfo(false)
    setAiRequested(false)
    setAiAnswer(null)
    setAiLoading(false)
    setAiFailed(false)
  }

  function go(next: Phase, patch?: Partial<Omit<Snapshot, 'phase'>>) {
    setHistory((prev) => [...prev, { phase, obsIndex, obsStep, decidePath }])
    resetTransient()
    if (patch?.obsIndex !== undefined) setObsIndex(patch.obsIndex)
    if (patch?.obsStep !== undefined) setObsStep(patch.obsStep)
    if (patch?.decidePath !== undefined) setDecidePath(patch.decidePath)
    setPhase(next)
  }

  function goBack() {
    if (history.length === 0) {
      navigate('/library')
      return
    }
    const last = history[history.length - 1]
    setHistory((prev) => prev.slice(0, -1))
    resetTransient()
    setPhase(last.phase)
    setObsIndex(last.obsIndex)
    setObsStep(last.obsStep)
    setDecidePath(last.decidePath)
  }

  // --- Gates -------------------------------------------------------------

  async function continueFromSafety() {
    setSavingSafety(true)
    const safetyChecklist: SafetyChecklistEntry[] = SAFETY_ITEMS.map((item, i) => ({ label: item.label, checked: checked[i] }))
    await updateProject(project!.id, { safetyChecklist, safetyAcknowledgedAt: new Date().toISOString() })
    setSavingSafety(false)
    go('rose-type')
  }

  function chooseRoseType(answer: RoseTypeAnswerId) {
    setRoseType(answer)
    const result = evaluateRoseType(answer)
    go(result === 'passes' ? 'planted-primary' : result === 'rose-finder' ? 'rose-finder' : 'journal-only')
  }

  function choosePrimary(answer: RecentlyPlantedPrimaryAnswer) {
    const result = evaluateRecentlyPlantedPrimary(answer)
    if (result === 'needs-fallback') {
      go('planted-fallback')
      return
    }
    setGateResult(result)
    go('dormancy')
  }

  function submitFallback() {
    if (!fallbackComplete) return
    setGateResult(evaluateRecentlyPlantedFallback(fallbackSignals as RecentlyPlantedFallbackSignals))
    go('dormancy')
  }

  function chooseDormancy(answer: DormancyAnswer) {
    setDormancyAnswer(answer)
    go(evaluateDormancy(answer) === 'passes' ? 'photos' : 'removal-intro')
  }

  // --- Observations ------------------------------------------------------

  // Resume: an observation is finished only when its explicit
  // 'none-remaining' marker was saved (several instances per observation
  // are normal, so matching on feature alone can't tell).
  function beginObservations() {
    const finished = new Set(project!.observations.filter((o) => o.outcome === 'none-remaining').map((o) => o.feature))
    const resumeIndex = allowed.findIndex((o) => !finished.has(o.feature))
    setRecords(
      project!.observations.filter(
        (o) => o.outcome !== 'none-remaining' && allowed.some((a) => a.feature === o.feature),
      ),
    )
    if (resumeIndex === -1) {
      go(limitedSession ? 'care' : 'summary', { obsIndex: allowed.length })
    } else {
      go('observe', { obsIndex: resumeIndex, obsStep: 'look' })
    }
  }

  function makeRecord(outcome: ObservationOutcome, choice?: Choice, note?: string): ObservationRecord {
    return {
      id: `${current!.key}-${Date.now()}`,
      feature: current!.feature,
      pipProposal: current!.lookFor,
      comparisonNote: `${current!.obs.id} v${current!.obs.version}; ${current!.dec.id} v${current!.dec.version}`,
      outcome,
      correction: note,
      choice,
    }
  }

  function saveRecord(r: ObservationRecord) {
    setRecords((prev) => [...prev, r])
    addObservation(project!.id, r)
  }

  /** Gardener says this observation isn't present (or no more of it): save the marker and move on. */
  function finishObservation() {
    addObservation(project!.id, makeRecord('none-remaining'))
    const next = obsIndex + 1
    if (next < allowed.length) {
      setLastNote(null)
      go('observe', { obsIndex: next, obsStep: 'look' })
    } else {
      go(limitedSession ? 'care' : 'summary', { obsIndex: next })
    }
  }

  function confirmOutcome(outcome: 'confirmed' | 'corrected') {
    if (outcome === 'confirmed') {
      setPendingOutcome('confirmed')
      go('decide', { decidePath: 'confirmed' })
      return
    }
    if (current!.doesntMatchRoute === 'decide') {
      setPendingOutcome('corrected')
      go('decide', { decidePath: 'doesnt-match' })
      return
    }
    // Not present: recorded, never reaches a decision.
    saveRecord(makeRecord('corrected', undefined, current!.doesntMatchNote))
    setLastNote(current!.doesntMatchNote ?? null)
    go('any-more')
  }

  function stillNotSure() {
    setPendingOutcome('unresolved')
    go('decide', { decidePath: 'not-sure' })
  }

  // --- Decisions ---------------------------------------------------------

  const decisionOptions: DecisionOption[] =
    !current
      ? []
      : decidePath === 'confirmed'
        ? current.choices
        : decidePath === 'doesnt-match'
          ? (current.doesntMatchChoices ?? [])
          : current.notSureChoices

  function chooseDecision(choice: Choice) {
    const option = decisionOptions.find((o) => o.choice === choice) ?? null
    // §5.1 guard: Cut is only reachable from a Confirmed (or defined old-wood) path.
    if (choice === 'cut' && decidePath === 'not-sure') return
    setPendingChoice(option)
    if (choice === 'cut') {
      if (current!.cutCareGuidance && !toolsShown) {
        go('tools')
        return
      }
      setPendingTraceConfirm(true)
      return
    }
    if (choice === 'get-help') {
      setPendingHelpInfo(true)
      return
    }
    recordChoice(choice)
  }

  function afterTools() {
    setToolsShown(true)
    goBackToDecideWithTrace()
  }

  function goBackToDecideWithTrace() {
    setHistory((prev) => [...prev, { phase, obsIndex, obsStep, decidePath }])
    setPhase('decide')
    setPendingTraceConfirm(true)
  }

  function confirmTraced() {
    setPendingTraceConfirm(false)
    if (uncheckedSafetyLabels.length > 0) {
      setPendingCutConfirm(true)
      return
    }
    go('cut-guide')
  }

  function recordChoice(choice: Choice) {
    saveRecord(makeRecord(pendingOutcome, choice))
    setLastNote(null)
    const countsForAdvisory = choice === 'cut' && current!.cutCareGuidance
    const cuts = countsForAdvisory ? cutsThisSession + 1 : cutsThisSession
    if (countsForAdvisory) setCutsThisSession(cuts)
    if (countsForAdvisory && cuts % ADVISORY_EVERY_N_CUTS === 0) {
      go('advisory')
    } else {
      go('any-more')
    }
  }

  function anotherOne() {
    go('observe', { obsStep: current?.key === 'rootstock-sucker' ? 'sucker-union' : 'confirm' })
  }

  async function finish() {
    setSaving(true)
    await updateProject(project!.id, { journeyComplete: true })
    navigate(`/plant/${project!.id}`)
  }

  // --- Rendering helpers -------------------------------------------------

  const cutGuide: Statement[] = (() => {
    if (!pendingChoice?.cutKind) return []
    switch (pendingChoice.cutKind) {
      case 'sucker':
        return SUCKER_REMOVAL
      case 'dead-wood':
        // PKR-CGD-000002 Presentation Points: for dead wood, PKR-DEC-000001's own
        // rule decides where the cut goes; only Part A's "no stubs" and Part C apply.
        return [...(current?.decisionNotes ?? []).slice(0, 2), { text: "Don't leave a stub.", confidence: 'Moderate' }, MAKING_THE_CUT.seal]
      case 'shorten':
        return [...MAKING_THE_CUT.shorten, MAKING_THE_CUT.seal]
      default:
        return [...MAKING_THE_CUT.removeStem, MAKING_THE_CUT.seal]
    }
  })()

  const careRecords = [
    recentlyPlantedRestricted ? publishedCare('PKR-CGD-000005') : undefined,
    publishedCare('PKR-CGD-000004'),
    publishedCare('PKR-CGD-000006'),
  ].filter((c): c is CareGuidance => Boolean(c))

  const summaryGroups = allowed
    .map((o) => ({ obs: o, items: records.filter((r) => r.feature === o.feature) }))
    .filter((g) => g.items.length > 0)

  const outcomeLabel = (o: ObservationOutcome) =>
    o === 'confirmed' ? 'Confirmed' : o === 'corrected' ? "Doesn't match" : o === 'unresolved' ? 'Not sure' : ''

  const topLabel =
    phase === 'safety'
      ? 'Before we begin'
      : ['rose-type', 'rose-finder', 'journal-only', 'planted-primary', 'planted-fallback', 'dormancy', 'dormancy-not-sure', 'removal-intro'].includes(phase)
        ? 'A few checks before we begin'
        : phase === 'photos'
          ? 'A clear look at the rose'
          : phase === 'care'
            ? 'Caring for your rose'
            : phase === 'summary'
              ? 'Your summary — check it before we save'
              : current
                ? `${current.feature} (${obsIndex + 1} of ${allowed.length})`
                : ''

  const roseName = roseType === 'hybrid-tea' ? 'Hybrid Tea' : roseType === 'floribunda' ? 'Floribunda' : roseType === 'grandiflora' ? 'Grandiflora' : 'rose'

  return (
    <div className="flex h-full flex-col">
      <AppHeader onBack={goBack} />

      <div className="flex-1 overflow-y-auto px-4 pb-6 pt-2">
        <p className="text-xs font-medium uppercase tracking-wide text-pip-text-soft">{project.name}</p>
        <h1 className="font-heading mb-4 text-xl">{topLabel}</h1>

        <motion.div
          key={phase + obsIndex + obsStep + decidePath + String(pendingCutConfirm) + String(pendingHelpInfo) + String(pendingTraceConfirm)}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {phase === 'safety' && (
            <>
              <ChatBubble>
                We'll check a few things before you decide what to cut. You can leave, decide later or get experienced local
                help at any point.
              </ChatBubble>
              <ResponseBubble showAskField>
                <div className="flex flex-col gap-2">
                  {SAFETY_ITEMS.map((item, i) => (
                    <div key={item.label} className="flex items-center gap-2 rounded-xl bg-pip-bg px-4 py-3 text-sm">
                      <button
                        onClick={() => setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)))}
                        className="flex flex-1 items-center gap-3 text-left"
                      >
                        <span
                          className={cn(
                            'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2',
                            checked[i] ? 'border-pip-primary bg-pip-primary text-white' : 'border-pip-border',
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
                      Not checked yet: {SAFETY_ITEMS.filter((_, i) => !checked[i]).map((item) => item.label).join('; ')}. That's
                      alright — nothing gets cut yet, and what you've told Pip here is saved either way.
                    </p>
                  )}
                  <Button variant={uncheckedCount > 0 ? 'secondary' : 'primary'} disabled={savingSafety} onClick={continueFromSafety}>
                    {savingSafety ? 'Saving…' : uncheckedCount > 0 ? 'Continue anyway' : 'Looks good, continue'}
                  </Button>
                </div>
              </ResponseBubble>
              {helpIndex !== null && SAFETY_ITEMS[helpIndex].help && (
                <InfoModal title="How can I tell?" onClose={() => setHelpIndex(null)}>
                  <p>{SAFETY_ITEMS[helpIndex].help}</p>
                </InfoModal>
              )}
            </>
          )}

          {phase === 'rose-type' && (
            <>
              <ChatBubble>{ROSE_TYPE_GATE.question}</ChatBubble>
              <ResponseBubble showAskField>
                <div className="flex flex-col gap-2">
                  {ROSE_TYPE_GATE.answers.map((a) => (
                    <Button key={a.id} variant={a.passes ? 'primary' : 'secondary'} onClick={() => chooseRoseType(a.id)}>
                      {a.label}
                    </Button>
                  ))}
                </div>
              </ResponseBubble>
            </>
          )}

          {phase === 'rose-finder' && (
            <>
              <ChatBubble>{ROSE_TYPE_GATE.roseFinder.text}</ChatBubble>
              <ResponseBubble showAskField>
                {ROSE_TYPE_GATE.roseFinder.url && (
                  <a
                    href={ROSE_TYPE_GATE.roseFinder.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mb-3 block text-sm font-medium text-pip-primary underline underline-offset-2"
                  >
                    Open the New Zealand Rose Society's Rose Finder
                  </a>
                )}
                <div className="flex flex-col gap-2">
                  <Button onClick={() => go('rose-type')}>I've found its type — answer again</Button>
                  <Button variant="secondary" onClick={() => chooseRoseType('unknown')}>
                    I couldn't find it
                  </Button>
                </div>
              </ResponseBubble>
            </>
          )}

          {phase === 'journal-only' && (
            <>
              <ChatBubble>
                {ROSE_TYPE_GATE.journalOnly.base}{' '}
                {roseType === 'excluded'
                  ? ROSE_TYPE_GATE.journalOnly.excluded
                  : roseType === 'bush-only'
                    ? ROSE_TYPE_GATE.journalOnly.bushOnly
                    : ROSE_TYPE_GATE.journalOnly.unknown}
              </ChatBubble>
              <ResponseBubble>
                <p className="mb-2 text-sm">{ROSE_TYPE_GATE.journalOnly.keep}</p>
                <p className="mb-3 text-xs text-pip-text-soft">{ROSE_TYPE_GATE.journalOnly.help}</p>
                <div className="flex flex-col gap-2">
                  <Button onClick={() => navigate(`/plant/${project.id}`)}>Back to {project.name}'s journal</Button>
                  <Button variant="secondary" onClick={() => go('rose-type')}>
                    Answer the type question again
                  </Button>
                </div>
              </ResponseBubble>
            </>
          )}

          {phase === 'planted-primary' && (
            <>
              <ChatBubble>
                {roseType === 'grandiflora' && <>{ROSE_TYPE_GATE.grandifloraNote} </>}
                I don't want to guide you into pruning a rose that isn't ready for it yet.
                {project.plantedWhen && <> You mentioned it was planted "{project.plantedWhen}" — I'd rather double-check.</>}{' '}
                Has your {roseName} been growing in this spot for about three years or more?
              </ChatBubble>
              <ResponseBubble showAskField>
                <div className="flex flex-col gap-2">
                  <Button onClick={() => choosePrimary('established')}>Yes, three years or more</Button>
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
              <ChatBubble>That's alright — plenty of gardeners aren't sure. Let's check three signs together.</ChatBubble>
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

          {phase === 'dormancy' && (
            <>
              <ChatBubble>
                {gateResult?.status === 'restricted' && <>{gateResult.reason} </>}
                {DORMANCY_GATE.question}
              </ChatBubble>
              <ResponseBubble showAskField>
                <div className="flex flex-col gap-2">
                  <Button onClick={() => chooseDormancy('dormant')}>{DORMANCY_GATE.answers.dormant}</Button>
                  <Button variant="secondary" onClick={() => chooseDormancy('growing')}>
                    {DORMANCY_GATE.answers.growing}
                  </Button>
                  <Button variant="secondary" onClick={() => go('dormancy-not-sure')}>
                    {DORMANCY_GATE.answers.notSure}
                  </Button>
                </div>
                <button
                  onClick={() => setShowDormancyHelp(true)}
                  className="mt-3 text-xs font-medium text-pip-primary underline underline-offset-2"
                >
                  My winters are mild — how do I judge this?
                </button>
              </ResponseBubble>
              {showDormancyHelp && (
                <InfoModal title="Mild climates" onClose={() => setShowDormancyHelp(false)}>
                  <p>{DORMANCY_GATE.caveat}</p>
                </InfoModal>
              )}
            </>
          )}

          {phase === 'dormancy-not-sure' && (
            <>
              <ChatBubble>{DORMANCY_GATE.notSureFallback}</ChatBubble>
              <ResponseBubble showAskField>
                <div className="flex flex-col gap-2">
                  <Button onClick={() => chooseDormancy('dormant')}>The buds are still tight and closed</Button>
                  <Button variant="secondary" onClick={() => chooseDormancy('growing')}>
                    Some have swollen or opened
                  </Button>
                  <Button variant="secondary" onClick={() => chooseDormancy('not-sure')}>
                    I'm still not sure
                  </Button>
                </div>
              </ResponseBubble>
            </>
          )}

          {phase === 'removal-intro' && (
            <>
              <ChatBubble>
                {dormancyAnswer === 'not-sure' ? DORMANCY_GATE.removalOnly.notSureIntro : DORMANCY_GATE.removalOnly.intro.text}
              </ChatBubble>
              <ResponseBubble showAskField>
                <p className="mb-2 text-sm font-medium">If you remove anything today:</p>
                <StatementList items={DORMANCY_GATE.removalOnly.conditions} />
                <p className="mt-3 rounded-xl bg-pip-secondary/60 px-3.5 py-2.5 text-xs text-pip-text-soft">
                  {DORMANCY_GATE.removalOnly.lateSeason.text}
                  <ConfidenceTag level={DORMANCY_GATE.removalOnly.lateSeason.confidence} />
                </p>
                <div className="flex flex-col gap-2 pt-3">
                  <Button onClick={() => go('photos')}>Look for dead, damaged or diseased wood</Button>
                  <Button variant="secondary" onClick={() => go('care', { obsIndex: allowed.length })}>
                    Skip to care tips
                  </Button>
                </div>
              </ResponseBubble>
            </>
          )}

          {phase === 'photos' && (
            <>
              <ChatBubble>
                Take a clear overview from base to tips, then a few close-ups of anything that looks uncertain.
              </ChatBubble>
              <ResponseBubble showAskField>
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
                <Button
                  disabled={!project.journeyOverviewPhotoPath || project.journeyCloseUpPhotoPaths.length === 0}
                  onClick={beginObservations}
                >
                  Photos look good
                </Button>
              </ResponseBubble>
            </>
          )}

          {phase === 'observe' && current && obsStep === 'look' && (
            <>
              <ChatBubble>{current.key === 'dead-wood' && aiAnswer ? aiAnswer : current.lookFor}</ChatBubble>
              <ResponseBubble showAskField>
                {current.key === 'dead-wood' && deadWoodPhotoUrl && (
                  <img src={deadWoodPhotoUrl} alt={current.feature} className="mb-3 aspect-video w-full rounded-2xl object-cover" />
                )}
                {current.key === 'dead-wood' && !aiRequested && deadWoodPhotoPath && (
                  <Button variant="secondary" className="mb-3" onClick={() => setAiRequested(true)}>
                    Ask Pip to look at my photo
                  </Button>
                )}
                {aiLoading && <p className="mb-3 text-xs text-pip-text-soft">Pip is looking at your photo…</p>}
                {aiFailed && (
                  <p className="mb-3 text-xs text-pip-text-soft">Pip's live look isn't available right now, so here's the general guidance.</p>
                )}
                <p className="mb-1.5 text-sm font-medium">What to look for</p>
                <StatementList items={current.criteria} />
                <p className="mt-3 rounded-xl bg-pip-secondary/60 px-3.5 py-2.5 text-xs text-pip-text-soft">{current.photoLimit}</p>
                <p className="mt-2 text-xs text-pip-text-soft">No comparison images yet — they'll be added later.</p>
                <div className="mb-3 mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
                  <button onClick={() => setShowConfidenceInfo(true)} className="font-medium text-pip-primary underline underline-offset-2">
                    What do the confidence levels mean?
                  </button>
                  <button onClick={() => setShowSourcesInfo(true)} className="font-medium text-pip-primary underline underline-offset-2">
                    Where this comes from
                  </button>
                </div>
                {current.key === 'rootstock-sucker' ? (
                  <>
                    <p className="mb-3 text-sm font-medium">{SUCKER_STEPS.hasShoot}</p>
                    <div className="flex flex-col gap-2">
                      <Button onClick={() => go('observe', { obsStep: 'sucker-union' })}>Yes, there's a shoot</Button>
                      <Button variant="secondary" onClick={finishObservation}>
                        No
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button onClick={() => go('observe', { obsStep: 'confirm' })}>I've found one to check</Button>
                    <Button variant="secondary" onClick={finishObservation}>
                      I can't see any
                    </Button>
                  </div>
                )}
              </ResponseBubble>
            </>
          )}

          {phase === 'observe' && current && obsStep === 'sucker-union' && (
            <>
              <ChatBubble>{SUCKER_STEPS.unionVisible}</ChatBubble>
              <ResponseBubble showAskField>
                <p className="mb-3 text-xs text-pip-text-soft">{SUCKER_STEPS.ownRoot}</p>
                <div className="flex flex-col gap-2">
                  <Button onClick={() => go('observe', { obsStep: 'confirm' })}>Yes, I can see it</Button>
                  <Button variant="secondary" onClick={() => go('observe', { obsStep: 'sucker-no-union' })}>
                    No, I can't see it
                  </Button>
                </div>
              </ResponseBubble>
            </>
          )}

          {phase === 'observe' && current && obsStep === 'sucker-no-union' && (
            <>
              <ChatBubble>{SUCKER_STEPS.noUnion}</ChatBubble>
              <ResponseBubble showAskField>
                <div className="flex flex-col gap-2">
                  <Button onClick={() => go('observe', { obsStep: 'confirm' })}>I cleared some soil and can see it now</Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      saveRecord(makeRecord('unresolved', 'leave', 'No bud union visible: not treated as a sucker.'))
                      go('any-more')
                    }}
                  >
                    Leave the shoot
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setPendingOutcome('unresolved')
                      go('decide', { decidePath: 'not-sure' })
                    }}
                  >
                    Other choices
                  </Button>
                </div>
              </ResponseBubble>
            </>
          )}

          {phase === 'observe' && current && obsStep === 'confirm' && (
            <>
              <ChatBubble>{current.confirmQuestion}</ChatBubble>
              <ResponseBubble showAskField>
                {current.key === 'rootstock-sucker' && removalOnly && (
                  <p className="mb-3 rounded-xl bg-pip-bg px-3.5 py-2.5 text-xs text-pip-text-soft">{SUCKER_STEPS.supporting}</p>
                )}
                <div className="flex flex-col gap-2">
                  <Button onClick={() => confirmOutcome('confirmed')}>{current.confirmLabel}</Button>
                  <Button variant="secondary" onClick={() => confirmOutcome('corrected')}>
                    {current.doesntMatchLabel}
                  </Button>
                  <Button variant="secondary" onClick={() => go('observe', { obsStep: 'not-sure' })}>
                    I'm not sure
                  </Button>
                </div>
              </ResponseBubble>
            </>
          )}

          {phase === 'observe' && current && obsStep === 'not-sure' && (
            <>
              <ChatBubble>{current.notSureGuidance}</ChatBubble>
              <ResponseBubble showAskField>
                <div className="flex flex-col gap-2">
                  <Button onClick={() => confirmOutcome('confirmed')}>{current.confirmLabel}</Button>
                  <Button variant="secondary" onClick={() => confirmOutcome('corrected')}>
                    {current.doesntMatchLabel}
                  </Button>
                  <Button variant="secondary" onClick={stillNotSure}>
                    I'm still not sure
                  </Button>
                </div>
              </ResponseBubble>
            </>
          )}

          {phase === 'observe' && current && (
            <>
              {showConfidenceInfo && (
                <InfoModal title="Confidence levels" onClose={() => setShowConfidenceInfo(false)}>
                  {(['High', 'Moderate', 'Low'] as const).map((l) => (
                    <p key={l} className="mb-2">
                      <strong>{l}:</strong> {CONFIDENCE_EXPLANATIONS[l]}
                    </p>
                  ))}
                  <p>An "approved default" is a sensible choice the Founders approved where the sources are silent.</p>
                </InfoModal>
              )}
              {showSourcesInfo && (
                <InfoModal title="Where this comes from" onClose={() => setShowSourcesInfo(false)}>
                  <div className="flex max-h-[60vh] flex-col gap-2 overflow-y-auto">
                    {sourcesFor(current.obs.id, current.dec.id).map((s) =>
                      s.url ? (
                        <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className="block rounded-lg bg-pip-bg px-3 py-2 text-sm underline underline-offset-2">
                          {s.title}
                        </a>
                      ) : (
                        <p key={s.id} className="rounded-lg bg-pip-bg px-3 py-2 text-sm">
                          {s.title}
                        </p>
                      ),
                    )}
                  </div>
                </InfoModal>
              )}
            </>
          )}

          {phase === 'decide' && current && !pendingCutConfirm && !pendingHelpInfo && !pendingTraceConfirm && (
            <>
              <ChatBubble>
                {decidePath === 'not-sure'
                  ? "That's fine — we won't cut anything you're unsure about. What would you like to do?"
                  : 'Here are your choices.'}
              </ChatBubble>
              <ResponseBubble showAskField>
                {decidePath !== 'not-sure' && (
                  <div className="mb-3">
                    <StatementList items={(decidePath === 'doesnt-match' ? current.doesntMatchNotes : current.decisionNotes) ?? []} />
                  </div>
                )}
                <DecisionChoices onChoose={chooseDecision} options={decisionOptions} />
              </ResponseBubble>
            </>
          )}

          {phase === 'decide' && current && pendingTraceConfirm && (
            <>
              <ChatBubble>
                Before you cut — can you follow that stem all the way down to exactly where you're planning to make the cut,
                with a clear line the whole way?
              </ChatBubble>
              <ResponseBubble showAskField>
                <div className="flex flex-col gap-2">
                  <Button onClick={confirmTraced}>Yes, I can trace it clearly</Button>
                  <Button variant="secondary" onClick={() => setPendingTraceConfirm(false)}>
                    No — let me choose again
                  </Button>
                </div>
              </ResponseBubble>
            </>
          )}

          {phase === 'decide' && current && pendingCutConfirm && (
            <>
              <ChatBubble>
                Before you cut — on the safety check you weren't sure about: {uncheckedSafetyLabels.join('; ')}. Are you sure
                you want to go ahead?
              </ChatBubble>
              <ResponseBubble showAskField>
                <div className="flex flex-col gap-2">
                  <Button onClick={() => go('cut-guide')}>Yes, I'm confident — go ahead</Button>
                  <Button variant="secondary" onClick={() => setPendingCutConfirm(false)}>
                    Let me choose again
                  </Button>
                </div>
              </ResponseBubble>
            </>
          )}

          {phase === 'decide' && current && pendingHelpInfo && (
            <>
              <ChatBubble>
                Good instinct — reaching out before cutting is always fine. A local rose society or garden club, your area's
                extension service, or a nursery or experienced gardener you trust are good places to start. I'll save this as
                "get help" so you can come back to it.
              </ChatBubble>
              <ResponseBubble showAskField>
                <div className="flex flex-col gap-2">
                  <Button onClick={() => recordChoice('get-help')}>Got it — continue</Button>
                  <Button variant="secondary" onClick={() => setPendingHelpInfo(false)}>
                    Let me choose again
                  </Button>
                </div>
              </ResponseBubble>
            </>
          )}

          {phase === 'tools' && (
            <>
              <ChatBubble>Before your first cut, a word about tools and about how much to take off.</ChatBubble>
              <ResponseBubble showAskField>
                {[publishedCare('PKR-CGD-000001'), publishedCare('PKR-CGD-000003')]
                  .filter((c): c is CareGuidance => Boolean(c))
                  .map((c) => (
                    <CareBlock key={c.pkr.id} care={c} />
                  ))}
                <Button onClick={afterTools}>Got it</Button>
              </ResponseBubble>
            </>
          )}

          {phase === 'cut-guide' && current && (
            <>
              <ChatBubble>{pendingChoice?.cutKind === 'sucker' ? "Here's how to remove it." : "Here's how to make the cut."}</ChatBubble>
              <ResponseBubble showAskField>
                {removalOnly && pendingChoice?.cutKind !== 'sucker' && (
                  <div className="mb-3">
                    <p className="mb-1.5 text-xs font-medium text-pip-text-soft">Because your rose is already growing:</p>
                    <StatementList items={DORMANCY_GATE.removalOnly.conditions} />
                  </div>
                )}
                <StatementList items={cutGuide} />
                <div className="flex flex-col gap-2 pt-3">
                  <Button onClick={() => recordChoice('cut')}>Done</Button>
                  <Button variant="secondary" onClick={goBack}>
                    I've changed my mind
                  </Button>
                </div>
              </ResponseBubble>
            </>
          )}

          {phase === 'advisory' && (
            <>
              <ChatBubble>A gentle reminder, since you've made a few cuts now.</ChatBubble>
              <ResponseBubble showAskField>
                {publishedCare('PKR-CGD-000003') && <CareBlock care={publishedCare('PKR-CGD-000003')!} />}
                <Button onClick={() => go('any-more')}>Continue</Button>
              </ResponseBubble>
            </>
          )}

          {phase === 'any-more' && current && (
            <>
              <ChatBubble>
                {lastNote && <>{lastNote} </>}
                {current.anyMoreQuestion}
              </ChatBubble>
              <ResponseBubble showAskField>
                <div className="flex flex-col gap-2">
                  <Button onClick={anotherOne}>Yes</Button>
                  <Button variant="secondary" onClick={finishObservation}>
                    No, that's all
                  </Button>
                </div>
              </ResponseBubble>
            </>
          )}

          {phase === 'care' && (
            <>
              <ChatBubble>
                {recentlyPlantedRestricted
                  ? 'Your rose needs a little more time before full pruning.'
                  : "It's not the time for full pruning this season."}{' '}
                Here's how to look after your {roseName} in the meantime.
              </ChatBubble>
              <ResponseBubble showAskField>
                {careRecords.map((c) => (
                  <CareBlock key={c.pkr.id} care={c} />
                ))}
                <p className="mb-3 text-xs italic text-pip-text-soft">{CARE_DISCLOSURE}</p>
                <Button onClick={() => go('summary')}>Continue</Button>
              </ResponseBubble>
            </>
          )}

          {phase === 'summary' && (
            <>
              <ChatBubble>Here's what we looked at together. It will become part of {project.name}'s history.</ChatBubble>
              <ResponseBubble showAskField>
                <div className="mb-3 flex flex-col gap-2.5">
                  {summaryGroups.length === 0 && <p className="text-xs text-pip-text-soft">Nothing was recorded this time.</p>}
                  {summaryGroups.map((g) => (
                    <div key={g.obs.key} className="rounded-xl bg-pip-bg p-3.5">
                      <p className="text-sm font-medium">{g.obs.feature}</p>
                      {g.items.map((r, i) => (
                        <p key={r.id + i} className="mt-1 text-xs text-pip-text-soft">
                          {outcomeLabel(r.outcome)}
                          {r.choice && <> — {r.choice.replace('-', ' ')}</>}
                        </p>
                      ))}
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

import { useState, type ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useProjects } from '@/lib/store'
import { AppHeader } from '@/components/AppHeader'
import { ChatBubble } from '@/components/ChatBubble'
import { ResponseBubble } from '@/components/ResponseBubble'
import { Button } from '@/components/Button'
import { DecisionChoices } from '@/components/DecisionChoices'
import { FeedbackOffer } from '@/components/FeedbackOffer'
import { ConfidenceTag, SourcesLink, StatementList } from '@/components/PkrStatements'
import {
  MAKING_THE_CUT,
  RECENTLY_PLANTED_GATE,
  ROSE_TYPE_GATE,
  growingSeasonObservation,
  roseTypeName,
  roseTypePasses,
  type DecisionOption,
} from '@/data/pkr'
import {
  evaluateRecentlyPlantedFallback,
  evaluateRecentlyPlantedPrimary,
  type RecentlyPlantedFallbackSignals,
  type RecentlyPlantedGateResult,
} from '@/lib/suitabilityGates'
import type { Choice, ObservationOutcome, ObservationRecord } from '@/lib/types'

/**
 * Growing-season check for blind shoots (PKR-OBS-000008, PKR-DEC-000008).
 * Founder decisions, 2 October 2026: a separate check outside the pruning
 * journey and its dormancy gate (1a); offered only once other shoots have
 * buds or flowers (2a, approved default, carried in the OBS record); the
 * recently-planted gate applies to the cut (3a). Every gardener-facing
 * horticultural statement comes from those Published records.
 */
type Step = 'offer' | 'not-yet' | 'planted' | 'planted-fallback' | 'look' | 'decide' | 'not-sure' | 'cut' | 'doesnt-match' | 'any-more' | 'done'

export function BlindShootCheck() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getProject, addObservation, loading } = useProjects()
  const project = id ? getProject(id) : undefined
  const obs = growingSeasonObservation('blind-shoot')

  const [step, setStep] = useState<Step>('offer')
  const [gate, setGate] = useState<RecentlyPlantedGateResult | null>(null)
  const [signals, setSignals] = useState<Partial<RecentlyPlantedFallbackSignals>>({})
  const [count, setCount] = useState(0)

  if (loading) return <div className="p-6 text-sm text-pip-text-soft">Loading…</div>
  if (!project || !obs || !obs.offerWhen) {
    return (
      <div className="p-6 text-sm text-pip-text-soft">
        This check isn't available right now.{' '}
        <button className="underline" onClick={() => navigate(-1)}>
          Go back
        </button>
      </div>
    )
  }
  const o = obs
  const offer = obs.offerWhen
  const back = () => navigate(`/plant/${project.id}`)
  const roseName = roseTypeName(project.roseType)
  const restricted = gate?.status === 'restricted' && o.recentlyPlantedApplies
  const choices: DecisionOption[] = restricted ? o.choices.filter((c) => c.choice !== 'cut') : o.choices
  const fallbackComplete = RECENTLY_PLANTED_GATE.fallbackQuestions.every((q) => signals[q.key] !== undefined)

  function save(outcome: ObservationOutcome, choice?: Choice) {
    const r: ObservationRecord = {
      id: `${o.key}-${Date.now()}`,
      feature: o.feature,
      pipProposal: o.lookFor,
      comparisonNote: `${o.obs.id} v${o.obs.version}; ${o.dec.id} v${o.dec.version}`,
      outcome,
      choice,
    }
    void addObservation(project!.id, r)
  }

  function choose(c: Choice, outcome: ObservationOutcome) {
    save(outcome, c)
    setCount((n) => n + 1)
    setStep(c === 'cut' ? 'cut' : 'any-more')
  }

  if (!roseTypePasses(project.roseType)) {
    return (
      <Page onBack={back} name={project.name}>
        <ChatBubble>{ROSE_TYPE_GATE.journalOnly.base}</ChatBubble>
        <Button onClick={back}>Back to {project.name}</Button>
      </Page>
    )
  }

  return (
    <Page onBack={back} name={project.name}>
      {step === 'offer' && (
        <>
          <ChatBubble>{offer.question}</ChatBubble>
          <ResponseBubble>
            <div className="flex flex-col gap-2">
              <Button onClick={() => setStep('planted')}>{offer.yes}</Button>
              <Button variant="secondary" onClick={() => setStep('not-yet')}>
                {offer.not_yet}
              </Button>
              <Button variant="secondary" onClick={() => setStep('not-yet')}>
                {offer.not_sure}
              </Button>
            </div>
          </ResponseBubble>
        </>
      )}

      {step === 'not-yet' && (
        <>
          <ChatBubble>
            {offer.not_yet_note}
            <ConfidenceTag level="Approved default" />
          </ChatBubble>
          <Button onClick={back}>Back to {project.name}</Button>
        </>
      )}

      {step === 'planted' && (
        <>
          <ChatBubble>{RECENTLY_PLANTED_GATE.question}</ChatBubble>
          <ResponseBubble>
            <div className="flex flex-col gap-2">
              {(['established', 'recent', 'unknown'] as const).map((a, i) => (
                <Button
                  key={a}
                  variant={i === 0 ? 'primary' : 'secondary'}
                  onClick={() => {
                    const r = evaluateRecentlyPlantedPrimary(a)
                    if (r === 'needs-fallback') setStep('planted-fallback')
                    else {
                      setGate(r)
                      setStep('look')
                    }
                  }}
                >
                  {RECENTLY_PLANTED_GATE.answers[a]}
                </Button>
              ))}
            </div>
          </ResponseBubble>
        </>
      )}

      {step === 'planted-fallback' && (
        <>
          <ChatBubble>{RECENTLY_PLANTED_GATE.fallbackIntro}</ChatBubble>
          <ResponseBubble>
            <div className="flex flex-col gap-3">
              {RECENTLY_PLANTED_GATE.fallbackQuestions.map((q) => (
                <div key={q.key} className="rounded-xl bg-pip-bg px-4 py-3">
                  <p className="mb-2 text-sm">{q.label}</p>
                  <div className="flex gap-2">
                    {[true, false].map((v) => (
                      <Button
                        key={String(v)}
                        className="flex-1"
                        variant={signals[q.key] === v ? 'primary' : 'secondary'}
                        onClick={() => setSignals((s) => ({ ...s, [q.key]: v }))}
                      >
                        {v ? 'Yes' : 'No'}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-3">
              <Button
                disabled={!fallbackComplete}
                onClick={() => {
                  setGate(evaluateRecentlyPlantedFallback(signals as RecentlyPlantedFallbackSignals))
                  setStep('look')
                }}
              >
                Continue
              </Button>
            </div>
          </ResponseBubble>
        </>
      )}

      {step === 'look' && (
        <>
          <ChatBubble>
            {restricted && gate?.status === 'restricted' && <>{gate.reason} </>}
            {o.lookFor}
          </ChatBubble>
          <ResponseBubble>
            <StatementList items={o.criteria} />
            <p className="mt-2 text-xs text-pip-text-soft">{o.photoLimit}</p>
            <SourcesLink pkrIds={[o.obs.id]} />
            <p className="mb-2 mt-3 text-sm font-medium">{o.confirmQuestion}</p>
            <div className="flex flex-col gap-2">
              <Button onClick={() => setStep('decide')}>{o.confirmLabel}</Button>
              <Button
                variant="secondary"
                onClick={() => {
                  save('corrected')
                  setStep('doesnt-match')
                }}
              >
                {o.doesntMatchLabel}
              </Button>
              <Button variant="secondary" onClick={() => setStep('not-sure')}>
                Not sure
              </Button>
            </div>
          </ResponseBubble>
        </>
      )}

      {step === 'decide' && (
        <>
          <ChatBubble>What would you like to do with this blind shoot on your {roseName}?</ChatBubble>
          <ResponseBubble>
            {restricted && gate?.status === 'restricted' && <p className="mb-2 text-xs text-pip-text-soft">{gate.reason}</p>}
            <DecisionChoices options={choices} onChoose={(c) => choose(c, 'confirmed')} />
          </ResponseBubble>
        </>
      )}

      {step === 'not-sure' && (
        <>
          <ChatBubble pose="thinking">{o.notSureGuidance}</ChatBubble>
          <ResponseBubble>
            <DecisionChoices options={o.notSureChoices} onChoose={(c) => choose(c, 'unresolved')} />
          </ResponseBubble>
        </>
      )}

      {step === 'doesnt-match' && (
        <>
          <ChatBubble>{o.doesntMatchNote}</ChatBubble>
          <Button onClick={() => setStep('any-more')}>Continue</Button>
        </>
      )}

      {step === 'cut' && (
        <>
          <ChatBubble pose="gesturing">Here's how sources cut a blind shoot.</ChatBubble>
          <ResponseBubble>
            <StatementList items={o.cutMethod ?? []} />
            <SourcesLink pkrIds={[o.dec.id]} />
            {MAKING_THE_CUT.shorten.length > 0 && (
              <>
                <p className="mb-1.5 mt-3 text-sm font-medium">Making the cut</p>
                <StatementList items={MAKING_THE_CUT.shorten} />
                <SourcesLink pkrIds={[MAKING_THE_CUT.pkr.id]} />
              </>
            )}
            <div className="pt-3">
              <Button onClick={() => setStep('any-more')}>Done</Button>
            </div>
          </ResponseBubble>
        </>
      )}

      {step === 'any-more' && (
        <>
          <ChatBubble>{o.anyMoreQuestion}</ChatBubble>
          <ResponseBubble>
            <div className="flex flex-col gap-2">
              <Button onClick={() => setStep('look')}>Yes</Button>
              <Button
                variant="secondary"
                onClick={() => {
                  save('none-remaining')
                  setStep('done')
                }}
              >
                No
              </Button>
            </div>
          </ResponseBubble>
        </>
      )}

      {step === 'done' && (
        // Pip's closing words, then the offer of the feedback form (approved by a Founder in
        // chat, 3 October 2026). These words stand in for the offer's own "That's our session done."
        <FeedbackOffer
          pose="thumbs-up"
          opening={`That's the blind-shoot check done${count > 0 ? ', and what you decided is saved in the journal' : ''}.`}
          onYes={() => navigate(`/plant/${project.id}/feedback/growing-season`, { state: { skipOffer: true } })}
          onNo={back}
        />
      )}
    </Page>
  )
}

function Page({ children, onBack, name }: { children: ReactNode; onBack: () => void; name: string }) {
  return (
    <div className="flex h-full flex-col">
      <AppHeader onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-4 pb-6 pt-2">
        <p className="text-xs font-medium uppercase tracking-wide text-pip-text-soft">{name}</p>
        <h1 className="font-heading mb-4 text-xl">Growing-season check: blind shoots</h1>
        <div className="flex flex-col gap-3">{children}</div>
      </div>
    </div>
  )
}

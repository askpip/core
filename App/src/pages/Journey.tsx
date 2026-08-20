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
import { DecisionChoices } from '@/components/DecisionChoices'
import { useProjects } from '@/lib/store'
import { observationScript } from '@/data/observationScript'
import type { ObservationOutcome, ObservationRecord, Choice } from '@/lib/types'

const SAFETY_ITEMS = [
  'The rose is dormant, not in active growth',
  "It wasn't planted or moved recently",
  'No serious stress, damage or disease',
  'Secateurs are clean and sharp',
  'Gloves and eye protection are ready',
  'The rose is safely accessible',
]

type Phase = 'safety' | 'photos' | 'observe' | 'decide' | 'summary'

export function Journey() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getProject, updateProject } = useProjects()
  const project = id ? getProject(id) : undefined

  const [phase, setPhase] = useState<Phase>('safety')
  const [checked, setChecked] = useState<boolean[]>(() => SAFETY_ITEMS.map(() => false))
  const [obsIndex, setObsIndex] = useState(0)
  const [records, setRecords] = useState<ObservationRecord[]>([])
  const [revealed, setRevealed] = useState(false)
  const [showWhy, setShowWhy] = useState(false)
  const uncheckedCount = checked.filter((v) => !v).length

  if (!project) {
    return (
      <div className="p-6 text-sm text-pip-text-soft">
        Couldn't find that plant. <button className="underline" onClick={() => navigate('/library')}>Back to your plants</button>
      </div>
    )
  }

  const current = observationScript[obsIndex]

  function beginObservations() {
    setRevealed(false)
    setShowWhy(false)
    setPhase('observe')
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
    setRecords((prev) => prev.map((r, i) => (i === prev.length - 1 ? { ...r, choice } : r)))
    if (obsIndex + 1 < observationScript.length) {
      setObsIndex(obsIndex + 1)
      setRevealed(false)
      setShowWhy(false)
      setPhase('observe')
    } else {
      setPhase('summary')
    }
  }

  function finish() {
    updateProject(project!.id, { observations: records, journeyComplete: true })
    navigate(`/plant/${project!.id}`)
  }

  const topLabel =
    phase === 'safety'
      ? 'Before we begin'
      : phase === 'photos'
        ? 'A clear look at the rose'
        : phase === 'observe' || phase === 'decide'
          ? `Observation ${obsIndex + 1} of ${observationScript.length}`
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
          key={phase + obsIndex + String(revealed)}
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
                    <button
                      key={item}
                      onClick={() =>
                        setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)))
                      }
                      className="flex items-center gap-3 rounded-xl bg-pip-bg px-4 py-3 text-left text-sm"
                    >
                      <span
                        className={cn(
                          'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2',
                          checked[i] ? 'border-pip-primary bg-pip-primary text-white' : 'border-pip-border',
                        )}
                      >
                        {checked[i] && <Check size={13} strokeWidth={3} />}
                      </span>
                      {item}
                    </button>
                  ))}
                </div>
                <div className="pt-3">
                  <Button disabled={uncheckedCount > 0} onClick={() => setPhase('photos')}>
                    {uncheckedCount > 0
                      ? `Check ${uncheckedCount} more to continue`
                      : 'Looks good, continue'}
                  </Button>
                </div>
              </ResponseBubble>
            </>
          )}

          {phase === 'photos' && (
            <>
              <ChatBubble>
                Take a clear overview from base to tips, then a few close-ups of where stems
                cross or look uncertain.
              </ChatBubble>
              <ResponseBubble showAskField>
                <div className="mb-3 grid grid-cols-2 gap-3">
                  <PhotoPlaceholder label="Overview" className="aspect-square" />
                  <PhotoPlaceholder label="Close-up" className="aspect-square" />
                </div>
                <Button onClick={beginObservations}>Photos look good</Button>
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

          {phase === 'decide' && current && (
            <>
              <ChatBubble>
                Based on what you confirmed, here are the choices for this observation.
              </ChatBubble>
              <ResponseBubble showAskField>
                <DecisionChoices onChoose={recordChoice} />
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
                <Button onClick={finish}>Save to {project.name}'s journal</Button>
              </ResponseBubble>
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}

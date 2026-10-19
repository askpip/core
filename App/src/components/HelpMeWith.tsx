import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { PipAvatar } from '@/components/PipAvatar'
import { CareBlock } from '@/components/PkrStatements'
import { CommonQuestions } from '@/components/CommonQuestions'
import { CareLog } from '@/components/CareLog'
import { AskPipBox, AskPipReply, type AskPipReplyState } from '@/components/AskPip'
import { questionsFor, type BuiltInKey } from '@/data/commonQuestions'
import { CARE_DISCLOSURE, RECENTLY_PLANTED_GATE, publishedCare, roseTypePasses } from '@/data/pkr'
import { helpPlan, type HelpChoice } from '@/lib/helpMeWith'
import { countryName, type PlantPlace, type Region } from '@/lib/place'
import type { Season } from '@/lib/location'
import type { CareKind, CareLogEntry, PlantProject, RecentlyPlantedAnswer } from '@/lib/types'

const SEASON_LABEL: Record<Season, string> = { winter: 'Winter', spring: 'Spring', summer: 'Summer', autumn: 'Autumn' }

/** Choice labels: app wording approved with the proposal (section 5, line 4). Common questions keep their own wording. */
function choiceLabel(c: HelpChoice, season?: Season): string {
  switch (c.kind) {
    case 'journey':
      return 'Start the pruning journey'
    case 'care':
      return c.pkrId === 'PKR-CGD-000006' ? 'Getting ready for winter' : `Care tips for ${season ?? ''}`.trim()
    case 'blind-shoots':
      return 'Check for blind shoots'
    case 'question':
      return c.key === 'sucker' ? 'Check for suckers' : (questionsFor([c.key])[0]?.question ?? '')
    case 'set-rose-type':
      return 'Set the rose type'
    case 'all-questions':
      return 'Questions gardeners ask'
    case 'set-place':
      return 'Tell Pip where it grows'
    case 'note':
      return 'Add a note'
  }
}

type View =
  | { kind: 'choices' }
  | { kind: 'care'; pkrId: string }
  | { kind: 'question'; key: BuiltInKey }
  // Pip's reply to a typed question, in the panel's own Pip bubble (one Pip on screen).
  | { kind: 'asked'; reply: AskPipReplyState }

function PipSays({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <PipAvatar size={56} pose="gesturing" className="-ml-2 shrink-0" />
      <div className="min-w-0 flex-1 rounded-2xl bg-pip-bg px-3.5 py-2.5 text-sm leading-relaxed">{children}</div>
    </div>
  )
}

/**
 * "Help me with [rose name]" (APP-HELP-ME-WITH-ROSE proposal, approved by a Founder
 * in chat, 18 October 2026). Pip says what fits now where the rose grows and offers
 * up to three choices, each opening something already published, plus the care log.
 * The choosing is in lib/helpMeWith.ts.
 */
export function HelpMeWith({
  project,
  place,
  onClose,
  onRecentlyPlanted,
  onAddCareLog,
  onUndoCareLog,
  onAddNote,
  onSetRoseType,
  onAllQuestions,
  onSetPlace,
  onRegion,
  onSkipRegion,
}: {
  project: PlantProject
  place: PlantPlace
  onClose: () => void
  onRecentlyPlanted: (answer: RecentlyPlantedAnswer) => void
  onAddCareLog: (kind: CareKind, doneOn: string) => Promise<CareLogEntry>
  onUndoCareLog: (entry: CareLogEntry) => void
  onAddNote: () => void
  onSetRoseType: () => void
  onAllQuestions: () => void
  onSetPlace: () => void
  onRegion: (region: Region) => void
  onSkipRegion: () => void
}) {
  const navigate = useNavigate()
  const [view, setView] = useState<View>({ kind: 'choices' })
  const [showMore, setShowMore] = useState(false)
  const passes = roseTypePasses(project.roseType)
  const plan = helpPlan({
    roseTypePasses: passes,
    roseTypeSet: Boolean(project.roseType),
    hemisphere: project.hemisphere,
    codes: place.codes,
    recentlyPlanted: project.recentlyPlanted,
    date: new Date(),
  })
  const where =
    project.locationCity || place.town?.name || place.region?.name || (place.country ? countryName(place.country) : undefined)
  const seasonWord = plan.season ? SEASON_LABEL[plan.season] : undefined

  function open(c: HelpChoice) {
    switch (c.kind) {
      case 'journey':
        return navigate(`/journey/${project.id}`)
      case 'blind-shoots':
        return navigate(`/plant/${project.id}/blind-shoots`)
      case 'care':
        return setView({ kind: 'care', pkrId: c.pkrId })
      case 'question':
        return setView({ kind: 'question', key: c.key })
      case 'set-rose-type':
        return onSetRoseType()
      case 'all-questions':
        return onAllQuestions()
      case 'set-place':
        return onSetPlace()
      case 'note':
        return onAddNote()
    }
  }

  const choiceButton = (c: HelpChoice) => (
    <button
      key={choiceLabel(c, plan.season)}
      onClick={() => open(c)}
      className="flex min-h-12 w-full items-center justify-between rounded-2xl bg-pip-secondary px-4 py-3 text-left text-sm font-bold text-pip-primary transition-colors hover:bg-pip-secondary-hover"
    >
      {choiceLabel(c, plan.season)}
      <ChevronRight size={18} className="shrink-0" />
    </button>
  )

  const care = view.kind === 'care' ? publishedCare(view.pkrId) : undefined

  return (
    <div className="absolute inset-0 z-50 flex items-start justify-center bg-black/30 px-3 pt-6" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Help me with ${project.name}`}
        className="flex max-h-[calc(100%-2rem)] w-full max-w-md flex-col rounded-2xl bg-pip-card shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between gap-2 p-4 pb-2">
          <h2 className="font-heading text-lg leading-snug">Help me with {project.name}</h2>
          <button onClick={onClose} aria-label="Close" className="text-pip-text-soft">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-4 overflow-y-auto px-4 pb-5">
          {view.kind !== 'choices' && (
            <button
              onClick={() => setView({ kind: 'choices' })}
              className="flex items-center gap-1 self-start text-sm font-bold text-pip-primary"
            >
              <ChevronLeft size={16} /> Back
            </button>
          )}

          {view.kind === 'care' && care && (
            <div>
              <CareBlock care={care} />
              <p className="text-xs italic text-pip-text-soft">{CARE_DISCLOSURE}</p>
            </div>
          )}

          {view.kind === 'asked' && (
            <>
              <PipSays>
                <AskPipReply reply={view.reply} place={place} plantId={project.id} />
              </PipSays>
              <AskPipBox onReply={(reply) => setView({ kind: 'asked', reply })} />
            </>
          )}

          {view.kind === 'question' && (
            <CommonQuestions
              keys={[view.key]}
              title=""
              initialOpen={view.key}
              plantId={project.id}
              place={place}
              onRegion={onRegion}
              onSkipRegion={onSkipRegion}
            />
          )}

          {view.kind === 'choices' && (
            <>
              {plan.rule === 'journal-only' && <PipSays>I can't yet help prune this rose; it's kept as a journal.</PipSays>}
              {plan.rule === 'no-season' && (
                <PipSays>Tell me where {project.name} grows, and I can say what fits the season there.</PipSays>
              )}
              {plan.rule === 'seasonal' && plan.askRecentlyPlanted && (
                <>
                  <PipSays>{RECENTLY_PLANTED_GATE.question}</PipSays>
                  <div className="flex flex-col gap-2">
                    {(['established', 'recent', 'unknown'] as const).map((a) => (
                      <button
                        key={a}
                        onClick={() => onRecentlyPlanted(a)}
                        className="min-h-12 rounded-2xl bg-pip-secondary px-4 py-3 text-left text-sm font-bold text-pip-primary transition-colors hover:bg-pip-secondary-hover"
                      >
                        {RECENTLY_PLANTED_GATE.answers[a]}
                      </button>
                    ))}
                  </div>
                </>
              )}
              {plan.rule === 'seasonal' && !plan.askRecentlyPlanted && (
                <PipSays>
                  Here's what fits now for {project.name}: {seasonWord}
                  {where ? ` in ${where}` : ''}. Pick one, or see more below.
                </PipSays>
              )}

              {!(plan.rule === 'seasonal' && plan.askRecentlyPlanted) && (
                <div className="flex flex-col gap-2">
                  {plan.first.map(choiceButton)}
                  {plan.more.length > 0 && (
                    <>
                      <button
                        onClick={() => setShowMore((v) => !v)}
                        aria-expanded={showMore}
                        className="self-start px-1 py-1 text-sm font-bold text-pip-primary underline underline-offset-2"
                      >
                        More
                      </button>
                      {showMore && plan.more.map(choiceButton)}
                    </>
                  )}
                </div>
              )}
              {/* Always below the choices (proposal 3C); under rules A and B it is one of them. */}
              {plan.rule === 'seasonal' && choiceButton({ kind: 'note' })}

              <AskPipBox onReply={(reply) => setView({ kind: 'asked', reply })} />

              <hr className="border-pip-border" />
              <CareLog
                name={project.name}
                entries={project.careLog}
                codes={place.codes}
                withStatements={passes}
                onAdd={onAddCareLog}
                onUndo={onUndoCareLog}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

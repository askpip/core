import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PipSitting } from '@/components/PipAvatar'
import { PIP_SITTING_FRAME } from '@/components/pipSittingFrame'
import { SourcesLink, StatementLimit, StatementTag } from '@/components/PkrStatements'
import { HOME_QUESTIONS, questionByKey, questionsFor, type BuiltInKey, type CommonQuestion, type QuestionKey } from '@/data/commonQuestions'
import { countryName, shownIn, type PlantPlace, type Region } from '@/lib/place'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

// A small Pip sits on the top edge of the answer card with his boots hanging over it, so
// the answer reads as his (a Founder's idea, 2 October 2026; it also marks the words voice
// mode would speak). He sits at the right so his legs never cross the text: the question
// heading keeps clear of them with HEADING_CLEARANCE.
const PIP_WIDTH = 110
const PIP_SCALE = PIP_WIDTH / PIP_SITTING_FRAME.width
/** How far above the card's top edge he reaches, and so how much room to leave for him. */
const PIP_ABOVE_EDGE = Math.round(PIP_SITTING_FRAME.seat * PIP_SCALE)
const PIP_RIGHT = 16
/** From the card's right edge to just past his left boot (90 frame px left of the middle of his legs), less the card's own 16px padding. */
const HEADING_CLEARANCE = Math.round(PIP_RIGHT + PIP_WIDTH - (PIP_SITTING_FRAME.legs - 90) * PIP_SCALE) - 16

/**
 * Which of his two sitting images Pip uses for a question. They alternate down the
 * full list of questions, so about half the answers show each, and a question always
 * shows the same one wherever it is opened. When he can't answer yet, his hands stay down.
 */
function pipGestures(q: CommonQuestion): boolean {
  return !q.pending && HOME_QUESTIONS.indexOf(q.key as BuiltInKey) % 2 === 0
}

/**
 * Tappable question chips with an inline answer, which Pip sits on. Answers
 * are Published LIL statements only (see data/commonQuestions.ts). A tap on a
 * question Pip can't answer yet is recorded in public.question_interest; a
 * failed insert never affects the gardener.
 */
export function CommonQuestions({
  keys,
  title = 'Questions gardeners ask',
  initialVisible,
  className,
  plantId,
  place,
  onRegion,
  onSkipRegion,
}: {
  keys: QuestionKey[]
  title?: string
  /** Show this many chips, with "More questions" for the rest. */
  initialVisible?: number
  className?: string
  /** When shown on a plant's page: lets an answer open that plant's growing-season check. */
  plantId?: string
  /**
   * Where the plant is, when known (lib/place.ts). Statements marked for a country, region or
   * town are shown only there (Pip Knowledge Rules, rule 4). Left out, or unknown, they are not shown.
   */
  place?: PlantPlace
  /** The gardener has said which region the plant is in. */
  onRegion?: (region: Region) => void
  /** The gardener has chosen not to say. */
  onSkipRegion?: () => void
}) {
  const navigate = useNavigate()
  const questions = questionsFor(keys)
  const [open, setOpen] = useState<QuestionKey | null>(null)
  const [showAll, setShowAll] = useState(false)
  const [regionChoice, setRegionChoice] = useState('')
  // The answer opens below the whole list of questions, which on a phone is often off
  // the bottom of the screen. Bring it into view whenever a question is opened (reported
  // by a Founder, 2 October 2026). Closing a question doesn't move the screen.
  const answerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    answerRef.current?.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'start' })
  }, [open])
  if (questions.length === 0) return null

  const visible = initialVisible && !showAll ? questions.slice(0, initialVisible) : questions
  // A topic's follow-up answers ("More about spraying") aren't in the list of chips, so look wider.
  const current = open ? (questions.find((q) => q.key === open) ?? questionByKey(open)) : undefined
  const codes = place?.codes
  const shown = current ? current.statements.filter((s) => shownIn(s.place, codes)) : []
  const heldBack = current ? current.statements.length - shown.length : 0
  const placeKnown = Boolean(codes && codes.length > 0)
  // Ask which region only where the answer could change what is shown: something held back is for
  // the plant's own country (or, right on a border between countries, for one of the countries offered).
  const askCountries = place?.ask ? (place.ask.country ? [place.ask.country] : place.ask.regions.map((r) => r.country)) : []
  const regionWouldHelp = Boolean(
    current?.statements.some(
      (s) => !shownIn(s.place, codes) && s.place?.some((p) => askCountries.some((c) => p.startsWith(`${c}-`))),
    ),
  )
  const ask = heldBack > 0 && plantId && onRegion && regionWouldHelp ? place?.ask : undefined
  // Other answers in the topic, leaving out any with nothing to show where this plant is.
  const moreItems = (current?.more?.items ?? []).filter((m) => {
    if (!placeKnown) return true
    const answer = questionByKey(m.key)
    return !answer || answer.statements.some((s) => shownIn(s.place, codes))
  })
  // Asked from a plant's page, with nothing in the answer for where that plant grows.
  const nothingHere = Boolean(current && !current.pending && plantId && placeKnown && !ask && shown.length === 0)

  function choose(q: CommonQuestion) {
    const next = open === q.key ? null : q.key
    setOpen(next)
    const empty = Boolean(plantId && placeKnown && !q.pending && !q.statements.some((s) => shownIn(s.place, codes)))
    if (next && (q.pending || empty)) {
      void supabase
        .from('question_interest')
        .insert({ question_key: q.key })
        .then(({ error }) => {
          if (error) console.warn('question_interest not recorded:', error.message)
        })
    }
  }

  return (
    <div className={cn('flex flex-col gap-2.5', className)}>
      {title && <p className="text-xs font-bold uppercase tracking-wide text-pip-text-soft">{title}</p>}
      <div className="flex flex-wrap gap-2">
        {visible.map((q) => (
          <button
            key={q.key}
            onClick={() => choose(q)}
            aria-expanded={open === q.key}
            className={cn(
              'min-h-11 rounded-full px-4 py-2 text-left text-sm font-bold transition-colors',
              open === q.key
                ? 'bg-pip-primary text-white'
                : 'bg-pip-secondary text-pip-primary hover:bg-pip-secondary-hover',
            )}
          >
            {q.question}
          </button>
        ))}
        {initialVisible && questions.length > initialVisible && (
          <button
            onClick={() => setShowAll((v) => !v)}
            className="min-h-11 rounded-full px-3 py-2 text-sm font-bold text-pip-primary underline underline-offset-2"
          >
            {showAll ? 'Fewer questions' : 'More questions'}
          </button>
        )}
      </div>

      {current && (
        // The padding leaves room for Pip above the card, and scrolling to this wrapper
        // (not the card) keeps him on screen with the answer.
        <div ref={answerRef} className="scroll-mt-3" style={{ paddingTop: PIP_ABOVE_EDGE }}>
        <div
          className="relative rounded-2xl border border-pip-border bg-pip-card p-4 shadow-sm"
          role="region"
          aria-label={current.question}
        >
          <PipSitting
            size={PIP_WIDTH}
            gesturing={pipGestures(current)}
            className="pointer-events-none absolute max-w-none"
            style={{ right: PIP_RIGHT, top: -PIP_ABOVE_EDGE - 1 }}
          />
          <p className="font-heading mb-2 text-lg leading-snug" style={{ paddingRight: HEADING_CLEARANCE }}>
            {current.question}
          </p>
          {current.pending ? (
            <p className="text-sm text-pip-text-soft">{current.pending}</p>
          ) : (
            <>
              {current.lead && <p className="mb-2 text-sm text-pip-text-soft">{current.lead}</p>}
              <ul className="flex flex-col gap-1.5">
                {shown.map((s) => (
                  <li key={s.text} className="rounded-xl bg-pip-bg px-3.5 py-2.5 text-sm leading-relaxed">
                    {s.text}
                    <StatementTag statement={s} />
                    <StatementLimit statement={s} />
                  </li>
                ))}
              </ul>
              {nothingHere && (
                <p className="text-sm text-pip-text-soft">
                  I don't have anything on this for where your rose grows yet. I've noted that you asked.
                </p>
              )}
              {ask && (
                <div className="mt-3 rounded-xl border border-pip-border bg-pip-bg p-3">
                  <label htmlFor="pip-region" className="block text-sm">
                    {ask.country
                      ? `Some of this depends on where in ${/^United/.test(countryName(ask.country)) ? 'the ' : ''}${countryName(ask.country)} your rose is. Which region is it in?`
                      : 'Some of this depends on where your rose is. Which region is it in?'}
                  </label>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <select
                      id="pip-region"
                      value={regionChoice}
                      onChange={(e) => setRegionChoice(e.target.value)}
                      className="min-h-11 max-w-full rounded-xl border border-pip-border bg-pip-card px-3 text-sm"
                    >
                      <option value="">Choose a region</option>
                      {ask.regions.map((r) => (
                        <option key={r.code} value={r.code}>
                          {ask.country ? r.name : `${r.name}, ${countryName(r.country)}`}
                        </option>
                      ))}
                      <option value="skip">Somewhere else, or I'm not sure</option>
                    </select>
                    <button
                      disabled={!regionChoice}
                      onClick={() => {
                        const region = ask.regions.find((r) => r.code === regionChoice)
                        if (region) onRegion?.(region)
                        else onSkipRegion?.()
                        setRegionChoice('')
                      }}
                      className="min-h-11 rounded-full bg-pip-primary px-4 py-2 text-sm font-bold text-white disabled:opacity-40"
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}
              {heldBack > 0 && !ask && !placeKnown && (
                <p className="mt-2 text-xs text-pip-text-soft">
                  {plantId
                    ? "Some of this answer is only for certain places. I can't tell where this rose is, so I've left those parts out."
                    : "Some of this answer is only for certain places. Open this question from your rose's page to see what applies where it grows."}
                </p>
              )}
              {shown.length > 0 && <SourcesLink pkrIds={current.pkrIds} />}
              {current.more && moreItems.length > 0 && (
                <div className="mt-3">
                  <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-pip-text-soft">{current.more.title}</p>
                  <div className="flex flex-wrap gap-2">
                    {moreItems.map((m) => (
                      <button
                        key={m.key}
                        onClick={() => setOpen(m.key)}
                        className="min-h-11 rounded-full bg-pip-secondary px-4 py-2 text-left text-sm font-bold text-pip-primary transition-colors hover:bg-pip-secondary-hover"
                      >
                        {m.question}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {current.check && plantId && (
                <button
                  onClick={() => navigate(`/plant/${plantId}/${current.check!.path}`)}
                  className="mt-3 min-h-11 rounded-full bg-pip-primary px-4 py-2 text-sm font-bold text-white"
                >
                  {current.check.label}
                </button>
              )}
            </>
          )}
        </div>
        </div>
      )}
    </div>
  )
}

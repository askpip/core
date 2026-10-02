import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PipSitting } from '@/components/PipAvatar'
import { PIP_SITTING_FRAME } from '@/components/pipSittingFrame'
import { ConfidenceTag, SourcesLink } from '@/components/PkrStatements'
import { questionsFor, type CommonQuestion, type QuestionKey } from '@/data/commonQuestions'
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
}: {
  keys: QuestionKey[]
  title?: string
  /** Show this many chips, with "More questions" for the rest. */
  initialVisible?: number
  className?: string
  /** When shown on a plant's page: lets an answer open that plant's growing-season check. */
  plantId?: string
}) {
  const navigate = useNavigate()
  const questions = questionsFor(keys)
  const [open, setOpen] = useState<QuestionKey | null>(null)
  const [showAll, setShowAll] = useState(false)
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
  const current = questions.find((q) => q.key === open)

  function choose(q: CommonQuestion) {
    const next = open === q.key ? null : q.key
    setOpen(next)
    if (next && q.pending) {
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
            gesturing={!current.pending}
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
                {current.statements.map((s) => (
                  <li key={s.text} className="rounded-xl bg-pip-bg px-3.5 py-2.5 text-sm leading-relaxed">
                    {s.text}
                    <ConfidenceTag level={s.confidence} />
                  </li>
                ))}
              </ul>
              <SourcesLink pkrIds={current.pkrIds} />
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

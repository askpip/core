import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SourcesLink, StatementLimit, StatementTag } from '@/components/PkrStatements'
import { questionByKey, type CommonQuestion } from '@/data/commonQuestions'
import { askPip, type AskPipResult } from '@/lib/askPip'
import { shownIn, type PlantPlace } from '@/lib/place'

/**
 * "Ask Pip in your own words" (APP-ASK-PIP-OWN-WORDS proposal, approved by a Founder
 * in chat, 19 October 2026). The box, and what Pip says back. The AI only chose which
 * answer fits; every statement here is a Published one, word for word, with its label,
 * its limits and its sources, and shown only where the rose grows (lib/place.ts).
 *
 * Pip answers in his own speech bubble (a Founder's direction, 19 October 2026), and
 * there is only ever one Pip on a screen: the page decides which bubble the answer
 * goes in (`AskPipReply`), and the box only asks (`AskPipBox`).
 */

export type AskPipReplyState = { typed: string; result: AskPipResult | { outcome: 'error' } }

/** Approved app wording (proposal section 4). */
const LINES = {
  none: "I can't answer that yet. I've noted your question for the Founders, so it can help decide what I learn next.",
  offTopic:
    "I can only help with roses so far. If someone may be hurt or has eaten something they shouldn't, contact a doctor, a vet or your local poisons line now.",
  limit: "That's all the questions I can take today. Try again tomorrow.",
  retry: 'Not what you asked? Try asking another way.',
}

export function AskPipBox({ onReply }: { onReply: (reply: AskPipReplyState) => void }) {
  const [text, setText] = useState('')
  const [asking, setAsking] = useState(false)

  async function ask() {
    const typed = text.trim()
    if (!typed || asking) return
    setAsking(true)
    try {
      onReply({ typed, result: await askPip(typed) })
      setText('')
    } catch (err) {
      console.warn('Ask Pip failed:', err)
      onReply({ typed, result: { outcome: 'error' } })
    } finally {
      setAsking(false)
    }
  }

  return (
    <div>
      <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-pip-text-soft">Ask Pip in your own words</p>
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && void ask()}
          maxLength={300}
          placeholder="Type your question"
          aria-label="Ask Pip in your own words"
          className="input min-w-0 flex-1"
        />
        <button
          onClick={() => void ask()}
          disabled={asking || !text.trim()}
          className="min-h-11 shrink-0 rounded-full bg-pip-primary px-5 text-sm font-bold text-white disabled:opacity-40"
        >
          {asking ? '…' : 'Ask'}
        </button>
      </div>
    </div>
  )
}

/** What Pip says back: the content of his speech bubble. */
export function AskPipReply({
  reply,
  place,
  plantId,
}: {
  reply: AskPipReplyState
  /** Where the rose grows, when asked from a rose's page; statements for other places are held back. */
  place?: PlantPlace
  plantId?: string
}) {
  const navigate = useNavigate()
  const { result } = reply
  if (result.outcome === 'none') return <>{LINES.none}</>
  if (result.outcome === 'off-topic' || result.outcome === 'safety') return <>{LINES.offTopic}</>
  if (result.outcome === 'limit') return <>{LINES.limit}</>
  const q: CommonQuestion | undefined = result.outcome === 'match' ? questionByKey(result.key) : undefined
  if (!q || q.pending) return <>I couldn't answer just now. Please try again in a moment.</>

  const codes = place?.codes
  const placeKnown = Boolean(codes && codes.length > 0)
  const shown = q.statements.filter((s) => shownIn(s.place, codes))
  const heldBack = q.statements.length - shown.length

  return (
    <div className="flex flex-col gap-2">
      <p>
        Here's what I know about: <span className="font-bold">{q.question}</span>
      </p>
      {q.lead && <p className="text-sm text-pip-text-soft">{q.lead}</p>}
      <ul className="flex flex-col gap-1.5">
        {shown.map((s) => (
          <li key={s.text} className="rounded-xl bg-pip-bg px-3 py-2 text-sm leading-relaxed">
            {s.text}
            <StatementTag statement={s} />
            <StatementLimit statement={s} />
          </li>
        ))}
      </ul>
      {shown.length === 0 && placeKnown && (
        <p className="text-sm text-pip-text-soft">I don't have anything on this for where your rose grows yet. I've noted that you asked.</p>
      )}
      {heldBack > 0 && !placeKnown && (
        <p className="text-xs text-pip-text-soft">
          {plantId
            ? "Some of this answer is only for certain places. I can't tell where this rose is, so I've left those parts out."
            : "Some of this answer is only for certain places. Open this question from your rose's page to see what applies where it grows."}
        </p>
      )}
      {shown.length > 0 && <SourcesLink pkrIds={q.pkrIds} />}
      {q.check && plantId && (
        <button
          onClick={() => navigate(`/plant/${plantId}/${q.check!.path}`)}
          className="self-start rounded-full bg-pip-primary px-4 py-2 text-sm font-bold text-white"
        >
          {q.check.label}
        </button>
      )}
      <p className="text-xs text-pip-text-soft">{LINES.retry}</p>
    </div>
  )
}

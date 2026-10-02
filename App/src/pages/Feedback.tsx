import { useState, type ReactNode } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { AppHeader } from '@/components/AppHeader'
import { ChatBubble } from '@/components/ChatBubble'
import { Button } from '@/components/Button'
import { FeedbackOffer } from '@/components/FeedbackOffer'
import { roseTypePasses } from '@/data/pkr'
import {
  FEEDBACK_COMMON,
  GENERAL_FORM,
  SESSION_FORM,
  type Clear,
  type Confidence,
  type FeedbackOption,
  type Followed,
  type Obstacle,
  type Topic,
  type Went,
} from '@/data/feedbackForm'
import { sendFeedback, type FeedbackResult } from '@/lib/feedback'
import { useProjects } from '@/lib/store'
import { cn } from '@/lib/utils'

/*
 * The feedback form (approved by a Founder in chat, 3 October 2026). Two shapes:
 *
 * - After a session: /plant/:id/feedback/:kind. Pip offers it once the session is
 *   saved (Journey.tsx, BlindShootCheck.tsx). "Not now" goes back to the plant.
 * - From the menu, at any time: /feedback. A shorter form with no session to ask about.
 *
 * Answers go to the Founders (the Garden Shed's "Beta feedback" tool) and never to Pip:
 * the text box is not a way to ask Pip a question (Founder decision, 23 September 2026,
 * no free-text questions to Pip), and the form says so.
 */

type SendState = 'idle' | 'sending' | Exclude<FeedbackResult, 'sent'>

/** Feedback on a session that has just finished. */
export function SessionFeedback() {
  const { id, kind } = useParams<{ id: string; kind: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { getProject, loading } = useProjects()
  const project = id ? getProject(id) : undefined
  // The growing-season check makes the offer on its own last screen, so it opens the form directly.
  const skipOffer = (location.state as { skipOffer?: boolean } | null)?.skipOffer === true

  const [step, setStep] = useState<'offer' | 'form' | 'sent'>(skipOffer ? 'form' : 'offer')
  const [went, setWent] = useState<Went>()
  const [clear, setClear] = useState<Clear>()
  const [followed, setFollowed] = useState<Followed>()
  const [obstacles, setObstacles] = useState<Obstacle[]>([])
  const [confidence, setConfidence] = useState<Confidence>()
  const [comment, setComment] = useState('')
  const [mayContact, setMayContact] = useState<boolean>()
  const [state, setState] = useState<SendState>('idle')

  if (kind !== 'pruning' && kind !== 'growing-season') return <Navigate to={id ? `/plant/${id}` : '/library'} replace />
  if (loading) return <div className="p-6 text-sm text-pip-text-soft">Loading…</div>
  if (!project) return <Navigate to="/library" replace />

  const back = () => navigate(`/plant/${project.id}`)

  /** "Nothing got in my way" and the other answers can't both be ticked. */
  function toggleObstacle(key: Obstacle) {
    setObstacles((prev) => {
      if (prev.includes(key)) return prev.filter((k) => k !== key)
      return key === 'none' ? ['none'] : [...prev.filter((k) => k !== 'none'), key]
    })
  }

  async function send() {
    if (!went || (kind !== 'pruning' && kind !== 'growing-season')) return
    setState('sending')
    const result = await sendFeedback({
      kind,
      roseType: roseTypePasses(project!.roseType) ? project!.roseType : undefined,
      went,
      clear,
      followed,
      obstacles,
      confidence,
      comment,
      mayContact,
    })
    if (result === 'sent') setStep('sent')
    else setState(result)
  }

  return (
    <Page onBack={back} eyebrow={project.name} title={SESSION_FORM.title}>
      {step === 'offer' && <FeedbackOffer onYes={() => setStep('form')} onNo={back} />}

      {step === 'form' && (
        <>
          <Question label={SESSION_FORM.went.question}>
            <OneOf label={SESSION_FORM.went.question} options={SESSION_FORM.went.options} value={went} onChange={setWent} />
          </Question>
          <Question label={SESSION_FORM.clear.question}>
            <OneOf label={SESSION_FORM.clear.question} options={SESSION_FORM.clear.options} value={clear} onChange={setClear} />
          </Question>
          <Question label={SESSION_FORM.followed.question}>
            <OneOf
              label={SESSION_FORM.followed.question}
              options={SESSION_FORM.followed.options}
              value={followed}
              onChange={setFollowed}
            />
          </Question>
          <Question label={SESSION_FORM.obstacles.question} note={SESSION_FORM.obstacles.hint}>
            <div role="group" aria-label={SESSION_FORM.obstacles.question} className="flex flex-col gap-2">
              {SESSION_FORM.obstacles.options.map((o) => (
                <Option
                  key={o.key}
                  role="checkbox"
                  label={o.label}
                  selected={obstacles.includes(o.key)}
                  onClick={() => toggleObstacle(o.key)}
                />
              ))}
            </div>
          </Question>
          <Question label={SESSION_FORM.confidence.question}>
            <OneOf
              label={SESSION_FORM.confidence.question}
              options={SESSION_FORM.confidence.options}
              value={confidence}
              onChange={setConfidence}
            />
          </Question>
          <CommentBox id="feedback-comment" label={SESSION_FORM.comment.question} optional value={comment} onChange={setComment} />
          <Question label={SESSION_FORM.mayContact.question}>
            <YesNo label={SESSION_FORM.mayContact.question} value={mayContact} onChange={setMayContact} />
          </Question>
          <SendRow smallPrint={SESSION_FORM.smallPrint} state={state} disabled={!went} onSend={send} />
        </>
      )}

      {step === 'sent' && (
        <>
          <ChatBubble pose="thumbs-up">{FEEDBACK_COMMON.thanks}</ChatBubble>
          <Button onClick={back}>Back to {project.name}</Button>
        </>
      )}
    </Page>
  )
}

/** The shorter form opened from the menu. */
export function GeneralFeedback() {
  const navigate = useNavigate()
  const location = useLocation()
  // The menu passes the screen the gardener came from, so "Back" returns there.
  const from = (location.state as { from?: string } | null)?.from
  const back = () => navigate(from && from !== '/feedback' ? from : '/welcome')

  const [sent, setSent] = useState(false)
  const [topic, setTopic] = useState<Topic>()
  const [comment, setComment] = useState('')
  const [mayContact, setMayContact] = useState<boolean>()
  const [state, setState] = useState<SendState>('idle')

  async function send() {
    if (!topic || !comment.trim()) return
    setState('sending')
    const result = await sendFeedback({ kind: 'general', topic, comment, mayContact })
    if (result === 'sent') setSent(true)
    else setState(result)
  }

  return (
    <Page onBack={back}>
      {sent ? (
        <>
          <ChatBubble pose="thumbs-up">{FEEDBACK_COMMON.thanks}</ChatBubble>
          <Button onClick={back}>Done</Button>
        </>
      ) : (
        <>
          <Question label={GENERAL_FORM.topic.question}>
            <OneOf label={GENERAL_FORM.topic.question} options={GENERAL_FORM.topic.options} value={topic} onChange={setTopic} />
          </Question>
          <CommentBox id="feedback-comment" label={GENERAL_FORM.comment.question} value={comment} onChange={setComment} />
          <Question label={GENERAL_FORM.mayContact.question}>
            <YesNo label={GENERAL_FORM.mayContact.question} value={mayContact} onChange={setMayContact} />
          </Question>
          <SendRow smallPrint={GENERAL_FORM.smallPrint} state={state} disabled={!topic || !comment.trim()} onSend={send} />
        </>
      )}
    </Page>
  )
}

// --- Parts of the form -------------------------------------------------------

function Page({
  children,
  onBack,
  eyebrow,
  title = GENERAL_FORM.title,
}: {
  children: ReactNode
  onBack: () => void
  eyebrow?: string
  title?: string
}) {
  return (
    <div className="flex h-full flex-col">
      <AppHeader onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-4 pb-8 pt-2">
        {eyebrow && <p className="text-xs font-medium uppercase tracking-wide text-pip-text-soft">{eyebrow}</p>}
        <h1 className="font-heading mb-4 text-xl">{title}</h1>
        <div className="flex flex-col gap-3">{children}</div>
      </div>
    </div>
  )
}

function Question({ label, note, children }: { label: string; note?: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-pip-border bg-pip-card p-4 shadow-sm">
      <p className="mb-2.5 text-sm font-bold leading-snug">
        {label}
        {note && <span className="ml-1.5 font-normal text-pip-text-soft">({note})</span>}
      </p>
      {children}
    </section>
  )
}

/** One answer from a list. Tapping the chosen answer again clears it. */
function OneOf<K extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: readonly FeedbackOption<K>[]
  value: K | undefined
  onChange: (value: K | undefined) => void
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-col gap-2">
      {options.map((o) => (
        <Option
          key={o.key}
          role="radio"
          label={o.label}
          selected={value === o.key}
          onClick={() => onChange(value === o.key ? undefined : o.key)}
        />
      ))}
    </div>
  )
}

function YesNo({
  label,
  value,
  onChange,
}: {
  label: string
  value: boolean | undefined
  onChange: (value: boolean | undefined) => void
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex gap-2">
      {[true, false].map((v) => (
        <Option
          key={String(v)}
          role="radio"
          className="flex-1"
          label={v ? FEEDBACK_COMMON.yes : FEEDBACK_COMMON.no}
          selected={value === v}
          onClick={() => onChange(value === v ? undefined : v)}
        />
      ))}
    </div>
  )
}

/** One tappable answer, with a mark that shows the choice without relying on colour alone. */
function Option({
  role,
  label,
  selected,
  onClick,
  className,
}: {
  role: 'radio' | 'checkbox'
  label: string
  selected: boolean
  onClick: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      role={role}
      aria-checked={selected}
      onClick={onClick}
      className={cn(
        'flex min-h-11 items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-left text-sm transition-colors',
        selected
          ? 'border-pip-primary bg-pip-secondary font-bold text-pip-text'
          : 'border-pip-border bg-pip-card text-pip-text hover:border-pip-primary',
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          'flex size-[18px] shrink-0 items-center justify-center border-2',
          role === 'radio' ? 'rounded-full' : 'rounded',
          selected ? 'border-pip-primary' : 'border-pip-text-soft',
        )}
      >
        {selected && <span className={cn('h-2 w-2 bg-pip-primary', role === 'radio' ? 'rounded-full' : 'rounded-sm')} />}
      </span>
      <span>{label}</span>
    </button>
  )
}

function CommentBox({
  id,
  label,
  optional,
  value,
  onChange,
}: {
  id: string
  label: string
  optional?: boolean
  value: string
  onChange: (value: string) => void
}) {
  const left = FEEDBACK_COMMON.commentLimit - value.length
  return (
    <section className="rounded-2xl border border-pip-border bg-pip-card p-4 shadow-sm">
      <label htmlFor={id} className="mb-2.5 block text-sm font-bold leading-snug">
        {label}
        {optional && <span className="ml-1.5 font-normal text-pip-text-soft">({FEEDBACK_COMMON.optional})</span>}
      </label>
      <textarea
        id={id}
        rows={4}
        maxLength={FEEDBACK_COMMON.commentLimit}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-describedby={`${id}-help`}
        className="input block w-full resize-y"
      />
      <p id={`${id}-help`} className="mt-2 text-xs text-pip-text-soft">
        {FEEDBACK_COMMON.commentHelp}
      </p>
      {left <= 100 && (
        <p className="mt-1 text-xs text-pip-text-soft" aria-live="polite">
          {left} characters left
        </p>
      )}
    </section>
  )
}

function SendRow({
  smallPrint,
  state,
  disabled,
  onSend,
}: {
  smallPrint: string
  state: SendState
  disabled: boolean
  onSend: () => void
}) {
  return (
    <div className="flex flex-col gap-3 pt-1">
      <p className="text-xs text-pip-text-soft">{smallPrint}</p>
      {(state === 'failed' || state === 'too-many') && (
        <p role="alert" className="rounded-xl bg-pip-petal-tint px-3.5 py-2.5 text-sm text-pip-text">
          {state === 'too-many' ? FEEDBACK_COMMON.tooMany : FEEDBACK_COMMON.failed}
        </p>
      )}
      <Button disabled={disabled || state === 'sending'} onClick={onSend}>
        {state === 'sending' ? FEEDBACK_COMMON.sending : FEEDBACK_COMMON.send}
      </Button>
    </div>
  )
}

import { ChatBubble } from './ChatBubble'
import { ResponseBubble } from './ResponseBubble'
import { Button } from './Button'
import type { PipPose } from './PipAvatar'
import { FEEDBACK_OFFER } from '@/data/feedbackForm'

/**
 * Pip's offer of the feedback form at the end of a session (approved by a Founder in
 * chat, 3 October 2026). It never blocks: "Not now" carries on as before.
 *
 * `opening` replaces Pip's first sentence when the screen already has its own closing
 * words (the growing-season check's "That's the blind-shoot check done…"), so Pip
 * doesn't say the session is done twice.
 */
export function FeedbackOffer({
  onYes,
  onNo,
  opening = FEEDBACK_OFFER.opening,
  pose,
}: {
  onYes: () => void
  onNo: () => void
  opening?: string
  pose?: PipPose
}) {
  return (
    <>
      <ChatBubble pose={pose}>
        {opening} {FEEDBACK_OFFER.ask}
      </ChatBubble>
      <ResponseBubble>
        <div className="flex flex-col gap-2">
          <Button onClick={onYes}>{FEEDBACK_OFFER.yes}</Button>
          <Button variant="secondary" onClick={onNo}>
            {FEEDBACK_OFFER.no}
          </Button>
        </div>
      </ResponseBubble>
    </>
  )
}

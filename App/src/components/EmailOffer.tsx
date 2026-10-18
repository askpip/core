import { Button } from '@/components/Button'
import type { useEmailOffer } from '@/lib/emailReminders'

/**
 * Pip offers the pruning-time emails once (a Founder's decision, 18 October 2026),
 * on a rose's page, the first time the rose has pruning months saved for its place.
 * Either answer is kept, and Pip doesn't ask again; the menu changes it later.
 *
 * There is only ever one Pip on a screen (a Founder's direction, 18 October 2026),
 * so the question goes inside the page's own Pip bubble (`EmailOfferQuestion`) and
 * the answers sit under it (`EmailOfferAnswers`). The state is `useEmailOffer`
 * (lib/emailReminders.ts).
 */
export function EmailOfferQuestion({ name }: { name: string }) {
  return (
    <span className="mt-3 block">
      Would you like an email when it's pruning time for {name}? You can change this in the menu.
    </span>
  )
}

export function EmailOfferAnswers({ offer }: { offer: ReturnType<typeof useEmailOffer> }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Button className="flex-1" disabled={offer.saving} onClick={() => void offer.answer(true)}>
          Yes, email me
        </Button>
        <Button className="flex-1" variant="secondary" disabled={offer.saving} onClick={() => void offer.answer(false)}>
          No thanks
        </Button>
      </div>
      {offer.error && <p className="text-xs text-red-600">{offer.error}</p>}
    </div>
  )
}

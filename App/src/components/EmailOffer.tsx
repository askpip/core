import { useState } from 'react'
import { ChatBubble } from '@/components/ChatBubble'
import { Button } from '@/components/Button'
import { useEmailReminderChoice } from '@/lib/emailReminders'

/**
 * Pip offers the pruning-time emails once (a Founder's decision, 18 October 2026),
 * on a rose's page, the first time the rose has pruning months saved for its place.
 * Either answer is kept, and Pip doesn't ask again; the menu changes it later.
 */
export function EmailOffer({ name }: { name: string }) {
  const { choice, set } = useEmailReminderChoice()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  if (choice !== 'unasked') return null

  async function answer(enabled: boolean) {
    setSaving(true)
    setError(null)
    if (!(await set(enabled))) setError("That didn't save — check your connection and try again.")
    setSaving(false)
  }

  return (
    <div className="flex flex-col gap-2">
      <ChatBubble>Would you like an email when it's pruning time for {name}? You can change this in the menu.</ChatBubble>
      <div className="flex gap-2">
        <Button className="flex-1" disabled={saving} onClick={() => void answer(true)}>
          Yes, email me
        </Button>
        <Button className="flex-1" variant="secondary" disabled={saving} onClick={() => void answer(false)}>
          No thanks
        </Button>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}

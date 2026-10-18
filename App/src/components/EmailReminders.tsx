import { useState } from 'react'
import { Button } from '@/components/Button'
import { useEmailReminderChoice } from '@/lib/emailReminders'

/**
 * The pruning-time email switch, from the menu (APP-REMINDERS-AND-PLACE proposal §4,
 * approved 18 October 2026). Off until the gardener turns it on. Only the choice is
 * stored (public.email_reminders); the address is the one the gardener signs in
 * with, and the monthly job reads it there.
 */
export function EmailReminders({ email }: { email?: string }) {
  const { choice, set } = useEmailReminderChoice()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const enabled = choice === 'on'

  async function toggle() {
    setSaving(true)
    setError(null)
    if (!(await set(!enabled))) setError("That didn't save — check your connection and try again.")
    setSaving(false)
  }

  return (
    <div className="flex flex-col gap-3">
      <p>
        I'll email you at {email ?? 'your sign-in address'} on the first of a month when one of your roses reaches its pruning
        months. You can turn this off here at any time.
      </p>
      {choice === 'loading' ? (
        <p className="text-xs">Loading…</p>
      ) : (
        <>
          <p className="text-sm font-medium text-pip-text">{enabled ? 'On' : 'Off'}</p>
          <Button variant={enabled ? 'secondary' : 'primary'} disabled={saving} onClick={() => void toggle()}>
            {enabled ? 'Turn off' : 'Turn on'}
          </Button>
        </>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}

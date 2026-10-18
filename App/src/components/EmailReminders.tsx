import { useEffect, useState } from 'react'
import { Button } from '@/components/Button'
import { supabase } from '@/lib/supabase'

/**
 * The pruning-time email switch, from the menu (APP-REMINDERS-AND-PLACE proposal §4,
 * approved 18 October 2026). Off until the gardener turns it on. Only the choice is
 * stored (public.email_reminders); the address is the one the gardener signs in
 * with, and the monthly job reads it there.
 */
export function EmailReminders({ email }: { email?: string }) {
  const [enabled, setEnabled] = useState<boolean | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let current = true
    void supabase
      .from('email_reminders')
      .select('enabled')
      .maybeSingle()
      .then(({ data, error: e }) => {
        if (!current) return
        if (e) console.warn('Email choice not loaded:', e.message)
        setEnabled(Boolean(data?.enabled))
      })
    return () => {
      current = false
    }
  }, [])

  async function set(next: boolean) {
    setSaving(true)
    setError(null)
    const {
      data: { user },
    } = await supabase.auth.getUser()
    const { error: e } = user
      ? await supabase
          .from('email_reminders')
          .upsert({ user_id: user.id, enabled: next, updated_at: new Date().toISOString() })
      : { error: new Error('Not signed in') }
    setSaving(false)
    if (e) {
      console.error('Email choice not saved:', e)
      setError("That didn't save — check your connection and try again.")
      return
    }
    setEnabled(next)
  }

  return (
    <div className="flex flex-col gap-3">
      <p>
        I'll email you at {email ?? 'your sign-in address'} on the first of a month when one of your roses reaches its pruning
        months. You can turn this off here at any time.
      </p>
      {enabled === null ? (
        <p className="text-xs">Loading…</p>
      ) : (
        <>
          <p className="text-sm font-medium text-pip-text">{enabled ? 'On' : 'Off'}</p>
          <Button variant={enabled ? 'secondary' : 'primary'} disabled={saving} onClick={() => void set(!enabled)}>
            {enabled ? 'Turn off' : 'Turn on'}
          </Button>
        </>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}

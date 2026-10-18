import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabase'

/**
 * The gardener's pruning-time email choice (public.email_reminders). 'unasked'
 * means no row yet: they have neither turned the emails on or off, nor answered
 * Pip's one-time offer. Any answer leaves a row, so Pip doesn't ask again.
 */
export type EmailChoice = 'loading' | 'unasked' | 'on' | 'off'

export function useEmailReminderChoice(): { choice: EmailChoice; set: (enabled: boolean) => Promise<boolean> } {
  const [choice, setChoice] = useState<EmailChoice>('loading')

  useEffect(() => {
    let current = true
    void supabase
      .from('email_reminders')
      .select('enabled')
      .maybeSingle()
      .then(({ data, error }) => {
        if (!current) return
        if (error) {
          // Unknown: treat as answered, so Pip doesn't ask on a failed read.
          console.warn('Email choice not loaded:', error.message)
          setChoice('off')
          return
        }
        setChoice(data ? (data.enabled ? 'on' : 'off') : 'unasked')
      })
    return () => {
      current = false
    }
  }, [])

  const set = useCallback(async (enabled: boolean) => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return false
    const { error } = await supabase
      .from('email_reminders')
      .upsert({ user_id: user.id, enabled, updated_at: new Date().toISOString() })
    if (error) {
      console.error('Email choice not saved:', error)
      return false
    }
    setChoice(enabled ? 'on' : 'off')
    return true
  }, [])

  return { choice, set }
}

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AppHeader } from '@/components/AppHeader'
import { ChatBubble } from '@/components/ChatBubble'
import { ResponseBubble } from '@/components/ResponseBubble'
import { Button } from '@/components/Button'
import { supabase } from '@/lib/supabase'
import { setKeepLoggedIn } from '@/lib/keepLoggedIn'
import { useAuth } from '@/lib/auth'

/**
 * Shown exactly once per gardener, immediately after their first-ever
 * successful sign-in — see AuthGate.tsx's post-verify routing, which sends
 * a gardener here only when their account has no `displayName` yet, and
 * straight to /welcome every time after (this screen writes that name to
 * the Supabase auth user itself, via updateUser, rather than a separate
 * profile table — one field doesn't need one).
 *
 * Also collects the "keep me logged in" choice here, once, rather than on
 * every sign-in — see lib/keepLoggedIn.ts for how that's applied.
 */
export function NameOnboarding() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()
  const [name, setName] = useState('')
  const [keepLoggedIn, setKeepLoggedInChecked] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // A gardener who already has a name (e.g. they used the browser's Back
  // button to return here after already finishing onboarding) has nothing
  // left to do on this screen — send them on rather than let them re-save.
  useEffect(() => {
    if (!loading && typeof user?.user_metadata?.displayName === 'string' && user.user_metadata.displayName.trim()) {
      navigate('/welcome', { replace: true })
    }
  }, [loading, user, navigate])

  async function save() {
    if (!name.trim()) return
    setSaving(true)
    setError(null)

    // Applied first: by the time a gardener reaches this screen they're
    // already signed in (verifyOtp ran back in AuthGate), so their session
    // was already written under whatever the default preference was —
    // setKeepLoggedIn migrates it to match this choice before moving on.
    setKeepLoggedIn(keepLoggedIn)

    const { error: updateError } = await supabase.auth.updateUser({
      data: { displayName: name.trim() },
    })

    if (updateError) {
      setError(updateError.message)
      setSaving(false)
      return
    }
    navigate('/welcome', { replace: true })
  }

  return (
    <div className="flex h-full flex-col">
      <AppHeader />

      <div className="px-4 pt-6">
        <ChatBubble>Welcome, Gardener! What would you like to be called from now on?</ChatBubble>
        <ResponseBubble>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && save()}
              placeholder="Your name"
              className="input w-full"
            />

            <button
              onClick={() => setKeepLoggedInChecked((v) => !v)}
              className="flex items-center gap-3 text-left text-sm text-pip-text"
            >
              <span
                className={cn(
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2',
                  keepLoggedIn ? 'border-pip-primary bg-pip-primary text-white' : 'border-pip-border',
                )}
              >
                {keepLoggedIn && <Check size={13} strokeWidth={3} />}
              </span>
              Keep me logged in on this device
            </button>

            {error && <p className="text-xs text-red-600">{error}</p>}
            <Button disabled={saving || !name.trim()} onClick={save}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </div>
        </ResponseBubble>
      </div>
    </div>
  )
}

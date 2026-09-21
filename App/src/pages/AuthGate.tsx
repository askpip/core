import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { User } from '@supabase/supabase-js'
import { Clipboard } from 'lucide-react'
import { AppHeader } from '@/components/AppHeader'
import { ChatBubble } from '@/components/ChatBubble'
import { ResponseBubble } from '@/components/ResponseBubble'
import { Button } from '@/components/Button'
import { supabase } from '@/lib/supabase'
import { getOwnMemberProfile, markPasswordSet } from '@/lib/membership'

type Status = 'checking' | 'idle' | 'sending' | 'sent' | 'verifying-password' | 'set-password' | 'saving-password'

/** Which form the idle ("enter your email") screen shows. See the mode toggle below the primary action. */
type AuthMode = 'code' | 'password'

/**
 * Where a signed-in gardener lands: /name if their account has no saved
 * display name yet (first-ever sign-in, on any device), otherwise straight
 * to /welcome — including a returning gardener on a new device, or one who
 * chose not to "keep me logged in" last time, since the name lives on the
 * Supabase auth user itself and isn't tied to this browser. See
 * NameOnboarding.tsx for where displayName gets set.
 */
function nextRouteFor(user: User | null | undefined): string {
  const name = user?.user_metadata?.displayName
  return typeof name === 'string' && name.trim() ? '/welcome' : '/name'
}

/**
 * Real entry gate: magic-link/code sign-in via Supabase Auth by default, with
 * an optional password once a gardener has set one. No password is required
 * up front — a gardener always gets in with just their email and a one-time
 * code — but right after that code is redeemed for the first time, this
 * screen offers to set a password so future sign-ins can skip the email
 * round-trip (see the 'set-password' status below). Google sign-in can be
 * added alongside this later without changing the flow.
 *
 * The email also contains a clickable link, and clicking it still works
 * (handled in the useEffect below). But the code is the primary path: email
 * security scanners (Gmail's link-safety check among them) routinely
 * "pre-visit" links found in emails to check they're not malicious, which
 * silently burns a magic link's one-time-use token before the gardener ever
 * clicks it themselves — the classic symptom is "invalid flow state" or
 * "token already used" even on a first, honest click. A typed code can't be
 * consumed by a scanner reading the email body as text, so it's what we lead
 * with; the link stays as a convenience for whoever isn't hit by that.
 *
 * Handles three situations on mount:
 *  - Already has a session (e.g. reopening the app) -> skip straight past
 *    this screen, routed onward by nextRouteFor below. No password prompt
 *    here — that only ever follows a fresh code redemption (see
 *    afterCodeSignIn), so a returning gardener who skipped setting a
 *    password once isn't asked again every time they reopen the app.
 *  - Arriving from a clicked magic link (?code=... in the URL) -> exchange
 *    the code for a session, then offer the password step, then route
 *    onward. The exchange is done here manually (supabase.ts sets
 *    detectSessionInUrl: false) because HashRouter also owns the URL hash
 *    and would otherwise race with supabase-js's own auto-detection.
 *  - Neither -> show the idle screen, where a gardener enters their email
 *    for a code, or switches to "log in with a password" if they've set one.
 */
export function AuthGate() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [status, setStatus] = useState<Status>('checking')
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Which form the idle screen shows. Only meaningful while status is
  // 'idle' — reset to 'code' whenever a gardener backs out of either flow,
  // so returning to this screen later doesn't strand them on the wrong one.
  const [authMode, setAuthMode] = useState<AuthMode>('code')
  const [password, setPassword] = useState('')

  // The freshly-verified user, held only long enough to show the
  // 'set-password' step and then route onward with nextRouteFor.
  const [pendingUser, setPendingUser] = useState<User | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    let active = true

    async function settle() {
      const url = new URL(window.location.href)

      if (url.searchParams.has('code')) {
        // Capture the full URL (with the one-time code) before stripping it
        // from the visible address bar. The strip happens synchronously,
        // before the first `await` below, specifically so that React 18
        // StrictMode's dev-mode double-invocation of this effect sees no
        // `code` param the second time around and skips straight to the
        // "check existing session" branch instead of redeeming the same
        // one-time code twice in a race.
        const authUrl = window.location.href
        window.history.replaceState({}, '', url.pathname + url.hash)

        const { data: exchangeData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(authUrl)
        if (!active) return
        if (exchangeError) {
          setError(exchangeError.message)
          setStatus('idle')
          return
        }
        await afterCodeSignIn(exchangeData.session?.user ?? exchangeData.user)
        return
      }

      const { data } = await supabase.auth.getSession()
      if (!active) return
      if (data.session) {
        navigate(nextRouteFor(data.session.user), { replace: true })
        return
      }
      setStatus('idle')
    }

    // Shared by both ways a gardener can redeem a one-time code (typed, or
    // the emailed link): offer to set a password only the first time,
    // determined from member_profiles.has_password (see lib/membership.ts)
    // — never from anything client-editable, so this can't be tricked into
    // skipping. A failed profile read (network hiccup, anything) fails
    // toward *not* interrupting sign-in: the gardener just proceeds, same
    // as before this feature existed, and can set a password later.
    async function afterCodeSignIn(user: User | null | undefined) {
      if (!active || !user) return
      const profile = await getOwnMemberProfile(user.id)
      if (!active) return
      if (profile && !profile.hasPassword) {
        setPendingUser(user)
        setStatus('set-password')
        return
      }
      navigate(nextRouteFor(user), { replace: true })
    }

    settle()
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate])

  async function sendMagicLink() {
    if (!email.trim()) return
    setStatus('sending')
    setError(null)

    const { error: signInError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}${window.location.pathname}`,
      },
    })

    if (signInError) {
      setError(signInError.message)
      setStatus('idle')
      return
    }
    setStatus('sent')
  }

  async function verifyCode() {
    if (!code.trim()) return
    setVerifying(true)
    setError(null)

    const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: code.trim(),
      type: 'email',
    })

    if (verifyError) {
      setError(verifyError.message)
      setVerifying(false)
      return
    }

    const user = verifyData.session?.user ?? verifyData.user
    if (!user) {
      setVerifying(false)
      return
    }
    const profile = await getOwnMemberProfile(user.id)
    if (profile && !profile.hasPassword) {
      setPendingUser(user)
      setStatus('set-password')
      setVerifying(false)
      return
    }
    navigate(nextRouteFor(user), { replace: true })
  }

  /**
   * The returning-gardener fast path: signs in with a password already set
   * via the 'set-password' step below, skipping the email round-trip
   * entirely. Supabase Auth ties this to the same account as the code
   * sign-in — same auth.users row, matched by email — so either method
   * works for an account that has both.
   */
  async function signInWithPasswordFlow() {
    if (!email.trim() || !password) return
    setStatus('verifying-password')
    setError(null)

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (signInError) {
      // Deliberately the same generic message whether the email has no
      // password set, the password is wrong, or the account doesn't exist —
      // distinguishing those would tell an attacker which emails have
      // accounts. The fallback link below covers the honest case (no
      // password set yet) without the error message needing to.
      setError("That didn't match. You can also email yourself a login code instead.")
      setStatus('idle')
      return
    }
    navigate(nextRouteFor(data.session?.user ?? data.user), { replace: true })
  }

  async function savePassword() {
    setError(null)
    if (newPassword.length < 8) {
      setError('Use at least 8 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError("Those passwords don't match.")
      return
    }
    setStatus('saving-password')

    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword })
    if (updateError) {
      setError(updateError.message)
      setStatus('set-password')
      return
    }
    // Best-effort: if this fails, the gardener just sees the password
    // offer again next time they redeem a code, which is safe, just
    // slightly repetitive — never a reason to block them from continuing.
    await markPasswordSet()
    navigate(nextRouteFor(pendingUser), { replace: true })
  }

  function skipPassword() {
    navigate(nextRouteFor(pendingUser), { replace: true })
  }

  /**
   * Reads the code straight from the clipboard, for a gardener copying it
   * from the email rather than typing it. Needs the Clipboard API (works
   * over https, which the production domain is) and a click to trigger it —
   * browsers require a real user gesture for clipboard reads. Fails
   * silently on denial/unsupported browsers rather than showing an alarming
   * error over something this minor; the field is always still typeable.
   */
  async function pasteCode() {
    try {
      const text = await navigator.clipboard.readText()
      if (text.trim()) setCode(text.trim())
    } catch {
      // See comment above — nothing to surface here.
    }
  }

  function switchAuthMode(mode: AuthMode) {
    setAuthMode(mode)
    setError(null)
    setPassword('')
  }

  // What Pip says up top changes with the flow, rather than leaving stale
  // instructions on screen once the gardener has moved on to a different
  // step — see the original comment history on this component for why that
  // matters (a mismatched prompt was reported as looking broken).
  const pipMessage =
    status === 'checking'
      ? "Just a moment — I'm checking whether you're already signed in."
      : status === 'sent'
        ? `I've sent a code to ${email}. Check your inbox and enter it below, or click the link in the email — either works.`
        : status === 'set-password' || status === 'saving-password'
          ? "You're in! Want to set a password so you can skip the email code next time? Totally optional — you can always come back to this later."
          : authMode === 'password'
            ? "Enter your email and password to log in."
            : "Hi, I'm Pip! Enter your email and I'll send you a code to log in — no password needed."

  return (
    <div className="flex h-full flex-col">
      <AppHeader />

      <div className="px-4 pt-6">
        <ChatBubble>{pipMessage}</ChatBubble>
        <ResponseBubble>
          {status === 'checking' ? (
            <p className="text-sm text-pip-text-soft">Checking for an existing session…</p>
          ) : status === 'set-password' || status === 'saving-password' ? (
            <div className="flex flex-col gap-2.5">
              <input
                type="password"
                autoFocus
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
                className="input w-full"
              />
              <input
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && savePassword()}
                placeholder="Confirm password"
                className="input w-full"
              />
              {error && <p className="text-xs text-red-600">{error}</p>}
              <Button disabled={status === 'saving-password'} onClick={savePassword}>
                {status === 'saving-password' ? 'Saving…' : 'Set password'}
              </Button>
              <button
                onClick={skipPassword}
                disabled={status === 'saving-password'}
                className="text-sm text-pip-text-soft underline"
              >
                Skip for now
              </button>
            </div>
          ) : status === 'sent' ? (
            <div className="flex flex-col gap-2.5">
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  autoFocus
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && verifyCode()}
                  placeholder="123456"
                  className="input w-full pr-11"
                />
                <button
                  type="button"
                  onClick={pasteCode}
                  aria-label="Paste code from clipboard"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-pip-text-soft hover:text-pip-primary"
                >
                  <Clipboard size={18} />
                </button>
              </div>
              {error && <p className="text-xs text-red-600">{error}</p>}
              <Button disabled={verifying || !code.trim()} onClick={verifyCode}>
                {verifying ? 'Checking…' : 'Log in'}
              </Button>
              <button
                onClick={() => {
                  setStatus('idle')
                  setCode('')
                  setError(null)
                }}
                className="text-sm text-pip-text-soft underline"
              >
                Use a different email
              </button>
            </div>
          ) : authMode === 'password' ? (
            <div className="flex flex-col gap-2.5">
              <input
                type="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input w-full"
              />
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && signInWithPasswordFlow()}
                placeholder="Password"
                className="input w-full"
              />
              {error && <p className="text-xs text-red-600">{error}</p>}
              <Button
                disabled={status === 'verifying-password' || !email.trim() || !password}
                onClick={signInWithPasswordFlow}
              >
                {status === 'verifying-password' ? 'Checking…' : 'Log in'}
              </Button>
              <button onClick={() => switchAuthMode('code')} className="text-sm text-pip-text-soft underline">
                Email me a code instead
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              <input
                type="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMagicLink()}
                placeholder="you@example.com"
                className="input w-full"
              />
              {error && <p className="text-xs text-red-600">{error}</p>}
              <Button disabled={status === 'sending' || !email.trim()} onClick={sendMagicLink}>
                {status === 'sending' ? 'Sending…' : 'Send me a login code'}
              </Button>
              <button onClick={() => switchAuthMode('password')} className="text-sm text-pip-text-soft underline">
                Already set a password? Log in with it instead
              </button>
            </div>
          )}
        </ResponseBubble>
      </div>
    </div>
  )
}

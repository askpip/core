import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppHeader } from '@/components/AppHeader'
import { ChatBubble } from '@/components/ChatBubble'
import { ResponseBubble } from '@/components/ResponseBubble'
import { Button } from '@/components/Button'
import { supabase } from '@/lib/supabase'

type Status = 'checking' | 'idle' | 'sending' | 'sent' | 'error'

/**
 * Real entry gate: magic-link sign-in via Supabase Auth. No password —
 * gardener enters an email, gets a one-time code, typing it in signs them in.
 * Google sign-in and email+password can be added alongside this later
 * without changing the flow below.
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
 * Handles two situations on mount:
 *  - Already has a session (e.g. reopening the app) -> skip straight to /library.
 *  - Arriving from a clicked magic link (?code=... in the URL) -> exchange
 *    the code for a session, then go to /library. The exchange is done here
 *    manually (supabase.ts sets detectSessionInUrl: false) because HashRouter
 *    also owns the URL hash and would otherwise race with supabase-js's own
 *    auto-detection.
 */
export function AuthGate() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [status, setStatus] = useState<Status>('checking')
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(authUrl)
        if (!active) return
        if (exchangeError) {
          setError(exchangeError.message)
          setStatus('idle')
          return
        }
        navigate('/library', { replace: true })
        return
      }

      const { data } = await supabase.auth.getSession()
      if (!active) return
      if (data.session) {
        navigate('/library', { replace: true })
        return
      }
      setStatus('idle')
    }

    settle()
    return () => {
      active = false
    }
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

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: code.trim(),
      type: 'email',
    })

    if (verifyError) {
      setError(verifyError.message)
      setVerifying(false)
      return
    }
    navigate('/library', { replace: true })
  }

  return (
    <div className="flex h-full flex-col">
      <AppHeader />

      <div className="px-4 pt-6">
        <ChatBubble>
          Hi, I'm Pip! Enter your email and I'll send you a code to log in — no password needed.
        </ChatBubble>
        <ResponseBubble>
          {status === 'checking' ? (
            <p className="text-sm text-pip-text-soft">Checking for an existing session…</p>
          ) : status === 'sent' ? (
            <div className="flex flex-col gap-2.5">
              <p className="text-sm text-pip-text-soft">
                Check your inbox at <span className="font-medium text-pip-text">{email}</span> —
                enter the code from that email below (or click the link in it, either works).
              </p>
              <input
                type="text"
                inputMode="numeric"
                autoFocus
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && verifyCode()}
                placeholder="123456"
                className="input w-full"
              />
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
            </div>
          )}
        </ResponseBubble>
      </div>
    </div>
  )
}

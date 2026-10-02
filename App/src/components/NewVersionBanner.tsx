import { useEffect, useState } from 'react'
import { newVersionAvailable, refreshToLatest } from '@/lib/homeScreen'

/** How often to look for a new version while the app stays open. */
const CHECK_EVERY_MS = 30 * 60 * 1000

/**
 * "A new version of Ask Pip is ready." A home-screen app can stay open for days, so
 * the page looks for a newer build when it opens, whenever the gardener comes back to
 * it (several signals, because phones differ in which one they send to a home-screen
 * app), and every half hour. Refresh loads the new build (see refreshToLatest). The menu's
 * "Check for updates" does the same check on request.
 * Wording approved "for now" by a Founder in chat, 2 October 2026.
 */
export function NewVersionBanner() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    const check = () => {
      void newVersionAvailable().then((yes) => {
        if (yes && !cancelled) setReady(true)
      })
    }
    const onVisible = () => {
      if (document.visibilityState === 'visible') check()
    }
    check()
    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('focus', check)
    window.addEventListener('pageshow', check)
    window.addEventListener('online', check)
    const timer = window.setInterval(check, CHECK_EVERY_MS)
    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('focus', check)
      window.removeEventListener('pageshow', check)
      window.removeEventListener('online', check)
      window.clearInterval(timer)
    }
  }, [])

  if (!ready) return null
  return (
    <div
      role="status"
      className="absolute inset-x-3 bottom-3 z-50 flex items-center gap-3 rounded-2xl bg-pip-primary px-4 py-3 text-white shadow-xl"
    >
      <p className="flex-1 text-sm leading-snug">A new version of Ask Pip is ready.</p>
      <button
        onClick={() => void refreshToLatest()}
        className="min-h-11 shrink-0 rounded-full bg-white px-4 py-2 text-sm font-bold text-pip-primary"
      >
        Refresh
      </button>
    </div>
  )
}

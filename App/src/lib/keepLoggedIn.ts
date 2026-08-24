/**
 * Backs the "Keep me logged in on this device" checkbox on the one-time
 * name-onboarding screen (see pages/NameOnboarding.tsx). The preference
 * itself is a small, non-sensitive flag, always kept in localStorage so it
 * survives even when the session it's governing doesn't — that's what lets
 * a later sign-in (see AuthGate.tsx) apply the same choice again without
 * asking a second time.
 *
 * supabase.ts's client is built with a storage adapter that reads this
 * preference on every get/set/remove, delegating to localStorage (persists
 * across browser restarts) when checked, or sessionStorage (cleared when
 * the tab/browser closes) when not — see dynamicStorage there.
 */
const PREFERENCE_KEY = 'askpip-keep-logged-in'

// Every key supabase-js's storage adapter writes for this project is
// prefixed 'sb-' (it encodes the project ref, which we don't want to
// hardcode here) — used below to migrate an already-written session
// between localStorage and sessionStorage without needing to know the
// exact key name.
const SUPABASE_KEY_PREFIX = 'sb-'

/** Defaults to true (persist across restarts) until the gardener says otherwise. */
export function getKeepLoggedIn(): boolean {
  try {
    return window.localStorage.getItem(PREFERENCE_KEY) !== 'false'
  } catch {
    // Storage can throw in locked-down contexts (private browsing with
    // storage disabled, etc.) — fail toward the previous default behavior.
    return true
  }
}

/**
 * Called once, from NameOnboarding's Save button. By the time the gardener
 * reaches that screen they're already signed in (verifyOtp ran during
 * AuthGate, before this screen existed), so their session was already
 * written under whatever the PREVIOUS preference was — this migrates it to
 * the right place for the NEW choice, then records the choice itself so
 * every future get/set through the client's storage adapter agrees with it.
 */
export function setKeepLoggedIn(keep: boolean): void {
  try {
    const from = keep ? window.sessionStorage : window.localStorage
    const to = keep ? window.localStorage : window.sessionStorage

    const keysToMove: string[] = []
    for (let i = 0; i < from.length; i++) {
      const key = from.key(i)
      if (key && key.startsWith(SUPABASE_KEY_PREFIX)) keysToMove.push(key)
    }
    for (const key of keysToMove) {
      const value = from.getItem(key)
      if (value !== null) to.setItem(key, value)
      from.removeItem(key)
    }

    window.localStorage.setItem(PREFERENCE_KEY, keep ? 'true' : 'false')
  } catch {
    // If storage is unavailable there's nothing to migrate or remember —
    // the gardener just stays signed in for this tab, which fails safe.
  }
}

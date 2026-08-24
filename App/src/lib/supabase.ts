import { createClient } from '@supabase/supabase-js'
import { getKeepLoggedIn } from './keepLoggedIn'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase config. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local — see .env.example.',
  )
}

/**
 * Backs the "Keep me logged in on this device" checkbox on the
 * name-onboarding screen (see lib/keepLoggedIn.ts). Every read/write the
 * client does goes through here, so it always lands in the store that
 * matches the gardener's choice — localStorage (survives closing the
 * browser) if checked, sessionStorage (cleared when the tab/browser
 * closes) if not — without the client itself needing to know which.
 */
const dynamicStorage = {
  getItem: (key: string) => (getKeepLoggedIn() ? window.localStorage : window.sessionStorage).getItem(key),
  setItem: (key: string, value: string) =>
    (getKeepLoggedIn() ? window.localStorage : window.sessionStorage).setItem(key, value),
  removeItem: (key: string) => (getKeepLoggedIn() ? window.localStorage : window.sessionStorage).removeItem(key),
}

/**
 * Shared Supabase client for the whole app (auth + database).
 *
 * flowType is set to 'pkce' and detectSessionInUrl to false on purpose: the
 * app uses HashRouter, which also owns the URL hash, so we can't let
 * supabase-js auto-parse tokens out of the hash on load — it would race with
 * routing. PKCE puts its one-time code in the query string instead
 * (?code=...), which HashRouter never touches, and AuthGate exchanges it for
 * a session manually. See AuthGate.tsx.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: 'pkce',
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    storage: dynamicStorage,
  },
})

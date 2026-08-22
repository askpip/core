import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase config. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local — see .env.example.',
  )
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
  },
})

/// <reference types="vite/client" />

/** Set at build time in vite.config.ts: the commit and the time this build was made. */
declare const __APP_BUILD__: { commit: string; builtAt: string }

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

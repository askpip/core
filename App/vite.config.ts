import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// Which build this is, shown in the menu's About panel so anyone can tell which version a
// phone is running (2 October 2026). Vercel supplies the commit; a build made elsewhere
// says "local". The time is when the build was made.
const appBuild = {
  commit: (process.env.VERCEL_GIT_COMMIT_SHA ?? 'local').slice(0, 7),
  builtAt: new Date().toISOString(),
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    __APP_BUILD__: JSON.stringify(appBuild),
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})

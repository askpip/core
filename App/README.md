# Ask Pip — App

React/Vite/TypeScript client for AskPIP. Not just a prototype any more — real
gardeners can sign in, build plant profiles, and run a guided pruning
journey, with the dead-wood observation backed by a live AI look (see
Deployment and What's built below). Still early: only one of the four
scripted observations has real research behind it yet.

## Stack

- React 19 + Vite (client-side SPA, no SSR), HashRouter (so client-side
  routing needs no server rewrite rules on deploy — see Deployment)
- Tailwind CSS v4 + Radix UI primitives (shadcn-style components)
- Framer Motion for transitions
- Supabase — auth (email one-time-code, PKCE flow), Postgres (plant
  projects, observations, notes), and Storage (private, per-user
  gardener-uploaded photos) — see `src/lib/supabase.ts`, `src/lib/store.ts`,
  `supabase/schema.sql`
- One Supabase Edge Function, `pip-observe-dead-wood` (Deno) — calls Gemini,
  bounded to the real per-signal dead-wood diagnostic content from
  `PKR-OBS-000001`, to give a genuine live read of the gardener's own photo
  instead of reciting the static script. See `supabase/functions/` and
  `src/lib/pipObserve.ts`.

## Running it locally

```
npm install
npm run dev
```

Needs `.env.local` (copy `.env.example`) with `VITE_SUPABASE_URL` and
`VITE_SUPABASE_ANON_KEY` — both public/publishable values, safe to commit to
a local, gitignored file. Get them from the Supabase dashboard for the
"AskPip" project if you don't already have them.

## Deployment

**Live at <https://app.askpip.garden>.** Hosted on Vercel, connected to the
`askpip/core` GitHub repository, with the project's **Root Directory set to
`App`** (this app lives in a subfolder of the monorepo, not the repo root).
Vercel auto-deploys on every push to `main` — build command `npm run build`,
output directory `dist` (both auto-detected), environment variables
`VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` set in the Vercel project
settings, same values as `.env.local` above.

**Do not assume deployment "isn't set up yet"** — check here, or ask,
before concluding that. (This line exists because an earlier AI session
did exactly that, having read a stale draft of this file, and asked the
Founder to sign up for a Vercel account that already existed and had
already shipped two prior releases.)

**The Edge Function deploys separately, not through Vercel or `git push`.**
Vercel only builds and deploys this static client. `supabase/functions/pip-observe-dead-wood/index.ts`
is committed here for version control, but pushing it to git does **not**
put it live — it has to be deployed directly to the Supabase project, either
via the `mcp__Supabase__deploy_edge_function` MCP tool or `supabase functions deploy pip-observe-dead-wood`
from the Supabase CLI. After editing that file, redeploy it that way, then
separately commit/push the source for version control.

The Edge Function's `GEMINI_API_KEY` is a Supabase secret (Project Settings →
Edge Functions → Secrets on the Supabase dashboard), set directly by the
Founder — never in client code, never in a Vercel environment variable, and
not something an AI session should set on the Founder's behalf even with the
key in hand (see the credential-handling note in `Working/Project_Backlog.md`
if this needs re-confirming).

The custom domain (`app.askpip.garden`) is already live — it does not need
re-configuring. If a future domain/DNS change is ever needed, that's a
distinct, explicit step from an ordinary deploy.

## What's built

- **Welcome / sign-in** — email one-time-code auth (`AuthGate.tsx`), no
  password.
- **Library** (`/library`) — dashboard of the gardener's plant projects.
- **New Plant** (`/new-plant`) — Bush Rose Profile questionnaire, saved
  progressively as it's answered; location capture (GPS or manual) derives
  hemisphere/season automatically.
- **Journey** (`/journey/:id`) — the guided pruning journey: a real safety
  checklist, the recently-planted Suitability Gate (`PKR-SGT-000002`, fully
  wired — restricts a young rose's journey to dead-wood only), a real
  photo step (camera capture or upload, not placeholders), and the four
  scripted observations (dead wood, crossing stems, inward stem, framework
  stem), each with confirm/correct/unresolved and a four-choice decision
  (Cut / Leave / Decide later / Get experienced local help).
  - **Dead wood** is the one observation with real, Founder-approved
    per-signal research behind it (`PKR-OBS-000001`) — its "Show Me" step
    shows the gardener's own photo and calls the live AI Edge Function for
    a genuine read, with confidence/source tap-to-reveal drawing verbatim
    from the matching Definition/Source PKRs, and a hard fallback to the
    original static script on any failure.
  - The other three observations are still the original static script from
    `MVP/Stories/Maries_Story.md` — no per-signal research exists for them
    yet, so there's nothing to ground a live version on. See
    `Working/Project_Backlog.md` for what that would take.
- **Plant Project** (`/plant/:id`) — the resulting journal/history view:
  observations, progress photos, free-text notes.

## What's open / next steps

Tracked in `Working/Project_Backlog.md`, not duplicated here — that file is
kept current every session and is the single source of truth for open
items, gaps, and paused work. Duplicating a second list in this README is
exactly how the deployment note above went stale; don't repeat that here.

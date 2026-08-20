# Ask Pip — App Shell

Early prototype of the Ask Pip application. Built to get a feel for the Bush Rose V1 MVP journey (see `../MVP/`), not yet a production app.

## Stack

Matches the existing mindmoviestudio app:

- React 18 + Vite (client-side SPA, no SSR)
- Tailwind CSS v4 + Radix UI primitives (shadcn-style components)
- Framer Motion for transitions
- Supabase client installed but **not wired up yet** — the app currently persists plant projects to `localStorage` via `src/lib/store.ts`. Swap that hook's internals for Supabase queries when real auth/persistence is needed; the pages only depend on its return shape.

## Running it

```
npm install
npm run dev
```

## What's built

- **Welcome** — hero + "Begin", matches the approved wordmark artwork.
- **Library** (`/library`) — dashboard of the gardener's plant projects.
- **New Plant** (`/new-plant`) — minimal Bush Rose Profile form (Architecture section 6.1).
- **Journey** (`/journey/:id`) — the guided pruning journey: safety checklist, photo step, and the four supported observations (dead wood, crossing stems, inward stem, framework stem) each with confirm/correct/unresolved and the four-choice decision (Cut / Leave / Decide later / Get experienced local help). Observation copy is drawn directly from `MVP/Stories/Maries_Story.md`, not invented.
- **Plant Project** (`/plant/:id`) — the resulting journal/history view, modeled on the approved app mockups in `../Graphics/`.

Photos are placeholders (`PhotoPlaceholder` component) — real camera/upload capture isn't wired up yet, since photos are gardener-supplied at runtime rather than fixed assets.

## Known gaps / next steps

- `pip-front.png` and `hero-garden.png` in `src/assets/pip/` are large source renders (1.2–1.8 MB each) — fine for a local prototype, worth compressing before any real deploy.
- No camera/photo upload, no vision-model interpretation — the observation flow is scripted from the approved story, not driven by real photo analysis.
- No Supabase auth or persistence — everything is local to the browser (`localStorage`).
- No deployment configured yet (Vercel + `app.askpip.garden` DNS is a separate, explicit step).

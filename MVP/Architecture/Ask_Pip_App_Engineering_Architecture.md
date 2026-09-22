# Ask Pip App Engineering Architecture

## Document Metadata

**Document Title:** Ask Pip App Engineering Architecture
**Document Type:** MVP Architecture
**Version:** 0.1
**Status:** Draft — for Founder Review
**Owner:** The Founders
**Approved By:** AskPIP Founder Authority
**Permanent Location:** `MVP/Architecture/Ask_Pip_App_Engineering_Architecture.md`
**Last Updated:** 23 September 2026
**Purpose:** To orient any artificial intelligence (AI) or engineer to the Ask Pip application's technical structure before changing its code — the tech stack, file layout, cross-cutting patterns and their rationale, and the gotchas that are easy to reintroduce without this context.
**Related Documents:** `MVP/Architecture/Ask_Pip_MVP_Bush_Rose_V1_Architecture.md` (referred to below as the Bush Rose V1 Architecture); the Pip Runtime Architecture; `AI/Context/Ask_Pip_App_Build_Status_Context.md`; `AI/Context/Ask_Pip_App_Known_Issues_and_Process_Notes_Context.md`; `AI/PIP_AI_Loading_Guide.md`

---

# 1. Purpose and Scope

The Bush Rose V1 Architecture and the Pip Runtime Architecture govern what the application is for and what it is and is not allowed to claim. This document governs how the application is actually built — the engineering layer beneath that product layer. It exists because that engineering knowledge currently lives only as scattered, if excellent, in-code comments: accurate, but requiring a full cold read of every file to assemble. This document assembles the load-bearing parts of it in one place.

It does not restate product requirements, horticultural content rules, or the Decision Layer / Interface Layer boundary — see the Pip Runtime Architecture for those. It does not track what is currently built — see the Ask Pip App Build Status Context for that.

# 2. Tech Stack and Repository Location

The application lives at `App/` within PIP CORE (`C:\AskPIP\core\App` on the Founder's linked device). It is a Vite-built React application written in TypeScript, routed client-side with React Router's `HashRouter` (`App.tsx`), styled with Tailwind-style utility classes, animated between phases with `framer-motion`, and iconed with `lucide-react`. Its backend is Supabase: Postgres for data, Supabase Auth for sign-in, and a private Supabase Storage bucket for photos.

`App/` source is not mirrored into the Garden Shed Office's `shed_items` table the way documentation and governance content is — see the Known Issues Context. Verify app code state against the device directly, not against Supabase.

# 3. Routing and Screen Flow

`App.tsx` defines every route and wraps each in `RequireAuth`, which redirects to the sign-in gate (`AuthGate`, at `/`) when there is no live Supabase session. The screens, in the order a new gardener normally meets them: `AuthGate` → `NameOnboarding` → `Welcome` → `Library` (the plant list, the home screen a gardener returns to) → `NewPlant` (onboarding a rose) → `PlantProject` (one rose's own page) → `Journey` (the guided pruning journey) → back to `PlantProject`. `Learn` and `LearnTopic` sit alongside this main flow, reachable from `Library`'s home-screen card and from the header's overflow menu on any screen (`AppHeader.tsx`).

`AppHeader.tsx` computes "Back" from a fixed per-route parent table (`BACK_TARGETS`) rather than the browser's session history, because a page reached by direct or refreshed URL has no reliable history to unwind. A page with its own internal steps — `Journey.tsx` is the current example — overrides this with its own `onBack` handler instead of relying on the route-level default.

# 4. The App-Type / Row-Type Split

`lib/types.ts` deliberately keeps two families of type apart: `PlantProject`, `ObservationRecord` and their siblings (what every page component reads and writes), and `BushRoseProfileRow`, `ObservationRow` and their siblings (the exact shape of the corresponding Supabase tables, snake_cased columns included). `lib/store.ts`'s `toPlantProject()` is the only place that converts between them. A page component should never import or construct a `*Row` type directly — if a change seems to need that, the conversion belongs in `store.ts`, not in the page.

## 4.1 The `id` vs. `feature` Gotcha

An `ObservationRecord`'s `id` field is a database-generated UUID once it has been saved and reloaded — not the scripted id (`'dead-wood'`, `'crossing-stems'`, and so on) it was created with. Anything that needs to match a saved observation back to its entry in `data/observationScript.ts` must match on the `feature` string field, which is preserved verbatim, not on `id`. This is documented in `store.ts`'s `addObservation` comment, and is exactly the mechanism the pause-and-resume logic in `Journey.tsx`'s `beginObservations()` relies on (see the Build Status Context, §3).

# 5. Photo Storage

Photos live in a private Supabase Storage bucket (`plant-photos`; see `lib/photos.ts`). Its row-level security checks only the first path segment against `auth.uid()` — it has no foreign-key dependency on a `bush_rose_profiles` row existing, which is what made reordering the cover photo ahead of profile creation in `NewPlant.tsx` safe (see the Build Status Context's photo-first onboarding entry). Paths follow `${userId}/${profileId}/${slot}` for fixed one-per-plant slots (`overview`, `journey-overview`, `variety-label`) and `${userId}/${profileId}/${gallery}/${photoId}` for galleries that accumulate rather than overwrite (progress photos, journey close-ups). Nothing stores a public URL: every display goes through a freshly requested, time-limited signed URL (`getPlantPhotoUrl` / `usePlantPhotoUrl`), since the bucket is private by design.

# 6. Journey's Phase State Machine

`Journey.tsx` drives the guided pruning journey through a `Phase` union (`'safety' | 'planted-primary' | 'planted-fallback' | 'photos' | 'observe' | 'decide' | 'summary'`) held in local component state, alongside `obsIndex`, `records`, and several `pending*` confirmation flags. A `history` stack records `{ phase, obsIndex }` snapshots on every forward transition so the header's "Back" can step through the journey's own internal phases rather than only the route level.

Each observation is saved to Supabase as soon as it is completed (`recordChoice` calling `addObservation`), not batched until the journey ends — `store.ts`'s comment on `addObservation` explains why. `journeyComplete` is a separate flag set only once, at the very end (`finish()`), after every individual observation has already landed. This is what makes pause-and-resume possible at all: the data needed to resume already exists in `project.observations` the moment a gardener leaves partway through, without any separate "in-progress journey" record.

Every new `pending*` confirmation gate added to this phase machine (trace-the-stem confirmation is the current example) needs to be reset in the same three places the existing ones are: `beginObservations()`, `goBack()`, and `recordChoice()`, and included in the `motion.div` key that drives the phase-transition animation — missing one of these leaves a stale confirmation panel showing after a state change that should have cleared it.

# 7. Suitability Gating

`lib/suitabilityGates.ts` implements PKR-SGT-000002's recently-planted check. Its result (`RecentlyPlantedGateResult`) can restrict `Journey.tsx`'s `allowedObservations` to a subset of the full `observationScript` — currently dead wood only, when restricted — rather than always offering all six. Anything that iterates observations in `Journey.tsx` must read from `allowedObservations`, never `observationScript` directly, or it will offer observations the gate has disallowed.

# 8. Observation Content and the Decision/Interface Layer Boundary

`data/observationScript.ts` holds the static content `Journey.tsx`'s `'observe'` phase shows. Only `dead-wood` currently carries real, Founder-approved diagnostic content (`confidenceLevel`, `sources`) grounded in PKR-OBS-000001 — the other three entries are unresearched placeholder script, by design, pending the FRDs tracked in the Build Status Context. `dead-wood` additionally has a live AI assessment (`lib/pipObserve.ts`'s `askPipAboutDeadWood`, called from `Journey.tsx`'s `useEffect` on reveal) that mirrors the validated spike at `Spike/gemini/run-spike-signals.mjs` — this is the only place in the application where the Interface Layer's Perception role (per the Pip Runtime Architecture) is actually wired to a live model call rather than a static script. It fails closed: any error sets `aiFailed` and the render falls back to the static script exactly as if the feature did not exist, never surfacing a raw error or blocking the journey.

The same content-origin discipline applies to `data/learnTopics.ts`: its own top-of-file comment states plainly that it holds only "About Ask Pip" topics (how the journey works, what the four choices mean, how Pip reads a photo) and deliberately no rose-care content, because that is gated behind the same Founder-reviewed research. Any change that adds a new Learn topic must respect that boundary — a horticultural claim does not belong in this file until its FRD has cleared review, been compiled into an ARC, and published as a PKR.

# 9. Verifying Engineering Changes

`npm run build` and any linting have not been reliably runnable through the Cowork device bridge across recent sessions — see the Known Issues Context for the specific failure pattern and the fallback verification approach (stage/edit/commit plus an `esbuild`-based syntax check) used in their place. Attempt the real build first in any new session; the tooling may have recovered. When it has not, be explicit in any completion report about exactly what was and was not verified, per the Verify Before Claiming Skill — a syntax check is not a type check, and neither is a substitute for the Founder confirming the app actually behaves as intended once pushed.

# 10. Revision Log

- **23 September 2026 (Version 0.1):** Initial version, written after building Phase A (photo-first onboarding, trace-the-stem confirmation, journey pause/resume, the Learn home-screen entry point) and exploring the codebase in the course of that work.

# End of Document

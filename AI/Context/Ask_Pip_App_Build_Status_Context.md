# Ask Pip App Build Status

## Document Metadata

**Document Title:** Ask Pip App Build Status
**Document Type:** PIP Artificial Intelligence Operating System (PIP AI OS) Context
**Version:** 0.2
**Status:** Draft — for Founder Review
**Owner:** The Founders
**Approved By:** AskPIP Founder Authority
**Permanent Location:** `AI/Context/Ask_Pip_App_Build_Status_Context.md`
**Last Updated:** 29 September 2026
**Purpose:** To give any artificial intelligence (AI) or Founder a current, accurate snapshot of what is actually built in the Ask Pip application, what is deliberately deferred and why, and what remains blocked pending Founder-approved knowledge — without requiring that state to be reconstructed from git history, conversation history or a fresh reading of every source file.
**Related Documents:** `AGENTS.md`; `AI/PIP_AI_Operations_Manual.md`; `AI/PIP_AI_Loading_Guide.md`; `MVP/Architecture/Ask_Pip_App_Engineering_Architecture.md`; `MVP/Journeys/Ask_Pip_MVP_Bush_Rose_V1_First_Guided_Care_Journey.md`; `Working/AI Outputs/Ask_Pip_Bush_Rose_Guided_Journey_Flow_Proposal.md`; `AI/Context/Ask_Pip_App_Known_Issues_and_Process_Notes_Context.md`

---

# 1. Purpose and Scope

This Context tracks implementation status only: what exists in the Ask Pip application right now, distinct from what the application should eventually do.

It does not govern product requirements (see the Flow Proposal and the approved MVP Journey document) or the codebase's technical structure (see the Ask Pip App Engineering Architecture). It is deliberately narrow so it stays accurate: a status list that tries to also explain design intent or architecture drifts out of date faster than one that only says what is built.

This document is not itself a Shed to-do or task list. The Garden Shed Office's own to-dos (`shed_todos`) track outstanding review and action items and should be checked directly for those — see the Garden Shed Operations Skill. This Context exists because an AI session's own task list (the `TaskList`/`TaskUpdate` tools) is session-scoped and does not persist to a future session; this document is the durable record that does.

# 2. Keeping This Current

Any AI that completes a change to the application's build status — something newly built, something newly deferred, something newly unblocked — shall update this document before reporting that work as complete, per the Verify Before Claiming Skill. Record what changed in the Revision Log at §6 rather than only in the body, so a reader can see the document's own history without comparing it against git.

This document should be treated as provisional between updates: it reflects the state as last recorded, not a live query. Section 5 gives the ways to confirm current state directly when precision matters.

# 3. Phase A — Buildable Without New Knowledge

The Flow Proposal's Build Sequence (§12) defines Phase A as everything the guided journey needs that does not depend on Founder-approved horticultural content. The items below have been built and committed to the application, each confirmed byte-identical against the source the AI wrote before the Founder was given the push command; git push itself was reported by the Founder as complete but has not been independently verified by AI against the remote repository (see the Verify Before Claiming Skill's distinction between a local write succeeding and a remote surface being confirmed).

**Photo-first onboarding** (`App/src/pages/NewPlant.tsx`). The cover-photo step now opens the onboarding questionnaire instead of closing it; the photo is attached to the plant record at creation rather than in a separate terminal step; skipping remains allowed.

**Trace-the-stem confirmation** (`App/src/pages/Journey.tsx`). Every "Cut" decision is gated by a confirmation asking whether the gardener can trace the stem to the exact point they intend to cut, before the existing safety-checklist confirmation (which only fires when something on that checklist was left unsure) gets a chance to run.

**Journey pause and resume** (`App/src/pages/Journey.tsx`). Revised 29 September 2026: because every observation now loops and can have several instances, `beginObservations()` treats an observation as finished only when its explicit `'none-remaining'` marker row has been saved (written when the gardener answers no to "Can you see any more …?"). It resumes at the first observation of the session without a marker. Markers are hidden from the plant journal and from its confidence figure (`App/src/pages/PlantProject.tsx`). **The live database needs a one-line constraint change before markers can be saved** (see §3.3).

**Prominent Learn entry point** (`App/src/pages/Library.tsx`). A "Learn with Pip" card now sits on the home/plant-list screen, in addition to the existing `/learn` entry in the header's overflow menu.

**Journal and growth visibility** (`App/src/pages/PlantProject.tsx`). Confirmed already fully built — observations, notes, progress photos and nursery-label display were all present before this round of work; nothing was added.

## 3.1 Deferred Within Phase A

**Photo spot and knot question on the profile (Know tier).** Not started. This needs a Supabase schema change (new columns on `bush_rose_profiles`), and was deliberately not attempted in a session where `npm run build` could not be run reliably (see the Known Issues Context) — a schema migration is a materially higher-risk change to make unverified than a UI-only edit.

**Primer shell (card 5 only).** Not started. The Flow Proposal scopes this to Phase A as a shell with only one real card; the remaining four cards are Phase B, gated on Founder-approved knowledge. This was judged a larger, separate piece of new UI rather than an edit to an existing page, and was left for its own pass.

## 3.2 Not Yet Reconciled Against the Full Phase A List

The Flow Proposal's §12 Build Sequence also lists a front-door explainer, a Learn "About Ask Pip" shelf, and contextual links throughout the app. `App/src/pages/AboutPip.tsx` and the "About Ask Pip" topics in `App/src/data/learnTopics.ts` already exist in the codebase, but their exact scope has not been checked line-by-line against the Flow Proposal's specification in the course of producing this document. Treat their status as **likely built, not verified** until a future session does that reconciliation, and update this section once it has.

## 3.3 Guided Journey Wired to Published PKRs (29 September 2026)

The pruning journey now runs on Published knowledge. `npm run build` (TypeScript and Vite) and `oxlint` pass in the cloud clone. **The journey has not yet been clicked through in a browser**, because that needs a signed-in session.

- **PKR data module** (`App/src/data/pkr.ts`, `App/src/data/pkrSources.ts`). Gardener-facing wording is transcribed from the Published PKRs: SGT-000001 v1.1, SGT-000002, SGT-000003, OBS/DEC-000001 to 000007, and CGD-000001 to 000006. Every record carries id, version and status. Only `Published` records are exposed, through the `published*` accessors. `pkrSources.ts` is generated from the Source PKR files and lists each PKR's Supporting Source(s) with its web address. It feeds "Where this comes from".
- **Rose-type gate** (PKR-SGT-000003). It runs first. Only a stated Hybrid Tea, Floribunda or Grandiflora passes; Grandiflora shows its provisional note. A known variety name goes to the NZ Rose Society Rose Finder. Every other answer ends at a journal-only screen saying "I can't yet help prune this rose…". No basic care is shown there.
- **Dormancy gate** (PKR-SGT-000001 v1.1). Interactive, with the mild-climate caveat and the "Not sure" fallback wording. It replaces the old self-attested checkbox. Dormant gives the full journey. Growing, or still not sure, gives the removal-only session: dead wood, damaged growth and suckers, with its conditions and the late-season advisory.
- **Recently-planted gate** (PKR-SGT-000002). Unchanged. When it restricts, the session is dead wood only.
- **Observations.** The session runs through dead wood, damaged growth, crossing/rubbing, inward, weak/congested, suckers and main framework, each filtered by the gates. Each observation offers Confirmed, Doesn't match and Not sure.
  - **Doesn't match** is recorded and never reaches Cut. The one exception is the framework's defined old-wood path.
  - **Not sure** shows the record's own guidance. If the gardener is still unsure, only the non-Cut choices are offered.
  - Each observation loops on "Can you see any more …?".
  - **Suckers** add the visible-bud-union step (D6). The growing-season supporting signs appear only in the removal-only session (D5).
- **Decision Logic.** Each observation shows its DEC record's choices and notes with per-claim confidence. Cut still requires the trace-the-stem confirmation and the safety-checklist check.
- **Care Guidance at its presentation points.**
  - CGD-000001 (tools) and CGD-000003 (one-third advisory) appear before the first Cut under DEC-000001 to 000006. The advisory repeats after every third such Cut.
  - CGD-000002 (making the cut) appears after the Cut is confirmed, using the part that fits the kind of cut.
  - Sucker removal shows DEC-000007's own method instead.
- **Basic-care branch.** When SGT-000001 or SGT-000002 limited the session, CGD-000005 (if recently planted), CGD-000004 and CGD-000006 are shown before the summary, with the UK/US disclosure. Nothing is shown for journal-only roses.
- **Removed:** `App/src/data/observationScript.ts`, the old four-item script with three placeholders.

**Added later on 29 September 2026 (Shaphan: "1 add rose type database. 2 establish rose type during add a plant. 3 skip on the journey. 4 show basic care in the plant's journal"):**

- **Database.** New `bush_rose_profiles.rose_type` column: `hybrid-tea`, `floribunda`, `grandiflora`, `excluded`, `bush-only` or `unknown`; null means not asked yet. It's applied to Supabase and verified by query. The `observations.outcome` change for `'none-remaining'` is also applied and verified.
- **Add a plant** (`NewPlant.tsx`) asks PKR-SGT-000003's question once, after the nursery-label step, using the shared `RoseTypeQuestion` component.
  - A type that doesn't pass gets the plain "can't yet help prune" message there.
  - The earlier "What type of rose is this?" question, which actually asked for the variety name, now reads "Do you know its variety name?".
- **Journey.** A saved type skips the question. A passing type goes straight to the recently-planted check; any other type goes to the journal-only screen. Plants without a saved type are asked once, and the answer is saved.
- **Plant page** (`PlantProject.tsx`):
  - shows the saved type and lets the gardener change it;
  - for a Hybrid Tea, Floribunda or Grandiflora, shows "Caring for your …" with CGD-000004 and CGD-000006 and the UK/US disclosure (the journal care reference);
  - shows nothing for journal-only roses.

**Outstanding for the app:**

- **Comparison images** are still a documented gap. The UI says so.

# 4. Phase B — Blocked on Founder-Approved Knowledge

Phase B covers the Primer's remaining horticultural cards, the "Pruning your bush rose" Learn shelf, the before-you-cut lesson, and observation ordering. None of it can be built with real content until the underlying research clears Founder review, is compiled into an Approved Research Compilation (ARC), and is published as a PIP Knowledge Record (PKR) by the Knowledge Integration Technician (KIT). Writing placeholder horticultural content into the app ahead of that is exactly the problem `learnTopics.ts`'s own governing comment warns against, and shall not be done to make Phase B appear further along than it is.

**Updated 29 September 2026:** the six FRDs previously listed here were all reviewed, compiled into ARCs, and published as PKRs. The suckers and post-bud-break commissions were published too. The guided journey itself is no longer blocked (§3.3). What remains Phase B is the Primer's horticultural cards, the "Pruning your bush rose" Learn shelf and the before-you-cut lesson, which can now be written from the Published PKRs.

# 5. Verifying Current Status Directly

This document can go stale the moment a session forgets to update it. Where precision matters, check directly:

- **App code state:** stage the relevant file from the device (`C:\AskPIP\core\App\src\...`) and read it, or ask the Founder to confirm a push landed. `App/` source is not mirrored into the Garden Shed's `shed_items` table — only the documentation and governance folders are (see the Known Issues Context) — so Supabase queries cannot confirm app code state.
- **FRD review status:** query `shed_form_responses` for the relevant `shed_items` id. An empty result means no review has been recorded yet, regardless of what a to-do's status field says (to-do status reflects who has opened or touched the to-do, not whether a review was actually submitted).
- **Session task list:** the `TaskList` tool reflects only the current AI session's own tracking and does not carry forward. Do not treat it as a source of project state for a new session.

# 6. Revision Log

- **23 September 2026 (Version 0.1):** Initial version. Records Phase A as built: photo-first onboarding, trace-the-stem confirmation, journey pause/resume, the Learn home-screen entry point, and confirms journal/growth visibility was already complete. Records the knot-question/photo-spot fields and the Primer shell as deferred within Phase A, and the front-door explainer / About Ask Pip shelf / contextual links as built but not yet reconciled against the Flow Proposal's exact specification. Records six FRDs as the current Phase B blocker.

- **29 September 2026 (Version 0.2):** Added §3.3, the guided journey wired to Published PKRs: PKR data module, rose-type and interactive dormancy gates, removal-only session, observation loops with the none-remaining resume marker, Decision Logic, Care Guidance and the basic-care branch. The build passes. Recorded as outstanding: the database constraint change, rose type not saved, the journal care reference, and comparison images. §4 updated because the six FRDs are now published.

- **29 September 2026 (Version 0.2, later the same day):** Rose type is now saved on the plant and asked once, in Add a plant. The journey skips the question when a type is saved. The plant page shows and changes the type, and shows basic care for supported types. Both database changes are applied and verified.

# End of Document

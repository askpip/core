# Ask Pip App Build Status

## Document Metadata

**Document Title:** Ask Pip App Build Status
**Document Type:** PIP Artificial Intelligence Operating System (PIP AI OS) Context
**Version:** 0.1
**Status:** Draft — for Founder Review
**Owner:** The Founders
**Approved By:** AskPIP Founder Authority
**Permanent Location:** `AI/Context/Ask_Pip_App_Build_Status_Context.md`
**Last Updated:** 23 September 2026
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

**Journey pause and resume** (`App/src/pages/Journey.tsx`). `beginObservations()` now reconciles the project's already-saved observations against the current `allowedObservations` list, matched by the `feature` string (see the Engineering Architecture's note on why `id` cannot be used for this match), and resumes at the first observation not yet completed rather than restarting the sequence.

**Prominent Learn entry point** (`App/src/pages/Library.tsx`). A "Learn with Pip" card now sits on the home/plant-list screen, in addition to the existing `/learn` entry in the header's overflow menu.

**Journal and growth visibility** (`App/src/pages/PlantProject.tsx`). Confirmed already fully built — observations, notes, progress photos and nursery-label display were all present before this round of work; nothing was added.

## 3.1 Deferred Within Phase A

**Photo spot and knot question on the profile (Know tier).** Not started. This needs a Supabase schema change (new columns on `bush_rose_profiles`), and was deliberately not attempted in a session where `npm run build` could not be run reliably (see the Known Issues Context) — a schema migration is a materially higher-risk change to make unverified than a UI-only edit.

**Primer shell (card 5 only).** Not started. The Flow Proposal scopes this to Phase A as a shell with only one real card; the remaining four cards are Phase B, gated on Founder-approved knowledge. This was judged a larger, separate piece of new UI rather than an edit to an existing page, and was left for its own pass.

## 3.2 Not Yet Reconciled Against the Full Phase A List

The Flow Proposal's §12 Build Sequence also lists a front-door explainer, a Learn "About Ask Pip" shelf, and contextual links throughout the app. `App/src/pages/AboutPip.tsx` and the "About Ask Pip" topics in `App/src/data/learnTopics.ts` already exist in the codebase, but their exact scope has not been checked line-by-line against the Flow Proposal's specification in the course of producing this document. Treat their status as **likely built, not verified** until a future session does that reconciliation, and update this section once it has.

# 4. Phase B — Blocked on Founder-Approved Knowledge

Phase B covers the Primer's remaining horticultural cards, the "Pruning your bush rose" Learn shelf, the before-you-cut lesson, and observation ordering. None of it can be built with real content until the underlying research clears Founder review, is compiled into an Approved Research Compilation (ARC), and is published as a PIP Knowledge Record (PKR) by the Knowledge Integration Technician (KIT). Writing placeholder horticultural content into the app ahead of that is exactly the problem `learnTopics.ts`'s own governing comment warns against, and shall not be done to make Phase B appear further along than it is.

As of this document's last update, six Founder Review Dossiers (FRDs) sit fully drafted and awaiting Founder review, each with zero recorded review-form responses:

- FRD-BUSHROSE-PRUNINGFRAMEWORK-04 (pruning a dormant bush rose as a whole)
- FRD-BUSHROSE-BASICCARE-02 (basic bush rose care, apart from pruning)
- FRD-BUSHROSE-STEMCROSSING-01 (crossing or rubbing stems)
- FRD-BUSHROSE-INWARDGROWTH-01 (inward-growing stems)
- FRD-BUSHROSE-WEAKCONGESTED-01 (weak or congested growth)
- FRD-BUSHROSE-DAMAGEDGROWTH-01 (damaged growth)

Each has a linked Garden Shed Office "Founder Attention Request" notice and a corresponding to-do. Check `shed_form_responses` directly for current review status (§5) rather than assuming this list is still accurate — Founder review is exactly the kind of state this document cannot track live.

# 5. Verifying Current Status Directly

This document can go stale the moment a session forgets to update it. Where precision matters, check directly:

- **App code state:** stage the relevant file from the device (`C:\AskPIP\core\App\src\...`) and read it, or ask the Founder to confirm a push landed. `App/` source is not mirrored into the Garden Shed's `shed_items` table — only the documentation and governance folders are (see the Known Issues Context) — so Supabase queries cannot confirm app code state.
- **FRD review status:** query `shed_form_responses` for the relevant `shed_items` id. An empty result means no review has been recorded yet, regardless of what a to-do's status field says (to-do status reflects who has opened or touched the to-do, not whether a review was actually submitted).
- **Session task list:** the `TaskList` tool reflects only the current AI session's own tracking and does not carry forward. Do not treat it as a source of project state for a new session.

# 6. Revision Log

- **23 September 2026 (Version 0.1):** Initial version. Records Phase A as built: photo-first onboarding, trace-the-stem confirmation, journey pause/resume, the Learn home-screen entry point, and confirms journal/growth visibility was already complete. Records the knot-question/photo-spot fields and the Primer shell as deferred within Phase A, and the front-door explainer / About Ask Pip shelf / contextual links as built but not yet reconciled against the Flow Proposal's exact specification. Records six FRDs as the current Phase B blocker.

# End of Document

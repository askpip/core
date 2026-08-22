# Ask Pip – Next Best Step Recommendation

## Document Metadata

**Document Title:** Ask Pip – Next Best Step Recommendation
**Document Type:** Draft Planning Document (not a controlled Architecture Document)
**Status:** Draft — for Founder Review
**Prepared By:** Claude, at Shaphan's request
**Date:** 21 August 2026
**Purpose:** To review everything currently in AskPIP Core and Working, and recommend the single most valuable next action.
**Source Material Reviewed:** `README.md`, `AGENTS.md`, `CHANGELOG.md`, `Foundations/AskPIP_Vision_Statement.md`, `MVP/Architecture/Ask_Pip_MVP_Bush_Rose_V1_Architecture.md`, `MVP/Journeys/Ask_Pip_MVP_Bush_Rose_V1_First_Guided_Care_Journey.md`, `MVP/Stories/Maries_Story.md`, `Standards/*`, `AI/*`, `App/README.md` and `App/src` structure, `Working/Drafts/Architecture/Ask_Pip_Vision_and_Bush_Rose_MVP_Founder_Discussion_Record.md`, `Working/AI Outputs/Ask_Pip_KCS_and_AI_Avatar_Architecture_Proposal.md`, and — critically — the full contents of `Working/Drafts/Knowledge Curation System/` (five documents, ~110,000 words combined).

---

## Headline Finding

**A fully-drafted Knowledge Curation System already exists, dated 18–21 July 2026, and it was not seen by the session that wrote today's KCS & AI Avatar Proposal.**

`Working/Drafts/Knowledge Curation System/` contains five substantial, mature documents that were never mentioned in, or reconciled with, the proposal dated 21 August:

| Document | Version | Status | Size |
|---|---|---|---|
| ROC Charter | 0.02 | Draft | ~1,400 words |
| Mother Information Library (MIL) Standard | 0.01 | Draft | ~1,000 words |
| Evidence Assessment Standard (EAS) | 1.0 | Draft, pending Founder review | ~2,000 words |
| Knowledge Integration Workflow | 0.01 | Draft | ~4,300 words |
| ROC Operations Manual | (unversioned) | Draft | ~9,000 words, 13 chapters |

Today's proposal states: *"Rock, MIL and LIL do not yet appear anywhere in the current repository."* That is incorrect for MIL and for the underlying concept behind Rock — they exist, in far greater depth than the proposal reinvents, just under slightly different names:

| Today's proposal | July drafts | Same thing? |
|---|---|---|
| Rock (research agent) | **PIP Research Origin Curator (ROC)** | Almost certainly yes — "ROC" and "Rock" are homophones, and the job description is identical: finds sources, prepares dossiers, never determines truth. |
| MIL (raw research corpus) | **Mother Information Library (MIL)** — same acronym | Yes, and more tightly specified: MIL holds *Founder-approved* information only, not raw/unreviewed research. |
| Kit (distillation agent) | **PIP Knowledge Integration Technician (KIT)** | Yes, with one clarification from Shaphan: KIT is the coder agent — it takes what ROC has researched and the Founders have approved into the MIL, and turns it into codebased knowledge Pip actually draws from when working with gardeners in the app. Not a document-only curator like ROC. |
| LIL (Live Interactive Library) | **Live Intelligence Library (LIL)** — same acronym, different expansion | Yes, same operational layer Pip queries at runtime. |
| "structured record per observation" | **PIP Knowledge Record (PKR)** | Same concept, referenced throughout the July drafts as the record type — but no standalone PKR Standard document exists yet. |

This isn't a minor overlap. The July `Knowledge_Integration_Workflow.md` already defines, in detail, exactly what today's proposal poses as its open Question 1 — *"what does verified mean for a MIL → LIL promotion?"* The answer already exists: a two-gate Founder approval process (Information Approval into MIL, then Operational Approval into LIL), governed by a full Evidence Assessment Standard with graded confidence levels (Very High / High / Moderate / Low / Very Low / Not Assigned), not a simple source-count heuristic.

The July material was never approved or integrated — it sits in `Drafts`, `Founder Review` is empty, and the `CHANGELOG.md` "Unreleased" section (which records everything approved since 1.0.0) does not mention it. It appears to have been set aside roughly a month ago while other foundational documents (Vision Statement, Bush Rose Architecture, the AI OS bootstrap package, Marie's Story) were finalised and approved through August — and then, when today's session picked the KCS thread back up from Shaphan's verbal description of "Rock, MIL and LIL," it didn't discover the existing drafts and rebuilt an overlapping structure from scratch.

**Confirmed role split (Shaphan, 21 August):** ROC is the agent set up to research and present findings to the Founders for review, then archive what's approved into the MIL. KIT is the agent set up to take what ROC has put into the MIL, once Founder-approved, and turn it into codebased knowledge — the form Pip (the in-app agent) actually draws from when working with gardeners. KIT is the coder agent in this system, not a second research/curation role.

---

## What This Means for "What's Next"

The good news: the hardest conceptual work on the Knowledge Curation System — the governance philosophy, the approval gates, the evidence standard, ROC's full operating procedure — is already done and is unusually rigorous. It directly satisfies `Architecture` §10's requirement that operational knowledge be "developed and verified" and "approved through the governed Knowledge Curation System" before gardener testing.

The real gap is narrower than today's proposal implies. The **research/evidence/MIL side (ROC)** is fully specified. The **integration/operational side (KIT/LIL/PKR)** is named and described inside the Workflow document, but has no Charter, Operations Manual, or Standard of its own yet — those are the actual missing pieces, and they're exactly what Section 2 of today's proposal was reaching toward. Given Shaphan's clarification above, whatever gets drafted for KIT needs to describe an implementing/coding role — the agent that builds and maintains the actual codebased LIL content — rather than reusing the ROC Operations Manual's document-curation shape as a template.

## Recommended Next Best Step

1. **Reconcile before building anything else.** Confirm with Shaphan (and any co-founder) whether ROC = Rock and KIT = Kit are indeed the same roles under different names. If so, treat the July documents as the canonical base and retire the "Rock" naming rather than running two parallel vocabularies.

2. **Put the existing July KCS package in front of the Founders for an actual review decision.** Five drafts have been sitting un-reviewed for a month: ROC Charter, MIL Standard, Evidence Assessment Standard, Knowledge Integration Workflow, ROC Operations Manual. They're detailed enough to approve, amend, or reject now — that decision has been the quiet blocker.

3. **Commission the missing operational-side documents**, parallel in coverage to what exists for ROC but scoped as a build/coding role rather than a research role:
   - KIT Charter — defining KIT as the coder agent that turns Founder-approved MIL content into codebased LIL knowledge, with its own authority boundaries (no original research, no approving its own work)
   - KIT Operations Manual — the equivalent of the ROC Operations Manual, but for the engineering steps KIT actually performs (reading approved MIL entries, producing/updating the codebased records, submitting them for Founder operational review)
   - Live Intelligence Library (LIL) Standard (parallel to the MIL Standard)
   - PIP Knowledge Record (PKR) Standard — the record schema, scoped first to the six MVP observations per `Architecture` §6.2/§7

4. **Only once that governance package has Founder approval**, run ROC against the six Bush Rose V1 observations, land findings in MIL, and have KIT distil the first PKRs into LIL. This is the step that actually unblocks `Architecture` §10 and lets gardener testing begin.

5. **In parallel, and not blocked by any of the above:** the two technical questions from today's proposal that the KCS drafts don't touch — which vision model Pip calls, and whether the app is backend-served or client-only for V1 (Section 3.3 of the proposal). These are genuinely open and worth deciding now so the service layer that replaces `App/src/data/observationScript.ts` can be scoped.

6. **Guard against this happening again.** Since a governed AI session already missed a month-old, highly relevant draft package, it's worth adding an explicit pointer to `Working/Drafts/Knowledge Curation System/` in `AI/PIP_AI_Loading_Guide.md` (or `AGENTS.md`) so any future KCS-related session is directed to it before drafting anything new in that area.

## Where the App Prototype Fits

`App/README.md`'s own "Known gaps" list (no camera/vision integration, no Supabase persistence, no deployment) is correctly sequenced *after* the KCS/AI capability work above — the working React/Vite shell already proves the UX (per today's proposal's own assessment), so there's no need to touch it until LIL has real content and a vision-model decision has been made to wire into it.

---

## Bottom Line

The single most valuable next action is not "start building the LIL schema" (today's proposal's Question 4) — it's **surfacing and reconciling the already-mature KCS draft package that exists in `Working/Drafts/Knowledge Curation System/` before any more of it gets reinvented**, then closing the specific gap that remains (KIT/LIL/PKR documents) rather than the whole system.

---

# End of Document

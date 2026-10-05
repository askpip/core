---
name: pip-kit-pkr-build
description: Build, submit and (after Founder approval) mark Published the PIP Knowledge Records (PKRs) for an approved ARC, acting as the Knowledge Integration Technician (KIT). Use when an ARC is approved into the MIL, when an approved ARC changes and published PKRs may be affected, or when the Founders ask for PKRs, a gate, an observation, decision logic, care guidance or source records to be built.
---

# KIT — Building PKRs from an Approved ARC

## Document Metadata

**Document Title:** KIT PKR Build Skill
**Document Type:** PIP Artificial Intelligence Operating System (PIP AI OS) Skill
**Version:** 0.3
**Status:** Approved — Version 0.1 approved by a Founder in chat, 1 October 2026; Version 0.2 approved by AskPIP Founder Authority, 5 October 2026; Version 0.3 at a Founder's direction, 5 October 2026 (coverage, statement rules, question topics, Build Check rounds)
**Owner:** The Founders
**Permanent Location:** `AI/Skills/KIT_PKR_Build_Skill.md`
**Last Updated:** 5 October 2026
**Purpose:** To give any AI acting as KIT the working procedure for turning an approved ARC into Published PKRs: the steps, file conventions and standing Founder rules established in practice. It distils, and never overrides, the KIT Charter, KIT Operations Manual and PKR Standard.
**Related Documents:**
- `Knowledge Curation System/Charters/KIT_Charter.md`
- `Knowledge Curation System/Operations Manuals/KIT_Operations_Manual.md`
- `Knowledge Curation System/Standards/Pip_Knowledge_Rules.md`
- `Knowledge Curation System/Standards/PKR_Standard.md`
- `Knowledge Curation System/Standards/LIL_Standard.md`
- `Knowledge Curation System/Standards/Pip_Runtime_Architecture.md`
- `AI/Skills/KIT_LIL_Publication_Skill.md` (the next step)
- `AI/Skills/Writing_Skill.md`
- `AI/Skills/Verify_Before_Claiming_Skill.md`

**Governing order:** where this Skill and the KIT Operations Manual or PKR Standard disagree, they govern. Note the discrepancy and tell the Founders.

---

# 1. Load before starting

1. `AGENTS.md` bootstrap (then the AI Operations Manual and Loading Guide).
2. The Pip Knowledge Rules, the KIT Charter, the KIT Operations Manual, the PKR Standard and the LIL Standard.
3. The approved ARC in `Knowledge Curation System/Mother Information Library/ARCs/`. Read all of:
   - §2, the Founder decision record: decisions there bind the PKRs;
   - §3–§4, the findings, each with its own confidence;
   - §5, the preserved conflicts;
   - §6, the approved defaults;
   - §7, the note for KIT;
   - the Source Register.
4. Existing published PKRs the ARC touches:
   - **The current published form:** the records in `Knowledge Curation System/Live Intelligence Library/records/`.
   - **The approved rendering and history:** the submission packages in `Working/AI Outputs/PKR-*-submission.md`.
5. The latest session handoff in the claude.ai project, if one exists.

# 2. Standing Founder rules (apply every time)

These were set by the Founders in chat and apply until they change them.

- **The Pip Knowledge Rules decide what Pip may say.** Build from findings whose Use status in the ARC is Available to Pip. Low and Very Low findings are on record only unless the rules make them available (Pip Knowledge Rules §3; ROC OM §11.4A).
- **Build Check before the Founders.** Every package goes to ROC for the Build Check before it is presented (KIT OM Chapter 13A).
- **Use every finding Pip may use.** Route each to a statement, or list it with the reason it was left out (KIT OM §5.3). The Founders' words: the knowledge is not to be wasted.
- **Write each statement to the Pip Knowledge Rules §3A** (KIT OM §7.7): name a single source, show a Moderate finding's limits, make each statement stand alone, mark precautions, gaps, disagreements and local statements.
- **Only approved content.** A PKR may contain only what approved ARCs say. Operational approval is given in chat by a Founder, and the Founders have said: "As long as they only contain content from the already approved ARCs, I approve." KIT still presents every package and waits for that approval. It is never assumed.
- **Every source verifiable.** Every Source PKR carries a full web address and access date, or a stable identifier for an offline source (ROC OM §5.5).
- **Never substitute a source silently.** If a register entry doesn't match an existing Source PKR (different page, edition, date or address), report it and let the Founders decide.
- **Per-claim confidence**, never blended (PKR Standard §4.2).
- **Clarify, never alter** (PKR Standard §4.3): gardener-friendly wording must not add, extend or reinterpret a finding. ROC's own synthesis (EAS §2.10) never enters a PKR.
- **Gardener copy names the rose type** ("your Hybrid Tea", "your rose"), never "bush rose".
- **Journey conventions:**
  - Every observation loops ("Can you see any more …?") until the gardener says no.
  - "Doesn't match" and "Not sure" never reach Cut (PKR Standard §5.1).
  - Comparison images may be a documented gap without blocking publication.
- **Questions go to the Founders in plain English, one decision at a time**, with options and a clearly labelled recommendation. Use a multiple-choice question tool when available.

# 3. Identifiers

- **Format:** `PKR-<CODE>-<6 digits>`, with the codes OBS, DEC, SGT, CGD, DEF, SRC and CMP (KIT OM §10.2). IDs carry no scope.
- **Next free number:** the highest number in use per code, across both `…/Live Intelligence Library/records/` and any unpublished drafts in `Working/AI Outputs/`, plus one.
- **Reserving:** state the range you reserve in the package.
- **Permanence:** an ID never changes after approval. A revision keeps the ID and increments the version (1.0 → 1.1).

# 4. Build the package (Draft)

Write one submission file per coherent package in `Working/AI Outputs/`: `PKR-<CODE>-BUSHROSE-<TOPIC>-01-submission.md`, plus `PKR-SRC-BUSHROSE-<TOPIC>-submission.md` for its sources.

Set the title-line status to `(v0.1, Draft)`. The package has these sections, in this order:

1. **Triage Record** (KIT OM Chapter 5). A table routing every finding, conflict, default and synthesis item of the ARC to a PKR field, or to "not routed" with the reason.
2. **One section per PKR**, each with the Common Fields table (PKR Standard §4):
   - ID, Type, Title, Status (Draft), Version (0.1)
   - Applies To
   - Supporting Source(s), per finding (for example "AF-1: PKR-SRC-…")
   - Founder Approval Date ("—" until approved)
   - Related PKRs
   - Preserved Uncertainty or Limitations
   - Evidence Confidence ("see per-claim")

   Then the type-specific fields:
   - **Observation (§5.1):** Visual Criteria table with a confidence and "Photographable?" per signal; What the Photo Cannot Establish; Comparison Image PKR, or "documented gap"; Confirmation Requirement and Responses (Confirmed, Doesn't match, Not sure); the "any more?" question.
   - **Decision Logic (§5.3):** Available Choices and Conditions (Cut, Leave, Decide later, Get experienced local help) with per-row confidence; gate conditions; Deferral Triggers.
   - **Suitability Gate (§5.4):** Question or Check; Acceptable Answers with results; Stopping Threshold.
   - **Care Guidance (§5.7):** Care Topic; Guidance Mode; Presentation Points; items with trace, confidence and applicability, and where they apply the limit shown, the kind (precaution, gap, disagreement, framing) and the countries the item is shown in. For question answers: the topic and the record's order in it. A subject usually needs several short question answers under one topic, with one lead question, so that every usable finding has a place. `PKR-CGD-BUSHROSE-SPRAYING-01-submission.md` is the worked example.
   - **Revisions** of published PKRs list only the changed fields and state the new version.
3. **Wording Boundary Check** (KIT OM §7.7): how each paraphrase stays within its finding.
4. **Remaining Dependencies and Decisions for the Founders.** Any question the ARC's §2 doesn't settle, with options and a KIT recommendation. KIT can't decide horticultural questions by inference (KIT OM §9.3).
5. **Founder Review Rendering** (PKR Standard §9.2): plain sentences a non-technical Founder can approve, with no field syntax.

**Source PKRs** (PKR Standard §5.5):

- **Match first, create second.** Match every relied-on register entry against existing Source PKRs by web address, then by title, author and date.
  - A match is reused: bump its version and add the new MIL references, applied in place on approval (Part B).
  - No match gets a new Source PKR (Part A) with Source Type, Source Identity (including the address, the access date and the register code), MIL References (finding and confidence) and Relevance.
  - Register entries no finding relies on get no Source PKR.
- **Label commercial sources** as commercial.

# 5. Check before submitting (KIT OM Chapter 13)

- Every confidence level matches the ARC's summary table.
- Every finding has a Source PKR list that matches the ARC's Source Register. Check this by script where you can.
- Nothing appears that isn't in the ARC. Defaults are labelled "approved default".
- No "Not sure" route offers Cut.

# 6. Deliver and present

1. Save the files to the Founder's computer. Workflow when the device shell is unavailable:
   1. write in the cloud copy;
   2. copy to `/mnt/user-data/outputs/…`;
   3. commit to the device (pass the expected modified-time when overwriting);
   4. list the folder and **check every file size** against your copy. A stale commit has landed before.
2. Give the package to ROC for the Build Check. Fix anything it fails, act on the notes, and have the changed statements rechecked, until nothing fails. Record each round in the package, and list any correction to the research record the check proposes.
3. Present ROC's Build Check Brief: Pip's words with each result, what was left out, and any open decision.
4. Ask each open decision separately, then ask for approval of the package. Ask only what the Pip Knowledge Rules §5 leave to the Founders.

# 7. On approval

1. Record the decision in the package: the title-line status, a `Published <date>` line quoting the approval, and the decision outcomes. Set the status to Published, set new records to Version 1.0 and revisions to their new version, and fill in the Founder Approval Date.
2. Apply Part B source bumps in place in the file that holds each reused Source PKR. Add the new MIL reference lines ("added vX.Y, <date>") and a revision note. Verify each block after editing.
3. Add a one-line "Superseded in part" banner to older packages whose records were revised.
4. Publish to the LIL with `AI/Skills/KIT_LIL_Publication_Skill.md`. A PKR isn't live until that Skill's verification passes.
5. If the journey needs something the app doesn't yet read (a new field, gate or step), it's app work too. Update `App/src/data/pkr.ts` and the pages, run `npm run build`, and update `AI/Context/Ask_Pip_App_Build_Status_Context.md`.
6. **Git:** give the Founder a PowerShell block (`git add -A`, `git commit`, `git push`) unless the session can push. Confirm the push landed (for example with `git fetch` and the log) before relying on it.
7. Update the CHANGELOG and the session handoff document.

# 8. Standing duty: impact of new MIL information (KIT OM Chapter 19)

When ROC adds or revises an ARC, check every published PKR that cites it or covers the same observation. Report to the Founders what is strengthened, weakened or contradicted. Don't revise a published PKR without their direction.

# End of Skill

---
name: pip-kit-pkr-build
description: Build, submit and (after Founder approval) mark Published the PIP Knowledge Records (PKRs) for a completed Founder Review Dossier or an approved ARC, acting as the Knowledge Integration Technician (KIT). Use when the ROC passes a completed dossier for the build, when an approved ARC changes and published PKRs may be affected, or when the Founders ask for PKRs, a gate, an observation, decision logic, care guidance or source records to be built.
---

# KIT — Building PKRs from a Completed Dossier or an Approved ARC

## Document Metadata

**Document Title:** KIT PKR Build Skill
**Document Type:** PIP Artificial Intelligence Operating System (PIP AI OS) Skill
**Version:** 0.7
**Status:** Approved — Version 0.1 approved by a Founder in chat, 1 October 2026; Version 0.2 approved by AskPIP Founder Authority, 5 October 2026; Version 0.3 at a Founder's direction, 5 October 2026 (coverage, statement rules, question topics, Build Check rounds); Version 0.4 at a Founder's direction, 5 October 2026; Version 0.5 on a Founder's decision of 6 October 2026 to keep the one-approval pattern (build from the completed dossier; Pip's Answers; one approval); Version 0.6, 7 October 2026, on a Founder's decision of 6 October 2026 (a statement is marked for the place its source names); Version 0.7, 7 October 2026, at a Founder's direction (plain words: the sentence test and the plain read)
**Owner:** The Founders
**Permanent Location:** `AI/Skills/KIT_PKR_Build_Skill.md`
**Last Updated:** 7 October 2026
**Purpose:** To give any AI acting as KIT the working procedure for turning a completed dossier, or an approved ARC, into Published PKRs: the steps, file conventions and standing Founder rules established in practice. It distils, and never overrides, the KIT Charter, KIT Operations Manual and PKR Standard.
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
3. What you are building from. **Usually a completed Founder Review Dossier** the ROC has passed for the build, in `Working/Founder Review/`: read its findings and levels, the "For Pip" column, its conflicts, its recommendations for further research, what the rules give, and its Source Register (`Working/AI Outputs/Source_Register_<SUBJECT>.json`). **For a change to something already approved, the ARC** in `Knowledge Curation System/Mother Information Library/ARCs/`: read all of:
   - §2, the Founder decision record: decisions there bind the PKRs;
   - §3–§4, the findings, each with its own confidence;
   - §5, the preserved conflicts;
   - §6, the approved defaults;
   - §7, the note for KIT;
   - the Source Register.

   Below, "the ARC" means whichever of the two you are building from.
4. Existing published PKRs the ARC touches:
   - **The current published form:** the records in `Knowledge Curation System/Live Intelligence Library/records/`.
   - **The approved rendering and history:** the submission packages in `Working/AI Outputs/PKR-*-submission.md`.
5. The latest session handoff in the claude.ai project, if one exists.

# 2. Standing Founder rules (apply every time)

These were set by the Founders in chat and apply until they change them.

- **The Pip Knowledge Rules decide what Pip may say.** Build from findings whose Use status in the ARC is Available to Pip. Low and Very Low findings are on record only unless the rules make them available (Pip Knowledge Rules §3; ROC OM §11.4A).
- **One approval.** A Founder reads Pip's Answers and approves once; that approves the research and Pip's words together (Pip Knowledge Rules §7). Build from the completed dossier before approval. Publish nothing until a Founder approves and the ROC has filed the ARC.
- **Build Check before the Founders.** Every package goes to ROC for the Build Check before anything is presented (KIT OM Chapter 13A). Where the check corrects the dossier, rebuild the statements that rest on what changed.
- **Source check first where you can.** Pip's first-pass wording fails less when it is written from what the pages were confirmed to say. Where the ROC can run the source check before the statements are written, write them after it.
- **Pip helps gardeners first** (Pip Knowledge Rules §1). Use every finding that helps a gardener understand, grow or care for the plant. Leave out what is only about the research, and list it with the reason (KIT OM §5.3).
- **Write each statement to the Pip Knowledge Rules §3A** (KIT OM §7.7): plain words a beginner can act on; no source names in the sentence, because the sources are listed under the answer; "one source says" where only one does; a limit only where it changes what a gardener does; each statement stands alone.
- **Only what the research says.** A PKR may contain only what the dossier's findings, or approved ARCs, say. Approval is given by a Founder on the Pip's Answers Form or in chat. KIT presents every package and waits for that approval. It is never assumed.
- **Every source verifiable.** Every Source PKR carries a full web address and access date, or a stable identifier for an offline source (ROC OM §5.5).
- **Never substitute a source silently.** If a register entry doesn't match an existing Source PKR (different page, edition, date or address), report it and let the Founders decide.
- **Per-claim confidence**, never blended (PKR Standard §4.2).
- **Clarify, never alter** (PKR Standard §4.3): gardener-friendly wording must not add, extend or reinterpret a finding. ROC's own synthesis (EAS §2.10) never enters a PKR.
- **Plain words, about the plant** (a Founder's direction, 7 October 2026). Write each sentence so that it tells the gardener what to do, look for or decide. A sentence about the sources (how many said what, or what they "name", "list" or "include") is written only where a rule requires it: "one source says", a disagreement, or a range. Never carry a finding's research wording into Pip's words: the finding may count sources, and Pip does not. When the Build Check finds a count is off, fix it by saying the thing plainly or saying less, not by adding more counting.
- **Gardener copy names the rose type** ("your Hybrid Tea", "your rose"), never "bush rose".
- **Journey conventions:**
  - Every observation loops ("Can you see any more …?") until the gardener says no.
  - "Doesn't match" and "Not sure" never reach Cut (PKR Standard §5.1).
  - Comparison images may be a documented gap without blocking publication.
- **Questions go to the Founders in plain English, one decision at a time**, with its options and their consequences. Use a multiple-choice question tool when available.

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
   - **Care Guidance (§5.7):** Care Topic; Guidance Mode; Presentation Points; items with trace, confidence and applicability, and where they apply the limit shown, the kind (precaution, gap, disagreement, framing) and the places the item is shown in (a country, region or town: the place the source names, never a wider one). For question answers: the topic and the record's order in it. A subject usually needs several short question answers under one topic, with one lead question, so that every usable finding has a place. `PKR-CGD-BUSHROSE-SPRAYING-01-submission.md` is the worked example.
   - **Revisions** of published PKRs list only the changed fields and state the new version.
3. **Wording Boundary Check** (KIT OM §7.7): how each paraphrase stays within its finding.
4. **Remaining Dependencies and Decisions for the Founders.** Any question the rules, the standing decisions and the dossier don't settle. Put it to a Founder before submission, in plain words with its options. KIT can't decide horticultural questions by inference (KIT OM §9.3).
5. **Founder Review Rendering** (PKR Standard §9.2): plain sentences a non-technical Founder can approve, with no field syntax. It becomes section 1 of Pip's Answers.
6. **Build Check Record:** each round of the check, what failed and how it was fixed, and what was left as it is and why.

**Source PKRs** (PKR Standard §5.5):

- **Match first, create second.** Match every relied-on register entry against existing Source PKRs by web address, then by title, author and date.
  - A match is reused: bump its version and add the new MIL references, applied in place on approval (Part B).
  - No match gets a new Source PKR (Part A) with Source Type, Source Identity (including the address, the access date and the register code), MIL References (finding and confidence) and Relevance.
  - Register entries no finding relies on get no Source PKR.
- **Label commercial sources** as commercial.

# 5. Check before submitting (KIT OM Chapter 13)

- Every confidence level matches the ARC's summary table.
- Read every statement sentence by sentence, as a gardener would. Remove or reword any sentence that is about the sources, is empty, or cannot be acted on (ROC OM §14.3 item 12). The Build Check's plain read (ROC OM §14.2A, Part 3) tests the same thing.
- Every finding has a Source PKR list that matches the ARC's Source Register. Check this by script where you can.
- Nothing appears that isn't in the ARC. Defaults are labelled "approved default".
- No "Not sure" route offers Cut.

# 6. Deliver and present

1. Save the files to the Founder's computer. Workflow when the device shell is unavailable:
   1. write in the cloud copy;
   2. copy to `/mnt/user-data/outputs/…`;
   3. commit to the device (pass the expected modified-time when overwriting);
   4. list the folder and **check every file size** against your copy. A stale commit has landed before.
2. Give the package to ROC for the Build Check. Fix anything it fails, act on the notes, and have the changed statements rechecked, until nothing fails. Record each round in the package. Where the check corrects the dossier, rebuild what rests on the corrected findings.
3. With the ROC, write **Pip's Answers** and its one-question Form (`Working/AI Outputs/Founder_Review_Companion_Documents_Working_Note.md`): every word gardeners will see, what a Founder should know, the check in one line, where the detail is. Check by script that section 1 matches the draft records statement for statement. Mark any earlier brief or form for the same dossier as replaced.
4. Load test copies of the draft records into a local build of the app (never the live LIL, never `public.lil_pkr`) and look at them, at phone width, for a plant in each place that has its own statements, and for one outside them. Remove the test copies afterwards.
5. Deliver, and once the Founder has pushed, post it in the Shed: point a Founder Attention Request at Pip's Answers, with links to the Form and the dossier, and edit the to-do (Garden Shed Operations Skill §5).

# 7. On approval

1. Where the Founder approved with changes, make them first and have every statement whose meaning changed rechecked. Where you or the ROC had to write new wording, or a finding or its level changed, show the changed statements to the Founder, and have them accepted, before anything is filed or published (KIT OM Chapter 15). The ROC then files the ARC (ROC OM Chapter 12), with the check's corrections folded in. Then record the decision in the package: the title-line status, a `Published <date>` line quoting the approval, and the decision outcomes. Set the status to Published, set new records to Version 1.0 and revisions to their new version, and fill in the Founder Approval Date.
2. Apply Part B source bumps in place in the file that holds each reused Source PKR. Add the new MIL reference lines ("added vX.Y, <date>") and a revision note. Verify each block after editing.
3. Add a one-line "Superseded in part" banner to older packages whose records were revised.
4. Publish to the LIL with `AI/Skills/KIT_LIL_Publication_Skill.md`. A PKR isn't live until that Skill's verification passes.
5. If the journey needs something the app doesn't yet read (a new field, gate or step), it's app work too. Update `App/src/data/pkr.ts` and the pages, run `npm run build`, and update `AI/Context/Ask_Pip_App_Build_Status_Context.md`.
6. **Git:** give the Founder a PowerShell block (`git add -A`, `git commit`, `git push`) unless the session can push. Confirm the push landed (for example with `git fetch` and the log) before relying on it.
7. Update the CHANGELOG and the session handoff document.

# 8. Standing duty: impact of new MIL information (KIT OM Chapter 19)

When ROC adds or revises an ARC, check every published PKR that cites it or covers the same observation. Report to the Founders what is strengthened, weakened or contradicted. Don't revise a published PKR without their direction.

# End of Skill

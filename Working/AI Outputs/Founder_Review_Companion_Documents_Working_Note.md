# Founder Review Companion Documents — Decision Brief & Review Form

## Document Metadata

**Document Title:** Founder Review Companion Documents — Decision Brief & Review Form
**Document Type:** Draft Reference Note (not a controlled Standard — see "Status of This Pattern" below)
**Status:** Draft — for Founder awareness, not Founder approval as a governed process
**Prepared By:** Claude, at Shaphan's request
**Date:** 22 September 2026
**Version:** 0.1
**Purpose:** To record, in one place, the pattern used twice so far (`FRD-BUSHROSE-PRUNINGFRAMEWORK-01` and `FRD-BUSHROSE-BASICCARE-01`) for presenting a completed Founder Review Dossier to the Founders for decision — so a future AI session can reproduce it without reverse-engineering two example instances from scratch, the way this note's author had to.
**Related Documents:** `Standards/Founder_Review_Dossier_Standard.md` (governs the FRD itself); `Shed/README.md` (Garden Shed mechanics); `AI/Skills/Garden_Shed_Operations_Skill.md` (how an AI session posts the notice/links/todo)
**Note:** This is a plain working note, not a Standard. It exists so the pattern is written down somewhere while it is still a trial. See "Status of This Pattern" immediately below before treating anything here as a requirement.

---

## Status of This Pattern

This is **explicitly a trial, not a governed part of the Founder Review Dossier process.** Both existing instances say so on their own metadata: the Decision Brief is "a working aid, trial. Not a governed document. Not the Founder Review Documentation," and it "adds no evidence, changes no finding and changes no confidence level." The Founder Review Dossier (FRD) itself remains the sole governed record of the research; the Brief and the Review Form exist only to make that record easier for a Founder to act on.

Founder Review Dossier Standard (FRDS) §2.4 is what makes room for this: it "retired an earlier summary document and allows one to be reinstated by a Founder decision." The Decision Brief is that reinstated summary, in a new, form-paired shape.

If the Founders decide, after this trial, that the pattern should become a permanent part of the FRD process, that is a governance decision for them to make — it would mean amending FRDS to require it, not just continuing to repeat it informally. This note does not make that decision and should not be read as having made it. Until then, treat everything below as "how it's been done twice," not "how it must be done."

---

## What the Two Companion Documents Are

**The Decision Brief** is a plain-English, proportionate walkthrough of the FRD, written for a Founder who wants to understand what was found and what they're being asked to decide without reading the full dossier line by line. It restates findings, confidence levels, points where sources disagreed, and open questions — but it is downstream of the FRD, never a substitute source for it. If the Brief and the FRD ever disagree, the FRD governs.

**The Review Form** is a fillable document, in the shed-form v1 markup (see `Shed/README.md`, "Fillable forms," and the operational reference in `AI/Skills/Garden_Shed_Operations_Skill.md`), that lets each Founder record their own decision on each finding and open question privately, with autosave, and see where the two Founders' answers differ once both have finished. It is where the actual decision gets recorded — the Brief only informs it.

Together, they are the thing a Founder actually interacts with when deciding whether to approve an FRD; the FRD itself is the archival record of the research that produced them.

---

## When to Create Them

After an FRD is complete and would otherwise simply be handed to the Founders to read cold. Not every FRD necessarily needs this treatment — it is proportionate to how much there is to walk through (the BASICCARE pair, at 13 findings across 5 simple groups, was deliberately much shorter than the PRUNINGFRAMEWORK pair's 30 findings and full image-permissions register) — but so far it has been produced for both FRDs put to the Founders since the trial began.

---

## Required Structure

### Decision Brief

Both existing Briefs follow the same skeleton, scaled to the subject:

1. Document Metadata + a "what this is / is not" callout (the trial-status language above, adapted per document)
2. What you are being asked to do
3. The short version (a compressed summary, including the spread of confidence levels across findings)
4. What was researched
5. How to read the strength ratings (a table explaining the Evidence Confidence Level scale actually used by that FRD — the pruning FRD only used 3 levels; BASICCARE used the full 6-level Evidence Assessment Standard scale)
6. What the research found, grouped into tables by commissioned question or topic area, each finding given an ID, a plain-language statement, its strength/confidence, its evidentiary backing, and anything worth knowing about it
7. Where the sources disagree (each conflict given its own ID and a short account of what's on each side)
8. What the sources leave open / further research (each gap given its own ID)
9. Images: where we stand (an image-permissions register) — only where the FRD's scope includes images; omitted entirely when it doesn't, as in BASICCARE
10. What approval would and would not do
11. The decisions you are asked to make (a numbered list, plus a further-research table when relevant)
12. Where to find the detail (pointers into the FRD's own sections)
13. Appendix: source key and/or glossary

### Review Form

Both existing forms open with `<!-- shed-form v1 -->` as their literal first line (this is what makes the Shed render them as a fillable form instead of plain text — see `Shed/README.md`), then follow this shape:

1. A short intro plus the answer-choice legend
2. A `[[choice]]` confirming the Founder has read the Brief
3. "Before the findings" — a handful of general questions
4. The findings themselves, grouped to match the Brief's groupings, each as a heading giving the finding's ID/label/confidence, a blockquote restating it, a `[[claim:...|Approve;Approve with a change;Flag;Do not approve]]`, and a `[[more:...]]` collapsible giving its backing and caveats; each group ends with a `[[comment:...]]` for general remarks on that group
5. "Where the sources disagree" — one `[[claim:...|Accept as recorded;Commission research;Give a direction]]` plus a `[[more:...]]` per conflict
6. "Further research" — one `[[choice:...||Commission next;Commission later;Not needed;Not sure|comment]]` plus a `[[more:...]]` per open item
7. Images, if in scope
8. "The other decisions" — the numbered decisions from the Brief's §11, restated as form items
9. "Your overall decision" — an `[[choice:outcome|...]]` plus free-text `[[area:...]]` fields for conditions/further-research direction/other remarks
10. An optional closing section asking for feedback on the Brief and Form themselves

The shed-form directive syntax itself (`[[choice]]`, `[[claim]]`, `[[more]]`, `[[comment]]`, `[[area]]`, `[[text]]`) is specified in `Shed/README.md`'s "Fillable forms" section and summarised in `AI/Skills/Garden_Shed_Operations_Skill.md` — this note does not repeat it.

---

## File Naming and Location

Both companion documents take the FRD's own identifier and add a suffix:

- `FRD-<subject-scope>-<sequence>_Decision_Brief.md`
- `FRD-<subject-scope>-<sequence>_Review_Form.md`

While an FRD is pending a Founder decision, all three files — the FRD itself, its Decision Brief and its Review Form — live together in `Working/Founder Review/`. This was not obvious from the Founder Review Dossier Standard alone; it is established by precedent (`FRD-BUSHROSE-PRUNINGFRAMEWORK-01` and its companions live only there, with no copy elsewhere; `FRD-BUSHROSE-BASICCARE-01` was originally filed only in the Mother Information Library and had to be corrected to also live in `Working/Founder Review/`, matching the precedent). Some earlier, already-decided FRDs (`DEADWOOD`, `RECENTPLANT`) have duplicate copies in both `Working/Founder Review/` and `Knowledge Curation System/Mother Information Library/Founder Review Dossiers/` — the working assumption is that `Working/Founder Review/` is the home for pending review material generally, and the Mother Information Library copy is added once (or if) a Founder decision is recorded, without removing the working copy.

---

## Presenting the Pair to the Founders

Once both companion documents exist, they are surfaced through the Garden Shed's notice/approval workflow, not simply left in the repository for the Founders to find on their own:

1. A "Founder Attention Request" notice is posted to the Notice Board, `requires_approval = true`, describing what's being asked and pointing the Founder at the Brief first, then the Review Form.
2. The notice is linked to all three documents — the FRD, the Decision Brief, and the Review Form — via `shed_item_links`, in that order, not just the single `linked_item_id` column (which alone only supports one document).
3. The auto-created to-do (from the `shed_items_notice_todo_trg` trigger) is edited to name the FRD's identifier and spell out the two-step action: read the Brief, then fill in and Finish the Review Form.

The exact mechanics of all three steps — including why direct SQL inserts are used instead of the passphrase-gated RPCs — are in `AI/Skills/Garden_Shed_Operations_Skill.md`, not repeated here.

---

## End of Document

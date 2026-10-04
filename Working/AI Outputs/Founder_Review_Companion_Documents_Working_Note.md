# Founder Review Companion Documents — Briefs and Forms

## Document Metadata

**Document Title:** Founder Review Companion Documents — Briefs and Forms
**Document Type:** Operational Reference Note (not a Standard)
**Status:** Draft — the patterns below are on trial with six dossiers and take effect when the Founders approve `Working/Drafts/Standards/Founder_Review_and_Build_Check_Amendment_Proposal.md`
**Prepared By:** Research Origin Curator (ROC), at a Founder's request
**Date:** 5 October 2026
**Version:** 0.4
**Purpose:** To give the patterns for the four documents a Founder reads or fills in: the Decision Brief and Review Form that go with a Founder Review Dossier (FRD), and the Build Check Brief and Build Check Form that go with a package of PIP Knowledge Records (PKRs) built by the Knowledge Integration Technician (KIT).
**Related Documents:** `Knowledge Curation System/Standards/Founder_Review_Dossier_Standard.md` §2.6 and §2.6A (as proposed); `Knowledge Curation System/Operations Manuals/ROC_Operations_Manual.md` §11.4A, §11.4B and Chapter 14 (as proposed); `Knowledge Curation System/Operations Manuals/KIT_Operations_Manual.md`; `Shed/README.md` ("Fillable forms"); `AI/Skills/Garden_Shed_Operations_Skill.md`
**Revision Note:** Version 0.4 replaces the long Review Form, which asked for a decision on every finding, with a short form, and adds the Build Check Brief and Build Check Form. Version 0.1 recorded the first pattern.

---

## 1. The Two Review Points

| When | What a Founder reads | Where a Founder decides | What is being decided |
|---|---|---|---|
| After research | Decision Brief | Review Form | How Pip handles the subject, any exceptions, further research, and whether the dossier becomes an Approved Research Compilation (ARC) |
| After KIT builds | Build Check Brief | Build Check Form | Whether Pip's words are approved for publishing |

The dossier and the PKR package remain the governed records. The four documents here add no evidence, finding or confidence level. Where one differs from the record it summarises, the record governs.

None of the four narrates how it was produced, addresses a reviewer by name, or asks about scheduling or what work comes next.

## 2. Decision Brief

Plain language, proportionate to the dossier. Sections, in this order:

1. **What you are being asked to do.** The number of questions and what they cover.
2. **The short version.** The main points, each with its confidence.
3. **What was researched.** The commissioned questions.
4. **How to read the strength ratings.** The Evidence Confidence Levels the dossier uses, and what each means for Pip: Very High, High and Moderate findings are available to Pip; Low and Very Low findings stay on record only unless one of the four cases in ROC Operations Manual §11.4B applies.
5. **What the research found.** Every finding in tables, grouped as in the dossier, with its identifier, plain statement, confidence, and a **For Pip** column: "Yes"; "Yes, locally" (one reliable source, shown for that place with the source named); "To say there's a gap"; "On record only"; or "Your call", with the question it belongs to.
6. **Where the sources differ.** Each recorded disagreement.
7. **What the sources leave open, and the default for each.**
8. **The decisions you are asked to make.** The dossier's decisions about Pip, with options and the ROC's recommendation; then any exception; then further research; then the overall decision.
9. **What approval would and would not do.**
10. **Where to find the detail.**
11. **Appendix: source key.**

## 3. Review Form

The form asks only what Founder Review Dossier Standard §2.6A allows. Its first line is `<!-- shed-form v1 -->`. Skeleton:

```
<!-- shed-form v1 -->
# Founder Review Form — <dossier title>

<Two or three sentences: read the Brief first; what the form asks; how findings are treated.>

## How Pip handles this

[[choice:d2|2. <Decision>. ROC recommends (a).|(a) …;(b) …;(c) …|comment]]
[[more:d2m|The options|<each option in full, and the ROC's reason>]]

## Exceptions

[[choice:e1|<What the ROC asks to allow, and why>|Allow;Keep on record only;Allow some (say which)|comment]]
[[more:e1m|The findings|<each finding's statement, backing and limits>]]

## Further research

[[choice:research|The defaults in Brief section 7 apply unless you say otherwise. Commission any of these now?|No, use the defaults;Yes (say which)|why]]
[[more:researchm|The open items and their defaults|<each item and its default>]]

## Your overall decision

[[choice:outcome||Approve as ARC-…;Approve with the changes I've noted;Request further work before deciding;Decline to approve]]

## Anything else | optional

[[area:notes|Any finding, disagreement or open item you want changed, kept out of Pip, or looked at again. Give its number and what you want.]]
```

Rules:

- One question for each of the dossier's decisions about Pip. Keep the dossier's numbering.
- Include the Exceptions section only where the ROC asks a Founder to allow a vital finding or a class of findings. Local findings from one reliable source and records of a gap need no question.
- One question for further research, however many open items there are.
- No question on any individual finding, and no "have you read", scope or confidence-check questions.
- Never rename a question's identifier once anyone has answered the form.

## 4. Build Check Brief

Prepared by the ROC after the Build Check (ROC Operations Manual Chapter 14, as proposed). Sections, in this order:

1. **What this is.** The package, the ARC or ARCs it was built from, and what is being asked: approval to publish.
2. **What gardeners will see.** Pip's words, record by record and statement by statement, in a table: the statement, its confidence, the finding it rests on, and the result (Pass, Pass with a note, Fail).
3. **The check in numbers.** Statements checked, passed, passed with a note and failed. Sources reopened: confirmed, changed, could not open.
4. **Notes and failures.** Each one, and what was done about it. A failed statement is corrected and rechecked before the Brief goes to the Founders, and the Brief says so.
5. **What was left out.** The findings KIT did not use, grouped by reason: on record only, or not needed.
6. **Decisions still open.** Any choice the package needs from a Founder, with options. Omitted when there is none.
7. **Where to find the detail.** The package file, the ARC and its Source Register.

## 5. Build Check Form

A check-off. Skeleton:

```
<!-- shed-form v1 -->
# Build Check Form — <package title>

<Two sentences: read the Build Check Brief first; this approves Pip's words for publishing.>

## Decisions still open

[[choice:k1|<Decision>|(a) …;(b) …|comment]]

## Approval to publish

[[choice:publish||Approve for publishing;Approve with the changes I've noted;Hold]]

## Anything else | optional

[[area:notes|Any statement you want reworded, removed or looked at again. Give its number and what you want.]]
```

Omit "Decisions still open" when there is none. The form then has one question.

## 6. File Naming and Location

| Document | Name | Location |
|---|---|---|
| Decision Brief | `FRD-<subject-scope>-<sequence>_Decision_Brief.md` | `Working/Founder Review/` |
| Review Form | `FRD-<subject-scope>-<sequence>_Review_Form.md` | `Working/Founder Review/` |
| Build Check Brief | `<package file name>_Build_Check_Brief.md` | `Working/Founder Review/` |
| Build Check Form | `<package file name>_Build_Check_Form.md` | `Working/Founder Review/` |

Renaming or moving a form's file makes the Garden Shed delete the old row and every saved answer with it. Change a form's content in place.

## 7. Presenting to the Founders

Each pair is surfaced through the Garden Shed's notice workflow (`AI/Skills/Garden_Shed_Operations_Skill.md` §5):

1. A "Founder Attention Request" notice on the Notice Board, requiring approval.
2. Links from the notice to the record, the brief and the form, in that order.
3. The to-do the notice creates, edited to name the record and the action: read the brief, then fill in and Finish the form.

Either Founder's finished, decisive form is enough on its own for the ROC or KIT to act.

## End of Document

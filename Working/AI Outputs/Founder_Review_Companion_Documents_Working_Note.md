# Founder Review Companion Documents — Briefs and Forms

## Document Metadata

**Document Title:** Founder Review Companion Documents — Briefs and Forms
**Document Type:** Operational Reference Note (not a Standard)
**Status:** Draft — the patterns below are on trial with six dossiers and take effect when the Founders approve `Working/Drafts/Standards/Founder_Review_and_Build_Check_Amendment_Proposal.md`
**Prepared By:** Research Origin Curator (ROC), at a Founder's request
**Date:** 5 October 2026
**Version:** 0.5
**Purpose:** To give the patterns for the four documents a Founder reads or fills in: the Decision Brief and Review Form that go with a Founder Review Dossier (FRD), and the Build Check Brief and Build Check Form that go with a package of PIP Knowledge Records (PKRs) built by the Knowledge Integration Technician (KIT).
**Related Documents:** `Knowledge Curation System/Standards/Founder_Review_Dossier_Standard.md` §2.6 and §2.6A (as proposed); `Knowledge Curation System/Operations Manuals/ROC_Operations_Manual.md` §11.4A, §11.4B and Chapter 14 (as proposed); `Knowledge Curation System/Operations Manuals/KIT_Operations_Manual.md`; `Shed/README.md` ("Fillable forms"); `AI/Skills/Garden_Shed_Operations_Skill.md`
**Revision Note:** Version 0.5 adds the question test and the checks before delivery (§3A, §3B), after the first short forms asked questions a Founder could not answer from their own words; narrows the Review Form to real choices; and adds the precaution case to the Brief. Version 0.4 replaces the long Review Form, which asked for a decision on every finding, with a short form, and adds the Build Check Brief and Build Check Form. Version 0.1 recorded the first pattern.

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
4. **How to read the strength ratings.** The Evidence Confidence Levels the dossier uses, and what each means for Pip: Very High, High and Moderate findings are available to Pip; Low and Very Low findings stay on record only unless one of the cases in ROC Operations Manual §11.4B applies. Say plainly that a rating measures how strong the evidence is, not how much the finding matters.
5. **What the research found.** Every finding in tables, grouped as in the dossier, with its identifier, plain statement, confidence, and a **For Pip** column: "Yes"; "Yes, locally" (one reliable source, shown for that place with the source named); "Yes, as a precaution"; "To say there's a gap"; "On record only"; or "Your call", with the question it belongs to.
6. **Where the sources differ.** Each recorded disagreement.
7. **What the sources leave open, and the default for each.**
8. **The decisions you are asked to make.** Only the real choices (§3A), each with its options in words, the ROC's recommendation and why it is a question; then the overall decision. Then **What Pip will do without a question**: every decision the research settles, the precautions written out in words, and the stand-ins for the open items.
9. **What approval would and would not do.**
10. **Where to find the detail.**
11. **Appendix: source key.**

## 3. Review Form

The form asks only what Founder Review Dossier Standard §2.6A allows. Its first line is `<!-- shed-form v1 -->`. Skeleton:

```
<!-- shed-form v1 -->
# Founder Review Form — <dossier title>

<Two or three sentences: read the Brief first; how many questions; where the Brief lists what Pip does without a question.>

## What Pip says about <subject>

[[choice:s1|1. <Question in plain words>? The ROC recommends the first answer.|<What Pip does under this answer>;<What Pip does under this answer>;<…>|comment]]
[[more:s1m|What the research says|<the ratings in words, and where sources disagree>]]

## Your overall decision

[[choice:outcome|N. Your decision on this dossier|Approve. The research goes on record as ARC-….;Approve with the changes I've noted below.;Request further work before deciding.;Decline to approve.]]

## Anything else | optional

[[area:notes|Anything you want changed, kept out of Pip, or researched further. Say what it is in your own words.]]
```

Rules:

- One question for each real choice (§3A), and none for anything else.
- A question about further research appears only where the ROC recommends commissioning something. Otherwise the Brief lists the open items and what Pip does meanwhile.
- A question about a Low finding appears only where the ROC asks a Founder to allow it and no case in ROC Operations Manual §11.4B makes it available.
- An option's text cannot contain a semicolon, a vertical bar or a closing square bracket.
- Never reuse a question's identifier with different options once anyone has answered: the Shed would count the old answer as given while showing nothing ticked. Give a changed question a new identifier.

## 3A. The Question Test

Every question on a form shall pass all five.

1. **It can be answered from its own words.** No finding number, option letter or code that has to be looked up. A finding is described by what it says.
2. **It is a real choice.** Sources disagree, or it is a judgement about Pip that research cannot settle. Where the research points one way, the Brief says what Pip will do and the form does not ask.
3. **Every option says what Pip would say or do.**
4. **The recommended answer can be ticked.** Where the recommendation combines two things (one answer for some gardeners, another for the rest), that combination is one option.
5. **It does not ask a Founder to judge the research.** Whether a rating is believable, whether the scope was kept, and whether a default is sound are the ROC's to answer.

## 3B. Before a Form Goes to the Shed

1. **Dry run.** Answer the form using only the Brief and the form, as a Founder would. Fix every question that needed anything else.
2. **Check each stated rating** against the dossier's own table of findings, not against a summary of it.
3. **Show the questions to a Founder in conversation** before the form is delivered.
4. **One form first.** When the pattern has changed, deliver one form, let a Founder try it, and only then prepare the others.

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

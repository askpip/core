# Founder Review Companion Documents — Briefs and Forms

## Document Metadata

**Document Title:** Founder Review Companion Documents — Briefs and Forms
**Document Type:** Operational Reference Note (not a Standard)
**Status:** Approved for use — the patterns here are required by Founder Review Dossier Standard §2.6 and ROC Operations Manual §10.6A and §14.5
**Prepared By:** Research Origin Curator (ROC), at a Founder's request
**Date:** 5 October 2026
**Version:** 0.7
**Purpose:** To give the patterns for the four documents a Founder reads or fills in: the Decision Brief and Review Form that go with a Founder Review Dossier (FRD), and the Build Check Brief and Build Check Form that go with a package of PIP Knowledge Records (PKRs) built by the Knowledge Integration Technician (KIT).
**Related Documents:** `Knowledge Curation System/Standards/Pip_Knowledge_Rules.md`; `Knowledge Curation System/Standards/Founder_Review_Dossier_Standard.md` §2.6 and §2.6A; `Knowledge Curation System/Operations Manuals/ROC_Operations_Manual.md` §8.6A, §11.4A, §11.4B and Chapter 14; `Shed/README.md` ("Fillable forms"); `AI/Skills/Garden_Shed_Operations_Skill.md`
**Revision Note:** Version 0.7 (5 October 2026) brings the Build Check Brief and Form into line with the first Build Check as run, names the worked examples, and adds the checks that would have caught the faults that check found. Version 0.6 rebuilt the patterns on the Pip Knowledge Rules. Three short forms in a row asked a Founder to choose between answers the research had already settled. The Decision Brief now states what Pip would say under the rules, and the Review Form asks only what the rules leave to the Founders, which is usually the overall decision alone. Version 0.5 added the question test and the checks before delivery. Version 0.4 replaced the long form that asked for a decision on every finding, and added the Build Check documents.

---

## 1. The Two Review Points

| When | What a Founder reads | Where a Founder decides | What is being decided |
|---|---|---|---|
| After research | Decision Brief | Review Form | Whether the dossier becomes an Approved Research Compilation (ARC), and anything the Pip Knowledge Rules cannot settle |
| After KIT builds | Build Check Brief | Build Check Form | Whether Pip's words are approved for publishing |

The dossier and the PKR package remain the governed records. The four documents here add no evidence, finding or confidence level. Where one differs from the record it summarises, the record governs.

None of the four narrates how it was produced, addresses a reviewer by name, or asks about scheduling or what work comes next.

## 2. Decision Brief

Plain language, proportionate to the dossier. A Founder who reads only sections 1 and 2 should know what Pip would say and how sure the sources are. Sections, in this order:

1. **What you are being asked to do.** Usually one thing: approve the research record. Name any other question.
2. **What Pip would say.** For each commissioned question, what the Pip Knowledge Rules give from the findings, in the words a gardener could be told, each point with its strength. Where sources disagree: the better-supported view first, and who disagrees. Where figures differ: the range. What is local, and to where.
3. **What Pip would not say, and why.** Findings kept on record only; gaps, and what Pip says about each gap; products and amounts.
4. **What the rules cannot settle.** Any question of scope or of how Pip works that is not already a standing decision, with its options in words. Omit the section when there is none.
5. **What was researched.** The commissioned questions and the kinds of source.
6. **The findings.** Every finding in tables, grouped as in the dossier: identifier, plain statement, confidence, and a **For Pip** column giving "Yes", or the rule that applies ("Yes, locally"; "Yes, as a precaution"; "To say there's a gap"), or "On record only".
7. **Where the sources differ.** Each recorded disagreement, and which view is better supported.
8. **What approval would and would not do.**
9. **Where to find the detail,** and a source key.

Say plainly that a rating measures how strong the evidence is, not how much the finding matters.

Where sources name types of product, section 2 has a block saying which types the sources name, who names them and how strong that is. Brand names and mixing amounts never appear.

Worked example: `FRD-BUSHROSE-SPRAYING-02_Decision_Brief.md`.

## 3. Review Form

The form asks only what Founder Review Dossier Standard §2.6A allows. Its first line is `<!-- shed-form v1 -->`. Skeleton:

```
<!-- shed-form v1 -->
# Founder Review Form — <dossier title>

<Two sentences: read the Brief first; the Brief's section 2 is what Pip would say.>

## Your decision

[[choice:outcome|Your decision on this dossier|Approve. The research goes on record as ARC-…, and Pip may say what Brief section 2 sets out.;Approve with the changes I've noted below.;Request further work before deciding.;Decline to approve.]]

## Anything else | optional

[[area:notes|Anything you want changed, kept out of Pip, or researched further. Say what it is in your own words.]]
```

Where the Brief's section 4 names a question the rules cannot settle, add it before "Your decision":

```
## <The question's subject>

[[choice:q1|<Question in plain words>?|<What Pip does under this answer>;<What Pip does under this answer>|comment]]
[[more:q1m|What bears on this|<what the research can and cannot say about it>]]
```

Rules:

- Most forms have one question. A second or third appears only for a matter the Pip Knowledge Rules §5 leave to the Founders, and only where it is not already a standing decision (Pip Knowledge Rules §7).
- No question on any finding, no choice between answers where the rules give one, and no question about the research, its ratings, its defaults or further research.
- An option's text cannot contain a semicolon, a vertical bar or a closing square bracket.
- Never reuse a question's identifier with different options once anyone has answered: the Shed would count the old answer as given while showing nothing ticked. Give a changed question a new identifier.

## 3A. The Question Test

Every question on a form shall pass all five.

1. **The rules cannot answer it.** It is a question of scope or of how Pip works. If the Pip Knowledge Rules give an answer, the Brief states it and the form does not ask.
2. **It has not been decided before.** Check the standing decisions.
3. **It can be answered from its own words.** No finding number, option letter or code that has to be looked up.
4. **Every option says what Pip would say or do.**
5. **It does not ask a Founder to judge the research.**

## 3B. Before a Brief or Form Goes to the Shed

1. **Read the dossier's findings, not a summary of them.** State what the rules give from the findings themselves.
2. **Check each stated rating** against the dossier's own table of findings.
3. **Dry run.** Read the Brief and answer the form as a Founder would, using nothing else. Fix whatever needed anything else.
4. **Show the Brief's "What Pip would say" and the form's questions to a Founder in conversation** before delivery.
5. **One first.** When the pattern has changed, deliver one, let a Founder try it, and only then prepare the others.
6. **Who says it.** Wherever the Brief says "sources say", check the dossier shows at least two independent sources for that part. Where one source says it, name it.
7. **Nothing left out.** For each commissioned question, check that what the sources name is in the Brief or is listed under "What Pip would not say" with its reason.

## 4. Build Check Brief

Prepared by the ROC after the Build Check (ROC Operations Manual Chapter 14). Sections, in this order:

1. **What this is.** The package, the ARC or ARCs it was built from, and what is being asked: approval to publish.
2. **What gardeners will see.** Pip's words, question by question and statement by statement, in a table: the statement, the limit shown under it, what it is shown with (its confidence, or Precaution, Sources disagree, No source found), who it is shown to, the finding it rests on, and the result (Pass, Pass with a note, Fail).
3. **The check in numbers.** Sources reopened and quotations checked: confirmed, changed, could not open. Statements checked, passed, passed with a note and failed, round by round. One plain sentence on how the pages were read.
4. **Notes and failures.** Each failure in plain words, and what was done about it. Each note on the final version. Then, where the check found the research record says more than its sources: a table of each such finding, what the record says and what the sources say, with any change of rating in bold. A failed statement is corrected and rechecked before the Brief goes to the Founders, and the Brief says so.
5. **What was left out.** The findings KIT did not use, grouped by reason: on record only, or not needed.
6. **Decisions still open.** Any choice the package needs from a Founder, with options in words. Omitted when there is none.
7. **Where to find the detail.** The package file, the ARC and its Source Register.

## 5. Build Check Form

A check-off. Skeleton:

```
<!-- shed-form v1 -->
# Build Check Form — <package title>

<Two sentences: read the Build Check Brief first; this approves Pip's words for publishing.>

## Approval to publish

[[choice:publish|Your decision on Pip's words|Approve for publishing.;Approve with the changes I've noted below.;Hold.]]

## Anything else | optional

[[area:notes|Any statement you want reworded, removed or looked at again. Say which, in your own words.]]
```

A decision still open is added before "Approval to publish", and shall pass the question test (§3A).

Where the Brief's section 4 lists corrections to the research record, the first option reads "Approve for publishing, and make the corrections to the research record listed in Brief section 4." That option carries the Founder authorisation the corrections need (ROC Operations Manual §13.4, §14.4). No separate question is asked about them.

Worked example: `PKR-CGD-BUSHROSE-SPRAYING-01_Build_Check_Brief.md` and its Form.

## 6. File Naming and Location

| Document | Name | Location |
|---|---|---|
| Decision Brief | `FRD-<subject-scope>-<sequence>_Decision_Brief.md` | `Working/Founder Review/` |
| Review Form | `FRD-<subject-scope>-<sequence>_Review_Form.md` | `Working/Founder Review/` |
| Build Check Brief | `<package name>_Build_Check_Brief.md` (for example `PKR-CGD-BUSHROSE-SPRAYING-01_Build_Check_Brief.md`) | `Working/Founder Review/` |
| Build Check Form | `<package name>_Build_Check_Form.md` | `Working/Founder Review/` |

Renaming or moving a form's file makes the Garden Shed delete the old row and every saved answer with it. Change a form's content in place.

## 7. Presenting to the Founders

Each pair is surfaced through the Garden Shed's notice workflow (`AI/Skills/Garden_Shed_Operations_Skill.md` §5):

1. A "Founder Attention Request" notice on the Notice Board, requiring approval.
2. Links from the notice to the record, the brief and the form, in that order.
3. The to-do the notice creates, edited to name the record and the action: read the brief, then fill in and Finish the form.

Either Founder's finished, decisive form is enough on its own for the ROC or KIT to act (ROC Operations Manual §11.2A).

## End of Document

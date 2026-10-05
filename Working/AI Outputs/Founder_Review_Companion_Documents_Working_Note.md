# Founder Review Companion Documents — Pip's Answers and its Form

## Document Metadata

**Document Title:** Founder Review Companion Documents — Pip's Answers and its Form
**Document Type:** Operational Reference Note (not a Standard)
**Status:** Approved for use — the pattern here is required by Founder Review Dossier Standard §2.6 and ROC Operations Manual §10.6A and §14.5
**Prepared By:** Research Origin Curator (ROC), at a Founder's request
**Date:** 6 October 2026
**Version:** 0.9
**Purpose:** To give the pattern for the one document a Founder reads and the one form a Founder fills in for each topic: Pip's Answers and the Pip's Answers Form.
**Related Documents:** `Knowledge Curation System/Standards/Pip_Knowledge_Rules.md` (§5 to §7); `Knowledge Curation System/Standards/Founder_Review_Dossier_Standard.md` §2.6 and §2.6A; `Knowledge Curation System/Operations Manuals/ROC_Operations_Manual.md` §10.6A, Chapter 11 and Chapter 14; `Knowledge Curation System/Operations Manuals/KIT_Operations_Manual.md` Chapters 12 to 16; `Knowledge Curation System/Workflows/Knowledge_Integration_Workflow.md`; `Shed/README.md` ("Fillable forms"); `AI/Skills/Garden_Shed_Operations_Skill.md`
**Revision Note:** Version 0.9 (6 October 2026): the one-approval pattern was tried on Planting and Moving and a Founder decided to keep it. This note is rewritten around it. The Decision Brief, Review Form, Build Check Brief and Build Check Form are retired (§7). Version 0.8 (5 October 2026) added the pattern as a trial. Versions 0.4 to 0.7 developed the four earlier documents.

---

## 1. One Approval

A Founder reads one document and approves once (Pip Knowledge Rules §7, "One approval"; a Founder's decision of 6 October 2026).

| What happens | Who | A Founder reads it? |
|---|---|---|
| Research, evidence assessment and the Founder Review Dossier, with its Source Register | ROC | No. It is filed where a Founder can open it. |
| Pip's words, built as draft PIP Knowledge Records (PKRs) from the dossier's findings | KIT | No. |
| The Build Check: every source reopened, every statement checked, in sessions that took no part in the work being checked. What it finds is corrected in the dossier and in Pip's words first. | ROC | No. |
| **Pip's Answers**, and its one-question form | ROC and KIT | **Yes. This is the one thing.** |
| On approval: the research is filed as an Approved Research Compilation (ARC), and Pip's words are published | ROC, then KIT | No. A Founder pushes the files when asked. |

The one approval gives both approvals the Knowledge Curation System requires: that the information may enter the Mother Information Library, and that Pip's words may be published (Knowledge Integration Workflow, Stage 10).

The dossier and the PKR package remain the governed records. Pip's Answers adds no evidence, finding or confidence level. Where it differs from the record it shows, the record governs, except that Pip's words in section 1 of Pip's Answers are the words approved: the published records shall say exactly that, with only the changes a Founder wrote when approving or was shown and accepted afterwards (§3; PKR Standard §9.2 and §9.3).

Neither document narrates how it was produced, addresses a reviewer by name, or asks about scheduling or what work comes next.

## 2. Pip's Answers

Plain language. A Founder who reads only section 1 has read everything gardeners will see. Sections, in this order:

1. **What gardeners will see.** Every question and every statement, word for word as the app shows it, with its label (its confidence, or Precaution, Sources disagree, No source found) and who sees it where that is not everyone. A limit shown under a statement is shown under it here. Nothing else is in this section. For records that are not question answers (an observation, a gate, a step in a journey), this section shows what the gardener is shown and asked, in the order they meet it. This section is the Founder Review Rendering of every record in the package (PKR Standard §9.2).
2. **What you should know.** A short list, only of things a Founder would want to know before saying yes:
   - where experts disagree, and that Pip gives both sides or which way it leans;
   - what Pip could not find, and where it sends the gardener;
   - what is local, and anything that rests on one source;
   - what was left out and why, in a line each;
   - what the check changed in the research, in plain words, with any change of confidence level;
   - anything the app needs before gardeners see the answers; and
   - anything not yet checked.
   No finding numbers and no method.
3. **The check, in one line.** How many source pages on how many websites were reopened, that every recorded quotation was found, and that every statement was checked and none fails.
4. **Where the detail is.** File paths only: the dossier, the package, the sources and the check results.

Where sources name types of product, Pip names the type as the sources do. Brand names and mixing amounts never appear.

Where a commission produces nothing Pip would say (every finding is on record only, or the research answers a question about how the app should work), section 1 says so in one sentence, section 2 says what was found and what it means, and the form asks the same one question.

Worked example: `Working/Founder Review/PKR-CGD-BUSHROSE-PLANTMOVE-01_Pips_Answers.md` (once it is retired under ROC Operations Manual §12.9, in the repository's history).

## 3. Pip's Answers Form

One question. Its first line is `<!-- shed-form v1 -->`. Skeleton:

```
<!-- shed-form v1 -->
# Pip's Answers Form — <topic>

Read **Pip's Answers — <topic>** first. Its section 1 is every word gardeners would see.

## Your decision

[[choice:decision|Your decision on Pip's answers about <topic>|Approve. Publish these answers.;Approve with the changes I've written below.;Not yet. I've said why below.]]

## Anything else | optional

[[area:notes|Any statement you want reworded, removed or looked at again, or your reason for "Not yet". Say which, in your own words.]]
```

Rules:

- The form has one question. A question of scope, or of how Pip works, that the Pip Knowledge Rules cannot settle is not put on this form. It is asked in conversation before the build, because the build depends on the answer, and it is recorded as a standing decision if it will recur (Pip Knowledge Rules §5 and §7).
- No question on any finding, no choice between answers where the rules give one, and no question about the research, its ratings, its defaults or further research.
- An option's text cannot contain a semicolon, a vertical bar or a closing square bracket.
- Never reuse a question's identifier with different options once anyone has answered: the Shed would count the old answer as given while showing nothing ticked. Give a changed question a new identifier.

**What each answer does.**

| Answer | What follows |
|---|---|
| Approve | The ROC files the research as an ARC. KIT publishes Pip's words exactly as shown. |
| Approve with changes | The changes are made. A statement whose meaning changed is checked again. Then the ARC is filed and the answers are published, without a second form, where the Founder gave the new wording or asked for a statement to be removed. Where ROC or KIT has to write new wording, or a finding or its level changes, the changed statements are shown to the Founder, and accepted, before anything is filed or published. |
| Not yet | Nothing is filed or published. The ROC or KIT does what the Founder's reason calls for (more research, different wording, a different scope), and Pip's Answers is submitted again when it is ready. |

A Founder may also answer in conversation. The answer is recorded in the ARC's Founder Decision Record with its date and its words.

## 3A. The Question Test

Any question put to a Founder, on a form or in conversation, shall pass all five.

1. **The rules cannot answer it.** It is the approval itself, or a question of scope or of how Pip works. If the Pip Knowledge Rules give an answer, Pip's Answers states it and nobody asks.
2. **It has not been decided before.** Check the standing decisions.
3. **It can be answered from its own words.** No finding number, option letter or code that has to be looked up.
4. **Every option says what Pip would say or do.**
5. **It does not ask a Founder to judge the research.**

## 3B. Before Pip's Answers Goes to the Shed

1. **The Build Check is complete.** Every statement has a result and none fails (ROC Operations Manual §14.7).
2. **Section 1 is the package.** Check by script that every statement in section 1 is, word for word, a statement in the draft records, and that none is missing.
3. **Check each label** against the finding it rests on, as corrected by the check.
4. **Dry run.** Read Pip's Answers and answer the form as a Founder would, using nothing else. Fix whatever needed anything else.
5. **Who says it.** Wherever a statement says "sources" or "experts", check that at least two independent sources say that part. Where one does, the statement says "one source says".
6. **Nothing left out.** Every finding Pip may use is in a statement, or is in section 2 with the reason it was left out.
7. **It runs in the app.** Test copies of the draft records were loaded into a local build of the app (never the live LIL) and looked at, at phone width, for a plant in each country that has its own statements, and Pip's Answers says what was not checked.

## 4. File Naming and Location

| Document | Name | Location |
|---|---|---|
| Pip's Answers | `<package name>_Pips_Answers.md` (for example `PKR-CGD-BUSHROSE-PLANTMOVE-01_Pips_Answers.md`) | `Working/Founder Review/` |
| Pip's Answers Form | `<package name>_Pips_Answers_Form.md` | `Working/Founder Review/` |

Renaming or moving a form's file makes the Garden Shed delete the old row and every saved answer with it. Change a form's content in place.

## 5. Presenting to the Founders

The pair is surfaced through the Garden Shed's notice workflow (`AI/Skills/Garden_Shed_Operations_Skill.md` §5):

1. A "Founder Attention Request" notice on the Notice Board, requiring approval, whose main link is Pip's Answers.
2. Links from the notice to the Pip's Answers Form and to the dossier ("The research"), in that order.
3. The to-do the notice creates, edited to name the topic and the action: read Pip's Answers, then fill in and Finish the one-question form.

Either Founder's finished, decisive form is enough on its own for the ROC and KIT to act (ROC Operations Manual §11.2A).

## 6. After Approval

1. The ROC creates the ARC from the dossier, with the Build Check's corrections folded in and each finding's Build Check status recorded (ROC Operations Manual Chapter 12).
2. KIT marks the package Published and publishes the records (KIT Operations Manual Chapter 16).
3. Pip's Answers and the dossier are marked approved, with the date and the Founder's words, and are retired from the working folder under ROC Operations Manual §12.9.

## 7. Earlier Patterns, Retired

Before 6 October 2026 a Founder was given four documents at two review points: a Decision Brief and Review Form with each dossier, and a Build Check Brief and Build Check Form with each PKR package. They are no longer prepared.

- **Dossiers submitted under the earlier pattern and not yet decided** are taken up one at a time under this pattern. Their Decision Brief and Review Form are marked replaced when their Pip's Answers is posted.
- **A dossier already approved under the earlier pattern** stays approved. Its ARC is created, and what Pip says from it goes through the build, the Build Check and Pip's Answers like any other.
- **A form in the Shed prepared under the earlier pattern** that a Founder has already finished stands as that Founder's decision on the dossier.

The earlier patterns are in this note's history (Version 0.8 and before). `FRD-BUSHROSE-SPRAYING-02_Decision_Brief.md` and `PKR-CGD-BUSHROSE-SPRAYING-01_Build_Check_Brief.md` are the last worked examples of them (once retired under ROC Operations Manual §12.9, in the repository's history).

## End of Document

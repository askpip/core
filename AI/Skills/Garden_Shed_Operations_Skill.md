---
name: pip-garden-shed-operations
description: Operate the Garden Shed Office (the internal, Supabase-backed office app at shed.askpip.garden) as an AI session — composing or approving notices, adding to-dos, linking companion documents, and reading or explaining shed-form (fillable) documents. Use for any task that reads or writes shed_items, shed_todos, shed_item_links, shed_form_responses or the related tables, including when the AI has no Shed passphrase.
---

# Garden Shed Operations

## Document Metadata

**Document Title:** Garden Shed Operations Skill
**Document Type:** PIP Artificial Intelligence Operating System (PIP AI OS) Skill
**Version:** 0.8
**Status:** Approved — Version 0.6 approved by a Founder in chat, 1 October 2026; Version 0.7 approved by AskPIP Founder Authority, 5 October 2026; Version 0.8 on a Founder's decision of 6 October 2026
**Owner:** The Founders
**Permanent Location:** `AI/Skills/Garden_Shed_Operations_Skill.md`
**Purpose:** To give an AI session the minimum operational reference needed to work correctly in the Garden Shed Office without a passphrase, without re-deriving conventions from `Shed/README.md`'s full build history each time.
**Related Documents:** `Shed/README.md` (authoritative, exhaustive technical record — this Skill summarises it, never overrides it); `AI/Skills/CORE_Integration_Skill.md` §6.1 (write-back format for a document approved through the Shed); `Working/AI Outputs/Founder_Review_Companion_Documents_Working_Note.md` (the Pip's Answers pattern this Skill is most often used to post, required by FRDS §2.6/§2.6A); `Knowledge Curation System/Operations Manuals/ROC_Operations_Manual.md` §11.2A (individual Founder approval authority); `Knowledge Curation System/Standards/Founder_Review_Dossier_Standard.md` §2.6A (what the Pip's Answers Form asks)
**Note:** This Skill is a distilled operational reference, not a replacement for `Shed/README.md`. When this Skill and `Shed/README.md` disagree, or when a mechanic isn't covered here, `Shed/README.md` governs — it is updated live as the Shed changes, and this Skill may lag it. If a discrepancy is found, note it and prefer `Shed/README.md`'s current text.
**Revision Note:** Version 0.8 (6 October 2026), on a Founder's decision to keep the one-approval pattern: §5 and §6 describe posting Pip's Answers and its one-question Form, which replace the Decision Brief, Review Form, Build Check Brief and Build Check Form. Version 0.7, at a Founder's direction (5 October 2026): §6 now says what a Review Form may ask under Founder Review Dossier Standard v1.4 §2.6A and the Pip Knowledge Rules, and notes that the `[[claim:…]]` directive is no longer used for findings. Version 0.6, at Shaphan's direction (29 September 2026): a Founder-attention email notification now exists, sent via Resend whenever a `shed_items` row is inserted with `email_founders = true` (a new column, deliberately independent of `requires_approval` — the email was briefly tied to `requires_approval` itself and was deliberately decoupled, since that flag alone is too broad and covers items that don't warrant an email). `shed_notice_templates` gained a matching `email_founders` column; the `founder_review` template (the "Founder Attention Request" notice pattern used by §5 below) has it set `true`, so picking that template in the Shed UI defaults the new "Send as a Founder Attention Request" checkbox on — the checkbox itself is offered nested under "This notice requires approval" and only shown once that's checked. §5 step 1 below is updated: an AI posting a Founder Attention Request notice by direct insert (§3) must now set `email_founders = true` explicitly alongside `requires_approval = true`, since the email no longer follows from `requires_approval` alone. §4's schema table gains the new column. Version 0.5, at Shaphan's direction (28 September 2026): §5 step 1 now states explicitly, in its own sentence, that a Founder Attention Request notice always takes `location = 'board'` — never `'cabinet'`, even though the headline document it links to lives in `'cabinet'`. This corrects a real instance where a notice was inserted with `location = 'cabinet'` by mistake; every other Founder Attention Request checked (including two posted by a Founder directly) used `'board', so the deviating instance is treated as an error to avoid repeating, not a second valid pattern. Version 0.4, at Shaphan's direction (28 September 2026): new §8 states two general operating rules, both prompted by a real correction but written here without reference to who was involved or what they answered — see §8 itself for why. Version 0.3, at Shaphan's direction (28 September 2026): §6 gains a pointer to FRDS §2.6A — an AI drafting a Review Form must trace every question to the paired FRD's own Founder Decision Points, never add a scheduling/"what's next" question. Version 0.2, at Shaphan's direction (28 September 2026): §6 previously said the AI should read back submitted Review Form answers "once both Founders have finished," reflecting how the Shed's `shed_get_form_responses` function behaved. That framing had been read, in practice, as meaning the ROC should wait for both Founders before acting on a Founder Review Dossier — a requirement no Founder had actually instructed (see `ROC_Operations_Manual.md` §11.2A, added the same day). §6 is corrected: a single Founder's finished, decisive response is sufficient on its own. `shed_get_form_responses` no longer withholds the other Founder's answers pending a Finish from both sides; each Founder's answers are visible to the other as soon as either is asked for, matching this correction. Version 0.1 creates this Skill.

---

# 1. Purpose

Use this Skill when a task requires reading or writing the Garden Shed Office's data: posting or approving a notice, adding or updating a to-do, linking companion documents to a notice, or reading/explaining a shed-form (fillable) document.

# 2. Scope

Apply this Skill when asked to:

- post a notice to the Shed's Notice Board, with or without requiring approval;
- link one or more documents to a notice (for example, Pip's Answers plus its Form and the dossier behind it);
- add, update or check a to-do;
- read approval or review-request status off a notice;
- read, explain or draft a `shed-form v1` fillable document; or
- otherwise inspect `shed_items`, `shed_todos`, `shed_todo_status_log`, `shed_item_links`, `shed_form_responses` or `shed_notice_templates` state.

This Skill does not cover editing the Shed's own application code (`Shed/source/template.html`, `Shed/source/build_live.py`, the art pipeline) or its deployment — that remains general repository/software work, governed by ordinary CORE integration practice and `Shed/README.md`'s "Building" and "Deployment" sections.

# 3. Identity — the AI Has No Passphrase

Every write RPC in the Shed (`shed_add_notice`, `shed_add_todo`, `shed_add_item_link`, `shed_set_notice_approval`, and so on) takes a passphrase, resolved server-side to one of the two named Shed users (currently Shaphan and Karla). The AI does not have, and shall never seek, obtain or attempt to guess either passphrase.

**Sanctioned alternative: post directly.** `shed_notice_templates.notes` (for the `info_request` template) documents this explicitly: add a matching to-do "by hand (`shed_add_todo`, or a direct insert + `shed_todo_status_log` row if posting as the AI)." The established pattern, used for every AI-authored Shed write so far, is a direct `INSERT` into the relevant table(s) instead of calling the passphrase-gated RPC. This is available for any of the writes in scope above, not only to-dos.

**Attribution.** Set `created_by` / `updated_by` (or the equivalent attribution field) to the name of the Founder who instructed the write — the same value the RPC would have resolved from their passphrase — not a literal "AI" placeholder; `shed_users` has no row for an AI identity. This has been the practice in both instances so far (the `PRUNINGFRAMEWORK` and `BASICCARE` Founder Attention Request notices), but it has not been separately confirmed with a Founder as a fixed rule — if attribution matters for a specific write, confirm it rather than assuming.

**Triggers fire regardless of path.** `shed_items_notice_todo_trg` (`AFTER INSERT ON shed_items`, firing `shed_notice_requires_approval_todo()` whenever `requires_approval = true`) and `shed_notice_review_requested_todo_trigger` both fire identically whether the insert came through an RPC or a direct `SQL INSERT`. Do not manually duplicate what a trigger will already do — for example, do not hand-insert a `shed_todos` row for a new approval-required notice; let the trigger create it, then only edit its wording afterward if it needs to say more than the trigger's default text.

**A direct insert's own `RETURNING` clause will not show trigger-set columns** (for example, a new notice's `todo_id` is set by the trigger's own `UPDATE`, which runs after the `INSERT` statement's row image is captured) — follow up with a plain `SELECT` to confirm the trigger's effect before reporting it as done, per `AI/Skills/Verify_Before_Claiming_Skill.md`.

# 4. Schema Quick Reference

This is a condensed index, not the full schema. `Shed/README.md` documents every column and migration in full.

| Table | Holds | Notable columns |
|---|---|---|
| `shed_items` | Every notice, cabinet document, bookshelf entry, gallery/rug item | `location` ('board'/'cabinet'/'bookshelf'/'rug'/'gallery'), `title`, `body`, `source` ('seed'/'synced'/'user'), `folder`, `source_path` (unique key for git-synced docs), `linked_item_id` (a notice's single "headline" document), `requires_approval`, `email_founders` (sends a Founder-attention email via Resend on insert — independent of `requires_approval`, see Revision Note), `approved`/`approved_by`/`approved_at`, `review_requested`/`review_requested_by`/`review_requested_at`, `notes`, `todo_id`, `created_by`/`updated_by` |
| `shed_todos` | To-Do List entries | `text`, `status` ('new'/'received'/'in_progress'/'blocked'/'completed'), `sort_order`, `created_by`/`updated_by` |
| `shed_todo_status_log` | Append-only history of to-do status changes | `todo_id`, `status`, `set_by`, `set_at` |
| `shed_item_links` | Extra links on a notice beyond its single `linked_item_id` — internal documents or external URLs | `item_id` (the notice), `linked_item_id` (another `shed_items` row) **or** `url` (exactly one of the two set), `label`, `added_by`, `added_at`, `sort_order` |
| `shed_form_responses` | Per-person answers to a `shed-form v1` document | `item_id`, `user_name`, `answers` (jsonb), `started_at`, `updated_at`, `submitted_at` — primary key `(item_id, user_name)` |
| `shed_notice_templates` | Reusable notice bodies | `key`, `title`, `body`, `requires_approval`, `has_reply`, `has_upload`, `notes`, `label` |

# 5. The Founder Attention Request Notice Pattern

Used to put a completed piece of work in front of the Founders for a decision. Most often this is Pip's Answers for a topic: the headline link is Pip's Answers, and the additional links are its Form and then the dossier, labelled "Pip's Answers Form" and "The research" (see §6). Where a notice already exists for the same dossier from the earlier pattern, update that notice and its links in place rather than posting a second one.

1. Insert a `shed_items` row: `location = 'board'`, `source = 'user'`, `requires_approval = true`, `email_founders = true` (so both Founders get emailed — this does not follow automatically from `requires_approval` alone, see Revision Note), a clear `title` (conventionally "Founder Attention Request"), and a `body` explaining what's being asked and where to start. Set `linked_item_id` to the single most important document (the "headline" link — drives the notice's main "Review:/Open:" button). **The notice row's own `location` is always `'board'` — never copy `'cabinet'` from the headline document it links to.** The two live in different places for a reason: the headline document belongs in the File Cabinet as a lasting record; the notice belongs on the Notice Board as the thing that surfaces it for action. A past instance filed a notice under `'cabinet'` by mistake — every other Founder Attention Request checked, including ones posted by a Founder directly, used `'board'`.
2. The `shed_items_notice_todo_trg` trigger fires automatically and creates a matching `shed_todos` row ("Review & approve: <linked document's title>"). Re-read it, and edit its `text` if the default wording needs to name a specific identifier or spell out a multi-step action (for example, "Approve Pip's answers on <topic>: read Pip's Answers, then fill in and Finish the one-question form").
3. For every additional document beyond the headline link, insert a `shed_item_links` row (`item_id` = the notice's id, `linked_item_id` = the other document's id, `added_by` = the instructing Founder's name, `sort_order` incrementing from 1). This is how a notice points at more than one document — `linked_item_id` alone only supports one.
4. Verify: re-`SELECT` the notice to confirm `todo_id` was set by the trigger, and `SELECT` the `shed_item_links` rows to confirm they're attached in the intended order.

# 6. Reading and Filling `shed-form v1` Documents

A synced `.md` document whose first line is exactly `<!-- shed-form v1 -->` is rendered by the Shed as a fillable form rather than plain text. The file remains ordinary Markdown for Core and for git.

Directive syntax (one per line):

| Directive | Renders as |
|---|---|
| `[[choice:id\|question\|opt1;opt2;...\|commentLabel]]` | A radio choice with a question, and an optional trailing free-text comment field |
| `[[claim:id\|opt1;opt2;opt3;opt4]]` | A radio choice tied to the preceding card — no question text. Used in Review Forms prepared before Founder Review Dossier Standard v1.4, which asked for a decision on each finding. No form prepared since uses it |
| `[[more:id\|title\|content]]` | A static collapsible info box (not a form field) |
| `[[comment:id\|question]]` | A standalone free-text textarea with its own question |
| `[[area:id\|label]]` | A plain free-text textarea |
| `[[text:id\|label]]` | A single-line text input |

Each Founder's answers autosave privately (`shed_form_responses`, keyed by `item_id` + `user_name`); each Founder can see the other's answers as soon as either asks (`shed_get_form_responses`, or a direct `SELECT`) — neither Founder has to finish first, and an AI session may read back submitted or in-progress answers at any time. **A single Founder's finished, decisive response is enough on its own** for the ROC and KIT to act on (file the ARC under Chapter 12 and publish, or take whatever next step the outcome calls for) — per `ROC_Operations_Manual.md` §11.2A, approval does not require joint action by both Founders. Do not wait for the other Founder to also finish before proceeding, and do not treat an unfinished response from one Founder as a reason to hold off acting on the other's completed one. If both Founders finish the same form with conflicting decisive outcomes, treat that as a conflict requiring further Founder direction (§11.2A) rather than acting on either alone. An AI session drafting a new form writes the directive syntax directly into the Markdown file — it does not need to interact with `shed_form_responses` to author a form, only to read back answers once at least one Founder has finished. See `Shed/README.md`'s "Fillable forms" section for the exact mechanics.

**The Pip's Answers Form asks one question** (Founder Review Dossier Standard §2.6A): the decision on Pip's answers, with the key `decision` and three options (approve; approve with changes; not yet), plus one optional comments box with the key `notes`. It never asks for a decision on each finding, never asks a Founder to choose between answers where the rules give one, and never asks about scheduling or what work should happen next. Before posting, apply the question test and the checks in `Working/AI Outputs/Founder_Review_Companion_Documents_Working_Note.md` §3A and §3B. To read a Founder's answer: `select user_name, answers, submitted_at from public.shed_form_responses where item_id = <the form's item id>`. A Founder may also give the decision in conversation.

Forms prepared under the earlier pattern (Review Forms, Build Check Forms) remain readable in the same way. A Review Form a Founder has already finished stands as that Founder's decision on the dossier only. It is not approval to publish: what Pip says from that dossier still goes through the build, the Build Check and Pip's Answers. A finished Build Check Form stands as the decision on that package.

# 7. Verification

Before reporting a Shed write as complete, confirm it with a fresh read (a `SELECT`, or the read-side RPC) rather than relying on the write call's own return value — especially for anything a trigger touches (§3) or that depends on a second follow-up write (§5.3). Apply `AI/Skills/Verify_Before_Claiming_Skill.md`.

# 8. Confirm Before Posting, and Keep It General

Two operating rules, stated here generically rather than tied to any specific past instance, since the point of both is exactly to avoid baking a specific person's specific answer into a document meant to last:

**Confirm with the instructing Founder before posting anything to the Notice Board beyond a routine Founder Attention Request (§5).** Posting a completed piece of work for decision, per an already-given instruction, doesn't need a fresh check each time. But composing a notice that announces a policy or process change, is directed at what one particular Founder should know or do differently, or restates something decided in conversation is a judgement call about how and whether to communicate it — check with the instructing Founder first, including on the wording, rather than deciding unilaterally that a notice is the right vehicle.

**Do not record a specific Founder's specific answers, or which Founder gave them, as illustrative material in a governing document, Skill, or notice meant to persist.** When fixing a mistake (a wrongly-scoped question, a misapplied rule, or anything similar), state the corrected rule and, where useful, a hypothetical illustration — never a real Founder's name paired with what they actually answered. A future AI reading this Skill, or the Standards it points to, needs the rule that now applies; it has no need to know a specific Founder's history of specific answers, and recording it serves no operational purpose while adding a real person's specifics to a permanent record. If a document already contains this kind of detail, remove it rather than leave it as a "worked example."

# End of Skill

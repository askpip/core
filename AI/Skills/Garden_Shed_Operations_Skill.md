---
name: pip-garden-shed-operations
description: Operate the Garden Shed Office (the internal, Supabase-backed office app at shed.askpip.garden) as an AI session — composing or approving notices, adding to-dos, linking companion documents, and reading or explaining shed-form (fillable) documents. Use for any task that reads or writes shed_items, shed_todos, shed_item_links, shed_form_responses or the related tables, including when the AI has no Shed passphrase.
---

# Garden Shed Operations

## Document Metadata

**Document Title:** Garden Shed Operations Skill
**Document Type:** PIP Artificial Intelligence Operating System (PIP AI OS) Skill
**Version:** 0.1
**Status:** Draft — for Founder approval
**Owner:** The Founders
**Permanent Location:** `AI/Skills/Garden_Shed_Operations_Skill.md`
**Purpose:** To give an AI session the minimum operational reference needed to work correctly in the Garden Shed Office without a passphrase, without re-deriving conventions from `Shed/README.md`'s full build history each time.
**Related Documents:** `Shed/README.md` (authoritative, exhaustive technical record — this Skill summarises it, never overrides it); `AI/Skills/CORE_Integration_Skill.md` §6.1 (write-back format for a document approved through the Shed); `Working/AI Outputs/Founder_Review_Companion_Documents_Working_Note.md` (the Decision Brief / Review Form pattern this Skill is often used to post)
**Note:** This Skill is a distilled operational reference, not a replacement for `Shed/README.md`. When this Skill and `Shed/README.md` disagree, or when a mechanic isn't covered here, `Shed/README.md` governs — it is updated live as the Shed changes, and this Skill may lag it. If a discrepancy is found, note it and prefer `Shed/README.md`'s current text.

---

# 1. Purpose

Use this Skill when a task requires reading or writing the Garden Shed Office's data: posting or approving a notice, adding or updating a to-do, linking companion documents to a notice, or reading/explaining a shed-form (fillable) document.

# 2. Scope

Apply this Skill when asked to:

- post a notice to the Shed's Notice Board, with or without requiring approval;
- link one or more documents to a notice (for example, an FRD plus its Decision Brief and Review Form);
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
| `shed_items` | Every notice, cabinet document, bookshelf entry, gallery/rug item | `location` ('board'/'cabinet'/'bookshelf'/'rug'/'gallery'), `title`, `body`, `source` ('seed'/'synced'/'user'), `folder`, `source_path` (unique key for git-synced docs), `linked_item_id` (a notice's single "headline" document), `requires_approval`, `approved`/`approved_by`/`approved_at`, `review_requested`/`review_requested_by`/`review_requested_at`, `notes`, `todo_id`, `created_by`/`updated_by` |
| `shed_todos` | To-Do List entries | `text`, `status` ('new'/'received'/'in_progress'/'blocked'/'completed'), `sort_order`, `created_by`/`updated_by` |
| `shed_todo_status_log` | Append-only history of to-do status changes | `todo_id`, `status`, `set_by`, `set_at` |
| `shed_item_links` | Extra links on a notice beyond its single `linked_item_id` — internal documents or external URLs | `item_id` (the notice), `linked_item_id` (another `shed_items` row) **or** `url` (exactly one of the two set), `label`, `added_by`, `added_at`, `sort_order` |
| `shed_form_responses` | Per-person answers to a `shed-form v1` document | `item_id`, `user_name`, `answers` (jsonb), `started_at`, `updated_at`, `submitted_at` — primary key `(item_id, user_name)` |
| `shed_notice_templates` | Reusable notice bodies | `key`, `title`, `body`, `requires_approval`, `has_reply`, `has_upload`, `notes`, `label` |

# 5. The Founder Attention Request Notice Pattern

Used to put a completed piece of work (most often an FRD and its companion documents — see §6) in front of the Founders for a decision.

1. Insert a `shed_items` row: `location = 'board'`, `source = 'user'`, `requires_approval = true`, a clear `title` (conventionally "Founder Attention Request"), and a `body` explaining what's being asked and where to start. Set `linked_item_id` to the single most important document (the "headline" link — drives the notice's main "Review:/Open:" button).
2. The `shed_items_notice_todo_trg` trigger fires automatically and creates a matching `shed_todos` row ("Review & approve: <linked document's title>"). Re-read it, and edit its `text` if the default wording needs to name a specific identifier or spell out a multi-step action (for example, "read the Brief, then fill in and Finish the Review Form").
3. For every additional document beyond the headline link, insert a `shed_item_links` row (`item_id` = the notice's id, `linked_item_id` = the other document's id, `added_by` = the instructing Founder's name, `sort_order` incrementing from 1). This is how a notice points at more than one document — `linked_item_id` alone only supports one.
4. Verify: re-`SELECT` the notice to confirm `todo_id` was set by the trigger, and `SELECT` the `shed_item_links` rows to confirm they're attached in the intended order.

# 6. Reading and Filling `shed-form v1` Documents

A synced `.md` document whose first line is exactly `<!-- shed-form v1 -->` is rendered by the Shed as a fillable form rather than plain text. The file remains ordinary Markdown for Core and for git.

Directive syntax (one per line):

| Directive | Renders as |
|---|---|
| `[[choice:id\|question\|opt1;opt2;...\|commentLabel]]` | A radio choice with a question, and an optional trailing free-text comment field |
| `[[claim:id\|opt1;opt2;opt3;opt4]]` | A radio choice tied to the preceding finding/conflict block — no question text, no comment field. For a finding: always `Approve;Approve with a change;Flag;Do not approve`. For a disagreement or open item: always `Accept as recorded;Commission research;Give a direction` |
| `[[more:id\|title\|content]]` | A static collapsible info box (not a form field) |
| `[[comment:id\|question]]` | A standalone free-text textarea with its own question |
| `[[area:id\|label]]` | A plain free-text textarea |
| `[[text:id\|label]]` | A single-line text input |

Each Founder's answers autosave privately (`shed_form_responses`, keyed by `item_id` + `user_name`); one Founder cannot see the other's answers until both have pressed **Finish**, at which point the form itself shows where they differ. An AI session drafting a new form writes this directive syntax directly into the Markdown file — it does not need to interact with `shed_form_responses` to author a form, only to read back submitted answers once both Founders have finished (`shed_get_form_responses`, or a direct `SELECT` — see `Shed/README.md`'s "Fillable forms" section for the exact privacy behaviour before Finish).

# 7. Verification

Before reporting a Shed write as complete, confirm it with a fresh read (a `SELECT`, or the read-side RPC) rather than relying on the write call's own return value — especially for anything a trigger touches (§3) or that depends on a second follow-up write (§5.3). Apply `AI/Skills/Verify_Before_Claiming_Skill.md`.

# End of Skill

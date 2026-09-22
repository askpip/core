# Ask Pip App Known Issues and Process Notes

## Document Metadata

**Document Title:** Ask Pip App Known Issues and Process Notes
**Document Type:** PIP Artificial Intelligence Operating System (PIP AI OS) Context
**Version:** 0.1
**Status:** Draft — for Founder Review
**Owner:** The Founders
**Approved By:** AskPIP Founder Authority
**Permanent Location:** `AI/Context/Ask_Pip_App_Known_Issues_and_Process_Notes_Context.md`
**Last Updated:** 23 September 2026
**Purpose:** To record process, tooling and governance-adjacent problems discovered while working on the Ask Pip application and its Garden Shed Office records, so a future AI session does not rediscover them the hard way.
**Related Documents:** `AI/Skills/Garden_Shed_Operations_Skill.md`; `AI/Skills/Verify_Before_Claiming_Skill.md`; `AI/PIP_AI_Operations_Manual.md`; `AI/Context/Ask_Pip_App_Build_Status_Context.md`; `MVP/Architecture/Ask_Pip_App_Engineering_Architecture.md`

---

# 1. Purpose and Scope

This is a running log, not a Standard: entries here describe things that were true and worth knowing at the time they were recorded, not binding rules. Where an entry describes a genuine process gap rather than a one-off mistake, it should eventually be proposed as a governed fix (a Skill amendment, a Loading Guide row, or similar) rather than left to live here indefinitely — this document is where a problem gets written down before that happens, not a replacement for fixing it.

Add an entry whenever a future session discovers something in this category. Keep entries short and specific: what happened, why, and what to do differently.

# 2. Garden Shed Office Process Notes

## 2.1 Creating a Founder Attention Request Notice Can Silently Duplicate a To-Do

Creating a "Founder Attention Request" board notice (a `shed_items` row) appears to also generate its own linked to-do automatically, connected back to the notice through `shed_items.todo_id` — not through any field on `shed_todos` itself; the link lives on the notice, not the to-do. That auto-generated to-do's text defaults to the generic "Review & approve: Founder Attention Request," with nothing identifying which FRD or subject it actually concerns.

If an AI also separately writes its own descriptive to-do for the same subject in the same action — a reasonable instinct, since the generic text alone is not useful — the result is two rows for one notice: one correctly linked but unhelpfully generic, and one descriptively worded but orphaned, with no link back to anything. This happened for four FRDs in one session before being caught (see the Build Status Context's Phase B section for the FRDs in question) and, separately, the orphaned copy had been created already marked `in_progress` despite no review having actually started — status set at creation, not by any genuine review activity.

**Do instead:** create the notice, let its to-do auto-generate, then update that one to-do's own `text` field to something descriptive — the FRD's identifier, what it covers, and what the Founder needs to do — rather than writing a second row. After creating a notice, verify exactly one to-do exists for it (`select * from shed_items where todo_id = <notice id>` finds it; confirm no orphaned duplicate exists alongside it) and that its status genuinely reflects whether review has started, not just what it defaulted to at creation.

## 2.2 To-Do Status Is Not Review Status

A to-do's `status` field (`new` / `in_progress` / `completed`) reflects whether someone has opened or touched the to-do — `updated_by` and `updated_at` diverging from `created_by`/`created_at` is a reasonable signal that a human genuinely engaged with it. It does not reflect whether a Founder Review Form was actually submitted for the FRD it concerns. Check `shed_form_responses` directly for that — an empty result means no review has been recorded, regardless of what the to-do's status says.

# 3. Tooling Notes

## 3.1 The Device Shell Is Intermittently Unavailable

`mcp__remote-devices__device_bash` — the shell that runs on the Founder's own linked computer — has repeatedly failed across sessions with "Workspace still starting," including after waits of 60 seconds or more, and separately with sandbox-dependency errors ("bubblewrap (bwrap) not installed," "ripgrep (rg) not found") on otherwise ordinary commands. This is not consistent: it sometimes works fine. Attempt it first in a new session rather than assuming it is unavailable.

**When it is not working:** stop retrying after three or four attempts rather than continuing to burn time against an unresponsive tool. Fall back to a pattern that does not depend on it:

1. `device_stage_files` to bring the file into the cloud workspace.
2. `Read` / `Edit` it there.
3. `device_commit_files` back to the same device path.
4. `device_stage_files` the same path again after a short pause (a few seconds — a same-second re-stage has returned stale cached content at least once) and `cmp -s` the two copies to confirm they are byte-identical before reporting the change as complete.

`device_list_dir` has been reliable throughout even when `device_bash` was not, and is sufficient for exploring repository structure without a shell.

## 3.2 Verifying a TypeScript/TSX Change Without a Real Build

With `device_bash` unavailable, `npm run build` and any linting cannot be run against the actual application and its full dependency graph. A partial substitute: install `esbuild` in the cloud workspace (`npm install --no-save esbuild`, no project context needed) and run it directly against the single edited file with `--bundle=false --jsx=automatic`. This catches syntax errors — unbalanced JSX, malformed TypeScript — but performs no type-checking against the rest of the codebase, and does not confirm the change behaves correctly at runtime. State this limitation plainly in any completion report rather than implying a full build passed, per the Verify Before Claiming Skill.

## 3.3 `App/` Source Is Not in the Garden Shed's Supabase Sync

Only the documentation and governance folders (`AI`, `Foundations`, `Knowledge Curation System`, `MVP`, `Standards`, `Working`, and similar) are mirrored into `shed_items` once pushed. `App/` — the application's own source code — is not. A Supabase query against `shed_items` for an app source file's title or path will correctly return nothing; that is not evidence the push failed. Verify app code state by staging the file from the device directly, or by the Founder's own confirmation.

# 4. Revision Log

- **23 September 2026 (Version 0.1):** Initial version, recording the Founder Attention Request to-do duplication (§2.1), the to-do-status-versus-review-status distinction (§2.2), the device shell's intermittent unavailability and its fallback pattern (§3.1–§3.2), and the App/Shed sync boundary (§3.3).

# End of Document

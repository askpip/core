---
name: pip-kit-lil-publication
description: Publish Founder-approved PKRs into the Live Intelligence Library (LIL), and revise, suspend or retire LIL records, as the Knowledge Integration Technician (KIT). Use whenever a PKR package has been approved and must reach the app, when a published PKR changes, or when checking that the live LIL matches the repository.
---

# KIT — LIL Publication

## Document Metadata

**Document Title:** KIT LIL Publication Skill
**Document Type:** PIP Artificial Intelligence Operating System (PIP AI OS) Skill
**Version:** 0.2
**Status:** Approved — Approved by the Founder (Shaphan) in chat, 1 October 2026
**Owner:** The Founders
**Permanent Location:** `AI/Skills/KIT_LIL_Publication_Skill.md`
**Last Updated:** 5 October 2026
**Purpose:** To let any AI acting as KIT move Founder-approved PKRs into the LIL correctly and verifiably, without reconstructing the procedure from past sessions.
**Related Documents:**
- `Knowledge Curation System/Operations Manuals/KIT_Operations_Manual.md` (Chapters 16–18)
- `Knowledge Curation System/Standards/LIL_Standard.md`
- `Knowledge Curation System/Standards/PKR_Standard.md` (§6, §7, §9)
- `Knowledge Curation System/Live Intelligence Library/README.md`
- `AI/Skills/KIT_PKR_Build_Skill.md` (the step before this one)
- `AI/Skills/Verify_Before_Claiming_Skill.md`

---

# 1. When to use this Skill

Use it when:

- a PKR package has explicit Founder approval (KIT PKR Build Skill §7) and must reach the app;
- a published PKR is revised, suspended or retired under Founder direction;
- anyone asks whether the LIL is up to date, or what Pip is actually reading.

Never use it to put a Draft into the LIL. The LIL holds only Published, Suspended and Retired records (LIL Standard; PKR Standard §7).

# 2. How the LIL is built

| Part | Where | Role |
|---|---|---|
| Records | `Knowledge Curation System/Live Intelligence Library/records/PKR-XXX-NNNNNN/vX.Y.json` | The reviewed source of every record version. The repository is authoritative. |
| Live LIL | Supabase `public.lil_pkr` (project `lapscltduzkbldfwcemq`) | What the app reads. The app sees Published rows only and can't write. |
| Publish function | `public.lil_publish_from_git(<40-char commit SHA>)` | Reads `lil_bundle.json` at that exact commit on GitHub and applies it. It never overwrites an existing version. |
| Publish log | `public.lil_publish_log` | One row per publish: commit, who, counts. |
| App snapshot | `App/src/data/lil-snapshot.json` | Offline fallback, generated from the same records. |
| Build tool | `Knowledge Curation System/Live Intelligence Library/tools/build_lil.py` | Validates, hashes, and generates the bundle, manifest, snapshot and SQL. |

# 3. The record format (`pip-lil-record/1`)

```json
{
  "schema": "pip-lil-record/1",
  "pkr_id": "PKR-OBS-000007",
  "version": "1.0",
  "pkr_type": "observation",
  "status": "Published",
  "title": "…",
  "common": {
    "applies_to": "…",
    "supporting_sources": ["PKR-SRC-000139"],
    "founder_approval_date": "2026-09-29",
    "related_pkrs": [{ "relationship": "decided by", "pkr_id": "PKR-DEC-000007" }],
    "preserved_uncertainty": "…",
    "evidence_confidence": "Per claim — see content"
  },
  "content": { },
  "provenance": {
    "approved_rendering": "Working/AI Outputs/<package>.md",
    "published_to_lil_by": "KIT",
    "published_to_lil_at": "YYYY-MM-DD",
    "note": "…"
  }
}
```

- **`pkr_type` must match the ID code:**

  | Code | `pkr_type` |
  |---|---|
  | OBS | `observation` |
  | DEC | `decision_logic` |
  | SGT | `suitability_gate` |
  | CGD | `care_guidance` |
  | DEF | `definition` |
  | SRC | `source` |
  | CMP | `comparison_image` |

- **`common` carries the PKR Standard §4 Common Fields.** Evidence confidence stays per claim: each `{ "text", "confidence" }` statement inside `content` carries its own level (`Very High`, `High`, `Moderate`, `Low`, `Very Low` or `Approved default`).
- **`content` is declarative data only** (PKR Standard §9.1): no code and no conditions beyond plain stated values. Follow the shape of the existing records of the same type; the app reads these fields by name:
  - **Observation:** `key`, `feature`, `journey_order`, `look_for`, `criteria`, `photo_limit`, the confirm, doesn't-match and not-sure texts, `any_more_question`.
  - **Decision Logic:** `choices`, `decision_notes`, `not_sure_choices`, `gate_conditions`, `cut_care_guidance`, `headline_confidence`.
  - **Care Guidance:** `heading`, `label`, `items`, `presentation`, `disclosure`. Each item is `{ "text", "confidence" }` and may also carry `limit` (shown under the statement), `kind` (`precaution`, `gap`, `disagreement` or `framing`), `place` (country codes such as `NZ`, `AU`, `US`; the item is shown only where the plant is in one of them) and `trace` (the findings, conflicts or gaps it rests on). An item of kind `gap`, `disagreement` or `framing` may have no `confidence`. A question answer that belongs to a topic carries `presentation.question_answer`: `{ "topic", "topic_title", "order" }`; order 1 is the lead question (PKR Standard §5.7, Version 0.12).
  - **Source:** `source_type`, `identity`, `url`, `register_code`, `relevance`.
- **A new field or a new kind of content is an app change as well.** Tell the Founders and update `App/src/data/pkr.ts`. Never smuggle meaning into an existing field.
- **Content equivalence (PKR Standard §9.3).** Every value must say what the approved Founder Review Rendering says, nothing more.

# 4. Publishing an approved package

1. **Confirm approval.** It must be explicit Founder approval in chat, recorded in the package (status line and decision record). No approval, no LIL.
2. **Write the record files.**
   - For each new PKR, create `records/<ID>/v1.0.json`.
   - For a revision, create a new file `v<next>.json` with status `Published`, and set the previous version's file to `"status": "Retired"`. That status edit is the only edit ever made to a published version file.
   - Copy wording from the approved rendering.
3. **Build and validate:** `python3 "Knowledge Curation System/Live Intelligence Library/tools/build_lil.py" build`.
   - It refuses to write anything if a record is malformed. Checks include:
     - the ID matches the type;
     - a Published record has an approval date;
     - supporting sources exist and are Published;
     - no `not_sure_choices` contains `cut`;
     - at most one Published version per PKR.
   - Fix every error it lists. Never loosen the tool to get past one; that's a governance change.
4. **Check the app** if content shapes changed: run `npm run build` in `App/`, and read the affected screens.
5. **Commit and push** the record files, `lil_bundle.json`, `lil_manifest.json` and `App/src/data/lil-snapshot.json`. If the session can't push, give the Founder the PowerShell block and wait until the push is confirmed. Get the full 40-character commit SHA (`git rev-parse HEAD`, or GitHub).
6. **Publish** (Supabase SQL, as the database owner, for example through the Supabase MCP `execute_sql` tool):
   `select public.lil_publish_from_git('<commit SHA>', 'KIT');`
   It returns the counts: inserted, already present, retired, and published now. It raises an error, and changes nothing, if an existing version's content differs (published versions are immutable) or if a status isn't allowed.
7. **Verify:**
   - Run the query in `build/verify.sql`, save its rows as a JSON array, and run `build_lil.py verify <file>`.
   - It must report "database matches the repository manifest exactly".
   - Only then report the publish as done (Verify Before Claiming Skill), stating the commit and the counts.
8. **Record it.** Add the change to `CHANGELOG.md` and the session handoff.

**Fallback if the database can't reach GitHub:** run `build/publish.sql` (generated by step 3) through SQL instead of step 6, then verify the same way.

# 5. Suspending or retiring a record (Founder direction only)

Change the version file's `status` to `Suspended` or `Retired`, then build, commit, publish and verify as in §4.

The app stops reading the record at its next load.

If the record is required by the journey, `App/src/data/pkr.ts` rejects the whole live set and stays on the snapshot. Tell the Founders what the gardener will see before doing this.

# 6. Checks at any time

- **What is live:** `select pkr_id, version, status from public.lil_pkr order by pkr_id, version;`
- **Publish history:** `select * from public.lil_publish_log order by id;`
- **Does the database match the repository?** Run §4 step 7.

# 7. Boundaries

- KIT never approves its own records and never changes approved meaning (KIT Charter; KIT OM Chapter 15).
- A published version is never edited or deleted. A correction is a new version under Founder direction (KIT OM Chapter 18).
- Access:
  - Writes to `lil_pkr` go only through `lil_publish_from_git` or the generated SQL, run by the database owner.
  - The app's keys can read Published rows only.
  - Never grant the app write access.
- Changing the table, the function or the build tool is software work. Record it in `tools/lil_schema.sql`, `App/supabase/schema.sql` and the CHANGELOG.

# End of Skill

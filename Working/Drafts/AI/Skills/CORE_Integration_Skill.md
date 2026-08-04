---
name: pip-integrate-core-assets
description: Manage scoped repository operations for PIP CORE assets, including creating or editing files in Working/Drafts, synchronising working drafts, and integrating Founder-approved assets into permanent locations. Use for repository paths, Git status, pulling, staging, committing, pushing, moving controlled assets, or verifying repository state. Apply the working-draft workflow separately from official CORE integration.
---

# CORE Integration

## Document Metadata

**Document Title:** CORE Integration Skill  
**Document Type:** PIP Artificial Intelligence Operating System (PIP AI OS) Skill  
**Version:** Unassigned — Founder decision required  
**Status:** Draft  
**Owner:** The Founders  
**Approved By:** Not approved  
**Proposed Permanent Location:** `AI/Skills/CORE_Integration_Skill.md`  
**Last Updated:** 4 August 2026  
**Purpose:** To govern repository operations for controlled Plant Intelligence Platform (PIP) assets in PIP CORE.  
**Related Documents:** `AGENTS.md`; `AI/PIP_AI_Constitution.md`; `AI/PIP_AI_Operations_Manual.md`; `AI/PIP_AI_Loading_Guide.md`; `Standards/PIP_CORE_Asset_Lifecycle_Standard.md`

---

# 1. Purpose

Use this Skill to perform repository operations without confusing working-draft development with official CORE integration.

# 2. Scope

Apply this Skill when asked to:

- create or edit a repository file;
- select or confirm a repository location;
- inspect repository status or changes;
- pull or reconcile repository updates;
- synchronise a working draft;
- stage, commit or push changes;
- move an approved asset to its permanent location;
- replace an authoritative asset with an approved revision; or
- verify repository state after an operation.

Use the Document Creation and Editing Skill when the task also changes document content.

# 3. Repository Operations

Distinguish between:

1. **Working-draft synchronisation:** recording scoped Draft changes in their existing `Working/Drafts/` location.
2. **Official CORE integration:** placing a Founder-approved asset in its approved permanent location and establishing it as repository-authoritative.

Do not apply official-integration requirements to routine working-draft synchronisation.

# 4. Working-Draft Authority

A Founder instruction to create or edit an asset within `Working/Drafts/` authorises the artificial intelligence (AI) to:

- save the scoped change in the requested working location;
- stage only the files changed for that instruction;
- commit the scoped change; and
- push it to the corresponding branch and remote.

This standing authority applies unless the Founder instructs the AI not to commit or push.

If the instruction is limited to review, recommendation, explanation or preparation of a prompt, do not edit or synchronise a repository file.

Working-draft synchronisation does not authorise the AI to:

- change an asset's status to Approved;
- assign or change an approved version;
- move an asset from `Working/Drafts/`;
- replace a repository-authoritative asset;
- modify unrelated files; or
- delete working material.

# 5. Working-Draft Synchronisation Procedure

Before editing or synchronising a working draft:

1. complete the PIP AI OS startup procedure;
2. identify the requested files and actions;
3. inspect the complete repository status;
4. identify unrelated local changes;
5. retrieve remote changes safely where required; and
6. stop if the requested operation would overwrite, combine with or depend upon unresolved unrelated work.

Then:

1. make only the authorised changes;
2. review the scoped diff;
3. verify that the asset remains Draft and in `Working/Drafts/`;
4. stage only the authorised files;
5. commit with a concise message describing the working-draft change;
6. push using ordinary Git or another available authorised repository capability; and
7. verify the resulting repository state.

GitHub CLI, a separate branch and a pull request are not required for working-draft synchronisation unless the Founder or an approved repository rule requires them.

If authentication, conflict, branch protection or another technical restriction prevents synchronisation, report the exact affected operation and stop. Do not substitute another publication workflow.

# 6. Official CORE Integration Authority

Official CORE integration requires Founder approval identifying or establishing, where applicable:

- the asset approved;
- its approved wording or contents;
- its approved version;
- its permanent repository location; and
- the scope of related repository changes.

Where any required decision remains unresolved, stop the affected integration action and request Founder direction.

# 7. Official CORE Integration Procedure

Before integration:

1. verify the Founder approval and integration scope;
2. inspect the complete repository status;
3. protect unrelated changes;
4. retrieve remote changes safely where required;
5. confirm the approved source asset and destination; and
6. verify all required metadata and related repository updates.

Then:

1. apply only the approved changes;
2. review the complete scoped diff;
3. stage only the approved files;
4. commit with an accurate integration message;
5. push the authorised changes; and
6. verify the pushed asset, commit and repository status.

Do not represent an asset as repository-authoritative until the approved integration has been successfully pushed and verified.

# 8. Conflicts and Unrelated Work

Never discard, overwrite, stage, commit or push unrelated work.

If unrelated changes do not affect the requested operation, leave them untouched and continue with the scoped work where safe.

If a conflict cannot be resolved without changing scope or making an unsupported decision, stop the affected action and request Founder direction.

# 9. Completion Report

Report, as applicable:

- every file created, changed, moved or removed;
- whether the operation was working-draft synchronisation or official CORE integration;
- the commit identifier;
- whether the push succeeded;
- the final repository status;
- any unresolved conflict or technical limitation; and
- whether further Founder approval is required.

Describe the asset according to its actual status. A synchronised Draft remains a Draft.

# End of Skill

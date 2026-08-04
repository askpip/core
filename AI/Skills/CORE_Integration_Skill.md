---
name: pip-integrate-core-assets
description: Manage scoped repository operations for PIP CORE assets, including creating or editing files in Working/Drafts, synchronising working drafts, and integrating Founder-approved assets into permanent locations. Use for repository paths, Git status, pulling, staging, committing, pushing, moving controlled assets, or verifying repository state. Apply the working-draft workflow separately from official CORE integration.
---

# CORE Integration

## Document Metadata

**Document Title:** CORE Integration Skill  
**Document Type:** PIP Artificial Intelligence Operating System (PIP AI OS) Skill  
**Version:** 0.1  
**Status:** Approved  
**Owner:** The Founders  
**Approved By:** shaphanmartin73  
**Permanent Location:** `AI/Skills/CORE_Integration_Skill.md`  
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

This Skill supports two operating environments:

1. **Local checkout:** Codex or another authorised AI operates in a local Git checkout and can inspect, stage, commit and push with ordinary Git.
2. **Authorised GitHub connector:** an AI operates directly on the repository through an authorised GitHub connector and can inspect current files, blobs, commits and branches and create repository commits.

Apply the common authority and safety requirements in this Skill in either environment, then use only the verification and synchronisation operations available in that environment.

# 4. Working-Draft Authority

A scoped instruction from either Founder to create or edit an asset within `Working/Drafts/` authorises the artificial intelligence (AI) to:

- save the scoped change in the requested working location;
- stage only the files changed for that instruction;
- commit the scoped change; and
- synchronise it to its existing working location.

This standing authority includes the scoped save, commit and push unless that Founder instructs the AI not to commit or push. In a local checkout, `origin/main` is the normal synchronisation destination unless a Founder specifies another branch or remote.

If the instruction is limited to review, recommendation, explanation or preparation of a prompt, do not edit or synchronise a repository file.

Working-draft synchronisation does not authorise the AI to:

- change an asset's status to Approved;
- assign or change an approved version;
- move an asset from `Working/Drafts/`;
- replace a repository-authoritative asset;
- modify unrelated files; or
- delete working material.

Synchronisation records a Draft for continuity, review and collaboration. It does not approve, publish, officially integrate or make the asset repository-authoritative.

# 5. Working-Draft Synchronisation Procedure

Before editing or synchronising a working draft in either operating environment:

1. complete the PIP AI OS startup procedure;
2. identify the requested files and actions;
3. inspect the complete repository state available in the operating environment;
4. identify unrelated local or remote changes within the available repository view;
5. obtain the latest remote branch state;
6. record or otherwise identify the current target-file state before writing;
7. verify that the target file has not changed incompatibly before synchronising; and
8. stop if the operation would overwrite, combine with or depend upon unresolved unrelated work or require unsupported reconciliation of concurrent changes.

Then:

1. make only the authorised changes;
2. review the scoped diff;
3. verify that the asset remains Draft and in `Working/Drafts/`;
4. synchronise using the applicable environment procedure below; and
5. verify the resulting repository state.

## 5.1 Local Checkout Procedure

In a local Git checkout:

1. fetch the latest state of the destination branch before writing;
2. verify the current branch, complete Git status and scoped diff;
3. confirm that unrelated modified or untracked files will remain untouched;
4. compare the target file and branch state with the fetched remote state;
5. make and review only the authorised change;
6. stage only the authorised files;
7. commit with a concise message describing the working-draft change;
8. obtain the latest remote state again before pushing and verify that the target file and destination branch have not changed incompatibly;
9. push to `origin/main`, unless a Founder specified another branch or remote; and
10. verify the pushed commit, destination branch and complete Git status.

If the destination advanced or the target changed incompatibly, stop and report the conflict. Do not merge, rebase, force-push or otherwise reconcile it unless the available instructions and capabilities expressly support that action.

## 5.2 Authorised GitHub Connector Procedure

Through an authorised GitHub connector:

1. read the current destination branch, head commit, target-file blob or absence, and relevant repository path before writing;
2. retain the observed commit and blob identifiers for concurrency verification;
3. prepare only the authorised file change;
4. re-read the destination branch head and target-file blob immediately before creating the commit;
5. proceed only if the relevant remote state remains compatible with the observed base;
6. create the scoped commit on the authorised destination branch using the connector; and
7. verify the resulting commit, branch and current file blob through the connector.

If the branch or target file changed incompatibly, stop and report the conflict. Do not overwrite the newer state or perform unsupported reconciliation.

## 5.3 Restricted Instructions

If the instruction is review-only, report findings without editing, committing or pushing.

If a Founder instructs the AI not to push, perform only the separately authorised preceding actions and report the resulting unsynchronised state. An instruction not to push also prevents any connector operation that would create a remote commit.

GitHub CLI, a separate branch and a pull request are not required for working-draft synchronisation unless the Founder or an approved repository rule requires them.

If authentication, conflict, branch protection or another technical restriction prevents synchronisation, report the exact affected operation and stop. Do not substitute another publication workflow.

# 6. Official CORE Integration Authority

Official CORE integration requires Founder approval identifying or establishing, where applicable:

- the asset approved;
- its approved wording or contents;
- its approved version;
- its permanent repository location; and
- the scope of related repository changes.

For internal operating and process documents, an instruction from either Founder is sufficient to approve the document, its version and permanent repository location, and its official CORE integration. This includes PIP AI OS Skills, operating procedures, Loading Guide amendments and repository-process Standards.

References to Founder approval or approval by the Founders do not require both Founders for an internal operating or process document unless a higher-authority document expressly requires joint approval for that asset or decision, or a Founder expressly states that joint approval is required.

This rule does not determine approval requirements for public content, plant knowledge, commercial decisions, legal decisions, constitutional amendments or other asset classes outside internal operating and process documents.

Where any required decision remains unresolved, stop the affected integration action and request Founder direction.

# 7. Official CORE Integration Procedure

Before integration:

1. verify the Founder approval and integration scope;
2. inspect the complete repository status;
3. protect unrelated changes;
4. obtain the latest remote state and record the source and destination file states;
5. confirm the approved source asset and destination; and
6. verify all required metadata and related repository updates.

Then:

1. apply only the approved changes;
2. review the complete scoped diff;
3. in a local checkout, stage only the approved files, commit with an accurate integration message, refresh the remote state, repeat the compatibility checks, push to the authorised destination and verify the commit and complete Git status;
4. through an authorised GitHub connector, re-read the current destination branch and relevant file blobs, repeat the compatibility checks, create the scoped commit and verify the resulting file blobs, commit and branch; and
5. verify the integrated asset and repository state using the capabilities of that environment.

Do not represent an asset as repository-authoritative until the approved integration has been successfully pushed and verified.

# 8. Conflicts and Unrelated Work

Never discard, overwrite, stage, commit or push unrelated work.

If unrelated changes do not affect the requested operation, leave them untouched and continue with the scoped work where safe.

If a conflict cannot be resolved without changing scope or making an unsupported decision, stop the affected action and request Founder direction.

# 9. Coordinated Installation of Repository Governance

The CORE Integration Skill, the PIP CORE Asset Lifecycle Standard amendment and the PIP AI Loading Guide amendment that activates their routing shall be approved and officially integrated together in one coordinated change.

The Loading Guide shall not route AI to either document until both have been installed at their approved permanent locations. If the coordinated installation cannot be completed and verified as one change, stop and preserve the previously approved routing state.

# 10. Completion Report

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

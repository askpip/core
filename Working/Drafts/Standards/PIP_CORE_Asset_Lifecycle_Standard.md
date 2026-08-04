# PIP CORE Asset Lifecycle Standard

## Document Metadata

**Document Title:** PIP CORE Asset Lifecycle Standard

**Volume:** Volume I – Repository Governance

**Document ID:** RDL-001

**Status:** Draft

**Version:** Unassigned — Founder decision required

**Last Updated:** 4 August 2026

**Approved By:** Not approved

**Proposed Permanent Location:** `Standards/PIP_CORE_Asset_Lifecycle_Standard.md`

## 1. Purpose

This Standard establishes the repository lifecycle governing controlled assets within the authoritative operational centre and repository of the Plant Intelligence Platform (PIP), PIP CORE.

Its purpose is to ensure that each controlled repository asset:

* has one authoritative location;
* proceeds through Founder-controlled approval;
* is integrated into the repository consistently;
* remains traceable through repository history; and
* does not create unnecessary duplication or repository clutter.

## 2. Scope

This Standard governs the repository lifecycle of controlled PIP CORE assets from initial development through approval, integration and later revision.

It applies to controlled repository assets including:

* Foundation documents;
* Standards;
* Operations Manuals;
* Charters;
* Architecture documents;
* Research Commissions;
* Founder Review Documentation;
* PIP Knowledge Records (PKRs);
* Mother Information Library (MIL) and Live Intelligence Library (LIL) assets;
* PIP Artificial Intelligence Operating System (PIP AI OS) documents;
* Skills;
* prompts;
* configuration files;
* source code;
* scripts;
* templates;
* diagrams;
* images;
* data files; and
* other assets designated by the Founders.

This Standard governs repository status, authority, location and integration.

It does not govern the internal creation, research, assessment or operational process specific to an asset type. Those processes shall be governed by the applicable approved Standard, Skill or Operations Manual.

The practical procedures for synchronising working drafts and integrating approved assets shall be governed by the applicable approved repository-integration procedure.

## 3. Governing Principles

### 3.1 One Authoritative Asset

There shall be only one repository-authoritative version of a controlled repository asset at any time.

A Draft may exist within the Working area while an existing approved version remains authoritative in its permanent repository location.

The Draft is not an additional authoritative copy.

A newly approved or revised asset becomes repository-authoritative only after its approved integration has been successfully committed and pushed.

### 3.2 Single Responsibility

Each Standard, Skill and Operations Manual shall govern a defined subject.

This Standard shall establish repository lifecycle requirements without duplicating the content-development procedures of specialist documents or the execution procedure of the repository-integration process.

### 3.3 Founder Authority

Only the Founders may:

* approve a controlled repository asset;
* approve its version;
* authorise its official CORE integration;
* approve an exception to this Standard; or
* authorise the removal of controlled working materials.

Artificial intelligence (AI) agents shall not infer or grant Founder approval.

A scoped instruction from either Founder is sufficient authority to create, edit and synchronise a working draft in `Working/Drafts/`, unless that Founder instructs the AI not to commit or push. This working-draft authority shall be executed under the approved repository-integration procedure.

Working-draft authority does not establish or alter the approval requirements for official CORE integration. Founder approval and official integration remain separate Founder-controlled actions governed by the current approved governance. No additional joint-approval rule shall be inferred.

### 3.4 Controlled Integration

Only assets and related changes expressly included within an approved official-integration scope may be integrated.

Unrelated modified or untracked files shall remain unaffected.

Where the approved version, permanent location or integration scope cannot be determined, the affected official-integration action shall stop pending Founder direction.

### 3.5 Concurrent Change Protection

Before writing or synchronising a controlled asset, the AI shall obtain the latest remote state and identify the current target-file state. Before completing synchronisation, it shall verify that the destination branch and target file have not changed incompatibly.

If concurrent changes would require unsupported reconciliation, the affected operation shall stop and the conflict shall be reported. The AI shall not overwrite the newer state, force the change or infer a reconciliation decision.

### 3.6 Repository Cleanliness

The Working area is a controlled workspace and not a permanent location for approved repository-authoritative assets.

Approved assets shall reside in their permanent repository locations.

Working materials shall not be deleted merely because they appear temporary, obsolete or superseded. Their removal must be authorised by the Founders or an applicable approved governing document.

## 4. Repository Lifecycle

A controlled repository asset shall pass through the following lifecycle stages where applicable:

1. Draft development and synchronisation;
2. Founder review;
3. Founder approval;
4. CORE integration;
5. repository-authoritative use; and
6. later revision or replacement.

### 4.1 Draft Development and Synchronisation

New standalone documents and similar assets shall normally be developed within:

`Working/Drafts/`

Assets requiring a functional repository location during development, including some source code, configuration files, scripts and data assets, may be developed in another location when governed by an approved specialist process or direct Founder instruction.

All assets under development shall remain Draft.

An instruction to create or edit an asset within `Working/Drafts/` authorises the scoped save, commit and push to its existing working location unless the Founder instructs otherwise. For local working-draft synchronisation, `origin/main` is the normal destination unless a Founder specifies another branch or remote.

Working-draft synchronisation records the current state of the Draft for review and collaboration. It does not constitute Founder approval, official CORE integration, publication or repository-authoritative use.

The approved repository-integration procedure shall support both a local Git checkout and direct operation through an authorised GitHub connector. It shall apply capability-sensitive verification: Git status, diff, staging, commit and push verification in a local checkout; and current file, blob, commit and branch verification through an authorised GitHub connector.

### 4.2 Founder Review

Draft assets shall remain within the Working area during Founder review unless an approved process requires another controlled review location.

The Founders shall determine whether an asset:

* requires further revision;
* is ready for approval;
* has the correct proposed version;
* has an appropriate permanent repository location; and
* is ready for CORE integration.

### 4.3 Founder Approval

Founder approval authorises an asset for official CORE integration.

Approval shall identify or establish, where applicable:

* the asset approved;
* its approved version;
* its permanent repository location; and
* the scope of related repository changes.

An approved local asset does not become repository-authoritative until its official integration has been successfully committed and pushed.

### 4.4 CORE Integration

An approved asset shall be integrated under the applicable approved repository-integration procedure.

Integration may include:

* updating approved metadata;
* moving or updating the asset in its permanent repository location;
* updating required repository records;
* reviewing the scoped changes;
* committing and pushing the authorised changes; and
* verifying the resulting repository state.

The integration procedure shall contain the detailed operational requirements for these actions.

An amendment that activates the CORE Integration Skill through the PIP AI Loading Guide shall integrate the approved CORE Integration Skill, this Standard amendment and the corresponding Loading Guide amendment together. The Loading Guide shall not route AI to either document until both have been installed at their approved permanent locations.

### 4.5 Repository Authority

Following successful integration and verification, the pushed asset in its permanent repository location becomes the repository-authoritative version.

If integration, commit or push fails:

* a new asset shall not be represented as repository-authoritative; and
* any previously approved and successfully pushed version shall remain repository-authoritative.

### 4.6 Revision of an Approved Asset

An existing approved asset shall remain repository-authoritative while a proposed revision is being developed, synchronised or reviewed.

The revision shall remain Draft until Founder approval.

Once the revision has been approved and successfully integrated, it shall replace the previous version as the repository-authoritative asset.

The previous version shall remain recoverable through repository history unless an approved specialist archival process requires additional preservation.

## 5. Status and Versioning

### 5.1 Repository Lifecycle Status

Controlled repository assets shall use the following repository lifecycle statuses:

**Draft**

The asset is being developed, revised or reviewed and is not the repository-authoritative approved version. Committing and pushing a Draft within the Working area does not change this status.

**Approved**

The asset has received Founder approval.

An asset marked Approved becomes repository-authoritative only after successful integration.

A specialist governing document may define additional workflow states where necessary. Those states shall not replace or obscure the asset’s repository lifecycle status.

### 5.2 Versioning

Where versioning applies, the approved version shall be determined by:

1. an applicable approved asset-specific Standard or Operations Manual;
2. an established approved versioning convention for the asset; or
3. direct Founder instruction.

Founder approval does not automatically require a version to become 1.0.

An asset may be approved below Version 1.0 when the Founders approve it for controlled early use, testing or continued development.

AI agents shall not invent, infer or automatically increment an approved version.

Where the required version cannot be determined, Founder direction shall be requested before integration proceeds.

## 6. Responsibilities

### 6.1 Founders

The Founders shall:

* determine when an asset is ready for approval;
* approve controlled repository assets;
* approve versions where applicable;
* authorise official CORE integration;
* determine unresolved permanent locations or integration scope;
* authorise controlled cleanup; and
* approve exceptions to this Standard.

### 6.2 AI Agents

AI agents shall:

* follow this Standard and applicable approved governing documents;
* distinguish synchronised Draft assets from repository-authoritative assets;
* preserve the integrity and traceability of controlled assets;
* apply only the authority granted for working-draft synchronisation or official integration;
* avoid modifying unrelated repository content;
* follow the approved repository-integration procedure;
* stop affected official-integration actions when approval, version, location or scope remains unresolved;
* verify successful integration before reporting an asset as repository-authoritative; and
* remove working materials only when authorised.

Repository verification shall match the operating environment. In a local checkout, AI agents shall use available Git status, diff, staging, commit and push evidence. Through an authorised GitHub connector, they shall use current file, blob, commit and branch evidence.

## 7. Exceptions

Only the Founders may approve an exception to this Standard.

An approved exception shall identify:

* the affected asset or action;
* the requirement being varied;
* the reason for the exception; and
* any conditions or limitations attached to it.

An exception shall not be inferred from past practice or an unrelated Founder decision.

## 8. Compliance

All controlled repository assets shall follow this Standard unless the Founders approve an exception.

Failure to follow this Standard may result in:

* duplicate authoritative assets;
* incorrect asset status or version information;
* inconsistent repository history;
* unauthorised repository changes;
* loss of traceability;
* premature replacement of an approved asset;
* unintended removal of working materials; or
* unnecessary repository clutter.

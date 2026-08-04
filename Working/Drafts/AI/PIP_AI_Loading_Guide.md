# PIP AI Loading Guide

**Document Title:** PIP AI Loading Guide  
**Repository:** PIP CORE  
**Parent Platform:** Plant Intelligence Platform (PIP)  
**Folder:** AI  
**Version:** Unassigned — Founder decision required  
**Status:** Draft  
**Owner:** The Founders  
**Approved By:** Not approved  
**Proposed Permanent Location:** `AI/PIP_AI_Loading_Guide.md`  
**Last Updated:** 4 August 2026  
**Purpose:** To identify the additional PIP Artificial Intelligence Operating System (PIP AI OS) documents that must be loaded to correctly perform a requested task.  
**Authority:** PIP AI OS  
**Related Documents:** `AGENTS.md`, `AI/PIP_AI_Operations_Manual.md`, `AI/PIP_AI_Constitution.md`

---

# 1. Purpose

The purpose of this guide is to determine which additional PIP AI OS documents shall be loaded after the PIP AI Operations Manual and the PIP AI Constitution.

The artificial intelligence (AI) shall not inspect every document contained within the PIP AI OS before every task.

Instead, it shall consult this guide to determine which additional documents are applicable to the current request.

This guide exists to minimise unnecessary loading while ensuring that the correct governed procedures are followed.

---

# 2. Position Within the PIP AI OS

The PIP AI Loading Guide forms the document selection stage of the PIP AI OS startup procedure.

The normal startup sequence is:

1. `AGENTS.md`
2. PIP AI Operations Manual
3. PIP AI Constitution
4. PIP AI Loading Guide
5. `AI/Context/PIP_System_Terminology_Context.md`
6. Applicable Skills
7. Additional applicable Context documents
8. Perform the requested task

This guide determines only which additional documents shall be loaded.

It does not define how those documents operate.

---

# 3. Loading Procedure

After loading the PIP AI Operations Manual and the PIP AI Constitution, the AI shall:

1. Load `AI/Context/PIP_System_Terminology_Context.md` for every PIP task, including ordinary conversation and advice.
2. Determine every action requested by the Founder.
3. Consult this Loading Guide.
4. Identify every applicable entry.
5. Load every referenced PIP AI OS document.
6. Apply all loaded documents together.
7. Where loaded documents conflict, apply the PIP AI OS authority hierarchy.
8. Where the conflict cannot be resolved through the authority hierarchy, stop the affected action and request Founder direction.

---

# 4. PIP AI Loading Index

The following table identifies which additional PIP AI OS documents shall be loaded for particular task types.

| Request Type | PIP AI OS Documents to Load | Notes |
|---------------|-------------------------|-------|
| Every PIP task, including ordinary conversation and advice, planning and analysis, document work, repository work, Knowledge Curation System work, Research Origin Curator work, Knowledge Integration Technician work, and software or application work. | `AI/Context/PIP_System_Terminology_Context.md` | Compact operational terminology reference. The PIP System Identity and Naming Standard (SINS-001) remains authoritative. |
| Authoritative naming interpretation; naming conflict or uncertainty; document creation or editing; renaming; or terminology-governance work. | `Standards/PIP_System_Identity_and_Naming_Standard.md` | Authoritative naming Standard. |
| Creating, drafting, reviewing, revising, restructuring, formatting, reconciling or converting a PIP document. | `AI/Skills/Document_Creation_and_Editing_Skill.md`; `Standards/PIP_System_Identity_and_Naming_Standard.md` | The Skill governs document content and preparation. SINS-001 governs naming and terminology. |
| Creating or changing repository files; selecting or confirming repository paths; moving or synchronising controlled assets; inspecting repository status or changes; retrieving remote state; committing or pushing; or verifying repository state. | `AI/Skills/CORE_Integration_Skill.md`; `Standards/PIP_CORE_Asset_Lifecycle_Standard.md` | The Skill distinguishes working-draft synchronisation from official CORE integration and supports local Git checkouts and authorised GitHub connectors. The Standard governs asset status, authority and lifecycle. This entry becomes active only through the coordinated installation in Section 8. |

---

# 5. Multiple Document Loading

A single request may require multiple Skills and Context documents.

Where multiple entries apply, every applicable document shall be loaded before performing the task.

Document content changes performed within the repository require both the document-creation and repository-operation entries.

---

# 6. No Matching Entry

If no task-specific entry beyond the universal PIP System Terminology Context requirement applies to the requested task, the AI shall continue under:

- the PIP AI Constitution;
- the PIP AI Operations Manual; and
- the Founder's current instructions.

The AI shall not invent an unapproved Skill or Context document.

If the same type of request occurs repeatedly without a suitable document, the AI may propose that an additional PIP AI OS document be created through the approved learning process.

---

# 7. Missing Documents

If this guide identifies a PIP AI OS document that cannot be accessed, the AI shall:

1. identify the unavailable document;
2. identify which part of the task depends upon that document;
3. state that the document has not been loaded; and
4. request Founder direction where that document is required.

The AI shall not claim that an unavailable document has been loaded.

---

# 8. Maintenance

Every approved Skill and Context document shall be recorded within this guide.

A document shall not become part of the active PIP AI OS until:

- it has been approved by the Founders;
- it has been stored within the repository; and
- it has been referenced within this Loading Guide.

Changes to this guide require Founder approval.

The CORE Integration Skill, the PIP CORE Asset Lifecycle Standard amendment and the Loading Guide amendment that first activates the repository-operation entry shall be approved and officially integrated together in one coordinated change.

That coordinated integration shall install the approved Skill and Standard at the exact permanent paths referenced in the Loading Index and install this Loading Guide amendment in the same commit. If all three files cannot be installed and verified together, the repository-operation entry shall not be activated and the previously approved Loading Guide shall remain authoritative.

---

# End of Document

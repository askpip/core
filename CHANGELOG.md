# AskPIP Core Changelog

This changelog records significant changes to AskPIP Core in a concise, human-readable form.

Git provides the complete technical history of the repository. This changelog records the major documents, decisions, releases and structural changes that are important to the Founders and future contributors.

---

## Unreleased

### Added

- Started a `Graphics/Design Explorations/` area for UI/UX direction work, and added the first exploration: a visual-craft pass on the Ask Pip app's sign-in, home and live-observation screens (9 September 2026), grounded in the app's real design tokens and artwork rather than a new invented look. Not an approved design direction — exploration for Founder review, tracked in `Working/AI Outputs/`.
- Migrated the Garden Shed (KCS Pip Shed) into Core as `Shed/`, replacing the standalone `askpip/KCS-PIP-Garden-Shed` repository and the local `shed-deploy` checkout — live at `shed.askpip.garden` (8 September 2026). Added automatic document sync from `Foundations/`, `Knowledge Curation System/` and `Standards/` into the Shed's File Cabinet on every push to `main`; a draggable, reorderable to-do list with four-state status and full change history; and a settings menu (change own passphrase, log out).
- Approved and adopted the Pip Runtime Architecture (Version 1.1) into `Knowledge Curation System/Standards/` (24 August 2026), settling how Pip reasons at runtime: a deterministic Decision Layer that walks published PKRs, and an Interface Layer (perception + conversation) that never originates horticultural fact. Version 1.1 added the confidence- and source-disclosure requirement (§5.3) — a gardener-visible confidence rating or source must trace verbatim to a Published Definition or Source PKR, never be generated fresh.
- Shipped the first live AI-backed observation to production in `App/` (24 August 2026): the dead-wood observation now calls a Supabase Edge Function (`pip-observe-dead-wood`), bounded to the Published `PKR-OBS-000001`'s real per-signal diagnostic content, with a hard fallback to the static script on any failure. The recently-planted and dormancy Suitability Gates (`PKR-SGT-000002`, `PKR-SGT-000001`) are wired into the guided pruning journey ahead of it.
- Published the Knowledge Curation System's first knowledge into the Mother Information Library and Live Intelligence Library (23–24 August 2026): the dead-wood Observation and Decision Logic PKRs, the dormancy and recently-planted Suitability Gate PKRs, five confidence-level Definition PKRs, and 32 Source PKRs supporting them — see `Working/Project_Backlog.md` for the full record.
- Approved and integrated the Live Intelligence Library (LIL) Standard (Version 0.01) and the PIP Knowledge Record (PKR) Standard (Version 0.01) into `Knowledge Curation System/Standards/`, completing the LIL/PKR side of the KCS to match the MIL/ROC side. The PKR Standard scopes six PKR types to the six MVP observations and establishes the Founder Review Rendering requirement and declarative-content boundary (§9), so Founder operational review remains meaningful without requiring the Founders to read a PKR's underlying stored format. The LIL Standard adds a matching boundary clarifying that gardener-supplied session data (photographs, confirmations, corrections, outcomes) is never KCS knowledge and never enters the MIL or LIL.
- Approved and integrated a revision to the PIP Knowledge Integration Technician (KIT) Charter (Version 0.01 → 0.02) and the PIP Knowledge Integration Workflow (Version 0.01 → 0.02), applying the Founder Review Rendering requirement introduced by the PKR Standard.
- Approved and integrated the PIP Knowledge Integration Technician (KIT) Charter (Version 0.01) into `Knowledge Curation System/Charters/`, defining KIT as the build role that converts Founder-approved MIL information into the codebased Live Intelligence Library.
- Approved and integrated the Knowledge Curation System (KCS) governance package into the new `Knowledge Curation System/` top-level folder: PIP Research Origin Curator (ROC) Charter (Version 0.02), Mother Information Library (MIL) Standard (Version 0.01), PIP Evidence Assessment Standard (Version 1.0), PIP Knowledge Integration Workflow (Version 0.01) and PIP Research Origin Curator (ROC) Operations Manual (Version 2.0). Approved below Version 1.0 where applicable for controlled early use and testing, per the PIP CORE Asset Lifecycle Standard. Working drafts remain in `Working/Drafts/Knowledge Curation System/` for history.
- Approved PIP AI Operations Manual Version 0.4 and removed the stale word “proposed” from its PIP AI OS document listing.
- Approved and integrated the PIP CORE Asset Lifecycle Standard (Document ID RDL-001, Version 0.2).
- Approved and completed the coordinated integration of the PIP Artificial Intelligence Operating System (PIP AI OS) bootstrap package: PIP AI OS Bootstrap Version 1.1, PIP AI Operations Manual Version 0.3, PIP AI Constitution Version 0.2, PIP AI Loading Guide Version 0.3, PIP System Terminology Context (Document ID PSTC-001) Version 0.1 and Document Creation and Editing Skill Version 0.2; activated the universal Terminology Context and replaced the obsolete AskPIP AI OS filenames and paths.
- Approved and integrated the PIP System Identity and Naming Standard (Document ID SINS-001, Version 0.1).
- Added the first approved Foundation document, "Marie's Story" (Version 1.0).
- Added the `Working` folder structure with dedicated directories for drafts, Founder review and AI outputs.

---

## 1.0.0 — 31 July 2026

### Added

- Established AskPIP Core as the authoritative repository for the AskPIP platform.
- Created the local Git repository at `C:\AskPIP\core`.
- Connected the repository to the private GitHub repository `askpip/core`.
- Established `main` as the primary development branch.
- Introduced the AskPIP Core README Version 1.0.
- Established the repository's founding principles, governance and working philosophy.

### Repository Record

- README commit: `44a3cfb7ff90f6727f698c8088982ed0c69cae14`
- Remote: `origin`
- GitHub repository: `askpip/core`

### Notes

This release marks the official establishment of AskPIP Core as the permanent home of the AskPIP project.

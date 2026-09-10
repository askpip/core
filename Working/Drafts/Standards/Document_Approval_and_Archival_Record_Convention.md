# Document Approval and Archival Record Convention

## Document Metadata

**Document Title:** Document Approval and Archival Record Convention

**Volume:** Volume I – Repository Governance

**Document ID:** *(to be assigned on approval — proposed: RDL-002, as a companion to RDL-001)*

**Status:** Draft — not yet Founder-reviewed or approved

**Version:** 0.1

**Drafted:** 10 September 2026, by AI (Claude), at direct Founder instruction, following a Founder-reported inconsistency (see §5)

**Approved By:** *(pending)*

**Proposed Permanent Location:** `Standards/Document_Approval_and_Archival_Record_Convention.md`

**Governing Parent Standard:** `Standards/PIP_CORE_Asset_Lifecycle_Standard.md` (RDL-001). This document does not vary or duplicate RDL-001's rules on approval authority, versioning or repository lifecycle — it exists because RDL-001 §3.2 (Single Responsibility) deliberately leaves the literal formatting of an approval record to a specialist document, and no such document has existed until now.

## 1. Purpose

This convention records, in one place, the exact banner text, Metadata/Status field pattern, and attribution phrase to use when a controlled document is approved through the Garden Shed Office's notice/approval workflow and written back into PIP CORE.

It exists because this pattern has been in organic use since at least `FRD-BUSHROSE-SCOPE-01.md`, copied by example from document to document, but was never written down. On 10 September 2026, that gap caused a real inconsistency: the first pass at writing back three Founder-approved Foundation documents (`Founding_Principles.md`, `AskPIP_Vision_Statement.md`, `Pip_Character_Profile.md`) attributed approval to the individual Founder who had clicked Approve in the shed. The Founders then corrected this, first to "the Founders" collectively, and then — after noting that RDL-001 already establishes an institutional identity for this exact purpose — to `AskPIP Founder Authority`. This document is meant to stop that rediscovery from being needed again.

## 2. Scope

This convention applies to any controlled Core document or asset that:

* is tracked through the Garden Shed Office's notice/approval workflow (`shed_items` with `requires_approval = true`); and
* receives Founder approval there; and
* is subsequently written back into its permanent location in Core.

It does not apply to documents approved and integrated by another approved process (for example, a Founder Review Dossier approved directly under the Founder Review Dossier Standard), unless that process is itself routed through the shed.

## 3. The Archival & Approval Record Banner

Immediately under the document's H1 title (and under any existing subtitle line, if the document has one), insert a blockquote:

```
> **Archival & Approval Record** — [This document / This Foundation Document]
> was **approved by AskPIP Founder Authority on [date]**, via the Garden
> Shed Office's notice/approval workflow. [Optional: a brief note on what
> was approved and any caveat the document's own original Status already
> carried, e.g. "this approval is sign-off on the character material as an
> accurate discussion draft — it does not, on its own, establish a
> controlled brand standard."] Preserved below exactly as
> [migrated/drafted]; no other content was edited as part of this approval.
```

Do not edit any other content in the document as part of this approval — the banner and the Status line (§4) are the only changes.

## 4. The Status Field

In the document's own Metadata block, strike through the prior `**Status:**` value with `~~...~~` and append:

```
**Status:** ~~<prior status text>~~ **Approved by AskPIP Founder Authority, [date] — see Archival & Approval Record above.**
```

Where the prior status carried an important caveat (for example, that approval does not itself authorise publication or establish a brand standard), preserve that caveat in the appended text rather than letting a bare "Approved" overstate what was decided.

## 5. Attribution: "AskPIP Founder Authority"

Document-facing approval text uses the institutional identity **`AskPIP Founder Authority`**, never an individual Founder's name, and never "the Founders" as free text.

This phrase is not invented here — it already exists in RDL-001 §3.3, which requires it for "internal operating and process documents" (Skills, operating procedures, Loading Guide amendments, repository-process Standards). RDL-001's own metadata uses it. This convention extends the same phrase to Foundation documents and other assets in scope under §2, per direct Founder instruction on 10 September 2026, rather than inventing a separate identity for this category.

**Open item for Founder attention:** RDL-001 §3.3's text, read literally, scopes `AskPIP Founder Authority` only to the "internal operating and process document" category — not explicitly to Foundation documents. This draft is what extends it further. Separately, while checking this, it was found that `Standards/PIP_System_Identity_and_Naming_Standard.md` (SINS-001) — a Standard that RDL-001's own rule would seem to cover, and which was last updated *after* RDL-001 introduced this rule — still carries `**Approved By:** The Founders` in its own metadata, not `AskPIP Founder Authority`. That is flagged here for the Founders' awareness and decision; it is **not** changed by this document, since only the Founders may approve a revision to an already-approved Standard (RDL-001 §3.3).

The shed's own `shed_items.approved_by` field is unaffected by this convention. It continues to record the actual individual who clicked Approve in the shed, as an accurate internal operational record. Only the document-facing text uses the institutional identity.

## 6. Marking the shed notice done

Once the edited file has been written back to Core (ideally committed and pushed — see the CORE Integration Skill / repository-integration procedure for that step), the corresponding shed notice's `folder` is set to `'Completed Tasks/Written to Core'` (a plain subfolder of `'Completed Tasks'`), with a short dated note on what was changed. This is a Garden Shed Office workflow-state convention, not a repository-governance rule, and is documented in full in `Shed/README.md`.

## 7. Relationship to RDL-001

This document does not alter RDL-001. It supplies the specialist formatting content RDL-001 §3.2 says it deliberately does not cover, and it borrows RDL-001's already-approved `AskPIP Founder Authority` identity rather than creating a new one. If the Founders approve this document, they may wish to also formally broaden RDL-001 §3.3's own wording so the rule it already half-establishes is stated completely in one place — that decision belongs to the Founders and is not made here.

## 8. Status of this draft

This document is a Draft, not yet reviewed or approved. It was prepared under RDL-001 §4.1 (new standalone documents are normally developed within `Working/Drafts/`) and RDL-001 §3.3 (AI agents shall not infer or grant Founder approval). It should be reviewed alongside the three Foundation documents it describes, and the open item in §5, before any Founder decides whether to approve it — and if approved, at what version and under what Document ID.

# PIP Knowledge Integration Technician (KIT) Operations Manual

---

## Document Metadata

**Document Title:** PIP Knowledge Integration Technician (KIT) Operations Manual
**Volume:** Volume VI – Knowledge Curation System
**Folder:** 03 – Operations Manuals
**Version:** 0.1
**Status:** **Draft — awaiting Founder review and approval**
**Owner:** The Founders
**Last Updated:** 22 August 2026
**Approved By:** Not yet approved
**Permanent Location (on approval):** `Knowledge Curation System/Operations Manuals/KIT_Operations_Manual.md`
**Purpose:** To define, at a procedural level, how the PIP Knowledge Integration Technician (KIT) carries out the responsibilities and authority the KIT Charter grants it — retrieving Founder-approved information from the Mother Information Library (MIL), building draft PIP Knowledge Records (PKRs), preparing them for Founder operational review, and publishing and maintaining approved PKRs within the Live Intelligence Library (LIL) — so that any AI instance, bootstrapped from this document chain alone, can perform KIT's work consistently.
**Question This Document Answers:** How shall the PIP Knowledge Integration Technician carry out its Charter-granted responsibilities, step by step, from receiving approved information to publishing operational intelligence?

**Related Documents:** PIP Knowledge Integration Technician (KIT) Charter; PIP Knowledge Record (PKR) Standard; Live Intelligence Library (LIL) Standard; Mother Information Library (MIL) Standard; Evidence Assessment Standard (EAS); Pip Runtime Architecture; PIP Knowledge Integration Workflow; PIP Research Origin Curator (ROC) Operations Manual (structural model for this document); PIP System Identity and Naming Standard (SINS-001).

**Drafting Note:** This is the first version of this Manual. No KIT Operations Manual existed before this draft — the KIT Charter and PKR Standard both anticipated one without it being written. Rather than draft this speculatively, a real dry run was performed first: an AI instance, using only the Charter, the PKR Standard, the LIL Standard, the MIL Standard, the Pip Runtime Architecture and the Knowledge Integration Workflow, attempted to build one real draft Observation PKR from ARC-BUSHROSE-DEADWOOD-01 (`Working/AI Outputs/KIT_Dry_Run_BUSHROSE_DEADWOOD_01.md`). It produced a usable partial draft and stalled at six specific, concrete points. This Manual is written directly against those six stalls, using the same case as its worked example throughout, in the same spirit as how a real research commission on dead-versus-living wood shaped the Founder Review Dossier Standard and the Assessed Finding model earlier in this session. Sections below reference "the dry run" and "Gap 1" through "Gap 6" by number, matching that document.

**Same-day correction:** Chapter 8, as first drafted, itself embodied a version of the exact flaw this whole session has been correcting at other layers — it directed KIT to record one blended PKR-level confidence (the lowest of a PKR's contributing findings) rather than confidence per claim. The Founder caught this directly on reviewing the first submission package this Manual produced. Chapter 8 has been rewritten accordingly, and PKR Standard §4.2 corrected to match (v0.05 → v0.06, Draft). Left here as a visible record that this Manual's own first draft was not exempt from the mistake it was written to prevent elsewhere.

---

# Part I — Foundations

# Chapter 1 — Purpose of this Manual

## 1.1 Purpose

This Manual establishes the procedures by which the PIP Knowledge Integration Technician (KIT) performs its role, as that role is defined by the KIT Charter.

Where the KIT Charter establishes *what KIT is authorised and required to do*, this Manual establishes *how KIT does it* — the concrete, repeatable procedure a competent AI instance, bootstrapped from this document chain alone, follows to move Founder-approved information from the Mother Information Library into a published PIP Knowledge Record.

## 1.2 Relationship to the PKR Standard

This Manual does not restate the PKR Standard's field-level requirements — what a PKR of a given type must contain is governed there, not here. This Manual governs the process of building, reviewing, submitting, correcting and publishing a PKR that already complies with the PKR Standard's structure.

Where this Manual and the PKR Standard could be read to conflict, the PKR Standard governs structure and this Manual governs process; a genuine conflict shall be referred to the Founders rather than resolved by KIT's own inference, consistent with the KIT Charter's Limitations of Authority.

## 1.3 Intended Outcome

Application of this Manual shall produce a KIT practice that is:

- consistent — the same kind of ARC content produces the same kind of PKR, regardless of which AI instance is performing the work;
- traceable — every draft PKR's path from MIL information to Founder submission is fully documented;
- honest about incompleteness — KIT distinguishes what it can build from what it cannot yet build, rather than forcing false completeness; and
- escalation-safe — KIT has a defined, non-improvised path for every point at which approved information runs out before a PKR's required content does.

---

# Chapter 2 — Principles Governing KIT's Work

These principles govern every procedure in this Manual, consistent with the KIT Charter's Guiding Principles.

## 2.1 Approved Meaning Before Convenience

KIT transforms Founder-approved meaning into operational form. It never adjusts that meaning — rounding up a confidence level, smoothing over a preserved limitation, or quietly filling a missing field — for the sake of producing a tidier or more complete-looking record.

## 2.2 Traceability Before Speed

Every field in a draft PKR that represents a factual claim shall be traceable to a specific MIL asset — an Assessed Finding within an ARC, or a Founder observation — not to an ARC or the MIL in general terms.

## 2.3 Flag, Never Fill

Where approved information does not fully support a required PKR field, KIT records this as a gap and follows the escalation procedure at Chapter 9. KIT never fills the gap through inference, general knowledge, or plausible-sounding invention, per the KIT Charter's Limitations of Authority. This is the single most important discipline in this Manual — the dry run's Gap 1 was a direct instance of this rule holding under real conditions.

## 2.4 Confidence Follows Evidence, Never the Reverse

KIT does not choose which Assessed Findings to draw into a PKR based on what confidence level the result would produce. The content a PKR needs to be useful and complete determines what it draws on; the resulting confidence, computed per Chapter 8, is a consequence, not a design target.

## 2.5 Incompleteness Is a Status, Not a Failure

A draft PKR that is correct as far as it goes, but genuinely cannot be completed because a dependency (a comparison image, a Decision Logic PKR, a piece of missing approved content) does not yet exist, is not a defective draft. It is recorded honestly per Chapter 11's partial-completeness status, not forced to false completion or abandoned.

---

# Chapter 3 — Scope and Position Within the Knowledge Curation System

## 3.1 When KIT's Work Begins

KIT's work on a given piece of information begins only once ROC has archived it into the MIL as an ARC (or a Founder observation), per the KIT Charter and the PIP Knowledge Integration Workflow. KIT does not act on draft research, a submitted-but-undecided Founder Review Dossier, or any information ROC has not yet archived.

## 3.2 When KIT's Work Ends

KIT's responsibility for a given PKR ends at publication to the LIL, and resumes only when: the Founders direct a correction or revision; new or revised MIL information affects a published PKR (Chapter 19); or the Founders request an operational-impact assessment.

## 3.3 What Triggers KIT to Begin Work on a New ARC

Per the PIP Knowledge Integration Workflow, ROC notifies KIT when approved information becomes available for integration. On receiving that notification, KIT proceeds to Chapter 4.

Where no formal notification mechanism exists yet (as is currently the case — this is itself a gap, see §9.5), KIT proceeds directly from a Founder instruction identifying the ARC to work from, and records that instruction as the trigger in place of a formal ROC notification.

---

# Part II — Building Draft PKRs

# Chapter 4 — Retrieving and Reviewing Approved Information

## 4.1 Retrieval

On receiving notification (§3.3), KIT shall retrieve the complete content of the relevant ARC(s) and any associated Founder observations from the MIL. KIT does not retrieve from, or treat as authoritative, any unapproved research, draft Founder Review Dossier, or source material outside the MIL, per the KIT Charter's Limitations of Authority.

## 4.2 Review

Before drafting begins, KIT shall review the retrieved ARC(s) to identify:

- every Assessed Finding the ARC contains, and its individual Evidence Confidence Level;
- every Founder observation associated with the ARC;
- any preserved limitations, uncertainty, or conditions attached to the Founder approval decision (per the ARC's Founder Decision Record); and
- any open questions the ARC explicitly leaves for later resolution (for example, ARC-BUSHROSE-DEADWOOD-01 §7's open question about whether Low-confidence findings should inform a PKR — see Chapter 8).

This review is a precondition for Chapter 5's triage step; KIT shall not begin drafting PKR content before it is complete.

---

# Chapter 5 — Triage: Routing an ARC's Content to PKR Types

## 5.1 Purpose

This chapter exists because of the dry run's **Gap 4**: ARC-BUSHROSE-DEADWOOD-01 presented six Assessed Findings as a flat list, but one of them (AF-6, a personal-safety finding) did not belong to the PKR the other five supported — it belonged to a different PKR type entirely (a Suitability Gate PKR, personal-protection area). This was not obvious until an actual drafting attempt tried to place it. This chapter makes that placement step explicit and mandatory, rather than something discovered mid-draft.

## 5.2 Triage Procedure

Before drafting any PKR, KIT shall, for every Assessed Finding and Founder observation in the ARC(s) under review, determine which PKR type (per PKR Standard §3) that content actually supports:

- diagnostic content describing how to recognise a condition on the plant → **Observation PKR**;
- content describing which choices are horticulturally acceptable once a condition is confirmed → **Decision Logic PKR**;
- content describing a safety or suitability condition unrelated to plant diagnosis (tool condition, personal protection, access, timing, planting history) → **Suitability Gate PKR**;
- a reference image and its required metadata → **Comparison Image PKR**;
- a definition or term a gardener may need explained → **Definition PKR**;
- a citation-level reference to the underlying evidence → **Source PKR**.

## 5.3 Recording the Triage

KIT shall record this routing explicitly, as a short table, before drafting begins — which finding supports which PKR type — and carry that table forward into the draft submission so the Founders can see how the ARC's content was distributed, not only the resulting individual PKRs.

## 5.4 Content With No Current Destination

Where an Assessed Finding or Founder observation does not map to any PKR type currently defined in the PKR Standard §3, KIT shall not build an undefined PKR type to hold it. It shall report this to the Founders as a Standard-extension gap, per PKR Standard §10, and hold the content pending that decision.

## 5.5 Worked Example

Applying this to ARC-BUSHROSE-DEADWOOD-01: AF-1 through AF-5, and the §6 Founder observation, route to the Observation PKR (dead versus living wood). AF-6 routes to a future Suitability Gate PKR (personal protection area) — not built in the dry run, since it was out of the instructed scope, but now correctly identified rather than left stranded.

---

# Chapter 6 — Assessing Which PKRs Are Required or Affected

## 6.1 New PKRs Required

Following triage (Chapter 5), KIT shall determine which PKRs do not yet exist and are required to represent the ARC's routed content.

## 6.2 Existing PKRs Affected

KIT shall separately check whether any newly approved information affects an already-published PKR — either by strengthening, weakening, or contradicting content it relies on. Where it does, KIT shall report this assessment to the Founders per the KIT Charter's Authority, rather than silently revise the published PKR. Chapter 19 governs the resulting revision procedure once directed.

## 6.3 Dependency Mapping

For each required PKR, KIT shall identify what it depends on to be publishable (not merely draftable) — for example, an Observation PKR depends on at least one Linked Comparison Image PKR and a Linked Decision Logic PKR (PKR Standard §5.1). KIT shall record which dependencies already exist and which do not, per Chapter 11's partial-completeness handling.

---

# Chapter 7 — Building Draft PKR Content

## 7.1 General Procedure

For each PKR identified in Chapter 6, KIT shall populate every Common Field (PKR Standard §4) and every Type-Specific Field (PKR Standard §5) for that PKR's type, drawing only on the specific Assessed Finding(s) or Founder observation(s) routed to it in Chapter 5.

## 7.2 Field-by-Field Sourcing

For every field that represents a factual claim, KIT shall be able to state which specific Assessed Finding or Founder observation it came from. A field that cannot be traced this way is a gap (Chapter 9), not a field KIT completes from general reasoning.

## 7.3 Visual Criteria (Observation PKR)

Where building an Observation PKR's Visual Criteria field, KIT shall first determine, for each candidate diagnostic signal in the supporting Assessed Findings, whether that signal is actually observable in a photograph (an external, visible characteristic) or requires physical interaction with the plant (a cut, a bend, a texture check). Only photographable signals belong in Visual Criteria itself; non-photographable signals inform the "What the Photo Cannot Establish" field instead (§7.4) and the Confirmation Requirement (PKR Standard §5.1).

Visual Criteria shall be written as structured, itemised statements specific enough to ground the Perception Layer's proposal (Pip Runtime Architecture §8.2) — not as a single paragraph of descriptive prose. The dry run's Visual Criteria table (a signal / candidate reading / supporting finding / photographable? structure) is an acceptable pattern; KIT may adapt its exact form but shall preserve this level of structure.

## 7.4 What the Photo Cannot Establish (Observation PKR)

This field requires content that explicitly addresses the boundary between what a photograph can and cannot establish for this specific observation. Per Chapter 2.3, KIT shall not construct this content itself from inference about what "seems obvious." Where the ARC contains a Founder observation or Assessed Finding that directly addresses this boundary, KIT uses it; where none exists, this is a gap, handled per Chapter 9 exactly as Gap 1 was.

## 7.5 Decision Logic PKR Content

Building a Decision Logic PKR requires an Assessed Finding or Founder observation that specifically supports the decision rule (which choices are acceptable for a given confirmed observation) — not merely a diagnostic finding about how to recognise the condition. Per the dry run's **Gap 3**, KIT shall check specifically for this before assuming a Decision Logic PKR can be built: the fact that removal of dead wood is implied throughout a diagnostic source log is not, by itself, an evidenced decision-rule finding. Where the ARC does not contain one, this is a gap (Chapter 9), and KIT shall recommend to ROC and the Founders that future research commissions supporting an observation also capture its corresponding decision rule as its own Assessed Finding, rather than treating diagnosis and decision as one undifferentiated topic.

## 7.6 Other PKR Types

Comparison Image, Suitability Gate, Source and Definition PKRs are built directly from their PKR Standard §5 field lists and the ARC content routed to them in Chapter 5. No additional procedure beyond §7.1–§7.2 is currently required for these types; this Manual shall be extended if practice reveals otherwise.

---

# Chapter 8 — Determining Evidence Confidence for a Draft PKR

## 8.1 Purpose

This chapter exists because of the dry run's **Gap 5, and its correction**. PKR Standard v0.05 originally required KIT to record the *lowest* of a PKR's contributing Assessed Findings' confidence levels as one PKR-level figure. On review of a real draft built this way, the Founder identified that this still blends claims of differing evidential strength into one number — the same failure mode EAS v1.3 eliminated at the ARC and dossier level, reintroduced one layer downstream. PKR Standard v0.06 corrects this: confidence is recorded per distinct claim, never blended for a multi-claim PKR as a whole (PKR Standard §4.2). This chapter reflects that correction; KIT operating from an earlier cached understanding of this Manual should treat any reference to "lowest applicable level" as superseded.

## 8.2 Procedure

For every draft PKR, KIT shall:

1. identify every distinct claim the PKR's content comprises, per EAS §3.2's test (claims that could reasonably be supported to a different degree are separate claims, whether or not they trace to the same Assessed Finding or the same ARC);
2. for each distinct claim, record its own Evidence Confidence Level directly, inherited from the specific Assessed Finding or Founder observation it traces to, and record it alongside that claim within the PKR's type-specific fields (for example, per row of an Observation PKR's Visual Criteria table, or per Condition of a Decision Logic PKR);
3. record the PKR's Common Field "Evidence Confidence" as the single claim's level directly only where the PKR's content genuinely reduces to one claim; otherwise record it as **"See per-claim confidence"**, per PKR Standard §4.2 — never as an average, a round-up, or a lowest-applicable figure; and
4. where the PKR's claims differ substantially in strength, present this to the Founders plainly in the Founder Review Rendering (Chapter 12) — for example, noting that the primary diagnostic signal is strongly evidenced while a secondary or fallback signal is not — so the Founders see the real shape of the evidence, not a single number standing in for all of it.

## 8.3 No Confidence-Driven Scope Decisions

KIT shall not omit a claim from a PKR's content in order to produce a higher-looking confidence result, and — since v0.06 — has no reason to, because no blended figure exists for omission to protect. Where the Founders wish to narrow a PKR's scope (for example, deferring a weakly-evidenced claim to a future revision pending further research), that remains a Founder decision, presented as an option in the rendering (§8.2 item 4), not a KIT drafting choice.

## 8.4 Decision Logic Content Requires Its Own Evidence

Per PKR Standard §5.3 (Draft v0.06): a Decision Logic PKR's Conditions and Available Choices are not inferred from the Observation PKR's diagnostic content, however obvious the connection seems. Before building a Decision Logic PKR, KIT shall confirm the supporting ARC(s) contain a properly assessed Assessed Finding for the decision rule itself (what a gardener is actually told to do), not only for the diagnosis. Where the ARC does not, this is a Gap 3-type gap, handled per Chapter 9 — and, as the dry run showed, is often resolvable by re-examining source material already gathered for the diagnostic findings, rather than requiring new research from scratch.

---

# Chapter 9 — Handling Missing or Incomplete Approved Information

## 9.1 Purpose

This chapter exists because of the dry run's **Gap 1**, which is also this chapter's worked example, resolved during this session and recorded at ARC-BUSHROSE-DEADWOOD-01 §6.

## 9.2 When This Procedure Applies

KIT follows this procedure whenever a PKR field requires content the retrieved ARC(s) and Founder observations do not support — whether the gap is total (nothing in the MIL addresses it) or partial (something addresses it, but not with sufficient specificity or confidence to responsibly complete the field).

## 9.3 Procedure

1. KIT records the specific field, the specific PKR it belongs to, and precisely what content is missing.
2. KIT assesses whether the missing content is: (a) a logical consequence of already-approved content (as Gap 1 was — the photo/physical-check boundary followed directly from AF-1 and AF-4's own descriptions of a physical action), or (b) a genuinely new empirical or evaluative claim that would need its own evidence.
3. For case (a), KIT recommends the gap be resolved by direct Founder approval as a Founder observation, and drafts proposed wording for the Founders to approve, amend or reject — KIT does not adopt the wording itself, since approving new MIL content is not within KIT's authority.
4. For case (b), KIT recommends the gap be referred to ROC as a new or extended research commission, and does not draft proposed wording, since KIT is not authorised to originate evidentiary claims.
5. Until the gap is resolved, the affected PKR field is recorded as an open gap, and the PKR as a whole is held at the partial-completeness status defined in Chapter 11 rather than marked complete with placeholder or inferred content.
6. Once resolved (by either route), KIT updates the affected PKR field, cites the specific new MIL asset (Founder observation or Assessed Finding) it now traces to, and removes the gap flag.

## 9.4 KIT's Role Is to Route the Gap, Not Resolve It

KIT's authority under this chapter is limited to identifying the gap, classifying it, and proposing a route to resolution (including, for case (a), proposed wording). The decision to approve a Founder observation, or to commission new research, remains exclusively the Founders' and ROC's respectively, consistent with the KIT Charter's Limitations of Authority.

## 9.5 Notification Mechanism Gap

As noted at §3.3, no formal ROC-to-KIT notification mechanism currently exists as a defined, systematic process — commissions have so far been triggered by direct Founder instruction. This Manual does not resolve that; it is recorded here as an open item for a future revision of the PIP Knowledge Integration Workflow, once integration volume makes an informal, instruction-by-instruction trigger impractical.

---

# Chapter 10 — Identification and Versioning of PKRs

## 10.1 Purpose

PKR Standard §6 explicitly leaves the identifier format for KIT to propose and the Founders to confirm when this Manual is drafted. This chapter makes that proposal, addressing the dry run's **Gap 6**.

## 10.2 Proposed Identifier Format

**`PKR-<TYPE-CODE>-<SUBJECT-SCOPE>-<sequence>`**

Where:

- **`<TYPE-CODE>`** is one of: `OBS` (Observation), `CMP` (Comparison Image), `DEC` (Decision Logic), `SGT` (Suitability Gate), `SRC` (Source), `DEF` (Definition);
- **`<SUBJECT-SCOPE>`** is a short, stable label for the record's subject, following the same convention already established for FRDs and ARCs (for example, `BUSHROSE-DEADWOOD`);
- **`<sequence>`** is a two-digit number starting at `01`, distinguishing records that share a type and subject-scope (for example, if the dead-versus-living-wood observation eventually required a second, narrower Observation PKR, it would become `PKR-OBS-BUSHROSE-DEADWOOD-02`).

Example, from the dry run: `PKR-OBS-BUSHROSE-DEADWOOD-01`; `PKR-SRC-BUSHROSE-DEADWOOD-03`.

This mirrors the FRD/ARC convention already in use (FRDS §3.2), so a subject's identifiers stay recognisably related across the whole pipeline from dossier to ARC to PKR.

## 10.3 Permanence

Per PKR Standard §6, a PKR's identifier does not change across revisions. A revision that changes approved meaning produces a new version of the same identifier (§10.4), not a new identifier.

## 10.4 Versioning

Each PKR carries a Version field (PKR Standard §4), incremented on every approved revision. Draft, unapproved changes do not increment the approved version; KIT may track pre-approval draft iterations separately (for example, `0.1`, `0.2`) until Founder approval assigns the first approved version (`1.0`), consistent with the versioning pattern already used for ARCs and Standards in this KCS.

## 10.5 This Proposal Requires Founder Confirmation

Per PKR Standard §6, this format is a proposal only until the Founders confirm it. Records built before confirmation (including the dry run's draft) use it provisionally and shall be reviewed for consistency once confirmed.

---

# Chapter 11 — Partial Completeness and Status Handling

## 11.1 Purpose

This chapter exists because of the dry run's **Gap 2** and **Gap 3**: an Observation PKR's diagnostic content can be fully and correctly drafted while it is still missing a required dependency (a Linked Comparison Image PKR, a Linked Decision Logic PKR) that does not yet exist anywhere in the KCS. The PKR Standard's existing status lifecycle (§7: Draft, Approved for Publication, Published, Suspended, Retired) does not distinguish "draft, complete and ready for review" from "draft, correct so far as it goes, but blocked on a dependency that does not yet exist." This chapter adds that distinction as a KIT working practice, not as a change to the PKR Standard's formal status field.

## 11.2 Dependency-Blocked Drafting

KIT may draft, and submit for Founder review, an Observation, Decision Logic, or other PKR whose content is accurate and complete as far as the currently approved MIL information allows, even where a required linked PKR does not yet exist — provided:

- every missing dependency is explicitly listed, not silently omitted;
- the PKR's Status field remains **Draft** (not Approved for Publication) until every dependency exists and is itself approved; and
- the Founder Review Rendering states plainly that the record is being reviewed for the correctness of its own content, not approved for publication, while dependencies remain outstanding.

## 11.3 Rationale

This allows Founder review of a PKR's substantive correctness to proceed in parallel with, rather than strictly after, dependency work like sourcing comparison photographs or researching a decision rule — provided the distinction between "content reviewed" and "ready to publish" is never blurred. A PKR shall never be published (LIL Standard's Excluded Material) while a required dependency per the PKR Standard is missing, regardless of how thoroughly its own content has been reviewed.

---

# Chapter 12 — Preparing the Founder Review Rendering

## 12.1 Purpose

Every draft PKR submitted for Founder operational review shall be accompanied by a Founder Review Rendering, per PKR Standard §9.2.

## 12.2 Content

The rendering shall present the PKR's complete content in plain sentences and tables, without requiring the Founders to read or understand the underlying field structure, and shall explicitly state:

- what the record is for, in one or two sentences a non-specialist could follow;
- what evidence it rests on and how strong that evidence is, described in plain terms rather than only as a confidence label;
- any preserved limitations or uncertainty, stated plainly rather than smoothed over;
- any outstanding dependencies (Chapter 11) preventing publication even if the content itself is approved; and
- any open decision the Founders need to make about this record specifically (for example, the confidence/scope choice from Chapter 8.2 item 4).

## 12.3 Content Equivalence

Per PKR Standard §9.3, the published PKR's content shall be identical in meaning to its approved rendering. KIT shall not introduce anything into the published record that did not appear in the rendering the Founders approved.

---

# Chapter 13 — Quality Review Before Submission

Before submitting a draft PKR (and its Founder Review Rendering) for Founder operational review, KIT shall confirm that:

- every Common Field and Type-Specific Field required by the PKR Standard is either populated and traceable to specific approved MIL content, or explicitly recorded as an open gap per Chapter 9;
- the triage record (Chapter 5) is included, showing how the source ARC's content was routed;
- Evidence Confidence has been determined per Chapter 8, with any live confidence/scope decision presented rather than resolved by KIT;
- all dependencies are listed per Chapter 11, with status accurately reflecting whether the record is complete-and-blocked or genuinely ready for full approval;
- the identifier (Chapter 10) is correctly assigned; and
- the Founder Review Rendering is complete and equivalent in meaning to the record itself.

Deficiencies identified during this review shall be corrected before submission.

---

# Part III — Founder Review and Publication

# Chapter 14 — Submission for Founder Operational Review

KIT submits the draft PKR and its Founder Review Rendering together. Per the KIT Charter, KIT does not approve its own work and does not attempt to influence the Founders toward a predetermined outcome — where a live decision exists (Chapter 8.2 item 4, or an outstanding dependency per Chapter 11), KIT presents the options and their consequences without recommending one over another as though it were already decided.

# Chapter 15 — Founder Decision and Corrections

Where the Founders approve a draft PKR (in whole, or with a specified narrowing per Chapter 8.2), KIT proceeds to Chapter 16.

Where the Founders decline, request amendment, or request the record be held pending dependency resolution, KIT does not silently revise the submitted draft. It implements the specific direction given, updates the record's version accordingly (Chapter 10.4), and resubmits, preserving the prior submission and decision for traceability — the same pattern already established for Founder Review Dossiers (FRDS §9.2).

# Chapter 16 — Publishing Approved PKRs

KIT publishes only PKRs that: have received explicit Founder operational approval; have every dependency required by their type (PKR Standard §5) satisfied and itself published; and whose published content is identical in meaning to their approved Founder Review Rendering (PKR Standard §9.3, Chapter 12.3).

A PKR approved for its own content but still blocked on a dependency (Chapter 11) is not published until that dependency is itself published. Its status remains Draft, not Approved for Publication, until then.

---

# Part IV — Ongoing Stewardship

# Chapter 17 — Maintaining the Live Intelligence Library

KIT maintains the LIL's codebase structure, identifiers, metadata, version history and inter-PKR relationships, per the LIL Standard's Custodianship section. This includes preserving superseded versions for traceability and never silently overwriting a published PKR (LIL Standard, Information Integrity).

# Chapter 18 — Managing PKR Revisions and Corrections

Where a published PKR's content is found to diverge from its approved Founder Review Rendering, this is treated as an Operational Representation Error (PKR Standard §9.3) regardless of intent, and is corrected under explicit Founder direction, following the same non-silent-revision discipline as Chapter 15.

Where new or revised MIL information affects a published PKR's underlying evidence, KIT does not revise the PKR unilaterally; it reports the impact assessment (Chapter 6.2) to the Founders and awaits direction, per Chapter 19.

# Chapter 19 — Assessing Operational Impact of New MIL Information

When ROC archives new or revised information into the MIL, KIT shall check whether it affects any existing published PKR — strengthening, weakening, or contradicting content that PKR relies on — and report that assessment to the Founders, per the KIT Charter's Core Responsibilities. This is a standing responsibility, not limited to the moment a new PKR is first built.

# Chapter 20 — Compliance

All PKRs built, submitted, revised or published by KIT shall comply with the PKR Standard, the LIL Standard, and the procedures in this Manual. Any apparent conflict between this Manual and a governing Standard shall be referred to the Founders rather than resolved by KIT's own inference (§1.2).

This Manual shall be reviewed periodically by the Founders and revised as KIT's practice reveals further gaps, in the same manner this version was itself produced from one.

---

# Document Control

This document forms part of the controlled documentation of the PIP Knowledge Curation System, pending Founder approval of its Draft status.

Printed copies are uncontrolled unless specifically identified by the Founders as controlled copies.

The current approved version, once approved, shall be maintained in the controlled documentation repository.

---

# End of Document

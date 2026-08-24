# PIP Knowledge Record (PKR) Standard

---

## Document Metadata

**Document Title:** PIP Knowledge Record (PKR) Standard  
**Volume:** Volume VI – Knowledge Curation System  
**Version:** 0.06  
**Status:** Draft — pending Founder approval of this revision  
**Owner:** The Founders  
**Last Updated:** 22 August 2026  
**Approved By:** Version 0.05 approved; this revision (0.06) not yet approved  
**Permanent Location:** `Knowledge Curation System/Standards/PKR_Standard.md`  
**Purpose:** To define what a PIP Knowledge Record (PKR) is, the types of PKR currently required, the fields each type must contain, and how PKRs are identified, versioned and related to one another.  
**Related Documents:** Live Intelligence Library (LIL) Standard; Mother Information Library (MIL) Standard; Evidence Assessment Standard (EAS); Pip Runtime Architecture; PIP Knowledge Integration Workflow; PIP Knowledge Integration Technician (KIT) Charter; `MVP/Architecture/Ask_Pip_MVP_Bush_Rose_V1_Architecture.md`.  
**Revision Note:** **Version 0.06 (Draft, this revision)** corrects a flaw in Version 0.05's Evidence Confidence common field (Section 4), identified directly by the Founder while reviewing a real draft PKR built under it: recording "the lowest of the applicable levels" where a PKR draws on multiple Assessed Findings is still one blended figure standing in for claims of differing evidential strength — the exact failure mode EAS v1.3 was written to eliminate at the ARC and Founder Review Dossier level, reintroduced one layer downstream at the PKR level. A PKR whose defining claim is High confidence (for example, pith colour) was being labelled Low overall because of a minor supporting detail, misleading a gardener about the strength of the primary claim. Section 4 is reworded so that a PKR's Evidence Confidence field records a single claim's level directly only where the PKR's content genuinely reduces to one claim; where it comprises more than one distinct claim (per EAS §3.2's test), each claim's level is recorded individually, never blended, averaged, or reduced to a lowest-applicable figure. Sections 5.1 and 5.3 are extended accordingly for Observation and Decision Logic PKRs, the two types most likely to bundle multiple claims. This revision also formalises, at Section 5.3, that a Decision Logic PKR's content — what a gardener is actually told to do — requires its own properly evidenced Assessed Finding(s), not an assumption inferred from the diagnostic content of the Observation PKR it governs. **Version 0.05** aligned the Evidence Confidence common field (Section 4) and Section 5.5 with EAS v1.3's Assessed Finding model, at Founder direction: an ARC does not carry one Evidence Confidence Level for all its content, so a PKR's Evidence Confidence must trace to the specific Assessed Finding(s) it is actually built from, not to a supporting ARC as a whole. Version 0.04 implements the two PKR Standard extensions the Pip Runtime Architecture §8.2 identifies as required: an Observation PKR now defines a closed Confirmation Responses set (Section 5.1), consistent with the Decision-Relevant Input Boundary that Standard establishes, and its Visual Criteria field is now required to be specific and structured enough to ground the Perception Layer's proposal, not written only as prose for a human reviewer. Version 0.03 replaces "AIC" with "ARC" throughout (Sections 4 and 5.5), following SINS-001 v0.4's retirement of the AIC term. Version 0.02 adds Evidence Confidence as a Common Field (Section 4), carried forward from the AIC(s) a record's Supporting Source(s) trace to, so that the strength of the underlying evidence is not lost between Founder approval and what Pip can draw on. Adds Section 4.1, designating which Common Fields are eligible for Pip to communicate to a gardener, and notes in Section 5.5 that Evidence Confidence on a Source PKR is inherited, not independently determined by KIT.

---

# 1. Purpose

This Standard defines the structure of a PIP Knowledge Record (PKR): the unit of operational intelligence that the PIP Knowledge Integration Technician (KIT) builds from Founder-approved Mother Information Library (MIL) information, and that the Live Intelligence Library (LIL) holds once published.

Its purpose is to give KIT a concrete, consistent structure to build against, and to give the Founders a consistent structure to review, so that "what does a PKR actually contain" is answered once rather than decided freshly for every record.

---

# 2. Scope

This Standard is scoped first to what the approved Bush Rose V1 Architecture requires: the six supported observations, their comparison material, their decision logic and their supporting sources.

It defines the PKR types currently required by that scope. Additional PKR types (for other plants, other journeys or other platform capabilities) shall be added to this Standard through the same Founder-approval process, not assumed by analogy.

This Standard governs PKR structure. It does not govern:

- how KIT retrieves information from the MIL, or the approval workflow a PKR passes through — that is governed by the PIP Knowledge Integration Workflow;
- where or how the LIL is technically hosted or served — that is a technical-architecture decision outside this Standard's scope;
- the content of any specific PKR — that is Founder operational approval, applied case by case;
- gardener-supplied information (photographs, answers, confirmations, corrections, choices, outcomes) — a PKR represents Founder-approved general knowledge only, never a specific gardener's session data, per the LIL Standard's Boundary With Gardener-Supplied Data.

---

# 3. PKR Types Currently Required

The following PKR types are required to support the Bush Rose V1 MVP. Each is defined in Section 4.

| Type | Represents |
|---|---|
| Observation PKR | One of the six supported observations (dead vs. living wood, damaged growth, crossing/rubbing stems, inward-growing stems, weak/congested growth, main framework to retain) |
| Comparison Image PKR | One approved reference image demonstrating an observation, per Architecture §4.3/§7 |
| Decision Logic PKR | The rule governing which choices (Cut, Leave, Decide later, Get experienced local help) are horticulturally acceptable for a given confirmed observation, and when a choice must be deferred |
| Suitability Gate PKR | One safety or suitability condition from Architecture §5.4 that must be satisfied before pruning guidance proceeds |
| Source PKR | A traceable reference to the MIL evidence a factual PKR is built from |
| Definition PKR | A term or concept Pip may need to explain to the gardener in plain language |

Further PKR types described in the PIP Knowledge Integration Workflow (plant structures, biological processes, exceptions, questions) are not yet defined at field level in this Standard. KIT shall not build a PKR of an undefined type; where one appears necessary, KIT shall refer the gap to the Founders rather than infer a structure.

---

# 4. Common Fields

Every PKR, regardless of type, shall contain:

- **PKR ID** — a unique, permanent identifier that does not change across revisions (see Section 6);
- **PKR Type** — one of the types listed in Section 3;
- **Title** — a short, functional description of what the record represents;
- **Status** — the record's position in its lifecycle (see Section 7);
- **Version** — incremented on every approved revision;
- **Applies To** — the plant type, and where relevant the growth stage or season, this record is scoped to (the MVP scope is: established bush rose, dormant pruning);
- **Supporting Source(s)** — one or more Source PKR references this record is traceable to;
- **Founder Approval Date** — the date operational approval was granted;
- **Related PKRs** — references to other PKRs this record relates to, using the relationship types in Section 8;
- **Preserved Uncertainty or Limitations** — any uncertainty, condition or limitation the approved MIL information carried, stated plainly rather than smoothed away;
- **Evidence Confidence** — see §4.2 (Draft v0.06 — no single figure blended across multiple claims).

## 4.1 Gardener-Facing Fields

Some Common Fields exist for internal traceability and system operation only. Others are eligible for Pip to draw on when communicating with a gardener, subject to the retrieval and communication boundaries set by the Live Intelligence Library (LIL) Standard and the approved MVP journey design.

The following Common Fields are eligible for gardener-facing communication:

- Evidence Confidence — per claim, per §4.2; never as one blended PKR-level figure;
- Supporting Source(s) — presented to the gardener as a plain-language attribution (for example, "sourced from a recognised extension publication") rather than as an internal MIL or ARC identifier;
- Preserved Uncertainty or Limitations.

The following Common Fields are internal only and shall not be presented to the gardener directly: PKR ID, PKR Type, Status, Version, Founder Approval Date, Related PKRs.

Designating a field as eligible under this section does not by itself authorise Pip to present it. The approved MVP journey design and Pip's own communication approach determine when and how an eligible field is actually shown to a gardener, consistent with the LIL Standard's Accessibility and Retrieval Boundary provisions.

## 4.2 Evidence Confidence — Per Claim, Never Blended (Draft v0.06)

Consistent with EAS §2.9 and §3.2 — Evidence Confidence is assigned to a distinct claim, never to a body of work as a whole — this principle applies with equal force at the PKR layer, not only at the ARC and Founder Review Dossier layers.

**Where a PKR's content reduces to a single claim** (for example, a Source PKR, which represents one traceable pointer to one Assessed Finding; or a Definition PKR, which is not an evidentiary claim at all), the Evidence Confidence common field records that single claim's level directly, inherited from the specific Assessed Finding it traces to (see §5.5 for Source PKRs). Where a record type does not represent an evidentiary factual claim, this field shall be recorded as **Not Applicable**.

**Where a PKR's content comprises more than one distinct claim** — under the same test EAS §3.2 applies: claims that could reasonably be supported to a different degree, regardless of whether they trace to the same or different Assessed Findings — the Evidence Confidence common field shall be recorded as **"See per-claim confidence"**, and each distinct claim's own Evidence Confidence Level shall be recorded individually, alongside that specific claim, within the PKR's type-specific fields. KIT shall not average, round up, or reduce multiple claims to one lowest-applicable value for this common field. This supersedes Version 0.05's "record the lowest of the applicable levels" rule, which is retired as of this version for exactly the reason EAS v1.3 retired blended commission-level confidence: it misrepresents both the well-supported and the poorly-supported claim it stands in for.

Sections 5.1 and 5.3 specify how this applies to Observation and Decision Logic PKRs, the two types most likely to bundle multiple claims.

---

# 5. Type-Specific Fields

## 5.1 Observation PKR

In addition to the common fields, an Observation PKR shall contain:

- **Observation Name** — one of the six supported observations;
- **Visual Criteria** — what a photograph needs to show to support this observation (viewpoint, scale, relevant context), per Architecture §6.2. Visual Criteria shall be specific and structured enough to ground the Perception Layer's proposal under the Pip Runtime Architecture, not written only as descriptive prose for a human reviewer. **Per §4.2 (Draft v0.06): each distinct diagnostic signal within Visual Criteria is its own claim and shall carry its own Evidence Confidence Level, recorded directly alongside it (for example, as a column in a structured table) — never summarised into one PKR-level Evidence Confidence figure.**
- **What the Photo Cannot Establish** — an explicit statement of the limits of photographic evidence for this observation;
- **Linked Comparison Image PKR(s)** — at least one, per Architecture §4.3;
- **Linked Decision Logic PKR** — the rule governing what choices apply once this observation is gardener-confirmed;
- **Confirmation Requirement** — confirmation that this observation requires the gardener to examine the physical rose before any decision proceeds (this is a structural requirement of the MVP, not optional per record);
- **Confirmation Responses** — the closed set of responses the gardener may give when asked to confirm this observation, per the Pip Runtime Architecture's Decision-Relevant Input Boundary: at minimum **Confirmed**, **Doesn't Match** and **Not Sure**. Confirmed routes to the Linked Decision Logic PKR. Doesn't Match and Not Sure shall not proceed to a Decision Logic PKR; each shall route to a defined fallback (request better evidence, defer, or recommend experienced local help), consistent with the approved MVP journey. Free-text confirmation is not permitted.

## 5.2 Comparison Image PKR

In addition to the common fields, a Comparison Image PKR shall contain the fields required by Architecture §4.1/§4.2/§7:

- **Feature Demonstrated**;
- **Viewpoint, Scale and Visible Context**;
- **Rose and Seasonal/Growth-Stage Context**;
- **Common Lookalikes**;
- **Limitations** — what this image cannot establish;
- **Image Source, Verification Status and Approval Status**;
- **Accessible Label / Alternative Text**.

## 5.3 Decision Logic PKR

In addition to the common fields, a Decision Logic PKR shall contain:

- **Governing Observation(s)** — the Observation PKR(s) this logic applies to;
- **Available Choices** — which of Cut, Leave, Decide later, Get experienced local help apply;
- **Conditions** — what must be true (including any Suitability Gate PKRs) for each choice to be horticulturally acceptable;
- **Deferral Triggers** — the conditions under which the choice must be deferred rather than decided, per Architecture §4.2.

**A Decision Logic PKR's content requires its own properly evidenced Assessed Finding(s) within the supporting ARC(s) — what a gardener is told to *do* is not inferable from an Observation PKR's diagnostic content, even where the connection seems obvious (Draft v0.06).** Where Conditions or Available Choices draw on more than one Assessed Finding of differing confidence (for example, a primary action and a separately-evidenced escalation or exception case), each is recorded with its own Evidence Confidence Level per §4.2, never blended into one figure for the whole record.

## 5.4 Suitability Gate PKR

In addition to the common fields, a Suitability Gate PKR shall contain:

- **Gate Area** — one of the areas listed in Architecture §5.4 (rose type, location/season, dormancy, recent planting, stress/damage/disease, tool condition, personal protection, safe access, adequate photographs/confidence);
- **Question or Check** — what is being confirmed;
- **Acceptable Answer(s)**;
- **Stopping Threshold** — the condition under which the journey must not proceed past this gate.

## 5.5 Source PKR

In addition to the common fields, a Source PKR shall contain:

- **Source Type** — book, scientific paper, extension publication, recognised horticultural publication, Founder observation, or another approved evidential origin;
- **Source Identity** — author, publication, date, relevant section, and access date where applicable;
- **MIL Reference** — the specific MIL information asset this Source PKR traces back to;
- **Relevance** — a brief statement of what this source supports.

A Source PKR does not duplicate the full source document into the LIL; it is a retrievable pointer, per the PIP Knowledge Integration Workflow §9.

The Evidence Confidence common field (Section 4) on a Source PKR is populated directly from the Evidence Confidence Level recorded on the specific Assessed Finding, within the ARC it references, that the Source PKR supports — not from the ARC as a whole — and shall not be independently determined or adjusted by KIT. A Source PKR represents exactly one claim's source, so §4.2's single-claim case always applies to it.

## 5.6 Definition PKR

In addition to the common fields, a Definition PKR shall contain:

- **Term**;
- **Plain-Language Explanation** — suitable for a beginner gardener;
- **Used By** — the PKRs that reference this definition.

---

# 6. Identification and Versioning

Every PKR shall have a permanent identifier assigned at creation, which does not change across revisions.

A published PKR shall never be silently overwritten. Where its approved operational meaning changes, a new version shall be created, the previous version preserved for traceability, and the relationship between versions recorded, in accordance with the PIP Knowledge Integration Workflow.

The exact identifier format (for example, a type prefix plus a sequential or content-derived suffix) is a technical implementation decision for KIT to propose and the Founders to confirm when KIT's Operations Manual is drafted. This Standard requires only that identifiers be permanent, unique and traceable.

---

# 7. Status Lifecycle

A PKR shall carry one of the following statuses, consistent with the PIP Knowledge Integration Workflow:

- **Draft** — built by KIT, not yet submitted or not yet approved for publication;
- **Approved for Publication** — Founder operational approval granted, not yet published to the LIL;
- **Published** — live in the LIL and available for Pip to retrieve;
- **Suspended** — temporarily withdrawn from retrieval by Founder direction while under review, per the PIP Knowledge Integration Workflow;
- **Retired** — withdrawn permanently, replaced or superseded, preserved for traceability but not used for gardener guidance.

Only Published PKRs are available to Pip at runtime.

---

# 8. Relationships

PKRs may be related to one another using the relationship types already established in the PIP Knowledge Integration Workflow, including: supported by, defined by, applies to, exception to, part of, develops from, visually indicated by, distinguished from, affected by, illustrated by, supersedes, related to.

A relationship between two individually approved PKRs is not itself automatically approved; where a relationship is operationally material, it shall be reviewed as part of the relevant PKRs' Founder operational review.

---

# 9. Founder Review Rendering and the Declarative Boundary

## 9.1 Declarative Content Only

A PKR shall express approved knowledge as declarative data — described facts, conditions, choices and references — not as executable logic, source code, embedded scripts or conditional program branches.

The application code that retrieves and applies PKRs is general-purpose retrieval logic, reviewed once as software engineering. It shall not itself encode plant-specific or observation-specific judgment. Any apparent need for logic beyond a straightforward, plainly-stated field value is out of scope for a PKR under this Standard, and KIT shall refer it to the Founders rather than build it.

## 9.2 Founder Review Rendering Required

The Founders are not required to read, parse or verify a PKR's underlying stored format in order to approve it.

Every draft PKR submitted for Founder operational review shall be accompanied by a Founder Review Rendering: the record's complete content, presented as plain sentences and tables that a Founder can read and judge without needing to understand the underlying file format, syntax or code.

Founder operational approval is granted against the Founder Review Rendering. The rendering, not the underlying file, is what the Founders are approving.

## 9.3 Content Equivalence

The published PKR's content shall be identical in meaning to its approved Founder Review Rendering.

KIT shall introduce nothing into the published record — no field, value, condition or relationship — that did not appear in the rendering the Founders approved.

Where a published PKR's content is found to diverge from its approved Founder Review Rendering, this shall be treated as an Operational Representation Error under the PIP Knowledge Integration Workflow's error-correction procedure, regardless of whether the divergence was intentional.

---

# 10. Compliance

Every PKR published to the Live Intelligence Library shall comply with this Standard.

KIT shall not publish a PKR of a type not yet defined in Section 3, or omit a required field in Sections 4–5, without first referring the gap to the Founders.

This Standard shall be extended, through Founder approval, as the platform's scope grows beyond the Bush Rose V1 MVP.

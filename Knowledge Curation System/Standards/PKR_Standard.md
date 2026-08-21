# PIP Knowledge Record (PKR) Standard

---

## Document Metadata

**Document Title:** PIP Knowledge Record (PKR) Standard  
**Volume:** Volume VI – Knowledge Curation System  
**Version:** 0.01  
**Status:** Approved  
**Owner:** The Founders  
**Last Updated:** 21 August 2026  
**Approved By:** AskPIP Founder Authority  
**Permanent Location:** `Knowledge Curation System/Standards/PKR_Standard.md`  
**Purpose:** To define what a PIP Knowledge Record (PKR) is, the types of PKR currently required, the fields each type must contain, and how PKRs are identified, versioned and related to one another.  
**Related Documents:** Live Intelligence Library (LIL) Standard; Mother Information Library (MIL) Standard; PIP Knowledge Integration Workflow; PIP Knowledge Integration Technician (KIT) Charter; `MVP/Architecture/Ask_Pip_MVP_Bush_Rose_V1_Architecture.md`.

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
- **Preserved Uncertainty or Limitations** — any uncertainty, condition or limitation the approved MIL information carried, stated plainly rather than smoothed away.

---

# 5. Type-Specific Fields

## 5.1 Observation PKR

In addition to the common fields, an Observation PKR shall contain:

- **Observation Name** — one of the six supported observations;
- **Visual Criteria** — what a photograph needs to show to support this observation (viewpoint, scale, relevant context), per Architecture §6.2;
- **What the Photo Cannot Establish** — an explicit statement of the limits of photographic evidence for this observation;
- **Linked Comparison Image PKR(s)** — at least one, per Architecture §4.3;
- **Linked Decision Logic PKR** — the rule governing what choices apply once this observation is gardener-confirmed;
- **Confirmation Requirement** — confirmation that this observation requires the gardener to examine the physical rose before any decision proceeds (this is a structural requirement of the MVP, not optional per record).

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

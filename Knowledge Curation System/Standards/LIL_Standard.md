# Live Intelligence Library (LIL) Standard

---

## Document Metadata

**Document Title:** Live Intelligence Library (LIL) Standard  
**Volume:** Volume VI – Knowledge Curation System  
**Version:** 0.01  
**Status:** Approved  
**Owner:** The Founders  
**Last Updated:** 21 August 2026  
**Approved By:** AskPIP Founder Authority  
**Permanent Location:** `Knowledge Curation System/Standards/LIL_Standard.md`  
**Purpose:** To define the purpose, governance, structure and operating principles of the Live Intelligence Library (LIL) within the Knowledge Curation System (KCS).  
**Related Documents:** Mother Information Library (MIL) Standard; PIP Research Origin Curator (ROC) Charter; PIP Knowledge Integration Technician (KIT) Charter; PIP Knowledge Integration Workflow; PIP Knowledge Record (PKR) Standard (drafted alongside this document).

---

# Purpose

The Live Intelligence Library (LIL) is the operational knowledge layer of the Plant Intelligence Platform (PIP) — the codebase Pip actually queries at runtime.

Its purpose is to hold Founder-approved operational intelligence in a structured, reliable, machine-usable form, built and maintained by the PIP Knowledge Integration Technician (KIT) from information approved into the Mother Information Library (MIL).

The LIL exists so that trustworthy knowledge, once approved, becomes something the Ask Pip application can actually retrieve and act on — not merely something that has been researched and recorded.

---

# Definition

The Live Intelligence Library is the authoritative repository of Founder-approved operational intelligence within PIP.

It contains PIP Knowledge Records (PKRs): structured, codebased records built from approved MIL information, each representing a defined operational intelligence asset such as an observation, a rule, a condition, a comparison image reference, a definition or a relationship.

The LIL contains only Founder-approved, published PKRs. It does not contain draft PKRs, raw research, unapproved interpretation or artificial intelligence assumptions.

---

# Objectives

The Live Intelligence Library exists to:

- hold Founder-approved operational intelligence in a form Pip can reliably retrieve at runtime;
- preserve complete traceability from every PKR back to its supporting MIL information;
- provide a stable, versioned, codebase structure that can be corrected or extended without redesign;
- keep operational intelligence separate from the raw research and evidence the MIL preserves;
- support the bounded scope of the current MVP while remaining able to grow to additional plants and observations without a structural rewrite.

---

# Contents

The Live Intelligence Library holds published PIP Knowledge Records (PKRs), including but not limited to:

- observation records (the six MVP-supported bush-rose observations and, in future, others);
- approved comparison-image references and their required metadata;
- decision-logic records (which choices — Cut, Leave, Decide later, Get experienced local help — are horticulturally acceptable for a given observation, and when a choice must be deferred);
- safety and suitability gate records;
- definitions and terminology records;
- source records, tracing operational intelligence back to its supporting MIL evidence;
- relationships between PKRs.

The exact structure, required fields and types of PKR are governed by the PIP Knowledge Record (PKR) Standard, not by this document.

---

# Excluded Material

The Live Intelligence Library shall not contain:

- draft or unapproved PKRs;
- raw or unreviewed research;
- artificial intelligence assumptions or inferred content not traceable to approved MIL information;
- content KIT has built but the Founders have not yet approved for publication;
- superseded PKR versions presented as current, though they may be retained for traceability in accordance with PKR revision requirements.

---

# Governance

The Founders retain sole authority for approving a PKR for publication to the LIL.

No artificial intelligence system, including KIT, may approve its own work or publish a PKR without explicit Founder operational approval.

Following Founder approval, KIT is responsible for maintaining the Live Intelligence Library while preserving the approved meaning, structure, traceability and integrity of every published PKR.

The Founders are not required to read or verify a PKR's underlying stored format in order to approve it. Every PKR is approved against its Founder Review Rendering, and PKR content is restricted to declarative data rather than executable logic, in accordance with the PIP Knowledge Record (PKR) Standard §9. This is what allows Founder approval to remain meaningful even though the Founders are not expected to read code.

---

# Custodianship

The PIP Knowledge Integration Technician (KIT) is the custodian and builder of the Live Intelligence Library.

KIT is responsible for:

- building and publishing approved PKRs to the LIL;
- maintaining the LIL's codebase structure, identifiers and metadata;
- preserving version history and superseded PKR versions where traceability requires it;
- maintaining relationships between PKRs;
- assessing and reporting the operational impact of new or revised MIL information on existing published PKRs.

Custodianship does not include authority to approve a PKR for publication, to modify Founder-approved meaning, or to suspend, retire or materially alter a published PKR without Founder direction.

---

# Relationship to the Mother Information Library

The Mother Information Library and the Live Intelligence Library serve different purposes.

The MIL preserves Founder-approved information assets in their approved form — the evidence base.

The LIL contains Founder-approved operational intelligence built from that information — the form Pip actually uses.

Information flows from the MIL to the LIL through the Knowledge Integration Workflow. The LIL does not replace the MIL, and the MIL does not function as an operational knowledge source that Pip retrieves from directly.

Both libraries are permanent components of the Knowledge Curation System.

---

# Information Integrity

Every PKR within the Live Intelligence Library shall:

- possess a unique, permanent identifier;
- preserve the approved meaning of the MIL information it was built from;
- maintain version history;
- remain traceable to its supporting MIL information and, through it, to the original evidence;
- preserve any relationships with other PKRs;
- record its approval status, approval date and publication date.

A published PKR shall never be silently overwritten. Where its approved operational meaning changes, a new version shall be created, the previous version preserved, and the reason for revision documented, in accordance with the PIP Knowledge Integration Workflow.

---

# Retrieval Boundary

The Plant Intelligence Platform, and Pip specifically, retrieves operational guidance exclusively from the Live Intelligence Library.

Pip does not retrieve operational guidance directly from the Mother Information Library, from raw research, or from any source outside published, Founder-approved PKRs.

Pip may:

- retrieve relevant PKRs and follow relationships between them;
- retrieve definitions, terminology and approved comparison images;
- identify exceptions, conditions and deferral thresholds; and
- combine compatible PKRs within their approved operational boundaries.

Pip shall not create new horticultural knowledge, override a PKR's stated limitations, conceal uncertainty a PKR preserves, or treat missing information as confirmed.

---

# Boundary With Gardener-Supplied Data

A gardener's photographs, contextual answers, confirmations, corrections, choices and outcomes are not knowledge within the Knowledge Curation System. They are never submitted to ROC, never enter the MIL, and never require Founder approval as general operational knowledge.

At runtime, Pip combines two distinct kinds of information and shall not treat them as equivalent:

- **Founder-approved operational knowledge**, retrieved from the LIL — general rules that apply across gardeners and roses (what a photograph needs to show, which choices are available, when a choice must be deferred);
- **gardener-supplied, single-session information** — this gardener's photographs, answers and confirmations for this specific plant.

Pip's own interpretation of a gardener's photograph, produced by the vision model using the LIL's stated visual criteria, is Pip's proposed inference, not Founder-approved fact, and shall always be presented as such, per Architecture §4.1. The gardener's confirmation or correction on the physical plant — not Pip's interpretation and not the LIL — is what establishes the confirmed observation for that plant. Only once an observation is gardener-confirmed does Pip apply the relevant Decision Logic PKR to it.

Gardener-supplied session information is preserved as that plant's individual history, governed by the approved MVP Architecture §4.4 and §6, not by this Standard. It is never promoted into the MIL or LIL, used as precedent for another gardener, or treated as approved knowledge, without a separate governed process for consent, privacy and validation that does not yet exist, per Architecture §4.4.

---

# Accessibility

The Live Intelligence Library serves different participants within the Knowledge Curation System in different ways.

The Founders govern what enters the LIL through operational approval.

KIT builds and maintains the LIL.

The Plant Intelligence Platform, through Pip, retrieves published operational intelligence from the LIL at runtime.

Gardeners do not access the LIL directly; they receive its content only as Pip communicates it, in accordance with the approved MVP journey.

---

# Guiding Principles

The Live Intelligence Library operates according to the following principles:

- Approved meaning before convenience.
- Reliability before elaboration.
- Traceability before speed.
- Structure before improvisation.
- Stewardship before ownership.
- Long-term maintainability.
- Scope discipline — the LIL shall not be treated as complete for a given plant or observation merely because some PKRs exist for it.
- Founder-reviewable meaning before implementation format — every PKR shall remain reviewable and approvable by the Founders in plain language, regardless of how it is technically stored or coded.

---

# Success Criteria

The Live Intelligence Library is successful when:

- Pip can reliably retrieve every PKR it needs for the current approved journey without ambiguity;
- every published PKR remains traceable to its supporting MIL information and evidence;
- historical PKR versions are preserved without ambiguity;
- a correction or new finding can be published to the LIL without an application release;
- gardeners never receive guidance derived from anything other than Founder-approved operational intelligence.

---

# Founding Statement

The Live Intelligence Library exists to give the Plant Intelligence Platform's approved knowledge a working, retrievable form.

By holding only Founder-approved operational intelligence, preserving complete traceability to its research origins, and remaining the sole source Pip draws from at runtime, the LIL provides the reliable operational foundation through which trustworthy horticultural knowledge actually reaches gardeners through Ask Pip.

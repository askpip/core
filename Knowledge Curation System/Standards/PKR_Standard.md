# PIP Knowledge Record (PKR) Standard

---

## Document Metadata

**Document Title:** PIP Knowledge Record (PKR) Standard  
**Volume:** Volume VI – Knowledge Curation System  
**Version:** 0.15  
**Status:** Approved  
**Owner:** The Founders  
**Last Updated:** 7 October 2026 (v0.15)  
**Approved By:** AskPIP Founder Authority  
**Permanent Location:** `Knowledge Curation System/Standards/PKR_Standard.md`  
**Purpose:** To define what a PIP Knowledge Record (PKR) is, the types of PKR currently required, the fields each type must contain, and how PKRs are identified, versioned and related to one another.  
**Related Documents:** Live Intelligence Library (LIL) Standard; Mother Information Library (MIL) Standard; Evidence Assessment Standard (EAS); Pip Runtime Architecture; PIP Knowledge Integration Workflow; PIP Knowledge Integration Technician (KIT) Charter; `MVP/Architecture/Ask_Pip_MVP_Bush_Rose_V1_Architecture.md`.  
**Revision Note:** **Version 0.15, 7 October 2026**, on a Founder's decision of 6 October 2026 that a local statement is shown only in the place its source names: §5.7's Shown to field may name a country, a region, a group of regions or a town, in place of countries only. No Published PKR needs revising. **Version 0.14, approved by AskPIP Founder Authority 6 October 2026**, on a Founder's decision to keep the one-approval pattern: §9.2 says the Founder Review Renderings of a package are put before the Founders as section 1 of Pip's Answers, and that operational approval is given in the same decision as approval of the research. No Published PKR needs revising. **Version 0.13, approved by AskPIP Founder Authority 5 October 2026**, at a Founder's direction: a Care Guidance item's Limit is carried only where it would change what a gardener does (§5.7), in line with the Pip Knowledge Rules Version 0.3. **Version 0.12, approved by AskPIP Founder Authority 5 October 2026**, at a Founder's direction in chat that the system documents be updated so that approved knowledge is used in the app and not wasted. §5.7 gives a Care Guidance item four further fields (Limit, Kind, Shown to, and a recorded Trace), lets question answers be grouped into a Topic with a lead question, and says which items carry no Evidence Confidence Level. No Published PKR needs revising. **Version 0.11, approved by AskPIP Founder Authority 2 October 2026** (in chat, against `Working/Drafts/Standards/PKR_Standard_Amendment_Proposal_v0.11.md`, with that proposal's Decisions 1(a) and 2(a)). It brings the Standard into line with two Founder decisions of 2 October 2026 and with the records already Published under them. (1) **Question answers:** a Care Guidance PKR may be presented as the answer to a common question a gardener opens, as well as at a journey point (§3, §5.7), and a question answer is information only. (2) **Growing-season checks:** new §4.4 names a second journey context beside the dormant pruning journey; an Observation PKR for such a check may carry an Offer Condition (§5.1), and its Decision Logic PKR states whether each Suitability Gate applies (§5.3). (3) **Supported observations:** §2, §3 and §5.1 no longer limit an Observation PKR to six; they name the six from the Architecture and the two approved since (rootstock suckers, blind shoots), and a further observation becomes supported when the Founders approve its PKR package. (4) **Reuse:** new §4.5 permits the app to answer a common question with statements from Published PKRs, word for word, and sets its limits. No Published PKR needs revising. **Version 0.10, approved by the Founder 29 September 2026** (in chat, with the first Care Guidance package, `PKR-CGD-BUSHROSE-CUTS-01-submission.md`), drafted at Founder direction (Shaphan chose, in chat, to add a new PKR type for basic care and cut mechanics rather than fold them into existing types). Adds the **Care Guidance PKR** (§3, new §5.7): approved guidance on *how* to carry out an action, general cautions shown alongside the pruning journey, and care for a rose while pruning isn't appropriate. None of this fits an existing type. It isn't an observation, it isn't a choice (Decision Logic), and it isn't a stopping condition (Suitability Gate). Building it as any of those would either misstate what it is or let it change which choices a gardener is offered. §5.7 therefore bars a Care Guidance PKR from adding, removing or altering a choice, passing or overriding a gate, or diagnosing anything. It also requires every guidance item to carry its own confidence, its own trace to an Assessed Finding or approved practical default, and a plain label where it is general woody-plant guidance rather than rose-specific. §2 and §3 are updated to match. Nothing else changes, and no existing PKR needs revising. **Version 0.09, approved by the Founder 23 August 2026** (approved alongside the first Source PKR package it enabled, `PKR-SRC-submission.md`). Corrects Section 5.5 and the related passage in Section 4.2: a Source PKR's Evidence Confidence common field is now **Not Applicable**, and its **MIL Reference** field is now **MIL References**, a list. This resolves a conflict identified while building this project's first Source PKRs: a single source document (for example, one extension publication) is routinely cited in support of several different Assessed Findings, across one or more ARCs, at different Evidence Confidence Levels — but the prior wording of §5.5 stated a Source PKR "represents exactly one claim's source," which would have required a separate, duplicate Source PKR for every claim a document happens to support, defeating the entire purpose of building Source PKRs as reusable, citable records rather than one-off pointers. Confidence now stays where EAS §2.9/§3.2 already say it belongs — with the specific claim, recorded on the citing PKR itself — never on the source being cited. This was identified and corrected before any Source PKR was built under the old rule, so no record required revision as a result. **Version 0.08** revises Section 6: identifiers now carry no scope, plant, or classification information (that belongs in Title/Applies To, which can be revised, unlike an ID), and a Draft-stage identifier may be corrected under Founder direction before a record reaches Approved for Publication. Prompted by the same-day retirement of the subject-scoped PKR ID format (KIT OM v0.4 §10.2) in favour of a plain sequential format, once the Founder questioned whether Pip's runtime efficiency was well served by scope-bearing IDs at all — it wasn't, since the same information was already duplicated in required Common Fields. **Version 0.07** adds §4.3, a Translation Boundary governing how KIT converts approved MIL content into gardener-facing PKR wording: KIT may add clarity, tone and structure, but shall never alter, extend, or reinterpret what a documented claim asserts while doing so. Added at Founder direction, raised alongside the Founder's ruling on how ROC's own reasoned synthesis is to be handled (EAS v1.4 §2.10) — the same underlying concern (an AI-performed role's wording drifting from documented evidence) applies one layer downstream, where KIT turns Assessed Findings into PKR field content. **Version 0.06** corrects a flaw in Version 0.05's Evidence Confidence common field (Section 4), identified directly by the Founder while reviewing a real draft PKR built under it: recording "the lowest of the applicable levels" where a PKR draws on multiple Assessed Findings is still one blended figure standing in for claims of differing evidential strength — the exact failure mode EAS v1.3 was written to eliminate at the ARC and Founder Review Dossier level, reintroduced one layer downstream at the PKR level. A PKR whose defining claim is High confidence (for example, pith colour) was being labelled Low overall because of a minor supporting detail, misleading a gardener about the strength of the primary claim. Section 4 is reworded so that a PKR's Evidence Confidence field records a single claim's level directly only where the PKR's content genuinely reduces to one claim; where it comprises more than one distinct claim (per EAS §3.2's test), each claim's level is recorded individually, never blended, averaged, or reduced to a lowest-applicable figure. Sections 5.1 and 5.3 are extended accordingly for Observation and Decision Logic PKRs, the two types most likely to bundle multiple claims. This revision also formalises, at Section 5.3, that a Decision Logic PKR's content — what a gardener is actually told to do — requires its own properly evidenced Assessed Finding(s), not an assumption inferred from the diagnostic content of the Observation PKR it governs. **Version 0.05** aligned the Evidence Confidence common field (Section 4) and Section 5.5 with EAS v1.3's Assessed Finding model, at Founder direction: an ARC does not carry one Evidence Confidence Level for all its content, so a PKR's Evidence Confidence must trace to the specific Assessed Finding(s) it is actually built from, not to a supporting ARC as a whole. Version 0.04 implements the two PKR Standard extensions the Pip Runtime Architecture §8.2 identifies as required: an Observation PKR now defines a closed Confirmation Responses set (Section 5.1), consistent with the Decision-Relevant Input Boundary that Standard establishes, and its Visual Criteria field is now required to be specific and structured enough to ground the Perception Layer's proposal, not written only as prose for a human reviewer. Version 0.03 replaces "AIC" with "ARC" throughout (Sections 4 and 5.5), following SINS-001 v0.4's retirement of the AIC term. Version 0.02 adds Evidence Confidence as a Common Field (Section 4), carried forward from the AIC(s) a record's Supporting Source(s) trace to, so that the strength of the underlying evidence is not lost between Founder approval and what Pip can draw on. Adds Section 4.1, designating which Common Fields are eligible for Pip to communicate to a gardener, and notes in Section 5.5 that Evidence Confidence on a Source PKR is inherited, not independently determined by KIT.

---

# 1. Purpose

This Standard defines the structure of a PIP Knowledge Record (PKR): the unit of operational intelligence that the PIP Knowledge Integration Technician (KIT) builds from a completed Founder Review Dossier or from Founder-approved Mother Information Library (MIL) information, and that the Live Intelligence Library (LIL) holds once published.

Its purpose is to give KIT a concrete, consistent structure to build against, and to give the Founders a consistent structure to review, so that "what does a PKR actually contain" is answered once rather than decided freshly for every record.

---

# 2. Scope

This Standard is scoped first to what the approved Bush Rose V1 Architecture requires: the supported observations, their comparison material, their decision logic and their supporting sources, and the care guidance that accompanies them (how an approved action is carried out, general cautions shown alongside the journey, answers to common questions, and care for a rose while pruning isn't appropriate). It covers the dormant pruning journey and growing-season checks (§4.4).

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
| Observation PKR | One supported observation. The Architecture names six for the dormant pruning journey (dead vs. living wood, damaged growth, crossing/rubbing stems, inward-growing stems, weak/congested growth, main framework to retain). The Founders have since approved two more: rootstock suckers, and blind shoots (a growing-season check, §4.4). A further observation becomes supported when the Founders approve its PKR package |
| Comparison Image PKR | One approved reference image demonstrating an observation, per Architecture §4.3/§7 |
| Decision Logic PKR | The rule governing which choices (Cut, Leave, Decide later, Get experienced local help) are horticulturally acceptable for a given confirmed observation, and when a choice must be deferred |
| Suitability Gate PKR | One safety or suitability condition from Architecture §5.4 that must be satisfied before pruning guidance proceeds |
| Source PKR | A traceable reference to the MIL evidence a factual PKR is built from |
| Definition PKR | A term or concept Pip may need to explain to the gardener in plain language |
| Care Guidance PKR | Approved guidance on *how* to carry out an action a Decision Logic PKR already permits (for example, how a pruning cut is made), a general caution shown alongside the journey (for example, how much of a bush to remove in one session), the answer to a common question a gardener opens, or care for a rose while pruning isn't appropriate. It never changes which choices are available (§5.7) |

Further PKR types described in the PIP Knowledge Integration Workflow (plant structures, biological processes, exceptions, questions) are not yet defined at field level in this Standard. KIT shall not build a PKR of an undefined type; where one appears necessary, KIT shall refer the gap to the Founders rather than infer a structure.

---

# 4. Common Fields

Every PKR, regardless of type, shall contain:

- **PKR ID** — a unique, permanent identifier that does not change across revisions (see Section 6);
- **PKR Type** — one of the types listed in Section 3;
- **Title** — a short, functional description of what the record represents;
- **Status** — the record's position in its lifecycle (see Section 7);
- **Version** — incremented on every approved revision;
- **Applies To** — the plant type, and where relevant the growth stage, season or journey context (§4.4), this record is scoped to (the MVP scope is: established bush rose; dormant pruning, or a growing-season check);
- **Supporting Source(s)** — one or more Source PKR references this record is traceable to;
- **Founder Approval Date** — the date operational approval was granted;
- **Related PKRs** — references to other PKRs this record relates to, using the relationship types in Section 8;
- **Preserved Uncertainty or Limitations** — any uncertainty, condition or limitation the approved MIL information carried, stated plainly rather than smoothed away;
- **Evidence Confidence** — see §4.2 (no single figure blended across multiple claims).

## 4.1 Gardener-Facing Fields

Some Common Fields exist for internal traceability and system operation only. Others are eligible for Pip to draw on when communicating with a gardener, subject to the retrieval and communication boundaries set by the Live Intelligence Library (LIL) Standard and the approved MVP journey design.

The following Common Fields are eligible for gardener-facing communication:

- Evidence Confidence — per claim, per §4.2; never as one blended PKR-level figure;
- Supporting Source(s) — presented to the gardener as a plain-language attribution (for example, "sourced from a recognised extension publication") rather than as an internal MIL or ARC identifier;
- Preserved Uncertainty or Limitations.

The following Common Fields are internal only and shall not be presented to the gardener directly: PKR ID, PKR Type, Status, Version, Founder Approval Date, Related PKRs.

Designating a field as eligible under this section does not by itself authorise Pip to present it. The approved MVP journey design and Pip's own communication approach determine when and how an eligible field is actually shown to a gardener, consistent with the LIL Standard's Accessibility and Retrieval Boundary provisions.

## 4.2 Evidence Confidence — Per Claim, Never Blended

Consistent with EAS §2.9 and §3.2 — Evidence Confidence is assigned to a distinct claim, never to a body of work as a whole — this principle applies with equal force at the PKR layer, not only at the ARC and Founder Review Dossier layers.

**Where a PKR's content reduces to a single claim**, the Evidence Confidence common field records that single claim's level directly, inherited from the specific Assessed Finding it traces to. **Where a record type does not represent an evidentiary factual claim of its own**, this field shall be recorded as **Not Applicable** — this includes a Definition PKR, which is not an evidentiary claim at all, and a Source PKR (see §5.5), which is a pointer to a source document rather than to any single claim: the same document is routinely cited in support of several different Assessed Findings, at different Evidence Confidence Levels, across the PKRs that cite it. Confidence in that case is recorded on each citing PKR, per its own claim, never on the Source PKR being pointed to.

**Where a PKR's content comprises more than one distinct claim** — under the same test EAS §3.2 applies: claims that could reasonably be supported to a different degree, regardless of whether they trace to the same or different Assessed Findings — the Evidence Confidence common field shall be recorded as **"See per-claim confidence"**, and each distinct claim's own Evidence Confidence Level shall be recorded individually, alongside that specific claim, within the PKR's type-specific fields. KIT shall not average, round up, or reduce multiple claims to one lowest-applicable value for this common field. This supersedes Version 0.05's "record the lowest of the applicable levels" rule, which is retired as of this version for exactly the reason EAS v1.3 retired blended commission-level confidence: it misrepresents both the well-supported and the poorly-supported claim it stands in for.

Sections 5.1 and 5.3 specify how this applies to Observation and Decision Logic PKRs, the two types most likely to bundle multiple claims.

## 4.3 Translation Boundary — Clarify, Never Alter

Building a PKR necessarily converts an Assessed Finding's formal, evidence-assessment phrasing into wording suitable for a beginner gardener. This translation is expected and necessary — a PKR does not exist to reproduce a Finding's source phrasing verbatim — but it introduces a specific risk: added wording could, even unintentionally, shift, soften, strengthen, extend or reinterpret the underlying claim.

KIT may add wording for readability, tone appropriate to a beginner gardener, formatting or structure. KIT shall not, in doing so:

- change what the documented claim asserts;
- extend a claim to a case, condition or plant type the evidence did not cover;
- add a "why" or explanatory mechanism the source material did not itself state;
- omit, soften or fold in a preserved limitation, condition or uncertainty; or
- resolve an ambiguity in a documented claim through its own inference.

Where phrasing a claim for a gardener requires resolving a genuine ambiguity in the documented claim itself, KIT shall refer the ambiguity to the Founders rather than resolve it independently, consistent with the KIT Charter's Limitations of Authority and with the same principle governing ROC's own reasoning (Evidence Assessment Standard §2.10) — an AI-performed role's added interpretation must not substitute for documented evidence, whether that role is generating a claim or merely wording one.

Where practical, KIT should retain a source's own terms wherever they are already gardener-comprehensible, rather than paraphrasing for its own sake.

This boundary applies to every PKR type's content when it is first drafted from approved MIL material. It is distinct from §9.3's Content Equivalence, which governs consistency between an already-approved Founder Review Rendering and what is later published.

## 4.4 Journey Context

A journey context is the setting in which Pip presents an Observation PKR and its Decision Logic PKR. Two are defined:

- **Dormant pruning journey** — the guided pruning session governed by the Suitability Gate PKRs, including the removal-only session the dormancy gate allows once a rose is in growth.
- **Growing-season check** — a short, separate check on one observation that can be seen only while the rose is in growth. It runs outside the dormant pruning journey, and the dormancy gate does not govern it.

A record's journey context is stated in Applies To. An Observation or Decision Logic PKR that states none belongs to the dormant pruning journey.

For a growing-season check:

- its Observation PKR and Decision Logic PKR are built, reviewed and published as for any other observation, and every requirement of §5.1 and §5.3 applies unchanged, including the Confirmation Requirement and the closed Confirmation Responses;
- Pip shall not present its observation inside the dormant pruning journey, or a dormant-pruning observation inside the check;
- its Decision Logic PKR shall state, for each Suitability Gate PKR, whether that gate applies to the check (§5.3);
- where the observation can be judged only once the rose has reached a certain stage, its Observation PKR shall carry an Offer Condition (§5.1).

A further journey context shall be added through Founder approval of an amendment to this Standard, not assumed by analogy.

## 4.5 Reuse of Published Statements in a Question Answer

The app may answer a common question by showing statements from Published PKRs of any type, word for word, each with the Evidence Confidence, sources and limitations its record carries for it. Such reuse adds no content and needs no new record. It shall not present a choice, and shall not stand in for a gate or a confirmation.

---

# 5. Type-Specific Fields

## 5.1 Observation PKR

In addition to the common fields, an Observation PKR shall contain:

- **Observation Name** — a supported observation (§3);
- **Visual Criteria** — what a photograph needs to show to support this observation (viewpoint, scale, relevant context), per Architecture §6.2. Visual Criteria shall be specific and structured enough to ground the Perception Layer's proposal under the Pip Runtime Architecture, not written only as descriptive prose for a human reviewer. **Per §4.2: each distinct diagnostic signal within Visual Criteria is its own claim and shall carry its own Evidence Confidence Level, recorded directly alongside it (for example, as a column in a structured table) — never summarised into one PKR-level Evidence Confidence figure.**
- **What the Photo Cannot Establish** — an explicit statement of the limits of photographic evidence for this observation;
- **Linked Comparison Image PKR(s)** — at least one, per Architecture §4.3;
- **Linked Decision Logic PKR** — the rule governing what choices apply once this observation is gardener-confirmed;
- **Confirmation Requirement** — confirmation that this observation requires the gardener to examine the physical rose before any decision proceeds (this is a structural requirement of the MVP, not optional per record);
- **Confirmation Responses** — the closed set of responses the gardener may give when asked to confirm this observation, per the Pip Runtime Architecture's Decision-Relevant Input Boundary: at minimum **Confirmed**, **Doesn't Match** and **Not Sure**. Confirmed routes to the Linked Decision Logic PKR. Doesn't Match and Not Sure shall not proceed to a Decision Logic PKR; each shall route to a defined fallback (request better evidence, defer, or recommend experienced local help), consistent with the approved MVP journey. Free-text confirmation is not permitted.
- **Offer Condition** (growing-season checks only, where §4.4 requires it) — a closed question Pip asks before presenting the observation, the answer that lets the check proceed, and the note shown for every other answer. It is stated declaratively (§9.1). It traces to an Assessed Finding, or to an approved practical default labelled plainly as a default. It decides only whether the observation can be judged yet; it is not a Suitability Gate.

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
- **Conditions** — what must be true (including any Suitability Gate PKRs) for each choice to be horticulturally acceptable. For a growing-season check, Conditions shall state, for each Suitability Gate PKR, whether it applies to the check (§4.4);
- **Deferral Triggers** — the conditions under which the choice must be deferred rather than decided, per Architecture §4.2.

**A Decision Logic PKR's content requires its own properly evidenced Assessed Finding(s) within the supporting ARC(s) — what a gardener is told to *do* is not inferable from an Observation PKR's diagnostic content, even where the connection seems obvious.** Where Conditions or Available Choices draw on more than one Assessed Finding of differing confidence (for example, a primary action and a separately-evidenced escalation or exception case), each is recorded with its own Evidence Confidence Level per §4.2, never blended into one figure for the whole record.

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
- **MIL References** — a list of the specific MIL information asset(s) (ARC and Assessed Finding) this Source PKR traces back to. A single source document is routinely cited in support of more than one Assessed Finding, across one or more ARCs, at differing Evidence Confidence Levels; this field is a list for exactly that reason, so that one Source PKR can be built once and reused by every PKR that cites it, rather than duplicated per citation. Each entry records the ARC, the specific Assessed Finding, and that Finding's own Evidence Confidence Level, for traceability — but that confidence belongs to the citing claim, not to the Source PKR itself (see below);
- **Relevance** — a brief statement of what this source supports.

A Source PKR does not duplicate the full source document into the LIL; it is a retrievable pointer, per the PIP Knowledge Integration Workflow §9.

The Evidence Confidence common field (Section 4) on a Source PKR is **Not Applicable**. A Source PKR is a pointer to a document, not to a single claim, and the document it points to may support several Assessed Findings at different confidence levels, cited by different PKRs. Recording one Evidence Confidence figure on the Source PKR itself would misrepresent every citation but one. Confidence stays with the claim doing the citing — recorded on the citing PKR's own Evidence Confidence field, per §4.2 — and is never recorded on, inherited from, or adjusted on the Source PKR being cited.

## 5.6 Definition PKR

In addition to the common fields, a Definition PKR shall contain:

- **Term**;
- **Plain-Language Explanation** — suitable for a beginner gardener;
- **Used By** — the PKRs that reference this definition.

## 5.7 Care Guidance PKR

A Care Guidance PKR carries approved guidance that helps a gardener act well without deciding anything for them. It exists in three modes, and every Care Guidance PKR records exactly one:

- **Technique** — how to carry out an action that a Decision Logic PKR has already made available (for example, where and how to make a pruning cut, or which tool suits a stem's thickness);
- **Advisory** — general guidance Pip presents at stated points: a caution alongside the journey (for example, not removing more than about a third of a bush in one session), or the answer to a common question a gardener opens (for example, why a rose isn't flowering). An Advisory informs; it never blocks, stops or reorders the journey;
- **Care** — care guidance for a rose while pruning isn't appropriate: when a Suitability Gate PKR has stopped or deferred the pruning journey, or when a rose is kept as a journal-only plant.

In addition to the common fields, a Care Guidance PKR shall contain:

- **Care Topic** — a short plain statement of what the guidance covers;
- **Guidance Mode** — Technique, Advisory or Care, as above;
- **Guidance Items** — the guidance itself, as a structured list (for example, a table). Each item is its own claim under §4.2 and shall record:
  - the **guidance statement**, in gardener-facing wording, subject to the Translation Boundary (§4.3);
  - its **trace**: the ARC and the specific Assessed Finding it comes from, or, where it rests on an approved practical default rather than a finding, the ARC's defaults section and the conflict the default resolves, labelled plainly as a default;
  - its own **Evidence Confidence Level**, inherited from that Assessed Finding (for an approved default, "Approved default — see [conflict]", never a borrowed confidence level);
  - its **Applicability**: **Rose-specific**, or **General woody-plant guidance (not rose-specific)**. General guidance shall always be labelled as such wherever Pip presents it to a gardener;
  - any **regional or climate limitation** the finding carries (for example, "sources are all from the United States", or "a hot-summer caution");
  - its **Limit**, where the finding has one that a gardener should see: one plain sentence shown with the statement. A Limit is carried only where it would change what a gardener does (Pip Knowledge Rules §3);
  - its **Kind**, where it is not an ordinary rated claim: **Precaution** (shown as a precaution, with its level), **Gap** (says no source was found; shown as "No source found"), **Disagreement** (says that experts disagree and what each side says; shown as "Sources disagree") or **Framing** (app wording that makes no horticultural claim; shown with nothing). A Gap, a Disagreement or a Framing item need not carry an Evidence Confidence Level, and its trace names the gap, the conflict or the rule it rests on;
  - **Shown to**, where the item is local information: the places whose gardeners see it. A place is the one the source names: a country (`NZ`), a region (`NZ-CAN`), a group of regions where sources speak of the group (`NZ-S`, the South Island), or a town (`NZ-OTA:Dunedin`). The codes are listed in `App/src/data/places/README.md`. The app works out the plant's places on the gardener's own device. It shows the item only where the plant is in one of the item's places, and does not show it where the place is not known (Pip Knowledge Rules, rule 4, and the standing decision "Places inside a country"). An item with no Shown to value is shown to everyone.
- **Presentation Points** — when Pip presents this guidance, stated declaratively. A Presentation Point is one of:
  - a journey point, identified by PKR (for example, "when the gardener chooses Cut under PKR-DEC-000002", or "when PKR-SGT-000001 stops the journey"). Where an Advisory repeats, the interval is stated as a plain value (for example, "before the first cut of a session, then after every third cut"), per §9.1; or
  - a question answer: when the gardener opens a named common question (for example, "when the gardener opens 'Why isn't my rose flowering?'"). The question is one of a closed list the app offers; a gardener does not type it. The record names the question by what it asks. The wording shown on screen is app copy.

  A record may have Presentation Points of both kinds. A Presentation Point shall never be a condition for proceeding;
- **Topic and order**, for a question answer that belongs to a group: the topic's name (for example "Spraying") and the record's place in it. The first record in a topic answers the lead question, which the app shows in its list of questions. The others open from the lead question's answer. A topic lets a subject's whole body of findings reach a gardener in short answers;
- **Scope of Presentation** — the rose types and circumstances within which the guidance may be shown, which shall not exceed Applies To.

**Boundary with Decision Logic and Suitability Gate PKRs.** A Care Guidance PKR shall not:

- add, remove or alter any choice a Decision Logic PKR makes available, or make a choice more or less acceptable;
- permit an action no Decision Logic PKR permits;
- pass, stop, override or reinterpret a Suitability Gate PKR;
- confirm, propose or diagnose an observation.

Where approved content would need to do any of these things, it is Decision Logic or a Suitability Gate, not Care Guidance, and KIT shall build or revise the proper record type (or refer the matter to the Founders), not a Care Guidance PKR.

**Question answers.** A question answer is information only. Opening one shall not start, pass or change a journey, a gate or a choice. It may offer a way into a journey or a growing-season check that is governed by its own Observation and Decision Logic PKRs. The boundary above applies to a question answer as it does to all other Care Guidance.

**Preserved conflicts.** Where a guidance item rests on an approved practical default because sources disagree, the Preserved Uncertainty or Limitations field shall say so plainly and name the conflict. KIT shall not present the default as settled fact, and shall not drop the minority position the ARC preserved.

**Evidence Confidence common field.** Recorded as "See per-claim confidence" wherever the record carries more than one guidance item (§4.2). A record with a single item records that item's level directly.

---

# 6. Identification and Versioning

Every PKR shall have a permanent identifier assigned at creation. Once a PKR has reached Approved for Publication (Section 7), its identifier does not change across revisions. Before that point, while a record is still Draft, its identifier may be corrected under explicit Founder direction — nothing outside the Knowledge Curation System depends on a Draft record's ID yet — but this is the only circumstance in which an assigned identifier changes.

A published PKR shall never be silently overwritten. Where its approved operational meaning changes, a new version shall be created, the previous version preserved for traceability, and the relationship between versions recorded, in accordance with the PIP Knowledge Integration Workflow.

The exact identifier format (for example, a type prefix plus a sequential or content-derived suffix) is a technical implementation decision for KIT to propose and the Founders to confirm; the current confirmed format is defined in the KIT Operations Manual. This Standard requires only that identifiers be permanent (subject to the Draft-stage exception above), unique and traceable — and that they carry no scope, plant, or classification information of their own. Any such information belongs in a record's Common Fields (Title, Applies To), which can be revised as understanding develops; an identifier cannot be, so nothing an identifier alone asserts should ever need to become untrue.

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

The renderings of a package are put before the Founders together, as section 1 of Pip's Answers, "What gardeners will see": every word a gardener would be shown, with its label and who sees it (pattern in `Working/AI Outputs/Founder_Review_Companion_Documents_Working_Note.md`). The Founders' one decision on Pip's Answers gives operational approval of the PKRs and approval of the research they rest on (PIP Knowledge Integration Workflow, Stage 10). A draft PKR may be built from a completed Founder Review Dossier before that decision; it stays a draft until the decision is given and the research is archived as an ARC. Fields a gardener is never shown (identifiers, traces, sources, relationships, presentation points) are in the package, which is open to the Founders with Pip's Answers; §9.3 applies to them as it does to section 1. Where the Founders approve with changes, the rendering approved is section 1 with the changes the Founder wrote, together with any new wording ROC or KIT had to write once the Founder has been shown it and has accepted it (KIT Operations Manual Chapter 15).

## 9.3 Content Equivalence

The published PKR's content shall be identical in meaning to its approved Founder Review Rendering.

KIT shall introduce nothing into the published record — no field, value, condition or relationship — that did not appear in the rendering the Founders approved.

Where a published PKR's content is found to diverge from its approved Founder Review Rendering, this shall be treated as an Operational Representation Error under the PIP Knowledge Integration Workflow's error-correction procedure, regardless of whether the divergence was intentional.

---

# 10. Compliance

Every PKR published to the Live Intelligence Library shall comply with this Standard.

KIT shall not publish a PKR of a type not yet defined in Section 3, or omit a required field in Sections 4–5, without first referring the gap to the Founders.

This Standard shall be extended, through Founder approval, as the platform's scope grows beyond the Bush Rose V1 MVP.

---

# Document Control

This document forms part of the controlled documentation of the PIP Knowledge Curation System.

Printed copies are uncontrolled unless specifically identified by the Founders as controlled copies.

The current approved version shall be maintained in the controlled documentation repository.

---

# End of Document

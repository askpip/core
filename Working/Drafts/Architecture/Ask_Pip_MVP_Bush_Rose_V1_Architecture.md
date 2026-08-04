# Ask Pip MVP – Bush Rose V1 Architecture

## Document Metadata

**Document Title:** Ask Pip MVP – Bush Rose V1 Architecture  
**Document Type:** Architecture Document  
**Version:** Unassigned - Founder decision required  
**Status:** Draft  
**Owner:** The Founders  
**Last Updated:** 4 August 2026  
**Working Location:** `Working/Drafts/Architecture/Ask_Pip_MVP_Bush_Rose_V1_Architecture.md`  
**Proposed Permanent Location:** Founder decision required  
**Purpose:** To define the first bounded minimum viable product implementation of the Ask Pip application, supporting Bush Rose V1 as its first Plant Profile type and plant-knowledge domain, and establish the boundaries that an implementable specification must follow.  
**Authority Source:** Founder-approved Founder Direction Brief – Guided Bush Rose MVP  
**Related Documents:** `Foundations/AskPIP_Vision_Statement.md`; `Foundations/Maries_Story.md`; `Working/Drafts/Architecture/Ask_Pip_MVP_Bush_Rose_V1_First_Guided_Care_Journey.md`

---

# 1. Purpose

This document defines the architecture for the first bounded minimum viable product (MVP) implementation of the Ask Pip application. Bush Rose V1 is the application's first supported Plant Profile type and plant-knowledge domain.

The MVP shall help a gardener observe, understand and care for individual bush roses over time through guided questions, trusted knowledge, contextual information and a continuing Bush Rose Profile history. Guided care includes learning why, when and how to consider pruning through gardener-led observation and supported choices.

This architecture establishes:

- the product outcome;
- the principal system boundaries;
- the Garden Journal and Plant Profile hierarchy;
- the role of photographs in evidence and plant history;
- the separation between evidence, observations, reasoning, guidance and plant history;
- the gardener's role and the use of approved knowledge;
- the continuing observation and follow-up cycle;
- the permitted first-MVP image capabilities; and
- the integration boundary for future plant-image analysis.

This document does not select software technologies, artificial-intelligence models, image-analysis providers or detailed implementation methods. Those decisions belong to later technical design and specification work.

# 2. Founder-Approved Direction

The Ask Pip application shall first support Bush Rose V1 as a bounded guided-care implementation that helps a gardener observe, understand and care for individual bush roses over time.

The gardener shall remain the primary observer. Ask Pip shall help the gardener:

- know what to notice;
- describe observations carefully;
- understand what supported observations may mean;
- distinguish possibilities from established conclusions;
- preserve photographs and other evidence in the history of the correct rose;
- record decisions and actions; and
- return to the outcome.

The first MVP may use photographs for capture and recordkeeping. Image-based reading of visible information such as text on a plant label is an optional enhancement and shall not be required for the complete MVP journey. Advanced plant-image analysis shall be treated as a future source of proposed observations. It shall not become the foundation upon which plant records, knowledge-based reasoning, guidance or follow-up depend.

# 3. MVP Product Outcome

The MVP shall enable a gardener to understand and care for individual bush roses through a continuing guided-care cycle informed by each rose’s identity, observations, evidence, care history and outcomes.

For at least one Bush Rose Profile, the gardener shall be able to complete a full guided-care cycle:

1. add and describe the rose;
2. begin or continue its photographic and written record;
3. learn what is relevant to expect;
4. complete a guided observation;
5. understand supported possibilities and uncertainty;
6. record a decision or defer action;
7. receive relevant follow-up guidance and optional reminders; and
8. record the outcome in the Bush Rose Profile's history.

The complete cycle shall include guided pruning education and a gardener-led pruning assessment for Sarah’s Rose.

The MVP succeeds as a product demonstration when that complete cycle can operate without requiring automated interpretation of the rose's physical appearance.

# 4. Architectural Principles

## 4.1 Guided Observation

Ask Pip shall guide the gardener to produce useful observations through structured questions and verified comparison material.

The system shall not depend on the gardener already knowing specialist horticultural terminology. Where terminology is useful, Ask Pip shall explain it in language the gardener can understand and apply.

## 4.2 Separation of System Elements

Evidence, observations, reasoning, guidance and plant history shall remain distinguishable.

This separation shall prevent:

- raw evidence from being treated automatically as an observation;
- an uploaded but uninterpreted photograph from being treated as proof of a reported observation;
- an observation from being treated automatically as a diagnosis;
- a possible interpretation from being presented as an established conclusion;
- guidance from obscuring the evidence and reasoning that support it; and
- future image-analysis technology from controlling the rest of the product.

## 4.3 Approved Knowledge

Ask Pip shall use only horticultural knowledge authorised for operational use by the Plant Intelligence Platform (PIP).

Product reasoning shall remain distinguishable from the approved knowledge on which it relies. The product shall preserve sufficient references to identify the operational knowledge used for a material assessment or guidance response.

## 4.4 Individual Plant Context

Guidance shall be informed by the information available about the particular rose, including relevant profile information, location, season, prior observations, photographs, recorded decisions, actions and outcomes.

The absence of relevant context shall not be concealed. Ask Pip shall request additional information, state uncertainty, limit or defer guidance, or identify when expert assistance may be appropriate.

## 4.5 Continuing Plant History

Each Plant Profile history shall preserve the relationships between evidence, observations, guidance, decisions, actions, follow-ups and outcomes so later guidance can use what has already been learned.

Plant Profile histories shall remain distinct unless the gardener intentionally creates an explicit relationship between them.

## 4.6 Encouraged but Optional Photography

A gardener may complete every guided-care activity without supplying a photograph.

Ask Pip shall explain the practical value of photographs at relevant points, including where applicable:

- creating a visual history that supports comparison over time and across seasons;
- preserving supporting evidence alongside the gardener's observation;
- recording labels and other visible information;
- connecting before-and-after records with care actions and outcomes;
- supporting appropriate review and future authorised photographic analysis.

Guidance shall reflect the evidence available and identify material limitations.

## 4.7 AI-Powered but Provider-Adaptable

Ask Pip shall provide artificial-intelligence-powered, provider-adaptable interaction through Pip.

Pip’s identity, approved knowledge, plant records, evidence history, operating rules and safeguards shall remain governed components of PIP.

The product shall be designed so suitable artificial-intelligence models, image-reading technologies and external providers may be adopted, combined or replaced without requiring the loss or reconstruction of:

- Pip's governed identity and behaviour;
- Plant Profile histories, photographs and associated data;
- approved operational knowledge and evidence and reasoning history;
- guidance and follow-up records; or
- operating rules and product safeguards.

## 4.8 Gardener Confirmation of Extracted Information

Where the MVP uses a photograph to read visible information, such as text on a nursery label, the result shall remain proposed information until the gardener confirms or corrects it. The original photograph, proposed reading and confirmed or corrected value shall remain distinguishable where the difference is material.

# 5. Product Boundaries

## 5.1 Included in the First MVP

The first MVP shall include:

- the Garden Journal and Plant Profile hierarchy defined in Section 7;
- optional capture and storage of multiple gardener-supplied photographs, including multiple views and before-and-after sequences, as linked evidence and historical records;
- relevant explanations of the value of photographs to the gardener and continuing plant record;
- manual entry of all relevant label, cultivar, location and planting information supplied through reliable records or gardener input;
- optional use of an available label-reading capability to propose a transcription for gardener confirmation or correction while preserving the original as supporting evidence;
- gardener-supplied observations captured through guided questions;
- verified reference material where required to help the gardener observe or compare;
- contextual answers grounded in approved operational knowledge with material uncertainty stated explicitly;
- a guided black-spot care episode that uses gardener-confirmed observations and individual plant context to explain when the reported pattern is consistent with rose black spot, provide practical supported care choices and assess the outcome at follow-up;
- guided pruning education that helps the gardener understand why, when and how to consider pruning;
- gardener-led pruning assessment using profile context, approved operational knowledge and gardener-confirmed observations;
- supported pruning choices, preparation, decisions, completed actions and outcomes;
- recording of decisions, deferred decisions, care actions and outcomes;
- optional, gardener-controlled reminders linked to the relevant Plant Profile and care cycle; and
- follow-up guidance that continues from an earlier interaction.

## 5.2 Deferred from the First MVP

The first MVP shall not claim to:

- diagnose a rose from photographs;
- determine overall plant health merely from appearance;
- identify invisible or ambiguous conditions;
- identify a cultivar from the rose's physical appearance;
- represent text extracted from a label as independent visual identification of the plant;
- provide automated cut-by-cut pruning overlays;
- treat something not visible in a photograph as absent; or
- present uncertain possibilities as established conclusions.

These capabilities remain possible future additions. Their inclusion shall require separate validation, specification and Founder approval.

# 6. Logical Architecture

## 6.1 Bush Rose Profile

Each Bush Rose Profile shall hold the relatively stable identity and context of the individual bush rose it represents.

It may include:

- the gardener's chosen name for the rose;
- reliable cultivar or label information;
- planting or acquisition information supplied by the gardener;
- relevant location information;
- the gardener's account of why the rose matters;
- selected profile photographs, including a label photograph where available.

Information shall retain its source where source affects reliability. A gardener-confirmed label transcription shall remain distinguishable from a cultivar inferred from appearance, which is outside the first MVP boundary.

## 6.2 Evidence

Evidence shall preserve the source material from which observations or context are obtained.

Evidence may include:

- gardener answers;
- gardener-written notes;
- nursery labels and label photographs;
- dates;
- location information;
- photographs;
- imported records; and
- previous journal records.

An evidence item shall remain identifiable independently of any later interpretation made from it.

## 6.3 Photographic Record

Gardener-supplied photographs shall form part of the evidence and historical record for the correct Plant Profile. The product shall support links to relevant observations, questions, decisions, care actions, follow-ups and outcomes.

The photographic record shall support:

- multiple photographs for an event where useful;
- whole-plant, plant-area, detail and label views;
- capture date and, where different, upload date;
- the gardener's description of the subject, viewpoint or purpose;
- links between before, during, after and follow-up photographs;
- preservation of the original image wherever practical;
- retention of gardener notes or annotations without altering the original image;
- separation of the original image from later machine or human interpretations; and
- later authorised analysis of photographs already retained.

Photograph metadata shall be limited to information needed for the gardener's record and approved PIP purposes. Privacy, consent, retention and any use beyond the individual gardener's service shall be defined before implementation. Storage in a Plant Profile history shall not by itself authorise use for model training or general research.

## 6.4 Optional Visible-Information Extraction

The MVP may use an available image-reading capability as an optional enhancement to propose a transcription of visible information supplied by the gardener, including printed or handwritten text on a plant label, nursery tag or plant passport. The gardener shall be able to enter all such information manually, and omission or technical unavailability of label reading shall not block any part of the complete MVP journey.

The interaction shall allow the gardener to:

- confirm the proposed reading;
- correct it;
- enter the information manually; or
- state that it cannot be determined.

Where material, the record shall preserve:

- the original image;
- the information detected or proposed by the system;
- the gardener's confirmation or correction; and
- the value ultimately used in the Bush Rose Profile.

Reading visible text from a supplied image shall not be represented as plant identification, cultivar recognition, plant assessment, diagnosis or recognition of the rose from its physical appearance.

## 6.5 Structured Observations

An observation shall be a structured statement about what has been reported or otherwise supported by evidence.

Each material observation shall be capable of recording:

- the subject of the observation;
- the observation itself;
- its source;
- the supporting evidence;
- when it was recorded;
- any material limitations;
- its confirmation state; and
- confidence where an applicable approved standard requires or permits it.

The initial source categories shall support at least:

- gardener-reported;
- imported record; and
- system inference.

An observation shall also be capable of recording whether the gardener linked photographic evidence and whether that evidence has been reviewed or interpreted. A supplied but uninterpreted photograph shall not be described as verifying the gardener's report.

The architecture shall permit a future `photograph-derived` source without changing the observation structure.

## 6.6 Knowledge-Based Reasoning

Reasoning shall evaluate supported observations and relevant plant context using approved operational knowledge.

The reasoning process shall be able to distinguish:

- what the evidence supports;
- what remains possible;
- what has not been established;
- what additional information may help; and
- whether guidance should proceed, be limited, be deferred or recommend expert assistance.

Reasoning outputs shall not silently alter the underlying evidence or observations.

## 6.7 Guidance

Guidance shall communicate the practical result of the supported reasoning to the gardener.

Guidance may:

- explain relevant knowledge;
- explain supported possibilities, uncertainty and limitations;
- suggest what to observe next;
- teach the gardener what to look for and why it matters when considering pruning;
- present and compare supported care options;
- explain a supported likely cause with honest confidence when the available observations and approved knowledge justify useful guidance;
- provide practical black-spot care guidance, including the purpose of each supported action and the circumstances in which further help is appropriate;
- explain when and why a photograph may improve the record or later assessment; and
- invite the gardener to record a decision or defer action.

Guidance shall not imply that the gardener completed an action until completion is recorded.

## 6.8 Decisions and Actions

The product shall distinguish between:

- guidance offered;
- a decision made by the gardener;
- a decision intentionally deferred;
- an action planned;
- an action reported as completed; and
- an outcome later observed.

## 6.9 Garden Journal

The Garden Journal shall present and organise Plant Profile histories in accordance with Section 7.

Plant Profile history entries may link:

- evidence;
- photographs and their contextual data;
- observations;
- questions and answers;
- reasoning outcomes;
- guidance;
- decisions;
- care actions;
- follow-up arrangements; and
- observed outcomes.

Each entry shall remain within the correct Plant Profile history and preserve any relevant relationship to an earlier event that prompted it.

## 6.10 Follow-Up and Reminders

Follow-up shall continue an existing care or observation cycle rather than begin an unrelated interaction.

Ask Pip shall offer reminders when timing matters, including a chosen time to revisit an observation or consider seasonal pruning. Reminders shall be optional. The gardener shall be able to choose, change or cancel them. Opening a reminder shall return the gardener to the relevant Plant Profile and resume the care cycle it concerns. If notification delivery is unavailable or declined, the care cycle shall remain accessible from the Plant Profile and Garden Journal.

A follow-up record shall identify:

- the Bush Rose Profile concerned;
- the earlier observation, decision or action being reviewed;
- the reason for returning;
- what the gardener is asked to observe, photograph or report;
- the relevant follow-up timing or condition; and
- the resulting outcome when recorded.

# 7. Core Information Relationships

The minimum required relationships are:

- each gardener has one continuing Garden Journal;
- one Garden Journal contains one or more Plant Profiles;
- the MVP initially supports Bush Rose Profiles as a Plant Profile type;
- each Bush Rose Profile represents one individual bush rose;
- the same Garden Journal may contain other Plant Profile types when they are added later;
- each Plant Profile maintains its own continuing history;
- one Plant Profile history contains multiple linked entries;
- one profile-history entry may contain or reference multiple evidence items, including photographs;
- one photograph may be linked to its Plant Profile and to one or more relevant events in that profile's history;
- one evidence item may support one or more observations;
- one observation may be considered by one or more reasoning assessments;
- one reasoning assessment may produce one or more guidance items;
- one guidance item may lead to a gardener decision, a deferred decision or no recorded decision;
- one decision may lead to one or more planned or completed actions;
- an observation, decision or action may create a follow-up that later records an outcome; and
- one follow-up may have an optional reminder linked to the relevant Plant Profile and care cycle.

The implementable specification shall define the exact data structures, required fields and cardinality rules without weakening these distinctions.

# 8. Observation Lifecycle

A structured observation shall be capable of moving through a controlled lifecycle:

1. **Captured** - evidence or gardener input has produced a proposed observation record.
2. **Clarified** - required questions or comparisons have improved the observation's meaning.
3. **Confirmed or corrected** - the gardener has confirmed the wording, supplied a correction or identified that they cannot determine it.
4. **Used in reasoning** - the observation has been considered with approved knowledge and relevant context.
5. **Recorded in history** - the observation and its relationship to later decisions or outcomes are preserved in the relevant Plant Profile history.

The specification may use different interface wording, but it shall preserve the difference between a proposed observation, a gardener-confirmed observation and a system inference.

# 9. Selected Guided-Care Journey

The selected first journey is Marie’s complete first-use-to-outcome experience with Sarah’s Rose, defined in `Working/Drafts/Architecture/Ask_Pip_MVP_Bush_Rose_V1_First_Guided_Care_Journey.md`.

The implementable specification shall support that journey and satisfy its journey-specific acceptance criteria, including its guided black-spot care, pruning and reminder behaviour. This architecture governs the underlying system and information behaviour; the journey document governs Marie’s experience.

# 10. Knowledge Curation System Relationship

The Knowledge Curation System (KCS) shall remain responsible for the governed preparation, approval and publication of knowledge for operational use.

The Ask Pip MVP shall consume approved operational knowledge. It shall not:

- treat unapproved draft research as operational knowledge;
- create Founder-approved knowledge through ordinary user interaction;
- overwrite the source knowledge record when applying it to an individual rose; or
- conceal when required operational knowledge is unavailable.

The MVP specification shall identify the minimum approved bush-rose knowledge required for the selected guided journey before that journey is represented as operationally supported. This includes the knowledge needed to recognise a gardener-reported pattern consistent with rose black spot, explain the condition, support proportionate care choices and assess the response at follow-up.

The Commission 008 Knowledge Pack may support model or capability validation, architecture reconciliation, specification preparation and identification of required Bush Rose knowledge. It shall not be treated as approved operational knowledge unless it has separately completed the applicable approval and CORE integration process.

Gardener observations, photographs and outcomes may create useful records for the gardener and may support future authorised research or capability development. They shall not become approved general horticultural knowledge automatically, and storage for the gardener's service shall not itself authorise any secondary use.

# 11. Required Safeguards

The implementable specification shall preserve:

- the Journal, Plant Profile and history relationships defined in Section 7;
- source and evidence traceability;
- voluntary photography throughout guided care;
- original photographs separately from notes and later interpretations;
- gardener confirmation or correction of extracted information and future machine proposals;
- expressible uncertainty, including unknown, not visible and conflicting information;
- reasoning based only on approved operational knowledge;
- separation of guidance, decisions, completed actions and outcomes;
- continuity between an event, its optional reminder, its follow-up and its outcome; and
- provider adaptability without making one external provider Pip’s permanent identity or exclusive operating foundation.

# 12. Relationship to Marie's Story

*Marie's Story* remains the approved long-term foundational narrative of the Ask Pip experience. The first MVP preserves its focus on the individual plant, observation before action, useful explanation, continuing history, honest uncertainty and gardener judgement.

Guided pruning education and gardener-led pruning assessment are incorporated into the first MVP through this architecture and Marie’s selected journey. Earlier pruning-first requirements and materials govern only where they are expressly incorporated into this architecture or the approved implementable specification. The deferred capabilities listed in Section 5.2 remain outside the first MVP.

# 13. Specification Handoff

After Founder approval of this architecture and the selected journey, the next controlled document shall be an implementable MVP specification.

The specification shall define the interfaces, data structures, validation, operational knowledge, reasoning, history, black-spot guidance, pruning guidance, reminders, follow-up, failure behaviour and tests needed to implement Marie’s journey while preserving this architecture’s relationships and boundaries. Optional label reading shall be specified only if selected for implementation.

The specification shall not commence software development or approve technology choices unless the Founders separately authorise those actions.

# 14. Decisions Required Before CORE Integration

The Founders must determine:

1. the approved version for this architecture document;
2. its permanent PIP CORE location;
3. whether the proposed source categories and observation lifecycle accurately express the approved product direction; and
4. whether any amendment is required before the document enters Founder review.

---

# End of Document

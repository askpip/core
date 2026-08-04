# Guided Bush Rose MVP Architecture

## Document Metadata

**Document Title:** Guided Bush Rose MVP Architecture  
**Document Type:** Architecture Document  
**Version:** Unassigned - Founder decision required  
**Status:** Draft  
**Owner:** The Founders  
**Last Updated:** 4 August 2026  
**Working Location:** `Working/Drafts/Architecture/Guided_Bush_Rose_MVP_Architecture.md`  
**Proposed Permanent Location:** Founder decision required  
**Purpose:** To define the product architecture for the first Guided Bush Rose minimum viable product and establish the boundaries that an implementable specification must follow.  
**Authority Source:** Founder-approved *Founder Direction Brief - Guided Bush Rose MVP*, dated 4 August 2026  
**Related Documents:** `Foundations/AskPIP_Vision_Statement.md`; `Foundations/Maries_Story.md`

---

# 1. Purpose

This document defines the product architecture for the first Guided Bush Rose minimum viable product (MVP) of Ask Pip.

The MVP shall help a gardener observe, understand and care for individual bush roses over time through guided questions, trusted knowledge, contextual information and a continuing record for each rose.

This architecture establishes:

- the product outcome;
- the principal system boundaries;
- the relationship between Bush Rose Profiles and their Garden Journals;
- the role of photographs and associated data from the first MVP;
- the separation between evidence, observations, reasoning, guidance and plant history;
- the role of the gardener;
- the required relationship with approved knowledge;
- the continuing observation and follow-up cycle;
- the permitted use of limited image-reading capabilities; and
- the point at which future plant-image analysis may be added without replacing the core product.

This document does not select software technologies, artificial-intelligence models, image-analysis providers or detailed implementation methods. Those decisions belong to later technical design and specification work.

# 2. Founder-Approved Direction

The MVP shall be built first as a guided companion that helps a gardener observe, understand and care for individual bush roses over time.

The gardener shall remain the primary observer. Ask Pip shall help the gardener:

- know what to notice;
- describe observations carefully;
- understand what supported observations may mean;
- distinguish possibilities from established conclusions;
- preserve photographs and other evidence in the history of the correct rose;
- record decisions and actions; and
- return to the outcome.

The first MVP may use photographs for capture, recordkeeping and limited reading of visible information such as text on a plant label. Advanced plant-image analysis shall be treated as a future source of proposed observations. It shall not become the foundation upon which plant records, knowledge-based reasoning, guidance or follow-up depend.

# 3. MVP Product Outcome

The MVP shall enable each gardener to create and maintain one or more separate Bush Rose Profiles. Each profile shall represent one individual bush rose and shall have its own continuing Garden Journal, photographic record, observations, decisions, care actions and outcomes.

For at least one Bush Rose Profile, the gardener shall be able to complete a full guided-care cycle:

1. add and describe the rose;
2. begin or continue its photographic and written record;
3. learn what is relevant to expect;
4. complete a guided observation;
5. understand supported possibilities and uncertainty;
6. record a decision or defer action;
7. receive relevant follow-up guidance; and
8. record the outcome in the Garden Journal.

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

Each Bush Rose Profile shall preserve the continuing history of one individual rose. The linked Garden Journal shall be more than a collection of photographs or notes: it shall preserve the relationships between evidence, observations, guidance, decisions, actions, follow-ups and outcomes so later guidance can use what has already been learned.

Records belonging to different roses shall remain separate unless the gardener intentionally creates an explicit relationship between them.

## 4.6 Encouraged but Optional Photography

The gardener shall be encouraged, but not required, to add photographs to each Bush Rose Profile and Garden Journal.

Ask Pip shall explain the practical value of photographs at relevant points. Depending on the interaction, positive reasons may include:

- creating a visual history of the individual rose;
- helping the gardener compare change over time and across seasons;
- preserving supporting evidence alongside the gardener's observation;
- recording labels and other visible information;
- connecting before-and-after records with care actions and outcomes;
- helping another person review the record where appropriate; and
- allowing future authorised photographic capabilities to examine earlier records.

The absence of a photograph shall not prevent the gardener from creating a Bush Rose Profile, recording an observation, asking for guidance or continuing a care cycle. Guidance shall reflect the evidence actually available and identify material limitations where necessary.

## 4.7 AI-Powered but Provider-Adaptable

Pip shall be an artificial-intelligence-powered companion. Pip's identity, approved knowledge, plant records, evidence history, operating rules and safeguards shall remain governed components of PIP rather than properties of one external model or provider.

The product shall be designed so suitable artificial-intelligence models, image-reading technologies and external providers may be adopted, combined or replaced without requiring the loss or reconstruction of:

- Pip's governed identity and behaviour;
- Bush Rose Profiles and Garden Journals;
- photographs and associated data;
- approved operational knowledge;
- evidence and reasoning history;
- guidance and follow-up records; or
- product safeguards.

No particular model, technology or provider shall constitute the permanent identity, knowledge base or exclusive operating foundation of Pip.

## 4.8 Gardener Confirmation of Extracted Information

Where the MVP uses a photograph to read visible information, such as text on a nursery label, the result shall be presented as a proposed transcription or interpretation for the gardener to confirm or correct.

Ask Pip shall not silently treat extracted information as established profile information. The original photograph, proposed reading and gardener-confirmed or corrected value shall remain distinguishable where the difference is material.

# 5. Product Boundaries

## 5.1 Included in the First MVP

The first MVP shall include:

- the ability for each gardener to create and maintain one or more separate Bush Rose Profiles, with each profile representing an individual bush rose;
- a separate continuing Garden Journal linked to each Bush Rose Profile;
- optional capture and storage of multiple gardener-supplied photographs as linked evidence and historical records;
- clear, relevant explanations of why adding photographs may benefit the gardener and the continuing rose record;
- support for multiple views and before-and-after photographic sequences;
- recording of relevant label, cultivar, location and planting information supplied through reliable records or gardener input;
- optional use of a label photograph to propose a transcription of visible text for gardener confirmation or correction;
- preservation of the original label photograph as supporting evidence where supplied;
- gardener-supplied observations captured through guided questions;
- verified reference material where required to help the gardener observe or compare;
- contextual answers grounded in approved operational knowledge;
- explicit communication of material uncertainty;
- recording of decisions, deferred decisions, care actions and outcomes; and
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

Each Bush Rose Profile shall represent one individual bush rose and hold its relatively stable identity and context.

It may include:

- the gardener's chosen name for the rose;
- reliable cultivar or label information;
- planting or acquisition information supplied by the gardener;
- relevant location information;
- the gardener's account of why the rose matters;
- selected profile photographs, including a label photograph where available; and
- a link to the rose's Garden Journal.

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

Photographs supplied by the gardener shall form part of the continuing evidence and historical record for the correct individual rose. The product shall support photographs connected to a Bush Rose Profile and to relevant Garden Journal events, including observations, questions, decisions, care actions, follow-ups and outcomes.

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

Photograph metadata shall be limited to information needed for the gardener's record and approved PIP purposes. Privacy, consent, retention and any use beyond the individual gardener's service shall be defined before implementation. Storage in a Bush Rose Profile or Garden Journal shall not by itself authorise use for model training or general research.

## 6.4 Visible-Information Extraction

The MVP may use an available image-reading capability to propose a transcription or interpretation of visible information supplied by the gardener, including printed or handwritten text on a plant label, nursery tag or plant passport.

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

Reading visible text from a supplied image shall not be represented as recognition of the rose from its physical appearance.

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
- explain supported possibilities;
- identify uncertainty and limitations;
- suggest what to observe next;
- present supported care options;
- help the gardener compare options;
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

This separation is required so later guidance does not assume that an offered recommendation was accepted or completed.

## 6.9 Garden Journal

Each Bush Rose Profile shall have one continuing Garden Journal that presents the history of that individual rose.

Journal entries may link:

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

The journal shall preserve the relationship between an event and the earlier event that prompted it where that relationship is relevant.

## 6.10 Follow-Up

Follow-up shall continue an existing care or observation cycle rather than begin an unrelated interaction.

A follow-up record shall identify:

- the Bush Rose Profile concerned;
- the earlier observation, decision or action being reviewed;
- the reason for returning;
- what the gardener is asked to observe, photograph or report;
- the relevant follow-up timing or condition; and
- the resulting outcome when recorded.

# 7. Core Information Relationships

The minimum required relationships are:

- one gardener may have one or more Bush Rose Profiles;
- each Bush Rose Profile represents one individual bush rose;
- each Bush Rose Profile has one continuing Garden Journal;
- one Garden Journal contains multiple linked entries;
- one journal entry may contain or reference multiple evidence items, including photographs;
- one photograph may be linked to its Bush Rose Profile and to one or more relevant journal events;
- one evidence item may support one or more observations;
- one observation may be considered by one or more reasoning assessments;
- one reasoning assessment may produce one or more guidance items;
- one guidance item may lead to a gardener decision, a deferred decision or no recorded decision;
- one decision may lead to one or more planned or completed actions; and
- an observation, decision or action may create a follow-up that later records an outcome.

The implementable specification shall define the exact data structures, required fields and cardinality rules without weakening these distinctions.

# 8. Observation Lifecycle

A structured observation shall be capable of moving through a controlled lifecycle:

1. **Captured** - evidence or gardener input has produced a proposed observation record.
2. **Clarified** - required questions or comparisons have improved the observation's meaning.
3. **Confirmed or corrected** - the gardener has confirmed the wording, supplied a correction or identified that they cannot determine it.
4. **Used in reasoning** - the observation has been considered with approved knowledge and relevant context.
5. **Recorded in history** - the observation and its relationship to later decisions or outcomes are preserved in the correct Garden Journal.

The specification may use different interface wording, but it shall preserve the difference between a proposed observation, a gardener-confirmed observation and a system inference.

# 9. Guided Journey Architecture

## 9.1 Add a Rose

The gardener shall be able to create a separate Bush Rose Profile for each individual bush rose they wish to record. The gardener shall be able to name the rose and record available identity, location, planting and personal information.

Ask Pip shall invite the gardener to begin the rose's visual history with one or more photographs and briefly explain the benefits of doing so. The gardener may continue without supplying a photograph.

If the gardener supplies a photograph of a label, Ask Pip may propose what the visible text appears to say and shall ask the gardener to confirm or correct it before using it as established profile information.

## 9.2 Learn What to Expect

Ask Pip shall retrieve approved knowledge relevant to the known rose and its context. It shall distinguish general bush-rose knowledge from cultivar-specific information and shall not imply that unavailable or unconfirmed cultivar information is known.

## 9.3 Complete a Guided Observation

Ask Pip shall present a bounded set of questions that helps the gardener describe a relevant plant feature, change or concern.

Questions shall be chosen to improve the usefulness of the observation. The interface shall permit the gardener to state that they cannot determine an answer.

Where a photograph would strengthen the record, support later comparison or provide useful evidence, Ask Pip shall invite the gardener to add one or more suitable views and explain what to photograph and why. Declining or being unable to add a photograph shall not end the guided observation.

## 9.4 Understand Possibilities and Uncertainty

Ask Pip shall explain what the recorded observations may support, what they do not establish and what further evidence may help.

## 9.5 Record a Decision or Defer Action

The gardener shall be able to record a chosen action, a decision to continue observing, a decision to seek expert help or a decision not to act.

## 9.6 Receive Follow-Up Guidance

Ask Pip shall create a relevant continuation point and return to the earlier observation or decision with its context intact.

## 9.7 Record the Outcome

The gardener shall be able to record what changed and whether a planned action was completed. The result, including any supplied follow-up photographs, shall be linked to the earlier observation, guidance and decision in the correct Garden Journal.

# 10. Knowledge Curation System Relationship

The Knowledge Curation System (KCS) shall remain responsible for the governed preparation, approval and publication of knowledge for operational use.

The MVP product shall consume approved operational knowledge. It shall not:

- treat unapproved draft research as operational knowledge;
- create Founder-approved knowledge through ordinary user interaction;
- overwrite the source knowledge record when applying it to an individual rose; or
- conceal when required operational knowledge is unavailable.

The MVP specification shall identify the minimum approved bush-rose knowledge required for the selected guided journey before that journey is represented as operationally supported.

Gardener observations, photographs and outcomes may create useful records for the gardener and may support future authorised research or capability development. They shall not become approved general horticultural knowledge automatically, and storage for the gardener's service shall not itself authorise any secondary use.

# 11. Image Capabilities

## 11.1 First-MVP Image Capability

The first MVP may use photographs to:

- create and continue a visual history;
- preserve evidence supplied by the gardener;
- support human comparison and review;
- record before-and-after sequences;
- capture visible label or record information; and
- propose text transcriptions for gardener confirmation.

The availability of these uses does not mean that Ask Pip can diagnose the plant, determine its health or identify its cultivar from physical appearance.

## 11.2 Future Plant-Image Analysis

Future plant-image analysis shall connect to the architecture at the evidence and structured-observation layers.

It may:

- examine a photograph already retained as evidence;
- propose one or more structured observations;
- identify the region of the photograph supporting a proposal;
- record confidence and limitations; and
- ask the gardener to confirm, correct or reject the proposal.

It shall not automatically:

- convert a proposed visual observation into an established fact;
- treat `not visible` as `absent`;
- combine detection, interpretation, diagnosis and guidance into an untraceable result;
- overwrite the gardener's report;
- bypass approved operational knowledge; or
- make the rest of Ask Pip unavailable when photographic analysis is inconclusive or unavailable.

The same reasoning, guidance, Garden Journal and follow-up processes used by gardener-reported observations shall remain available to confirmed photograph-derived observations.

Photographs retained before this capability becomes available shall be capable of later authorised analysis without requiring the gardener to rebuild the Bush Rose Profile or Garden Journal. Any later analysis shall be recorded as a new traceable interpretation and shall not alter the original photograph, the gardener's original report or the historical record of guidance previously given.

# 12. Required Safeguards

The implementable specification shall preserve the following safeguards:

- **Profile separation:** records, photographs and events remain linked to the correct individual rose.
- **Source traceability:** material observations identify where they came from.
- **Evidence linkage:** supporting answers, records or photographs remain linked where applicable.
- **Voluntary photography:** the product encourages and explains photographic capture without making it a condition of participation.
- **Photographic integrity:** original photographs, contextual data and later interpretations remain distinguishable.
- **Confirmation of extracted information:** proposed label or text readings require gardener confirmation or correction before becoming established profile information.
- **Capability clarity:** label reading is not represented as cultivar recognition, plant assessment or diagnosis.
- **Human correction:** the gardener can correct their report, an extracted value and any future machine proposal.
- **Uncertainty integrity:** absence of evidence, inability to determine and conflicting information remain expressible.
- **Knowledge authority:** reasoning uses only knowledge authorised for operational use.
- **Decision integrity:** offered guidance is not treated as a gardener decision or completed action.
- **Historical continuity:** follow-up and outcomes remain linked to earlier events.
- **Provider adaptability:** the governed product can use suitable artificial-intelligence and image capabilities without making one external provider the permanent identity or exclusive operating foundation of Pip.

# 13. Relationship to Marie's Story

*Marie's Story* remains the approved long-term foundational narrative of the Ask Pip experience.

The first MVP shall preserve the narrative's enduring purpose:

- help the gardener understand each individual plant;
- explain why information or guidance matters;
- encourage observation before action;
- preserve each plant's continuing story;
- communicate uncertainty honestly; and
- strengthen rather than replace the gardener's judgement.

Capabilities in *Marie's Story* that depend on automated plant-image interpretation, diagnosis, structural assessment or pruning overlays are longer-term capabilities and are outside the first MVP boundary unless separately validated, specified and approved.

# 14. Specification Handoff

After Founder approval of this architecture, the next controlled document shall be an implementable MVP specification.

The specification shall define at least:

- the single guided-care journey selected for implementation;
- creation, selection and management of multiple Bush Rose Profiles;
- user interactions and interface states;
- required data fields and validation rules;
- photograph capture, metadata, linkage, storage and retrieval behaviour;
- label-reading and gardener-confirmation behaviour;
- the observation vocabulary and source states;
- required knowledge retrieval and traceability behaviour;
- reasoning and uncertainty outputs;
- Garden Journal entry types and relationships;
- decision, action, follow-up and outcome states;
- acceptance criteria for the complete journey;
- failure, unavailable-information and expert-referral behaviours;
- provider-adaptation boundaries; and
- the boundary between implemented MVP behaviour and deferred capabilities.

The specification shall not commence software development or approve technology choices unless the Founders separately authorise those actions.

# 15. Decisions Required Before CORE Integration

The Founders must determine:

1. the approved version for this architecture document;
2. its permanent PIP CORE location;
3. whether the proposed source categories and observation lifecycle accurately express the approved product direction;
4. which single guided-care journey the implementable specification shall develop first; and
5. whether any amendment is required before the document enters Founder review.

---

# End of Document

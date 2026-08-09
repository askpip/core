# Ask Pip MVP – Bush Rose V1 Architecture

## Document Metadata

**Document Title:** Ask Pip MVP – Bush Rose V1 Architecture  
**Document Type:** Architecture Document  
**Version:** 1.0  
**Status:** Draft  
**Owner:** The Founders  
**Last Updated:** 9 August 2026  
**Working Location:** `Working/Drafts/Architecture/Ask_Pip_MVP_Bush_Rose_V1_Architecture.md`  
**Proposed Permanent Location:** `Architecture/Ask_Pip_MVP_Bush_Rose_V1_Architecture.md`  
**Purpose:** To define the bounded first implementation of Ask Pip: assisted-photo dormant-bush-rose pruning that creates an individual plant history and supports one meaningful follow-up.  
**Related Documents:** `Foundations/Maries_Story.md`; `Working/Drafts/Foundations/AskPIP_Vision_Statement.md`; `Working/Drafts/Architecture/Ask_Pip_MVP_Bush_Rose_V1_First_Guided_Care_Journey.md`

---

# 1. Purpose

This document defines the first bounded minimum viable product (MVP) implementation of Ask Pip.

The MVP shall test whether Pip can help a beginner examine an established bush rose, understand supported pruning choices, decide safely what to cut or leave and learn from the plant's response. Assisted photo interpretation shall help the gardener recognise possible features by comparing their photographs with approved reference material.

The same interaction shall begin the rose's continuing history automatically. When the gardener returns, Pip shall use the recorded session and photographs to support follow-up.

This architecture defines product boundaries and information relationships. It does not select technologies, artificial-intelligence models, providers or detailed implementation methods.

# 2. Product Hypothesis

The MVP tests two connected claims:

1. Pip can help a beginner make or defer supported bush-rose pruning decisions with greater understanding by combining assisted photo interpretation, approved comparisons and gardener confirmation.
2. The record created during that experience makes Pip more personal and useful when the gardener returns.

The gardener shall not maintain a separate journal. Photographs, interpretations, comparisons, confirmations, decisions, actions and outcomes created through the journey shall form the rose's history automatically.

# 3. Required Journey

For one established bush rose, the gardener shall be able to:

1. create a minimal Bush Rose Profile;
2. record contextual information and baseline photographs;
3. establish whether locally appropriate pruning may proceed;
4. receive proposed photo observations with uncertainty stated;
5. compare those proposals with approved reference material;
6. examine the actual rose and confirm or correct each relevant observation;
7. consider a bounded pruning plan;
8. choose **Cut**, **Leave**, **Decide later** or **Get experienced local help**;
9. confirm the intended stem on the physical rose before every cut;
10. save a correctable session history, including the exact approved comparisons used; and
11. return for one event-based follow-up that compares new evidence with the earlier session.

# 4. Product Principles

## 4.1 Guided Visual Understanding

Pip shall ask one clear question at a time, explain unfamiliar terms and provide beginner-appropriate approved comparisons.

An authorised vision capability may identify and highlight possible visible features in the gardener's photographs. Each interpretation shall be presented as a proposed observation with appropriate uncertainty, not as an established fact, diagnosis or autonomous pruning decision.

## 4.2 Gardener Confirmation and Control

The gardener remains the primary observer and decision-maker. The gardener shall examine the physical rose and confirm the relevant condition. Before every cut, the gardener shall identify and confirm the intended stem on the actual rose.

If photographs are inadequate, interpretation remains uncertain, the gardener cannot confirm the observation, or the situation falls outside approved knowledge, Pip shall request better evidence, defer the choice or recommend experienced local help.

## 4.3 Approved Comparison Material

Every supported observation shall have at least one approved beginner-appropriate comparison. Each reference shall identify:

- the feature demonstrated;
- viewpoint, scale and visible context;
- relevant rose, seasonal and growth-stage context;
- common lookalikes;
- limitations on what the image can establish; and
- source, verification, version and approval status.

The session shall retain a reference to the exact approved comparison used. It need not duplicate the library image.

## 4.4 Individual Plant Memory and Automatic History

The history shall preserve the gardener's photographs, Pip's interpretations, approved comparisons, gardener confirmations or corrections, choices, completed actions and reported outcomes as separate records.

Pip shall use that history for the gardener's future understanding of the same plant. Any later use of user records for collective learning, model training or general guidance requires separate consent, privacy controls, validation and knowledge governance.

## 4.5 Approved Knowledge and Honest Uncertainty

Operational pruning and safety guidance shall use Founder-approved horticultural knowledge. Pip shall distinguish evidence, interpretation, confirmation, guidance, decision and outcome, and shall state material uncertainty honestly.

# 5. First-MVP Boundary

## 5.1 Supported Rose Scope

The journey supports an established bush rose that appears suitable for locally appropriate pruning, is safely accessible and is not evidently outside approved boundaries because of recent planting, severe stress, major damage, significant disease, unsuitable timing or another unsupported condition.

The gardener supplies location, seasonal context, known rose information and photographs. Pip may interpret photographs and retrieve approved comparisons, but the gardener confirms the relevant physical condition before guidance proceeds.

## 5.2 Supported Observations

The bounded observation set is:

- dead versus living wood;
- damaged growth;
- crossing or rubbing stems;
- inward-growing stems;
- weak or congested growth; and
- the main framework to retain.

Pip may propose these observations from photographs. The gardener confirms them on the actual rose.

## 5.3 Supported Choices

For every supported observation, the available outcomes are:

- **Cut**
- **Leave**
- **Decide later**
- **Get experienced local help**

Pip may propose a plan from interpreted photographs, gardener-confirmed observations and approved rules. More than one option may be presented where horticulturally acceptable.

## 5.4 Suitability and Safety Areas

Before pruning guidance proceeds, the journey shall address:

- supported rose type;
- location and seasonal context;
- dormancy or active growth;
- recent planting;
- visible stress, damage or disease;
- clean and sharp secateurs;
- suitable personal protection;
- safe access and working conditions; and
- adequate photographs and confidence in confirmed observations.

Exact questions, acceptable answers and stopping thresholds shall be developed from approved horticultural and safety knowledge.

## 5.5 Deferred

The MVP defers:

- autonomous image diagnosis;
- cultivar identification from appearance;
- authorising a cut from an image alone;
- black-spot care;
- multiple plant types;
- a complete Garden Journal;
- general plant questions;
- automated cut-by-cut overlays;
- collective learning from user records; and
- complex reminder infrastructure.

# 6. Minimum Information Model

## 6.1 Bush Rose Profile

The profile shall hold the chosen name, optional personal meaning, known rose information and source, location and planting context, selected photographs, and links to the pruning session and follow-up.

## 6.2 Photo Evidence and Interpretation

For each relevant photograph, preserve:

- the original image and purpose;
- image-quality assessment;
- proposed machine-visible features and uncertainty;
- the exact approved reference retrieved;
- the gardener's confirmation, correction or unresolved response; and
- the resulting supported decision.

## 6.3 Pruning Session

Preserve suitability context, confirmed observations, explanations, choices, planned and completed actions, deferrals, safety boundaries, photographs and a correctable summary.

## 6.4 Follow-Up

Follow-up timing shall be event-based and locally adjustable using the pruning date, location, season, weather context and approved rules. The gardener may accept, change or decline the proposed window.

Preserve comparable photographs, new shoots or buds, apparent dieback or damage, overall structure and response, unexpected symptoms, the gardener's expectations, comparisons with the earlier record, and any resulting next step.

# 7. Comparison Presentation

Comparison material shall use clear overview and close-up images, highlight the relevant feature, explain it in plain language, provide accessible labels and alternative text, show common lookalikes where relevant, and explain what the image cannot establish.

The interface shall distinguish the gardener's image, Pip's proposed interpretation and the approved reference.

# 8. Validation

The prototype shall measure:

- journey completion;
- whether proposed photo observations are confirmed, corrected or unresolved;
- ability to identify relevant structures;
- understanding of reasons for choices;
- appropriate use of all four outcomes;
- safety deferrals and requests for better evidence;
- usefulness of approved comparisons;
- usefulness of automatic history and remembered context;
- willingness to return; and
- preference against written guidance or a general AI conversation.

Horticultural and safety experts shall first define unacceptable errors. Moderated testing shall establish a baseline before numerical thresholds are set. Every unsafe recommendation, unsupported certainty or failure to defer shall be reviewed individually. Photo interpretation shall be measured separately from the gardener-confirmed final decision.

# 9. Acceptance Criteria

The MVP is demonstrated when the complete bounded journey operates as described, records each evidence and decision layer truthfully, provides all four outcomes, prevents an image-only cut decision, creates a correctable plant history and supports one meaningful follow-up using the earlier record accurately.

# 10. Knowledge Dependency

Before gardener testing, approved operational knowledge must cover bush-rose pruning, supported observations, timing and local suitability, stress, damage and disease deferrals, tool and personal safety, comparison images and lookalikes, uncertainty, and experienced-help conditions.

Horticultural experts develop and verify this material. The Founders approve it through the governed Knowledge Curation System before it becomes operational guidance.

# 11. Alignment

This MVP implements the Ask Pip vision by helping the gardener understand an individual plant, preserving its story and using remembered context during follow-up.

Its shared product boundary with the First Guided-Care Journey is:

> A guided bush-rose pruning journey using assisted photo interpretation, approved comparison material, gardener confirmation, governed horticultural rules, automatic plant history and one meaningful follow-up. Pip may propose observations but does not independently diagnose the rose or authorise a cut from an image alone.

---

# End of Document

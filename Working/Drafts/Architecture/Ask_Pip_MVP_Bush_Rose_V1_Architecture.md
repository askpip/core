# Ask Pip MVP – Bush Rose V1 Architecture

## Document Metadata

**Document Title:** Ask Pip MVP – Bush Rose V1 Architecture  
**Document Type:** Architecture Document  
**Version:** Unassigned - Founder decision required  
**Status:** Draft  
**Owner:** The Founders  
**Last Updated:** 9 August 2026  
**Working Location:** `Working/Drafts/Architecture/Ask_Pip_MVP_Bush_Rose_V1_Architecture.md`  
**Proposed Permanent Location:** Founder decision required  
**Purpose:** To define the bounded first implementation of Ask Pip: guided dormant-bush-rose pruning that naturally creates an individual plant history and supports one meaningful follow-up.  
**Authority Source:** Founder-approved direction to use dormant-bush-rose pruning as Ask Pip's first task and automatic plant history as the beginning of the continuing companion relationship.  
**Related Documents:** `Foundations/AskPIP_Vision_Statement.md`; `Foundations/Maries_Story.md`; `Working/Drafts/Foundations/AskPIP_Vision_Statement.md`; `Working/Drafts/Architecture/Ask_Pip_MVP_Bush_Rose_V1_First_Guided_Care_Journey.md`

---

# 1. Purpose

This document defines the first bounded minimum viable product (MVP) implementation of Ask Pip.

The first implementation shall test whether Pip can help a beginner examine an existing dormant bush rose, understand supported pruning choices, decide safely what to cut or leave and learn from the plant's response.

The same useful interaction shall begin the rose's continuing history automatically. When the gardener returns, Pip shall remember the recorded session and use it to support the follow-up.

This architecture defines the product boundary and required information relationships. It does not select software technologies, artificial-intelligence models, providers or detailed implementation methods.

# 2. Product Hypothesis

The first MVP shall test two connected claims:

1. Pip can help a beginner make or defer supported dormant-bush-rose pruning decisions with greater understanding.
2. The record created during that useful experience makes Pip more personal and valuable when the gardener returns.

Pruning is the immediate reason to use Ask Pip. The individual plant history provides continuity after the task.

The gardener shall not be asked to maintain a journal as a separate activity. Photographs, observations, explanations, decisions, actions and outcomes created through the pruning journey shall form the rose's history automatically.

# 3. Required Journey

For one existing dormant bush rose, the gardener shall be able to:

1. create a minimal Bush Rose Profile;
2. record a baseline photograph and the context required to assess pruning suitability;
3. understand why, when and how dormant bush roses are pruned;
4. confirm whether the supported pruning journey is appropriate for this rose now;
5. examine the rose through guided observation and verified comparison material;
6. consider a bounded set of supported pruning choices;
7. choose to cut, leave, defer or seek experienced help;
8. record planned, completed and deferred actions;
9. save an automatic pruning-session summary with before-and-after photographs where supplied;
10. return for one follow-up that refers to the earlier session; and
11. record the rose's response and the gardener's reported outcome.

The journey shall support direct entry by a gardener who needs pruning help now. It shall not require an earlier care episode, simulated chronology or pre-existing Garden Journal.

# 4. Product Principles

## 4.1 Guided Understanding

Pip shall ask one clear question at a time, explain unfamiliar terms and provide verified comparison material where it is needed to help a beginner observe the actual rose.

The experience shall explain the reason for each supported choice. It shall help the gardener understand the plant rather than merely issue instructions.

## 4.2 Gardener Confirmation and Control

The gardener remains the primary observer and decision-maker.

Before every cut, the gardener shall identify and confirm the relevant structure on the actual rose. Pip shall not infer a safe cut from an uninterpreted photograph.

Where the structure, timing, plant context or safe working conditions cannot be established, Pip shall support leaving the cane alone, deferring the choice or seeking experienced help.

## 4.3 Individual Plant Memory

Pip shall remember information recorded about the individual rose and use relevant history when the gardener returns.

The product shall distinguish this personal memory from general platform learning. User records shall not automatically become trusted horticultural knowledge, model-training material or general research data. Any later use beyond the gardener's own service requires appropriate consent, privacy controls and governed validation.

## 4.4 Automatic History

The plant history shall be created as a by-product of useful interaction.

The gardener shall not need to repeat information already captured during the session. The history shall preserve what was observed, explained, decided, completed, deferred and later reported.

## 4.5 Honest Evidence and Uncertainty

Evidence, gardener-confirmed observations, reasoning, guidance, decisions, actions and outcomes shall remain distinguishable.

An uploaded photograph shall remain evidence. Unless it has been interpreted through an authorised capability and confirmed where required, it shall not be treated as proof of a condition or safe cut.

Pip shall state material limitations and uncertainty. It shall request more information, limit guidance, defer or recommend experienced assistance when the available information does not support proceeding.

## 4.6 Approved Knowledge

Pip shall use only horticultural knowledge authorised for operational use by the Plant Intelligence Platform (PIP). Material guidance shall retain sufficient reference to identify the operational knowledge used.

# 5. First-MVP Boundary

## 5.1 Included

The first MVP shall include:

- one gardener and one individual Bush Rose Profile;
- the gardener's chosen rose name and optional personal meaning;
- minimal location, season, rose-type and recent-condition context needed for pruning suitability;
- optional baseline, structural, after-pruning and follow-up photographs;
- manual entry of any relevant label or cultivar information;
- pruning suitability and safe-preparation checks;
- guided observation of a limited, approved set of structural conditions;
- verified reference illustrations or comparisons needed by beginners;
- explanations of how, why and when supported pruning choices apply;
- cut, leave, defer and seek-help choices;
- a simple pruning plan;
- confirmation of completed and deferred actions;
- an automatically generated session history and plain-language summary;
- one optional follow-up prompt or reminder linked to the pruning session;
- a follow-up that compares the gardener's new report with the earlier session; and
- a short measure of understanding, confidence and willingness to return.

## 5.2 Deferred

The first MVP shall defer:

- black-spot assessment and care;
- a complete year-long journey;
- multiple plant types;
- a complete multi-plant Garden Journal experience;
- general plant questions;
- automated diagnosis from photographs;
- cultivar identification from plant appearance;
- automated pruning overlays or cut-by-cut image instructions;
- automated label transcription as a required capability;
- complex reminder or notification infrastructure;
- multiple Care Plan types;
- collective learning from user records;
- provider-switching abstractions beyond preserving the gardener's records in provider-independent product data; and
- evidence, reasoning or audit structures beyond those required to preserve the pruning journey truthfully.

These are possible later capabilities, not commitments of the first MVP.

# 6. Minimum Information Model

## 6.1 Bush Rose Profile

The Bush Rose Profile shall hold:

- the rose's chosen name;
- optional personal meaning;
- known rose-type, cultivar or label information and its source;
- relevant location and planting context;
- selected photographs; and
- links to its pruning session and follow-up.

## 6.2 Pruning Session

The pruning session shall preserve:

- the rose and gardener concerned;
- timing and pruning-suitability context;
- gardener-confirmed observations;
- photographs and their stated purpose;
- explanations and choices presented;
- the gardener's planned, completed, left and deferred choices;
- reasons recorded for material choices;
- safety or uncertainty boundaries encountered; and
- a session summary.

## 6.3 Follow-Up

The follow-up shall preserve:

- the earlier pruning session being reviewed;
- the reason and timing for returning;
- what the gardener is asked to observe or photograph;
- the gardener's reported response of the rose;
- any comparison with the earlier record;
- the resulting guidance or next step; and
- the gardener's assessment of whether Pip's memory and guidance were useful.

## 6.4 Photographs

Photographs shall remain linked to the correct rose and event. The record shall distinguish baseline, structural, after-pruning and follow-up purposes; retain the original image wherever practical; and keep any later human or machine interpretation separate from the original.

Photograph capture is encouraged because it strengthens comparison and continuity, but absence of a photograph shall not by itself prevent a journey that can otherwise proceed safely from gardener-confirmed observations.

# 7. Safety and Guidance Boundary

Before pruning guidance proceeds, Ask Pip shall establish the supported rose type, appropriate timing, relevant plant condition and safe working context to the degree required by approved operational knowledge.

The first journey shall be limited to pruning choices approved for this bounded implementation. It shall not claim that every rose, cane or pruning situation can be resolved.

Pip shall stop or defer the affected choice when:

- the rose is outside the supported type or condition;
- pruning timing is inappropriate or materially uncertain;
- the gardener cannot identify or trace the relevant structure;
- the observation does not support the proposed choice;
- safe access, equipment or working conditions are absent; or
- the situation falls outside approved operational knowledge.

# 8. Validation Measures

The prototype shall collect enough evidence to determine:

- whether beginners can complete the supported journey;
- where they become unable to identify the requested structure;
- whether they understand the reason for their choices;
- whether they use cut, leave, defer and seek-help options appropriately;
- whether the automatic history feels useful rather than burdensome;
- whether Pip's reference to the earlier session makes the follow-up feel personal and continuous;
- whether users would return with the same rose, another plant or another care question; and
- whether they prefer the experience to ordinary written guidance or a general artificial-intelligence conversation.

These measures test the product hypothesis. They do not by themselves establish commercial viability or horticultural safety for unrestricted public release.

# 9. Initial MVP Acceptance Criteria

The first implementation is demonstrated when:

1. A gardener can create one individual Bush Rose Profile and start the pruning journey without prior history.
2. Ask Pip can establish whether the supported dormant-pruning journey is appropriate for the rose and local context or explain why it should be deferred.
3. The gardener can examine a bounded set of structural conditions through guided questions and verified comparison material.
4. Pip explains how, why and when each supported choice may apply.
5. The gardener confirms the relevant structure on the actual rose before every cut and remains the decision-maker.
6. Cut, leave, defer and seek-help choices are available and recorded truthfully.
7. The product does not infer a safe cut from an uninterpreted photograph or proceed when the required structure cannot be confirmed.
8. The useful interaction automatically creates a session history containing the relevant observations, explanations, decisions, actions and photographs.
9. The gardener can return for one linked follow-up, and Pip refers accurately to the earlier session.
10. The follow-up records the rose's reported response and whether the gardener found the remembered context useful.

# 10. Founder Review Decisions

Before this Draft becomes an approved input to an implementable specification, the Founders shall determine:

1. the exact pruning conditions and choices supported by the first journey;
2. the required verified comparison material;
3. the follow-up timing and outcome questions;
4. the success thresholds for prototype validation;
5. the approved version; and
6. the permanent PIP CORE location.

---

# End of Document

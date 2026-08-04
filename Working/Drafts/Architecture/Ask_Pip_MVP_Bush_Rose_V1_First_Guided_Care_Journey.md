# Ask Pip MVP – Bush Rose V1 First Guided-Care Journey

## Document Metadata

**Document Title:** Ask Pip MVP – Bush Rose V1 First Guided-Care Journey  
**Document Type:** Product Journey Working Draft  
**Version:** Unassigned – Founder decision required  
**Status:** Draft  
**Owner:** The Founders  
**Last Updated:** 4 August 2026  
**Purpose:** To define the first bounded guided-care journey for the Ask Pip minimum viable product (MVP), using Marie's reported leaf concern as the scenario while remaining fully operable without photographic recognition or interpretation.  
**Authority Source:** Founder instruction selecting a journey based on *Marie's Story*, altered for the current MVP without photographic recognition  
**Related Documents:** `Foundations/Maries_Story.md`; `Working/Drafts/Architecture/Ask_Pip_MVP_Bush_Rose_V1_Architecture.md`

---

# 1. Purpose

This document selects and defines the first bounded guided-care journey for the Ask Pip MVP:

**A gardener reports a visible change affecting the leaves of an individual bush rose.**

The journey adapts the leaf-spot concern in *Marie's Story* to the current MVP boundary. It preserves the narrative's enduring purpose—helping the gardener observe, understand uncertainty, make an informed decision and learn from the outcome—without asking an artificial-intelligence system to recognise, assess or diagnose the plant from photographs.

The journey is a product and interaction draft. It does not supply horticultural rules, approve operational knowledge or commence software implementation.

# 2. Journey Decision

The first guided-care journey is:

**Reported leaf concern with guided observation and follow-up.**

In the reference scenario:

- Marie has an individual Bush Rose Profile for **Sarah's Rose**;
- Marie notices marks or spots on some leaves;
- Marie reports the concern in her own words;
- Ask Pip guides her through structured, answerable questions;
- Ask Pip uses Marie-confirmed observations and approved operational knowledge to explain supported possibilities and limitations;
- Marie records a decision or defers action;
- Ask Pip creates a continuation point;
- Marie returns to report what changed; and
- the outcome is linked to the original concern in Sarah's Rose's history.

The MVP shall not represent this journey as photographic diagnosis. It shall also remain usable when no photograph is supplied.

# 3. Intended Outcome

The journey shall demonstrate that Ask Pip can:

1. continue from the correct individual Plant Profile;
2. turn a gardener's concern into structured, source-traceable observations;
3. explain why each material question is being asked;
4. distinguish the gardener's report from system reasoning;
5. apply only approved operational knowledge;
6. communicate possibilities, limitations and uncertainty honestly;
7. help the gardener choose an available next step or defer action;
8. preserve the decision separately from any later completed action;
9. return to the same concern for follow-up; and
10. record the outcome as part of the plant's continuing history.

Success does not require Ask Pip to determine what appears in a photograph.

# 4. Preconditions and Entry Routes

## 4.1 Existing Profile Route

The normal reference route begins with Sarah's Rose already recorded as a Bush Rose Profile within Marie's Garden Journal.

The profile may contain gardener-supplied information such as:

- the gardener's chosen name;
- confirmed cultivar or label information, if known;
- location and planting context;
- the personal reason the rose matters;
- earlier observations, actions and outcomes; and
- optional photographs retained as historical records.

Ask Pip shall not imply that any profile fact is known when it is missing or unconfirmed.

## 4.2 No Existing Profile Route

If the gardener begins without a Bush Rose Profile, Ask Pip shall support a short setup path before the concern is recorded.

The gardener shall be able to:

1. create a profile for one individual rose;
2. give it a chosen name;
3. enter known identity, label, cultivar, location and planting information manually;
4. state that information is unknown or unavailable;
5. optionally record why the rose matters; and
6. continue directly into the reported-concern journey.

Photography and label reading shall not be required for setup or continuation.

# 5. Capability Boundary

## 5.1 No Photographic Recognition

During this journey, Ask Pip shall not:

- inspect a photograph to identify spots, colours, patterns, insects, damage or plant structures;
- confirm that a gardener-reported feature is visible in a photograph;
- infer a disease, pest, deficiency, cultivar or overall-health state from appearance;
- compare photographs to determine what changed;
- annotate or highlight suspected affected areas;
- convert a supplied photograph into a structured plant observation; or
- increase confidence because of machine interpretation of an image.

Ask Pip shall not use phrases such as:

- “I can see the spotting”;
- “your photograph confirms”;
- “the image shows”;
- “based on what I can see”; or
- “I have analysed the plant.”

## 5.2 Optional Photographic Record

The gardener may voluntarily attach photographs to preserve a visual record for personal comparison, later human review or future authorised capabilities.

If photographs are offered, Ask Pip shall explain that:

- they are being stored as gardener-supplied evidence and history;
- the current MVP will not interpret their plant content;
- the gardener's own answers provide the observations used in this journey; and
- not supplying photographs will not restrict the journey.

The original photograph, the gardener's description and any later interpretation shall remain distinguishable.

## 5.3 No Label-Reading Dependency

All profile and label information shall be enterable manually. Optional label reading is not part of this first guided-care journey and shall not be required by its acceptance criteria.

# 6. End-to-End Journey

## 6.1 Stage 1 – Marie Reports the Concern

Marie opens Sarah's Rose and writes in ordinary language:

> “I've noticed black spots on some of the leaves of Sarah's Rose.”

Ask Pip acknowledges the report without confirming its visual accuracy or naming a cause:

> “Let's record what you've noticed and work through a few questions. Your answers will help us understand what the observation supports, what remains uncertain and what to do next.”

Ask Pip creates a concern record linked to Sarah's Rose. The original gardener wording is preserved as evidence.

At this point:

- the source is **gardener-reported**;
- the concern is not a diagnosis;
- the marks are not treated as photograph-verified; and
- no action is assumed.

## 6.2 Stage 2 – Ask Pip Clarifies the Observation

Ask Pip asks a bounded sequence of questions selected from approved operational knowledge for the reported concern.

The question set shall:

- use everyday language;
- explain unfamiliar terms;
- ask only one clear thing at a time where practical;
- allow **I can't tell**, **I'm not sure** and **I haven't checked**;
- avoid forcing an answer;
- explain why a material question matters; and
- avoid implying that Ask Pip already knows what the rose looks like.

The implementable specification shall define the exact approved question set. The journey shall be able to capture categories such as:

- when Marie first noticed the change;
- whether she reports it on one leaf, a few leaves or many leaves;
- which part of the rose she reports as affected;
- how Marie describes the marks;
- whether she reports yellowing, leaf loss or another accompanying change;
- whether she reports a change in new growth;
- whether the concern appears unchanged, increasing or decreasing;
- relevant recent care or environmental context that Marie knows; and
- anything Marie cannot determine.

Each answer remains attributable to Marie. Ask Pip presents a concise proposed observation summary and asks her to confirm or correct it.

Example:

> “You reported dark marks on a few leaves, first noticed today. You are not sure whether any new leaves are affected. Is that an accurate record of what you observed?”

Only after Marie confirms or corrects the summary does it become a gardener-confirmed observation.

## 6.3 Stage 3 – Optional Evidence Invitation

Ask Pip may offer:

> “You can add a photograph to Sarah's Rose's history if you would like a visual record for later comparison. I won't assess the photograph in this version, and you can continue without one.”

If Marie adds a photograph, she may describe what it is intended to record. Ask Pip stores it with the concern but does not interpret it.

If Marie declines, the journey continues unchanged.

## 6.4 Stage 4 – Ask Pip Explains Possibilities and Uncertainty

Ask Pip evaluates the gardener-confirmed observations against approved operational knowledge.

Its response shall distinguish:

- what Marie reported;
- which possibilities the approved knowledge supports considering;
- what the available information does not establish;
- which missing or uncertain observation limits the reasoning;
- what Marie could observe next;
- whether the current information supports guidance, continued observation or expert assistance; and
- the knowledge source used for material guidance.

Ask Pip shall not state that Sarah's Rose has black spot unless the applicable approved knowledge and specified reasoning rules support that conclusion from the permitted non-photographic evidence. If the evidence supports only possibilities, Ask Pip shall say so.

A suitable interaction form is:

> “Your answers are consistent with more than one possible cause. They do not establish a diagnosis. The most useful next step is to observe whether the reported marks spread, whether yellowing develops and whether new leaves become affected. You can record an action now, continue observing or seek expert help.”

The exact possibilities, safety thresholds, escalation conditions, confidence language and horticultural advice shall come from approved operational knowledge and the implementable specification, not from this journey document.

## 6.5 Stage 5 – Marie Decides or Defers

Ask Pip presents only options supported by approved operational knowledge for the current information state.

Marie can record:

- a supported care action she chooses;
- a decision to continue observing before acting;
- a decision to seek expert help;
- a decision not to act; or
- that she is not ready to decide.

The record shall keep separate:

- guidance Ask Pip offered;
- Marie's decision;
- an action Marie plans;
- an action Marie later reports as completed; and
- an outcome observed later.

For the reference path, Marie chooses to continue observing before treatment because the cause has not been established.

Ask Pip confirms the decision without claiming an action occurred:

> “I've recorded that you chose to continue observing Sarah's Rose before deciding on treatment.”

## 6.6 Stage 6 – Ask Pip Creates a Follow-Up

Ask Pip creates a continuation point linked to the same concern.

The follow-up shall state:

- why Marie is returning;
- what earlier observation or decision is being reviewed;
- what she is being asked to check;
- the approved timing or condition for returning;
- that she may return sooner if an approved escalation condition occurs; and
- that photographs remain optional and uninterpreted.

Any interval or escalation condition shall be determined by approved operational knowledge and the implementable specification. This journey shall not invent them.

The reminder or return point opens directly to Sarah's Rose and the existing concern context.

## 6.7 Stage 7 – Marie Reports What Changed

At follow-up, Ask Pip restates the earlier gardener-confirmed observation and asks Marie to compare the plant herself.

Ask Pip may ask:

- whether the marks seem unchanged, increased or decreased;
- whether Marie now reports more or fewer leaves affected;
- whether she reports yellowing, leaf loss or another new change;
- whether new growth appears affected based on her observation;
- whether she completed any planned action; and
- whether she is uncertain about any comparison.

Ask Pip shall not make the comparison from photographs.

Marie reviews the rose and answers. Ask Pip produces a new proposed observation summary for her confirmation or correction. The new observation is linked to, but does not overwrite, the earlier record.

## 6.8 Stage 8 – Updated Reasoning and Next Decision

Ask Pip reasons again using:

- the earlier confirmed observation;
- Marie's follow-up observation;
- relevant known profile context;
- any action Marie reported as completed; and
- approved operational knowledge.

Ask Pip explains what the change over time supports and what remains uncertain. It may:

- continue observation;
- present supported care options;
- limit guidance;
- recommend expert assistance; or
- identify that no further action is currently supported.

The system shall not claim that confidence increased because it compared images. Any change in reasoning must be traceable to Marie's confirmed reports, recorded context and approved knowledge.

Marie records her next decision. If she chooses an action, Ask Pip asks separately whether it is planned or already completed.

## 6.9 Stage 9 – Outcome and Closure or Continuation

At a later continuation point, Marie records:

- whether the chosen action was completed;
- what she now observes;
- whether the concern improved, worsened, remained unchanged or cannot be determined;
- whether further help is needed; and
- any optional note or photograph she wants retained.

Ask Pip links the outcome to:

- the original concern;
- the confirmed observations;
- the reasoning and guidance provided;
- Marie's decision;
- any reported action; and
- the follow-up records.

Ask Pip may close the care cycle only when the specified closure criteria are met. Otherwise, it creates another bounded continuation or recommends appropriate expert assistance.

# 7. Garden Journal Record

The complete journey shall appear within Sarah's Rose's Plant Profile history, not as disconnected conversations.

The linked record shall preserve:

- Marie's original concern in her own words;
- each question and answer material to the observation;
- proposed, corrected and confirmed observation states where material;
- source classification;
- optional photographs as uninterpreted historical evidence;
- knowledge references used for material reasoning;
- possibilities, limitations and uncertainty communicated;
- guidance offered;
- Marie's decision or deferral;
- planned and reported-completed actions as distinct states;
- follow-up timing or condition;
- later observations;
- the resulting outcome; and
- closure, continuation or expert-referral status.

The historical record shall not be rewritten when later information changes the interpretation.

# 8. Failure and Safety Behaviour

The journey shall remain useful when:

- Marie cannot answer a question;
- important profile context is missing;
- approved operational knowledge is unavailable;
- the available observations do not distinguish among supported possibilities;
- Marie does not want to supply a photograph;
- photograph storage is unavailable;
- Marie misses a follow-up;
- Marie returns earlier or later than planned;
- reported information conflicts with an earlier record; or
- the concern falls outside the approved journey scope.

Ask Pip shall respond by stating the limitation, requesting useful information, narrowing or deferring guidance, preserving uncertainty or recommending appropriate expert assistance. It shall not fill a gap with an invented observation or diagnosis.

The implementable specification shall define urgent or safety-sensitive escalation behaviour using approved operational knowledge.

# 9. Acceptance Criteria

The journey is complete for MVP purposes only when all of the following can be demonstrated:

1. A gardener can enter through an existing Bush Rose Profile or create a minimal profile manually.
2. The original concern is preserved as gardener-supplied evidence.
3. Ask Pip captures a bounded set of structured observations without interpreting a photograph.
4. The gardener can answer that they do not know or cannot determine something.
5. The gardener confirms or corrects the proposed observation summary.
6. Every material observation retains its source and confirmation state.
7. Ask Pip uses only approved operational knowledge for reasoning and guidance.
8. Ask Pip distinguishes possibilities from established conclusions.
9. Ask Pip explains material uncertainty and limitations.
10. The gardener can decide, defer, decline action or seek expert help.
11. Guidance, decision, planned action, completed action and outcome remain separate.
12. A follow-up continues from the original concern with its context intact.
13. The gardener performs the follow-up comparison and reports what changed.
14. Ask Pip does not claim to see, recognise, compare, assess or diagnose plant content in a photograph.
15. Photography is optional and its absence does not reduce access to any journey stage.
16. Any supplied photograph is stored only as uninterpreted evidence and history within this MVP journey.
17. The outcome is linked to the earlier observation, guidance, decision and action.
18. The full history remains within the correct individual Bush Rose Profile.
19. Missing knowledge or insufficient evidence produces limitation, deferral or expert-referral behaviour rather than invented certainty.
20. The interaction helps the gardener understand why a question, option or next step matters.

# 10. Deferred Capabilities

This journey does not include:

- photographic plant recognition;
- photograph-derived observations;
- automated image comparison;
- image-based diagnosis or health assessment;
- cultivar inference from appearance;
- label reading;
- annotated photographs or highlighted plant regions;
- structural assessment;
- pruning recommendations or cut overlays; or
- automated determination of treatment success from images.

These capabilities require separate validation, specification and Founder approval.

# 11. Relationship to Marie's Story

This journey preserves the parts of *Marie's Story* that define the intended Ask Pip experience:

- Sarah's Rose is treated as an individual plant with personal meaning;
- Marie begins with uncertainty expressed in her own language;
- Ask Pip asks questions before offering guidance;
- Ask Pip explains why information matters;
- observation precedes action;
- uncertainty is communicated rather than hidden;
- Marie makes the decision;
- the interaction continues through follow-up;
- the outcome becomes part of Sarah's Rose's story; and
- Marie's judgement grows rather than being replaced.

The adaptation deliberately changes the earlier narrative wherever it relied on photographic analysis. Marie observes the rose, compares it over time and confirms what she sees. Ask Pip structures those reports, applies approved knowledge and preserves the reasoning trail.

# 12. Specification Handoff

Before implementation, the controlled MVP specification shall define:

- the exact permitted concern scope;
- the approved question set and branching rules;
- the observation vocabulary and confirmation states;
- the minimum required Bush Rose operational knowledge;
- reasoning and knowledge-traceability rules;
- permitted possibility, confidence and uncertainty language;
- supported guidance and decision options;
- safety and expert-referral thresholds;
- follow-up intervals or conditions;
- closure and continuation criteria;
- required data fields and relationships;
- interface states and failure behaviour; and
- test cases proving the complete journey works without photographic recognition or any photograph.

This journey does not itself approve those implementation details or the operational horticultural content they require.

# 13. Founder Review Decisions

Before this journey can become an approved input to the implementable specification, the Founders shall determine:

1. whether **reported leaf concern with guided observation and follow-up** is approved as the first bounded guided-care journey;
2. whether the scope should remain general to reported leaf marks or be narrowed to a more specific permitted concern;
3. whether the optional photographic-record behaviour should remain in the first journey or be omitted entirely;
4. whether the proposed acceptance criteria express the intended MVP demonstration; and
5. the approved version and permanent PIP CORE location for this document.

---

# End of Document

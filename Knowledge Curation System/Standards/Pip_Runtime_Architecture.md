# Pip Runtime Architecture

---

## Document Metadata

**Document Title:** Pip Runtime Architecture  
**Volume:** Volume VI – Knowledge Curation System  
**Version:** 1.1  
**Status:** Approved  
**Owner:** The Founders  
**Last Updated:** 24 August 2026  
**Approved By:** AskPIP Founder Authority  
**Permanent Location:** `Knowledge Curation System/Standards/Pip_Runtime_Architecture.md`  
**Purpose:** To define how Pip reasons at runtime — what decides the guidance a gardener receives, what perceives and converses on Pip's behalf, and the boundary between the two — so that the PIP Knowledge Record (PKR) Standard and the Knowledge Integration Technician (KIT) can be built against a settled answer rather than an assumed one.  
**Related Documents:** Live Intelligence Library (LIL) Standard; PIP Knowledge Record (PKR) Standard; Mother Information Library (MIL) Standard; PIP Knowledge Integration Workflow; PIP Knowledge Integration Technician (KIT) Charter; `MVP/Architecture/Ask_Pip_MVP_Bush_Rose_V1_Architecture.md`; PIP System Identity and Naming Standard (SINS-001).

---

# 1. Purpose

This Standard settles a question the Bush Rose V1 Architecture deliberately left open: how does Pip actually reason over the Live Intelligence Library (LIL) at runtime?

It exists because that question shapes two things directly — what a PKR must contain, and what the Ask Pip application must be able to render — and both KIT and the application need a fixed answer to build against rather than each independently guessing one.

---

# 2. Scope

This Standard governs Pip's runtime reasoning architecture: the division of authority between what decides Pip's guidance and what perceives, converses and phrases it.

It applies wherever Pip operates, not only within the Bush Rose V1 MVP, and shall remain the governing answer to this question as the LIL grows to cover further plants and topics.

This Standard does not:

- select a specific AI vendor, model or provider — that remains an implementation decision, made and changed independently of this Standard, consistent with PIP CORE's goal that ROC, KIT and Pip each be built from documentation rather than tied to one model;
- define the exact bounded scope of any particular MVP (observations, choices, safety areas) — that is governed by the relevant Architecture and Journey documents;
- alter the field-level structure of the PKR Standard — Section 8 recommends specific extensions to it, but those require their own Founder-approved revision.

---

# 3. Core Principle: Two Layers, Not One

Pip's runtime is built from two layers with different authority. Confusing them is the single failure mode this Standard exists to prevent.

## 3.1 The Decision Layer

The Decision Layer determines what Pip is permitted to tell a gardener. It walks published PKRs and their approved relationships — Observation, Suitability Gate, Decision Logic, Choices — and applies their stated Conditions exactly as KIT built and the Founders approved them.

No AI model reasons within the Decision Layer. It is general-purpose retrieval logic, reviewed once as software engineering, per the PKR Standard §9.1. Given the same confirmed observations and the same published PKRs, it produces the same guidance every time. This is what makes Founder approval of a PKR mean something at runtime, not only at review time.

The Decision Layer is the only source of horticultural content Pip may present as guidance. It never falls back on a model's general training to fill a gap.

## 3.2 The Interface Layer

The Interface Layer perceives and converses. It uses trained AI models for two jobs, and only these two:

- **Perception** — interpreting a gardener's photograph against the Visual Criteria a PKR already states, to propose a candidate match;
- **Conversation** — understanding what a gardener says in their own words, and phrasing Pip's replies in Pip's voice.

The Interface Layer never originates horticultural fact. Everything it perceives is offered as an uncertain proposal; everything it says is built from content the Decision Layer already selected from approved PKRs. A model in this layer may be wrong about what it saw in a photograph or about which approved answer a gardener meant — that is an acceptable, recoverable error, corrected by asking again or deferring. It may never be the source of what counts as true.

## 3.3 Why the Split, Not a Single AI Agent

A single AI agent reasoning freely over the LIL — deciding what applies, combining PKRs on its own judgement, answering from its own training where the LIL is silent — would satisfy nothing this platform was built to guarantee. The LIL Standard's Governance section holds only because the thing walking PKRs is deterministic: "the Founders are not required to read or verify a PKR's underlying stored format in order to approve it... this is what allows Founder approval to remain meaningful even though the Founders are not expected to read code." An agent reasoning live over the same PKRs could combine them in ways no Founder reviewed, or answer two gardeners differently from the same confirmed observation. Splitting perception and conversation out from decision-making keeps Pip capable of feeling alive without ever making that guarantee false.

---

# 4. The Perception Layer in Practice

Where a PKR provides Visual Criteria (an Observation PKR) or reference material (a Comparison Image PKR), an authorised vision capability may propose a candidate match from a gardener's photograph, per the Bush Rose V1 Architecture §4.1.

A perception proposal shall:

- be stated with its uncertainty, never as an established fact, diagnosis or autonomous decision;
- be checked only against the Visual Criteria and comparisons a PKR already states — never against the model's own general visual training about plants;
- require the gardener's confirmation on the physical plant before the Decision Layer treats it as a confirmed observation;
- be measured separately from the correctness of the resulting decision, per the Architecture §8, since a perception error and a decision error are different failures with different fixes.

---

# 5. The Conversational Layer in Practice

## 5.1 Understanding the Gardener

A gardener's input — typed, and in future potentially spoken — need not be limited to selecting a pre-labelled option. The Conversational Layer may accept natural language and map it to the closest Founder-approved answer already defined for that question.

Where the mapping is confident, the Decision Layer proceeds exactly as if the gardener had selected that answer directly. Where it is not confident, Pip shall ask a clarifying question — itself bounded to the approved answer set — rather than guess. Unmapped or ambiguous input shall never be treated as an answer.

## 5.2 Speaking to the Gardener

Pip's replies are built from the content the Decision Layer selected: the fields KIT wrote and the Founders approved on the relevant PKRs. The Conversational Layer may vary phrasing for warmth — for example, choosing between a small Founder-approved pool of connective phrases — but shall not introduce a claim, fact or piece of horticultural content that is not present in the PKR(s) it is drawing from.

Where no phrasing variation is available or warranted, Pip may speak a PKR's plain-language fields directly. This is a legitimate, low-cost default, not a fallback to be embarrassed about.

## 5.3 Confidence and Source Disclosure

*(Added v1.1, 24 August 2026 — see `Working/AI Outputs/Ask_Pip_Confidence_and_Source_Disclosure_Proposal.md` for the proposal this section was adopted from.)*

Where a PKR carries an Evidence Confidence rating and/or Supporting Source(s), the Interface Layer shall make both available to the gardener on request, alongside the guidance itself:

- **Confidence disclosure.** A gardener may request what a shown confidence level means. Pip's response shall be the verbatim Plain-Language Explanation from the matching Definition PKR — never a freely generated explanation, regardless of how well a model might phrase one. Where no Definition PKR exists for a level in use, that is a content gap to raise through the Knowledge Curation System, not a gap for the Interface Layer to fill on its own judgement.
- **Source disclosure.** A gardener may request where a piece of guidance comes from. Pip's response shall list the specific Source PKR(s) supporting the claim or signal in question — not a generic list of everything the wider Observation or Decision Logic PKR cites, where signal-level attribution exists to be more specific.
- Both disclosures draw only from **Published** PKRs — content that is Founder-approved but not yet Published shall not be surfaced through this mechanism, consistent with Section 7's Honesty Boundary.
- Both disclosures are available only where the underlying PKR content actually provides them. An observation with no stated confidence or no Source PKR references shows nothing rather than an invented placeholder — silence is the honest default, per Section 7's Honesty Boundary.

---

# 6. The Decision-Relevant Input Boundary

Any gardener input that the Decision Layer will act on — a Suitability Gate answer, an observation confirmation or correction, a pruning choice — must resolve to a member of a finite, Founder-approved answer set before it reaches the Decision Layer. This applies regardless of whether the gardener arrived at that answer by tapping a button or by typing a sentence the Conversational Layer mapped for them.

This is required because a Decision Logic PKR or Suitability Gate PKR can only define its Conditions against a known set of possible answers, and because Founders can only review every path a decision could take when that set is closed and finite.

Input that the Decision Layer never interprets — a rose's chosen name, an optional note of personal meaning — is exempt from this boundary and may remain free text. Nothing downstream ever reasons over it; it is stored and shown back to the gardener as their own words, not treated as evidence.

---

# 7. The Honesty Boundary

Pip's linguistic range is not bounded — it may understand and respond to many ways of asking about the same thing. Pip's knowledge is bounded strictly to what is currently published in the LIL.

Where a gardener's question or need falls outside published PKRs, Pip shall say so plainly rather than draw on a model's general training to offer a hedged best guess. A confident-sounding answer with a disclaimer attached still reads to a beginner gardener as guidance from the app; it is not made safe by being honestly uncertain about content that was never approved in the first place.

As the LIL's scope grows — additional plants, seasons or topics approved through the Knowledge Curation System — the boundary of what Pip can honestly discuss grows with it. The mechanism does not change: Pip's honesty tracks what has been published, not what an underlying model happens to know.

---

# 8. Consequences for KIT and the PKR Standard

This architecture is only as real as the PKRs KIT builds to support it. It requires the following of PKR content, some of which the PKR Standard already establishes and some of which is a recommended near-term extension to it.

## 8.1 Already Required (PKR Standard, current)

- PKR content is declarative data only, with no field requiring runtime inference to complete — PKR Standard §9.1;
- every Observation PKR names its Linked Decision Logic PKR and Confirmation Requirement, so the Decision Layer has a fixed next step — PKR Standard §5.1;
- every Suitability Gate PKR already defines Acceptable Answer(s) and a Stopping Threshold as a closed set — PKR Standard §5.4.

## 8.2 Recommended Extensions (require their own Founder-approved PKR Standard revision)

- **Closed confirmation responses on the Observation PKR.** §5.1 currently requires a Confirmation Requirement but does not enumerate the response set a gardener can give. This Standard's Decision-Relevant Input Boundary (Section 6) requires one — at minimum Confirmed, Doesn't Match and Not Sure — each with its own routing, consistent with the deferral behaviour the Bush Rose Architecture already assumes.
- **Model-usable Visual Criteria.** An Observation PKR's Visual Criteria must remain readable by a Founder in the Founder Review Rendering, but should also be specific and structured enough to ground the Perception Layer's proposal — not written only as prose for a human reviewer.
- **An approved phrasing pool, where used.** If the Conversational Layer varies connective phrasing per Section 5.2, that pool is itself Founder-approved content and needs a home — either as fields on the relevant PKR or as a small separate governed asset KIT maintains.

## 8.3 Consequence for KIT's Own Charter and Operations Manual

When KIT's Operations Manual is drafted, it should build directly against this Standard: KIT is not just producing records for a generic retrieval system, it is producing the complete, closed, decision-bearing content a deterministic engine will execute exactly as written, with two narrow AI-assisted extensions bolted on the outside. Nothing in a PKR should assume "the model will figure out the rest."

---

# 9. What This Standard Does Not Yet Decide

- the specific vision and language model providers used for the Perception and Conversational Layers;
- the mechanism and governance for an approved phrasing pool, if one is built;
- how far, and on what timeline, spoken (not just typed) gardener input is supported;
- the technical structure of the LIL's runtime store, which remains a technical-architecture decision outside this Standard's scope, per the LIL Standard.

---

# 10. Success Criteria

This architecture is working when:

- a gardener experiences Pip as responsive, perceptive and warm to talk to;
- every fact Pip states traces to a published, Founder-approved PKR;
- no gardener input reaches the Decision Layer without first resolving to a Founder-approved answer;
- Pip states its honesty boundary plainly under natural conversational pressure to guess, rather than quietly borrowing from a model's general training;
- the same confirmed inputs produce the same guidance every time, regardless of how conversationally the gardener arrived at them;
- every confidence rating and source reference a gardener can see traces to its exact Definition PKR or Source PKR text, retrievable on request, never generated fresh (§5.3).

---

# Founding Statement

Pip is AI-powered but not AI-authored. Trained models give Pip the ability to see a photograph and understand a gardener's own words — the capacities that make Pip feel alive to talk to. What Pip is allowed to say about a plant comes from nowhere but the Founders' own approved knowledge, walked by logic reviewed once and never re-improvised. This is what lets Ask Pip be both genuinely conversational and genuinely accountable for what it tells a beginner gardener holding a pair of secateurs.

---

# End of Document

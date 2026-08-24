# Ask Pip – KCS & AI Avatar Architecture Proposal

## Document Metadata

**Document Title:** Ask Pip – KCS & AI Avatar Architecture Proposal
**Document Type:** Draft Planning Document (not a controlled Architecture Document)
**Status:** Draft — for Founder Review
**Prepared By:** Claude, at Shaphan's request
**Date:** 21 August 2026
**Version:** 0.2 — revised after Founder input on Rock, MIL and LIL (21 August 2026)
**Purpose:** To propose a working architecture for the two pieces the Bush Rose V1 MVP currently depends on but does not yet have: the Knowledge Curation System (KCS) content, and the AI capability that makes Pip actually work.
**Source Material Reviewed:** `README.md`, `AGENTS.md`, `CHANGELOG.md`, `Foundations/AskPIP_Vision_Statement.md`, `MVP/Architecture/Ask_Pip_MVP_Bush_Rose_V1_Architecture.md`, `MVP/Journeys/Ask_Pip_MVP_Bush_Rose_V1_First_Guided_Care_Journey.md`, `MVP/Stories/Maries_Story.md`, `AI/PIP_AI_Constitution.md`, `App/src` and `Graphics` directory listings, plus Shaphan's verbal description of Rock, the Mother Information Library (MIL) and the Live Interactive Library (LIL).
**Note:** Rock, MIL and LIL do not yet appear anywhere in the current repository. Section 2 below is my attempt to fold that verbal description into the existing approved Architecture's vocabulary (§6.2/§7). It should be treated as a proposal to formalise, not a record of an existing decision — worth its own short Foundation or Standard document once the Founders are happy with the shape.

---

## 1. What Already Exists

This is worth stating plainly, because it changes what "still have to build" actually means: the product thinking here is well past a rough shell. The Vision Statement, the Bush Rose V1 Architecture, the First Guided-Care Journey, and Marie's Story form a coherent, tightly bounded specification — the six supported observations (dead vs. living wood, damaged growth, crossing/rubbing stems, inward-growing stems, weak/congested growth, main framework), the four choices (Cut / Leave / Decide later / Get experienced local help), and the non-negotiable rule that Pip proposes but never authorises a cut from a photo alone, are all already decided and approved.

The `App/src` folder is a working React/Vite/TypeScript shell: `Journey.tsx` runs the guided flow, `PipAvatar.tsx` and the `assets/pip/` images give Pip a visual presence, `ChatBubble.tsx`/`ResponseBubble.tsx`/`DecisionChoices.tsx` handle the conversation UI. Critically, `data/observationScript.ts` currently drives the "conversation" — this is a static, scripted mock. There is no live photo interpretation and no real knowledge behind Pip's questions yet. That mock is the rough shell Shaphan described, and it's exactly the right thing to have built first: it proves the UX before the hard part is wired in.

Two things are explicitly named as dependencies but don't exist as populated content yet:

1. **The Knowledge Curation System (KCS)** — the approved horticultural knowledge (pruning rules, timing/suitability rules, safety and deferral thresholds, the comparison-image library with lookalikes and limitations) that Architecture §10 says must exist, expert-verified and Founder-approved, before any gardener testing.
2. **The AI avatar capability** — the "authorised vision capability" that turns a gardener's photo into a proposed observation with stated uncertainty, and the conversational logic that replaces `observationScript.ts` with something actually grounded in the KCS.

Everything below proposes how to build those two things so they plug into what's already there rather than requiring a rewrite.

---

## 2. Knowledge Curation System (KCS): Rock, MIL and LIL

Shaphan's description maps onto a clean two-tier model, and it fits the Architecture doc's existing language well:

- **Rock** — the research agent that goes out and finds reliable sources (university papers, horticultural extension sites, established growers' guides) for a given topic.
- **MIL (Mother Information Library)** — the raw destination for everything Rock finds. This is the evidence base: source documents, citations, excerpts, provenance — on roses now, other plants eventually. Nothing here is yet approved for Pip to act on; it's the research corpus.
- **Kit** — the agent trained to turn MIL's raw research into whatever LIL actually needs: the distillation/curation step between the two libraries. This answers the open question from the previous draft of this document ("who or what promotes MIL content into LIL") — it's Kit's job specifically, not a manual Founder task or an unspecified process.
- **LIL (Live Interactive Library)** — the operational layer Pip actually queries at runtime: distilled, structured, decision-ready knowledge (which observation this is, what a photo needs to show, which comparison image to use, what choices are valid, when to defer, when to send the photo to the vision model). This is effectively the KCS content model I described in the previous draft of this document, now understood as **LIL specifically**, not the whole system.

So the flow is: **Rock finds it → MIL stores it → Kit distills it → LIL holds it → Pip queries LIL at runtime** (and separately, Pip calls out to the vision model per photo — see Section 3).

This means Kit's own output format *is* the LIL record schema from Section 2.1 below — worth designing them together rather than separately, since Kit is the thing that has to reliably produce records in that shape from messy source material.

### 2.1 What LIL needs to contain, mapped to the approved spec

Architecture §6.2 and §7 already define the shape. LIL should hold **one structured record per supported observation**, each containing:

- the feature it identifies (one of the six supported observations);
- the visual criteria a photo needs to show it (viewpoint, scale, context);
- one or more **approved comparison images**, each tagged with: source, verification status, version, approval status, rose/seasonal/growth-stage context, and common lookalikes;
- explicit statement of what the image *cannot* establish (Pip must be honest about the limits of photo evidence);
- the decision logic: what choices (Cut/Leave/Decide later/Get experienced help) are horticulturally acceptable given this observation, and when the choice must be deferred;
- safety/suitability gates this observation depends on (dormancy, recent planting, disease/stress, tool condition, etc., per Architecture §5.4);
- a traceable link back to the MIL source(s) it was distilled from, so a Founder reviewing a LIL record can always see the research behind it.

### 2.2 Format recommendation

For MIL: no strong opinion on structure yet — it's a research corpus, so whatever shape lets Rock write to it cleanly and lets a human search it later (source, URL/citation, date retrieved, topic tags, raw excerpt) is fine. This can be messier and grow faster than LIL.

For LIL: given the MVP is deliberately narrow (six observations, one plant type), I'd recommend resisting a general-purpose vector-search/RAG setup for V1. A **versioned set of structured records** (YAML or JSON, one file per observation, human-readable and diff-able in git like the rest of Core) gives you:

- something Founders can review and approve the same way other approved documents are reviewed (fits the governance model in `AGENTS.md` and the Asset Lifecycle Standard);
- something Pip's runtime can load directly or retrieve deterministically — no embeddings needed at six-observation scale;
- a natural upgrade path — as MIL grows across more plants, the same LIL shape scales into a proper retrieval layer without a redesign.

### 2.3 The open question: what "verified" means here

Architecture §10 says "horticultural experts develop and verify this material" before the Founders approve it into the KCS. Using Rock plus published research (university papers, extension/horticulturist sites) instead of a hired horticultural consultant is a reasonable, honest way to bootstrap this from zero — but it does shift where the verification burden sits: onto Kit's distillation criteria, the Founders' own review of what Kit promotes into LIL, and the self-testing/real-plant-testing loop you described. Worth deciding explicitly what "verified" means for a MIL→LIL promotion — e.g. Kit requires two independent reputable sources before a record is eligible, with a Founder still signing off before it goes live — so it's a documented standard Kit itself can be built against, not a judgment call made differently each time.

---

## 3. AI Avatar (Pip) Capability

### 3.1 Two distinct jobs, currently conflated in "AI avatar"

Worth separating explicitly, because they have different technical shapes:

**(a) Photo interpretation** — an AI vision capability that looks at a gardener's photo and proposes "this may be dead wood, with X uncertainty" for one of the six supported observations. This needs a vision-capable model (Claude, GPT-4V-class, or a purpose-trained classifier) and, per Architecture §4.1, must always output uncertainty and never a bare fact.

**(b) Conversational orchestration** — the logic that decides what Pip says next: which question to ask, which KCS record to pull, when to show a comparison image, when to ask for a better photo, when to defer. This is the part currently hardcoded in `observationScript.ts`. It doesn't need to be a freeform LLM conversation — the Journey doc describes a fairly deterministic state machine (profile → suitability gate → one observation at a time → plan → confirm → history), which is good news, because a *constrained* orchestration layer is much easier to keep safe and predictable than an open-ended chatbot.

### 3.2 Proposed shape — confirmed direction

This matches what Shaphan described: Pip is the orchestrator, not the vision model itself. Concretely, the service layer that replaces `observationScript.ts` should, at each step:

1. pull the relevant record from LIL for the observation currently in focus;
2. send the gardener's photo(s), plus that LIL record's visual criteria, to the separate vision model as a distinct call;
3. receive back a structured proposed-observation + uncertainty from the vision model;
4. pair that with LIL's approved comparison image and metadata;
5. hand both to the UI components that already exist (`ChatBubble`, `ResponseBubble`, `PhotoCard`), and only then let Pip "speak."

This keeps Pip's personality (the warm, patient voice in Marie's Story) as a thin presentation layer over a constrained, auditable pipeline — vision model and LIL are both consulted, but neither can push Pip outside the approved boundaries, since the conversation state machine itself stays deterministic. That fits both the product's own safety requirements and the PIP AI Constitution's emphasis on truthful, bounded AI behaviour.

The session/history model in Architecture §6 (photos, interpretations, confirmations, decisions as separate preserved records) should be the actual data contract between the vision step and the conversation step — not an afterthought bolted on for storage.

### 3.3 Still-open technical decisions

- **Which vision model** Pip sends photos to (Claude, GPT-4V-class, a purpose-trained classifier) — not yet decided, and Architecture deliberately leaves this open rather than prescribing it.
- **Backend or client-side** — does the app call the vision model and query LIL directly from the device, or through a backend you control? This affects hosting cost, how session history/photos are stored, and how easy LIL is to update without shipping an app update.
- **Where LIL actually lives at runtime** — bundled into the app, or served from a backend so it can be updated centrally as MIL grows? Given LIL will keep changing as testing surfaces gaps, a centrally-served LIL (even a simple hosted JSON/YAML file set) would let you fix a bad rule without an app store release.

---

## 4. Suggested Build Order

1. Formalise Rock/MIL/LIL in the repo itself — even a short draft Foundation or Standard document — so this architecture is governed the same way everything else in Core is, not just something the Founders remember verbally.
2. Lock the LIL record format (Section 2.2) and get Founder sign-off on the schema before populating content — avoids rework once Rock's research starts flowing in.
3. Run Rock against the six MVP observations, land the findings in MIL, then distill the first pass of LIL records from it — this can start immediately and doesn't block on AI/tech decisions.
4. Decide the vision-model provider and backend-vs-client question (Section 3.3).
5. Build the service layer that replaces `observationScript.ts`: query LIL → call the vision model → merge results → hand to the existing UI, keeping the existing state machine.
6. Self-test, then run the planned real-plant testing with other people, against Architecture §8's validation criteria, before treating any LIL record as reliable.

---

## 5. Questions for You

1. What does "verified" mean for a MIL → LIL promotion (Section 2.3) — is Founder review enough, or should Kit itself be built against a documented bar (e.g. two independent reputable sources) before a record is eligible for LIL?
2. Any preference or constraint on the vision-model provider (cost, privacy, an existing account/relationship with Anthropic/OpenAI/Google)?
3. Backend or fully client-side for V1 — and should LIL be centrally served so it can be corrected without an app update?
4. Do you want me to draft the actual LIL record schema (as a real file, in the format your repo already uses), or a short Foundation/Standard doc formalising Rock/MIL/LIL, as the next concrete step?

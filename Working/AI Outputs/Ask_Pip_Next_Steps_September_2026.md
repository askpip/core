# Ask Pip — Next Steps (September 2026)

## Document Metadata

**Document Title:** Ask Pip — Next Steps (September 2026)
**Document Type:** Draft Planning Document (not a controlled Architecture Document)
**Status:** Draft — for Founder Review
**Prepared By:** Claude, at Shaphan's request
**Date:** 9 September 2026
**Purpose:** To lay out the open work Shaphan flagged in conversation — Shed documentation, the next round of MIL research, formalising the vision/perception side of Pip, image sourcing, a graphics home in Core, the KIT/LIL delivery pattern, and a documentation catch-up — as a single reviewable list, each item given real analysis rather than restated as a bullet.
**Source Material Reviewed:** `README.md`, `CHANGELOG.md`, `AGENTS.md`, `App/README.md`, `Shed/README.md`, `Working/Project_Backlog.md`, `MVP/Architecture/Ask_Pip_MVP_Bush_Rose_V1_Architecture.md`, `Knowledge Curation System/Standards/Pip_Runtime_Architecture.md`, `App/src/data/observationScript.ts`, `App/src/components/PhotoCard.tsx`, and the live `app.askpip.garden` and `shed.askpip.garden` sites.

---

## 1. Documenting the Shed and where it sits in the system

`Shed/README.md` is thorough, but it's an operational document — how to build it, deploy it, what its tables are. Nowhere does Core state, at the level a new Founder, contributor, or governed AI session would need, *why the Shed exists and what its boundary is against everything else in Core*. That gap is worth closing, and it's a small, bounded piece of writing:

- The Shed is internal tooling for the two people running AskPIP (Shaphan and Karla) — notices, documents, a calendar, a to-do list. It is not part of the Ask Pip product a gardener ever sees, and it carries none of the Pip Runtime Architecture's guarantees (no Decision Layer, no PKRs, no Founder-approval gate on its content) because none of that applies to internal team tooling.
- Its one real integration point with the rest of Core is the document sync (`Foundations/`, `Knowledge Curation System/`, `Standards/` → the Shed's File Cabinet, one-way, read-only copies). That's worth stating plainly so a future session doesn't wonder whether the Shed is a second source of truth — it isn't; Core is, and the Shed's synced folder is explicitly a mirror.
- It shares infrastructure with the App (same Supabase organisation, same Vercel account, same `askpip/core` repository) but a fully separate database schema, deployment, and identity model (named passphrases vs. Supabase Auth email codes) — worth stating once so nobody assumes shared auth or shared tables.

**Recommendation:** a short "Where the Shed Fits" note — a page, not a Standard — either as a new section in the root `README.md`'s Repository Contents, or as its own short file in `Foundations/`. I'd lean toward a paragraph in the root README, since this is a boundary-setting statement about Core's own shape, not a piece of operational documentation like `Shed/README.md` already is.

---

## 2. Researching the next MIL observations

Bush Rose V1's supported observation set (Architecture §5.2) is six items. Dead wood is the only one with real research behind it — Published, Founder-approved, and now live in the app. The other five are still the original unresearched placeholder text from `Maries_Story.md`:

1. Damaged growth
2. Crossing or rubbing stems
3. Inward-growing stems
4. Weak or congested growth
5. The main framework to retain

That's five, not six — worth flagging plainly rather than quietly rounding: if "the next six" meant something broader than the observation set (for instance, folding in one of the still-open Suitability Gate areas from Architecture §5.4 — rose type, stress/damage/disease, tool condition, safe access, or adequate-photograph confidence — none of which have dedicated research commissions yet either), that's an easy sixth item to add, but it's a different kind of research (safety/suitability gating, not an observation to confirm on the plant) and worth naming explicitly rather than assuming which one was meant.

Either way, the mechanism for this work already exists and doesn't need to be reinvented: ROC researches and drafts a Founder Review Dossier per observation (the dead-wood, dormancy, and recently-planted rounds are the working template — see `Knowledge Curation System/Mother Information Library/Founder Review Dossiers/`), the Founders approve into the MIL, and KIT distils the approved findings into Observation and Decision Logic PKRs. The `Working/Project_Backlog.md` "Research Commissions — Not Yet Started" section already has this queued; this is a recommendation to actually commission it, not a design question.

**Recommendation:** confirm the six-vs-five scope with Shaphan, then commission ROC research for the remaining observations in whatever order the Founders want gardener testing to cover first — dead wood plus one or two more observations is a materially more useful MVP than dead wood alone.

---

## 3. "IRM" — the vision/perception side of Pip

Worth stating plainly, because it changes what "write up the documents for IRM" actually means: **this is already written.** `Knowledge Curation System/Standards/Pip_Runtime_Architecture.md` (Version 1.1, Approved, 24 August 2026) settles exactly this question — it splits Pip's runtime into a Decision Layer (deterministic, walks Published PKRs, never touched by a model) and an Interface Layer, which has two jobs: Perception (reading a gardener's photo against a PKR's own Visual Criteria) and Conversation. The live Gemini-backed dead-wood Edge Function is a real, shipped instance of exactly the Perception Layer this document describes.

So there's no gap to fill by inventing a second AI persona or a new acronym-bearing document from scratch. If "IRM" is useful as a short internal name for "the model doing the Perception Layer's job" in code comments or casual conversation, that's harmless — but it names something that already has a governed name (the Perception Layer, part of the Interface Layer) and an approved document. I'd avoid letting "IRM" become a second, competing piece of vocabulary for the same thing; that's exactly the kind of drift the KCS's own naming discipline (see `PIP System Identity and Naming Standard`) exists to prevent, and it's the same failure mode the August 21st "Next Best Step" document flagged when an earlier session nearly rebuilt the whole ROC/MIL/KIT/LIL structure from scratch under different names.

What's genuinely still open, per Pip Runtime Architecture §8.2 and §9 (its own "not yet decided" list), is real follow-up work:

- **Closed confirmation responses on the Observation PKR** — the PKR Standard doesn't yet enumerate the gardener's possible answers to a confirmation (at minimum Confirmed / Doesn't Match / Not Sure), which the Runtime Architecture says it needs. This needs a Founder-approved PKR Standard revision.
- **Model-usable Visual Criteria** — an Observation PKR's Visual Criteria need to be structured enough for the Perception Layer to actually use, not just readable prose for a Founder. Worth checking whether `PKR-OBS-000001` (the one PKR actually driving a live model call today) already satisfies this in practice, and using it as the template for the next five.
- **An approved phrasing pool**, if the Conversational Layer is going to vary its wording — not yet built, needs a home (PKR fields, or a separate governed asset).

**Recommendation:** rather than commissioning new "IRM documents," commission a short revision to the PKR Standard covering the first item above (closed confirmation responses), since it's the most concrete blocker to giving the Perception Layer a clean contract for future observations — and treat "model-usable Visual Criteria" as something to check against the working example (`PKR-OBS-000001`) before writing new guidance about it.

---

## 4. Sourcing images — for the app, and for KCS comparison material

These are two different problems wearing the same word, and worth keeping separate:

**App/brand imagery** — Pip's character art, the login/hero backgrounds, in-app illustration. This is creative, not evidentiary; the existing pipeline (the OpenArt account already used for Pip's avatar, the hero garden art, and the rose background) is a reasonable way to keep producing more of it, and nothing about sourcing this is blocked or needs a governance decision.

**KCS comparison/reference images** — the Architecture's own requirement (§4.3) is stricter, and this is the real open gap: `Working/Project_Backlog.md` already flags that **no reference photograph exists anywhere in the KCS** — `PKR-OBS-000001` shipped to Published without one, as a documented, deliberate gap rather than a blocker. Every Comparison Image PKR needs to show real, verifiable plant material (dead vs. living wood, a specific stem angle, a specific season) with enough provenance to state source, verification, and lookalikes honestly, per Architecture §4.3. An AI-generated illustration is the wrong tool here — the whole point is that a beginner gardener is comparing their actual photo against something real, and a generated image could quietly get a diagnostic detail (bark colour, bud dormancy) wrong in a way nobody would catch. This needs actual photographs.

Realistic sourcing paths, roughly in order of how fast they'd move:

- **Licensing from the university extension services and societies ROC has already been citing** (RHS, Clemson, Iowa State, Illinois, Colorado State, the American Rose Society) — several of these publish under reusable terms for educational use; worth ROC checking licence terms per source as part of the next research round rather than a separate project.
- **Commissioned or Founder-taken photographs** of an actual bush rose through a real dormant season — slower, but produces exactly the paired "confirmed dead" / "confirmed living" comparison shots nothing else can guarantee, and ties naturally to the recently-planted and dormancy research already grounding this work.
- **Gardener-contributed photographs**, once there's real usage — the MVP's own confirm/correct loop is already collecting exactly this kind of image, just not yet with a pipeline for promoting a good one (with consent) into an approved Comparison Image PKR. Worth flagging as a later-stage option, not a first-round one — it needs real gardener volume first.

**Recommendation:** treat this as its own small research commission — "source or produce the dead-wood Comparison Image PKR" — rather than folding it into the next round of observation research, since it's a different kind of work (procurement/licensing, or a photo shoot) than desk research.

---

## 5. A graphics home in Core

`Graphics/` currently exists but is an unstructured flat folder — thirteen files, all App/Pip brand assets, no subfolders. Two things are worth deciding rather than assuming:

- **Brand/UI graphics and KCS evidentiary images shouldn't live in the same place.** A Comparison Image PKR's source photograph is governed knowledge — versioned, approved, tied to a specific PKR — and belongs inside `Knowledge Curation System/Mother Information Library/` alongside the ARCs and Founder Review Dossiers it supports, not in a general-purpose graphics folder. Brand art (Pip's character, app backgrounds, marketing screenshots) has no such governance requirement and can live wherever is most convenient for whoever's building the app or the Shed.
- **The existing flat `Graphics/` folder** is App/brand-only in practice already (Pip avatars, the app title graphic, a demo screenshot). I'd leave those files where they are rather than move them — they're referenced by nothing that would break, but reorganising working assets is exactly the kind of structural change worth a deliberate decision rather than a drive-by move.

What I did today, narrowly: added `Graphics/Design Explorations/`, holding the one thing that needed a home right now (the visual-direction mockup from this session — see its own README there). That's additive and doesn't touch anything existing.

**Recommendation, for a Founder decision rather than something I've done unilaterally:** a structure along the lines of —

- `Graphics/App/` — Pip's character art, app UI/marketing assets (the existing flat files, optionally moved here later)
- `Graphics/Shed/` — Shed-specific art, if any accumulates outside `Shed/art/` (which already holds the Shed's own build-time assets and probably shouldn't be duplicated)
- `Graphics/Design Explorations/` — direction work like today's, dated per exploration
- KCS comparison/reference photographs stay inside `Knowledge Curation System/Mother Information Library/`, *not* under `Graphics/` at all, once the sourcing work in §4 produces any

---

## 6. KIT and how the LIL actually delivers Pip to gardeners

This is less an open question than an under-documented fact: **the live dead-wood Edge Function already answers it.** The path from a Founder-approved PKR to a gardener's phone is, concretely: KIT writes the PKR's declarative content → the Decision Layer (plain retrieval logic in the app, per Pip Runtime Architecture §3.1) walks it to decide what's allowed → the Interface Layer (the Supabase Edge Function calling Gemini, bounded strictly to that PKR's Visual Criteria) perceives the photo and phrases the answer. That's the LIL, running, today, for one observation.

What hasn't happened yet is writing this down as *the pattern*, rather than leaving it implicit in one Edge Function's source comments. `KIT_Operations_Manual.md` was drafted before this Edge Function existed and doesn't yet reference it as a worked example. That's a real, valuable, and fairly mechanical documentation task — not new design work, since the design already shipped and was validated live.

**Recommendation:** an addendum (or a new worked-example section) in `KIT_Operations_Manual.md` — or a short standalone note in `Knowledge Curation System/` — walking through `pip-observe-dead-wood` as the reference implementation of Pip Runtime Architecture §4: here is a Published PKR's Visual Criteria, here is the bounded prompt built from it, here is the fallback behaviour, here is what made two prompt-iteration bugs get caught before shipping (both already recorded in `Working/Project_Backlog.md`'s Resolved section). This gives KIT — and whoever researches and builds the next five observations — a concrete template instead of reasoning from the Standard alone.

---

## 7. Bringing documentation up to date

Done as part of preparing this document, so it's not just recommended:

- **`CHANGELOG.md`** was significantly behind — its entire `Unreleased` section predated the Shed migration, the Pip Runtime Architecture v1.1 adoption, the first Published PKRs, and the live AI shipment. Added five entries covering that ground, sourced from `Working/Project_Backlog.md` and the relevant README files.

Still open, both already flagged in `Working/Project_Backlog.md` and neither touched here since they need a closer read than this pass allowed:

- **Stale Founder Review Dossiers** — `FRD-BUSHROSE-DORMANCY-02.md` and `FRD-BUSHROSE-RECENTPLANT-01.md` through `-04.md` in `Working/Founder Review/` still show "Draft — submitted for Founder Review" with no archival banner, even though their conclusions are already relied on elsewhere. Only the dead-wood FRD has a properly archived, banner-updated copy.
- **Superseded draft KCS documents** — `Working/Drafts/Knowledge Curation System/` still holds older copies of `KIT_Charter.md`, `KIT_Operations_Manual.md`, `LIL_Standard.md`, and two `PKR_Standard.md` drafts, all now superseded by the Approved versions under `Knowledge Curation System/` proper. Worth confirming they're safe to remove rather than left as a second, stale copy someone could read by mistake.

Also worth noting: this changelog catch-up covered what I could verify directly against source documents this session (READMEs, the Runtime Architecture, the Project Backlog). It is not a line-by-line audit against every PKR and dossier — a fuller reconciliation pass, checking the changelog against `Knowledge Curation System/Mother Information Library/` directly, would be worth doing once rather than assuming this pass caught everything.

---

# End of Document

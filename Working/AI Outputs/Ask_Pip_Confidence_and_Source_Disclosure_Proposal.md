# Ask Pip – Proposed Addition to Pip Runtime Architecture: Confidence & Source Disclosure

## Document Metadata

**Document Title:** Ask Pip – Proposed Addition to Pip Runtime Architecture: Confidence & Source Disclosure
**Document Type:** Draft Planning Document (proposed a revision to an Approved Standard — does not itself amend it)
**Status:** Adopted — folded into `Pip_Runtime_Architecture.md` v1.1 as new §5.3, 24 August 2026. The §4 open question was resolved by Founder decision the same day: require full Publication before display (not merely Founder approval) — see Pip Runtime Architecture §5.3's added bullet.
**Prepared By:** Claude, at Shaphan's request
**Date:** 24 August 2026
**Purpose:** To close a gap flagged in `PKR-DEF-EVIDENCE-CONFIDENCE-submission.md` — that nothing in the governed documents specifies when or how Pip's interface should expose a confidence rating's explanation or an observation's sources — and to propose the specific addition to `Pip_Runtime_Architecture.md` that would close it.
**Related Documents:** `Knowledge Curation System/Standards/Pip_Runtime_Architecture.md` (v1.0, Approved); `Working/AI Outputs/PKR-DEF-EVIDENCE-CONFIDENCE-submission.md`; `Working/AI Outputs/PKR-SRC-submission.md`; `App/src/pages/Journey.tsx`; `App/src/data/observationScript.ts`; `App/src/data/confidenceDefinitions.ts`.

---

## 1. Why This Exists

`PKR-DEF-EVIDENCE-CONFIDENCE-submission.md` (§4) states plainly: "nothing in the Pip Runtime Architecture specifies that a gardener pressing or tapping a shown confidence level should trigger Pip to retrieve and present the matching Definition PKR here, rather than generating an explanation freely... it belongs in the Pip Runtime Architecture rather than in these records themselves — flagged here, not built."

That gap is now more concrete than when it was first flagged, because a working version of this behaviour has since been built directly into the app, ahead of any Standard describing it — see §2. This document exists to catch the governance up to the build, not the other way around, and to give the Founders the chance to amend or reject the pattern before it becomes precedent for every future observation.

## 2. What Already Exists in Code

As of commit `f91c3ec` (24 August 2026), `App/src/pages/Journey.tsx` shows two tap-to-reveal links on the dead-wood observation, the only observation currently carrying real content:

- **Confidence:** a link reading "Moderate confidence — what does this mean?", which opens the verbatim Plain-Language Explanation from the matching Definition PKR (`App/src/data/confidenceDefinitions.ts`, sourced from `PKR-DEF-EVIDENCE-CONFIDENCE-submission.md`). Nothing is generated; the explanation shown is fixed text, selected by the observation's stated confidence level.
- **Sources:** a link reading "Where this comes from", which opens the list of Source PKRs backing that observation's specific signals (`App/src/data/observationScript.ts`'s `sources` field, sourced from `PKR-SRC-submission.md`), each linking to the real publication.

Both are wired to appear only when an observation actually carries a `confidenceLevel` and/or `sources` — the other three scripted observations (crossing stems, inward-growing stems, main framework) have neither field set, since no ARC research exists for them yet, and so show no tap targets at all.

## 3. Proposed Addition to Pip Runtime Architecture

Proposed as a new **Section 5.3**, immediately following the existing "5.2 Speaking to the Gardener," since it governs the same Conversational Layer:

> ### 5.3 Confidence and Source Disclosure
>
> Where a PKR carries an Evidence Confidence rating and/or Supporting Source(s), the Interface Layer shall make both available to the gardener on request, alongside the guidance itself:
>
> - **Confidence disclosure.** A gardener may request what a shown confidence level means. Pip's response shall be the verbatim Plain-Language Explanation from the matching Definition PKR — never a freely generated explanation, regardless of how well a model might phrase one. Where no Definition PKR exists for a level in use, that is a content gap to raise through the Knowledge Curation System, not a gap for the Interface Layer to fill on its own judgement.
> - **Source disclosure.** A gardener may request where a piece of guidance comes from. Pip's response shall list the specific Source PKR(s) supporting the claim or signal in question — not a generic list of everything the wider Observation or Decision Logic PKR cites, where signal-level attribution exists to be more specific.
> - Both disclosures are available only where the underlying PKR content actually provides them. An observation with no stated confidence or no Source PKR references shows nothing rather than an invented placeholder — silence is the honest default, per Section 7's Honesty Boundary.

And a small addition to **Section 10 (Success Criteria)**, as a new bullet:

> - every confidence rating and source reference a gardener can see traces to its exact Definition PKR or Source PKR text, retrievable on request, never generated fresh.

No change to the PKR Standard is required — "Evidence Confidence" and "Supporting Source(s)" are already required Common Fields (PKR Standard §4), and Definition PKRs and Source PKRs already exist as record types. This is purely an Interface Layer obligation describing how existing, already-governed fields must be surfaced.

## 4. Open Question for Founder Review

The confidence and source content actually shown right now is Founder-**approved** but not yet Founder-**Published** — PKR-OBS-000001 and PKR-DEF-000001 through 000005 are all still "Draft — Dependency-Blocked," blocked on dependencies unrelated to the specific content being shown (a missing Comparison Image PKR; an unresolved Source-PKR-for-Definition-PKRs question). The Source PKRs themselves (`PKR-SRC-000001–000015`) are the one piece that's actually reached full Published status.

This mirrors the precedent already set by the dormancy-gate help text in `Journey.tsx`'s safety checklist — approved wording shown as informational content ahead of formal publication, with its Draft status noted in a code comment. This proposal asks the Founders to either:

1. **Confirm that pattern as acceptable** — content-approved-but-not-Published PKR wording may be surfaced in the interface, provided it's clearly informational rather than presented as an official gated rule, and the code documents its actual status; or
2. **Require full Publication** before any PKR content reaches the interface, in which case the confidence and source links just shipped should be held back (or clearly marked as a preview) until PKR-OBS-000001 and the five Definition PKRs actually publish.

Nothing in the existing Pip Runtime Architecture settles this either way — Section 7 says Pip's knowledge is "bounded strictly to what is currently published in the LIL," which read literally would argue for option 2. This document does not resolve that tension on its own; it surfaces it for a decision, since the app work already outran it once and the same question will recur every time a new observation's content is approved before it publishes.

## 5. Recommended Next Step

Approve, amend or reject §3's proposed addition and answer §4's open question. If approved, fold §3 verbatim (or as amended) into `Pip_Runtime_Architecture.md` as v1.1, per that document's own revision process — this proposal is deliberately written as ready-to-fold text rather than a summary, to save a rewrite step if the Founders are satisfied with it as drafted.

---

# End of Document

# PKR Submission Package — Recently Planted Suitability Gate (v1.0, Published)

**Published 23 August 2026.** Content approved by the Founder the same day, following a four-part research series (FRD-BUSHROSE-RECENTPLANT-01 through -04) the Founder personally drove deeper at each stage, given this gate's safety-critical framing: "we cannot guide a gardener to prune a rosebush that is not even old enough to prune." Version 1.0 per KIT OM §10.4. Source PKRs (PKR-SRC-000025–000032, in `PKR-SRC-BUSHROSE-RECENTPLANT-submission.md`) were Published the same day, resolving the one dependency this record had. **This is the first Suitability/Observation/Decision Logic PKR in the project to reach Published** — every other one built so far (PKR-OBS-000001, PKR-DEC-000001, PKR-SGT-000001) remains Draft — Dependency-Blocked on something unrelated to this gate.

Built per KIT Operations Manual v0.4, from ARC-BUSHROSE-RECENTPLANT-01. This is the second Suitability Gate PKR built under the PKR Standard (after PKR-SGT-000001, dormancy), and the first to use a genuinely two-step structure — a primary check and an explicit fallback — since a single Question/Acceptable-Answer pair could not honestly represent both the date-known and date-unknown cases without collapsing their different confidence levels together.

**Note on scope:** Per the Founder's decision recorded at ARC-BUSHROSE-RECENTPLANT-01 §2, this gate implements only AF-1 and AF-2. AF-3 (grafted/own-root visibility) and AF-4 (light first-year shaping, the three-tier design) are documented in the ARC but deliberately **not** built into this record — including them here would exceed what was actually approved for operational use.

---

## 1. Triage Record (KIT OM Chapter 5)

| ARC content | Routes to |
|---|---|
| AF-1 (restraint period — full pruning waits for establishment, ~3+ years; dead wood exempted) | PKR-SGT-000002 — primary Question/Check and Acceptable Answers |
| AF-2 (observable signals when planting date unknown) | Same PKR — Fallback Check, reached only when the primary check's date is unknown |
| AF-3, AF-4 (documented, not operationalised) | **Not routed to this PKR.** Preserved in ARC-BUSHROSE-RECENTPLANT-01 §3–§4 for future revision; not used, in whole or paraphrase, in any field below, per PKR Standard §4.3's Translation Boundary. |

---

## 2. PKR-SGT-000002 (Suitability Gate PKR)

| Common Field | Value |
|---|---|
| PKR ID | PKR-SGT-000002 |
| PKR Type | Suitability Gate PKR |
| Title | Recently planted gate — is the rose established enough for full pruning guidance? |
| Status | **Published** |
| Version | 1.0 |
| Applies To | Established or recently planted bush rose; prerequisite check, before the five non-dead-wood pruning observations proceed. Does **not** restrict dead-wood removal (see §4). |
| Supporting Source(s) | AF-1: PKR-SRC-000025, 000026, 000027, 000028, 000029. AF-2: PKR-SRC-000030, 000031, 000032. All from ARC-BUSHROSE-RECENTPLANT-01, built in `PKR-SRC-BUSHROSE-RECENTPLANT-submission.md`. *(Corrected 24 August 2026: PKR-SRC-000029 was previously also listed under AF-2 for a "light-shaping passage." PKR-SRC-000029's own MIL References are AF-1 and AF-4 only — not AF-2 — and AF-4 is explicitly not routed to this PKR (§1 above). The AF-2 citation was a labeling error and has been removed; PKR-SRC-000029 remains correctly cited under AF-1.)* |
| Founder Approval Date | 23 August 2026 (content only — see Status) |
| Related PKRs | Governs, as a Condition, the five MVP pruning observations not yet built as PKRs (damaged growth; crossing/rubbing stems; inward-growing stems; weak/congested growth; main framework). **Does not govern PKR-DEC-000001** (dead-wood cut/leave decision) — dead wood removal is explicitly exempted from this gate's restriction, per AF-1; see §4. |
| Preserved Uncertainty or Limitations | AF-1 (Moderate): the ~3-year threshold is an approximate range from the strongest available source, not a precise, validated figure; RHS's shorter "first winter" guidance remains unreconciled (ARC §5). AF-2 (Low): the fallback signals are unvalidated in combination and may not apply equally across own-root and grafted roses. |
| Evidence Confidence | **See per-claim confidence below** (PKR Standard §4.2) |

**Gate Area:** Recent planting (Architecture §5.4).

### Primary Question or Check

> Do you know approximately when this rose was planted? If so, has it been growing in this spot for about three years or more?

**Acceptable Answer(s):**

| Answer | Evidence Confidence | Result |
|---|---|---|
| Yes, planted about three years ago or more | **Moderate** (AF-1) | Gate passes — the five non-dead-wood observations may proceed |
| Yes, planted less than about three years ago | **Moderate** (AF-1) | Gate does not pass for the five non-dead-wood observations — dead wood removal may still proceed (see §4) |
| Don't know / not sure | Not Applicable — routes to the Fallback Check below | Continue to Fallback Check |

**Stopping Threshold:** A confirmed planting date under approximately three years, by itself, stops the five non-dead-wood observations from proceeding this session — it does not stop dead-wood removal.

### Fallback Check — Planting Date Unknown

Reached only when the primary check's answer is "don't know / not sure." Per AF-2, none of the following signals is individually reliable; they are used together, and **any ambiguous, mixed, or uncertain reading defaults to the same restricted outcome as "recently planted."** This default is deliberate — per the Founder's direction that this gate must never guess "established" — and is not, itself, an inference from the evidence; it is a safety margin built around Low-confidence evidence.

**Acceptable Answer(s):**

| Signal | Reading | Evidence Confidence | Contribution to Result |
|---|---|---|---|
| New growth | Active new leaves, shoots or buds present | **Low** (AF-2) | Supports "established" |
| New growth | None visible, or not sure | Not Applicable | Does not support "established" |
| Cane count | Several canes, clearly more than two or three thin ones | **Low** (AF-2) | Supports "established" |
| Cane count | Two or three thin canes, or not sure | Not Applicable | Does not support "established" |
| Base firmness | Feels firmly anchored when gently tested | **Low** (AF-2) | Supports "established" |
| Base firmness | Feels loose, or gardener is unwilling/unable to test it | Not Applicable | Does not support "established" |

**Result:** Gate passes for the five non-dead-wood observations only if **all three** signals support "established." Dead wood removal is never blocked by this fallback, per AF-1's exemption. Where the gate passes on this fallback rather than a confirmed date, this is a **Low-confidence pass** — if the gardener asks how sure Pip is, Pip should be able to say so plainly (consistent with the tap-to-reveal Definition PKR mechanism already built for Evidence Confidence terms, PKR-DEF-000003/000004).

**Stopping Threshold:** Any one signal reading "does not support established" stops the five non-dead-wood observations from proceeding this session. This is an "all three or none" rule, deliberately more conservative than a majority-rules design, given AF-2's Low confidence and the Founder's explicit safety framing.

---

## 3. Wording Boundary Check (KIT OM §7.7)

- The primary Question asks about a known date and a roughly-three-year threshold — matches AF-1 exactly; does not state a precise figure the evidence does not support, and does not silently drop RHS's unreconciled shorter guidance (preserved in the ARC, not in this record, per §4.3's rule against smoothing over a limitation).
- The Fallback Check's three signals match AF-2's language directly; no combined-test claim is asserted beyond what the "all three" stopping threshold itself states as a deliberate safety design, not a research finding.
- AF-3 and AF-4 do not appear anywhere in this record, including in the Fallback Check's wording, per the Triage Record above.
- Dead wood's exemption is stated plainly wherever the gate's restriction is stated, so this record cannot be misread as blocking PKR-DEC-000001.

---

## 4. Why Dead Wood Is Exempted, and What This Means for PKR-DEC-000001

AF-1 states dead wood removal may proceed sooner than the other five observations, since removing genuinely dead tissue does not remove the plant's own growth capacity. This gate is therefore scoped to the five observations not yet built as PKRs — it does **not** add a Condition to PKR-DEC-000001 (the existing dead-wood cut/leave Decision Logic PKR), and PKR-DEC-000001 requires no revision as a result of this gate's creation. This is a deliberate consequence of following AF-1 precisely, not an oversight — a version of this gate that blocked dead-wood removal on a recently planted rose would contradict the evidence it is built from.

---

## 5. Remaining Dependencies

| Dependency | Status |
|---|---|
| Founder operational approval of PKR-SGT-000002's content | **Resolved 23 August 2026.** |
| Source PKRs (AF-1, AF-2) | **Fully resolved 23 August 2026** — PKR-SRC-000025 through PKR-SRC-000032, built, Founder-approved, and Published. |
| The five non-dead-wood Observation/Decision Logic PKRs this gate would govern | Not yet built at all (Project_Backlog.md, "Research Commissions — Not Yet Started"). This does **not** block this record's own publication — a Suitability Gate PKR does not require the records it will govern to exist yet, only to be referenced correctly once they do. |
| AF-3 plant-profile-questionnaire question | Open product decision, not part of this record (ARC §6) — does not block publication. |
| AF-4 three-tier gate redesign | Deferred (ARC §2, §6) — this record implements the complete, self-contained two-tier design; does not block publication. |

**Published 23 August 2026.** No item above blocked publication once the Source PKRs resolved — unlike PKR-SGT-000001, this record had no undrafted fallback wording or open caveat-design decision. Per PKR Standard §7, this record is now live in the LIL and available for Pip to retrieve; only Published PKRs are available at runtime, and this is the first Suitability/Observation/Decision Logic PKR in the project to reach that status.

---

## 6. Founder Review Rendering (KIT OM Chapter 12)

**What this record is for:** Before Pip proposes any of the five non-dead-wood pruning observations, it must first confirm the rose is established enough — otherwise a beginner gardener could be guided to prune a rose that hasn't yet developed enough growth capacity to safely lose it. Dead wood removal is exempted, since it doesn't carry that risk.

**What evidence it rests on:** One Moderate-confidence finding (established roses generally need about three or more years, four converging sources including one institutional) and one Low-confidence fallback (three observable signals, used together, for when the planting date isn't known) — with an explicit, deliberately conservative rule that any doubt in the fallback blocks proceeding rather than guessing.

**Preserved limitations:** RHS's shorter "first winter" guidance remains unreconciled and is preserved at the ARC level, not adopted here. The fallback's three signals are not validated in combination and may not apply equally to own-root and grafted roses — this record does not claim otherwise.

**Outstanding dependencies:** None. Published 23 August 2026.

**Open items for the Founders:** whether to add the AF-3 bud-union question to the plant profile questionnaire (a separate decision from this gate), and whether to revisit the three-tier (AF-4) design later — both already flagged in Project_Backlog.md, neither blocking this record's own path to publication once its Source PKRs are approved.

---

# End of Document

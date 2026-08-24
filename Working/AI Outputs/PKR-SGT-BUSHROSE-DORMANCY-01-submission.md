# PKR Submission Package — Dormancy Suitability Gate (v1.0, Published)

**Published 24 August 2026.** Source PKR references were added 23 August 2026 (PKR-SRC-000016 through PKR-SRC-000024, Published the same day). The two remaining blockers are now resolved by Founder decision, 24 August 2026: the caveat stays as an explicit, separately-stated limitation rather than being folded into the main Question/Check (see the updated "Note on the caveat design" below), and the "Not sure" fallback now has real wording (§2). See §5 for the full resolution record.

**Flagged for a near-term follow-up, not a blocker on today's publication:** the Founder has proposed going further than a static caveat — asking the gardener's own climate directly and showing only the rule that applies to them, rather than one blanket sentence covering every climate. That's a genuine improvement on the design below, but it changes how this gate asks its question, not just its wording, so it's tracked as a future revision to this PKR rather than built into today's publish.

**Identifier migrated 23 August 2026**, per KIT OM v0.4 §10.2B: `PKR-SGT-BUSHROSE-DORMANCY-01` → `PKR-SGT-000001`. Content and approval status are unaffected.

**Content approved by the Founder, 23 August 2026.** Version bumped to 1.0 per KIT OM §10.4. Status remains Draft — Dependency-Blocked (KIT OM Chapter 11.2): this gate's own required content is approved, but Source PKRs — a required Common Field dependency for every PKR type, per PKR Standard §4 — don't exist yet anywhere in the project, so this record cannot yet reach "Approved for Publication," let alone "Published." See §5.

Built per KIT Operations Manual v0.3, from ARC-BUSHROSE-DORMANCY-01 v1.1. This is the first Suitability Gate PKR built under this Standard; where a structural choice wasn't dictated by an existing pattern, it's flagged for Founder confirmation rather than assumed.

**Note on the caveat design (resolved 24 August 2026):** this record's Preserved Uncertainty field holds AF-3's caveat as its own explicit, separately-stated limitation — not folded into the main Question/Check wording. Folding it away would present a Moderate-confidence, climate-specific nuance as if it were simply how dormancy checking works for everyone, which is not what the evidence supports. The Founder has also flagged a better long-term design — asking the gardener's own climate directly and showing only the applicable rule, rather than one sentence covering every climate — tracked as a future revision (see title-line note above), not built into this publication.

---

## 1. Triage Record (KIT OM Chapter 5)

| ARC content | Routes to |
|---|---|
| AF-1 (bud swell as readiness signal), AF-2 (climate/hemisphere-dependent timing) | PKR-SGT-000001 — the Question/Check and Acceptable Answer(s) |
| AF-3 (mild/warm-winter complications) | Same PKR — recorded as a Preserved Limitation, not folded into the Question/Check wording, since AF-3's own confidence (Moderate) is weaker than AF-1/AF-2 (High) and per PKR Standard §4.2 must stay distinguishable per claim |
| FRD-BUSHROSE-DORMANCY-01 §7.4 (ROC synthesis) | **Not routed to this PKR.** Not approved content — see ARC v1.1 §5. Not used, in whole or paraphrase, in any field below, per PKR Standard §4.3's Translation Boundary. |

---

## 2. PKR-SGT-000001 (Suitability Gate PKR)

| Common Field | Value |
|---|---|
| PKR ID | PKR-SGT-000001 |
| PKR Type | Suitability Gate PKR |
| Title | Dormancy gate — is the rose currently dormant and in the appropriate pruning window? |
| Status | **Published** |
| Version | 1.0 (content approved) |
| Applies To | Established bush rose; prerequisite check, before any pruning observation proceeds |
| Supporting Source(s) | AF-1: PKR-SRC-000017, 000019, 000020, 000021. AF-2: PKR-SRC-000016, 000018, 000021, 000022, 000023, 000024. AF-3: PKR-SRC-000018, 000020, 000024. All from ARC-BUSHROSE-DORMANCY-01 v1.1, built in `PKR-SRC-submission.md`. |
| Founder Approval Date | 23 August 2026 (content only — see Status) |
| Related PKRs | Governs, as a Condition, every Decision Logic PKR for the six MVP pruning observations — currently only PKR-DEC-000001 exists; see §4 below for that PKR's update. |
| Preserved Uncertainty or Limitations | AF-3 (Moderate): in mild or warm-winter climates, full leaf loss may not occur and premature bud break is a documented risk — the gardener should judge dormancy by bud state specifically, not by whether leaves are present. A follow-up commission (FRD-BUSHROSE-DORMANCY-02, submitted alongside this package) is testing whether the bud-swell signal itself needs a stated mild-climate exception; this gate's wording will be revised if that research changes the picture. |
| Evidence Confidence | **See per-claim confidence below** (PKR Standard §4.2) |

**Gate Area:** Dormancy / location and season (Architecture §5.4).

**Question or Check:**

> Look closely at the dormant buds along your rose's canes. Has active new growth already begun — buds swelling, breaking open, or new leaves emerging anywhere on the plant — or does the plant still appear dormant?

*(Traceable to AF-1: bud swell/breaking, not leaf presence or a calendar date, is the signal being checked for.)*

**Acceptable Answer(s)** *(Source PKR(s) column added 23 August 2026)*:

| Answer | Evidence Confidence | Result | Source PKR(s) |
|---|---|---|---|
| Still dormant — buds are tight and closed, or just beginning to swell; no new leaves have opened anywhere on the plant | **High** (AF-1) | Gate passes — proceed to pruning observations | PKR-SRC-000017, 000019, 000020, 000021 |
| Not sure | Not Applicable — structural closed-answer-set option, per the Decision-Relevant Input Boundary pattern already established for Observation PKRs (Pip Runtime Architecture §8.2; PKR Standard §5.1), applied here for consistency; not itself an evidentiary claim | Gate does not pass. Fallback wording (drafted and Founder-approved 24 August 2026): "That's alright — have another look at the buds specifically, not the leaves: are they still tight and closed, or have any started to swell or open? If you're still not certain after a closer look, the safest choice is to treat the rose as not quite ready yet, and check back in a week or two." This mirrors the recently-planted gate's existing "any doubt defaults to the more restrictive outcome" design (PKR-SGT-000002 §Fallback Check) rather than inventing a new pattern. | Not Applicable |
| Active new growth already well underway — leaves have opened and new shoots are clearly growing | **High** (AF-1, by direct implication — the window is at or before bud swell, not after leaf-out) | Gate does not pass — the appropriate pruning window has passed for this season | PKR-SRC-000017, 000019, 000020, 000021 |

**Stopping Threshold:** Active new growth already well underway (as above). Per AF-1, sources recommend pruning at or just before bud swell, before active leaf-out is well underway; once leaf-out is underway, this gate should not pass.

**No fixed calendar date is used anywhere in this record.** Per AF-2 (High, 6 sources), the appropriate window varies by roughly five months across the climates studied (mid-February in western Oregon to late July in Dunedin, New Zealand) and is not stated as a date anywhere in this PKR — the gardener's own rose is the evidence, consistent with AF-2's underlying rule ("past the coldest part of winter, before active growth begins").

---

## 3. Wording Boundary Check (KIT OM §7.7)

Before submission, KIT confirms each field says the same thing as its underlying claim, no more:

- The Question/Check asks about bud/growth state, not leaf presence or a date — matches AF-1 and AF-2 exactly; does not introduce leaf-based judgment, which AF-3 flags as unreliable in mild climates.
- No explanatory "why" beyond what AF-1/AF-2 themselves state has been added (for example, no invented mechanism for *why* bud swell is the correct signal — the sources state that it is, not the biological reason, and this record does the same).
- AF-3's caveat is preserved as its own field (Preserved Uncertainty or Limitations), not blended into the Question/Check wording or silently dropped.
- FRD §7.4 (ROC's excluded synthesis) does not appear anywhere in this record, including in the "Not sure" fallback framing, which was built from the existing Observation PKR structural pattern, not from §7.4's reasoning.

---

## 4. Required Update to PKR-DEC-000001 (Version 0.2)

This resolves the completeness gap flagged when that Decision Logic PKR was first drafted: its Conditions field had no Suitability Gate reference because none existed yet.

**Conditions row, updated:**

| Confirmed observation | Available choice | Condition | Evidence Confidence |
|---|---|---|---|
| Confirmed dead wood | **Cut** — remove back into living tissue | Standard case, **and** PKR-SGT-000001 gate passes (rose confirmed dormant) | **High** (AF-7); gate condition High (AF-1) |
| Confirmed dead wood, dieback persists after repeated cuts | **Cut, escalating** | Only where dieback continues, **and** PKR-SGT-000001 gate passes | **Moderate** (AF-8); gate condition High (AF-1) |
| Confirmed living wood | **Leave** | Definitional complement | Not Applicable — Founder observation, ARC §6A |

This is the first case of a Decision Logic PKR actually citing a Suitability Gate PKR as a Condition — until PKR-SGT-000001 receives Founder operational approval and is published, PKR-DEC-000001 remains dependency-blocked on it too, per Chapter 11's partial-completeness handling, in addition to its pre-existing Comparison Image PKR dependency.

---

## 5. Remaining Dependencies

| Dependency | Status |
|---|---|
| Founder operational approval of PKR-SGT-000001's content | **Resolved 23 August 2026.** |
| Source PKRs for AF-1/AF-2/AF-3 | **Fully resolved 23 August 2026** — PKR-SRC-000016 through PKR-SRC-000024, in `PKR-SRC-submission.md`, built, Founder-approved, and Published, cited above. This dependency no longer blocks this record. |
| "Not sure" fallback wording (this PKR) | **Resolved 24 August 2026** — drafted and Founder-approved; see §2's Acceptable Answer(s) table. |
| Comparison Image PKR(s) for dead vs. living wood | Still missing — unrelated to this PKR, does not block it (it never did; noted here only because it's a standing project gap, not a dependency of PKR-SGT-000001). |
| Caveat design decision (merge / blanket / conditional) | **Resolved 24 August 2026** — kept as an explicit, separate caveat; see the updated note under the document title above. |
| FRD-BUSHROSE-DORMANCY-02 outcome | **Resolved 24 August 2026** — the Founder has chosen to publish with the existing Preserved Uncertainty wording now, rather than wait on further research; FRD-BUSHROSE-DORMANCY-02's finding remains available for a future revision if it changes the picture, but no longer blocks this record. |

---

## 6. Founder Review Rendering (KIT OM Chapter 12)

**What this record is for:** Before Pip proposes any pruning observation, it must first confirm the gardener's rose is actually dormant and in the right seasonal window — otherwise none of the six pruning observations are safe to offer. This is that check.

**What evidence it rests on:** Two strongly-evidenced findings (bud swell is the signal to watch for; the calendar timing varies enormously by climate and isn't itself the signal) and one moderately-evidenced caveat (mild winters can make leaf state misleading, so the check deliberately never asks about leaves).

**Preserved limitations:** The mild-climate caveat (AF-3) is real and unresolved — a follow-up commission is actively testing whether it needs to become a stronger, separately-worded exception. This gate may need revision depending on that outcome.

**Outstanding dependencies:** None. Published 24 August 2026 — see §5.

**Open decision for the Founders:** none remaining on this record. The Founder's proposal to make the mild-climate caveat conditional on the gardener's own answer, rather than a blanket sentence, is tracked as a future revision (title-line note above), not an open blocker on today's publication.

---

# End of Document

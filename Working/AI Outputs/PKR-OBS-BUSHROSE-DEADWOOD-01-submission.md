# PKR Submission Package — Dead vs. Living Wood (v1.0, Published)

**Published 24 August 2026, with one documented gap.** PKR-SGT-000001 (the dormancy gate PKR-DEC-000001 depends on) published the same day, clearing PKR-DEC-000001's last dependency. PKR-OBS-000001's Comparison Image PKR remains genuinely missing — no reference photographs exist anywhere in the KCS yet — and the Founder has decided (24 August 2026) to publish this record anyway, with that gap stated plainly rather than held back: every other part of this record (the five diagnostic signals, their per-signal confidence, their sources) is real, evidenced, and ready, and withholding it from the app to wait on a photograph that doesn't exist yet would block genuine testing over a single missing field. A Comparison Image PKR should still be sourced and added as a follow-up revision when reference photographs become available.

**Source PKR references added 23 August 2026, and those Source PKRs subsequently Published the same day.** Both records now cite the actual Source PKRs built in `PKR-SRC-submission.md` (PKR-SRC-000001 through PKR-SRC-000015 — the dead-wood commission's set) in their Supporting Source(s) common field and, per signal/choice, in their type-specific tables. This does not itself change either record's content approval or Version (still 1.0, approved 23 August 2026) — it satisfies a required Common Field (PKR Standard §4) that was previously flagged as outstanding. **The Source PKR dependency is now fully resolved** (built, approved, and published) — but publication of these two records is still blocked on other, unrelated dependencies: see §4.

**Identifiers migrated 23 August 2026**, per KIT OM v0.4 §10.2B: `PKR-OBS-BUSHROSE-DEADWOOD-01` → `PKR-OBS-000001`; `PKR-DEC-BUSHROSE-DEADWOOD-01` → `PKR-DEC-000001`. Content and approval status are unaffected — this is an identifier correction only, made while both records are still Draft, before anything outside the KCS could depend on the old IDs. This file's own name is unchanged, since filenames are now explicitly decoupled from canonical IDs (KIT OM §10.2A).

**Content approved by the Founder, 23 August 2026.** Both records' content is now approved — Version bumped to 1.0 per KIT OM §10.4's pattern (approval assigns the first approved version). **Status remains Draft — Dependency-Blocked for both records** (KIT OM Chapter 11.2): this reflects content approval, not publication readiness. See the corrected Remaining Dependencies table at §4 — it now explicitly lists Source PKRs, which a closer reading of PKR Standard §4 shows are a required Common Field for every PKR type, not an optional nicety as earlier versions of this package implied by omitting them. This affects every PKR built so far, not just this one; see Project_Backlog.md.

The Deferral Triggers question (§3, PKR-DEC) is confirmed resolved: no case belongs there specifically, this is not a gap.

Previously: v0.4 updated PKR-DEC-000001's Conditions field to reference PKR-SGT-000001, resolving the completeness gap noted when this record was first drafted. v0.3 corrected the blended "Evidence Confidence: Low" Common Field per PKR Standard §4.2 (v0.06) and resolved Gap 3 with real evidenced content rather than parking it as an empty dependency.

---

## 1. Triage Record (KIT OM Chapter 5) — unchanged

| ARC content | Routes to |
|---|---|
| AF-1 through AF-5, §6 Founder observation | PKR-OBS-000001 |
| **AF-7, AF-8, §6A Founder observation (new, added at ARC v1.2)** | **PKR-DEC-000001 (new)** |
| AF-6 (sporotrichosis) | Future Suitability Gate PKR, personal-protection area — not built here |

---

## 2. PKR-OBS-000001 (Observation PKR) — revised

| Common Field | Value |
|---|---|
| PKR ID | PKR-OBS-000001 |
| Status | **Published** (Comparison Image PKR gap documented, not blocking — see title-line note and §4) |
| Version | 1.0 (content approved) |
| Founder Approval Date | 23 August 2026 (content only — see Status) |
| Supporting Source(s) | PKR-SRC-000001 through PKR-SRC-000014 (dead-wood commission's diagnostic sources plus the §6 Founder observation) — see per-signal table below for which signal each supports |
| Evidence Confidence | **See per-claim confidence below** (PKR Standard §4.2, Draft v0.06) — this Common Field is no longer a single blended value |
| Linked Decision Logic PKR | **PKR-DEC-000001 (§3 below) — no longer missing** |

**Visual Criteria** *(per-signal confidence, unchanged from the dry run; Source PKR(s) column added 23 August 2026)*:

| Signal | Candidate reading | Supporting finding | Evidence Confidence | Photographable? | Source PKR(s) |
|---|---|---|---|---|---|
| External stem/bark colour | Green → living. Brown/gray/black/shriveled → dead. Caution on older/bronze canes. | AF-2 | Moderate | Yes | PKR-SRC-000001, 000002, 000003, 000009, 000013 |
| Dormant bud presence | Plump visible buds → living. None anywhere → dead. | AF-3 | Moderate | Yes | PKR-SRC-000006, 000009, 000013 |
| Lesion pattern | Present → possible canker, not routine dead wood. | AF-5 | Low | Yes, partially | PKR-SRC-000011, 000012 |
| Pith colour (cut required) | White/pale-green → living. Brown/gray/black → dead. | AF-1 | **High** | No | PKR-SRC-000001, 000004, 000005, 000006, 000007, 000009, 000013 |
| Flexibility/brittleness (bend required) | Bends → living. Snaps, brittle → dead. | AF-4 | Low | No | PKR-SRC-000010 |

**What the Photo Cannot Establish:** unchanged (ARC §6 Founder observation). Traceable to **PKR-SRC-000014**.

Everything else unchanged from the v0.2 package.

---

## 3. PKR-DEC-000001 (Decision Logic PKR) — new

| Common Field | Value |
|---|---|
| PKR ID | PKR-DEC-000001 |
| PKR Type | Decision Logic PKR |
| Title | Dead vs. living wood — cut/leave decision |
| Status | **Published** |
| Version | 1.0 (content approved) |
| Founder Approval Date | 23 August 2026 (content only — see Status) |
| Applies To | Established bush rose; dormant pruning |
| Supporting Source(s) | AF-7: PKR-SRC-000001, 000002, 000003, 000004, 000005, 000006, 000007, 000008, 000013. AF-8: PKR-SRC-000002, 000006, 000007. "Leave" (§6A): PKR-SRC-000015. |
| Evidence Confidence | See per-claim confidence below |
| Governing Observation(s) | PKR-OBS-000001 |

**Available Choices and Conditions** *(updated v0.4 — now references the Dormancy Suitability Gate PKR; Source PKR(s) column added 23 August 2026)*:

| Confirmed observation | Available choice | Condition | Evidence Confidence | Source PKR(s) |
|---|---|---|---|---|
| Confirmed dead wood | **Cut** — remove back into living tissue (white/pale-green pith, green bark), not just at the first sign of dead tissue | Standard case, **and** PKR-SGT-000001's dormancy gate passes | **High** (AF-7); gate condition **High** (AF-1) | PKR-SRC-000001, 000002, 000003, 000004, 000005, 000006, 000007, 000008, 000013 |
| Confirmed dead wood, dieback persists after repeated cuts | **Cut, escalating** — continue removal toward the bud union or the entire cane | Only where dieback continues despite incremental cutting, **and** the dormancy gate passes | **Moderate** (AF-8); gate condition **High** (AF-1) | PKR-SRC-000002, 000006, 000007 |
| Confirmed living wood | **Leave** (under this decision rule specifically — may still be affected by a different observation's rule, e.g. framework selection) | Definitional complement of the above, not independently evidenced | Not Applicable — Founder observation, ARC §6A | PKR-SRC-000015 |

This record is now dependency-blocked on PKR-SGT-000001 as well as on its pre-existing Comparison Image PKR dependency (§4 below) — the dormancy gate must itself receive Founder operational approval and publication before this record can publish, even though its own content is otherwise ready for review.

**Deferral Triggers:** None. **Confirmed by the Founder, 23 August 2026** — genuinely uncertain diagnosis (AF-5's canker ambiguity) routes to "Not Sure" at the Observation PKR level (§2 above) before reaching this Decision Logic PKR at all, so no deferral trigger belongs here specifically. This is not a gap.

---

## 4. Remaining Dependencies

| Dependency | Status |
|---|---|
| Linked Comparison Image PKR(s) (PKR-OBS) | **Still missing.** No reference photographs exist anywhere in the KCS. **Founder decision, 24 August 2026: does not block publication** — documented as an open gap on the published record instead (see title-line note); a Comparison Image PKR should still follow as a revision once photographs exist. |
| Linked Decision Logic PKR (PKR-OBS) | **Resolved 24 August 2026** — PKR-DEC-000001 published the same day (below), satisfying this dependency. |
| Dormancy Suitability Gate reference (PKR-DEC) | **Resolved 24 August 2026** — PKR-SGT-000001 published the same day, so PKR-DEC-000001's Conditions now cite a published gate. |
| Source PKRs (both records) | **Fully resolved 23 August 2026** — PKR-SRC-000001 through PKR-SRC-000015, in `PKR-SRC-submission.md`, built, Founder-approved, and Published, cited above in the Supporting Source(s) fields and per-signal/per-choice tables. This dependency no longer blocks either record. |

---

## 5. What This Round Actually Fixed

Two real defects, not just gaps: the Common Field that mechanically blended AF-1's High down to a PKR-wide Low is gone, replaced by the per-claim table that was already honestly sitting there. And the Decision Logic PKR — the part that actually tells a gardener what to do — now exists with real, separately-sourced, separately-confidence-rated content (High for the basic cut-back rule, Moderate for the escalation case), instead of being treated as plumbing to fill in whenever.

One thing left open for you, smaller than before: the Decision Logic PKR's Deferral Triggers are currently empty — I didn't find or infer a case that belongs there specifically, and said so rather than guess one in.

**v0.4 addition:** the Conditions field now cites the newly-built Dormancy Suitability Gate PKR (`PKR-SGT-000001-submission.md`), closing the completeness gap noted when this record was first drafted. Neither this record nor the gate can publish until both have Founder operational approval — they're now linked dependencies of each other.

---

# End of Document

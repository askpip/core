# KIT Dry Run — Draft PKR Attempt from ARC-BUSHROSE-DEADWOOD-01

**Status:** Test artifact, not a governed KCS document type. Prepared to discover what KIT's Operations Manual actually needs to specify, by attempting real work first — the same pattern that produced the Founder Review Dossier Standard and the Assessed Finding model earlier in this session.

**Prepared by:** an AI instance acting in KIT's authorised capacity per the KIT Charter v0.02, using only documents that currently exist: the KIT Charter, the PKR Standard v0.05, the LIL Standard v0.02, the Mother Information Library Standard v0.05, the Pip Runtime Architecture v1.0, and the Knowledge Integration Workflow v0.04. No KIT Operations Manual exists yet — that absence is exactly what this dry run tests.

**Date:** 22 August 2026

**Source:** ARC-BUSHROSE-DEADWOOD-01 (the only ARC currently in the Mother Information Library)

**Instruction followed:** Build one draft Observation PKR and its required Source PKR(s), plus a Founder Review Rendering, from this ARC — and flag, rather than improvise past, anything that cannot be determined from currently approved information, per the KIT Charter's Limitations of Authority ("shall not fill a gap in approved MIL information through inference or invention").

---

## Part A — What Was Built

### A.1 PKR-OBS-BUSHROSE-DEADWOOD-01 (Observation PKR) — DRAFT, INCOMPLETE

| Common Field | Value |
|---|---|
| PKR ID | PKR-OBS-BUSHROSE-DEADWOOD-01 *(proposed identifier — see §C.6)* |
| PKR Type | Observation PKR |
| Title | Dead versus living wood (established, dormant bush rose) |
| Status | Draft |
| Version | 0.1 |
| Applies To | Established bush rose; dormant pruning (Bush Rose V1 MVP scope) |
| Supporting Source(s) | PKR-SRC-BUSHROSE-DEADWOOD-01 through -05 (§A.2) |
| Founder Approval Date | Not yet approved |
| Related PKRs | Linked Decision Logic PKR: **not yet built — see Gap 3.** Linked Comparison Image PKR(s): **not yet built — see Gap 2.** |
| Preserved Uncertainty or Limitations | External colour can mislead on older/bronze canes (AF-2); bud-presence reliability where damage has a non-death cause is unestablished (AF-3); flexibility/brittleness test is single-sourced and not rose-specific (AF-4); only cane canker was investigated as a lookalike condition, from two sources (AF-5) |
| Evidence Confidence | **Low** — see Gap 5. Per PKR Standard §4, a PKR drawing on multiple Assessed Findings of differing confidence must carry forward the *lowest* applicable level, never average or round up. This PKR draws on AF-1 (High) through AF-5 (Low); the mandatory result is Low, even though the primary indicator (AF-1) is independently High. |

**Observation Name:** Dead versus living wood

**Visual Criteria** *(structured for the Perception Layer per Pip Runtime Architecture §8.2, not written only as prose)*:

| Signal | Candidate reading | Supporting finding | Photographable? |
|---|---|---|---|
| External stem/bark colour | Green → candidate living. Brown / gray / black / shriveled → candidate dead. **Caution: can misread live wood on older or bronze-cultivar canes as dead.** | AF-2 (Moderate) | Yes |
| Dormant bud presence along the cane | Plump, visible buds anywhere on the cane → candidate living. No visible buds anywhere on the cane → candidate dead. | AF-3 (Moderate) | Yes |
| Lesion pattern (sunken, discoloured, sometimes target-ringed areas) | Present → candidate cane canker (disease), not simple dead wood; do not treat as a routine dead-wood call. | AF-5 (Low) | Yes, partially — see Gap 1 |
| Pith colour (requires a cut) | White/pale-green → living. Brown/gray/black → dead. **This is the strongest indicator (AF-1, High) but cannot be assessed from a photograph at all.** | AF-1 (High) | **No** |
| Stem flexibility/brittleness (requires a bend test) | Bends → candidate living. Snaps cleanly, feels brittle → candidate dead. | AF-4 (Low) | **No** |

**What the Photo Cannot Establish:** *(Gap 1 resolved 22 August 2026 — see below)* A photograph is a two-dimensional external image. It cannot show a stem's internal pith colour, which requires cutting into the stem, or whether a stem bends or snaps, which requires physically manipulating it — the two most decisive tests this record's evidence identifies. A photograph can reasonably show external colour, visible dormant buds, and lesion patterns that may indicate disease. Where a photo-based read is uncertain, physical examination remains necessary before a dead/living determination is treated as confirmed. *(Source: ARC-BUSHROSE-DEADWOOD-01 §6, Founder observation.)*

**Linked Comparison Image PKR(s):** **GAP — none exist. See Gap 2.**

**Linked Decision Logic PKR:** **GAP — none exists. See Gap 3.**

**Confirmation Requirement:** This observation requires the gardener to examine the physical rose and confirm before any decision proceeds (structural MVP requirement, Architecture §4.2).

**Confirmation Responses** *(closed set, per Pip Runtime Architecture §6, Decision-Relevant Input Boundary)*:

| Response | Routing |
|---|---|
| Confirmed | Proceeds to Linked Decision Logic PKR — **not yet built; this routing cannot currently complete. See Gap 3.** |
| Doesn't Match | Falls back to requesting better evidence or re-examination; does not proceed to Decision Logic. |
| Not Sure | Falls back to recommending experienced local help — directly consistent with AF-5's finding that even an experienced Extension Master Gardener could not resolve a real canker-vs-pigmentation case from a photo and description alone. |

---

### A.2 Source PKRs

| PKR ID *(proposed)* | Supports | Source Type | Source Identity (summary — full citations at ARC §4) | Relevance | Evidence Confidence *(inherited, not independently determined — PKR Standard §5.5)* |
|---|---|---|---|---|---|
| PKR-SRC-BUSHROSE-DEADWOOD-01 | AF-1 | Extension/gardening authority publications (7) | RHS; Oregon State University Extension; Texas A&M AgriLife Extension; Clemson HGIC; UGA CAES; Iowa State Extension and Outreach; American Rose Society | Establishes pith colour as the primary diagnostic test for dead vs. living rose wood | High |
| PKR-SRC-BUSHROSE-DEADWOOD-02 | AF-2 | Extension/gardening authority publications (4–5) | University of Illinois Extension; Iowa State Extension; American Rose Society; RHS; PlantTalk Colorado (caveat) | Establishes external colour as a secondary indicator, with a documented false-negative caveat | Moderate |
| PKR-SRC-BUSHROSE-DEADWOOD-03 | AF-3 | Extension/gardening authority publications (3) | Clemson HGIC; Iowa State Extension; American Rose Society | Establishes dormant bud presence/absence as a corroborating indicator | Moderate |
| PKR-SRC-BUSHROSE-DEADWOOD-04 | AF-4 | Extension publication (1, general woody-plant, not rose-specific) | LSU AgCenter | Establishes the bend/snap flexibility test, unconfirmed for roses specifically | Low |
| PKR-SRC-BUSHROSE-DEADWOOD-05 | AF-5 | Extension publication + real-world Extension case (2) | University of Maryland Extension; Ask Extension / Colorado Master Gardener Program | Establishes that cane canker can resemble ordinary dead wood and may not be reliably distinguishable from a photograph | Low |

AF-6 (sporotrichosis risk) is **not** represented by a Source PKR here — see Gap 4.

---

### A.3 Founder Review Rendering

*(Per PKR Standard §9.2: the complete content above, in plain sentences a Founder can approve or reject without reading the underlying structure.)*

This would be a draft record for one of the six observations the app supports: telling dead wood from living wood on a dormant bush rose.

What a photo could reasonably be used to check: the colour of the outer bark, whether healthy-looking buds are visible along the cane, and whether there's a lesion pattern that might mean disease rather than ordinary dead wood. Each of these has a caution attached — bark colour can be misleading on older or bronze-coloured canes, and a lesion pattern might be canker (a disease) rather than simple winter dieback, which even an experienced gardener sometimes can't tell for certain from a photo alone.

The single best way to tell dead from living wood — cutting into the stem and checking whether the inside is white (alive) or brown (dead) — cannot be done from a photo at all. Neither can the "does it bend or does it snap" test. Both require the gardener to physically check the plant, which the app already requires before any cut is made.

Because this record leans on several pieces of evidence of different strength — some strongly supported, some only thinly — the record as a whole is only rated as weakly-supported overall, even though its single most important signal (the pith-colour test) is strongly supported on its own. That's a direct, and possibly uncomfortable, consequence of a rule your own Standards set: a record can never claim more confidence than its weakest ingredient.

This record is not ready to actually guide a gardener yet. It's missing a photo example to compare against, and it's missing the rule that would tell the app what to actually recommend (cut, leave, or something else) once dead or living wood is confirmed — that rule doesn't exist yet.

---

## Part B — What Could Not Be Completed

This draft cannot yet progress to Founder operational review as a complete, publishable Observation PKR. Six gaps were hit; none were guessed past. One (Gap 1) has since been resolved — see below.

### Gap 1 — "What the Photo Cannot Establish" cannot be populated from approved information — **RESOLVED 22 August 2026**

This field is required by PKR Standard §5.1. The only research that directly addressed this exact question was FRD-BUSHROSE-DEADWOOD-01 §7.5 (the "photograph vs. physical check" synthesis) — but that content had been deliberately **excluded** from ARC-BUSHROSE-DEADWOOD-01 at v1.0, because it is ROC's own reasoned interpretation rather than a sourced Assessed Finding, and the Mother Information Library Standard bars "artificial intelligence assumptions" and "unsupported conclusions" from MIL content.

**Resolution:** Shaphan, AskPIP Founder Authority, approved the substance of FRD §7.5 directly as a **Founder observation** — an information-asset type the MIL Standard independently permits — rather than commissioning new ROC research, since the claim follows logically from AF-1 and AF-4's own already-approved content (both name a physical action a photograph cannot perform) rather than needing new empirical corroboration. This is now recorded at ARC-BUSHROSE-DEADWOOD-01 v1.1 §6, and the Observation PKR draft above (§A.1) has been updated with it.

This is now the worked example for the "escalation path for missing MIL content" chapter recommended for KIT's Operations Manual at §C.3 below.

### Gap 2 — No Comparison Image PKR exists

PKR Standard §5.1 requires at least one Linked Comparison Image PKR. None exist anywhere in the KCS yet — no photographs have been sourced or approved under Architecture §4.3/§7. This blocks the Observation PKR from ever reaching "Approved for Publication," though it does not block drafting it. Sourcing and approving reference photographs is a separate task, outside what a text-based research commission (like the one that produced this ARC) can supply on its own.

### Gap 3 — No Decision Logic PKR exists, and the ARC doesn't contain the decision rule itself

Two related problems. First, mechanically: no Decision Logic PKR has been built for any observation yet, so the Confirmed→routing in §A.1 cannot complete. Second, more fundamentally: even once one is built, it needs its own evidenced content — "removing confirmed dead wood is horticulturally appropriate" is not itself one of ARC-BUSHROSE-DEADWOOD-01's six Assessed Findings. It's strongly implied throughout the source log (several sources instruct removing dead canes outright), but it was never captured as its own discrete, separately-evidenced claim with its own Evidence Confidence Level.

This is a process finding worth carrying into KIT's Operations Manual and, upstream, into how ROC scopes future research commissions: a commission aimed at supporting an Observation PKR should probably also capture the corresponding decision-rule as its own Assessed Finding, not only the diagnostic criteria.

### Gap 4 — AF-6 doesn't belong to this PKR at all

AF-6 (sporotrichosis/thorn-puncture risk) was approved into ARC-BUSHROSE-DEADWOOD-01 alongside the diagnostic findings, but it isn't observation content — it maps to the "suitable personal protection" Suitability Gate area in Architecture §5.4, a different PKR type entirely. This wasn't obvious from the ARC's flat list of six findings; it only surfaced when actually trying to sort each finding into the PKR type system. A future ARC whose findings span more than one destination PKR type would benefit from that routing being made explicit earlier — either by ROC at commission-scoping time or by KIT as a first step before drafting.

### Gap 5 — The "lowest confidence" rule produces a result worth a real decision

Per PKR Standard §4, this Observation PKR's Evidence Confidence is mechanically Low, because it draws on AF-4 and AF-5 (both Low) alongside AF-1 (High). This is the exact question ARC-BUSHROSE-DEADWOOD-01 §7 already flagged as open and unresolved: whether the weak findings should inform this PKR at all. Three real options, not decided here:

- **Keep it as built** — Low overall, but the most complete gardener guidance (includes the flexibility fallback and the canker caution).
- **Narrow the PKR** — drop AF-4 and AF-5's content from this record now, park them for a future revision once better evidenced, and let this PKR reach Moderate on AF-1–AF-3 alone — at the cost of losing the bend-test fallback and the canker caution for now.
- **Commission further research** — pursue the Recommendations for Further Research already listed in the ARC (§9) to strengthen AF-4/AF-5 before finalising this PKR at all.

### Gap 6 — No confirmed PKR identifier format

PKR Standard §6 explicitly leaves this "for KIT to propose and the Founders to confirm when KIT's Operations Manual is drafted." This dry run used `PKR-<TYPE-CODE>-<SUBJECT-SCOPE>-<seq>` (e.g. `PKR-OBS-BUSHROSE-DEADWOOD-01`, `PKR-SRC-BUSHROSE-DEADWOOD-03`) as a working proposal, mirroring the FRD/ARC convention already in use. Not yet confirmed.

---

## Part C — What This Means for KIT's Operations Manual

Six gaps, none hypothetical — each one hit while actually trying to do the work. In rough priority order for what the Operations Manual should specify:

1. A **pre-drafting triage step**: given an ARC, sort its Assessed Findings by which PKR type(s) they actually support before drafting begins (Gap 4 exists because this step doesn't currently exist anywhere).
2. A **documented procedure for the multi-finding confidence rule** (Gap 5) — not to change the rule, but to make "which findings does this specific PKR actually need to draw on" a deliberate drafting decision KIT records and submits for Founder input, rather than a side effect discovered late.
3. A **defined escalation path** for content a required PKR field needs but the ARC doesn't approve (Gap 1) — specifically, how KIT requests either a Founder observation or a new research commission, and how that request is tracked until resolved.
4. **Confirmation of the PKR identifier format** (Gap 6) proposed here.
5. Explicit acknowledgment that an Observation PKR can be drafted and reviewed for its diagnostic content before its Comparison Image and Decision Logic dependencies exist (Gap 2, Gap 3) — i.e., a defined **partial-completeness status** distinct from "Draft" and "Approved for Publication," so KIT isn't blocked from doing useful partial work while photography and decision-rule research catch up.

---

# End of Document

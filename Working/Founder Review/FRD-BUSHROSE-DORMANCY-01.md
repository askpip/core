# DRAFT — NOT APPROVED — FOR FOUNDER REVIEW ONLY

**This document has not been approved by the Founders. It has not entered the Mother Information Library. Nothing in it constitutes operational guidance, approved knowledge, or a Founder decision. Only the Founders may approve it, in whole or in part.**

---

## PIP Research Origin Curator — Founder Review Dossier

Prepared under FRDS v1.1 and EAS v1.3 from the outset — unlike FRD-BUSHROSE-DEADWOOD-01, this commission did not predate those Standards, so no post-hoc restructuring was needed.

---

### 1. Document Metadata

| Field | Value |
|---|---|
| Dossier Identifier | **FRD-BUSHROSE-DORMANCY-01** |
| Document Title | Determining Dormancy — Established Bush Rose, by Location and Season |
| Commission Reference | How shall a gardener (and Pip) determine whether an established bush rose is currently dormant and in an appropriate window for pruning, accounting for location and season? (Research Commission Identifier: not yet assigned — same open naming-convention gap as FRD-BUSHROSE-DEADWOOD-01, see §11) |
| Status | Draft — submitted for Founder Review |
| Prepared By | PIP Research Origin Curator (ROC) — AI-performed instance |
| Date | 22 August 2026 |
| Related Documents | ROC Charter; ROC Operations Manual; EAS v1.3; FRDS v1.1; Ask Pip MVP – Bush Rose V1 Architecture §5.4 |

**Evidence Confidence Level summary:**

| # | Assessed Finding | Evidence Confidence Level | Independent Sources |
|---|---|---|---|
| AF-1 | Bud swell (not calendar date or full leaf loss) is the primary biological signal that a dormant bush rose has reached the appropriate pruning window | **High** | 4 |
| AF-2 | The appropriate pruning window's calendar timing varies enormously by climate/hemisphere and must be locally calibrated; the "coldest part of winter has passed, active growth has not yet begun" window is the underlying constant, not any fixed date | **High** | 6 |
| AF-3 | Mild or warm-winter climates can disrupt or complicate dormancy assessment — full leaf drop may not occur, and unseasonable warmth risks premature bud break | **Moderate** | 3 |

---

### 2. Research Commission Record (Summary)

| Field | Value |
|---|---|
| Commission Identifier | Not assigned |
| Commission Title | Determining bush rose dormancy by location and season |
| Date Received | 22 August 2026 |
| Requesting Authority | Founder (Shaphan), prompted by identifying that the MVP's Suitability Gate PKRs — specifically dormancy determination — are a prerequisite to every pruning observation and decision, and had not yet been researched |
| Research Objective | Establish how to determine whether an established bush rose is dormant and in an appropriate pruning window, for the "dormancy or active growth" Suitability Gate (Architecture §5.4) |
| Priority | High — identified as a blocking dependency of the already-drafted Decision Logic PKR for dead-vs-living wood |
| Current Status | Research, evaluation and synthesis complete; submitted here for Founder Review |
| Related Commissions | FRD-BUSHROSE-DEADWOOD-01 / ARC-BUSHROSE-DEADWOOD-01 — this commission supports a Suitability Gate PKR that the dead-vs-living-wood Decision Logic PKR's Conditions field will need to reference |

**Scope:** This commission addresses only the "dormancy or active growth" Suitability Gate. It does not address the other eight gate areas in Architecture §5.4 (supported rose type, recent planting, stress/damage/disease, tool condition, personal protection, safe access, adequate photographs/confidence — sporotrichosis/personal protection is already covered by AF-6, ARC-BUSHROSE-DEADWOOD-01). "Recently planted" surfaced repeatedly in search results as an adjacent question and is recommended, not addressed, as future work (§9).

---

### 3. Research Plan

Research questions:

1. What visual or physical signs indicate a bush rose has reached the appropriate dormant-season pruning window?
2. How does the timing of that window vary by location, climate and hemisphere?
3. How do mild or warm-winter climates affect dormancy — does the plant fully lose its leaves, and can premature bud break occur?
4. Is a fixed calendar date sufficient, or does determination require combining location with an observable biological signal?

Anticipated source types: university/government cooperative extension horticulture services, spanning multiple climates and both hemispheres, given the product's need to work across locations. Anticipated challenge, confirmed during research: dormancy-*sign* content and pruning-*timing* content are often bundled in the same source without clearly separating "how do I know it's dormant" from "when should I prune" — most sources answer the second question directly and the first only implicitly, through the timing guidance itself.

---

### 4. Evidence Collected — Source Log

All sources retrieved by live web search and page fetch, 22 August 2026.

1. **Oregon State University Extension Service.** "When should I prune my roses?", Ask Extension. Accessed 22 Aug 2026: https://extension.oregonstate.edu/ask-extension/featured/when-should-i-prune-my-roses. Western Oregon: *"mid-February to early March."* Eastern/Central Oregon: wait until April, after severe freezes but while still dormant. *"If you prune early, you may experience dieback and have to re-prune again after better weather arrives."*

2. **North Carolina State University Cooperative Extension, Jackson County Center.** "When to Prune Roses." Accessed 22 Aug 2026: https://jackson.ces.ncsu.edu/2026/02/when-to-prune-roses. *"The best way to judge when to prune is to look at the buds; when they begin to swell, go ahead and prune"* — note, quoted by the fetch tool from this page in reference to phenological ("prune when forsythia blooms") timing guidance. Single-blooming roses pruned after flowering; repeat-bloomers pruned in winter/dormancy.

3. **University of Arkansas Cooperative Extension Service.** "Pruning," Reference Desk — Roses. Accessed 22 Aug 2026: https://www.uaex.uada.edu/yard-garden/in-the-garden/reference-desk/roses/pruning.aspx. Recommended window: *"late February through early March,"* before new growth is well underway; flexible to late March if weather (snow/ice) requires. *"Roses in Arkansas remain semi-evergreen through most winters, retaining some foliage even when dormant"* — full leaf loss is not a reliable local sign.

4. **University of Arizona Cooperative Extension, Yavapai County.** "Pruning Roses." Accessed 22 Aug 2026: https://cales.arizona.edu/yavapai/anr/hort/byg/archive/pruningroses2015.html. *"The best way to judge when to prune is to look at the buds; when they begin to swell, go ahead and prune."* Repeat-blooming roses pruned in spring "just as the buds break dormancy"; once-blooming/climbing roses pruned immediately after flowering.

5. **University of Minnesota Extension.** "How will this warm winter affect my plants?" Accessed 22 Aug 2026: https://extension.umn.edu/yard-and-garden-news/how-will-warm-winter-affect-my-plants. General woody-plant guidance, **not rose-specific**. Dormancy is primarily controlled by day length (photoperiodism) and temperature. *"If your tree or shrub is showing signs of emerging from winter dormancy, like exhibiting swollen buds or if buds have already opened up, then it is best to hold off on winter pruning for this season."* Warns that a warm winter can cause premature bud break, and resulting tender growth "will likely die" on a subsequent hard freeze.

6. **New York Botanical Garden, Mertz Library Reference.** "When is the best time to prune roses?" Accessed 22 Aug 2026: https://libanswers.nybg.org/faq/223492. Repeat-blooming roses: *"Prune in late March or early April once the buds start to break."* Once-blooming roses: within a month after flowering. Advises consulting a local American Rose Society affiliate for region-specific guidance beyond the NYC area.

7. **Dunedin Botanic Garden (Dunedin City Council, New Zealand).** "Practical Tips for Rose Pruning." Accessed 22 Aug 2026: https://www.dunedin.govt.nz/bg/collections/garden-life-article/practical-tips-for-rose-pruning. Recommended NZ/Southern Hemisphere timing: **late July**, when roses "are at their most dormant and hopefully the heaviest of frosts have passed." General principle stated directly: *"the colder the climate, the later you prune in winter."*

8. **University of Washington, Elisabeth C. Miller Library ("Plant Answer Line" / hortlib).** "Pruning roses." Accessed 22 Aug 2026: https://depts.washington.edu/hortlib/pal/pruning-roses. Pacific Northwest guidance notes **conflicting advice within the same region**: *"most sources recommend pruning in late fall or early spring,"* but some recommend winter (dormant) pruning and others spring; recommends consulting a local rose society. Does not itself state a visual dormancy sign.

9. **University of California Agriculture and Natural Resources, UC Master Gardener Program.** "Pruning Roses and Cultivating Beauty," Statewide Blog. Accessed 22 Aug 2026: https://ucanr.edu/blog/uc-master-gardener-program-statewide-blog/article/pruning-roses-and-cultivating-beauty. California mild-winter guidance: *"the ideal time for pruning is typically between late winter and early spring."* *"If the plant is dormant (recommended), remove all remaining leaves"* — implying leaves may still be present in mild climates and are sometimes manually stripped rather than naturally shed.

---

### 5. Evidence Evaluation

**AF-1 — Bud swell as the pruning-readiness signal.** *Relevance:* direct. *Source reliability:* high — four institutional cooperative-extension/library sources across four distinct US states. *Consistency:* strong and independently worded ("look at the buds; when they begin to swell," "swollen buds," "buds start to break," "buds break dormancy"). *Independence:* genuine — NC State, Arizona, Minnesota and NYBG are unrelated institutions; NC State and Arizona's near-identical phrasing ("the best way to judge when to prune is to look at the buds...") is close enough to raise the possibility of shared original wording rather than fully independent drafting — noted as a limitation rather than ignored, per EAS §4.5. *Limitations:* the near-identical NC State/Arizona phrasing described above; UMN's source is general-shrub, not rose-specific.

**AF-2 — Climate/hemisphere-dependent timing, "past the cold, before growth" as the constant.** *Relevance:* direct. *Source reliability:* high — six institutional sources spanning Oregon, Arkansas, New York, New Zealand (a government-run public garden), Washington and California. *Consistency:* every source gives a different calendar window (mid-Feb–March in western Oregon, April in eastern Oregon, late Feb–March in Arkansas, late March–April in New York, late July in New Zealand), which at first looks like disagreement — but each is consistent with the same underlying rule Dunedin states explicitly ("the colder the climate, the later you prune") and OSU implies (prune after hard freezes but before active growth). *Independence:* genuine, wide geographic and institutional spread, including a rare Southern Hemisphere institutional source. *Limitations:* the University of Washington source explicitly documents unresolved disagreement even within one region (Pacific Northwest) about fall versus spring timing — preserved as a documented inconsistency, not resolved by preferring one source.

**AF-3 — Mild/warm-winter complications.** *Relevance:* direct. *Source reliability:* high (UMN is a major land-grant extension service; Arkansas and UC ANR are both directly rose-specific). *Consistency:* UMN's warm-winter/premature-bud-break warning, Arkansas's semi-evergreen/no-full-leaf-drop note, and UC ANR's mild-climate manual-defoliation practice all point the same direction without contradiction. *Independence:* three separate institutions. *Limitations:* UMN's source is general-shrub, not rose-specific, the same pattern that limited AF-4 in the dead-vs-living-wood commission; only three sources total, fewer than AF-1 or AF-2.

---

### 6. Managing Conflicting Evidence and Uncertainty

The wide spread of calendar windows across sources (§5, AF-2) is not treated as disagreement requiring resolution — it is exactly what AF-2 itself states: timing is climate-dependent, so different regional sources correctly giving different dates is expected, not conflicting.

Genuine, source-documented disagreement does exist within one region: the University of Washington source (Source 8) states that even within the Pacific Northwest, "some sources recommend winter pruning when dormant and others suggesting spring is optimal," without resolving which is correct. This is preserved as unresolved rather than adjudicated by ROC.

The near-identical wording between Sources 2 and 4 (§5, AF-1) is flagged as a possible shared-origin limitation rather than treated as full independent corroboration, consistent with EAS §4.5.

---

### 7. Principal Findings

**7.1 AF-1 — Bud swell as the pruning-readiness signal (established finding).** The reliable biological signal that a dormant bush rose has reached its appropriate pruning window is dormant buds beginning to swell — not a fixed calendar date, and not the complete absence of leaves. Sources describing this recommend pruning at or just before bud swell, before active leaf-out is well underway.

**7.2 AF-2 — Climate/hemisphere-dependent timing (established finding).** There is no single calendar window that applies everywhere. The underlying constant across every source, once the wide date range is examined, is the same: prune after the coldest part of winter and the heaviest frost risk has passed, but before active spring growth is well underway. The specific calendar dates this produces vary enormously — by roughly five months across the sources gathered here (mid-February in western Oregon to late July in Dunedin, New Zealand) — because it is a function of local climate and hemisphere, not a universal date.

**7.3 AF-3 — Mild/warm-winter complications (established finding, moderate evidence).** In mild or unseasonably warm climates, two specific complications to straightforward dormancy assessment are documented: bush roses may not fully lose their leaves through winter (semi-evergreen behaviour, Arkansas; manual defoliation practice, California), so waiting for complete leaf drop is not a reliable local sign; and unseasonable warmth can trigger premature bud break, after which tender new growth is vulnerable to a subsequent cold snap (Minnesota, general-shrub evidence).

**7.4 Interaction between AF-1 and AF-2/AF-3 (ROC observation, not independently sourced).** Taken together, AF-1's bud-swell signal is the most location-independent way to operationalise "is this rose in its appropriate pruning window" — it works whether the local calendar window is February or July — provided AF-3's caveat is respected: in a mild climate, bud swell (not leaf presence or absence) remains the signal to watch for, since leaf state is unreliable there. This connects the three findings but is ROC's own synthesis, not a claim any single source states directly, and is flagged accordingly, consistent with the treatment given to the equivalent synthesis in FRD-BUSHROSE-DEADWOOD-01 §7.5.

---

### 8. Evidence Assessment

**Assessment date:** 22 August 2026. **Assessor:** PIP Research Origin Curator (ROC), AI-performed instance.

**8.1 AF-1.** **Evidence Confidence Level: High.** Rationale: four independent institutional sources converge on bud swell as the operative signal, in largely independent wording. Limitation noted: two of the four (Sources 2, 4) share near-identical phrasing, a possible common-origin limitation rather than fully independent confirmation — considered and not treated as invalidating the finding, since the other two sources (Minnesota, NYBG) corroborate independently in different wording.

**8.2 AF-2.** **Evidence Confidence Level: High.** Rationale: six independent institutional sources across a very wide geographic and hemispheric spread all support the same underlying rule once the surface-level date variation is examined; the Washington source's documented internal disagreement is a limitation on precision within one region, not on the core finding.

**8.3 AF-3.** **Evidence Confidence Level: Moderate.** Rationale: three sources, consistent and non-contradictory, but fewer than AF-1 or AF-2, and one of the three (Minnesota) is general-shrub rather than rose-specific — the same pattern EAS treats as a limitation elsewhere in this project's work.

**8.4 §7.4 interaction observation.** Not assigned an Evidence Confidence Level — ROC's own synthesis connecting AF-1 through AF-3, not itself a sourced claim, per the same treatment given to FRD-BUSHROSE-DEADWOOD-01 §7.5.

**Summary table** (repeated from §1):

| Assessed Finding | Evidence Confidence Level |
|---|---|
| AF-1 — Bud swell as pruning-readiness signal | High |
| AF-2 — Climate/hemisphere-dependent timing | High |
| AF-3 — Mild/warm-winter complications | Moderate |
| §7.4 — Interaction observation | Not Assigned (ROC interpretation) |

---

### 9. Recommendations for Further Research

- A dedicated commission on "recently planted" thresholds (Architecture §5.4) — this surfaced repeatedly in search results as a related but distinct question, and was not investigated here to keep this commission's scope disciplined.
- Independent, ideally rose-specific, corroboration of AF-3 beyond the single general-shrub source (Minnesota), to raise it toward AF-1/AF-2's strength.
- Investigate the Washington source's documented internal disagreement (fall vs. spring pruning within one region) directly, rather than leaving it unresolved.
- Consider whether a chill-hours or degree-day model (raised in search results but not investigated in depth here) would materially improve on "bud swell" as a location-independent signal, or whether it adds complexity without a corresponding accuracy gain for a beginner-facing product.

---

### 10. Founder Decision Points

- Whether AF-1 (High) and AF-2 (High) are sufficient, on their own, to build the Dormancy Suitability Gate PKR now, with AF-3 (Moderate) included as a documented caveat rather than a blocking condition.
- Whether §7.4's interaction observation — bud swell as the operative signal regardless of calendar window, with the mild-climate caveat attached — is an acceptable basis for the Suitability Gate PKR's actual Question/Check and Acceptable Answer(s) (PKR Standard §5.4), given it is ROC's synthesis rather than a directly sourced claim.
- Whether to commission the "recently planted" research now, alongside building this gate, or treat it as separate future work.

This dossier presents these questions for Founder consideration; it does not resolve them.

---

### 11. Documentation Notes

Same open gap as FRD-BUSHROSE-DEADWOOD-01 §11 Item 2: no Research Commission Record numbering convention exists yet; Commission Identifier left unassigned here for the same reason.

---

**End of Draft Founder Review Dossier — awaiting Founder Review.**

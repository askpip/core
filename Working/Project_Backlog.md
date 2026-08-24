# AskPIP Project Backlog

**Purpose:** A single running list of open items — flagged gaps, deferred research, pending Founder decisions, and known dependencies — surfaced during real work rather than invented in advance. This is not part of the controlled documentation chain (it's not a Standard, Charter, or Operations Manual, and nothing here is approved knowledge); it's a working tool so nothing flagged gets lost between sessions.

**Last Updated:** 23 August 2026 (Source PKR build round)

---

## How to use this list

- **Before starting new work** (a research commission, a PKR build, a Standard revision), check the relevant section below for open items that should be picked up alongside it, rather than creating a fresh one that duplicates something already flagged.
- **When new work surfaces a gap** it doesn't resolve, add it here rather than only mentioning it in conversation — a flag that lives only in a chat message is easy to lose.
- **When an item is resolved**, move it to "Resolved" at the bottom with the date and the document that resolved it, rather than deleting it — this list is also a quick history of what's been caught and fixed.
- Each item names the document(s) it traces back to, so context isn't lost even if the item sits untouched for a while.

---

## Pending Founder Decisions

Items where research or drafting is complete and a decision is waiting.

- [ ] **AF-3 plant-profile questionnaire question** (ARC-BUSHROSE-RECENTPLANT-01 §6) — whether to add "can you see a knot or swelling near the base of the plant" to `NewPlant.tsx` / Architecture §6.1's profile fields, recorded as data only, not wired into any gate. Flagged, not confirmed, when the two-tier gate was locked in.
- [ ] **FRD-BUSHROSE-DORMANCY-02 §10 / caveat design:** whether the Moderate-confidence finding (bud swell holds in mild/warm climates) is enough to fold AF-3's caveat into a single unified rule, keep it as a separate blanket caveat, or make it a *conditionally-shown* caveat (surfaced only to gardeners in mild-climate regions) — the three options discussed but not yet decided. If the conditional design is chosen, PKR-SGT-BUSHROSE-DORMANCY-01 will need rebuilding.

**Fourteen items resolved 23 August 2026 — see Resolved section.**

---

## Interface / Architecture Work

- [ ] **Pip Runtime Architecture:** specify the tap-to-reveal behaviour for gardener-facing confidence levels — pressing a shown confidence label should retrieve and present the matching Definition PKR's Plain-Language Explanation (PKR-DEF-EVIDENCE-CONFIDENCE-0X), not have Pip generate an explanation freely. Not yet drafted; flagged in `PKR-DEF-EVIDENCE-CONFIDENCE-submission.md` §4.

---

## Research Commissions — Not Yet Started

- [ ] ~~"Recently planted" thresholds~~ — **researched, approved, and PKR-SGT-000002 drafted, 23 August 2026** — see Resolved section (ARC-BUSHROSE-RECENTPLANT-01). Done, pending only the Source PKR review tracked in Pending Founder Decisions above.
- [ ] **Remaining Suitability Gate areas** beyond dormancy and recent planting (Architecture §5.4): rose type, stress/damage/disease, tool condition, safe access, adequate photographs/confidence. (Personal protection is partially covered by AF-6 of ARC-BUSHROSE-DEADWOOD-01.)
- [ ] **The other five MVP pruning observations** (Architecture §5.2): damaged growth, crossing/rubbing stems, inward-growing stems, weak/congested growth, main framework to retain. No research commissioned yet — only dead-vs-living wood has been researched. **PKR-SGT-000002 (recently planted gate) is written to govern these five once they exist** — it does not gate PKR-DEC-000001 (dead wood), which is exempted per AF-1.
- [ ] **Three-tier "light shaping" gate redesign** (ARC-BUSHROSE-RECENTPLANT-01 AF-4, deferred 23 August 2026) — whether to extend PKR-SGT-000002 from two tiers (dead-wood-only / full set) to three (dead-wood-only / dead-wood-plus-light-shaping / full set). Needs a KIT/Founder judgement call on which of the six MVP observations count as "light" — not evidenced by any source found so far. Deliberately shipped without this refinement; revisit once there's an actual observation to test it against.

---

## Research Commissions — Recommended Follow-Ups on Existing Findings

- [ ] **AF-4, ARC-BUSHROSE-DEADWOOD-01** (stem flexibility, Low confidence) — seek an additional, ideally rose-specific, source before presenting with the same weight as AF-1.
- [ ] **AF-5, ARC-BUSHROSE-DEADWOOD-01** (canker/lookalike conditions, Low confidence) — investigate whether diseases or damage beyond cane canker commonly produce a dead-wood-like appearance.
- [ ] **AF-6, ARC-BUSHROSE-DEADWOOD-01** (sporotrichosis, Moderate confidence) — seek independent corroboration beyond the single source, ideally quantifying practical risk frequency.
- [ ] **AF-3, ARC-BUSHROSE-DEADWOOD-01** (dormant buds indicator) — investigate whether bud damage from causes other than cane death could produce a false "dead" reading.
- [ ] **AF-8, ARC-BUSHROSE-DEADWOOD-01** (escalating removal, Moderate confidence) — seek independent corroboration beyond its two sources, ideally with data on how often escalation is actually needed.
- [ ] **AF-3, ARC-BUSHROSE-DORMANCY-01** (mild/warm-winter complications, Moderate confidence) — seek independent, ideally rose-specific, corroboration beyond the single general-shrub source (Minnesota).
- [ ] **University of Washington source's internal disagreement** (fall vs. spring pruning within the Pacific Northwest, noted at ARC-BUSHROSE-DORMANCY-01 AF-2) — investigate directly rather than leaving unresolved.
- [ ] **Chill-hours / degree-day model** — consider whether this would materially improve on "bud swell" as a location-independent signal, or add complexity without a matching accuracy gain (ARC-BUSHROSE-DORMANCY-01 §6).
- [ ] **A fourth independent source for FRD-BUSHROSE-DORMANCY-02's AF-1** — specifically one stating that bud swell should be watched *even where* leaves haven't dropped, the exact tandem claim not yet found despite two rounds of searching. Would be the clearest path to raising that finding to High.

---

## Structural / Project-Wide Gaps

- [ ] **Source PKR for AF-6 (sporotrichosis)** — not built in this round; AF-6 isn't cited by any built PKR yet (future personal-protection Suitability Gate). Build when that gate is built.
- [ ] **PKR-OBS-000001 / PKR-DEC-000001 / PKR-SGT-000001 are still not published**, even though their Source PKR dependency is now fully resolved — each is blocked on something unrelated: PKR-OBS-000001 on the missing Comparison Image PKR; PKR-DEC-000001 on PKR-SGT-000001 not yet being published; PKR-SGT-000001 on its undrafted "Not sure" fallback wording and the still-open caveat-design decision (item above, Pending Founder Decisions). Worth remembering that publishing the Source PKRs was one dependency among several, not the last one.
- [ ] **Do Definition PKRs need a Source PKR at all?** Surfaced while content-approving the confidence-level Definition PKRs: their "source" is a Standard (EAS §5.4) directly, not an ARC/Assessed Finding, which is what the existing Source PKR mechanism (PKR Standard §5.5) is built around. Not yet settled whether Definition PKRs describing Standards-level terms need a Source PKR, or may cite the Standard directly.
- [ ] **Comparison Image PKR(s)** for dead vs. living wood — no reference photographs exist anywhere in the KCS yet. Blocks publication of PKR-OBS-BUSHROSE-DEADWOOD-01. Deliberately not rushed — "a different kind of work," per earlier session discussion.
- [ ] **ROC-to-KIT formal notification mechanism** — doesn't exist yet; commissions have so far been triggered by direct Founder instruction instead (KIT OM §3.3, §9.5). Flagged as a future PIP Knowledge Integration Workflow revision once integration volume makes an informal trigger impractical.
- [ ] **Stale duplicate files** in `Working/Drafts` and possibly `Working/Founder Review` — noted earlier in the project as needing cleanup; blocked at the time on the device shell being unavailable. Worth rechecking now that the device bridge has been reliable this session (deletion itself may still need `device_request_delete_permission`).

---

## Standing Notes (not action items — context to keep in view)

- The **Founder Executive Brief (FEB)** was retired at ROC OM v2.4 because a single Founder reviewing every commission directly makes a summary document redundant. It "may be reinstated by future Founder decision if review volume grows" — worth remembering if/when more reviewers are involved.
- The **EAS §2.10 / ROC OM §8.4A pattern** (an assessor's reasoned synthesis is valuable, must never be adopted directly, but must be routed to further research) is now standing policy — worth applying automatically any time a future commission's ROC instance produces an "interaction observation" of its own, without needing to re-litigate it each time.
- The **Wording/Translation Boundary pattern** (KIT may clarify, never alter — PKR Standard §4.3, KIT OM §7.7) applies to *any* AI-authored gardener-facing wording, not just the two cases that prompted it — worth keeping in mind for the Definition PKR explanations above and any future gardener-facing copy.

---

## Resolved

*(Move items here, with date and resolving document, once closed out.)*

- **PKR ID format rewritten to drop subject-scope entirely, for every type** — 23 August 2026, KIT OM v0.4 §10.2. Supersedes the same-day v0.3 confirmation of the subject-scoped format and its `EVIDENCE-CONFIDENCE` extension. New format: `PKR-<TYPE-CODE>-<sequence>` (six-digit, zero-padded, per type code). Reasoning: scope was already duplicated in Title/Applies To, an ID can't track a record's scope if it changes, and Pip's retrieval should query fields, not parse ID strings.
- **Four existing Draft PKRs (eight records total, five of them Definition PKRs) migrated to the new format** — 23 August 2026, KIT OM v0.4 §10.5 (mapping table); content and approval status unaffected. Permitted under new §10.2B: a Draft record's ID may be corrected before it reaches Approved for Publication, since nothing outside the KCS depends on it yet.
- **PKR-DEC-000001 Deferral Triggers confirmed as correctly empty, not a gap** — 23 August 2026, `PKR-OBS-BUSHROSE-DEADWOOD-01-submission.md` (filename unchanged; record ID migrated, see above).
- **PKR-OBS-000001 / PKR-DEC-000001 content approved** (Version → 1.0; still Draft — Dependency-Blocked pending Comparison Image, the Dormancy gate, and Source PKRs) — 23 August 2026, `PKR-OBS-BUSHROSE-DEADWOOD-01-submission.md`.
- **PKR-SGT-000001 content approved** (Version → 1.0; still Draft — Dependency-Blocked pending Source PKRs, and pending the caveat-design decision above) — 23 August 2026, `PKR-SGT-BUSHROSE-DORMANCY-01-submission.md`.
- **PKR-DEF-000001 through 000005 approved** (Version → 1.0 each) — 23 August 2026, `PKR-DEF-EVIDENCE-CONFIDENCE-submission.md`.
- **PKR Standard §5.5/§4.2 corrected and approved (v0.09)** — 23 August 2026. Source PKR Evidence Confidence is now Not Applicable; MIL Reference is now MIL References, a list — resolving the one-claim-per-source conflict with the citation-reuse design before any Source PKR was built under the old rule.
- **24 Source PKRs built, approved, and Published** (PKR-SRC-000001–000024) — 23 August 2026, `PKR-SRC-submission.md`. Covers every source cited by AF-1–AF-5/AF-7/AF-8 of ARC-BUSHROSE-DEADWOOD-01 and AF-1–AF-3 of ARC-BUSHROSE-DORMANCY-01, plus both Founder observations. Approved by representative walkthrough of three records, not a full line-by-line read. Two candidate sources deliberately excluded (RHS "Shrub Roses"; the sporotrichosis fact sheet) as not cited by anything built yet — confirmed correct.
- **PKR-OBS-000001 / PKR-DEC-000001 / PKR-SGT-000001 updated to cite the correct Source PKR IDs**, resolving their Source PKR dependency — 23 August 2026, both submission files. Each record remains Draft — Dependency-Blocked for other, unrelated reasons (see Structural / Project-Wide Gaps above).
- **"Recently planted" Suitability Gate researched across a four-part revision series (FRD-BUSHROSE-RECENTPLANT-01–04) and approved as ARC-BUSHROSE-RECENTPLANT-01** — 23 August 2026. AF-1 (Moderate): full pruning waits for establishment, ~3+ years, dead wood exempted. AF-2 (Low): observable-signal fallback when planting date is unknown, any ambiguous reading defaults to caution. AF-3 (bud-union visibility, asymmetric signal) and AF-4 (light first-year shaping) documented but deliberately not operationalised — see Pending Founder Decisions and Structural / Project-Wide Gaps above for what's still open.
- **PKR-SGT-000002 (recently planted gate) approved and Published** (Version 1.0) — 23 August 2026, `PKR-SGT-BUSHROSE-RECENTPLANT-01-submission.md`. Two-tier design: known date applies the ~3-year rule; unknown date falls back to AF-2's three signals, requiring all three before passing. Does not gate PKR-DEC-000001 (dead wood exempted). **The first Suitability/Observation/Decision Logic PKR in the project to reach Published** — PKR-OBS-000001, PKR-DEC-000001, and PKR-SGT-000001 are all still Draft — Dependency-Blocked on unrelated items (see Structural / Project-Wide Gaps above).
- **Planting-date question added to the app** — 23 August 2026, `NewPlant.tsx`, `types.ts`, `store.ts`, `supabase/schema.sql`. Free-text `plantedWhen` field, optional/skippable, matching the existing questionnaire style — closes the gap between PKR-SGT-000002 (published, needs a planting date to use its stronger path) and the app, which previously had nowhere to enter one. Data capture only — see the new item above on `Journey.tsx`'s SAFETY_ITEMS for what's still not wired up.
- **8 Source PKRs for the recently-planted gate built, approved, and Published** (PKR-SRC-000025–000032) — 23 August 2026, `PKR-SRC-BUSHROSE-RECENTPLANT-submission.md`. Approved by representative walkthrough of three records (Illinois Extension; Marin Rose Society's dual-cited "Pruning Roses"; Spring Hill Nursery's grading standard), not a full line-by-line read.
- **PKR-SGT-000002 wired into the running app** — 23 August 2026, new `App/src/lib/suitabilityGates.ts` plus edits to `Journey.tsx` and `types.ts`. The static "It wasn't planted or moved recently" self-attestation checkbox is gone; the safety phase now asks the gate's real Primary Question and, when the gardener doesn't know, its Fallback Check (all three AF-2 signals required — no majority-rules shortcut, per the Founder's standing safety directive). A restricted result limits that journey to `dead-wood` only, matching AF-1's exemption; an established result offers the full observation script. Built as declarative gate data plus a generic evaluator per PKR Standard §9.1, so it isn't plant-specific logic buried in the page component. `plantedWhen` is shown back to the gardener as a reminder in the gate question but is never parsed to silently decide the outcome. Could not run a live `tsc`/build check this round (device shell unavailable); reviewed by hand instead — worth a real build check next session. PKR-SGT-000001 (dormancy) intentionally left unwired — still Draft — Dependency-Blocked.
- **Root cause of "new plant doesn't save" found and fixed: the live Supabase database was missing the `planted_when` and (then-new) `location_*`/`latitude`/`longitude`/`hemisphere` columns entirely** — 23 August 2026. `schema.sql`'s idempotent `alter table` statements had been written but never actually re-run against the live "AskPip" Supabase project (this is the item that used to sit in Pending Founder Decisions asking for exactly that). Every `addProject` insert including `planted_when` had therefore been failing outright — silently, since store.ts only logs write errors to the console rather than surfacing them. With Supabase MCP access confirmed working this session, applied the missing columns directly via `apply_migration` rather than waiting on a manual SQL Editor step. Verified end-to-end live in Chrome (see below): a plant created through the full questionnaire now actually lands in the database.
- **`NewPlant.tsx` now saves progressively instead of only at the final question** — 23 August 2026. The plant record is created as soon as the (required) name question is answered, and each later answer is written immediately as its own update, so a gardener who stops partway through keeps what they'd already told Pip. Also fixed a pre-existing bug in the "Skip this one" button: it called `setDraft('')` then `advance()` in the same click, but `advance()` read the still-stale `draft` from before the state update landed, so skipping while text was typed but not cleared silently saved that text instead of skipping it.
- **`AppHeader`'s "Back" and "Go to Beginning" menu items fixed** — 23 August 2026. "Go to Beginning" pointed at `/`, which is `AuthGate` — it immediately redirects an already-signed-in gardener straight back to `/library` on mount, so the click looked like it did nothing; repointed at `/welcome`, the actual first screen after sign-in (previously unreachable by any in-app navigation). "Back" used `navigate(-1)`, which depends on the browser's actual session history lining up with the app's logical structure — replaced with a fixed per-route parent lookup (`backTargetFor`), which is correct regardless of how a screen was reached (direct URL, refresh, etc.).
- **`AuthGate`'s Pip bubble fixed to stop showing a stale prompt** — 23 August 2026. Pip's message was hardcoded to the initial "enter your email" text regardless of flow state; once a sign-in code was sent, the "check your inbox" instruction appeared as plain text inside the gardener's own response bubble instead of as something Pip says, which read as broken. `ChatBubble`'s content is now a `pipMessage` that changes with `status` (checking / code sent / initial).
- **`ChatBubble` layout fixed for long unbroken text and resized** — 23 August 2026, `ChatBubble.tsx` + `PipAvatar.tsx`. A long unspaced string (an email address) was overflowing off the edge of the bubble; added `break-words`. Separately, Pip's avatar (190px) was judged too large relative to the bubble on a ~375px phone frame, then too small after a first pass at 130px; landed on 155px with a new `PIP_BLEED_PX` (20px) that shifts his box left via negative margin — bleeding his own empty left-side padding off the frame edge (clipped by the phone frame's `overflow-hidden`) rather than taking that width from the bubble. Verified visually via a live, connected Chrome tab (confirmed no clipping into his actual silhouette, by zooming into the rendered avatar).
- **Location capture rebuilt as two real options — GPS or manual city/region/country — with hemisphere and season derived automatically** — 23 August 2026, new `App/src/lib/countryHemisphere.ts` and `App/src/lib/location.ts`, plus edits to `types.ts`, `store.ts`, `schema.sql`, `NewPlant.tsx`, `PlantProject.tsx`. Raised by the Founder questioning whether the free-text "Town or region" question was adequate — confirmed against Architecture §6 that "location" and "seasonal context" were meant to be addressed with the same rigor as dormancy/recent-planting, not left as an unused free-text field (the pipAsks copy claimed to determine season while nothing computed anything from it). Rather than adding a third-party autocomplete/geocoding service, the Founder chose two dependency-free paths: the browser's built-in Geolocation API ("Use my current location"), or manual entry as three separate fields (town/city, region/state, country) rather than one blob — a typed country is enough to look up hemisphere from a static table without needing to geocode it. Hemisphere is derived once at save time (latitude's sign for GPS; the country lookup for manual, both left unset rather than guessed for the equator itself or an equator-straddling/unrecognized country) and displayed as a computed "current season" on the plant's profile page. Explicitly does **not** replace the dormancy Suitability Gate's bud-swell observation — calendar season is useful context (and matches Architecture §6.4's stated use for future follow-up timing), but the actual "is it safe to prune" determination stays on the real plant, not the calendar, per the existing ARC-BUSHROSE-DORMANCY-01 research. Verified end-to-end live in a connected Chrome tab: manual entry of Melbourne, Victoria, Australia correctly derived Southern Hemisphere and displayed "Winter" (correct for August).

---

# End of Document

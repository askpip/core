# Proposal — "Help me with [rose name]"

**Status:** Proposal for Founder approval. Nothing built yet.
**Prepared:** 18 October 2026, by Claude, for the Founders
**Form:** `APP-HELP-ME-WITH-ROSE_Proposal_Form.md` (one question)
**Affects:** `App/src/pages/PlantProject.tsx`, a new Help panel and care-log component, one new Supabase table.

---

## 1. What it is

A **Help me with [rose name]** button near the top of each rose's page. Tapping it opens a short panel where Pip says what fits now and offers up to three choices. Each choice opens something already published. There's also a one-tap care log.

**No new research.** Every gardener-facing claim is a Published statement shown word for word, with its confidence tag and Sources link, the same way the page shows them today. The only new words are the app lines in section 5, and those make no horticultural claims.

## 2. What Pip uses

| Input | Where it comes from now |
|---|---|
| Season where the rose grows | Hemisphere + today's month (`seasonForHemisphere`), as "This season · Spring in Christchurch" does now |
| Place codes (country, region, town) | `usePlantPlace` / `place.ts`, as the common questions use now |
| Rose type | The saved PKR-SGT-000003 answer |
| Recently planted | **Not saved today**: the journey asks the PKR-SGT-000002 question each time. Proposal: save the answer the first time the gardener gives it (journey, blind-shoot check or this panel), and ask it once in the panel when it's missing. The question wording is the Published one. |
| Journal | Observations, notes and the new care log |
| Timing | PKR-CGD-000022 (prune), -000023 (feed), -000024 (deadhead), shown only where the statement's place codes match the rose's place |

## 3. Rules: what appears when

**A. Rose type doesn't pass, or isn't set.** No pruning or care choices. Pip shows the existing Published line ("I can't yet help prune this rose; it's kept as a journal."), plus: *Set the rose type* (if not set), *Add a note* and the care log.

**B. No known season** (no hemisphere). Choices that don't depend on season: *Check for suckers*, *Common questions*, *Add a note*. Pip asks for the place (app line 7).

**C. Type passes and the season is known.** Pip picks the first three that apply, in this order. The rest go under "More".

| Order | Choice | Opens | Shown when |
|---|---|---|---|
| 1 | Start the pruning journey | Existing journey | **This month is in the pruning months for the place** (rule D). Not offered when the rose is recently planted (PKR-SGT-000002 stops the journey; the journey itself explains why). |
| 2 | Care tips for this season | PKR-CGD-000004 (spring, summer, autumn), PKR-CGD-000005 instead if recently planted, PKR-CGD-000006 (late autumn and winter) | Always, by season |
| 3 | Check for blind shoots | Existing blind-shoot check | Spring and summer |
| 4 | Check for suckers | The Published sucker answer (common question "sucker") | Any season |
| 5 | Common question, by season | Black spot (spring to autumn); Not flowering (summer); Brown canes / dieback (winter and spring) | As listed |
| — | Add a note · Care log | Notes box · care log | Always, below the choices |

The **existing journey and blind-shoot buttons on the page stay as they are**. The panel only changes what Pip suggests, not what the gardener can open.

**D. Pruning months.** The timing records are written as sentences, so the app needs a small month table. The rule: **every month named for the main pruning in any PKR-CGD-000022 statement shown for that place**, joined together. A region or town can widen a country's months but never narrow them. The journey's own dormancy check (PKR-SGT-000001) still decides on the actual rose.

| Country (base) | Months | Examples where a region or town widens them |
|---|---|---|
| New Zealand | June–August | Canterbury, Christchurch: to September (Canterbury: finish winter pruning in September; Christchurch: "late winter or early spring") |
| Australia | June–August | — |
| United Kingdom | November–March (one company's frost-free days, November to March; most sources say February or March) | — |
| United States | December–mid-April | State and county statements, tabulated at the build |
| Canada | April | Region statements, tabulated at the build |

Today, Christchurch is in spring (October), so the journey is not suggested there; care tips, blind shoots and suckers are.

## 4. The care log

Four one-tap buttons: **I fed it · I watered it · I deadheaded it · I mulched it**. Each saves the date on the plant, in a new table `care_log` (plant, user, kind, date; same owner-only rules as Notes). Taps can be undone. Entries show in the journal.

In the panel, Pip says **only two kinds of thing**:
1. A fact from the log: "You last fed [name] 6 weeks ago." (app line 6)
2. Under it, word for word, the Published timing statements for that place: feeding from PKR-CGD-000023, deadheading from -000024, and watering and mulch from PKR-CGD-000004.

Pip never works out "it's time to feed" or "you should stop now". The gardener reads the statement and decides.

> **One thing to know.** The example in the brief, "in Christchurch the last feed is usually by late summer", **can't be said**. The Published New Zealand statement says sources disagree: "no later than the end of February", "March or early April", and "some feed through autumn". Pip would show that disagreement as it stands. Australia ("February or March"), the UK ("before the end of August", one grower) and Canada ("by mid-July") do have a last-feed statement.

## 5. New app wording (for approval)

1. Button: **Help me with [name]**
2. "Here's what fits now for [name]: [Season] in [place]."
3. "Pick one, or see more below."
4. Choice labels: "Start the pruning journey", "Care tips for [season]", "Getting ready for winter", "Check for blind shoots", "Check for suckers", "Add a note", "More". Common questions use their existing wording.
5. Care log: "What did you do for [name] today?" · "I fed it" · "I watered it" · "I deadheaded it" · "I mulched it" · "Noted: fed today." · "Undo"
6. "You last fed [name] [n] days / weeks / months ago." · "Nothing logged for feeding yet."
7. "Tell me where [name] grows, and I can say what fits the season there."

## 6. Mock-up

```
┌─────────────────────────────────────┐      ┌─────────────────────────────────────┐
│ [photo: Claude test rose 2]         │      │ Help me with Claude test rose 2   ✕ │
│                                     │      │                                     │
│ (Pip) Here's Claude test rose 2's   │      │ (Pip) Here's what fits now for      │
│       journal — …                   │      │  Claude test rose 2: Spring in      │
│                                     │      │  Christchurch. Pick one, or see     │
│ [ Help me with Claude test rose 2 ] │ ───► │  more below.                        │
│                                     │      │                                     │
│ This season · Spring in Christchurch│      │ [ Care tips for spring          › ] │
│ …                                   │      │ [ Check for blind shoots        › ] │
└─────────────────────────────────────┘      │ [ Check for suckers             › ] │
                                             │   More ▾                            │
                                             │ ─────────────────────────────────── │
                                             │ What did you do for it today?       │
                                             │ (I fed it) (I watered it)           │
                                             │ (I deadheaded it) (I mulched it)    │
                                             │                                     │
                                             │ You last fed Claude test rose 2     │
                                             │ 6 weeks ago.                        │
                                             │  "Start feeding in spring, as new   │
                                             │   growth appears."          High    │
                                             │  "Sources disagree on when to stop  │
                                             │   feeding. …"     Sources disagree  │
                                             │                         Sources ›   │
                                             └─────────────────────────────────────┘

Winter in Christchurch (July):
  [ Start the pruning journey › ] [ Getting ready for winter › ] [ Check for suckers › ]
```

## 7. Build and checks, once approved

- A test against the app's snapshot for each season × country (and Christchurch, Canterbury, a journal-only rose, no place). It checks that every gardener-facing line is either a Published statement word for word or one of the section 5 lines.
- `npm run build` passes.
- In Chrome, on a test rose: open the panel, tap each choice, log and undo a feed. No cuts confirmed.
- The `care_log` table is added to `App/supabase/schema.sql`. **You run it once in the Supabase SQL editor** (I don't change the database).

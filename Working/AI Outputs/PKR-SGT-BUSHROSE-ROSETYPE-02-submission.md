# PKR Submission Package — Rose-Type Gate Revision: "Ht"/"Fl" Label Hint (v1.1, Published)

**Published 1 October 2026.** Approved by Shaphan in chat, 1 October 2026 ("Approve"), after he accepted the addendum dossier it rests on. Only content from `ARC-BUSHROSE-ROSETYPE-01` v1.2 is used (§3). Published to the LIL as PKR-SGT-000003 v1.1; v1.0 is Retired.

Revises PKR-SGT-000003 (v1.0, Published 29 September 2026; package `Working/AI Outputs/PKR-SGT-BUSHROSE-ROSETYPE-01-submission.md`) to v1.1. Built by KIT from `ARC-BUSHROSE-ROSETYPE-01` v1.2. Its Source PKRs are in `Working/AI Outputs/PKR-SRC-BUSHROSE-ROSETYPE-02-submission.md` (PKR-SRC-000181 to 000189).

**Why:** a gardener whose label reads, for example, "Frosty Moon Bush Rose Ht" could choose "The label only says 'bush rose'" and be turned away, although the label does state a type. The revision adds one line explaining the two abbreviations.

---

## 1. Triage Record (KIT OM Chapter 5)

| ARC content | Routes to |
|---|---|
| AF-L30 (Moderate) + R-L6 | PKR-SGT-000003 v1.1: new "label abbreviations" line shown with the question |
| AF-L31 (Moderate) | PKR-SGT-000003 v1.1: the word "usually" in that line, and a new Preserved Limitation (4) |
| AF-L32 (Not Assigned) | Preserved Limitation (4): no source spells the abbreviations out; the meaning comes from matching |
| AF-L1 to AF-L29 and R-L1 to R-L5 (v1.1) | Not routed in this revision. KIT's impact check found they support the existing gate (for example "bush" alone stays journal-only, R-L1) and contradict nothing; the existing rows are unchanged. |

---

## 2. PKR-SGT-000003 v1.1 — changed fields only

| Common Field | Value |
|---|---|
| PKR ID | PKR-SGT-000003 |
| Status | **Published** |
| Version | 1.1 |
| Supporting Source(s) | Unchanged, plus AF-L30: PKR-SRC-000181, 000182, 000183, 000184, 000185, 000186, 000187. AF-L31: PKR-SRC-000184, 000188, 000189. |
| Founder Approval Date | 1 October 2026 |
| Preserved Uncertainty or Limitations | Items (1) to (3) unchanged. New (4): "Ht" and "Fl" are shop abbreviations that no source spells out; their meaning was shown by matching five Kings Plant Barn roses against nurseries that name the class in full (AF-L30, AF-L32). One Palmers title uses "Ht" on a rose its own page calls a Floribunda (AF-L31), so the hint says "usually". Either way the rose qualifies. |

### New content: label abbreviations

Shown with the rose-type question, in Add a plant and in the journey, before the answer buttons.

| Text | Evidence Confidence | Basis |
|---|---|---|
| Some New Zealand shops shorten the type in a rose's name: "Ht" usually means Hybrid Tea and "Fl" usually means Floribunda. So a label like "Bush Rose Ht" does tell you the type. | **Moderate** (AF-L30; "usually" per AF-L31) | AF-L30, AF-L31, R-L6 |

No answer, result or other wording of the gate changes.

---

## 3. Wording Boundary Check (KIT OM §7.7)

- **"Some New Zealand shops"**: AF-L30 and AF-L31 cover two New Zealand retailers (Kings Plant Barn, Palmers). The text doesn't claim all shops, or any market outside New Zealand.
- **"shorten the type in a rose's name"**: both retailers put the abbreviation in the product title (AF-L30, AF-L31).
- **"'Ht' usually means Hybrid Tea and 'Fl' usually means Floribunda"**: AF-L30 shows five of five matches; AF-L31 shows one mismatch. "Usually" keeps within both. Only the forms seen ("Ht", "Fl") are named, not "HT" or "FL".
- **"So a label like 'Bush Rose Ht' does tell you the type"**: R-L6 (a label with either counts as a stated type under R-L1). "Bush Rose Ht" is the form in AF-L30.
- Nothing is said about physical tags beyond this, since what tags print is unknown (AF-L29).

---

## 4. Remaining Dependencies and Decisions for the Founders

- **App work (done 1 October 2026):** new content field `labelAbbreviations`, read by `App/src/data/pkr.ts` and shown by `App/src/components/RoseTypeQuestion.tsx` above the answers. Build passes.
- No horticultural decision is open.

---

## 5. Founder Review Rendering (PKR Standard §9.2)

**What changes for the gardener:** when Pip asks what type of rose it is, Pip also says: *"Some New Zealand shops shorten the type in a rose's name: 'Ht' usually means Hybrid Tea and 'Fl' usually means Floribunda. So a label like 'Bush Rose Ht' does tell you the type."* Everything else about the question stays the same.

**The evidence:** five roses sold by Kings Plant Barn as "Bush Rose Ht" or "Bush Rose Fl" were checked against Matthews Roses and Wairere Nursery, which name the class in full. All five matched (Moderate). No shop spells the abbreviations out.

**The limitation:** Palmers sells "Fordell Ht", but its own page, and the breeder, call Fordell a Floribunda. So an abbreviation can name the wrong one of the two classes, which is why Pip says "usually". Both classes qualify, so the gardener's outcome is the same either way.

**Sources:** nine new Source PKRs (000181 to 000189): the Kings, Matthews, Wairere and Palmers product pages, each with its web address, read on 1 October 2026. All are commercial.

---

# End of Document

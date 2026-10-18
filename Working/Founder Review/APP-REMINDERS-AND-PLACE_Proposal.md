# Proposal — "Coming up", Changing a Rose's Place, and Pruning-Time Emails

**Status:** Approved by a Founder in chat ("approve both, build"), 18 October 2026, with no change. Being built.
**Prepared:** 18 October 2026, by Claude, for the Founders
**Form:** `APP-REMINDERS-AND-PLACE_Proposal_Form.md` (one question)
**Affects:** `App/src/pages/Library.tsx`, `App/src/pages/PlantProject.tsx`, the menu (`App/src/components/AppHeader.tsx`), one new column on the plants table, one new table for email choices, one scheduled database job.

---

## 1. What it is

Three additions, all built from what the app already knows: each rose's place, its type, and the pruning months in `App/src/data/pruningMonths.ts` (approved with "Help me with [rose name]"). **No new research.** The only new words are the app lines in section 5. They make no horticultural claim: each one points the gardener to the rose itself, because months are only a guide and the plant decides (rule 6).

## 2. "Coming up" on the home screen

A card at the top of the list of roses (`Library.tsx`), shown only when there is something to say:

- **In a rose's pruning months:** "It's pruning time in [place]: [rose], [rose]. Start the pruning journey to check each rose first."
- **In the month before they start:** "Pruning months in [place] start in [Month]: [rose], [rose]."

Each rose name opens that rose's page. Only roses whose type passes and whose place has pruning months are included. Roses in the same place are listed together.

## 3. Changing a rose's place

On the rose's page, the **Location** line gets a **Change** button. It opens the same choice as in Add a plant: "Use my current location" (GPS), or "Enter it manually" with the town, region and country. The question wording is the one already in Add a plant. Saving updates the place, the hemisphere and so the season. Nothing else about the rose changes.

This also fills the gap left by "Help me with": Pip's line "Tell me where [name] grows, and I can say what fits the season there" now leads somewhere. Under rule B, the panel gains a choice, **Tell Pip where it grows**, which opens this.

## 4. Pruning-time emails

**Opt-in, from the menu:** "Email me when it's pruning time" (on/off). Off for everyone until they turn it on.

**What is sent:** at most one email a month, on the first day of a month in which any of the gardener's roses enters its pruning months. It lists those roses and their places, with the same words as the "Coming up" card, a link to the app and a line to turn the emails off. Nothing else is sent: no feeding or other reminders in this first version.

**How the place stays on the phone.** The Founders decided on 6 October 2026 that a rose's place is worked out on the gardener's own device and its position is sent nowhere. So the server never works out a place. When a rose's page or the home screen opens, the app saves just that rose's pruning months, as a list of month numbers (for example 6, 7, 8, 9), on the plant. The scheduled job reads only those numbers. A rose with no months saved gets no email.

**How it's sent.** A scheduled database job (Supabase `pg_cron`) runs early on the 1st of each month and sends through Resend, as the Shed's own notice emails do now. It is checked first with a test send to a Founder's address only.

## 5. New app wording (for approval)

1. Card heading: **Coming up**
2. "It's pruning time in [place]: [roses]. Start the pruning journey to check each rose first."
3. "Pruning months in [place] start in [Month]: [roses]."
4. Location line: **Change** · Help panel choice: **Tell Pip where it grows**
5. Menu: **Email me when it's pruning time** (on/off) · "I'll email you at [email] on the first of a month when one of your roses reaches its pruning months. You can turn this off here at any time."
6. Email subject: "Pruning time for [rose] in [place]" (or "Pruning time for your roses" for more than one)
7. Email body: line 2 for each place, then "Open Ask Pip: [link]" and "To stop these emails, turn them off in the Ask Pip menu."

## 6. Mock-up

```
Your roses                                 Claude test rose 2
┌─────────────────────────────────────┐    …
│ COMING UP                           │    Location: Christchurch, NZ  [Change]
│ It's pruning time in Christchurch:  │                    │
│ Claude test rose 2. Start the       │                    ▼
│ pruning journey to check each rose  │    ┌───────────────────────────────────┐
│ first.                              │    │ Where is your rose growing? I'll  │
└─────────────────────────────────────┘    │ use this to understand your local │
[photo] Claude test rose 2                 │ season.                           │
[photo] Sarah's Rose                       │ [ Use my current location ]       │
                                           │ Town / city ____  Country ____    │
                                           │ [ Save ]                          │
                                           └───────────────────────────────────┘
```

## 7. Build and checks, once approved

- A test against the snapshot: "Coming up" for each country and month, with no line for a journal-only rose or one with no place.
- `npm run build` passes; checked in a headless browser with test data.
- The database changes (a `pruning_months` column on plants and an `email_reminders` table, owner-only) are applied through the Supabase connection.
- The email job is tested with one send to a Founder's address before it is switched on for gardeners.

Phone notifications are left for later. On an iPhone they work only once Ask Pip is added to the home screen, so email reaches more gardeners first.

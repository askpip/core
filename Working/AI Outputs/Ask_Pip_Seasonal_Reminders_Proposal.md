# Proposal: Seasonal Reminders for Ask Pip

**Status:** Proposal, not built. **Prepared by:** Claude, at Shaphan's request, 2 October 2026. **Live version:** Claude Doc at https://claude.ai/code/artifact/b46aa6f8-24c4-40b6-bf7d-1b321fc28436 (this file is a copy of it as at 2 October 2026; edits made there aren't copied here automatically).

## Summary

After a gardener adds a rose, Pip offers to remind them when it's time to consider winter pruning where they live. The reminder brings them back into Ask Pip, where the bud-swell check still decides whether to prune. Recommendation: start with email reminders for winter pruning only, built once the month-level timing research is approved, then add phone notifications and further seasonal reminders.

Most of the pieces exist already: each rose's location and hemisphere, gardeners' sign-in emails, a scheduled-job capability in Supabase, and the Resend email service the Garden Shed already uses.

## How it works for the gardener

1. **The offer.** Right after a rose is saved to the journal, Pip asks: "Would you like me to remind you when it's time to consider winter pruning where you live?" Options: email me, notify me on this device (once available), or not now. A short note says what is used (email address, the rose's location) and that they can stop at any time.
2. **Asking again later.** A "Reminders" switch on each rose's page, so a gardener who said "not now" can turn them on later, and anyone can turn them off.
3. **The reminder.** One message at the start of the approved window for their area, for example: "Winter pruning time is coming up in Canterbury. When you're ready, open Pip and we'll check together whether your Hybrid Tea is ready." It names the rose type, never "bush rose", and never says "prune now".
4. **What it opens.** A link straight to that rose in Ask Pip, starting the pruning journey, where the dormancy (bud-swell) check runs as usual.
5. **One gentle follow-up.** If no journey has been started about two weeks later, one short follow-up. Then nothing more until next season.
6. **Several roses.** One reminder per garden, listing the roses, rather than one message per rose.

## Guardrails

- **Approved timing only.** Reminder dates come from the Founder-approved month-level timing research for the gardener's country and climate band (`FRD-BUSHROSE-TIMING-NZ-01`, `-UK-01`, `-US-01`, `-CA-01`, `-AU-01`, once they become ARCs and PKRs). No month is invented or shifted between hemispheres.
- **The rose still decides.** A reminder only invites the gardener to check. Whether to prune is decided by the approved dormancy check (`ARC-BUSHROSE-DORMANCY-01`, PKR-SGT-000001), never by the calendar.
- **Gate-aware.** No pruning reminder for a journal-only rose (rose type not supported, PKR-SGT-000003). A recently planted rose (PKR-SGT-000002) gets wording that says Pip will check what's suitable, not a pruning invitation.
- **Unknown band, no guess.** If Pip can't place the garden in a band, it asks the gardener rather than guessing; until answered, no dated reminder is sent.
- **Wording is approved copy.** Reminder and opt-in text are product copy and go to the Founders for approval, like other app wording.

## Channels compared

Ask Pip is a website, not an app-store app, so the options are:

| Channel | Who it reaches | Effort to build | Running cost | Catches |
| --- | --- | --- | --- | --- |
| Email | Everyone (they already sign in with email) | Small: Resend is already used by the Shed | Free tier covers early use | Can land in spam or be ignored; feels less immediate |
| Phone notification (web push) | Android phones and computers; iPhones only if the app is added to the Home Screen (iOS 16.4 or later) | Moderate: background script, notification keys, permission prompt | Free | Many iPhone users won't get it; the permission prompt is easy to dismiss |
| Text message | Everyone with a phone | Moderate | Pay per message | Needs phone numbers, adds cost and privacy weight |

Recommendation: email first; phone notifications as stage 2; text messages not now.

## How it works behind the scenes

The daily flow: a scheduled job runs each morning, finds the roses whose gardeners opted in, works out each one's band and local date, and checks whether the approved window starts today. If it does, it sends the reminder email; the gardener opens Pip at their rose, and the bud-swell check decides. If not, it checks again tomorrow.

- **Settings table** in Supabase: rose, gardener, reminder type, channel, when consent was given or withdrawn, and when the last reminder was sent. Only the gardener can read or change their own rows.
- **Timing data:** the approved month windows per country and climate band, read from the Live Intelligence Library once the timing PKRs are published, never typed into the job.
- **Daily job:** a Supabase scheduled job calls a small function each morning. It works out each opted-in rose's band and local date (from the location already saved), and sends a reminder when the approved window starts and none has been sent this season.
- **Sending:** email through Resend (already used by the Shed), with the rose's name and type, a link into Ask Pip and a one-tap stop link. Phone notifications would use the same job with a second sender.

## Which reminders

The first version sends one reminder type. The same system carries the rest later, each needing approved timing and approved wording.

| Reminder | When | Opens | Stage |
| --- | --- | --- | --- |
| Time to consider winter pruning | Start of the approved pruning window for the band | The pruning journey (dormancy check first) | 1 |
| Follow-up if no journey started | About two weeks after the first | The same | 1 |
| Start feeding | Approved spring feeding month | Care tips | 2 |
| Last feed before winter | Approved last-feed month | Care tips | 2 |
| Blind-shoot check | Once other shoots are in bud (approved default) | The growing-season blind-shoot check | 2 |
| Winter clear-up | Approved clear-up timing | Care tips | 2 |
| Winter protection on and off | Approved timing for cold US and Canadian bands | Care tips | 3 |
| "How's it going?" after pruning | A few weeks after a finished journey | The rose's journal and progress photos | 3 |

## Privacy, consent and unsubscribing

- **Opt-in only.** No reminder is sent unless the gardener says yes, per rose. Saying no costs them nothing.
- **Plain disclosure at the opt-in.** What is used (email address, the rose's location and type), what for (working out the right time to remind them), and who sends it (Ask Pip, through the Resend email service; Supabase stores the settings).
- **Location stays as precise as the gardener gave it.** Reminders need only the climate band, not a street address. GPS coordinates already stored are used only to place the band.
- **One-tap stop.** Every email carries a "Stop these reminders" link that works without signing in, plus a switch on the rose's page.
- **Records kept.** When consent was given and withdrawn, and what was sent when, so the Founders can show exactly what Pip did.
- **Email rules.** Messages identify Ask Pip and include the unsubscribe link, in line with New Zealand's Unsolicited Electronic Messages Act and similar rules elsewhere. Worth a quick legal check before launch.

## Dependencies, effort and stages

**Depends on:** Founder approval of the five timing dossiers (in the Shed now), then their ARCs and a timing record per country that the reminder job can read. Also the Founders' choice of how gardeners are placed in a band, which is one of the decisions in those dossiers.

| Stage | What | Rough effort |
| --- | --- | --- |
| 1 | Opt-in after adding a rose, reminder switch on the rose page, settings table, daily job, winter-pruning email and one follow-up, unsubscribe link | 2–3 days |
| 2 | Phone notifications (web push) as a second channel; feeding, blind-shoot and clear-up reminders | 3–5 days |
| 3 | Winter-protection and "how's it going?" reminders; a simple reminder history on the rose's page | 2–3 days |

**Interim option (not recommended):** a season-only reminder ("winter has started where you are") could run before the timing research is approved. It's too rough for cold inland gardens and would set the wrong expectation, so it's better to wait.

## Founder decisions needed

- [ ] Approve the timing dossiers (NZ, UK, US, Canada, Australia), including how gardeners are placed in a band
- [ ] Channel for stage 1: email only, or email plus phone notifications from the start
- [ ] Where the reminder points in the window: the start, or a set number of days before it
- [ ] Whether to send the one follow-up, and how long after
- [ ] One reminder per garden or per rose
- [ ] What to do when Pip can't place a garden in a band: ask the gardener, or send no dated reminder
- [ ] Approve the opt-in, reminder, follow-up and unsubscribe wording
- [ ] Approve the privacy note, and whether to get a quick legal check on the email rules before launch

## Status and next step

Proposal only; nothing has been built. It waits on the timing dossiers' approval. The next step is to answer the timing Review Forms in the Shed, then decide the stage 1 channel, after which stage 1 can be built in a few days.

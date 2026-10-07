# Ask Pip App Build Status

## Document Metadata

**Document Title:** Ask Pip App Build Status
**Document Type:** PIP Artificial Intelligence Operating System (PIP AI OS) Context
**Version:** 0.8
**Status:** Draft — for Founder Review
**Owner:** The Founders
**Approved By:** AskPIP Founder Authority
**Permanent Location:** `AI/Context/Ask_Pip_App_Build_Status_Context.md`
**Last Updated:** 8 October 2026
**Purpose:** To give any artificial intelligence (AI) or Founder a current, accurate snapshot of what is actually built in the Ask Pip application, what is deliberately deferred and why, and what remains blocked pending Founder-approved knowledge — without requiring that state to be reconstructed from git history, conversation history or a fresh reading of every source file.
**Related Documents:** `AGENTS.md`; `AI/PIP_AI_Operations_Manual.md`; `AI/PIP_AI_Loading_Guide.md`; `MVP/Architecture/Ask_Pip_App_Engineering_Architecture.md`; `MVP/Journeys/Ask_Pip_MVP_Bush_Rose_V1_First_Guided_Care_Journey.md`; `Working/AI Outputs/Ask_Pip_Bush_Rose_Guided_Journey_Flow_Proposal.md`; `AI/Context/Ask_Pip_App_Known_Issues_and_Process_Notes_Context.md`

---

# 1. Purpose and Scope

This Context tracks implementation status only: what exists in the Ask Pip application right now, distinct from what the application should eventually do.

It does not govern product requirements (see the Flow Proposal and the approved MVP Journey document) or the codebase's technical structure (see the Ask Pip App Engineering Architecture). It is deliberately narrow so it stays accurate: a status list that tries to also explain design intent or architecture drifts out of date faster than one that only says what is built.

This document is not itself a Shed to-do or task list. The Garden Shed Office's own to-dos (`shed_todos`) track outstanding review and action items and should be checked directly for those — see the Garden Shed Operations Skill. This Context exists because an AI session's own task list (the `TaskList`/`TaskUpdate` tools) is session-scoped and does not persist to a future session; this document is the durable record that does.

# 2. Keeping This Current

Any AI that completes a change to the application's build status — something newly built, something newly deferred, something newly unblocked — shall update this document before reporting that work as complete, per the Verify Before Claiming Skill. Record what changed in the Revision Log at §6 rather than only in the body, so a reader can see the document's own history without comparing it against git.

This document should be treated as provisional between updates: it reflects the state as last recorded, not a live query. Section 5 gives the ways to confirm current state directly when precision matters.

# 3. Phase A — Buildable Without New Knowledge

The Flow Proposal's Build Sequence (§12) defines Phase A as everything the guided journey needs that does not depend on Founder-approved horticultural content. The items below have been built and committed to the application, each confirmed byte-identical against the source the AI wrote before the Founder was given the push command; git push itself was reported by the Founder as complete but has not been independently verified by AI against the remote repository (see the Verify Before Claiming Skill's distinction between a local write succeeding and a remote surface being confirmed).

**Photo-first onboarding** (`App/src/pages/NewPlant.tsx`). The cover-photo step now opens the onboarding questionnaire instead of closing it; the photo is attached to the plant record at creation rather than in a separate terminal step; skipping remains allowed.

**Trace-the-stem confirmation** (`App/src/pages/Journey.tsx`). Every "Cut" decision is gated by a confirmation asking whether the gardener can trace the stem to the exact point they intend to cut, before the existing safety-checklist confirmation (which only fires when something on that checklist was left unsure) gets a chance to run.

**Journey pause and resume** (`App/src/pages/Journey.tsx`). Revised 29 September 2026: because every observation now loops and can have several instances, `beginObservations()` treats an observation as finished only when its explicit `'none-remaining'` marker row has been saved (written when the gardener answers no to "Can you see any more …?"). It resumes at the first observation of the session without a marker. Markers are hidden from the plant journal and from its confidence figure (`App/src/pages/PlantProject.tsx`). **The live database needs a one-line constraint change before markers can be saved** (see §3.3).

**Prominent Learn entry point** (`App/src/pages/Library.tsx`). A "Learn with Pip" card now sits on the home/plant-list screen, in addition to the existing `/learn` entry in the header's overflow menu.

**Journal and growth visibility** (`App/src/pages/PlantProject.tsx`). Confirmed already fully built — observations, notes, progress photos and nursery-label display were all present before this round of work; nothing was added.

## 3.1 Deferred Within Phase A

**Photo spot and knot question on the profile (Know tier).** Not started. This needs a Supabase schema change (new columns on `bush_rose_profiles`), and was deliberately not attempted in a session where `npm run build` could not be run reliably (see the Known Issues Context) — a schema migration is a materially higher-risk change to make unverified than a UI-only edit.

**Primer shell (card 5 only).** Not started. The Flow Proposal scopes this to Phase A as a shell with only one real card; the remaining four cards are Phase B, gated on Founder-approved knowledge. This was judged a larger, separate piece of new UI rather than an edit to an existing page, and was left for its own pass.

## 3.2 Not Yet Reconciled Against the Full Phase A List

The Flow Proposal's §12 Build Sequence also lists a front-door explainer, a Learn "About Ask Pip" shelf, and contextual links throughout the app. `App/src/pages/AboutPip.tsx` and the "About Ask Pip" topics in `App/src/data/learnTopics.ts` already exist in the codebase, but their exact scope has not been checked line-by-line against the Flow Proposal's specification in the course of producing this document. Treat their status as **likely built, not verified** until a future session does that reconciliation, and update this section once it has.

## 3.3 Guided Journey Wired to Published PKRs (29 September 2026)

The pruning journey now runs on Published knowledge. `npm run build` (TypeScript and Vite) and `oxlint` pass in the cloud clone. **The journey has not yet been clicked through in a browser**, because that needs a signed-in session.

- **PKR data module** (`App/src/data/pkr.ts`, `App/src/data/pkrSources.ts`). Gardener-facing wording is transcribed from the Published PKRs: SGT-000001 v1.1, SGT-000002, SGT-000003, OBS/DEC-000001 to 000007, and CGD-000001 to 000006. Every record carries id, version and status. Only `Published` records are exposed, through the `published*` accessors. `pkrSources.ts` is generated from the Source PKR files and lists each PKR's Supporting Source(s) with its web address. It feeds "Where this comes from".
- **Rose-type gate** (PKR-SGT-000003). It runs first. Only a stated Hybrid Tea, Floribunda or Grandiflora passes; Grandiflora shows its provisional note. A known variety name goes to the NZ Rose Society Rose Finder. Every other answer ends at a journal-only screen saying "I can't yet help prune this rose…". No basic care is shown there.
- **Dormancy gate** (PKR-SGT-000001 v1.1). Interactive, with the mild-climate caveat and the "Not sure" fallback wording. It replaces the old self-attested checkbox. Dormant gives the full journey. Growing, or still not sure, gives the removal-only session: dead wood, damaged growth and suckers, with its conditions and the late-season advisory.
- **Recently-planted gate** (PKR-SGT-000002). Unchanged. When it restricts, the session is dead wood only.
- **Observations.** The session runs through dead wood, damaged growth, crossing/rubbing, inward, weak/congested, suckers and main framework, each filtered by the gates. Each observation offers Confirmed, Doesn't match and Not sure.
  - **Doesn't match** is recorded and never reaches Cut. The one exception is the framework's defined old-wood path.
  - **Not sure** shows the record's own guidance. If the gardener is still unsure, only the non-Cut choices are offered.
  - Each observation loops on "Can you see any more …?".
  - **Suckers** add the visible-bud-union step (D6). The growing-season supporting signs appear only in the removal-only session (D5).
- **Decision Logic.** Each observation shows its DEC record's choices and notes with per-claim confidence. Cut still requires the trace-the-stem confirmation and the safety-checklist check.
- **Care Guidance at its presentation points.**
  - CGD-000001 (tools) and CGD-000003 (one-third advisory) appear before the first Cut under DEC-000001 to 000006. The advisory repeats after every third such Cut.
  - CGD-000002 (making the cut) appears after the Cut is confirmed, using the part that fits the kind of cut.
  - Sucker removal shows DEC-000007's own method instead.
- **Basic-care branch.** When SGT-000001 or SGT-000002 limited the session, CGD-000005 (if recently planted), CGD-000004 and CGD-000006 are shown before the summary, with the UK/US disclosure. Nothing is shown for journal-only roses.
- **Removed:** `App/src/data/observationScript.ts`, the old four-item script with three placeholders.

**Added later on 29 September 2026 (Shaphan: "1 add rose type database. 2 establish rose type during add a plant. 3 skip on the journey. 4 show basic care in the plant's journal"):**

- **Database.** New `bush_rose_profiles.rose_type` column: `hybrid-tea`, `floribunda`, `grandiflora`, `excluded`, `bush-only` or `unknown`; null means not asked yet. It's applied to Supabase and verified by query. The `observations.outcome` change for `'none-remaining'` is also applied and verified.
- **Add a plant** (`NewPlant.tsx`) asks PKR-SGT-000003's question once, after the nursery-label step, using the shared `RoseTypeQuestion` component.
  - A type that doesn't pass gets the plain "can't yet help prune" message there.
  - The earlier "What type of rose is this?" question, which actually asked for the variety name, now reads "Do you know its variety name?".
- **Journey.** A saved type skips the question. A passing type goes straight to the recently-planted check; any other type goes to the journal-only screen. Plants without a saved type are asked once, and the answer is saved.
- **Plant page** (`PlantProject.tsx`):
  - shows the saved type and lets the gardener change it;
  - for a Hybrid Tea, Floribunda or Grandiflora, shows "Caring for your …" with CGD-000004 and CGD-000006 and the UK/US disclosure (the journal care reference);
  - shows nothing for journal-only roses.

**Live Intelligence Library (1 October 2026).**
- **What the app reads now.** All horticultural content comes from the LIL, the Supabase table `public.lil_pkr`, Published rows only, loaded at start-up by `App/src/lib/lil.ts`.
- **Offline fallback.** The committed snapshot `App/src/data/lil-snapshot.json` covers offline use and first paint.
- **What changed in the code.**
  - `App/src/data/pkr.ts` is now a loader over LIL records. Its interface to the pages is unchanged.
  - `pkrSources.ts` is gone; sources now come from the SRC records.
  - The recently-planted wording now comes from PKR-SGT-000002.
- **Checked.** The build passes. A content comparison showed identical wording before and after, except that dead wood's source list is now complete: 14 sources instead of 2.
- **Records.** The records and KIT tooling live in `Knowledge Curation System/Live Intelligence Library/`. See `AI/Skills/KIT_LIL_Publication_Skill.md`.

**Outstanding for the app:**

- **Comparison images** are still a documented gap. The UI says so.

## 3.4 Common Questions and the Blind-Shoot Check (1–2 October 2026)

Both are in the code on `main` at commit `7bf0f2c`. This section was written from that code and from the Published records. The live site was not opened for it.

**Common questions** (`App/src/data/commonQuestions.ts`, `App/src/components/CommonQuestions.tsx`).

- **Where they appear.** Seventeen tappable questions, shown on the Welcome screen, the plant list, each plant's page, and at the relevant steps of the pruning journey.
- **How an answer is built.** Each answer is assembled when it is opened, from statements in Published records in the Live Intelligence Library (LIL). Every statement shows its own confidence, and the answer ends with "Where this comes from". The app adds no horticultural wording. Three answers open with one line of app copy.
- **Fifteen questions have answers.**
  - Thirteen reuse statements from records the journey already uses: PKR-SGT-000001, PKR-OBS-000001, PKR-OBS-000007 and PKR-CGD-000002 to 000006.
  - "Can I kill my rose by pruning too hard?" reads PKR-CGD-000007.
  - "Why isn't my rose flowering?" reads PKR-CGD-000008. Opened on a plant's page, it also offers the blind-shoot check for that plant.
- "Should I spray my roses?" reads PKR-CGD-000009, the lead question of the Spraying topic (published 5 October 2026). Its answer offers the topic's six other answers, PKR-CGD-000010 to PKR-CGD-000015, under "More about spraying". "Black spots on the leaves?" offers them too.
- "When can I plant or move a rose?" reads PKR-CGD-000016, the lead question of the Planting and moving topic (published 6 October 2026). Its answer offers the topic's five other answers, PKR-CGD-000017 to PKR-CGD-000021, under "More about planting and moving".
- **Every question in the list now has an approved answer.** A question with none says Pip is still learning, and records the tap in the table `public.question_interest`; a failed insert never affects the gardener. That path is kept for questions added later.
- **Missing statements.** A question whose statements cannot be found in the Published records is left out.
- **Wording.** The question wording is app copy, approved "for now" by a Founder in chat on 2 October 2026.

**Blind-shoot growing-season check** (`App/src/pages/BlindShootCheck.tsx`, route `/plant/:id/blind-shoots`). It reads PKR-OBS-000008 and PKR-DEC-000008.

- **Where it sits.** A separate screen, outside the pruning journey and its dormancy gate (PKR-SGT-000001). `App/src/data/pkr.ts` marks the observation `session: 'growing-season'` and keeps it out of the journey's observations.
- **How a gardener reaches it.** From "Check for blind shoots" on the page of a Hybrid Tea, Floribunda or Grandiflora, and from the "Why isn't my rose flowering?" answer on a plant's page. A rose of any other saved type gets the journal-only message.
- **Steps.**
  1. Pip asks whether other shoots already have flower buds or flowers. Only Yes continues; any other answer ends with a note to come back later.
  2. The recently-planted check (PKR-SGT-000002) runs. Where it restricts, Cut is not offered.
  3. Pip shows what to look for, says it cannot confirm a blind shoot from a photo, and asks the confirm question.
  4. Confirmed leads to PKR-DEC-000008's choices. Doesn't match is recorded and never reaches Cut. Not sure offers only the choices that are not Cut.
  5. After a Cut, Pip shows the record's cut method and the shortening guidance from PKR-CGD-000002, each with its sources.
  6. The check loops on "Can you see any more …?" and saves the `'none-remaining'` marker when the gardener answers no.
- **What is saved.** Each decision is saved to the plant's journal as an observation record that names the two records and their versions.
- **Wording.** The screen's own app copy was approved "for now" by a Founder in chat on 2 October 2026.
- **Not yet done.** There is no comparison image for blind shoots; this is a documented gap. The session handoff of 2 October 2026 records a browser walk-through that reached the confirm question and saved no records. The steps after it have not been walked through in a browser.

**"How Pip works"** (`App/src/data/learnTopics.ts`, `App/src/pages/Learn.tsx`, `App/src/pages/LearnTopic.tsx`). The area formerly named "Learn" was renamed on 2 October 2026. It holds seven topics about Ask Pip itself, plus a link to the opening explainer: the pruning session, the four choices, how Pip looks at a photo, more than pruning, the rose's journal, why Pip sometimes isn't sure, and a word list. The word list shows the five confidence levels from PKR-DEF-000001 to 000005. The copy is approved "for now" by a Founder in chat, 2 October 2026, and contains no horticultural claim. The route is still `/learn`.

**Pip's poses** (`App/src/components/PipAvatar.tsx`, `App/src/components/ChatBubble.tsx`). Since 2 October 2026 the avatar beside Pip's messages has five poses: front (the default), waving, gesturing, thumbs-up and thinking. A screen picks one with the `pose` property. The images are `App/src/assets/pip/pip-*.webp`, made from `Graphics/Pip Cut-outs/`. Checked in a browser on the sign-in screen and in a test page of all five poses; the signed-in screens were not opened. Pip also has two sitting images (`PipSitting` in `PipAvatar.tsx`; frame measurements in `pipSittingFrame.ts`): hands on the edge, and gesturing. He sits on the top right edge of the answer card in "Questions gardeners ask" (`CommonQuestions.tsx`), alternating between the two from one question to the next, and always with both hands down when he can't answer yet. Checked in a test page at two phone widths.

**Home-screen app** (2 October 2026; `App/public/manifest.webmanifest`, `App/public/sw.js`, `App/public/icons/`, `App/src/lib/homeScreen.ts`, `App/src/components/NewVersionBanner.tsx`). On Android in a browser other than Chrome or Samsung Internet, the "Add to home screen" instructions add a line suggesting Chrome, because those browsers add a shortcut whose icon carries the browser's logo (`chromeGivesCleanerIcon` in `homeScreen.ts`).

- **What it does.** A gardener can add Ask Pip to their phone's home screen from "Add to home screen" in the menu. It then opens full-screen with its own icon, and opens without a connection.
- **What is kept on the phone.** Only the app's own page and files. Requests to other sites (Supabase, fonts) are never stored, so sign-in, the journal, photos and the live rose knowledge are always fetched fresh.
- **How a new version arrives.** The page is fetched from the network first. If the app is open when a newer build goes live, it shows "A new version of Ask Pip is ready" with a Refresh button.
- **Release order still matters.** An installed copy can stay open for days. Keep deploying the app before publishing records it depends on.
- **Checked.** Type-check, build, lint, and an automated browser run of 18 checks (manifest, icons, storage, opening offline, the three sets of install instructions, the new-version message and Refresh). **Not yet tried on a real Android phone or iPhone.**
- **To change what is stored,** change `CACHE` in `sw.js`; the old store is deleted when the new worker takes over.

**Also built in the 1 October 2026 redesign trial** and present in the same code: the "This season" card (`App/src/components/SeasonCard.tsx`, on the plant page and the journey's care step), the whole-session progress stages and three-step photo coaching in `App/src/pages/Journey.tsx`, and the Google Gemini photo disclosure in the journey and on the About page. `CHANGELOG.md` has the full list.

## 3.5 Topics, Local Statements, Limits and Labels (5 October 2026)

Built so that a subject's whole body of approved findings reaches gardeners, in short answers, without typed questions. Governed by PKR Standard §5.7 and the Pip Knowledge Rules §3A (Version 0.3: plain words, sources under the answer, and only what helps a gardener).

**Topics** (`App/src/data/commonQuestions.ts`, `App/src/data/pkr.ts`). A Care Guidance record may carry `content.presentation.question_answer` (`topic`, `topic_title`, `order`). `publishedQuestionAnswers()` reads every such Published record. The record with order 1 is the topic's lead question. A built-in question becomes the lead once its topic is Published (`TOPIC_FOR`: `spraying`, and `plant-move` for the topic `planting`), and stays "still learning" until then. The other records in the topic are offered under the answer as "More about …", and each of those offers the rest. Follow-up answers are keyed `pkr:<record id>` and need no app release when a new one is published. "Black spots on the leaves?" offers the spraying topic's answers once they are Published, and its first line then stops saying Pip can't say how to treat it.

**Local statements** (`App/src/lib/place.ts`, `placeGeo.ts`, `usePlantPlace.ts`, `App/src/data/places/`; rebuilt 6 and 7 October 2026 on a Founder's decision that a country alone is not enough). A statement may carry `place`, a list of place codes: a country (`NZ`), a region (`NZ-CAN`), a group of regions (`NZ-N`, `NZ-S`, `GB-ENG`) or a town the research names (`NZ-OTA:Dunedin`; the list is `TOWNS` in `place.ts`). `usePlantPlace(plant)` gives every place a plant is in. A typed country, region and town are read from names and common spellings. A GPS position is placed against simplified region outlines for the five countries (Natural Earth, public domain), on the gardener's own device; the outlines load only when needed and nothing is sent anywhere. Within 10 km of another region the app does not decide: `CommonQuestions` asks the gardener which region the rose is in, saves the answer with the plant, and offers "Somewhere else, or I'm not sure". It asks only where the answer would change what is shown. A town is matched by its typed name or by a position within 15 km. Where the place isn't known, marked statements are left out and one line says so. Where a question has nothing for the plant's place, the answer says so and the tap is recorded in `question_interest`. Only the plant page passes a place; the Welcome and plant-list pages have no plant, so they never show local statements. A position just across a foreign border (for example Tijuana) is asked about, not placed.

**Month-level timing** (`App/src/data/commonQuestions.ts`). The built-in question `months`, "Which months do I prune my rose?", is the lead of the topic `timing` ("When to do each job") and appears second in the list once that topic's first records are Published. The six records are shared by the five countries: each country's statements are added to them as new versions, marked for their places. The New Zealand statements (PKR-CGD-000022 to PKR-CGD-000027, Version 1.0) were approved on 7 October 2026 and the Australian statements (the same records, Version 1.1) on 8 October 2026; a rose outside New Zealand and Australia is told Pip has nothing for that place yet. Sydney (within 40 km) and Brisbane (within 25 km) were added to `TOWNS` for the Australian statements. Nothing is marked for the Australian Capital Territory, so a rose there sees the statements for all of Australia.

**Limits and labels** (`App/src/components/PkrStatements.tsx`). `StatementLimit` shows a statement's `limit` under it in smaller type. `StatementTag` shows the confidence level, or "Precaution" with the level, or "Sources disagree", or "No source found", or nothing for app framing, by the statement's `kind`.

**Checked** in a headless browser at phone widths (390 and 320 pixels), first against test copies of the seven spraying records and again on 5 October 2026 against the published records, and on 5 October 2026 against test copies of the six planting and moving records (identical in wording to those published), for six cases: no plant; New Zealand by name; Australia by position; the United States; the United Kingdom; and a position in Canada. On 7 October 2026 the place piece was run against 65 towns and cities in and around the five countries, and test copies of the six New Zealand timing records were opened for fourteen plants (typed and GPS locations across New Zealand, two that needed the region asked, and plants in Sydney, the United Kingdom and Tokyo); each saw the statements for its own place and no others, and the Spraying and Planting answers were unchanged. The same fourteen plants were run again on 7 October 2026 against the published New Zealand records: all 40 approved statements appeared word for word, each only in its place. The build passes. Not checked: the signed-in screens, and a real phone.

# 4. Phase B — Blocked on Founder-Approved Knowledge

Phase B covers the Primer's remaining horticultural cards, the "Pruning your bush rose" Learn shelf, the before-you-cut lesson, and observation ordering. None of it can be built with real content until the underlying research clears Founder review, is compiled into an Approved Research Compilation (ARC), and is published as a PIP Knowledge Record (PKR) by the Knowledge Integration Technician (KIT). Writing placeholder horticultural content into the app ahead of that is exactly the problem `learnTopics.ts`'s own governing comment warns against, and shall not be done to make Phase B appear further along than it is.

**Updated 29 September 2026:** the six FRDs previously listed here were all reviewed, compiled into ARCs, and published as PKRs. The suckers and post-bud-break commissions were published too. The guided journey itself is no longer blocked (§3.3). What remains Phase B is the Primer's horticultural cards, the "Pruning your bush rose" Learn shelf and the before-you-cut lesson, which can now be written from the Published PKRs.

# 5. Verifying Current Status Directly

This document can go stale the moment a session forgets to update it. Where precision matters, check directly:

- **App code state:** stage the relevant file from the device (`C:\AskPIP\core\App\src\...`) and read it, or ask the Founder to confirm a push landed. `App/` source is not mirrored into the Garden Shed's `shed_items` table — only the documentation and governance folders are (see the Known Issues Context) — so Supabase queries cannot confirm app code state.
- **FRD review status:** query `shed_form_responses` for the relevant `shed_items` id. An empty result means no review has been recorded yet, regardless of what a to-do's status field says (to-do status reflects who has opened or touched the to-do, not whether a review was actually submitted).
- **Session task list:** the `TaskList` tool reflects only the current AI session's own tracking and does not carry forward. Do not treat it as a source of project state for a new session.

# 6. Revision Log

- **23 September 2026 (Version 0.1):** Initial version. Records Phase A as built: photo-first onboarding, trace-the-stem confirmation, journey pause/resume, the Learn home-screen entry point, and confirms journal/growth visibility was already complete. Records the knot-question/photo-spot fields and the Primer shell as deferred within Phase A, and the front-door explainer / About Ask Pip shelf / contextual links as built but not yet reconciled against the Flow Proposal's exact specification. Records six FRDs as the current Phase B blocker.

- **29 September 2026 (Version 0.2):** Added §3.3, the guided journey wired to Published PKRs: PKR data module, rose-type and interactive dormancy gates, removal-only session, observation loops with the none-remaining resume marker, Decision Logic, Care Guidance and the basic-care branch. The build passes. Recorded as outstanding: the database constraint change, rose type not saved, the journal care reference, and comparison images. §4 updated because the six FRDs are now published.

- **29 September 2026 (Version 0.2, later the same day):** Rose type is now saved on the plant and asked once, in Add a plant. The journey skips the question when a type is saved. The plant page shows and changes the type, and shows basic care for supported types. Both database changes are applied and verified.

- **1 October 2026 (Version 0.2, update):** The app now reads the Live Intelligence Library, with the committed snapshot as its offline fallback.

- **2 October 2026 (Version 0.2, update):** Added §3.4: the common questions and how their answers are built from Published records, including the two answers that read PKR-CGD-000007 and PKR-CGD-000008; the blind-shoot growing-season check (PKR-OBS-000008, PKR-DEC-000008); and a pointer to the rest of the 1 October redesign trial.

- **2 October 2026 (Version 0.2, update):** Recorded the rename of "Learn" to "How Pip works", its two new topics, and its wording approval.

- **2 October 2026 (Version 0.2, update):** Recorded Pip's five poses and where the pose is set.

- **2 October 2026 (Version 0.2, update):** Recorded Pip's two sitting images and his place on the common-question answer card.

- **2 October 2026 (Version 0.2, update):** Pip's sitting pose alternates between answers. PKR-CGD-000007 and PKR-CGD-000008 are v1.1 (first-person wording); six lines of app wording put in the first person.

- **2 October 2026 (Version 0.2, update):** Recorded the home-screen app: manifest, icons, service worker, menu item and new-version message.

- **2 October 2026 (Version 0.2, update):** Recorded the Chrome suggestion shown to Android gardeners in other browsers.

- **3 October 2026 (Version 0.2, update):** The menu's Disclaimer is now "About this beta" and the contact address is founders@askpip.garden. An invite gate exists in the database (`hook_beta_invite_only`) but is not switched on, so sign-in is still open to any address. The app has no feedback form yet, although the website wording promises one.

- **3 October 2026 (Version 0.2, update):** The invite gate is on: a Founder enabled Supabase Auth's "Before User Created" hook with `hook_beta_invite_only`, so a new account needs an approved request in the Shed's Beta Requests. Existing accounts are unaffected. The website is live at askpip.garden. The app now has a feedback form (`pages/Feedback.tsx`, wording in `data/feedbackForm.ts`, approved by a Founder in chat; record in `Working/AI Outputs/Ask_Pip_Feedback_Form_Wording.md`). Pip offers it when a pruning session is saved (`Journey.tsx` now goes to `/plant/:id/feedback/pruning`, where "Not now" leads to the plant's page) and on the last screen of the growing-season check (`BlindShootCheck.tsx`). The menu has "Give feedback" (`/feedback`). Feedback is sent with `app_send_feedback` and read in the Garden Shed's "Beta Feedback" tool; it never goes to Pip, and the form says so. Not yet checked with a real gardener's feedback from the deployed app.

- **5 October 2026 (Version 0.3):** Added §3.5: question answers grouped into topics and read from the Published records; statements shown by the plant's country; limits and the Precaution, Sources disagree and No source found labels.

- **7 October 2026 (Version 0.6):** §3.5 rewritten for places inside a country (regions, groups of regions and towns, worked out on the device, with the gardener asked near a region's edge) and for the month-level timing question.

- **7 October 2026 (Version 0.7):** New Zealand month-level timing approved and its records in the snapshot; the place test rerun against the published records.
- **8 October 2026 (Version 0.8):** Australian month-level timing approved and in the snapshot (the six timing records at Version 1.1); Sydney and Brisbane added to the named towns. Checked in a headless browser for seventeen plants against test copies identical in wording to the published records.

# End of Document

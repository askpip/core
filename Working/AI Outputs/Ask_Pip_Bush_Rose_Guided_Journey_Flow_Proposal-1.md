# Ask Pip – Bush Rose Guided Journey Flow Proposal

## Document Metadata

**Document Title:** Ask Pip – Bush Rose Guided Journey Flow Proposal  
**Document Type:** Draft Planning Document (proposal)  
**Version:** 0.3  
**Status:** Draft — prepared for Founder review. Not approved. It does not amend any approved document.  
**Owner:** The Founders  
**Prepared By:** Claude, at Shaphan's request  
**Date:** 22 September 2026  
**Purpose:** To propose how the Ask Pip bush-rose experience should flow from first welcome to follow-up: an opening that begins with the gardener's own rose, a plant profile that deepens without burdening the gardener, an optional training layer, and a Pip who grows in understanding alongside the gardener.  
**Revision Note (Version 0.3, 22 September 2026):** Records two decisions Shaphan made in discussion: (1) basic rose care belongs in the MVP journey itself, not only in pruning, so that a rose found not ready for pruning at Stage 3 still has something useful from Pip (see the new note under Stage 3, section 6); (2) a `BUSHROSE-BASICCARE` research commission has been drafted to supply that content and the Learn area's general-care pages honestly (see `Working/AI Outputs/Research_Commission_Record_Basic_Bush_Rose_Care.md`). Also records that the Learn area's opening-page explainer and its first five "About Ask Pip" topics (section 9.2) have since been built as working screens, reachable from the header's ⋯ menu — all still draft concept copy, not Founder-approved phrasing.  
**Revision Note (Version 0.2, 22 September 2026):** Adds the Learn area and the opening-page explainer at the Founder's request (new section 9). Later sections are renumbered accordingly.  
**Related Documents:** `MVP/Stories/Maries_Story.md`; `MVP/Journeys/Ask_Pip_MVP_Bush_Rose_V1_First_Guided_Care_Journey.md`; `MVP/Architecture/Ask_Pip_MVP_Bush_Rose_V1_Architecture.md`; `Knowledge Curation System/Standards/Pip_Runtime_Architecture.md`; `Foundations/Pip_Character_Profile.md`; `Foundations/Gardener_Experience_Charter.md`; `Working/Founder Review/FRD-BUSHROSE-PRUNINGFRAMEWORK-01_Decision_Brief.md`; `Working/AI Outputs/Research_Commission_Record_Basic_Bush_Rose_Care.md`; `Working/Project_Backlog.md`

---

# 1. The Proposal in Brief

The first Ask Pip app was built to show how a working product would look and feel. It did that well: gardeners can sign in, build a plant profile and be guided through a pruning journey. The next step is to shape that journey around one idea from the Gardener Experience Charter: the gardener grows in understanding, and Pip grows alongside.

The proposal has five parts.

1. **Begin with the rose.** The gardener's first minute is spent meeting their own rose (a photograph, a name and a few easy questions), as Marie's Story describes.
2. **Deepen the profile gently.** A short first profile, then more detail asked only when it is about to be useful, and much of it gathered automatically through the journey.
3. **Offer training, never require it.** An optional *Pruning Primer* that shows the shape of the whole job before the first stem is examined, with the same teaching offered in small pieces at the moment each idea is needed.
4. **Keep learning within reach.** A *Learn* area the gardener can open at any time, starting on the opening page with *What can Pip help me with?*, so that no one is ever left guessing what Pip is for or why it asks what it asks.
5. **Let Pip grow.** Pip's understanding of the rose is the rose's accumulating record. Pip's way of speaking changes because of what that record contains: more explanation at the start, more questions to the gardener as their own judgement develops.

The journey has seven stages: Meet Your Rose, The Shape of the Job, Getting Ready, Learning to See, Deciding and Cutting, Keeping the Story, and Coming Back. Section 4 sets them out. Section 13 lists the decisions the Founders are asked to make.

*Research references.* Where this proposal cites research, the numbers are the Assessed Findings (AF-1 to AF-30) in the Founder Review Dossier (FRD) for whole-bush pruning, `FRD-BUSHROSE-PRUNINGFRAMEWORK-01`, each rated High, Moderate or Low. The Decision Brief explains the ratings. None of these findings is approved yet.

# 2. What It Could Feel Like

*This scene is illustrative. It extends Marie's Story to show the proposed flow and does not amend the approved Story. Pip's wording is concept copy, not approved phrasing.*

Marie opens Ask Pip on a cold winter morning and chooses **Help me prune my bush rose**. Pip's first words are about her rose, not the app.

> Let's meet your rose. Stand back until you can see it from the base to the tips, then take a photograph.

The photograph fills the screen and becomes the first page of a journal. Pip asks what she calls the rose. She types *Sarah's Rose*, and the words settle beneath the photograph. It looks like something she owns. Three more easy questions follow: what kind of rose it is, where it grows, and, if she likes, why it matters to her. The whole opening takes about two minutes.

Then Pip offers a choice.

> Would you like a short tour of how pruning works before we look closely at Sarah's Rose? Or we can learn as we go.

Marie has stood in front of this rose with secateurs and been unable to make the first cut. She takes the tour. It is five cards, one idea each: why gardeners prune, the shape she is working towards, the order the work goes in, what usually comes out, and how she and Pip will work together. The last card promises that Pip will suggest what it can see, Marie will check the real rose, and nothing is cut until she has traced the stem. She taps **I'm ready**.

When the safety questions arrive, Marie is no longer facing a tangle. She has a map, and Sarah's Rose already has a journal with three entries in it.

# 3. Design Principles

1. **One question at a time.** Each screen asks or teaches one thing.
2. **The gardener chooses the depth.** Every layer of learning is optional and can be opened later. Skipping costs the gardener nothing.
3. **Show, then explain.** Pip points at something in the gardener's own photograph before naming the idea. This follows Pip's Notice, Name, Explain, Consider, Care, Remember pattern in the Pip Character Profile.
4. **The story visibly grows.** Every stage adds something to the rose's journal, so the gardener can see what they have made.
5. **Honest uncertainty is a good outcome.** *Not sure*, *Decide later*, *Not today* and *Get experienced local help* are all respected results and are never presented as failure.
6. **No pressure.** The Character Profile rules out manufactured urgency. This proposal applies the same spirit to streaks and reward mechanics, which it leaves out, and ties the return visit to a real event in the rose's season.
7. **The gardener stays in control of every cut.** This principle is already approved in the Bush Rose V1 Architecture and is preserved unchanged.

# 4. The Journey at a Glance

| Stage | The gardener | Pip's role | The journal gains |
|---|---|---|---|
| 1. Meet Your Rose | Photographs and names the rose; says what it is, where it grows and why it matters | Host: welcomes, asks, reflects the rose back | First page: photograph, name, type, place, personal meaning |
| 2. The Shape of the Job *(optional)* | Takes a short tour, or chooses to learn as they go | Guide: shows the whole job before the details | Note of the chosen learning path |
| 3. Getting Ready | Answers readiness questions; prepares tools and space | Careful companion: explains why each check matters | Readiness record, or a planned return date |
| 4. Learning to See | Takes baseline photographs; checks each proposed observation on the real rose | Coach: proposes, compares, then steps aside for the gardener to check | Photographs and confirmed, corrected or unresolved observations |
| 5. Deciding and Cutting | Chooses Cut, Leave, Decide later or Get experienced local help; traces each stem before cutting | Steady partner: lays out reasons and choices | Decisions with reasons |
| 6. Keeping the Story | Takes the after photograph; corrects the summary; sets a return date | Keeper of the story: brings the session together | Before and after photographs; a correctable session summary |
| 7. Coming Back | Returns for one comparison at the season's turn | Remembering friend: opens with what the gardener chose last time | Follow-up comparison added to the same history |

# 5. Pip Across the Journey

Pip is described in the Pip Character Profile as warm, curious, wise, honest, patient and hopeful. It uses plain language first, says "may" and "could" when evidence is limited, and admits when it does not know. Pip has no defined gender, and this proposal follows that throughout.

## 5.1 How Pip Grows

Pip's growing understanding is real, not theatre. It is the accumulating record of this gardener's rose: photographs, confirmations, corrections, choices and outcomes. The Gardener Experience Charter promises that Pip's understanding grows alongside each plant's story. Pip's voice can show that in four ways.

- **Naming once, then using plainly.** Pip introduces a new word (*framework*, *crossing*, *dormant*) once, in context, and uses it without fuss afterwards.
- **Referring to the story.** From the second stage onward Pip uses what the record holds: the rose's name, the gardener's earlier answers, and later, their choices. *Last time you left the rubbing stem to watch. Shall we look at it first?*
- **Explaining less, asking more.** As the gardener confirms observations, Pip moves from *here is what to look for* to *what do you notice first?* This shift should be driven by the recorded history (for example, the number of observations the gardener has already confirmed) and not by guesses about the gardener's skill.
- **Celebrating what the gardener did.** Pip's closing lines name the gardener's own achievements: *You traced that stem yourself.*

## 5.2 Illustrative Wording

The lines below show intended character and rhythm. They are not approved phrasing. Under the Pip Runtime Architecture, any horticultural statement Pip makes must come from published knowledge, and the mechanism for approving a pool of phrasing has not yet been decided (Runtime Architecture §8.2 and §9).

| Moment | Illustrative Pip line |
|---|---|
| Welcome | *Let's meet your rose.* |
| Offering the primer | *Would you like a short tour first, or shall we learn as we go?* |
| A proposal from a photograph | *This stem may be dead. Can you find it on your rose and look closely?* |
| Honest uncertainty | *From this photograph I can't tell. Let's try another angle, or leave it for now.* |
| After a good check | *You found the point where they touch. That is exactly what to look for.* |
| Deferral | *Not today is a good answer. Shall we pick a day when the buds are easier to read?* |
| The return | *Welcome back to Sarah's Rose. Let's put last winter's photograph beside today's.* |

# 6. Stage by Stage

## Stage 1 — Meet Your Rose

**Experience.** The order of Marie's Story is followed: begin, photograph, name, type, place, optional personal meaning. The photograph comes first because it makes the rose real at once. In the current app it is the last step of the profile.

**What Pip does.** Pip explains why it asks for each thing in a single warm sentence, and shows the rose's journal page forming as the answers arrive. The location question keeps the permission-based approach already built (GPS or manual entry, with the season derived automatically). The opening screen also offers a quieter second option beside **Begin**: **What can Pip help me with?** (section 9.1).

**Rose type.** A friendly picture-based question (*Which of these looks most like your rose?*) with *I'm not sure* as a first-class answer. Because the answer may later steer a decision, it needs a closed set of options under Runtime Architecture §6. Free text remains for the variety, the nursery label and the personal meaning, since nothing downstream reasons over them. Until a supported-rose-type gate exists (Architecture §5.4, still open), the answer is recorded as data only.

**What the journal gains.** A first page the gardener will want to keep.

## Stage 2 — The Shape of the Job (optional)

**Experience.** After the profile, Pip offers three doors: **Show me the shape of the job** (about two minutes), **Teach me as we go**, or **I'm ready, let's begin**. The choice is remembered and can be changed at any time. The tour stays reachable from the Learn area (section 9) for a second visit or a second year.

**Content.** See section 8.

## Stage 3 — Getting Ready

**Experience.** The existing readiness checks (dormancy, established rose, visible condition, clean and sharp tools, protection, safe access) are reframed as one question: *Is today a good day to prune?* Pip explains the reason behind each check, as it does in Marie's Story when her secateurs are found to be catching.

**Ask once.** The planted-date answer given in the profile feeds the readiness check, so the gardener is asked once.

**A "not yet" is an outcome.** If the rose is not ready, Pip records why and proposes a locally sensible return point, so the gardener leaves with a plan and the journal has an entry. This uses the event-based return the approved Journey already describes (§8).

**A "not yet" should not be an empty-handed outcome.** Shaphan's view, given in discussion on 22 September 2026, is that a rose turned away from pruning still has a gardener who wants to do something for it — so this moment should offer basic care for the waiting period, not just a return date. This depends on the `BUSHROSE-BASICCARE` commission (drafted, not yet authorised — see `Working/AI Outputs/Research_Commission_Record_Basic_Bush_Rose_Care.md`) rather than on any knowledge Ask Pip has today. Recorded here as a direction, not yet a built behaviour.

## Stage 4 — Learning to See

**Experience.** Pip asks for an overview photograph from a *photo spot* and several close-ups. The photo spot is a place the gardener chooses and Pip helps them note (*by the path, beside the kitchen window*), so that the follow-up comparison is truly like for like, as Marie's Story pictures it.

For each observation Pip follows the approved pattern: propose from the photograph, show an approved comparison, ask the gardener to check the real rose, record *confirmed*, *corrected* or *unresolved*. The order of observations should follow whatever the approved research supports; the current research reports that sources deal with dead, damaged and diseased wood first (AF-12, High).

**Honest content boundary.** Of the four observations the app scripts today, only dead wood has approved research behind it. Under Runtime Architecture §7, Pip's knowledge is bounded to what is published. Once real gardeners use the app, an observation without published knowledge should be presented plainly as still being prepared, not carried by placeholder script (Decision 5, section 13).

## Stage 5 — Deciding and Cutting

**Experience.** Pip presents the plan built from the gardener's confirmed observations, with the four choices for each item: Cut, Leave, Decide later, Get experienced local help.

**Trace before cutting.** The approved Journey (§6) requires the gardener to confirm the intended stem on the physical rose before every cut (*Can you follow that stem all the way to where you plan to cut?*). I found no such step in the current app. It is the emotional centre of Marie's Story and should be built.

**Before you cut.** When the gardener chooses Cut, Pip offers a short, optional lesson on making the cut. The research reports strong agreement on choosing an outward-facing bud (AF-21), matching the tool to the thickness of the stem (AF-25) and using sharp, clean tools (AF-27), all rated High. The findings on angle, slant direction, distance above the bud and sealing carry moderate or low ratings or open conflicts. They should not be taught as settled unless the Founders decide how disagreement is to be presented.

## Stage 6 — Keeping the Story

**Experience.** Pip invites an after photograph from the same photo spot and shows the two side by side. It brings the session together in plain words, and the gardener corrects anything before it becomes history. Pip then names what the gardener did (*confirmed three observations, cut one stem, chose to get help on another*) and proposes a return window that the gardener can accept, change or decline.

## Stage 7 — Coming Back

**Experience.** At the season's turn Pip opens with what the gardener chose last time and asks for comparable photographs. The earlier and current photographs appear together, and Pip proposes what may have changed while the gardener checks the real rose.

**Build status.** The current app has no follow-up flow (I found none in the code), so this stage needs to be designed and built. The Architecture (§6.4) already defines how the timing is set.

# 7. The Plant Profile: Detail Without Burden

The profile should feel like getting to know the rose, not filling in a form. The principle is to ask when the answer is about to be useful, and to gather the rest automatically through the journey.

| Tier | When asked | Items | Notes |
|---|---|---|---|
| **Meet** *(about two minutes)* | Stage 1 | Photograph; name; rose type (picture-based with *I'm not sure*); variety (optional); location; personal meaning (optional) | Only the name is truly required. |
| **Know** *(asked in context; every item skippable)* | Where it will be used | When planted (Stage 3); nursery label and label photo (any time); whether a knot or swelling is visible near the base (Stage 3) | The knot question is already Founder-approved (9 September 2026), recorded as data only and not wired into any gate. It is not yet built. |
| **Grow** *(gathered automatically)* | Through use | Photo spot; before and after photographs; observations and choices; follow-up comparisons; the gardener's notes | No forms. The journal fills as the gardener works. |

**Candidate additions.** More profile fields are possible, but each one should earn its place by being used: either by an approved gate or observation, by making the follow-up comparison better, or by being something the gardener finds meaningful. Only two additions are proposed now: the photo spot and the already-approved knot question. Any others (for example, sun exposure or whether the rose has been pruned before) should wait until knowledge exists that uses them.

**Decision-relevant answers** must resolve to a closed, Founder-approved answer set before they reach the decision logic (Runtime Architecture §6). Free-text fields are for the gardener's own words and are never treated as evidence.

# 8. The Optional Pruning Primer

## 8.1 Purpose and Shape

The Primer answers the question a beginner is silently asking: *what am I actually trying to do?* It is a short, skippable, revisitable tour in Pip's voice, not a course. Three entry paths keep it optional:

- **Show me the shape of the job:** about five cards, one idea each, each with a **Tell me more** layer for the curious.
- **Teach me as we go:** no tour; the same ideas appear as a small *New idea* moment the first time each is needed.
- **I'm ready:** straight to Getting Ready. The Primer remains under *Learn* in the journal.

Each card follows Pip's teaching pattern in miniature: notice something in a picture, name the idea, explain why it matters. Where a card carries a confidence rating or sources, the gardener can open them, as Runtime Architecture §5.3 provides.

## 8.2 Proposed Cards and What Each Depends On

| Card | Idea | Knowledge behind it | Status |
|---|---|---|---|
| 1. Why we prune | Removing unhealthy wood, opening the bush to light and air, encouraging flowering growth | AF-1 (High) | Awaiting Founder approval of the FRD |
| 2. The shape we're aiming for | An open, vase-shaped bush with canes spread round the base | AF-14 (High) | Awaiting Founder approval of the FRD |
| 3. The order of work | Dead, damaged and diseased wood first; unwanted growth out before shortening | AF-12, AF-13 (High) | Awaiting Founder approval of the FRD |
| 4. What comes out | The categories the sources agree on: damaged or diseased, crossing or rubbing, weak or spindly growth | AF-2, AF-3, AF-5 (High) | Awaiting Founder approval of the FRD |
| 5. How we'll work together | Pip suggests, the gardener checks the real rose, the gardener decides; four choices; no cut until the stem is traced | The approved Journey and Architecture | Approved product description |

Findings rated Moderate or Low, and the ten recorded conflicts between sources, do not appear in the Primer unless the Founders decide how they should be presented. A related pair of findings bears on scope: once-flowering roses are pruned differently (AF-19, High) and hybrid teas are pruned differently from floribundas (AF-18, Moderate). They may fit best at the profile's rose-type question, where the gardener is deciding whether Pip can guide this rose.

## 8.3 Length and Format

The whole Primer should read in about two minutes. The Decision Brief runs to some 46,000 characters and is written for two Founders reviewing a research commission. A gardener needs one idea at a time, with a picture.

# 9. Learn: A Knowledge Base for Any Time

A gardener should be able to ask *what is Pip for, and why?* at any moment: before signing up, halfway through a journey, or a year later when the season turns. This section adds a place to ask.

## 9.1 The Front Door

Marie's Story shows the opening screen as the tagline and a single **Begin** button. This proposal adds a quieter second option beneath it: **What can Pip help me with?** It opens a short explanation in Pip's voice, about a minute long, available before any account is created. It answers five questions.

1. **What does Pip help with?** Understanding an individual rose, deciding what to cut, leave or come back to, and keeping the rose's story.
2. **Why does Pip work this way?** Trusted knowledge applied to the gardener's own rose, so that the gardener grows in confidence and not in dependence (the Gardener Experience Charter's purpose).
3. **How does it work?** Pip suggests what it can see in a photograph, the gardener checks the real rose, and the gardener decides, with four choices at every step.
4. **What will Pip not do?** Diagnose a rose from a photograph alone, authorise a cut, or guess beyond what it knows. Pip says so plainly.
5. **What happens to my photographs and notes?** They build the rose's own journal and are used for that rose, as the Architecture (§4.4) provides.

This content describes the product and does not teach horticulture, so it does not wait for the research pipeline. Because it is the brand's front door, its wording should be Founder-approved.

## 9.2 The Learn Area

Inside the app, a permanent **Learn** entry is available from every screen and from each rose's journal. It holds three shelves.

| Shelf | Contents | Availability |
|---|---|---|
| **About Ask Pip** | The front-door explanation, plus short pages on how the journal works, what the four choices mean, how Pip uses photographs, and why Pip sometimes says it isn't sure | From the first release; product content |
| **Pruning your bush rose** | The Pruning Primer (section 8), a plain-language glossary (*framework*, *dormant*, *bud*, *crossing*), the approved comparison images, a *what to look for* page for each supported observation, and *how a cut is made* | Grows as knowledge is published; only published topics appear, with no placeholder pages |
| **What I've learned** | The ideas and words the gardener has already met, each beside the photograph where it appeared | Later; drawn from the rose's record, so the library becomes personal |

Every page that carries a confidence rating or sources lets the gardener open them, as Runtime Architecture §5.3 provides.

**Built so far (22 September 2026).** The opening-page explainer (§9.1) exists as a working five-screen sequence, reached from a "Tell me more" link on the Welcome screen. A Learn hub, reachable from the header's ⋯ menu on every screen, now lists it alongside five further About Ask Pip topics: what the journey involves stage by stage, the four choices explained, how Pip looks at a photograph, why Pip sometimes says it isn't sure, and a short glossary of the app's own words (journal, photo spot, observation, confidence rating). All of it is process and product description, deliberately free of horticultural claims, so none of it waited on any research commission. All wording is draft concept copy pending Founder approval, per §9.1. The Pruning your bush rose shelf and any general-care shelf remain unbuilt, gated behind their respective research as this section already describes.

## 9.3 Help Where the Question Arises

Any question or unfamiliar word can carry a small **Why is Pip asking this?** or **What does this mean?** link that opens the matching Learn page and then returns the gardener to exactly where they were. The app already does this in part: the safety checklist has *How can I tell?* buttons. The proposal extends that pattern to every stage.

## 9.4 One Source for Each Idea

Each idea is written once and shown wherever it is needed: in the Primer, in the Learn area and in the contextual links. This keeps the wording consistent and means a correction is made in one place.

## 9.5 Asking Pip a Question

Whether a gardener may type a question inside Learn is left open. If allowed, the Runtime Architecture applies: Pip answers only from published knowledge, says plainly when nothing is published on the subject, and offers the nearest Learn page. Because the Architecture (§5.5) defers general plant questions, Learn stays limited to Ask Pip itself and bush-rose pruning.

# 10. Keeping the Gardener Engaged

Engagement in Ask Pip should come from usefulness and a sense of progress, never from pressure.

- **Ownership from the first minute.** The rose's own photograph and name are on screen before any explanation.
- **Small discoveries.** The best moments in Marie's Story are moments of understanding: the stem that only looked inward from one angle, the shadow that turned out to be a shadow. The flow should make room for them.
- **A journal that visibly grows.** Each stage ends with something added, and Stage 6 names what the gardener has learned and done.
- **Permission to pause.** Pip keeps the gardener's place. *Take your time; I'll be here* is always true.
- **Real reasons to return.** A return is proposed because the season has turned, not because a streak is at risk.
- **Always a way to ask why.** The Learn area and the *Why is Pip asking this?* links (section 9) mean a curious gardener is never left guessing what Pip is for.
- **Honest pride.** Pip recognises the gardener's effort in specific terms. It does not offer generic praise.

# 11. Effect on Approved Documents and Dependencies

**Changes to approved documents.** The Bush Rose V1 Architecture (§3, §6.1) and the First Guided-Care Journey (§3) describe a minimal profile and no orientation stage. The Primer, the tiered profile and the photo spot would extend both. This proposal amends neither. If the Founders adopt any part of it, the amendments should follow the governed process.

**Knowledge.** Under the Pip Runtime Architecture, horticultural content Pip presents must come from published PIP Knowledge Records (PKRs). For the Primer, that means the research passes through Founder approval, an Approved Research Compilation (ARC), and Knowledge Integration Technician preparation of PKRs before its horticultural cards can go live. The Decision Brief is explicit that approving a finding does not decide what Pip tells a gardener. The product-description card (card 5) and the flow itself do not depend on that pipeline.

**Scope of Learn.** The Architecture (§5.5) defers general plant questions and a complete Garden Journal. The Learn area is therefore bounded to Ask Pip itself and bush-rose pruning. Its privacy explanation must describe what the app actually does with photographs and notes, consistent with Architecture §4.4, and should be checked against the real behaviour before it is written.

**Foundation documents.** The Pip Character Profile is approved only as a discussion draft. It does not establish a brand standard. The Gardener Experience Charter remains a Draft awaiting whole-document approval. This proposal draws on both as the Founders' stated intent.

**Unresearched observations.** The Ask Pip minimum viable product (MVP) supports six observations. The Project Backlog, last updated 17 September 2026, records that only dead wood had approved research and that none had been commissioned for the other five. The whole-bush pruning research authorised on 21 September touches several of them, and the crossing-or-rubbing-stems commission is on hold. The full Learning to See stage depends on approved research for each observation.

**Open questions from the Character Profile.** The Founders asked whether Pip could develop as the relationship does (Profile §15). This proposal applies that idea to Pip's voice and memory only. Whether Pip's appearance should also change is a Founder question. The Charter's migration note also refers to a four-stage Teacher, Coach, Companion and Historian model in an unmigrated document. I have not seen that document, so the Pip roles in section 4 are my own and should be compared with it if it is brought into Core.

# 12. Suggested Build Sequence

The sequence is a suggestion for the Founders to reconcile with the Project Backlog.

**Phase A — needs no new knowledge.**
- Photo-first opening in Marie's Story order.
- Meet tier and Know tier of the profile, including the approved knot question and the photo spot.
- The Primer shell with its three entry paths and card 5.
- Trace-the-stem confirmation before each cut.
- Journal growth in view: progress, recap and correctable summary.
- Pause-and-resume.
- The front-door explainer, the Learn area's *About Ask Pip* shelf, and the *Why is Pip asking this?* links.

**Phase B — after the FRD is approved and its knowledge published.**
- Primer cards 1 to 4 and the *Pruning your bush rose* shelf of Learn, growing as knowledge is published.
- The Before-you-cut lesson, limited to the High findings.
- Observation order following the approved research.

**Phase C — further design and research.**
- Follow-up flow (Stage 7).
- The remaining observations and their research.
- Any adaptive-explanation behaviour beyond the simple, record-driven kind described in section 5.1.

# 13. Decisions Requested

Each item carries a recommendation. None is approved by this document.

1. **Direction.** Adopt the seven-stage shape as the direction for the next build of the bush-rose app. *Recommended: yes.*
2. **The Primer.** Add the optional Pruning Primer with three entry paths; ship the product-description card first and add horticultural cards as knowledge is published. *Recommended: yes.*
3. **Profile tiers.** Adopt the three-tier profile; add only the photo spot and the approved knot question now. *Recommended: yes.*
4. **Opening.** Restore the photo-first opening of Marie's Story. *Recommended: yes.*
5. **Placeholder observations.** Once real gardeners use the app, present observations that lack published knowledge as still being prepared, instead of using placeholder script. *Recommended: yes, and the Founders should say when "real gardeners" begins.*
6. **Unsupported rose types.** Choose what happens when the gardener's rose is outside the approved scope: (a) explain kindly, keep the profile, offer no pruning journey; or (b) keep it as a journal-only rose. Option (b) sits close to the Garden Journal that the MVP defers. *Leaning toward (a); a Founder decision.*

7. **The Learn area.** Add the opening-page option *What can Pip help me with?* and a permanent Learn area with an *About Ask Pip* shelf now and a *Pruning your bush rose* shelf that grows with published knowledge. *Recommended: yes. Its wording is Founder-approved product copy, and the front door should be available before sign-in.*

Three further questions are for discussion and do not need an answer now. Should the app have an approved phrasing pool for Pip (Runtime Architecture §9)? Should the Charter's four-stage relationship model be brought into Core and compared with the Pip roles in this document? And should gardeners be able to type questions inside Learn, or only browse and tap?

# 14. Basis and Limits of This Proposal

**Read for this proposal:** `AGENTS.md` (the repository's bootstrap file); the AI Operations Manual and Loading Guide; the Document Creation and Editing Skill and the Writing Skill; the Bush Rose V1 Architecture and First Guided-Care Journey; Marie's Story; the Pip Character Profile; the Gardener Experience Charter; the Vision Statement; the Pip Runtime Architecture; the FRD Decision Brief (headings and findings AF-1 to AF-30); the Project Backlog (items on the profile, observations and Charter); the App README; and the app's `Journey.tsx`, `NewPlant.tsx`, `observationScript.ts` and `suitabilityGates.ts`.

**Not done:** I did not run or click through the app. I did not read `Founding_Principles.md`, the Private folder, the app's remaining pages, or the full FRD. I did not see the unmigrated User Experience Charter. Statements about the current app describe the code as it stands on the Founder's computer.

**Findings quoted here** (AF numbers and ratings) are those in the Decision Brief. They are not approved. Approving them would only allow them into an ARC.

---

# End of Document

# Proposal — Ask Pip in Your Own Words

**Status:** Proposal for Founder approval. Nothing built yet.
**Prepared:** 19 October 2026, by Claude, for the Founders
**Form:** `APP-ASK-PIP-OWN-WORDS_Proposal_Form.md` (one question)
**Affects:** the home screen and each rose's page (a question box), one new server function, one new table, the Privacy text in the menu, and a page in the Shed.

---

## 1. What it is

A box where a gardener types a question in their own words. An AI model reads it alongside the questions Pip can already answer (36 today, including the follow-up answers inside topics) and picks the one that fits, or none. The app then shows that answer in the same answer card as "Questions gardeners ask": Published statements, word for word, with their confidence labels, sources, and the rules for where the rose grows.

**The AI only chooses. It never writes an answer.** Pip still says nothing of its own (rule 8), and every word a gardener reads has been through the Build Check and approved. Answering in the AI's own words is not proposed: it would bypass both.

## 2. How it works

1. The gardener types, for example: "my rose has yellow leaves with black dots, what do I do?"
2. The app sends the question, and nothing about the gardener or the rose, to a server function. The function asks the AI model to choose among the list of questions Pip can answer, and accepts only one of those, or "none".
3. **A match:** the app opens that answer. A line above it shows what Pip understood, so a gardener can tell when it picked wrongly: "Here's what I know about: [question]".
4. **No match:** Pip says so (section 4, line 3) and the question is recorded for the Founders.
5. **Not about roses, or about someone's safety** (a child or a pet eating something, an injury): Pip says it can only help with roses and, for safety, to contact a doctor, vet or poisons line. These are recorded too, so the Founders see them.

## 3. Your decisions

**A. Keeping what gardeners type.** Proposed: keep each typed question, with the date, which answer was chosen (or none), and the gardener's account, for the Founders to read in the Shed. Questions are deleted with the gardener's account. The Privacy text in the menu gains one line (section 4, line 5). Without this, Pip cannot learn what gardeners want to know, which is half the point.

**B. Which AI model.** Proposed: **Gemini**, the same provider and key the dead-wood photo check already uses, so no new company handles gardeners' words. Claude's small model is the alternative; it would mean a second provider. Either way, only the typed question is sent.

**C. When nothing fits.** Proposed wording in section 4, line 3.

**D. Questions that aren't about roses, or are about safety.** Proposed wording in section 4, line 4.

## 4. New app wording (for approval)

1. Box: **Ask Pip in your own words** · placeholder "Type your question" · button **Ask**
2. Above a matched answer: "Here's what I know about: [question]" · under it: "Not what you asked? Try asking another way."
3. No match: "I can't answer that yet. I've noted your question for the Founders, so it can help decide what I learn next."
4. Not about roses, or safety: "I can only help with roses so far. If someone may be hurt or has eaten something they shouldn't, contact a doctor, a vet or your local poisons line now."
5. Privacy, new line: "If you type a question for Pip, the question is kept so the Founders can see what gardeners want to know. It is sent to an AI service only to choose which of Pip's answers fits, and deleted with your account."
6. Limit reached: "That's all the questions I can take today. Try again tomorrow."

## 5. Limits and cost

- At most **20 questions a day per gardener**, and a monthly ceiling for the whole app, after which the box says line 6.
- Each question is a small request to the AI. The running cost is small per question; it will be checked against the provider's current prices before the build and stated in the build record.

## 6. Mock-up

```
┌─────────────────────────────────────┐
│ Ask Pip in your own words           │
│ ┌─────────────────────────┐ [ Ask ] │
│ │ yellow leaves with black│         │
│ │ dots, what do I do?     │         │
│ └─────────────────────────┘         │
│                                     │
│ Here's what I know about:           │
│ Black spots on the leaves?          │
│ ┌─────────────────────────────────┐ │
│ │ (Pip's answer card, as today:   │ │
│ │  Published statements, labels,  │ │
│ │  "Where this comes from")       │ │
│ └─────────────────────────────────┘ │
│ Not what you asked? Try asking      │
│ another way.                        │
└─────────────────────────────────────┘
```

## 7. Build and checks, once approved

- **A test set** of about 100 questions written the way gardeners write (typos, several questions at once, other plants, safety), each with the answer it should get. The build goes ahead only if the right answer, or a correct "none", is chosen for at least 90 of them, and **no safety question ever gets a rose answer**. The results go to the Founders with Pip's first answers.
- The server function holds the key; the app never sees it. Questions are checked for length before sending.
- `npm run build` passes; checked in a headless browser; then a Founder tries it on a phone before gardeners see it.
- The Shed page lists typed questions, newest first, with the answer chosen, so the Founders can spot wrong matches and missing topics.

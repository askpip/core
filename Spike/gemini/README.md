# Gemini validation spike

A standalone test — **not part of the App, not wired into anything live.**
It answers one question: if a real AI model is given the actual Published
dead-wood PKR content (proposal text, confidence rating, sources) plus a
photo and a gardener's question, does it produce an honest answer that
stays inside that content — the way Pip's architecture requires — instead
of inventing things?

Nothing here affects the running app. This is throwaway/scratch code for
deciding whether a conversational, AI-driven Pip is worth building for real.

## Setup (one-time)

1. Copy `.env.example` to `.env.local` in this folder.
2. Open `.env.local` and paste in your Gemini API key (the one you created
   at aistudio.google.com). This file is gitignored — it stays on your
   machine only, never committed, never seen by Claude.
3. Put a test photo in `photos/sample-stem.jpg` — see `photos/README.md`.
4. Make sure you have Node.js 18 or newer installed (`node -v` to check).

## Running it

From this folder:

```
node run-spike.mjs
```

Optional arguments:

```
node run-spike.mjs path\to\other-photo.jpg "Should I cut this stem off?"
```

## What to look for in the answer

- Does it lead with the actual proposal text, or does it go off and
  diagnose the photo freehand?
- If asked, does it give the confidence explanation using the real wording,
  not a made-up paraphrase?
- If you ask it something the PKR content doesn't cover (try a follow-up
  question about, say, fertiliser, or a different plant entirely), does it
  say plainly that it doesn't have confidence-rated information on that —
  or does it improvise an answer anyway? This is the most important check.
- Does the tone sound like something worth putting in front of a gardener?

## Cost

Free, on Gemini's free tier, as long as you stay within the rate limits
shown at aistudio.google.com for your key. No card is required for the
free tier.

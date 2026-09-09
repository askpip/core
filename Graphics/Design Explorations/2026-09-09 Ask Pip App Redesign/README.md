# Ask Pip — Visual Direction Exploration (9 September 2026)

A first visual-craft pass on the Ask Pip app, requested by Shaphan after
reviewing the live app and finding it functionally sound but visually still
an early wireframe. Not an approved design system — a starting point to
react to.

## What this is

Three mobile screens (390×844) reimagining Sign In, Home (the plant
library), and the live dead-wood observation moment — the one point in the
app where Pip's real AI-backed guidance already ships. Built from the app's
actual design tokens (`App/src/index.css`'s `--color-pip-*` palette,
Playfair Display / Dancing Script / system-ui type) and its real Pip
artwork and copy, not a new invented brand. The intent was to show more
depth, warmth and polish than the current flat implementation, while
staying inside the existing visual vocabulary.

**Live, editable version:** https://claude.ai/code/artifact/c309188a-8602-4262-885a-ae172129dcbe
(a Claude Design canvas — click-to-edit, exports PNG/PDF). If that link
ever stops resolving, `ask-pip-mockup.html` in this folder is the same
canvas, self-contained — open it directly in a browser.

## Files

- `ask-pip-mockup.html` — the whole canvas, self-contained (open in any
  browser).
- `Main.dc.html`, `Home.dc.html`, `Journey.dc.html` — the three screens'
  source, plus `canvas.json` (layout) and `pip.png` / `rose.jpg` (the
  downsampled art used). Editable source, not meant to be opened directly.

## One specific idea worth carrying forward

The Sign In screen sketches a "Continue as [name] — skip the code" row for
a recognised device, as a concrete answer to the real friction of email
one-time-codes on every visit. `App/src/lib/keepLoggedIn.ts` already
persists a session across visits by default — worth checking first whether
the friction reported is that mechanism actually failing, versus a genuine
case for adding a faster recognised-device path (or Google/passkey sign-in,
both left open as future options in `AuthGate.tsx`'s own comments) on top
of what's there.

## Not decided here

Whether any of this ships, in whole or in part, is a Founder call — this
is exploration, not an approved direction. See
`Working/AI Outputs/Ask_Pip_Next_Steps_September_2026.md` for how this fits
into the wider list of open work.

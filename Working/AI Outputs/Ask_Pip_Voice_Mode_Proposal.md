# Proposal: Voice Mode for Ask Pip

**Status:** Proposal, not built. **Prepared by:** Claude, at Shaphan's request, 1 October 2026. **Live version:** Claude Doc at https://claude.ai/code/artifact/952d49d1-d571-4363-9418-214ebef06e4b (this file is a copy of it as at 2 October 2026; edits made there aren't copied here automatically).

## Summary

Ask Pip can work by voice: Pip reads its approved answers and steps aloud, and the gardener says the button they would have tapped. Recommendation: build it in three stages, starting with Pip speaking (about 1–2 days), and only add listening once gardeners show they like hearing Pip.

The app is a web app, so all of this can use the speech features already built into phone browsers. No new paid service is needed to start.

## Why

Pruning is hands-on work. Gardeners wear gloves, hold secateurs, and have soil on their fingers, so tapping a phone mid-job is awkward. Voice lets them keep their eyes on the cane Pip is talking about and keep working.

It also helps gardeners who find small screens hard to read, which fits the larger type and Atkinson Hyperlegible font already in the redesign.

## Guardrails

Voice mode keeps both standing Founder rules: no free-text questions to Pip, and every piece of information traceable to its source.

The voice loop: the gardener taps the mic button and speaks. If what they said matches a button on screen, Pip acts as if it was tapped and reads the next approved step aloud. If not, Pip says "I didn't catch that", reads the options, and the gardener tries again.

- **Listening:** Pip only compares what was said against the buttons on the current screen, plus a few fixed words: yes, no, next, back, say that again. Anything else gets "I didn't catch that. You can say…" and the options read aloud. Spoken questions are never sent anywhere as questions.
- **Speaking:** Pip reads the same approved LIL text shown on screen, word for word. Copy shortened or reworded for listening counts as new copy and needs Founder approval.
- **Observations:** the "any more?" loop and the rule that Doesn't Match and Not Sure never reach Cut work the same by voice, because voice only presses existing buttons.

## Three stages

Each stage stands on its own, and each is worth doing only if the one before it works for real gardeners. Effort figures are rough estimates of build and test time.

| Stage | What gardeners get | Effort | Main catches |
| --- | --- | --- | --- |
| 1. Pip speaks | A "Hear this" button on answers; journey steps can be read aloud automatically | About 1–2 days | The voice depends on the phone: decent on iPhone, sometimes robotic on cheaper Androids. A consistent Pip voice would mean a paid voice service later |
| 2. Gardener speaks the button | One large mic button (easy with a gloved knuckle); spoken choices act like taps; yes / no / next / back / say that again | About 1 week, including phone testing | Works in Chrome on Android and Safari on iPhone, not Firefox. Speech is sent to Google or Apple to be turned into text, so it needs a disclosure |
| 3. Fully hands-free pruning | Pip keeps listening during the journey; a spoken "take photo" works the camera | About 2–3 weeks | iPhones stop listening after a while; wind and secateur noise get misheard; constant listening drains the battery |

Stage 1 adds no privacy questions, so it can go first with only copy decisions to make.

## Privacy and disclosure

Speaking out loud (stage 1) happens on the phone and sends nothing anywhere. Listening (stages 2 and 3) is different: the phone's browser sends the audio to Google (Chrome on Android) or Apple (Safari on iPhone) to turn it into text.

- That needs a short disclosure next to the mic button and on the About page, in the same way the Gemini photo note works now.
- The microphone stays off until the gardener taps it, and the browser asks for permission the first time.
- Ask Pip itself stores no audio. It keeps only which button was chosen, as it does for a tap.

## Founder decisions needed

- [ ] Go ahead with stage 1 (Pip speaks)?
- [ ] What Pip reads aloud versus what stays on screen only, such as "Where this comes from" and the confidence tags
- [ ] Whether journey steps are read automatically, or only when the gardener taps "Hear this"
- [ ] Approve any wording shortened for listening (new copy)
- [ ] Before stage 2: approve the microphone disclosure wording
- [ ] Before stage 3: decide whether hands-free is worth the battery and reliability trade-offs

## Testing and what success looks like

Voice has to be tested on real phones, outdoors. Claude can't test a microphone from its cloud workspace, so stages 2 and 3 need Shaphan's phone, ideally in the garden with gloves on.

- **Stage 1 works if:** gardeners use "Hear this" and finish journeys with it on, and the voice is clear enough on both an iPhone and an Android.
- **Stage 2 works if:** spoken choices are recognised first time most of the time in a garden, and the retry message gets people back on track.
- **Stage 3 is only worth it if:** stage 2 is used regularly and gardeners still find tapping the mic awkward.

## Status and next step

Proposal only. Nothing has been built. When ready, the next step is to scope stage 1 against the live app.

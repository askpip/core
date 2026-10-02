# Ask Pip Feedback Form Wording

**Status:** Approved by AskPIP Founder Authority in chat, 3 October 2026 ("approve"): the offer, both forms, how often it is offered, and the Garden Shed tool. Open to change if the other Founder asks for any. **Prepared by:** Claude, at a Founder's request. **Built:** 3 October 2026. The app's copy of these words is `App/src/data/feedbackForm.ts`.

Pip speaks in the first person. The website (approved wording, section 8, "Join the beta") and the invitation email both promise this form: "Pip offers a short feedback form after a session."

## 1. Pip's offer, at the end of a session

> That's our session done. Would you tell the Founders how it went? It takes about a minute, and it helps them make me better.

**Buttons:** Give feedback · Not now

## 2. The form after a session

| # | Question | Answers |
|---|---|---|
| 1 | How did that session go? | It went well / It was mixed / It didn't go well |
| 2 | Was I clear about what to do? | Yes, clear / Some of it was confusing / No, I was often unsure |
| 3 | Did you do what I suggested? | Yes, all or most of it / Some of it / No / I didn't suggest anything this time |
| 4 | Did anything get in your way? (tick any) | I couldn't match my rose to the pictures / A photo was slow or wouldn't upload / I didn't understand a word or a question / The app stopped or behaved oddly / It took too long / Nothing got in my way |
| 5 | How do you feel about looking after this rose now? | More confident / About the same / Less confident |
| 6 | What worked, and what didn't? (optional) | A text box, up to 1,000 characters |
| 7 | May the Founders email you about your feedback? | Yes / No |

- **Under question 6:** The Founders read this. I don't, so please don't ask me a gardening question here.
- **Small print above the button:** Your answers go to the Founders with your email address, your rose's type and the kind of session. No photos are sent.
- **Button:** Send feedback
- **After sending:** Thank you. That's gone to the Founders.
- **If it fails:** That didn't send. Please check your connection and try again.

Only question 1 is needed to send. The rest can be skipped.

## 3. The form in the menu

The menu item is **Give feedback**. It opens a shorter form, because there is no session to ask about.

| # | Question | Answers |
|---|---|---|
| 1 | What would you like to tell the Founders? | Something went wrong / An idea / Something I liked |
| 2 | Tell us more | A text box, up to 1,000 characters |
| 3 | May the Founders email you about this? | Yes / No |

Questions 1 and 2 are needed to send.

## 4. How it works

- **When it is offered:** after each finished pruning session and each growing-season check. "Not now" closes it. It is never asked twice for the same session.
- **Where answers go:** the Garden Shed's Toolbox, in the "Beta Feedback" tool, with a count of unopened feedback on it, as for Beta Requests. No email is sent to the Founders.
- **The website:** its "Send feedback" button stays as an email to founders@askpip.garden.
- **Free text:** the text box goes only to the Founders. Pip never reads or answers it, so the Founders' decision of 23 September 2026 (no free-text questions to Pip) still holds.

## 5. Small additions made while building, for a Founder to confirm

These were needed to build the form and are not in the approved draft above.

| Where | Words | Why |
|---|---|---|
| Menu form, small print | Your answers go to the Founders with your email address. No photos are sent. | The approved small print, without the rose's type and the kind of session, which the menu form does not send. |
| Menu form, under the text box | The Founders read this. I don't, so please don't ask me a gardening question here. | The approved line from question 6, reused. |
| Growing-season check, last screen | That's the blind-shoot check done, and what you decided is saved in the journal. Would you tell the Founders how it went? It takes about a minute, and it helps them make me better. | That screen already had its own closing sentence, so it takes the place of "That's our session done." |
| Both forms, if one account sends more than 20 in a day | That's a lot of feedback for one day. Please try again tomorrow, or email founders@askpip.garden. | A guard against a stuck button or a script. A gardener is very unlikely to see it. |
| Session page heading | Feedback | A label. |
| Text box, when 100 characters or fewer remain | (number) characters left | A label. |
| After sending, the button | Back to (the rose's name), or Done from the menu | Labels. |

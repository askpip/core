/*
 * The words of the feedback form. Approved by a Founder in chat, 3 October 2026
 * (Working/AI Outputs/Ask_Pip_Feedback_Form_Wording.md). Pip speaks in the first person.
 *
 * Each answer has a short key, which is what the database keeps
 * (public.beta_feedback, App/supabase/schema.sql, "Beta feedback"). Change a key only
 * together with the database's checks and the Garden Shed's "Beta feedback" tool.
 */

/** Which kind of session the feedback is about, or 'general' for the menu's form. */
export type FeedbackKind = 'pruning' | 'growing-season' | 'general'

export interface FeedbackOption<K extends string = string> {
  key: K
  label: string
}

/** Pip's offer at the end of a session. */
export const FEEDBACK_OFFER = {
  opening: "That's our session done.",
  ask: 'Would you tell the Founders how it went? It takes about a minute, and it helps them make me better.',
  yes: 'Give feedback',
  no: 'Not now',
} as const

export type Went = 'well' | 'mixed' | 'badly'
export type Clear = 'clear' | 'partly' | 'unsure'
export type Followed = 'most' | 'some' | 'no' | 'nothing-suggested'
export type Obstacle = 'match' | 'photo' | 'wording' | 'app' | 'too-long' | 'none'
export type Confidence = 'more' | 'same' | 'less'
export type Topic = 'wrong' | 'idea' | 'liked'

/** The form offered after a session. Only the first question is needed to send. */
export const SESSION_FORM = {
  /** The page's heading. A label, not part of the approved questions. */
  title: 'Feedback',
  went: {
    question: 'How did that session go?',
    options: [
      { key: 'well', label: 'It went well' },
      { key: 'mixed', label: 'It was mixed' },
      { key: 'badly', label: "It didn't go well" },
    ] satisfies FeedbackOption<Went>[],
  },
  clear: {
    question: 'Was I clear about what to do?',
    options: [
      { key: 'clear', label: 'Yes, clear' },
      { key: 'partly', label: 'Some of it was confusing' },
      { key: 'unsure', label: 'No, I was often unsure' },
    ] satisfies FeedbackOption<Clear>[],
  },
  followed: {
    question: 'Did you do what I suggested?',
    options: [
      { key: 'most', label: 'Yes, all or most of it' },
      { key: 'some', label: 'Some of it' },
      { key: 'no', label: 'No' },
      { key: 'nothing-suggested', label: "I didn't suggest anything this time" },
    ] satisfies FeedbackOption<Followed>[],
  },
  obstacles: {
    question: 'Did anything get in your way?',
    hint: 'tick any',
    options: [
      { key: 'match', label: "I couldn't match my rose to the pictures" },
      { key: 'photo', label: "A photo was slow or wouldn't upload" },
      { key: 'wording', label: "I didn't understand a word or a question" },
      { key: 'app', label: 'The app stopped or behaved oddly' },
      { key: 'too-long', label: 'It took too long' },
      { key: 'none', label: 'Nothing got in my way' },
    ] satisfies FeedbackOption<Obstacle>[],
  },
  confidence: {
    question: 'How do you feel about looking after this rose now?',
    options: [
      { key: 'more', label: 'More confident' },
      { key: 'same', label: 'About the same' },
      { key: 'less', label: 'Less confident' },
    ] satisfies FeedbackOption<Confidence>[],
  },
  comment: { question: "What worked, and what didn't?" },
  mayContact: { question: 'May the Founders email you about your feedback?' },
  smallPrint:
    "Your answers go to the Founders with your email address, your rose's type and the kind of session. No photos are sent.",
} as const

/** The shorter form opened from the menu, when there is no session to ask about. */
export const GENERAL_FORM = {
  title: 'Give feedback',
  topic: {
    question: 'What would you like to tell the Founders?',
    options: [
      { key: 'wrong', label: 'Something went wrong' },
      { key: 'idea', label: 'An idea' },
      { key: 'liked', label: 'Something I liked' },
    ] satisfies FeedbackOption<Topic>[],
  },
  comment: { question: 'Tell us more' },
  mayContact: { question: 'May the Founders email you about this?' },
  // The session form's small print, without the two things this form does not send.
  smallPrint: 'Your answers go to the Founders with your email address. No photos are sent.',
} as const

/** Words both forms share. */
export const FEEDBACK_COMMON = {
  optional: 'optional',
  /** Under the text box. The box goes to the Founders only: Pip never answers free text. */
  commentHelp: "The Founders read this. I don't, so please don't ask me a gardening question here.",
  commentLimit: 1000,
  yes: 'Yes',
  no: 'No',
  send: 'Send feedback',
  sending: 'Sending…',
  thanks: "Thank you. That's gone to the Founders.",
  failed: "That didn't send. Please check your connection and try again.",
  // Not part of the approved wording: shown only if one account sends more than 20 in a day.
  tooMany: "That's a lot of feedback for one day. Please try again tomorrow, or email founders@askpip.garden.",
} as const

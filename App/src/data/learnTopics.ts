// DRAFT CONCEPT COPY — not Founder-approved phrasing, and deliberately none
// of it is a horticultural claim. See the flow proposal, section 9
// ("Learn: A Knowledge Base for Any Time") and section 9.2's "About Ask
// Pip" shelf, which this file builds out: pages about Ask Pip itself — how
// the journey works, what the four choices mean, how Pip uses photographs,
// why Pip sometimes says it isn't sure — never about rose care. That
// content is gated behind Founder-reviewed research (see the flow
// proposal's Decision 5 and section 11); putting it here would be exactly
// the placeholder-script problem the proposal itself warns against.
//
// One topic, one entry, shown wherever it's needed (design principle 9.4:
// "One Source for Each Idea") — right now that's just the Learn hub
// (Learn.tsx) and each topic's own page (LearnTopic.tsx), reached from the
// header's ⋯ menu.

export interface TopicStep {
  heading: string
  body: string
}

export interface StepsTopic {
  id: string
  kind: 'steps'
  menuLabel: string
  steps: TopicStep[]
}

export interface GlossaryTerm {
  term: string
  meaning: string
}

export interface ListTopic {
  id: string
  kind: 'list'
  menuLabel: string
  intro: string
  items: GlossaryTerm[]
}

export type LearnTopic = StepsTopic | ListTopic

export const LEARN_TOPICS: LearnTopic[] = [
  {
    id: 'journey-overview',
    kind: 'steps',
    menuLabel: "What we'll do together",
    steps: [
      {
        heading: 'Getting to know your rose',
        body: "We start the same way every time: I ask to see your rose and hear a little about it — its name, roughly where it lives, why it matters to you if you'd like to say. That's the first page of its own journal, and it's the only part that takes more than a minute or two.",
      },
      {
        heading: 'Checking it’s a good day',
        body: "Before anything else, I check a few things with you — has the rose settled in long enough, is it dormant, are your tools clean and sharp. If today isn't the day, that's a real answer too. I'll help you plan for when it will be, not push you through it anyway.",
      },
      {
        heading: 'Looking, together',
        body: "I'll ask for some photographs and point out what I notice. Then it's your turn: you go and check the real rose, because I can be wrong about a photo and you never will be about what's actually in front of you.",
      },
      {
        heading: 'Deciding what happens',
        body: "For everything I've pointed out, you choose: cut it, leave it, think about it later, or bring in someone experienced. Before any cut, I'll ask you to trace the actual stem with your own hand — nothing happens until you've done that.",
      },
      {
        heading: 'Keeping the story',
        body: "At the end, I bring together what we did — what you confirmed, what you cut, what you're watching — and ask when to check back in. Next time, I'll remember.",
      },
    ],
  },
  {
    id: 'four-choices',
    kind: 'steps',
    menuLabel: 'The four choices, explained',
    steps: [
      {
        heading: 'Cut',
        body: "This means exactly what it sounds like: you've decided, you can see it clearly, and you're ready to make the cut. I'll suggest — I'll never make it for you.",
      },
      {
        heading: 'Leave',
        body: 'Sometimes the right answer is to do nothing. Leaving a stem is a real decision, not a skipped one, and it gets kept in the journal the same as a cut would.',
      },
      {
        heading: 'Decide later',
        body: "Not sure yet? That's completely fine. I'll note it, and you can come back to it — today, another day, whenever you're ready. It won't be forgotten.",
      },
      {
        heading: 'Get experienced local help',
        body: "If something looks like it's beyond what the two of us should handle alone, this is always on the table. Asking for help is a good outcome, not a failure, and I'll never make you feel otherwise.",
      },
    ],
  },
  {
    id: 'how-pip-sees',
    kind: 'steps',
    menuLabel: 'How I look at a photo',
    steps: [
      {
        heading: "I notice, I don't decide",
        body: "When you send me a photo, I'll point out what I think I see — maybe a stem that looks like it's crossing another. That's a proposal, never a verdict.",
      },
      {
        heading: 'You check the real thing',
        body: "A photo flattens everything — light, angle and shadow can all fool it. So I always ask you to go and look at the actual rose before anything is decided. Your eyes on the real plant beat my eyes on a photo, every time.",
      },
      {
        heading: "When I can't tell",
        body: "Sometimes a photo just doesn't show enough, and I'll say so plainly rather than guess. \"I can't tell from here\" is a normal, honest answer — try another angle, or leave it for now.",
      },
    ],
  },
  {
    id: 'honesty',
    kind: 'steps',
    menuLabel: 'Why I sometimes say I’m not sure',
    steps: [
      {
        heading: "Certainty I don't have isn't worth pretending to",
        body: "I only ever tell you things that come from real, checked horticultural sources. If the evidence is thin, or sources disagree, I'd rather tell you that than sound more confident than I actually am.",
      },
      {
        heading: '"Not sure" is a good answer',
        body: "From me or from you. It's not a failure — it's just where we are today, and there's always a next step from there, even if that step is just waiting.",
      },
      {
        heading: 'Ask me why, any time',
        body: "If I ever say something and you want to know where it came from, just ask — I'm always glad to show you the source behind it.",
      },
    ],
  },
  {
    id: 'glossary',
    kind: 'list',
    menuLabel: 'A few words I use',
    intro: "A handful of words I use a lot, in case any of them ever land oddly.",
    items: [
      {
        term: 'Journal',
        meaning:
          "Your rose's own running record — every photo, note and decision, kept together so its story builds over time.",
      },
      {
        term: 'Photo spot',
        meaning:
          'The place you choose to stand each time you photograph a rose, so photos taken months apart can be compared like for like.',
      },
      {
        term: 'Observation',
        meaning:
          "Something I've noticed and you've checked on the real plant — confirmed, corrected, or left unresolved.",
      },
      {
        term: 'Confidence rating',
        meaning:
          "How well-supported something I tell you is, based on how many reputable sources agree. I'll always say when it's low.",
      },
      {
        term: 'The four choices',
        meaning: 'Cut, Leave, Decide later, Get experienced local help — see that topic for more on each.',
      },
    ],
  },
]

export function findTopic(id: string | undefined): LearnTopic | undefined {
  return LEARN_TOPICS.find((t) => t.id === id)
}

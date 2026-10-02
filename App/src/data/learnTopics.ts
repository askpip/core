// "How Pip works": pages about Ask Pip itself (how the pruning session
// works, what the four choices mean, how Pip uses photographs, what else Pip
// offers, what the journal is for, why Pip sometimes says it isn't sure).
// Wording approved "for now" by a Founder in chat, 2 October 2026, and open
// to revision as the app grows.
//
// None of it is a horticultural claim. Rose care content comes only from
// Published records in the Live Intelligence Library; the confidence-level
// explanations shown with the word list are read from PKR-DEF-000001 to
// 000005, not written here.
//
// One topic, one entry, shown on the hub (Learn.tsx) and on each topic's own
// page (LearnTopic.tsx). The file and route names still say "learn"; only
// the name gardeners see changed.

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
  /** Show the five confidence levels, with their Published explanations, under the list. */
  showConfidenceLevels?: boolean
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
        body: "Before anything else, I check a few things with you — has the rose settled in long enough, is it dormant, are your tools clean and sharp. If today isn't the day, that's a real answer too. I'll show you how to look after your rose in the meantime, not push you through it anyway.",
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
        body: "At the end, I bring together what we looked at and what you decided, and you save it to your rose's journal. From then on it's part of your rose's history.",
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
    id: 'more-than-pruning',
    kind: 'steps',
    menuLabel: 'More than pruning',
    steps: [
      {
        heading: 'This season',
        body: "On your rose's page you'll find a card called \"This season\". It picks out the care advice that fits the time of year where your rose is growing.",
      },
      {
        heading: 'Caring for your rose',
        body: "Below that is everyday care: watering, mulch, feeding, deadheading and getting ready for winter. It's there for Hybrid Tea, Floribunda and Grandiflora roses, and I tell you where the advice comes from. If today isn't a day for pruning, I'll show you this care instead.",
      },
      {
        heading: 'Questions gardeners ask',
        body: "Tap a question to see what I can say about it. Every answer is made only from advice the Ask Pip team has already researched and approved, and it comes with its sources. If I don't have an answer yet, I'll say so, and I note that you asked.",
      },
      {
        heading: 'Checks in the growing season',
        body: "Some things can only be seen while a rose is growing, so they have their own short check outside the pruning session. The first is a check for blind shoots. You'll find it on your rose's page.",
      },
    ],
  },
  {
    id: 'journal',
    kind: 'steps',
    menuLabel: "Your rose's journal",
    steps: [
      {
        heading: 'What goes in it',
        body: "Every rose you add has its own journal. It keeps your photos, your notes, and what we looked at and what you decided each time.",
      },
      {
        heading: 'Add to it any time',
        body: "You don't have to be pruning. Add a photo or jot down a note on your rose's page whenever something catches your eye.",
      },
      {
        heading: "What it's for",
        body: "The journal holds your rose's history. Today it keeps that history safe and shows it back to you. In future I'll draw on it, so the care advice I give fits your rose and what has happened to it.",
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
        heading: 'See where it comes from',
        body: "Wherever I share care advice, you'll find a link called \"Where this comes from\". Tap it to see the sources behind what I've said, with links so you can read them yourself.",
      },
    ],
  },
  {
    id: 'glossary',
    kind: 'list',
    menuLabel: 'A few words I use',
    intro: "A handful of words I use a lot, in case any of them ever land oddly.",
    showConfidenceLevels: true,
    items: [
      {
        term: 'Journal',
        meaning:
          "Your rose's own running record — every photo, note and decision, kept together so its story builds over time.",
      },
      {
        term: 'Observation',
        meaning:
          "Something I've noticed and you've checked on the real plant — confirmed, corrected, or left unresolved.",
      },
      {
        term: 'Confidence rating',
        meaning:
          "How strongly the evidence supports a piece of advice. It reflects how reliable the sources are, how well they agree with each other, and what is still uncertain. I show it beside the advice it belongs to.",
      },
      {
        term: 'Approved default',
        meaning: 'A sensible choice the Founders approved where the sources are silent.',
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

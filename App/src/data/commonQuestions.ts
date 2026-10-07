/**
 * "Questions gardeners ask" — the most common beginner rose questions
 * (ranked in the 1 October 2026 app review from 11 rose-society, nursery and
 * extension FAQ sources), each answered ONLY with statements already
 * Published in the Live Intelligence Library, quoted verbatim with their own
 * confidence and sources. The question wording is product copy, approved
 * "for now" by Shaphan in chat, 2 October 2026; the answers are not new content.
 *
 * Questions Pip can't answer yet carry `pending`: the app says so honestly and
 * records the tap (public.question_interest), so gardeners' own interest shows
 * which research to approve next.
 *
 * Topics (from 5 October 2026). A subject with a lot of approved knowledge is
 * published as several short question answers under one topic (PKR Standard
 * §5.7, "Topic and order"). The first is the lead question, which sits in the
 * list here; the others open from its answer as "More about …". They are read
 * from the Published records themselves, so a new topic's follow-up answers
 * reach gardeners without an app release. This is how every finding Pip may
 * use gets a place, without one long answer.
 */
import { publishedQuestionAnswers, publishedRecord, type QuestionAnswer, type Statement } from './pkr'

/** A follow-up answer inside a topic, keyed by its record. */
export type TopicKey = `pkr:${string}`

export type BuiltInKey =
  | 'when-to-prune'
  | 'months'
  | 'too-late'
  | 'how-much'
  | 'how-to-cut'
  | 'overgrown'
  | 'sucker'
  | 'dieback'
  | 'watering'
  | 'feeding'
  | 'deadheading'
  | 'black-spot'
  | 'yellow-leaves'
  | 'winter'
  | 'no-flowers'
  | 'spraying'
  | 'prune-too-hard'
  | 'plant-move'

export type QuestionKey = BuiltInKey | TopicKey

/** Which topic's lead question a built-in question becomes once that topic is Published. */
const TOPIC_FOR: Partial<Record<BuiltInKey, string>> = {
  months: 'timing',
  spraying: 'spraying',
  'plant-move': 'planting',
}

export interface CommonQuestion {
  key: QuestionKey
  question: string
  /** A short line of app copy before the quoted statements (no horticultural claim). */
  lead?: string
  statements: Statement[]
  /** PKRs whose sources back the statements, for "Where this comes from". */
  pkrIds: string[]
  /** Set when Pip has no approved answer yet. */
  pending?: string
  /** A growing-season check this answer can open for a specific plant. */
  check?: { label: string; path: 'blind-shoots' }
  /** Other answers in the same topic, offered under this one. */
  more?: { title: string; items: { key: QuestionKey; question: string }[] }
}

const PENDING =
  "I'm still learning about this one. The research has been gathered and is waiting for the Founders' review, so I can't answer it yet. I've noted that you asked."

/** Statements from a record's content array, picked by how each one starts. */
function pick(pkrId: string, field: string, starts: string[]): Statement[] {
  const items: Statement[] = publishedRecord(pkrId)?.content?.[field] ?? []
  return starts
    .map((s) => items.find((i) => i.text.startsWith(s)))
    .filter((i): i is Statement => Boolean(i))
}

function all(pkrId: string, field: string): Statement[] {
  return publishedRecord(pkrId)?.content?.[field] ?? []
}

const topicKey = (a: QuestionAnswer): TopicKey => `pkr:${a.pkrId}`

/** The other answers in a topic, as "More about …" links. */
function moreIn(answers: QuestionAnswer[], except?: string): CommonQuestion['more'] {
  const items = answers.filter((a) => a.pkrId !== except).map((a) => ({ key: topicKey(a), question: a.question }))
  return items.length > 0 ? { title: `More about ${answers[0].topicTitle.toLowerCase()}`, items } : undefined
}

/** A built-in question answered by its topic's lead record, if that topic is Published. */
function fromTopic(key: BuiltInKey, question: string, topics: Map<string, QuestionAnswer[]>): CommonQuestion | undefined {
  const answers = topics.get(TOPIC_FOR[key] ?? '')
  const lead = answers?.[0]
  if (!answers || !lead) return undefined
  return { key, question, statements: lead.statements, pkrIds: [lead.pkrId], more: moreIn(answers, lead.pkrId) }
}

/** Built on demand so it always reflects the live LIL. Questions whose statements can't be found are left out. */
export function commonQuestions(): CommonQuestion[] {
  const sgt1 = publishedRecord('PKR-SGT-000001')?.content
  const cgd2 = publishedRecord('PKR-CGD-000002')?.content

  const topics = new Map<string, QuestionAnswer[]>()
  for (const a of publishedQuestionAnswers()) topics.set(a.topic, [...(topics.get(a.topic) ?? []), a])
  const spraying = topics.get('spraying')
  // Month-level timing, by place. Not in the list until its first records are Published.
  const months = fromTopic('months', 'Which months do I prune my rose?', topics)

  const list: CommonQuestion[] = [
    {
      key: 'when-to-prune',
      question: 'When should I prune my rose?',
      lead: 'I check this with you at the start of every pruning session. Full pruning is for a rose that is:',
      statements: sgt1
        ? [{ text: sgt1.answers.dormant }, { text: sgt1.caveat }]
        : [],
      pkrIds: ['PKR-SGT-000001'],
    },
    ...(months ? [months] : []),
    {
      key: 'too-late',
      question: 'Is it too late to prune?',
      statements: sgt1 ? [sgt1.removalOnly.intro, ...sgt1.removalOnly.conditions, sgt1.removalOnly.lateSeason] : [],
      pkrIds: ['PKR-SGT-000001'],
    },
    {
      key: 'how-much',
      question: 'How much should I cut off?',
      statements: all('PKR-CGD-000003', 'items'),
      pkrIds: ['PKR-CGD-000003'],
    },
    {
      key: 'how-to-cut',
      question: 'How do I make a cut?',
      statements: cgd2 ? [...cgd2.shorten, ...cgd2.removeStem, cgd2.seal] : [],
      pkrIds: ['PKR-CGD-000002'],
    },
    {
      key: 'overgrown',
      question: 'How do I prune an overgrown rose?',
      statements: pick('PKR-CGD-000003', 'items', ['If an overgrown bush', 'This rule hasn']),
      pkrIds: ['PKR-CGD-000003'],
    },
    {
      key: 'sucker',
      question: 'Is this a sucker?',
      statements: all('PKR-OBS-000007', 'criteria'),
      pkrIds: ['PKR-OBS-000007'],
    },
    {
      key: 'dieback',
      question: 'Why are some canes brown or dying?',
      lead: 'Here is how to tell dead wood from living wood:',
      statements: all('PKR-OBS-000001', 'criteria'),
      pkrIds: ['PKR-OBS-000001'],
    },
    {
      key: 'watering',
      question: 'How often should I water?',
      statements: [
        ...pick('PKR-CGD-000004', 'items', ['Water deeply']),
        ...pick('PKR-CGD-000005', 'items', ['Pay closer attention to watering']),
      ],
      pkrIds: ['PKR-CGD-000004', 'PKR-CGD-000005'],
    },
    {
      key: 'feeding',
      question: 'When should I feed my rose?',
      statements: pick('PKR-CGD-000004', 'items', ['Start feeding']),
      pkrIds: ['PKR-CGD-000004'],
    },
    {
      key: 'deadheading',
      question: 'What is deadheading?',
      statements: pick('PKR-CGD-000004', 'items', ['Remove faded flowers']),
      pkrIds: ['PKR-CGD-000004'],
    },
    {
      key: 'black-spot',
      question: 'Black spots on the leaves?',
      // Until the spraying research is Published, this is all Pip can say. Once it is, the
      // answers on leaf disease and sprays open from here.
      lead: spraying ? 'Here is what to watch for:' : "I can't tell you how to treat it yet. Here is what I can say:",
      statements: pick('PKR-CGD-000004', 'items', ['Watch for blackspot', 'Look over the leaves']),
      pkrIds: ['PKR-CGD-000004'],
      more: spraying ? moreIn(spraying) : undefined,
    },
    {
      key: 'yellow-leaves',
      question: 'Why are the leaves going yellow?',
      statements: pick('PKR-CGD-000004', 'items', ['Look over the leaves', 'If your rose looks unwell']),
      pkrIds: ['PKR-CGD-000004'],
    },
    {
      key: 'winter',
      question: 'How do I get my rose ready for winter?',
      statements: all('PKR-CGD-000006', 'items'),
      pkrIds: ['PKR-CGD-000006'],
    },
    {
      key: 'no-flowers',
      question: "Why isn't my rose flowering?",
      statements: all('PKR-CGD-000008', 'items'),
      pkrIds: ['PKR-CGD-000008'],
      check: { label: 'Check for blind shoots with Pip', path: 'blind-shoots' },
    },
    fromTopic('spraying', 'Should I spray my roses?', topics) ?? {
      key: 'spraying',
      question: 'Should I spray my roses?',
      statements: [],
      pkrIds: [],
      pending: PENDING,
    },
    {
      key: 'prune-too-hard',
      question: 'Can I kill my rose by pruning too hard?',
      statements: all('PKR-CGD-000007', 'items'),
      pkrIds: ['PKR-CGD-000007'],
    },
    fromTopic('plant-move', 'When can I plant or move a rose?', topics) ?? {
      key: 'plant-move',
      question: 'When can I plant or move a rose?',
      statements: [],
      pkrIds: [],
      pending: PENDING,
    },
  ]

  // The follow-up answers of every Published topic. They aren't in the home list; they open from a lead answer.
  for (const answers of topics.values()) {
    for (const a of answers) {
      list.push({ key: topicKey(a), question: a.question, statements: a.statements, pkrIds: [a.pkrId], more: moreIn(answers, a.pkrId) })
    }
  }

  return list.filter((q) => q.pending || q.statements.length > 0)
}

export function questionsFor(keys: QuestionKey[]): CommonQuestion[] {
  const byKey = new Map(commonQuestions().map((q) => [q.key, q]))
  return keys.map((k) => byKey.get(k)).filter((q): q is CommonQuestion => Boolean(q))
}

/** Any one question by key, including a topic's follow-up answers. */
export function questionByKey(key: QuestionKey): CommonQuestion | undefined {
  return commonQuestions().find((q) => q.key === key)
}

/** The ones shown on the home and plant pages, most-asked first. */
export const HOME_QUESTIONS: BuiltInKey[] = [
  'when-to-prune',
  'months',
  'how-much',
  'too-late',
  'no-flowers',
  'black-spot',
  'sucker',
  'watering',
  'feeding',
  'yellow-leaves',
  'spraying',
  'prune-too-hard',
  'plant-move',
  'deadheading',
  'winter',
  'how-to-cut',
  'overgrown',
  'dieback',
]

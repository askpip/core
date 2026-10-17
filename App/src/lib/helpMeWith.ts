/**
 * "Help me with [rose name]": what Pip offers for a rose right now.
 *
 * Built to the APP-HELP-ME-WITH-ROSE proposal (approved by a Founder in chat,
 * 18 October 2026). This module only chooses; it says nothing horticultural itself.
 * Every gardener-facing claim the panel shows is a Published statement, word for
 * word. The panel's own lines are the app wording listed in the proposal's section 5.
 *
 * The rules (proposal section 3):
 *   A. Rose type doesn't pass, or isn't set: no pruning or care choices.
 *   B. No known season (no hemisphere): only choices that don't depend on the season.
 *   C. Otherwise the first three that apply, in a fixed order; the rest go under "More".
 */
import { PRUNING_MONTHS, PRUNING_MONTHS_PKR } from '@/data/pruningMonths'
import { growingSeasonObservation, publishedRecord, type Statement } from '@/data/pkr'
import { questionsFor, type BuiltInKey } from '@/data/commonQuestions'
import { seasonForHemisphere, type Season } from './location'
import { shownIn } from './place'
import type { CareKind, CareLogEntry, Hemisphere, RecentlyPlantedAnswer } from './types'

export type HelpChoice =
  | { kind: 'journey' }
  | { kind: 'care'; pkrId: 'PKR-CGD-000004' | 'PKR-CGD-000005' | 'PKR-CGD-000006' }
  | { kind: 'blind-shoots' }
  | { kind: 'question'; key: BuiltInKey }
  | { kind: 'set-rose-type' }
  | { kind: 'all-questions' }
  | { kind: 'note' }

export type HelpRule = 'journal-only' | 'no-season' | 'seasonal'

export interface HelpPlan {
  rule: HelpRule
  season?: Season
  /** Up to three, shown first. */
  first: HelpChoice[]
  /** The rest, under "More". */
  more: HelpChoice[]
  /** Set under rule C when the recently-planted answer hasn't been given yet: ask it first. */
  askRecentlyPlanted: boolean
}

/** Calendar months (1 = January) named for the main pruning in the statements shown for this place. */
export function pruningMonths(codes: string[]): Set<number> {
  const items: Statement[] = publishedRecord(PRUNING_MONTHS_PKR)?.content?.items ?? []
  const months = new Set<number>()
  // Only statements marked for a place count: an unmarked one names no place's months.
  if (codes.length === 0) return months
  for (const entry of PRUNING_MONTHS) {
    const s = items.find((i) => i.text.startsWith(entry.starts))
    if (s && s.place && s.place.length > 0 && shownIn(s.place, codes)) entry.months.forEach((m) => months.add(m))
  }
  return months
}

/** The last month of autumn, where PKR-CGD-000006 (getting ready for winter) is offered instead of growing-season care. */
function lateAutumn(hemisphere: Hemisphere, date: Date): boolean {
  return date.getMonth() === (hemisphere === 'northern' ? 10 : 4)
}

const SEASON_QUESTIONS: { key: BuiltInKey; seasons: Season[] }[] = [
  { key: 'black-spot', seasons: ['spring', 'summer', 'autumn'] },
  { key: 'no-flowers', seasons: ['summer'] },
  { key: 'dieback', seasons: ['winter', 'spring'] },
]

/** A common question is offered only if it has a Published answer. */
function answered(key: BuiltInKey): boolean {
  return questionsFor([key]).some((q) => !q.pending && q.statements.length > 0)
}

export function helpPlan({
  roseTypePasses,
  roseTypeSet,
  hemisphere,
  codes,
  recentlyPlanted,
  date,
}: {
  roseTypePasses: boolean
  roseTypeSet: boolean
  hemisphere?: Hemisphere
  codes: string[]
  recentlyPlanted?: RecentlyPlantedAnswer
  date: Date
}): HelpPlan {
  if (!roseTypePasses) {
    const first: HelpChoice[] = roseTypeSet ? [{ kind: 'note' }] : [{ kind: 'set-rose-type' }, { kind: 'note' }]
    return { rule: 'journal-only', first, more: [], askRecentlyPlanted: false }
  }

  if (!hemisphere) {
    const first: HelpChoice[] = [
      ...(answered('sucker') ? [{ kind: 'question', key: 'sucker' } as const] : []),
      { kind: 'all-questions' },
      { kind: 'note' },
    ]
    return { rule: 'no-season', first, more: [], askRecentlyPlanted: false }
  }

  const season = seasonForHemisphere(hemisphere, date)
  const recent = recentlyPlanted === 'recent'
  const ordered: HelpChoice[] = []

  // 1. The pruning journey, only in the pruning months for the place, and not for a recently planted rose.
  if (!recent && pruningMonths(codes).has(date.getMonth() + 1)) ordered.push({ kind: 'journey' })
  // 2. Care tips for the season.
  const winterCare = season === 'winter' || (season === 'autumn' && lateAutumn(hemisphere, date))
  const carePkr = winterCare ? 'PKR-CGD-000006' : recent ? 'PKR-CGD-000005' : 'PKR-CGD-000004'
  if (publishedRecord(carePkr)) ordered.push({ kind: 'care', pkrId: carePkr })
  // 3. The blind-shoot check, in spring and summer.
  if ((season === 'spring' || season === 'summer') && growingSeasonObservation('blind-shoot')) ordered.push({ kind: 'blind-shoots' })
  // 4. The sucker check, any season.
  if (answered('sucker')) ordered.push({ kind: 'question', key: 'sucker' })
  // 5. Common questions, by season.
  for (const q of SEASON_QUESTIONS) if (q.seasons.includes(season) && answered(q.key)) ordered.push({ kind: 'question', key: q.key })

  return {
    rule: 'seasonal',
    season,
    first: ordered.slice(0, 3),
    more: ordered.slice(3),
    askRecentlyPlanted: recentlyPlanted === undefined,
  }
}

// ---------------------------------------------------------------------------
// Care log
// ---------------------------------------------------------------------------

export const CARE_KINDS: CareKind[] = ['fed', 'watered', 'deadheaded', 'mulched']

/** The most recent entry of each kind. */
export function lastDone(entries: CareLogEntry[], kind: CareKind): CareLogEntry | undefined {
  return entries
    .filter((e) => e.kind === kind)
    .reduce<CareLogEntry | undefined>((a, e) => (!a || e.doneOn > a.doneOn || (e.doneOn === a.doneOn && e.createdAt > a.createdAt) ? e : a), undefined)
}

/** Today's date where the gardener is, as YYYY-MM-DD. */
export function localDate(date: Date): string {
  const p = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}`
}

/** Whole days from one YYYY-MM-DD date to another. */
export function daysBetween(from: string, to: string): number {
  const [a, b] = [from, to].map((d) => {
    const [y, m, day] = d.split('-').map(Number)
    return Date.UTC(y, m - 1, day)
  })
  return Math.round((b - a) / 86_400_000)
}

/** "6 weeks ago", for app line 6. */
export function agoText(days: number): string {
  if (days <= 0) return 'today'
  if (days < 14) return `${days} ${days === 1 ? 'day' : 'days'} ago`
  if (days < 61) return `${Math.round(days / 7)} weeks ago`
  const months = Math.round(days / 30.4)
  return `${months} ${months === 1 ? 'month' : 'months'} ago`
}

/**
 * The Published statements shown under a care-log line, word for word: the timing
 * statements for the rose's place (PKR-CGD-000023 feeding, -000024 deadheading), or
 * the general growing-season care statement (PKR-CGD-000004) where none is shown
 * there; watering and mulch from PKR-CGD-000004.
 */
export function careTiming(kind: CareKind, codes: string[]): { statements: Statement[]; pkrIds: string[] } {
  const items = (id: string): Statement[] => publishedRecord(id)?.content?.items ?? []
  const starting = (id: string, start: string) => items(id).filter((s) => s.text.startsWith(start))
  const local = (id: string) => items(id).filter((s) => s.place && s.place.length > 0 && shownIn(s.place, codes))
  const timed = (id: string, fallback: string) => {
    const here = codes.length > 0 ? local(id) : []
    return here.length > 0 ? { statements: here, pkrIds: [id] } : { statements: starting('PKR-CGD-000004', fallback), pkrIds: ['PKR-CGD-000004'] }
  }
  switch (kind) {
    case 'fed':
      return timed('PKR-CGD-000023', 'Start feeding')
    case 'deadheaded':
      return timed('PKR-CGD-000024', 'Remove faded flowers')
    case 'watered':
      return { statements: starting('PKR-CGD-000004', 'Water deeply'), pkrIds: ['PKR-CGD-000004'] }
    case 'mulched':
      return { statements: starting('PKR-CGD-000004', 'Spread organic mulch'), pkrIds: ['PKR-CGD-000004'] }
  }
}

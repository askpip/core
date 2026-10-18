/**
 * Checks "Help me with [rose name]" against the app's snapshot of the Live
 * Intelligence Library (src/data/lil-snapshot.json).
 *
 * Run from App/:
 *   npx vite build --ssr scripts/check_help_me_with.ts --outDir <scratch dir> && node <scratch dir>/check_help_me_with.js
 *
 * It checks that the pruning-month table still matches PKR-CGD-000022, that each
 * season and place gets the choices the approved rules give, and that every
 * statement the panel shows is a Published statement, word for word.
 */
import { PRUNING_MONTHS, PRUNING_MONTHS_PKR } from '@/data/pruningMonths'
import { publishedRecord, type Statement } from '@/data/pkr'
import { agoText, careTiming, daysBetween, helpPlan, pruningMonths, type HelpChoice } from '@/lib/helpMeWith'
import { placeFromText } from '@/lib/place'
import { comingUp } from '@/lib/comingUp'
import type { Hemisphere, PlantProject, RecentlyPlantedAnswer } from '@/lib/types'

let failures = 0
function check(ok: boolean, what: string) {
  if (!ok) {
    failures += 1
    console.log(`FAIL  ${what}`)
  }
}

const items = (id: string): Statement[] => publishedRecord(id)?.content?.items ?? []

// 1. The month table matches the Published pruning statements.
const pruning = items(PRUNING_MONTHS_PKR)
for (const e of PRUNING_MONTHS) {
  const found = pruning.filter((s) => s.text.startsWith(e.starts))
  check(found.length === 1, `month table entry matches exactly one statement: "${e.starts}"`)
  check(Boolean(found[0]?.place?.length), `month table entry is for a place: "${e.starts}"`)
}
// Every place statement naming a month or season is in the table, or is one the table leaves out on purpose.
const MONTH_OR_SEASON = /\b(January|February|March|April|May|June|July|August|September|October|November|December|spring|summer|winter)\b/
const LEFT_OUT = [
  'Prune later where it is colder', // names no month
  'Prune in winter, when the rose is dormant', // New Zealand winter: June to August, already counted
  'Two rose growers say a rose can be trimmed in autumn', // autumn trim, not the main pruning
  'In Nashville, one rose society says the old rule', // names no month
  'In South Carolina, one extension service says to cut roses back', // cut-back against wind
  'If your rose has winter protection, take it off first', // names no month
]
for (const s of pruning) {
  if (s.kind === 'gap' || !s.place?.length || !MONTH_OR_SEASON.test(s.text)) continue
  const inTable = PRUNING_MONTHS.some((e) => s.text.startsWith(e.starts))
  const leftOut = LEFT_OUT.some((l) => s.text.startsWith(l))
  check(inTable || leftOut, `pruning statement is in the month table or left out on purpose: "${s.text.slice(0, 70)}…"`)
}

// 2. Choices by place and month.
interface Rose {
  label: string
  hemisphere?: Hemisphere
  city?: string
  region?: string
  country?: string
  roseType?: 'passes' | 'journal' | 'unset'
  recent?: RecentlyPlantedAnswer
}
const ROSES: Rose[] = [
  { label: 'Christchurch', hemisphere: 'southern', city: 'Christchurch', country: 'New Zealand' },
  { label: 'Canterbury (Timaru)', hemisphere: 'southern', city: 'Timaru', region: 'Canterbury', country: 'New Zealand' },
  { label: 'Auckland', hemisphere: 'southern', city: 'Auckland', region: 'Auckland', country: 'New Zealand' },
  { label: 'New Zealand, region unknown', hemisphere: 'southern', country: 'New Zealand' },
  { label: 'Victoria, Australia', hemisphere: 'southern', region: 'Victoria', country: 'Australia' },
  { label: 'United Kingdom', hemisphere: 'northern', country: 'United Kingdom' },
  { label: 'Minnesota', hemisphere: 'northern', region: 'Minnesota', country: 'United States' },
  { label: 'Marin County', hemisphere: 'northern', city: 'Marin County', region: 'California', country: 'United States' },
  { label: 'Toronto', hemisphere: 'northern', city: 'Toronto', region: 'Ontario', country: 'Canada' },
  { label: 'Christchurch, recently planted', hemisphere: 'southern', city: 'Christchurch', country: 'New Zealand', recent: 'recent' },
  { label: 'Hemisphere only (France)', hemisphere: 'northern', country: 'France' },
  { label: 'No place', },
  { label: 'Journal-only rose', hemisphere: 'southern', city: 'Christchurch', country: 'New Zealand', roseType: 'journal' },
  { label: 'Rose type not set', hemisphere: 'southern', city: 'Christchurch', country: 'New Zealand', roseType: 'unset' },
]

const name = (c: HelpChoice) =>
  c.kind === 'care' ? `care:${c.pkrId.slice(-3)}` : c.kind === 'question' ? `q:${c.key}` : c.kind

function planFor(r: Rose, month: number) {
  const codes = placeFromText({ locationCity: r.city, locationRegion: r.region, locationCountry: r.country })?.codes ?? []
  return helpPlan({
    roseTypePasses: (r.roseType ?? 'passes') === 'passes',
    roseTypeSet: (r.roseType ?? 'passes') !== 'unset',
    hemisphere: r.hemisphere,
    codes,
    recentlyPlanted: r.recent ?? 'established',
    date: new Date(2026, month - 1, 15),
  })
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
for (const r of ROSES) {
  const codes = placeFromText({ locationCity: r.city, locationRegion: r.region, locationCountry: r.country })?.codes ?? []
  const pm = [...pruningMonths(codes)].sort((a, b) => a - b).map((m) => MONTHS[m - 1])
  console.log(`\n${r.label}  [${codes.join(' ')}]  pruning months: ${pm.join(' ') || '—'}`)
  for (let m = 1; m <= 12; m++) {
    const p = planFor(r, m)
    console.log(`  ${MONTHS[m - 1]} ${(p.season ?? '-').padEnd(6)} ${p.first.map(name).join(', ')}${p.more.length ? `  | more: ${p.more.map(name).join(', ')}` : ''}`)
  }
}

const first = (label: string, month: number) => planFor(ROSES.find((r) => r.label === label)!, month).first.map(name).join(', ')
const more = (label: string, month: number) => planFor(ROSES.find((r) => r.label === label)!, month).more.map(name).join(', ')
// The proposal's own examples.
check(first('Christchurch', 10) === 'care:004, blind-shoots, q:sucker', 'Christchurch in October: care tips, blind shoots, suckers')
check(more('Christchurch', 10) === 'q:black-spot, q:dieback', 'Christchurch in October: more is black spot, brown canes')
check(first('Christchurch', 7) === 'journey, care:006, q:sucker', 'Christchurch in July: journey, getting ready for winter, suckers')
// Pruning months by place.
check(first('Christchurch', 9).startsWith('journey'), 'Christchurch in September: journey (Canterbury and Christchurch widen to September)')
check(!first('New Zealand, region unknown', 9).includes('journey'), 'New Zealand, region unknown, in September: no journey')
check(first('New Zealand, region unknown', 6).startsWith('journey'), 'New Zealand in June: journey')
check(first('United Kingdom', 1).startsWith('journey') && !first('United Kingdom', 4).includes('journey'), 'UK: January yes, April no')
check(first('Minnesota', 5).startsWith('journey'), 'Minnesota in May: journey (spring)')
check(first('Toronto', 5).startsWith('journey') && !first('Toronto', 6).includes('journey'), 'Toronto: May yes, June no')
check(!first('Hemisphere only (France)', 1).includes('journey'), 'A place with no timing statements: no journey')
// Recently planted.
check(!first('Christchurch, recently planted', 7).includes('journey'), 'Recently planted, July: no journey')
check(first('Christchurch, recently planted', 10).startsWith('care:005'), 'Recently planted, October: recently-planted care tips')
// Late autumn.
check(first('Christchurch', 5).includes('care:006') && first('Christchurch', 4).includes('care:004'), 'Christchurch: getting ready for winter in May, not April')
// Rules A and B.
check(first('Journal-only rose', 10) === 'note', 'Journal-only rose: a note only')
check(first('Rose type not set', 10) === 'set-rose-type, note', 'Rose type not set: set the type, or a note')
check(first('No place', 10) === 'set-place, q:sucker, all-questions, note', 'No season: tell Pip the place, suckers, common questions, a note')
check(planFor({ label: 'x', hemisphere: 'southern', country: 'New Zealand', recent: undefined } as Rose, 10).askRecentlyPlanted === false, 'test roses carry an answer')
check(
  helpPlan({ roseTypePasses: true, roseTypeSet: true, hemisphere: 'southern', codes: ['NZ'], date: new Date(2026, 9, 15) }).askRecentlyPlanted,
  'Recently planted not yet answered: asked first',
)

// 3. Care-log statements are Published statements, word for word, and for the place.
const chch = placeFromText({ locationCity: 'Christchurch', locationCountry: 'New Zealand' })!.codes
for (const kind of ['fed', 'watered', 'deadheaded', 'mulched'] as const) {
  for (const codes of [chch, ['GB'], ['CA', 'CA-ON', 'CA-ON:Toronto'], []]) {
    const t = careTiming(kind, codes)
    check(t.statements.length > 0, `care log ${kind} at [${codes.join(' ')}]: something to show`)
    for (const s of t.statements) {
      const from = t.pkrIds.some((id) => items(id).some((i) => i === s && i.text === s.text))
      check(from, `care log ${kind}: statement is a Published item: "${s.text.slice(0, 60)}…"`)
      check(!s.place || s.place.some((p) => codes.includes(p)), `care log ${kind}: statement is for this place: "${s.text.slice(0, 60)}…"`)
    }
  }
}
const nzFeed = careTiming('fed', chch).statements
check(nzFeed.some((s) => s.kind === 'disagreement' && s.text.startsWith('Sources disagree on when to stop feeding')), 'Christchurch feeding: the disagreement is shown')
check(!nzFeed.some((s) => /late summer/.test(s.text)), 'Christchurch feeding: no "late summer" last-feed claim')
console.log('\nChristchurch, feeding:')
nzFeed.forEach((s) => console.log(`  - ${s.text}${s.kind ? ` [${s.kind}]` : ''}`))

// 4. "Coming up" on the home screen.
const rose = (id: string, city: string | undefined, country: string | undefined, roseType: string) =>
  ({ id, name: id, locationCity: city, locationCountry: country, roseType, careLog: [] }) as unknown as PlantProject
const roses = [
  rose('A', 'Christchurch', 'New Zealand', 'hybrid-tea'),
  rose('B', 'Christchurch', 'New Zealand', 'floribunda'),
  rose('C', 'Christchurch', 'New Zealand', 'excluded'),
  rose('D', undefined, 'France', 'hybrid-tea'),
  rose('E', 'London', 'United Kingdom', 'hybrid-tea'),
]
const placeMap = new Map(roses.map((r) => [r.id, placeFromText(r) ?? { codes: [] }]))
const show = (month: number) =>
  comingUp(roses, placeMap, new Date(2026, month - 1, 15)).map((g) => `${g.kind}:${g.place}${g.month ? `>${g.month}` : ''}=${g.roses.map((r) => r.id).join('+')}`).join(' | ')
console.log('\nComing up:')
for (const m of [5, 6, 9, 10, 1]) console.log(`  ${MONTHS[m - 1]}: ${show(m) || '—'}`)
check(show(5) === 'soon:Christchurch>June=A+B', 'Coming up, May: Christchurch starts in June, A and B together, C (journal-only) and D (no place) left out')
check(show(7).startsWith('now:Christchurch=A+B'), 'Coming up, July: pruning time in Christchurch')
check(show(10) === 'soon:London>November=E', 'Coming up, October: only London, starting in November')
check(show(1) === 'now:London=E', 'Coming up, January: London only')
// A paused journey, and the blind-shoot check in spring and summer (hemisphere set).
const seasonal = [
  { ...rose('F', 'Christchurch', 'New Zealand', 'hybrid-tea'), hemisphere: 'southern', safetyAcknowledgedAt: '2026-07-01', journeyComplete: false },
  { ...rose('G', 'Christchurch', 'New Zealand', 'excluded'), hemisphere: 'southern', safetyAcknowledgedAt: '2026-07-01', journeyComplete: false },
  { ...rose('H', 'London', 'United Kingdom', 'floribunda'), hemisphere: 'northern', safetyAcknowledgedAt: '2026-02-01', journeyComplete: true },
] as unknown as PlantProject[]
const seasonalPlaces = new Map(seasonal.map((r) => [r.id, placeFromText(r) ?? { codes: [] }]))
const show2 = (month: number) =>
  comingUp(seasonal, seasonalPlaces, new Date(2026, month - 1, 15)).map((g) => `${g.kind}:${g.place}${g.month ? `>${g.month}` : ''}=${g.roses.map((r) => r.id).join('+')}`).join(' | ')
for (const m of [1, 4, 7, 10]) console.log(`  ${MONTHS[m - 1]} (paused and growing): ${show2(m) || '—'}`)
check(show2(10) === 'paused:=F | soon:London>November=H | growing:Christchurch=F', 'October: F paused (G journal-only left out; H finished), London starts in November, blind-shoot check in Christchurch spring')
check(show2(7) === 'paused:=F | now:Christchurch=F | growing:London=H', 'July: F paused, pruning time in Christchurch, London summer check for H')
check(show2(4) === 'paused:=F | growing:London=H', 'April: Christchurch autumn has no check; London spring does')

// 5. App line 6.
check(agoText(daysBetween('2026-09-06', '2026-10-18')) === '6 weeks ago', '42 days is "6 weeks ago"')
check(agoText(1) === '1 day ago' && agoText(0) === 'today' && agoText(90) === '3 months ago', 'other ages')

console.log(failures === 0 ? '\nAll checks passed.' : `\n${failures} check(s) failed.`)
if (failures > 0) process.exit(1)

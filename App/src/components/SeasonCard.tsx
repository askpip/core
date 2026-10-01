import { ConfidenceTag, SourcesLink } from '@/components/PkrStatements'
import { publishedRecord, type Statement } from '@/data/pkr'
import { seasonForHemisphere, type Season } from '@/lib/location'
import type { Hemisphere } from '@/lib/types'

/**
 * "This season" — picks the Published care statements (PKR-CGD-000004 and
 * 000006, quoted verbatim) that mention the current season at the rose's own
 * location. Selection only; no new wording. Shown only for roses whose type
 * passed PKR-SGT-000003, like the rest of basic care.
 */
const PICKS: Record<Season, { pkr: string; starts: string[] }[]> = {
  spring: [{ pkr: 'PKR-CGD-000004', starts: ['Start feeding', 'Water deeply'] }],
  summer: [{ pkr: 'PKR-CGD-000004', starts: ['Water deeply', 'Remove faded flowers', 'Start feeding'] }],
  autumn: [{ pkr: 'PKR-CGD-000004', starts: ['Remove faded flowers'] }],
  winter: [{ pkr: 'PKR-CGD-000006', starts: ['Once the rose has had several hard frosts', 'Water thoroughly after the first hard frost'] }],
}

const LABEL: Record<Season, string> = { spring: 'Spring', summer: 'Summer', autumn: 'Autumn', winter: 'Winter' }

function seasonStatements(season: Season): { statements: Statement[]; pkrIds: string[] } {
  const statements: Statement[] = []
  const pkrIds: string[] = []
  for (const { pkr, starts } of PICKS[season]) {
    const items: Statement[] = publishedRecord(pkr)?.content?.items ?? []
    for (const s of starts) {
      const found = items.find((i) => i.text.startsWith(s))
      if (found) statements.push(found)
    }
    pkrIds.push(pkr)
  }
  return { statements, pkrIds }
}

export function SeasonCard({ hemisphere, place }: { hemisphere?: Hemisphere; place?: string }) {
  if (!hemisphere) return null
  const season = seasonForHemisphere(hemisphere, new Date())
  const { statements, pkrIds } = seasonStatements(season)
  if (statements.length === 0) return null
  return (
    <section className="rounded-2xl border border-pip-border border-l-4 border-l-pip-petal bg-pip-card p-4 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wide text-pip-text-soft">
        This season · {LABEL[season]}
        {place ? ` in ${place}` : ''}
      </p>
      {season === 'winter' && publishedRecord('PKR-CGD-000006')?.content?.label && (
        <p className="mt-1 text-sm italic text-pip-text-soft">{publishedRecord('PKR-CGD-000006')!.content.label}</p>
      )}
      <ul className="mt-2 flex flex-col gap-1.5">
        {statements.map((s) => (
          <li key={s.text} className="text-sm leading-relaxed">
            {s.text}
            <ConfidenceTag level={s.confidence} />
          </li>
        ))}
      </ul>
      <SourcesLink pkrIds={pkrIds} />
    </section>
  )
}

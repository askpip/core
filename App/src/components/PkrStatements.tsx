import { useState } from 'react'
import { sourcesFor, type CareGuidance, type Statement } from '@/data/pkr'

/** Per-claim confidence chip (PKR Standard §4.2: confidence stays with each claim). */
export function ConfidenceTag({ level }: { level?: Statement['confidence'] }) {
  if (!level) return null
  return (
    <span className="ml-1.5 whitespace-nowrap rounded-full bg-pip-secondary px-2 py-0.5 text-[10px] font-medium text-pip-text-soft">
      {level === 'Approved default' ? 'Approved default' : `${level} confidence`}
    </span>
  )
}

export function StatementList({ items }: { items: Statement[] }) {
  return (
    <ul className="flex flex-col gap-1.5">
      {items.map((s) => (
        <li key={s.text} className="rounded-xl bg-pip-bg px-3.5 py-2.5 text-xs leading-relaxed">
          {s.text}
          <ConfidenceTag level={s.confidence} />
        </li>
      ))}
    </ul>
  )
}

/** One Care Guidance PKR, rendered as a heading plus its items. */
export function CareBlock({ care }: { care: CareGuidance }) {
  return (
    <div className="mb-3">
      <p className="mb-1 text-sm font-medium">{care.heading}</p>
      {care.label && <p className="mb-1.5 text-xs italic text-pip-text-soft">{care.label}</p>}
      <StatementList items={care.items} />
      <SourcesLink pkrIds={[care.pkr.id]} />
    </div>
  )
}

/**
 * "Where this comes from": an inline, expandable list of the Source PKRs
 * behind the given Published PKRs, each linked to its web address. Inline
 * rather than a modal so it works inside any card.
 */
export function SourcesLink({ pkrIds }: { pkrIds: string[] }) {
  const [open, setOpen] = useState(false)
  const sources = sourcesFor(...pkrIds)
  if (sources.length === 0) return null
  return (
    <div className="mt-1.5 text-xs">
      <button onClick={() => setOpen((v) => !v)} className="font-medium text-pip-primary underline underline-offset-2">
        {open ? 'Hide sources' : 'Where this comes from'}
      </button>
      {open && (
        <ul className="mt-1.5 flex flex-col gap-1">
          {sources.map((s) => (
            <li key={s.id} className="rounded-lg bg-pip-bg px-3 py-1.5">
              {s.url ? (
                <a href={s.url} target="_blank" rel="noreferrer" className="underline underline-offset-2">
                  {s.title}
                </a>
              ) : (
                s.title
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

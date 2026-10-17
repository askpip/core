import { useState } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { SourcesLink, StatementList } from '@/components/PkrStatements'
import { CARE_KINDS, agoText, careTiming, daysBetween, lastDone, localDate } from '@/lib/helpMeWith'
import { cn } from '@/lib/utils'
import type { CareKind, CareLogEntry } from '@/lib/types'

/** App wording, approved with the Help proposal (section 5, lines 5 and 6). */
const TAP: Record<CareKind, string> = { fed: 'I fed it', watered: 'I watered it', deadheaded: 'I deadheaded it', mulched: 'I mulched it' }
const NOUN: Record<CareKind, string> = { fed: 'feeding', watered: 'watering', deadheaded: 'deadheading', mulched: 'mulching' }
const DONE: Record<CareKind, string> = { fed: 'Fed', watered: 'Watered', deadheaded: 'Deadheaded', mulched: 'Mulched' }

/**
 * The one-tap care log, inside "Help me with [rose name]". Pip says only two kinds
 * of thing here: a fact from the log ("You last fed it 6 weeks ago"), and under it,
 * word for word, the Published timing statements for where the rose grows. It never
 * works out "it's time to feed"; the gardener reads the statement and decides.
 *
 * `withStatements` is false for a journal-only rose: care guidance is only shown for
 * a rose whose type passed PKR-SGT-000003 (BASICCARE D3).
 */
export function CareLog({
  name,
  entries,
  codes,
  withStatements,
  onAdd,
  onUndo,
}: {
  name: string
  entries: CareLogEntry[]
  codes: string[]
  withStatements: boolean
  onAdd: (kind: CareKind, doneOn: string) => Promise<CareLogEntry>
  onUndo: (entry: CareLogEntry) => void
}) {
  const [justAdded, setJustAdded] = useState<CareLogEntry | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [openKind, setOpenKind] = useState<CareKind | null>('fed')
  const today = localDate(new Date())

  async function tap(kind: CareKind) {
    setSaving(true)
    setError(null)
    try {
      setJustAdded(await onAdd(kind, today))
    } catch (err) {
      console.error('Failed to add care log entry:', err)
      setError("That didn't save — check your connection and try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium">What did you do for {name} today?</p>
      <div className="flex flex-wrap gap-2">
        {CARE_KINDS.map((k) => (
          <button
            key={k}
            disabled={saving}
            onClick={() => void tap(k)}
            className="min-h-11 rounded-full bg-pip-secondary px-4 py-2 text-sm font-bold text-pip-primary transition-colors hover:bg-pip-secondary-hover disabled:opacity-40"
          >
            {TAP[k]}
          </button>
        ))}
      </div>
      {justAdded && (
        <p className="flex items-center gap-3 text-sm" role="status">
          Noted: {justAdded.kind} today.
          <button
            onClick={() => {
              onUndo(justAdded)
              setJustAdded(null)
            }}
            className="font-bold text-pip-primary underline underline-offset-2"
          >
            Undo
          </button>
        </p>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}

      <div className="flex flex-col gap-2">
        {CARE_KINDS.map((k) => {
          const last = lastDone(entries, k)
          const line = last
            ? `You last ${k} ${name} ${agoText(daysBetween(last.doneOn, today))}.`
            : `Nothing logged for ${NOUN[k]} yet.`
          const timing = withStatements ? careTiming(k, codes) : undefined
          if (!timing || timing.statements.length === 0) {
            return (
              <p key={k} className="rounded-xl bg-pip-bg px-3.5 py-2.5 text-sm">
                {line}
              </p>
            )
          }
          const open = openKind === k
          return (
            <div key={k} className="rounded-xl bg-pip-bg px-3.5 py-2.5">
              <button
                onClick={() => setOpenKind(open ? null : k)}
                aria-expanded={open}
                className="flex w-full items-center justify-between gap-2 text-left text-sm"
              >
                <span>{line}</span>
                <ChevronDown size={16} className={cn('shrink-0 transition-transform', open && 'rotate-180')} />
              </button>
              {open && (
                <div className="mt-2">
                  <StatementList items={timing.statements} />
                  <SourcesLink pkrIds={timing.pkrIds} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/** The care log as it shows in the plant's journal, newest first. */
export function CareLogList({ entries, onRemove }: { entries: CareLogEntry[]; onRemove: (entry: CareLogEntry) => void }) {
  if (entries.length === 0) return null
  const sorted = [...entries].sort((a, b) => b.doneOn.localeCompare(a.doneOn) || b.createdAt.localeCompare(a.createdAt))
  return (
    <ul className="flex flex-col gap-1.5">
      {sorted.map((e) => {
        const [y, m, d] = e.doneOn.split('-').map(Number)
        const date = new Date(y, m - 1, d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
        return (
          <li key={e.id} className="flex items-center justify-between rounded-xl bg-pip-card px-3 py-2 text-sm shadow-sm">
            <span>
              {DONE[e.kind]} <span className="text-xs text-pip-text-soft">· {date}</span>
            </span>
            <button
              onClick={() => onRemove(e)}
              aria-label={`Remove ${DONE[e.kind].toLowerCase()}, ${date}`}
              className="flex h-6 w-6 items-center justify-center rounded-full text-pip-text-soft"
            >
              <X size={14} strokeWidth={2} />
            </button>
          </li>
        )
      })}
    </ul>
  )
}

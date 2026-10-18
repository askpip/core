import { useNavigate } from 'react-router-dom'
import type { ComingUpGroup } from '@/lib/comingUp'

/** Roses joined for a sentence: "A", "A and B", "A, B and C". */
function RoseNames({ roses, onOpen }: { roses: ComingUpGroup['roses']; onOpen: (id: string) => void }) {
  return (
    <>
      {roses.map((r, i) => (
        <span key={r.id}>
          {i > 0 && (i === roses.length - 1 ? ' and ' : ', ')}
          <button onClick={() => onOpen(r.id)} className="font-bold text-pip-primary underline underline-offset-2">
            {r.name}
          </button>
        </span>
      ))}
    </>
  )
}

/**
 * "Coming up" on the home screen (APP-REMINDERS-AND-PLACE proposal §2, approved
 * 18 October 2026). Shown only when a rose's place is in, or a month before, its
 * pruning months. The lines are the approved app wording (proposal §5, lines 1–3).
 */
export function ComingUp({ groups }: { groups: ComingUpGroup[] }) {
  const navigate = useNavigate()
  if (groups.length === 0) return null
  const open = (id: string) => navigate(`/plant/${id}`)
  return (
    <section className="mb-5 rounded-2xl border border-pip-border border-l-4 border-l-pip-petal bg-pip-card p-4 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wide text-pip-text-soft">Coming up</p>
      <ul className="mt-2 flex flex-col gap-2">
        {groups.map((g) => (
          <li key={`${g.kind}|${g.place}`} className="text-sm leading-relaxed">
            {g.kind === 'now' ? (
              <>
                It's pruning time in {g.place}: <RoseNames roses={g.roses} onOpen={open} />. Start the pruning journey to check
                each rose first.
              </>
            ) : (
              <>
                Pruning months in {g.place} start in {g.month}: <RoseNames roses={g.roses} onOpen={open} />.
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}

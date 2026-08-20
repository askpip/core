import { cn } from '@/lib/utils'
import type { Choice } from '@/lib/types'

const CHOICES: { id: Choice; label: string }[] = [
  { id: 'cut', label: 'Cut' },
  { id: 'leave', label: 'Leave' },
  { id: 'decide-later', label: 'Decide later' },
  { id: 'get-help', label: 'Get experienced local help' },
]

interface DecisionChoicesProps {
  onChoose: (choice: Choice) => void
}

/** The four supported outcomes for every confirmed observation (Architecture 5.3). */
export function DecisionChoices({ onChoose }: DecisionChoicesProps) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {CHOICES.map((c) => (
        <button
          key={c.id}
          onClick={() => onChoose(c.id)}
          className={cn(
            'rounded-xl border border-pip-border bg-pip-card px-3 py-3 text-sm font-medium text-pip-text transition-colors hover:border-pip-primary hover:bg-pip-secondary',
            c.id === 'get-help' && 'col-span-2',
          )}
        >
          {c.label}
        </button>
      ))}
    </div>
  )
}

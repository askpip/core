import { cn } from '@/lib/utils'
import type { Choice } from '@/lib/types'

export interface DecisionChoiceOption {
  choice: Choice
  label: string
}

const DEFAULT_CHOICES: DecisionChoiceOption[] = [
  { choice: 'cut', label: 'Cut' },
  { choice: 'leave', label: 'Leave' },
  { choice: 'decide-later', label: 'Decide later' },
  { choice: 'get-help', label: 'Get experienced local help' },
]

interface DecisionChoicesProps {
  onChoose: (choice: Choice) => void
  /** The choices a Decision Logic PKR offers here (Architecture 5.3). Defaults to the four standard choices. */
  options?: DecisionChoiceOption[]
}

export function DecisionChoices({ onChoose, options = DEFAULT_CHOICES }: DecisionChoicesProps) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {options.map((c) => (
        <button
          key={c.choice + c.label}
          onClick={() => onChoose(c.choice)}
          className={cn(
            'rounded-xl border border-pip-border bg-pip-card px-3 py-3 text-sm font-medium text-pip-text transition-colors hover:border-pip-primary hover:bg-pip-secondary',
            (c.choice === 'get-help' || c.label.length > 14) && 'col-span-2',
          )}
        >
          {c.label}
        </button>
      ))}
    </div>
  )
}

import { useState } from 'react'
import { Button } from '@/components/Button'
import { ROSE_TYPE_GATE } from '@/data/pkr'
import type { SavedRoseType } from '@/lib/types'

interface RoseTypeQuestionProps {
  onAnswer: (type: SavedRoseType) => void
  /** Optional "skip for now" (Add a plant only). The journey asks again later. */
  onSkip?: () => void
  disabled?: boolean
}

/**
 * PKR-SGT-000003's answer set, shared by Add a plant and the journey so the
 * gardener sees the same approved wording in both places. "I know its
 * variety name but not its type" leads to the Rose Finder and is never saved.
 */
export function RoseTypeQuestion({ onAnswer, onSkip, disabled }: RoseTypeQuestionProps) {
  const [showFinder, setShowFinder] = useState(false)

  if (showFinder) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-sm">{ROSE_TYPE_GATE.roseFinder.text}</p>
        {ROSE_TYPE_GATE.roseFinder.url && (
          <a
            href={ROSE_TYPE_GATE.roseFinder.url}
            target="_blank"
            rel="noreferrer"
            className="mb-1 text-sm font-medium text-pip-primary underline underline-offset-2"
          >
            Open the New Zealand Rose Society's Rose Finder
          </a>
        )}
        <Button disabled={disabled} onClick={() => setShowFinder(false)}>
          I've found its type — answer again
        </Button>
        <Button variant="secondary" disabled={disabled} onClick={() => onAnswer('unknown')}>
          I couldn't find it
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {ROSE_TYPE_GATE.answers.map((a) => (
        <Button
          key={a.id}
          disabled={disabled}
          variant={a.passes ? 'primary' : 'secondary'}
          onClick={() => (a.id === 'variety-only' ? setShowFinder(true) : onAnswer(a.id))}
        >
          {a.label}
        </Button>
      ))}
      {onSkip && (
        <button disabled={disabled} onClick={onSkip} className="text-sm text-pip-text-soft underline disabled:opacity-40">
          Skip for now — I'll be asked before pruning
        </button>
      )}
    </div>
  )
}

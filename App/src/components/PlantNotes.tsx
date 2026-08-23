import { useState } from 'react'
import { X, Trash2 } from 'lucide-react'
import { Button } from '@/components/Button'
import type { FollowUpNote } from '@/lib/types'

interface NoteCardProps {
  note: FollowUpNote
  onRemove: () => void
}

function NoteCard({ note, onRemove }: NoteCardProps) {
  const [confirming, setConfirming] = useState(false)
  const dateLabel = new Date(note.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="rounded-xl bg-pip-card p-3 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[11px] text-pip-text-soft">{dateLabel}</p>
          <p className="mt-0.5 whitespace-pre-wrap break-words text-sm text-pip-text">{note.note}</p>
        </div>

        {confirming ? (
          <div className="flex shrink-0 gap-1.5">
            <button
              type="button"
              onClick={onRemove}
              aria-label="Confirm delete"
              className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white"
            >
              <Trash2 size={12} strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              aria-label="Cancel"
              className="flex h-6 w-6 items-center justify-center rounded-full bg-pip-secondary text-pip-text"
            >
              <X size={12} strokeWidth={2.25} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            aria-label="Delete this note"
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-pip-text-soft"
          >
            <X size={14} strokeWidth={2} />
          </button>
        )}
      </div>
    </div>
  )
}

interface PlantNotesProps {
  notes: FollowUpNote[]
  onAdd: (text: string) => Promise<unknown>
  onRemove: (note: FollowUpNote) => void
  className?: string
}

/**
 * A free-text journal for a plant — unlike ProgressPhotos.tsx (open-ended
 * too, but photos) or Journey.tsx's structured per-feature observations,
 * this is anywhere the gardener wants to jot something down about the plant,
 * any time ("the aphids are back," "moved it to more shade for summer").
 * Backed by public.follow_ups, which already existed in the schema
 * (Architecture §6.4's "Follow-Up") but had never been wired into the app
 * until this feature — see src/lib/store.ts's addNote/deleteNote.
 */
export function PlantNotes({ notes, onAdd, onRemove, className }: PlantNotesProps) {
  const [draft, setDraft] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleAdd() {
    const text = draft.trim()
    if (!text) return

    setSaving(true)
    setError(null)
    try {
      await onAdd(text)
      setDraft('')
    } catch (err) {
      console.error('Failed to add note:', err)
      setError("That note didn't save — check your connection and try again.")
    } finally {
      setSaving(false)
    }
  }

  const sorted = [...notes].sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  return (
    <div className={className}>
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Jot down anything about this plant…"
        rows={2}
        className="input w-full resize-none text-sm"
      />
      <Button
        variant="secondary"
        disabled={!draft.trim() || saving}
        onClick={handleAdd}
        className="mt-2"
      >
        {saving ? 'Saving…' : 'Add note'}
      </Button>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

      {sorted.length > 0 && (
        <div className="mt-3 flex flex-col gap-2">
          {sorted.map((note) => (
            <NoteCard key={note.id} note={note} onRemove={() => onRemove(note)} />
          ))}
        </div>
      )}
    </div>
  )
}

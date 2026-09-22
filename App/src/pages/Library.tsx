import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Check, Trash2, BookOpen, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useProjects } from '@/lib/store'
import { useAuth } from '@/lib/auth'
import { PlantThumbnail } from '@/components/PlantThumbnail'
import { AppHeader } from '@/components/AppHeader'
import { Button } from '@/components/Button'

// Same fallback Welcome.tsx uses when a gardener somehow has no saved name
// yet — shouldn't happen in the normal flow, but a heading shouldn't break
// over a missing string.
const FALLBACK_NAME = 'Gardener'

export function Library() {
  const navigate = useNavigate()
  const { projects, deleteProject } = useProjects()
  const { user } = useAuth()
  const displayName = user?.user_metadata?.displayName
  const name = typeof displayName === 'string' && displayName.trim() ? displayName.trim() : FALLBACK_NAME

  const [selectMode, setSelectMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  function toggleSelectMode() {
    setSelectMode((v) => !v)
    setSelectedIds(new Set())
  }

  function toggleSelected(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleCardClick(id: string) {
    if (selectMode) {
      toggleSelected(id)
    } else {
      navigate(`/plant/${id}`)
    }
  }

  function handleDeleteSelected() {
    const count = selectedIds.size
    if (count === 0) return
    const names = projects.filter((p) => selectedIds.has(p.id)).map((p) => p.name)
    const message =
      count === 1
        ? `Delete ${names[0]}? This removes its whole journal and can't be undone.`
        : `Delete ${count} plants (${names.join(', ')})? This removes their whole journals and can't be undone.`
    if (window.confirm(message)) {
      selectedIds.forEach((id) => deleteProject(id))
      setSelectMode(false)
      setSelectedIds(new Set())
    }
  }

  return (
    <div className="flex h-full flex-col">
      <AppHeader />

      <div className="flex-1 overflow-y-auto px-4 pt-4">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="font-heading text-2xl">{name}'s Plants</h2>
          {projects.length > 0 && (
            <button
              onClick={toggleSelectMode}
              className="text-sm font-medium text-pip-primary"
            >
              {selectMode ? 'Cancel' : 'Select'}
            </button>
          )}
        </div>
        <p className="mb-4 text-sm text-pip-text-soft">
          {selectMode
            ? 'Tap the plants you want to delete.'
            : "Every plant's story lives here — photos, decisions and what happened next."}
        </p>

        {/* Learn used to be reachable only from the header's ⋯ menu — easy to
            never notice. This is the same destination (/learn), just given
            real visibility on the one screen every gardener actually returns
            to, rather than sitting buried alongside Log Out and Privacy.
            Hidden in select mode, same reasoning as the "Add a plant" tile
            below: nothing here should compete for attention with a delete
            decision in progress. */}
        {!selectMode && (
          <button
            onClick={() => navigate('/learn')}
            className="mb-5 flex w-full items-center gap-3 rounded-2xl bg-pip-secondary/60 px-4 py-3.5 text-left shadow-sm transition-transform hover:-translate-y-0.5"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pip-card text-pip-primary">
              <BookOpen size={20} strokeWidth={1.75} />
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium text-pip-text">Learn with Pip</p>
              <p className="text-xs text-pip-text-soft">
                How the journey works, what Pip can help with, and more
              </p>
            </div>
            <ChevronRight size={18} className="shrink-0 text-pip-text-soft" />
          </button>
        )}

        <div className="grid grid-cols-2 gap-4">
          {projects.map((project) => {
            const selected = selectedIds.has(project.id)
            return (
              <div
                key={project.id}
                role="button"
                tabIndex={0}
                onClick={() => handleCardClick(project.id)}
                onKeyDown={(e) => e.key === 'Enter' && handleCardClick(project.id)}
                className={cn(
                  'flex cursor-pointer flex-col gap-2 rounded-2xl bg-pip-card p-3 text-left shadow-sm transition-transform',
                  !selectMode && 'hover:-translate-y-0.5',
                  selected && 'ring-2 ring-pip-primary',
                )}
              >
                <div className="relative">
                  <PlantThumbnail
                    path={project.overviewPhotoPath}
                    label={project.name}
                    className="aspect-square w-full"
                  />
                  {selectMode && (
                    <span
                      className={cn(
                        'absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full border-2',
                        selected
                          ? 'border-pip-primary bg-pip-primary text-white'
                          : 'border-white bg-white/70 text-transparent',
                      )}
                    >
                      <Check size={14} strokeWidth={3} />
                    </span>
                  )}
                </div>
                <div>
                  {/* Variety used to show here too, but a gardener who
                      answered "not sure"/"I don't know" to the variety
                      question during onboarding (a genuinely fine, expected
                      answer — see NewPlant.tsx's isUnknownVarietyAnswer)
                      then had that exact phrase sitting under their plant's
                      name on every card, which read as broken rather than
                      honest. The name is enough to identify a card at a
                      glance; variety and everything else is one tap away on
                      the plant's own page. */}
                  <p className="font-medium">{project.name}</p>
                </div>
              </div>
            )
          })}

          {!selectMode && (
            <button
              onClick={() => navigate('/new-plant')}
              className="flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-pip-border text-pip-text-soft transition-colors hover:border-pip-primary hover:text-pip-primary"
            >
              <Plus size={28} />
              <span className="text-sm font-medium">Add a plant</span>
            </button>
          )}
        </div>

        {selectMode && (
          <div className="sticky bottom-4 mt-6">
            <Button
              disabled={selectedIds.size === 0}
              onClick={handleDeleteSelected}
              className="flex items-center justify-center gap-2 bg-red-600 hover:enabled:bg-red-700"
            >
              <Trash2 size={16} />
              Delete {selectedIds.size > 0 ? `(${selectedIds.size})` : ''}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Check, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useProjects } from '@/lib/store'
import { PlantThumbnail } from '@/components/PlantThumbnail'
import { AppHeader } from '@/components/AppHeader'
import { Button } from '@/components/Button'

export function Library() {
  const navigate = useNavigate()
  const { projects, deleteProject } = useProjects()

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
          <h2 className="font-heading text-2xl">Your plants</h2>
          {projects.length > 0 && (
            <button
              onClick={toggleSelectMode}
              className="text-sm font-medium text-pip-primary"
            >
              {selectMode ? 'Cancel' : 'Select'}
            </button>
          )}
        </div>
        <p className="mb-6 text-sm text-pip-text-soft">
          {selectMode
            ? 'Tap the plants you want to delete.'
            : "Every plant's story lives here — photos, decisions and what happened next."}
        </p>

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
                  <p className="font-medium">{project.name}</p>
                  <p className="text-xs text-pip-text-soft">{project.variety}</p>
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

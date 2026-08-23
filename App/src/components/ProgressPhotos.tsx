import { useRef, useState, type ChangeEvent } from 'react'
import { Camera, Upload, X, Loader2, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePlantPhotoUrl } from '@/lib/photos'
import type { ProgressPhoto } from '@/lib/types'

interface ThumbProps {
  photo: ProgressPhoto
  onRemove: () => void
}

function ProgressPhotoThumb({ photo, onRemove }: ThumbProps) {
  const url = usePlantPhotoUrl(photo.path)
  const [confirming, setConfirming] = useState(false)
  const dateLabel = new Date(photo.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="relative aspect-square overflow-hidden rounded-xl bg-pip-bg-deep">
      {url ? (
        <img
          src={url}
          alt={photo.caption ?? `Progress photo from ${dateLabel}`}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <Loader2 size={18} className="animate-spin text-pip-text-soft" />
        </div>
      )}

      <span className="absolute inset-x-0 bottom-0 bg-black/50 px-1.5 py-1 text-center text-[10px] text-white">
        {dateLabel}
      </span>

      {confirming ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/70 p-2">
          <p className="text-center text-[11px] text-white">Delete this photo?</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onRemove}
              aria-label="Confirm delete"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white"
            >
              <Trash2 size={13} strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              aria-label="Cancel"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-pip-text"
            >
              <X size={14} strokeWidth={2.25} />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          aria-label="Delete this progress photo"
          className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-white"
        >
          <X size={12} strokeWidth={2.5} />
        </button>
      )}
    </div>
  )
}

interface ProgressPhotosProps {
  photos: ProgressPhoto[]
  onAdd: (file: File) => Promise<unknown>
  onRemove: (photo: ProgressPhoto) => void
  className?: string
}

/**
 * An open-ended photo log for a plant — unlike the two fixed overview/
 * close-up slots (PhotoUpload.tsx, used for the cover photo and a pruning
 * close-up), a gardener can add as many of these as they like, whenever
 * they like, to see how the plant changes over time. Newest first, since
 * that's what someone checking in on a plant wants to see up top.
 */
export function ProgressPhotos({ photos, onAdd, onRemove, className }: ProgressPhotosProps) {
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = '' // so picking the same file again still fires onChange
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('That file is not a photo — please choose an image.')
      return
    }

    setError(null)
    setUploading(true)
    try {
      await onAdd(file)
    } catch (err) {
      console.error('Failed to add progress photo:', err)
      setError("That photo didn't save — check your connection and try again.")
    } finally {
      setUploading(false)
    }
  }

  const sorted = [...photos].sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  return (
    <div className={className}>
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFile}
      />
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

      <div className="grid grid-cols-3 gap-2">
        <div
          className={cn(
            'flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-pip-border text-pip-text-soft',
          )}
        >
          {uploading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                aria-label="Take a progress photo"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-pip-card text-pip-text shadow-sm"
              >
                <Camera size={15} strokeWidth={1.75} />
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Upload a progress photo"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-pip-card text-pip-text shadow-sm"
              >
                <Upload size={15} strokeWidth={1.75} />
              </button>
            </div>
          )}
        </div>

        {sorted.map((photo) => (
          <ProgressPhotoThumb key={photo.id} photo={photo} onRemove={() => onRemove(photo)} />
        ))}
      </div>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  )
}

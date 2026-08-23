import { useRef, useState, type ChangeEvent } from 'react'
import { Camera, Upload, X, Loader2, Trash2 } from 'lucide-react'
import { usePlantPhotoUrl } from '@/lib/photos'

interface ThumbProps {
  path: string
  onRemove: () => void
}

function CloseUpThumb({ path, onRemove }: ThumbProps) {
  const url = usePlantPhotoUrl(path)
  const [confirming, setConfirming] = useState(false)

  return (
    <div className="relative aspect-square overflow-hidden rounded-xl bg-pip-bg-deep">
      {url ? (
        <img src={url} alt="Close-up" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <Loader2 size={18} className="animate-spin text-pip-text-soft" />
        </div>
      )}

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
          aria-label="Delete this close-up photo"
          className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-white"
        >
          <X size={12} strokeWidth={2.5} />
        </button>
      )}
    </div>
  )
}

interface JourneyCloseUpsProps {
  paths: string[]
  onAdd: (file: File) => Promise<unknown>
  onRemove: (path: string) => void
  className?: string
}

/**
 * A gallery, not a single fixed slot: Journey.tsx's photos-phase prompt asks
 * for "a few close-ups of where stems cross or look uncertain," which the
 * original single-slot PhotoUpload couldn't actually deliver — taking a
 * second close-up just replaced the first, with nowhere for the rest to go.
 * This adds as many as needed, each independently removable. Same visual
 * language (Take/Upload pill buttons, inline delete-confirm) as
 * PhotoUpload.tsx and ProgressPhotos.tsx for consistency.
 */
export function JourneyCloseUps({ paths, onAdd, onRemove, className }: JourneyCloseUpsProps) {
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
      console.error('Failed to add close-up photo:', err)
      setError("That photo didn't save — check your connection and try again.")
    } finally {
      setUploading(false)
    }
  }

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
        <div className="flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-pip-border text-pip-text-soft">
          {uploading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                aria-label="Take a close-up photo"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-pip-card text-pip-text shadow-sm"
              >
                <Camera size={15} strokeWidth={1.75} />
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Upload a close-up photo"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-pip-card text-pip-text shadow-sm"
              >
                <Upload size={15} strokeWidth={1.75} />
              </button>
            </div>
          )}
        </div>

        {paths.map((path) => (
          <CloseUpThumb key={path} path={path} onRemove={() => onRemove(path)} />
        ))}
      </div>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  )
}

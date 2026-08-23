import { useRef, useState, type ChangeEvent } from 'react'
import { Camera, Upload, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import {
  plantPhotoPath,
  removePlantPhoto,
  uploadPlantPhoto,
  usePlantPhotoUrl,
  type PlantPhotoSlot,
} from '@/lib/photos'

interface PhotoUploadProps {
  /** Shown on the empty placeholder, and used in alt text once a photo's attached. */
  label: string
  profileId: string
  slot: PlantPhotoSlot
  /** The currently-saved storage path for this slot, if any (from the plant's record). */
  path?: string
  /** Called with the new storage path once an upload succeeds, or undefined once removed — the caller persists this to the plant's record. */
  onChange: (path: string | undefined) => void
  className?: string
}

/**
 * Lets the gardener take a photo (opens the device camera where one exists)
 * or upload one from their device, in place of the inert placeholder boxes
 * that used to sit in Journey.tsx's 'photos' phase. Two separate hidden file
 * inputs rather than one: `capture` pushes some mobile browsers straight to
 * the camera app, skipping the gallery entirely, so "take" and "upload" need
 * their own triggers to both stay reachable.
 */
export function PhotoUpload({ label, profileId, slot, path, onChange, className }: PhotoUploadProps) {
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [localPreview, setLocalPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Skip fetching a signed URL for the saved path while a fresher local
  // preview (from the file just picked) is already showing — avoids a
  // pointless network round-trip and a flash back to the old photo.
  const savedUrl = usePlantPhotoUrl(localPreview ? undefined : path)
  const displayUrl = localPreview ?? savedUrl

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = '' // so picking the same file again still fires onChange
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('That file is not a photo — please choose an image.')
      return
    }

    setError(null)
    const objectUrl = URL.createObjectURL(file)
    setLocalPreview(objectUrl)
    setUploading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not signed in')

      const storagePath = plantPhotoPath(user.id, profileId, slot)
      await uploadPlantPhoto(storagePath, file)
      onChange(storagePath)
    } catch (err) {
      console.error('Failed to upload photo:', err)
      setError("That photo didn't save — check your connection and try again.")
      setLocalPreview(null)
    } finally {
      setUploading(false)
    }
  }

  async function handleRemove() {
    setLocalPreview(null)
    setError(null)
    onChange(undefined)
    if (path) {
      try {
        await removePlantPhoto(path)
      } catch (err) {
        // Not surfaced to the gardener — the plant's record no longer
        // points at it either way, so a leftover file in storage is a
        // harmless cleanup gap, not something worth interrupting them over.
        console.error('Failed to delete photo from storage:', err)
      }
    }
  }

  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-br from-pip-secondary to-pip-bg-deep text-pip-text-soft',
        className,
      )}
    >
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFile}
      />
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

      {displayUrl ? (
        <>
          <img src={displayUrl} alt={label} className="absolute inset-0 h-full w-full object-cover" />
          {uploading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Loader2 size={22} className="animate-spin text-white" />
            </div>
          ) : (
            <button
              type="button"
              onClick={handleRemove}
              aria-label={`Remove ${label} photo`}
              className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white"
            >
              <X size={14} strokeWidth={2.5} />
            </button>
          )}
        </>
      ) : (
        <>
          <span className="px-3 text-center text-xs">{label}</span>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              aria-label={`Take a photo for ${label}`}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-pip-text shadow-sm"
            >
              <Camera size={16} strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              aria-label={`Upload a photo for ${label}`}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-pip-text shadow-sm"
            >
              <Upload size={16} strokeWidth={1.75} />
            </button>
          </div>
        </>
      )}

      {error && (
        <p className="absolute inset-x-1 bottom-1 rounded bg-white/95 px-1.5 py-1 text-center text-[10px] leading-tight text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

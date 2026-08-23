import { useRef, useState, type ChangeEvent } from 'react'
import { Pencil, Camera, Upload, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { plantPhotoPath, uploadPlantPhoto, usePlantPhotoUrl, type PlantPhotoSlot } from '@/lib/photos'

interface PhotoCardProps {
  overlayName?: string
  /** The plant's overview photo path, if one's been taken/uploaded yet — see PlantProject.overviewPhotoPath. */
  photoPath?: string
  className?: string
  /**
   * Together, these enable the edit-cover-photo control (a small pencil
   * button in the card's top-left corner). Only passed by PlantProject.tsx's
   * large hero card — a gardener's first cover photo is often a young,
   * newly-planted rose, and by the time it's flowering they may want a
   * truer, current shot without that meaning "delete and start over."
   * Left unset (as before) anywhere PhotoCard is just a display, since
   * replacing the plant's actual cover photo only makes sense from the
   * plant's own page, not a smaller thumbnail elsewhere.
   */
  profileId?: string
  slot?: PlantPhotoSlot
  onPhotoChange?: (path: string | undefined) => void
}

/**
 * The rounded, framed photo card used for a plant's main photo — matches the
 * "Sarah's Rose" mockup: white border, soft shadow, and the plant's name in
 * script over a dark gradient scrim. Falls back to the gradient placeholder
 * (no photoPath yet, or its signed URL is still loading) rather than an
 * empty box — the gradient sits behind the image either way, so there's
 * never a blank flash while a photo loads.
 */
export function PhotoCard({
  overlayName,
  photoPath,
  className,
  profileId,
  slot,
  onPhotoChange,
}: PhotoCardProps) {
  const editable = Boolean(profileId && slot && onPhotoChange)

  const cameraInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // A replacement cover photo re-uploads to the SAME fixed storage path
  // (plantPhotoPath's slot is one path per plant, overwritten on re-upload —
  // see photos.ts), so `photoPath` itself never changes when the gardener
  // swaps the image. usePlantPhotoUrl's fetch is keyed on that path, so
  // without this it would never re-run and the old (now stale) signed URL —
  // possibly still browser-cached to boot — would keep showing. Track the
  // freshly-picked file's own local preview instead, exactly like
  // PhotoUpload.tsx does, and prefer it once set for the rest of this visit.
  const [localPreview, setLocalPreview] = useState<string | null>(null)

  const savedUrl = usePlantPhotoUrl(localPreview ? undefined : photoPath)
  const photoUrl = localPreview ?? savedUrl

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = '' // so picking the same file again still fires onChange
    if (!file || !profileId || !slot || !onPhotoChange) return

    if (!file.type.startsWith('image/')) {
      setError('That file is not a photo — please choose an image.')
      return
    }

    setError(null)
    setPickerOpen(false)
    const objectUrl = URL.createObjectURL(file)
    setLocalPreview(objectUrl)
    setUploading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not signed in')

      // Same fixed per-slot path as onboarding's own upload — re-uploading
      // here just overwrites it, matching uploadPlantPhoto's upsert.
      const storagePath = plantPhotoPath(user.id, profileId, slot)
      await uploadPlantPhoto(storagePath, file)
      onPhotoChange(storagePath)
    } catch (err) {
      console.error('Failed to update cover photo:', err)
      setError("That photo didn't save — check your connection and try again.")
      setLocalPreview(null)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={cn('rounded-[1.75rem] bg-white p-2 shadow-md', className)}>
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-[#7fae61] via-[#a8c98a] to-[#e0a872]">
        {photoUrl && (
          <img
            src={photoUrl}
            alt={overlayName ?? 'Plant photo'}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        {overlayName && (
          <>
            <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/55 to-transparent" />
            <span className="font-script absolute bottom-3 left-4 right-4 text-3xl text-white drop-shadow-sm">
              {overlayName}
            </span>
          </>
        )}

        {editable && (
          <>
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFile}
            />
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

            {uploading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <Loader2 size={22} className="animate-spin text-white" />
              </div>
            ) : pickerOpen ? (
              <>
                {/* Closes the picker on an outside tap; sits below the buttons themselves. */}
                <div className="absolute inset-0 z-10" onClick={() => setPickerOpen(false)} />
                <div className="absolute left-2 top-2 z-20 flex gap-2">
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    aria-label="Take a new cover photo"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-pip-text shadow-sm"
                  >
                    <Camera size={15} strokeWidth={1.75} />
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Upload a new cover photo"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-pip-text shadow-sm"
                  >
                    <Upload size={15} strokeWidth={1.75} />
                  </button>
                </div>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                aria-label="Edit cover photo"
                className="absolute left-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-pip-text shadow-sm"
              >
                <Pencil size={14} strokeWidth={1.75} />
              </button>
            )}

            {error && (
              <p className="absolute inset-x-2 top-12 z-20 rounded bg-white/95 px-1.5 py-1 text-center text-[10px] leading-tight text-red-600">
                {error}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}

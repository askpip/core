import { useEffect } from 'react'
import { ChevronLeft, ChevronRight, Loader2, X } from 'lucide-react'
import { usePlantPhotoUrl } from '@/lib/photos'

/**
 * A photo opened full size over the page, from a plant's journal. Tapping
 * outside the photo, the close button or Escape closes it. With `onPrev` /
 * `onNext`, arrows (and the arrow keys) step through the other photos.
 */
export function PhotoViewer({
  path,
  url: givenUrl,
  label,
  onClose,
  onPrev,
  onNext,
}: {
  /** A storage path (a signed URL is fetched), or pass `url` directly. */
  path?: string
  url?: string
  /** Shown under the photo and used as its alt text, e.g. the date it was taken. */
  label: string
  onClose: () => void
  onPrev?: () => void
  onNext?: () => void
}) {
  const fetched = usePlantPhotoUrl(givenUrl ? undefined : path)
  const url = givenUrl ?? fetched

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') onPrev?.()
      else if (e.key === 'ArrowRight') onNext?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onPrev, onNext])

  const arrow = 'absolute top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white'

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-3"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label="Close photo"
        className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white"
      >
        <X size={20} />
      </button>
      {url ? (
        <img
          src={url}
          alt={label}
          className="max-h-[85%] max-w-full rounded-lg object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <Loader2 size={24} className="animate-spin text-white" />
      )}
      <p className="mt-3 text-sm text-white/90">{label}</p>
      {onPrev && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onPrev()
          }}
          aria-label="Previous photo"
          className={`${arrow} left-3`}
        >
          <ChevronLeft size={22} />
        </button>
      )}
      {onNext && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onNext()
          }}
          aria-label="Next photo"
          className={`${arrow} right-3`}
        >
          <ChevronRight size={22} />
        </button>
      )}
    </div>
  )
}

import { Loader2 } from 'lucide-react'
import { usePlantPhotoUrl } from '@/lib/photos'

function Thumb({ path, label, onOpen }: { path: string; label: string; onOpen: () => void }) {
  const url = usePlantPhotoUrl(path)
  return (
    <button type="button" onClick={onOpen} aria-label={`Open ${label}`} className="aspect-square overflow-hidden rounded-xl bg-pip-bg-deep">
      {url ? (
        <img src={url} alt={label} className="h-full w-full object-cover" />
      ) : (
        <span className="flex h-full w-full items-center justify-center">
          <Loader2 size={18} className="animate-spin text-pip-text-soft" />
        </span>
      )}
    </button>
  )
}

/**
 * The photos taken in the pruning journey (the whole bush, then the close-ups), shown on
 * the rose's page at a Founder's direction, 18 October 2026. They open in the rose's
 * gallery; adding or removing them stays in the journey.
 */
export function JourneyPhotos({
  photos,
  onOpen,
}: {
  photos: { id: string; path: string; label: string }[]
  onOpen: (id: string) => void
}) {
  if (photos.length === 0) return null
  return (
    <div className="grid grid-cols-3 gap-2">
      {photos.map((p) => (
        <Thumb key={p.id} path={p.path} label={p.label} onOpen={() => onOpen(p.id)} />
      ))}
    </div>
  )
}

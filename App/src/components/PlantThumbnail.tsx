import { cn } from '@/lib/utils'
import { usePlantPhotoUrl } from '@/lib/photos'
import { PhotoPlaceholder } from './PhotoPlaceholder'

interface PlantThumbnailProps {
  /** The plant's overview photo path, if one's been taken/uploaded yet — see PlantProject overviewPhotoPath. */
  path?: string
  label: string
  className?: string
}

/** A plant's card image in the library grid — the real overview photo once one exists, the usual labelled placeholder until then. */
export function PlantThumbnail({ path, label, className }: PlantThumbnailProps) {
  const url = usePlantPhotoUrl(path)

  if (!url) {
    return <PhotoPlaceholder label={label} className={className} />
  }

  return (
    <div className={cn('overflow-hidden rounded-2xl', className)}>
      <img src={url} alt={label} className="h-full w-full object-cover" />
    </div>
  )
}

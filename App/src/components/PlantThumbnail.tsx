import { useState } from 'react'
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
  // A photo that exists but won't display (missing file, or a format the
  // browser can't show) used to leave a blank white card; show the placeholder.
  const [failedUrl, setFailedUrl] = useState<string | null>(null)

  if (!url || failedUrl === url) {
    return <PhotoPlaceholder label={label} className={className} />
  }

  return (
    <div className={cn('overflow-hidden rounded-2xl', className)}>
      <img src={url} alt={label} className="h-full w-full object-cover" onError={() => setFailedUrl(url)} />
    </div>
  )
}

import { cn } from '@/lib/utils'
import pipFront from '@/assets/pip/pip-front-transparent.png'

interface PipAvatarProps {
  /** Width in pixels — height follows automatically from the image's own proportions, so there's no letterboxing. */
  size?: number
  className?: string
}

/** Pip, front view, transparent background. Source: Graphics/Pip opaque.png. */
export function PipAvatar({ size = 96, className }: PipAvatarProps) {
  return (
    <img
      src={pipFront}
      alt="Pip, your gardening companion"
      className={cn(className)}
      style={{ width: size, height: 'auto' }}
    />
  )
}

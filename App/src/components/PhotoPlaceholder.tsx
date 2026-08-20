import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Camera } from 'lucide-react'

interface PhotoPlaceholderProps {
  label?: string
  className?: string
  children?: ReactNode
}

/**
 * Stand-in for a gardener-supplied photograph. Real photos are captured by the
 * gardener at runtime (camera/upload), so the shell uses a labelled placeholder
 * rather than a baked-in stock image.
 */
export function PhotoPlaceholder({ label, className, children }: PhotoPlaceholderProps) {
  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-br from-pip-secondary to-pip-bg-deep text-pip-text-soft',
        className,
      )}
    >
      <Camera size={28} strokeWidth={1.5} />
      {label && <span className="px-3 text-center text-xs">{label}</span>}
      {children}
    </div>
  )
}

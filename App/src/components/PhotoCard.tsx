import { cn } from '@/lib/utils'

interface PhotoCardProps {
  overlayName?: string
  className?: string
}

/**
 * The rounded, framed photo card used for a plant's main photo — matches the
 * "Sarah's Rose" mockup: white border, soft shadow, and the plant's name in
 * script over a dark gradient scrim. Uses a placeholder gradient in place of
 * a real photo until camera/upload capture is wired up.
 */
export function PhotoCard({ overlayName, className }: PhotoCardProps) {
  return (
    <div className={cn('rounded-[1.75rem] bg-white p-2 shadow-md', className)}>
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-[#7fae61] via-[#a8c98a] to-[#e0a872]">
        {overlayName && (
          <>
            <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/55 to-transparent" />
            <span className="font-script absolute bottom-3 left-4 right-4 text-3xl text-white drop-shadow-sm">
              {overlayName}
            </span>
          </>
        )}
      </div>
    </div>
  )
}

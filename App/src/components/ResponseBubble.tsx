import type { ReactNode } from 'react'
import { Send } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ResponseBubbleProps {
  children: ReactNode
  className?: string
  /** Shows a free-text "Ask Pip" field below the buttons, like a chat input bar. */
  showAskField?: boolean
}

/**
 * The gardener's "turn" — buttons or a text box, anchored to the bottom
 * centre of the screen with a downward-pointing tail, as if the words are
 * coming from the person standing at the bottom of the screen talking back
 * to Pip.
 */
export function ResponseBubble({ children, className, showAskField }: ResponseBubbleProps) {
  return (
    <div className={cn('relative mx-auto mt-4 w-full rounded-2xl bg-pip-card p-4 shadow-md', className)}>
      {children}

      {showAskField && (
        <div className="mt-3 flex items-center gap-2 rounded-full border border-pip-border bg-pip-bg px-4 py-2.5">
          <span className="flex-1 text-sm text-pip-text-soft/60">Ask Pip</span>
          <Send size={16} className="text-pip-text-soft/60" />
        </div>
      )}

      <span
        aria-hidden
        className="absolute left-1/2 top-full h-4 w-4 -translate-x-1/2 -translate-y-2 rotate-45 bg-pip-card"
      />
    </div>
  )
}

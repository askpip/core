import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ResponseBubbleProps {
  children: ReactNode
  className?: string
}

/**
 * The gardener's "turn" — buttons or a text box, anchored to the bottom
 * centre of the screen with a downward-pointing tail, as if the words are
 * coming from the person standing at the bottom of the screen talking back
 * to Pip.
 */
/*
 * The decorative "Ask Pip" bar that used to sit at the bottom of this bubble
 * was removed on 1 October 2026: it looked like a text box but couldn't be
 * typed in, and the Founders decided (23 September 2026) against free-text
 * questions. Tappable common questions (CommonQuestions.tsx) replace it.
 */
export function ResponseBubble({ children, className }: ResponseBubbleProps) {
  return (
    <div className={cn('relative mx-auto mt-4 w-full rounded-2xl bg-pip-card p-4 shadow-md', className)}>
      {children}


      <span
        aria-hidden
        className="absolute left-1/2 top-full h-4 w-4 -translate-x-1/2 -translate-y-2 rotate-45 bg-pip-card"
      />
    </div>
  )
}

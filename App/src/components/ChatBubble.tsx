import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { PipAvatar } from './PipAvatar'

interface ChatBubbleProps {
  children: ReactNode
}

// pip-front-transparent.png is 600x438; his mouth sits ~48% down the frame (measured directly from the pixel data),
// and his silhouette only reaches ~66% of his box width, leaving room to tuck the bubble in behind him.
//
// PIP_SIZE was 190 until a Founder review flagged the bubble as too narrow —
// on a ~375px-wide phone frame, a 190px Pip (minus the overlap) left the
// bubble only about 200px to work with, which wrapped ordinary content
// (like an email address) onto more lines than it needed to. It was then
// dropped to 130, which read as too small on a second look. Landing at 155:
// bigger than 130, but the extra size is partly paid for by PIP_BLEED_PX
// below rather than coming entirely out of the bubble's width. OVERLAP_PX
// stays a fraction of PIP_SIZE, so it keeps tucking into the same ~34%
// transparent margin around his silhouette at any size, instead of under-
// or over-lapping if PIP_SIZE changes again.
const PIP_SIZE = 155
const PIP_ASPECT = 438 / 600
const MOUTH_FRACTION = 0.48
const OVERLAP_FRACTION = 45 / 190
const OVERLAP_PX = PIP_SIZE * OVERLAP_FRACTION
// His image has empty, transparent padding on his left side too (confirmed
// by zooming into the rendered avatar — it's not just the right-side margin
// OVERLAP_PX tucks the bubble into). Pulling his box left by this much bleeds
// that empty padding off the edge of the phone frame (which clips it, via
// the frame's own overflow-hidden) rather than showing it as visible empty
// space — so he can render bigger without taking any extra width away from
// the bubble. Kept modest and short of PIP_SIZE * (1 - 0.66) so it can't
// start cutting into his actual silhouette.
const PIP_BLEED_PX = 20

const PIP_HEIGHT = PIP_SIZE * PIP_ASPECT
// items-center aligns Pip's and the bubble's vertical centres (each ~50% of its own height) to the same
// line, which already lands within a couple of px of the mouth (48%) — this is the small correction for
// the rest, so the pointer sits exactly on his mouth regardless of how tall the bubble grows.
const POINTER_OFFSET_FROM_CENTER = (MOUTH_FRACTION - 0.5) * PIP_HEIGHT

/** Pip's message, shown beside his avatar, with a pointer aimed at his mouth. The bubble is centred on the pointer, not pinned to his feet. */
export function ChatBubble({ children }: ChatBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center"
    >
      <PipAvatar
        size={PIP_SIZE}
        className="relative z-10 shrink-0"
        style={{ marginLeft: -PIP_BLEED_PX }}
      />
      <div
        className="relative z-0 min-w-0 flex-1 break-words rounded-2xl bg-pip-card px-4 py-3.5 text-base leading-relaxed text-pip-text shadow-sm"
        style={{ marginLeft: -OVERLAP_PX }}
      >
        {children}
        <span
          aria-hidden
          className="absolute"
          style={{
            left: -10,
            top: `calc(50% + ${POINTER_OFFSET_FROM_CENTER}px)`,
            transform: 'translateY(-50%)',
            width: 0,
            height: 0,
            borderTop: '9px solid transparent',
            borderBottom: '9px solid transparent',
            borderRight: '10px solid var(--color-pip-card)',
          }}
        />
      </div>
    </motion.div>
  )
}

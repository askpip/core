import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { PipAvatar } from './PipAvatar'

interface ChatBubbleProps {
  children: ReactNode
}

// pip-front-transparent.png is 600x438; his mouth sits ~48% down the frame (measured directly from the pixel data),
// and his silhouette only reaches ~66% of his box width, leaving room to tuck the bubble in behind him.
const PIP_SIZE = 190
const PIP_ASPECT = 438 / 600
const MOUTH_FRACTION = 0.48
const OVERLAP_PX = 45

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
      <PipAvatar size={PIP_SIZE} className="relative z-10 shrink-0" />
      <div
        className="relative z-0 min-w-0 flex-1 rounded-2xl bg-pip-card px-4 py-3.5 text-base leading-relaxed text-pip-text shadow-sm"
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

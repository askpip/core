import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'
import pipFront from '@/assets/pip/pip-front.webp'
import pipWaving from '@/assets/pip/pip-waving.webp'
import pipGesturing from '@/assets/pip/pip-gesturing.webp'
import pipThumbsUp from '@/assets/pip/pip-thumbs-up.webp'
import pipThinking from '@/assets/pip/pip-thinking.webp'
import pipSitting from '@/assets/pip/pip-sitting.webp'
import pipSittingGesturing from '@/assets/pip/pip-sitting-gesturing.webp'

/**
 * Pip's poses. Every image shares one 600x460 frame, with his boots, body
 * and face in the same place, so switching pose between screens never makes
 * him jump. Each has a soft ground shadow so he stands on any background.
 * Sources: Graphics/Pip Cut-outs/ (2 October 2026).
 */
export type PipPose = 'front' | 'waving' | 'gesturing' | 'thumbs-up' | 'thinking'

const POSE_IMAGE: Record<PipPose, string> = {
  front: pipFront,
  waving: pipWaving,
  gesturing: pipGesturing,
  'thumbs-up': pipThumbsUp,
  thinking: pipThinking,
}

interface PipAvatarProps {
  /** Width in pixels — height follows automatically from the image's own proportions, so there's no letterboxing. */
  size?: number
  /** Which pose to show. Defaults to standing, facing forward. */
  pose?: PipPose
  className?: string
  /** Merged in after width/height, so a caller can add things like a negative margin without fighting the size styles. */
  style?: CSSProperties
}

/** Pip, transparent background, in one of his poses. */
export function PipAvatar({ size = 96, pose = 'front', className, style }: PipAvatarProps) {
  return (
    <img
      src={POSE_IMAGE[pose]}
      alt="Pip, your gardening companion"
      className={cn(className)}
      style={{ width: size, height: 'auto', ...style }}
    />
  )
}

interface PipSittingProps {
  /** Width in pixels of the whole frame; height follows from its proportions. */
  size?: number
  /** One hand raised, mouth open as if talking. Otherwise both hands rest on the edge. */
  gesturing?: boolean
  className?: string
  style?: CSSProperties
}

/**
 * Pip sitting on an edge, boots hanging over it, in the frame described in
 * pipSittingFrame.ts. Kept apart from PipPose because that frame is a different
 * shape from the standing poses. Sources: Graphics/Pip Cut-outs/ (2 October
 * 2026); the gesturing one is mirrored so his open hand is on the left.
 */
export function PipSitting({ size = 110, gesturing = false, className, style }: PipSittingProps) {
  return (
    <img
      src={gesturing ? pipSittingGesturing : pipSitting}
      alt="Pip, your gardening companion"
      className={cn(className)}
      style={{ width: size, height: 'auto', ...style }}
    />
  )
}

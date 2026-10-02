import { supabase } from './supabase'
import type { Clear, Confidence, FeedbackKind, Followed, Obstacle, Topic, Went } from '@/data/feedbackForm'
import type { SavedRoseType } from './types'

/** What the gardener answered after a session. Only `went` is needed. */
export interface SessionFeedback {
  kind: Exclude<FeedbackKind, 'general'>
  roseType?: SavedRoseType
  went: Went
  clear?: Clear
  followed?: Followed
  obstacles: Obstacle[]
  confidence?: Confidence
  comment: string
  mayContact?: boolean
}

/** What the gardener wrote in the menu's form. */
export interface GeneralFeedback {
  kind: 'general'
  topic: Topic
  comment: string
  mayContact?: boolean
}

export type FeedbackResult = 'sent' | 'too-many' | 'failed'

/**
 * Sends feedback to the Founders through app_send_feedback (schema.sql, "Beta feedback").
 * The database adds the gardener's email address from their account; the app never sends it.
 * It reaches the Garden Shed's "Beta feedback" tool. Nothing here is sent to Pip.
 */
export async function sendFeedback(feedback: SessionFeedback | GeneralFeedback): Promise<FeedbackResult> {
  const comment = feedback.comment.trim()
  const args =
    feedback.kind === 'general'
      ? { p_kind: feedback.kind, p_topic: feedback.topic, p_comment: comment, p_may_contact: feedback.mayContact ?? null }
      : {
          p_kind: feedback.kind,
          p_rose_type: feedback.roseType ?? null,
          p_went: feedback.went,
          p_clear: feedback.clear ?? null,
          p_followed: feedback.followed ?? null,
          p_obstacles: feedback.obstacles,
          p_confidence: feedback.confidence ?? null,
          p_comment: comment || null,
          p_may_contact: feedback.mayContact ?? null,
        }
  try {
    const { data, error } = await supabase.rpc('app_send_feedback', args)
    if (error) {
      console.warn('feedback not sent:', error.message)
      return 'failed'
    }
    if (data?.ok === true) return 'sent'
    console.warn('feedback refused:', data?.reason)
    return data?.reason === 'too-many' ? 'too-many' : 'failed'
  } catch (err) {
    console.warn('feedback not sent:', err)
    return 'failed'
  }
}

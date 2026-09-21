import { supabase } from './supabase'

export type MembershipTier = 'free' | 'paid'

export interface MemberProfile {
  membershipTier: MembershipTier
  hasPassword: boolean
}

/**
 * Reads the signed-in gardener's own member_profiles row (see
 * supabase/schema.sql). RLS allows a gardener to select only their own row,
 * and the row is guaranteed to exist — a database trigger creates it the
 * moment the auth.users row is created, for every sign-in method.
 *
 * Returns null on any failure (network, or the vanishingly unlikely case of
 * the row not existing yet) rather than throwing — every call site treats
 * "don't know yet" the same safe way it treats "definitely free": it never
 * unlocks anything paid-only, and it never blocks the free flow that's live
 * today. There is no paid-only feature yet for this to gate.
 */
export async function getOwnMemberProfile(userId: string): Promise<MemberProfile | null> {
  const { data, error } = await supabase
    .from('member_profiles')
    .select('membership_tier, has_password')
    .eq('user_id', userId)
    .single()

  if (error || !data) return null
  return {
    membershipTier: data.membership_tier as MembershipTier,
    hasPassword: Boolean(data.has_password),
  }
}

/**
 * Records that the signed-in gardener just set a password (see AuthGate.tsx
 * SetPassword step), via the mark_password_set() RPC — see schema.sql for
 * why this is an RPC and not a direct table update: member_profiles has no
 * client update policy at all, on purpose, so that membership_tier can
 * never be edited by the gardener's own client either.
 */
export async function markPasswordSet(): Promise<void> {
  await supabase.rpc('mark_password_set')
}

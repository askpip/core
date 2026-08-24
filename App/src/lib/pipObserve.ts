import { supabase } from './supabase'

/**
 * Calls Pip's live dead-wood observation (Edge Function
 * `pip-observe-dead-wood`) — the only observation with real, Founder-
 * approved per-signal diagnostic content behind it (PKR-OBS-000001,
 * Published 24 August 2026). Sends the gardener's own photo (already in
 * their private Storage — this passes the storage path, not the file
 * itself) and returns Pip's answer, grounded only in that content.
 *
 * Mirrors the standalone validated spike at Spike/gemini/run-spike-signals.mjs.
 *
 * Throws on any failure. Callers should catch and fall back to the static
 * scripted text (see Journey.tsx's 'observe' phase) — this must never block
 * the journey.
 */
export async function askPipAboutDeadWood(photoPath: string, question?: string): Promise<string> {
  const { data, error } = await supabase.functions.invoke<{ answer?: string; error?: string }>(
    'pip-observe-dead-wood',
    { body: { photoPath, question } },
  )
  if (error) throw error
  if (!data?.answer) throw new Error(data?.error || 'No answer returned')
  return data.answer
}

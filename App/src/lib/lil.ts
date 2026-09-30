import { supabase } from './supabase'
import type { LilRecord } from '@/data/pkr'

const PAGE = 1000

/**
 * Reads every Published record from the Live Intelligence Library
 * (public.lil_pkr). Row Level Security only ever returns Published rows to
 * the app, and the app cannot write to the LIL. Pages through the table so it
 * keeps working as the library grows; when it grows large enough that loading
 * everything at start-up is wasteful, narrow this by plant scope or record
 * type rather than removing the Published filter.
 */
export async function fetchPublishedLil(): Promise<{ data: LilRecord[] | null; error: unknown }> {
  const all: LilRecord[] = []
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from('lil_pkr')
      .select('pkr_id, version, pkr_type, title, common, content')
      .eq('status', 'Published')
      .order('pkr_id')
      .range(from, from + PAGE - 1)
    if (error) return { data: null, error }
    all.push(...((data ?? []) as LilRecord[]))
    if (!data || data.length < PAGE) break
  }
  return { data: all, error: null }
}

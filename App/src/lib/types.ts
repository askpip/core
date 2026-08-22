export type ObservationOutcome = 'confirmed' | 'corrected' | 'unresolved'
export type Choice = 'cut' | 'leave' | 'decide-later' | 'get-help'

export interface ObservationRecord {
  id: string
  feature: string
  pipProposal: string
  comparisonNote: string
  outcome: ObservationOutcome
  correction?: string
  choice?: Choice
}

export interface PlantProject {
  id: string
  name: string
  variety: string
  varietySource: string
  location: string
  personalMeaning?: string
  createdAt: string
  observations: ObservationRecord[]
  journeyComplete: boolean
}

/**
 * Row shapes as they exist in Supabase (public.bush_rose_profiles /
 * public.observations — see supabase/schema.sql). Kept separate from the
 * app-facing types above so page components never need to know about the
 * database's column-naming conventions.
 */
export interface BushRoseProfileRow {
  id: string
  user_id: string
  name: string
  variety: string
  variety_source: string
  location: string
  personal_meaning: string | null
  journey_complete: boolean
  created_at: string
}

export interface ObservationRow {
  id: string
  profile_id: string
  user_id: string
  feature: string
  pip_proposal: string
  comparison_note: string
  outcome: ObservationOutcome
  correction: string | null
  choice: Choice | null
  created_at: string
}

export type ObservationOutcome = 'confirmed' | 'corrected' | 'unresolved'
export type Choice = 'cut' | 'leave' | 'decide-later' | 'get-help'

/** How a plant's location was captured — see src/lib/location.ts. */
export type LocationMethod = 'geolocation' | 'manual'
export type Hemisphere = 'northern' | 'southern'

/** One row of the pre-journey safety checklist, as it stood when the gardener continued past it. */
export interface SafetyChecklistEntry {
  label: string
  checked: boolean
}

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
  /**
   * Human-readable summary shown throughout the app ("Portland, Oregon,
   * USA", or "Current location" for a GPS-only entry). Always set — this is
   * what every existing display site reads. The fields below capture how it
   * was gathered and what was actually derivable from it; nothing outside
   * NewPlant.tsx and store.ts needs to know about those.
   */
  location: string
  /** How `location` was captured. Absent on rows created before this existed. */
  locationMethod?: LocationMethod
  /** Set only when locationMethod === 'manual'. */
  locationCity?: string
  locationRegion?: string
  locationCountry?: string
  /** Set only when locationMethod === 'geolocation'. */
  latitude?: number
  longitude?: number
  /**
   * Derived once, at save time, from whichever method was used (latitude's
   * sign for geolocation; a static country lookup for manual entry — see
   * src/lib/location.ts). Left unset rather than guessed when it can't be
   * determined confidently: an unrecognized manual country, or one that
   * straddles the equator, where hemisphere isn't a single safe answer.
   * This is what lets Pip state the current season without asking for it
   * directly — see PlantProject.tsx.
   */
  hemisphere?: Hemisphere
  /**
   * Free-text planting context, as the gardener describes it ("about 3 years
   * ago", "spring 2024", "not sure") — matches Architecture §6.1's "planting
   * context" profile field. Deliberately not a date picker: the recently
   * planted Suitability Gate (PKR-SGT-000002) only needs roughly-3-years-or-
   * more vs. less vs. unknown, not a precise date, and a free-text answer is
   * one fewer point of friction for a beginner gardener who often won't know
   * an exact date anyway.
   *
   * This value is shown back to the gardener as a reminder in Journey.tsx's
   * 'planted-primary' phase, but it is never parsed to silently decide the
   * gate's outcome — the gate always asks its own structured question
   * (see src/lib/suitabilityGates.ts) rather than guessing from free text.
   */
  plantedWhen?: string
  personalMeaning?: string
  /**
   * A record of what Journey.tsx's pre-journey safety checklist actually
   * looked like when the gardener continued past it — not a gate.
   * Continuing no longer requires every box checked (no cutting decision
   * has been made yet at that point in the journey; that happens later, per
   * observation), so this exists purely so there's an honest record that
   * the checklist — including the tool condition, protective gear and
   * safe-access items — was actually shown, and what the gardener said
   * about each one, even if they proceeded with something left unchecked.
   */
  safetyChecklist?: SafetyChecklistEntry[]
  /** When the gardener continued past the safety checklist (see safetyChecklist above). Absent if they haven't reached it yet. */
  safetyAcknowledgedAt?: string
  /**
   * Storage path (not a URL — the bucket is private, so a display URL is
   * always fetched fresh as a time-limited signed URL, see
   * src/lib/photos.ts) for the plant's cover photo — set (optionally) from
   * NewPlant.tsx's onboarding questionnaire, shown everywhere this plant's
   * thumbnail appears (Library.tsx, this plant's own hero card).
   *
   * Deliberately NOT read by Journey.tsx's 'photos' phase — see
   * journeyOverviewPhotoPath below for why a pruning journey needs its own,
   * separately-captured photos rather than reusing this one.
   */
  overviewPhotoPath?: string
  /**
   * Free text for anything on a nursery label worth keeping beyond the
   * variety name itself — a label often carries more than that (a plant
   * code, breeder, care notes), so this is its own question/field in
   * NewPlant.tsx ("Is there a nursery label?"), separate from `variety`.
   * See varietyLabelPhotoPath below for the accompanying photo option.
   */
  varietyLabelNote?: string
  /**
   * A photo of the nursery tag/label itself — offered alongside
   * varietyLabelNote above as an alternative (or companion) to typing it
   * out, since a gardener often has the physical label in hand but isn't
   * confident reading or spelling everything on it, and a photo captures
   * it exactly. Purely a reference photo: nothing reads it back to
   * auto-fill any other field.
   */
  varietyLabelPhotoPath?: string
  /**
   * Journey.tsx's 'photos' phase overview shot, required before an
   * observation session — always a fresh take/upload for that journey, never
   * pre-filled from overviewPhotoPath above. A pruning journey can start
   * years after a plant was added (that's the whole point of the
   * recently-planted suitability gate — see suitabilityGates.ts), so by then
   * the plant may look nothing like its onboarding cover photo; Pip needs a
   * genuinely current photo to help assess it, and a gardener shouldn't be
   * able to click past this step on the strength of an old one.
   */
  journeyOverviewPhotoPath?: string
  /**
   * The same journey's close-up shots — a gallery, not one fixed slot like
   * journeyOverviewPhotoPath above, since the phase's prompt asks for "a few
   * close-ups of where stems cross or look uncertain": a single slot let a
   * gardener take one and then had nowhere for the rest to go. At least one
   * is required to continue; there's no upper limit. See
   * src/components/JourneyCloseUps.tsx.
   */
  journeyCloseUpPhotoPaths: string[]
  createdAt: string
  observations: ObservationRecord[]
  /**
   * An open-ended growth record — unlike overviewPhotoPath/
   * journeyOverviewPhotoPath (one fixed slot each) or
   * journeyCloseUpPhotoPaths (a gallery, but scoped to one journey),
   * a gardener can add any number of these at any time, from this plant's
   * own page, not only during a guided journey. Added so a plant that isn't
   * ready to prune yet — and so may never reach Journey.tsx's 'photos'
   * phase — still has somewhere to build up a photo record as it grows. See
   * src/components/ProgressPhotos.tsx and plant_photo_log in schema.sql.
   */
  progressPhotos: ProgressPhoto[]
  /**
   * A free-text journal, open-ended like progressPhotos above but text
   * instead of photos — anything the gardener wants to jot down about this
   * plant, any time, not tied to a guided journey's structured observations
   * ("the aphids are back," "moved it to more shade for summer"). Backed by
   * public.follow_ups, which already existed in the schema (Architecture
   * §6.4's "Follow-Up") but wasn't wired into the app until this feature —
   * see src/components/PlantNotes.tsx.
   */
  notes: FollowUpNote[]
  journeyComplete: boolean
}

/** One entry in a plant's progress-photo log — see PlantProject.progressPhotos above. */
export interface ProgressPhoto {
  id: string
  /** Storage path, not a URL — same reasoning as overviewPhotoPath, see above. */
  path: string
  caption?: string
  createdAt: string
}

/** One free-text journal entry — see PlantProject.notes above. */
export interface FollowUpNote {
  id: string
  note: string
  createdAt: string
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
  location_method: LocationMethod | null
  location_city: string | null
  location_region: string | null
  location_country: string | null
  latitude: number | null
  longitude: number | null
  hemisphere: Hemisphere | null
  planted_when: string | null
  personal_meaning: string | null
  safety_checklist: SafetyChecklistEntry[] | null
  safety_acknowledged_at: string | null
  overview_photo_path: string | null
  variety_label_note: string | null
  variety_label_photo_path: string | null
  journey_overview_photo_path: string | null
  journey_close_up_photo_paths: string[]
  journey_complete: boolean
  created_at: string
}

/** Row shape for public.plant_photo_log — see ProgressPhoto above. */
export interface PlantPhotoLogRow {
  id: string
  profile_id: string
  user_id: string
  storage_path: string
  caption: string | null
  created_at: string
}

/** Row shape for public.follow_ups — see FollowUpNote above. */
export interface FollowUpRow {
  id: string
  profile_id: string
  user_id: string
  note: string
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

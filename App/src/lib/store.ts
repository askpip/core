import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import { journeyCloseUpPhotoPath, progressPhotoPath, removePlantPhoto, uploadPlantPhoto } from './photos'
import type {
  BushRoseProfileRow,
  FollowUpNote,
  FollowUpRow,
  ObservationRecord,
  ObservationRow,
  PlantPhotoLogRow,
  PlantProject,
  ProgressPhoto,
} from './types'

function toPlantProject(
  row: BushRoseProfileRow,
  observationRows: ObservationRow[],
  photoRows: PlantPhotoLogRow[],
  noteRows: FollowUpRow[],
): PlantProject {
  return {
    id: row.id,
    name: row.name,
    variety: row.variety,
    varietySource: row.variety_source,
    location: row.location,
    locationMethod: row.location_method ?? undefined,
    locationCity: row.location_city ?? undefined,
    locationRegion: row.location_region ?? undefined,
    locationCountry: row.location_country ?? undefined,
    latitude: row.latitude ?? undefined,
    longitude: row.longitude ?? undefined,
    hemisphere: row.hemisphere ?? undefined,
    plantedWhen: row.planted_when ?? undefined,
    personalMeaning: row.personal_meaning ?? undefined,
    safetyChecklist: row.safety_checklist ?? undefined,
    safetyAcknowledgedAt: row.safety_acknowledged_at ?? undefined,
    overviewPhotoPath: row.overview_photo_path ?? undefined,
    varietyLabelNote: row.variety_label_note ?? undefined,
    varietyLabelPhotoPath: row.variety_label_photo_path ?? undefined,
    journeyOverviewPhotoPath: row.journey_overview_photo_path ?? undefined,
    journeyCloseUpPhotoPaths: row.journey_close_up_photo_paths ?? [],
    createdAt: row.created_at,
    progressPhotos: photoRows.map((p) => ({
      id: p.id,
      path: p.storage_path,
      caption: p.caption ?? undefined,
      createdAt: p.created_at,
    })),
    notes: noteRows.map((n) => ({
      id: n.id,
      note: n.note,
      createdAt: n.created_at,
    })),
    journeyComplete: row.journey_complete,
    observations: observationRows.map((o) => ({
      id: o.id,
      feature: o.feature,
      pipProposal: o.pip_proposal,
      comparisonNote: o.comparison_note,
      outcome: o.outcome,
      correction: o.correction ?? undefined,
      choice: o.choice ?? undefined,
    })),
  }
}

/**
 * Supabase-backed project store. Every gardener only ever sees their own
 * plants — enforced both here (queries are implicitly scoped to the signed-in
 * user) and at the database layer (Row Level Security, see supabase/schema.sql).
 *
 * Writes update local state immediately (so the UI stays as responsive as the
 * old localStorage version) and then persist in the background; a failed
 * write is logged rather than surfaced, since none of the calling pages
 * currently handle a rejected write. Keeps the same return shape as the
 * original hook — { projects, addProject, updateProject, getProject,
 * deleteProject } — plus an additive `loading` flag pages can opt into.
 */
export function useProjects() {
  const [projects, setProjects] = useState<PlantProject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function load() {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        if (active) {
          setProjects([])
          setLoading(false)
        }
        return
      }

      const [
        { data: profileRows, error: profileError },
        { data: observationRows, error: observationError },
        { data: photoRows, error: photoError },
        { data: noteRows, error: noteError },
      ] = await Promise.all([
        supabase.from('bush_rose_profiles').select('*').order('created_at', { ascending: true }),
        supabase.from('observations').select('*').order('created_at', { ascending: true }),
        supabase.from('plant_photo_log').select('*').order('created_at', { ascending: true }),
        supabase.from('follow_ups').select('*').order('created_at', { ascending: true }),
      ])

      if (!active) return

      if (profileError) {
        console.error('Failed to load plants:', profileError)
        setLoading(false)
        return
      }
      if (observationError) {
        console.error('Failed to load observations:', observationError)
      }
      if (photoError) {
        console.error('Failed to load progress photos:', photoError)
      }
      if (noteError) {
        console.error('Failed to load notes:', noteError)
      }

      const observationsByProfile = new Map<string, ObservationRow[]>()
      for (const row of observationRows ?? []) {
        const list = observationsByProfile.get(row.profile_id) ?? []
        list.push(row)
        observationsByProfile.set(row.profile_id, list)
      }

      const photosByProfile = new Map<string, PlantPhotoLogRow[]>()
      for (const row of photoRows ?? []) {
        const list = photosByProfile.get(row.profile_id) ?? []
        list.push(row)
        photosByProfile.set(row.profile_id, list)
      }

      const notesByProfile = new Map<string, FollowUpRow[]>()
      for (const row of noteRows ?? []) {
        const list = notesByProfile.get(row.profile_id) ?? []
        list.push(row)
        notesByProfile.set(row.profile_id, list)
      }

      setProjects(
        (profileRows ?? []).map((row) =>
          toPlantProject(
            row,
            observationsByProfile.get(row.id) ?? [],
            photosByProfile.get(row.id) ?? [],
            notesByProfile.get(row.id) ?? [],
          ),
        ),
      )
      setLoading(false)
    }

    load()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      load()
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  async function addProject(project: PlantProject) {
    setProjects((prev) => [...prev, project])

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase.from('bush_rose_profiles').insert({
      id: project.id,
      user_id: user.id,
      name: project.name,
      variety: project.variety,
      variety_source: project.varietySource,
      location: project.location,
      location_method: project.locationMethod ?? null,
      location_city: project.locationCity ?? null,
      location_region: project.locationRegion ?? null,
      location_country: project.locationCountry ?? null,
      latitude: project.latitude ?? null,
      longitude: project.longitude ?? null,
      hemisphere: project.hemisphere ?? null,
      planted_when: project.plantedWhen ?? null,
      personal_meaning: project.personalMeaning ?? null,
      safety_checklist: project.safetyChecklist ?? null,
      safety_acknowledged_at: project.safetyAcknowledgedAt ?? null,
      overview_photo_path: project.overviewPhotoPath ?? null,
      variety_label_note: project.varietyLabelNote ?? null,
      variety_label_photo_path: project.varietyLabelPhotoPath ?? null,
      journey_overview_photo_path: project.journeyOverviewPhotoPath ?? null,
      journey_close_up_photo_paths: project.journeyCloseUpPhotoPaths ?? [],
      journey_complete: project.journeyComplete,
      created_at: project.createdAt,
    })
    if (error) console.error('Failed to save plant:', error)
  }

  async function updateProject(id: string, patch: Partial<PlantProject>) {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)))

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    // 'key' in patch, not patch.key !== undefined: a caller clearing a field
    // (PhotoUpload's remove button does this — see the photo fields below)
    // passes it as `{ overviewPhotoPath: undefined }`, which is a real,
    // present key meant to null the column out. `!== undefined` can't tell
    // that apart from the key being absent entirely, so it silently drops
    // the write — `in` checks presence itself, regardless of the value.
    const profilePatch: Partial<BushRoseProfileRow> = {}
    if ('name' in patch) profilePatch.name = patch.name
    if ('variety' in patch) profilePatch.variety = patch.variety
    if ('varietySource' in patch) profilePatch.variety_source = patch.varietySource
    if ('location' in patch) profilePatch.location = patch.location
    if ('locationMethod' in patch) profilePatch.location_method = patch.locationMethod ?? null
    if ('locationCity' in patch) profilePatch.location_city = patch.locationCity ?? null
    if ('locationRegion' in patch) profilePatch.location_region = patch.locationRegion ?? null
    if ('locationCountry' in patch) profilePatch.location_country = patch.locationCountry ?? null
    if ('latitude' in patch) profilePatch.latitude = patch.latitude ?? null
    if ('longitude' in patch) profilePatch.longitude = patch.longitude ?? null
    if ('hemisphere' in patch) profilePatch.hemisphere = patch.hemisphere ?? null
    if ('plantedWhen' in patch) profilePatch.planted_when = patch.plantedWhen ?? null
    if ('personalMeaning' in patch) profilePatch.personal_meaning = patch.personalMeaning ?? null
    if ('safetyChecklist' in patch) profilePatch.safety_checklist = patch.safetyChecklist ?? null
    if ('safetyAcknowledgedAt' in patch) profilePatch.safety_acknowledged_at = patch.safetyAcknowledgedAt ?? null
    if ('overviewPhotoPath' in patch) profilePatch.overview_photo_path = patch.overviewPhotoPath ?? null
    if ('varietyLabelNote' in patch) profilePatch.variety_label_note = patch.varietyLabelNote ?? null
    if ('varietyLabelPhotoPath' in patch)
      profilePatch.variety_label_photo_path = patch.varietyLabelPhotoPath ?? null
    if ('journeyOverviewPhotoPath' in patch)
      profilePatch.journey_overview_photo_path = patch.journeyOverviewPhotoPath ?? null
    // journeyCloseUpPhotoPaths has its own add/remove functions below
    // (addJourneyCloseUpPhoto/removeJourneyCloseUpPhoto) rather than going
    // through this generic patch path — appending to or filtering an array
    // needs the current array as a starting point, which a plain patch
    // object can't safely provide (the caller's copy could be stale).
    if ('journeyComplete' in patch) profilePatch.journey_complete = patch.journeyComplete

    if (Object.keys(profilePatch).length > 0) {
      const { error } = await supabase.from('bush_rose_profiles').update(profilePatch).eq('id', id)
      if (error) console.error('Failed to update plant:', error)
    }

    if (patch.observations !== undefined) {
      const { error: deleteError } = await supabase.from('observations').delete().eq('profile_id', id)
      if (deleteError) console.error('Failed to replace observations:', deleteError)

      if (patch.observations.length > 0) {
        // Row ids are database-generated on insert rather than reusing the
        // ObservationRecord.id from the scripted journey (those ids are
        // fixed strings like "dead-wood" shared across every plant, so they
        // can't double as a global primary key). The returned rows' ids
        // become the new ObservationRecord.id on the next load.
        const rows = patch.observations.map((o) => ({
          profile_id: id,
          user_id: user.id,
          feature: o.feature,
          pip_proposal: o.pipProposal,
          comparison_note: o.comparisonNote,
          outcome: o.outcome,
          correction: o.correction ?? null,
          choice: o.choice ?? null,
        }))
        const { error: insertError } = await supabase.from('observations').insert(rows)
        if (insertError) console.error('Failed to save observations:', insertError)
      }
    }
  }

  /**
   * Saves a single completed observation immediately, rather than waiting
   * for the whole journey to finish. Without this, a gardener who works
   * through a couple of observations and then closes the app partway
   * through — before ever reaching "Save to journal" — would lose that
   * progress entirely, since it only ever existed in the Journey page's own
   * component state. Call this as soon as each observation is complete
   * (outcome recorded and a choice made), not at the end.
   *
   * Known limitation: re-running an already-completed journey from scratch
   * would append duplicate rows rather than replacing the old ones, since
   * there's no natural unique key per (plant, feature) in the schema yet.
   * Not reachable from the current UI (there's no "redo journey" entry
   * point once a plant's journeyComplete), so left as-is for now.
   */
  async function addObservation(profileId: string, observation: ObservationRecord) {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === profileId ? { ...p, observations: [...p.observations, observation] } : p,
      ),
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase.from('observations').insert({
      profile_id: profileId,
      user_id: user.id,
      feature: observation.feature,
      pip_proposal: observation.pipProposal,
      comparison_note: observation.comparisonNote,
      outcome: observation.outcome,
      correction: observation.correction ?? null,
      choice: observation.choice ?? null,
    })
    if (error) console.error('Failed to save observation:', error)
  }

  /**
   * Adds one photo to a plant's open-ended progress log — separate from
   * overviewPhotoPath/journeyOverviewPhotoPath/journeyCloseUpPhotoPaths, and
   * callable at any time from the plant's own page (see PlantProject.tsx /
   * ProgressPhotos.tsx), not only from a guided journey.
   *
   * Unlike most writes here, this throws on failure instead of just
   * logging: the calling UI shows its own "didn't save" message right where
   * the gardener tapped Add, so it needs to know the write actually failed
   * rather than assume it succeeded.
   */
  async function addProgressPhoto(profileId: string, file: File, caption?: string) {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Not signed in')

    const photoId = crypto.randomUUID()
    const path = progressPhotoPath(user.id, profileId, photoId)
    await uploadPlantPhoto(path, file)

    const createdAt = new Date().toISOString()
    const { error } = await supabase.from('plant_photo_log').insert({
      id: photoId,
      profile_id: profileId,
      user_id: user.id,
      storage_path: path,
      caption: caption ?? null,
      created_at: createdAt,
    })
    // The file is already in storage at this point even if this insert
    // fails — throwing here (rather than logging and continuing, as most of
    // this file does) means the gardener finds out rather than believing an
    // orphaned upload succeeded.
    if (error) throw error

    const photo: ProgressPhoto = { id: photoId, path, caption, createdAt }
    setProjects((prev) =>
      prev.map((p) => (p.id === profileId ? { ...p, progressPhotos: [...p.progressPhotos, photo] } : p)),
    )
    return photo
  }

  /**
   * Removes one progress photo. Storage deletion goes through the Storage
   * API (inside removePlantPhoto) rather than raw SQL — Supabase blocks a
   * direct DELETE against storage.objects with its own protect_delete
   * trigger.
   */
  async function deleteProgressPhoto(profileId: string, photoId: string, path: string) {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === profileId
          ? { ...p, progressPhotos: p.progressPhotos.filter((photo) => photo.id !== photoId) }
          : p,
      ),
    )

    try {
      await removePlantPhoto(path)
    } catch (err) {
      console.error('Failed to delete progress photo from storage:', err)
    }

    const { error } = await supabase.from('plant_photo_log').delete().eq('id', photoId)
    if (error) console.error('Failed to delete progress photo record:', error)
  }

  /**
   * Adds one free-text entry to a plant's open-ended notes journal (see
   * PlantProject.notes / PlantNotes.tsx) — callable any time from the
   * plant's own page, same spirit as addProgressPhoto above but text
   * instead of a file, and backed by the pre-existing (previously unused)
   * follow_ups table rather than a new one.
   *
   * Throws on failure, same reasoning as addProgressPhoto: the calling UI
   * shows its own "didn't save" message right where the gardener typed it,
   * rather than silently losing what they wrote.
   */
  async function addNote(profileId: string, text: string) {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Not signed in')

    const id = crypto.randomUUID()
    const createdAt = new Date().toISOString()
    const { error } = await supabase.from('follow_ups').insert({
      id,
      profile_id: profileId,
      user_id: user.id,
      note: text,
      created_at: createdAt,
    })
    if (error) throw error

    const note: FollowUpNote = { id, note: text, createdAt }
    setProjects((prev) =>
      prev.map((p) => (p.id === profileId ? { ...p, notes: [...p.notes, note] } : p)),
    )
    return note
  }

  /** Removes one note. */
  async function deleteNote(profileId: string, noteId: string) {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === profileId ? { ...p, notes: p.notes.filter((n) => n.id !== noteId) } : p,
      ),
    )

    const { error } = await supabase.from('follow_ups').delete().eq('id', noteId)
    if (error) console.error('Failed to delete note:', error)
  }

  /**
   * Adds one photo to this journey's close-up gallery
   * (journeyCloseUpPhotoPaths) — Journey.tsx's 'photos' phase asks for "a
   * few close-ups," not one, so unlike journeyOverviewPhotoPath this isn't a
   * single overwritable slot. currentPaths is the caller's own copy of
   * journeyCloseUpPhotoPaths (Journey.tsx already has it from the project it
   * just rendered) — building the new array from that, rather than from
   * whatever's in this hook's own `projects` state, means the array can't go
   * stale if this fires more than once in quick succession before either
   * write lands.
   *
   * Throws on failure, same as addProgressPhoto above and for the same
   * reason: the calling UI shows its own error right where the gardener
   * tapped Add.
   */
  async function addJourneyCloseUpPhoto(profileId: string, currentPaths: string[], file: File) {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Not signed in')

    const photoId = crypto.randomUUID()
    const path = journeyCloseUpPhotoPath(user.id, profileId, photoId)
    await uploadPlantPhoto(path, file)

    const nextPaths = [...currentPaths, path]
    const { error } = await supabase
      .from('bush_rose_profiles')
      .update({ journey_close_up_photo_paths: nextPaths })
      .eq('id', profileId)
    // Same reasoning as addProgressPhoto: the file's already uploaded, so a
    // failure here needs to reach the gardener rather than be swallowed.
    if (error) throw error

    setProjects((prev) =>
      prev.map((p) => (p.id === profileId ? { ...p, journeyCloseUpPhotoPaths: nextPaths } : p)),
    )
    return path
  }

  /** Removes one photo from this journey's close-up gallery — see addJourneyCloseUpPhoto above. */
  async function removeJourneyCloseUpPhoto(profileId: string, currentPaths: string[], path: string) {
    const nextPaths = currentPaths.filter((p) => p !== path)
    setProjects((prev) =>
      prev.map((p) => (p.id === profileId ? { ...p, journeyCloseUpPhotoPaths: nextPaths } : p)),
    )

    try {
      await removePlantPhoto(path)
    } catch (err) {
      console.error('Failed to delete journey close-up photo from storage:', err)
    }

    const { error } = await supabase
      .from('bush_rose_profiles')
      .update({ journey_close_up_photo_paths: nextPaths })
      .eq('id', profileId)
    if (error) console.error('Failed to update journey close-up photos:', error)
  }

  function getProject(id: string) {
    return projects.find((p) => p.id === id)
  }

  async function deleteProject(id: string) {
    setProjects((prev) => prev.filter((p) => p.id !== id))
    const { error } = await supabase.from('bush_rose_profiles').delete().eq('id', id)
    if (error) console.error('Failed to delete plant:', error)
  }

  return {
    projects,
    addProject,
    updateProject,
    addObservation,
    addProgressPhoto,
    deleteProgressPhoto,
    addNote,
    deleteNote,
    addJourneyCloseUpPhoto,
    removeJourneyCloseUpPhoto,
    getProject,
    deleteProject,
    loading,
  }
}

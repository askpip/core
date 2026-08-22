import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import type { BushRoseProfileRow, ObservationRecord, ObservationRow, PlantProject } from './types'

function toPlantProject(row: BushRoseProfileRow, observationRows: ObservationRow[]): PlantProject {
  return {
    id: row.id,
    name: row.name,
    variety: row.variety,
    varietySource: row.variety_source,
    location: row.location,
    personalMeaning: row.personal_meaning ?? undefined,
    createdAt: row.created_at,
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

      const [{ data: profileRows, error: profileError }, { data: observationRows, error: observationError }] =
        await Promise.all([
          supabase.from('bush_rose_profiles').select('*').order('created_at', { ascending: true }),
          supabase.from('observations').select('*').order('created_at', { ascending: true }),
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

      const observationsByProfile = new Map<string, ObservationRow[]>()
      for (const row of observationRows ?? []) {
        const list = observationsByProfile.get(row.profile_id) ?? []
        list.push(row)
        observationsByProfile.set(row.profile_id, list)
      }

      setProjects(
        (profileRows ?? []).map((row) => toPlantProject(row, observationsByProfile.get(row.id) ?? [])),
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
      personal_meaning: project.personalMeaning ?? null,
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

    const profilePatch: Partial<BushRoseProfileRow> = {}
    if (patch.name !== undefined) profilePatch.name = patch.name
    if (patch.variety !== undefined) profilePatch.variety = patch.variety
    if (patch.varietySource !== undefined) profilePatch.variety_source = patch.varietySource
    if (patch.location !== undefined) profilePatch.location = patch.location
    if (patch.personalMeaning !== undefined) profilePatch.personal_meaning = patch.personalMeaning ?? null
    if (patch.journeyComplete !== undefined) profilePatch.journey_complete = patch.journeyComplete

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

  function getProject(id: string) {
    return projects.find((p) => p.id === id)
  }

  async function deleteProject(id: string) {
    setProjects((prev) => prev.filter((p) => p.id !== id))
    const { error } = await supabase.from('bush_rose_profiles').delete().eq('id', id)
    if (error) console.error('Failed to delete plant:', error)
  }

  return { projects, addProject, updateProject, addObservation, getProject, deleteProject, loading }
}

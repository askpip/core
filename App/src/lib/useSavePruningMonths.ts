import { useEffect } from 'react'
import { roseTypePasses } from '@/data/pkr'
import { pruningMonths } from './helpMeWith'
import type { PlantPlace } from './place'
import type { PlantProject } from './types'

/**
 * Keeps each rose's saved pruning months (PlantProject.pruningMonths) in step with
 * where it grows, so the pruning-time email job reads only month numbers and never
 * a place (APP-REMINDERS-AND-PLACE proposal §4). A rose whose type doesn't pass, or
 * whose place isn't known yet, is saved with none. Writes only when they differ.
 */
export function useSavePruningMonths(
  projects: PlantProject[],
  places: Map<string, PlantPlace>,
  save: (id: string, months: number[]) => void,
) {
  useEffect(() => {
    for (const p of projects) {
      const place = places.get(p.id)
      // A GPS rose whose region outlines haven't loaded yet looks placeless; wait rather than clear it.
      if (!place || (place.codes.length === 0 && p.latitude !== undefined && !place.ask)) continue
      const months = roseTypePasses(p.roseType) ? [...pruningMonths(place.codes)].sort((a, b) => a - b) : []
      const saved = p.pruningMonths ?? null
      if (saved && saved.length === months.length && saved.every((m, i) => m === months[i])) continue
      save(p.id, months)
    }
  }, [projects, places, save])
}

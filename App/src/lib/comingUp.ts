/**
 * "Coming up" on the home screen (APP-REMINDERS-AND-PLACE proposal, approved by a
 * Founder in chat, 18 October 2026, section 2). Which roses are in, or about to
 * reach, their place's pruning months (lib/helpMeWith.ts `pruningMonths`).
 *
 * It says nothing horticultural itself: the card's lines are the approved app
 * wording, and they send the gardener to the pruning journey to check each rose.
 */
import { roseTypePasses } from '@/data/pkr'
import { pruningMonths } from './helpMeWith'
import { countryName, type PlantPlace } from './place'
import type { PlantProject } from './types'

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

/** The name Pip uses for where a rose grows, as in "Spring in Christchurch". */
export function placeName(project: Pick<PlantProject, 'locationCity'>, place: PlantPlace): string | undefined {
  return (
    project.locationCity ||
    place.town?.name ||
    place.region?.name ||
    (place.country ? countryName(place.country) : undefined)
  )
}

export interface ComingUpGroup {
  kind: 'now' | 'soon'
  place: string
  /** For 'soon': the month the pruning months start. */
  month?: string
  roses: { id: string; name: string }[]
}

/** Calendar month after `month` (1 = January). */
const next = (month: number) => (month % 12) + 1

export function comingUp(projects: PlantProject[], places: Map<string, PlantPlace>, date: Date): ComingUpGroup[] {
  const now = date.getMonth() + 1
  const groups = new Map<string, ComingUpGroup>()
  for (const p of projects) {
    if (!roseTypePasses(p.roseType)) continue
    const place = places.get(p.id)
    if (!place || place.codes.length === 0) continue
    const months = pruningMonths(place.codes)
    const name = placeName(p, place)
    if (!name || months.size === 0) continue
    const kind = months.has(now) ? 'now' : months.has(next(now)) ? 'soon' : undefined
    if (!kind) continue
    const key = `${kind}|${name}`
    const group = groups.get(key) ?? { kind, place: name, month: kind === 'soon' ? MONTH_NAMES[next(now) - 1] : undefined, roses: [] }
    group.roses.push({ id: p.id, name: p.name })
    groups.set(key, group)
  }
  // Pruning time now first, then what starts next month.
  return [...groups.values()].sort((a, b) => (a.kind === b.kind ? a.place.localeCompare(b.place) : a.kind === 'now' ? -1 : 1))
}

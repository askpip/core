/**
 * "Coming up" on the home screen (APP-REMINDERS-AND-PLACE proposal, approved by a
 * Founder in chat, 18 October 2026, section 2). Which roses are in, or about to
 * reach, their place's pruning months (lib/helpMeWith.ts `pruningMonths`); and, added
 * at a Founder's direction the same day, a pruning journey left unfinished and the
 * blind-shoot check in spring and summer.
 *
 * It says nothing horticultural itself: the card's lines are app wording, and they
 * send the gardener to the journey or the check, which decide on the actual rose.
 */
import { growingSeasonObservation, roseTypePasses } from '@/data/pkr'
import { seasonForHemisphere } from './location'
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
  /**
   * 'now' / 'soon': pruning months. 'paused': a pruning journey begun and not finished.
   * 'growing': spring or summer, when the blind-shoot check can be done (added at a
   * Founder's direction, 18 October 2026).
   */
  kind: 'now' | 'soon' | 'paused' | 'growing'
  /** Empty for 'paused', which isn't about a place. */
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
  const add = (kind: ComingUpGroup['kind'], place: string, p: PlantProject, month?: string) => {
    const key = `${kind}|${place}`
    const group = groups.get(key) ?? { kind, place, month, roses: [] }
    group.roses.push({ id: p.id, name: p.name })
    groups.set(key, group)
  }
  const blindShoots = Boolean(growingSeasonObservation('blind-shoot'))
  for (const p of projects) {
    if (!roseTypePasses(p.roseType)) continue
    // The journey saves when the gardener passes its safety checklist, and marks the end.
    if (p.safetyAcknowledgedAt && !p.journeyComplete) add('paused', '', p)
    const place = places.get(p.id)
    const season = p.hemisphere ? seasonForHemisphere(p.hemisphere, date) : undefined
    const seasonPlace = place ? placeName(p, place) : undefined
    if (blindShoots && seasonPlace && (season === 'spring' || season === 'summer')) add('growing', seasonPlace, p)
    if (!place || place.codes.length === 0) continue
    const months = pruningMonths(place.codes)
    const name = placeName(p, place)
    if (!name || months.size === 0) continue
    const kind = months.has(now) ? 'now' : months.has(next(now)) ? 'soon' : undefined
    if (kind) add(kind, name, p, kind === 'soon' ? MONTH_NAMES[next(now) - 1] : undefined)
  }
  // A paused journey first, then pruning time now, what starts next month, and the growing-season check.
  const rank = { paused: 0, now: 1, soon: 2, growing: 3 }
  return [...groups.values()].sort((a, b) => rank[a.kind] - rank[b.kind] || a.place.localeCompare(b.place))
}

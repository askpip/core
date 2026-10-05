/**
 * Which country a plant is in, for local information.
 *
 * Pip Knowledge Rules, rule 4: local information is shown only to gardeners in
 * that place. A statement in the Live Intelligence Library can carry `place`,
 * a list of country codes; this works out the plant's code so the app can
 * show or hold back that statement.
 *
 * The place belongs to the plant (a Founder decision, 5 October 2026): it comes
 * from the plant's own saved location, never from the account.
 *
 * Like hemisphere (location.ts), this never guesses. A typed country that isn't
 * recognised, or a GPS position that could be in more than one country, gives
 * undefined, and local statements are then not shown.
 */
import type { PlantProject } from './types'

export type CountryCode = 'NZ' | 'AU' | 'GB' | 'US' | 'CA'

const NAMES: Record<string, CountryCode> = {
  'new zealand': 'NZ', nz: 'NZ', aotearoa: 'NZ', 'aotearoa new zealand': 'NZ',
  australia: 'AU', au: 'AU', aus: 'AU',
  'united kingdom': 'GB', uk: 'GB', 'great britain': 'GB', britain: 'GB', gb: 'GB',
  england: 'GB', scotland: 'GB', wales: 'GB', 'northern ireland': 'GB',
  'united states': 'US', 'united states of america': 'US', usa: 'US', us: 'US', america: 'US',
  canada: 'CA', ca: 'CA',
}

/** From a typed country name. Undefined, never a guess, for anything not listed. */
export function countryCodeFromName(country?: string): CountryCode | undefined {
  if (!country) return undefined
  return NAMES[country.trim().toLowerCase().replace(/\./g, '')]
}

/**
 * From a GPS position, only where the answer is unambiguous. New Zealand and
 * Australia have no land neighbours inside these boxes. The United Kingdom, the
 * United States and Canada share theirs with other countries, so a position
 * there gives undefined until the gardener's country is known another way.
 */
export function countryCodeFromPosition(latitude?: number, longitude?: number): CountryCode | undefined {
  if (latitude === undefined || longitude === undefined) return undefined
  const inBox = (s: number, n: number, w: number, e: number) => latitude >= s && latitude <= n && longitude >= w && longitude <= e
  // North, South and Stewart Islands; then the Chatham Islands, east of the date line.
  if (inBox(-47.5, -34, 166, 179) || inBox(-44.6, -43.5, -177.2, -175.8)) return 'NZ'
  // Mainland Australia and Tasmania.
  if (inBox(-44, -10.5, 112.5, 154)) return 'AU'
  return undefined
}

export function countryCodeFor(plant: Pick<PlantProject, 'locationCountry' | 'latitude' | 'longitude'>): CountryCode | undefined {
  return countryCodeFromName(plant.locationCountry) ?? countryCodeFromPosition(plant.latitude, plant.longitude)
}

/** Whether a statement marked for certain countries is shown for this plant. Unmarked statements always are. */
export function shownIn(place: string[] | undefined, code: CountryCode | undefined): boolean {
  if (!place || place.length === 0) return true
  return code !== undefined && place.includes(code)
}

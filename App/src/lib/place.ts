/**
 * Where a plant is, for local information.
 *
 * Pip Knowledge Rules, rule 4: local information is shown only to gardeners in
 * that place. A statement in the Live Intelligence Library can carry `place`,
 * a list of place codes: a country (`NZ`), a region (`NZ-CAN`) or a town
 * (`NZ-OTA:Dunedin`). This works out which places a plant is in, so the app
 * can show or hold back each statement.
 *
 * The place belongs to the plant (a Founder decision, 5 October 2026): it comes
 * from the plant's own saved location, never from the account.
 *
 * It is worked out on the gardener's own device (a Founder decision,
 * 6 October 2026). Nothing about the plant's position is sent anywhere.
 *
 * This never guesses. A typed place that isn't recognised gives nothing, and a
 * GPS position within 10 km of another region is put to the gardener to settle
 * (see placeGeo.ts). Where the place isn't known, local statements aren't shown.
 */
import names from '@/data/places/regionNames.json'
import type { PlantProject } from './types'

export type CountryCode = 'NZ' | 'AU' | 'GB' | 'US' | 'CA'

export interface Region {
  code: string
  name: string
  country: CountryCode
  /** A wider area the region belongs to: an island of New Zealand, or England. */
  group?: string
  aliases: string[]
}

const REGIONS = names.regions as Region[]
const BY_CODE = new Map(REGIONS.map((r) => [r.code, r]))
const COUNTRY_NAMES = names.countries as Record<CountryCode, string>

const COUNTRY_ALIASES: Record<string, CountryCode> = {
  'new zealand': 'NZ', nz: 'NZ', aotearoa: 'NZ', 'aotearoa new zealand': 'NZ',
  australia: 'AU', au: 'AU', aus: 'AU',
  'united kingdom': 'GB', uk: 'GB', 'great britain': 'GB', britain: 'GB', gb: 'GB',
  england: 'GB', scotland: 'GB', wales: 'GB', 'northern ireland': 'GB',
  'united states': 'US', 'united states of america': 'US', usa: 'US', us: 'US', america: 'US',
  canada: 'CA', ca: 'CA',
}

/** A typed United Kingdom "country" that is itself one of the app's regions. */
const UK_NATION: Record<string, string> = { scotland: 'GB-SCT', wales: 'GB-WLS', 'northern ireland': 'GB-NIR' }

/**
 * Towns the approved research names. A statement marked for a town is shown to a
 * plant whose typed town is that town, or whose GPS position is within `km` of it.
 * 15 km takes in a town and its edges without reaching the next district.
 */
export interface Town {
  code: string
  name: string
  region: string
  latitude: number
  longitude: number
  km: number
  aliases: string[]
}

export const TOWNS: Town[] = [
  { code: 'NZ-OTA:Dunedin', name: 'Dunedin', region: 'NZ-OTA', latitude: -45.874, longitude: 170.504, km: 15, aliases: ['dunedin', 'ōtepoti', 'otepoti'] },
  { code: 'NZ-CAN:Christchurch', name: 'Christchurch', region: 'NZ-CAN', latitude: -43.532, longitude: 172.636, km: 15, aliases: ['christchurch', 'ōtautahi', 'otautahi'] },
  { code: 'NZ-MWT:Whanganui', name: 'Whanganui', region: 'NZ-MWT', latitude: -39.93, longitude: 175.05, km: 15, aliases: ['whanganui', 'wanganui'] },
  { code: 'NZ-WGN:Masterton', name: 'Masterton', region: 'NZ-WGN', latitude: -40.952, longitude: 175.658, km: 15, aliases: ['masterton'] },
]

const tidy = (s?: string) => (s ?? '').trim().toLowerCase().replace(/\./g, '').replace(/\s+/g, ' ')

/** From a typed country name. Undefined, never a guess, for anything not listed. */
export function countryCodeFromName(country?: string): CountryCode | undefined {
  return COUNTRY_ALIASES[tidy(country)]
}

export function countryName(code: CountryCode): string {
  return COUNTRY_NAMES[code]
}

export function regionByCode(code: string): Region | undefined {
  return BY_CODE.get(code)
}

/** The regions of a country, by name, for the gardener to pick from. */
export function regionsOf(country: CountryCode): Region[] {
  return REGIONS.filter((r) => r.country === country)
}

/** From a typed region or state. Undefined for anything not recognised in that country. */
export function regionFromName(country: CountryCode, region?: string): Region | undefined {
  const key = tidy(region)
  if (!key) return undefined
  return REGIONS.find((r) => r.country === country && r.aliases.includes(key))
}

/** Kilometres between two positions (good to well under 1% at these distances). */
export function kmBetween(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const rad = Math.PI / 180
  const x = (lon2 - lon1) * rad * Math.cos(((lat1 + lat2) / 2) * rad)
  const y = (lat2 - lat1) * rad
  return Math.sqrt(x * x + y * y) * 6371
}

/** Everything known about where a plant is. */
export interface PlantPlace {
  country?: CountryCode
  region?: Region
  town?: Town
  /** Every place code this plant is in: country, wider area, region, town. */
  codes: string[]
  /**
   * Set when the region couldn't be settled and the gardener can settle it: the regions
   * to offer, nearest first. Statements for a region or town are held back meanwhile.
   */
  ask?: { country?: CountryCode; regions: Region[] }
}

export const NOWHERE: PlantPlace = { codes: [] }

function withRegion(country: CountryCode, region: Region | undefined, town: Town | undefined): PlantPlace {
  const codes: string[] = [country]
  if (region) {
    if (region.group) codes.push(region.group)
    codes.push(region.code)
  }
  if (town) codes.push(town.code)
  return { country, region, town, codes }
}

type Located = Pick<PlantProject, 'locationCity' | 'locationRegion' | 'locationCountry' | 'latitude' | 'longitude'>

function townFor(plant: Located, region: Region | undefined): Town | undefined {
  const city = tidy(plant.locationCity)
  return TOWNS.find((t) => {
    if (region && t.region !== region.code) return false
    if (city && t.aliases.includes(city)) return true
    return (
      plant.latitude !== undefined &&
      plant.longitude !== undefined &&
      kmBetween(plant.latitude, plant.longitude, t.latitude, t.longitude) <= t.km
    )
  })
}

/**
 * What can be told without the region outlines: from a typed country, region and town,
 * or from a region the gardener has already picked for this plant. Returns undefined
 * where only the outlines can tell (a GPS position with no region saved).
 */
export function placeFromText(plant: Located): PlantPlace | undefined {
  const country = countryCodeFromName(plant.locationCountry)
  if (!country) return plant.latitude === undefined || plant.longitude === undefined ? NOWHERE : undefined
  const nation = country === 'GB' ? UK_NATION[tidy(plant.locationCountry)] : undefined
  let region = regionFromName(country, plant.locationRegion) ?? (nation ? BY_CODE.get(nation) : undefined)
  // A town the research names tells the region too.
  const town = townFor(plant, region)
  if (!region && town && regionByCode(town.region)?.country === country) region = regionByCode(town.region)
  if (region) return withRegion(country, region, town)
  if (plant.latitude !== undefined && plant.longitude !== undefined) return undefined
  return { ...withRegion(country, undefined, undefined), ask: { country, regions: regionsOf(country) } }
}

/** From the result of placing a GPS position against the region outlines (placeGeo.ts). */
export function placeFromPosition(
  plant: Located,
  found: { kind: 'region'; code: string } | { kind: 'ask'; codes: string[] } | { kind: 'none' },
): PlantPlace {
  if (found.kind === 'none') return NOWHERE
  if (found.kind === 'region') {
    const region = regionByCode(found.code)
    if (!region) return NOWHERE
    return withRegion(region.country, region, townFor(plant, region))
  }
  const regions = found.codes.map(regionByCode).filter((r): r is Region => Boolean(r))
  if (regions.length === 0) return NOWHERE
  const countries = new Set(regions.map((r) => r.country))
  // Near a border between two of the five countries, even the country waits for the gardener.
  const country = countries.size === 1 ? regions[0].country : undefined
  return { country, codes: country ? [country] : [], ask: { country, regions } }
}

/** Whether a statement marked for certain places is shown for this plant. Unmarked statements always are. */
export function shownIn(place: string[] | undefined, codes: string[] | undefined): boolean {
  if (!place || place.length === 0) return true
  return codes !== undefined && place.some((p) => codes.includes(p))
}

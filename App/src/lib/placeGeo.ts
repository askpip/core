/**
 * Placing a GPS position in a region, on the gardener's own device.
 *
 * This file and the outlines it reads are loaded only when a plant located by GPS
 * has to be placed (see usePlantPlace.ts). The outlines are simplified, so the
 * answer is never taken on trust near a border:
 *
 *   - inside one region, with no other region within NEAR_KM: that region;
 *   - within NEAR_KM of another region: the gardener is asked which;
 *   - just off the coast of one region (within COAST_KM): that region;
 *   - anywhere else: nothing, and local statements are not shown.
 *
 * Mexico, Ireland and the Isle of Man are carried as unnamed outlines so that a
 * position there is never taken for the region next door. Right on such a border
 * the gardener is asked, and can answer that the plant is somewhere else.
 */
import data from '@/data/places/regions.geo.json'

const NEAR_KM = 10
const COAST_KM = 25
const SCALE = data.scale as number

interface Outline {
  c: string
  b: number[]
  r: number[][]
}
const OUTLINES = data.regions as Outline[]
const OTHER = (code: string) => code.startsWith('XX-')

/** Kilometres per degree of latitude; longitude is scaled by the cosine of the latitude. */
const KM_LAT = 110.57
const KM_LON = 111.32

function distanceAndInside(o: Outline, lat: number, lon: number): { km: number; inside: boolean } {
  const kx = KM_LON * Math.cos((lat * Math.PI) / 180)
  let inside = false
  let best = Infinity
  for (const ring of o.r) {
    const n = ring.length / 2
    for (let i = 0, j = n - 1; i < n; j = i++) {
      const xi = ring[2 * i] / SCALE, yi = ring[2 * i + 1] / SCALE
      const xj = ring[2 * j] / SCALE, yj = ring[2 * j + 1] / SCALE
      // Even-odd rule across every ring of the region, which also handles holes.
      if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside
      // Distance to this edge, in kilometres, on a flat map centred on the position.
      const ax = (xi - lon) * kx, ay = (yi - lat) * KM_LAT
      const bx = (xj - lon) * kx, by = (yj - lat) * KM_LAT
      const dx = bx - ax, dy = by - ay
      const len2 = dx * dx + dy * dy
      const t = len2 === 0 ? 0 : Math.max(0, Math.min(1, -(ax * dx + ay * dy) / len2))
      const px = ax + t * dx, py = ay + t * dy
      const d = Math.sqrt(px * px + py * py)
      if (d < best) best = d
    }
  }
  return { km: inside ? 0 : best, inside }
}

export type Found = { kind: 'region'; code: string } | { kind: 'ask'; codes: string[] } | { kind: 'none' }

export function locate(latitude: number, longitude: number): Found {
  // Only regions whose box, widened by about COAST_KM, holds the position.
  const padLat = COAST_KM / KM_LAT
  const padLon = COAST_KM / (KM_LON * Math.max(0.2, Math.cos((latitude * Math.PI) / 180)))
  const near: { code: string; km: number; inside: boolean }[] = []
  for (const o of OUTLINES) {
    if (longitude < o.b[0] - padLon || longitude > o.b[2] + padLon || latitude < o.b[1] - padLat || latitude > o.b[3] + padLat) continue
    const d = distanceAndInside(o, latitude, longitude)
    if (d.km <= COAST_KM) near.push({ code: o.c, ...d })
  }
  near.sort((a, b) => a.km - b.km)
  if (near.length === 0) return { kind: 'none' }
  const first = near[0]
  if (OTHER(first.code) && first.inside) {
    // Inside a neighbouring country's outline. Right on its border, the gardener settles it.
    const across = near.filter((n) => !OTHER(n.code) && n.km <= NEAR_KM).map((n) => n.code)
    return across.length === 0 ? { kind: 'none' } : { kind: 'ask', codes: across }
  }
  const rivals = near.filter((n) => n !== first && n.km <= first.km + NEAR_KM)
  if (rivals.length === 0) return OTHER(first.code) ? { kind: 'none' } : { kind: 'region', code: first.code }
  const codes = [first, ...rivals].filter((n) => !OTHER(n.code)).map((n) => n.code)
  return codes.length === 0 ? { kind: 'none' } : { kind: 'ask', codes }
}

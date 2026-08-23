import type { Hemisphere } from './types'
import {
  NORTHERN_HEMISPHERE_COUNTRIES,
  SOUTHERN_HEMISPHERE_COUNTRIES,
  EQUATOR_STRADDLING_COUNTRIES,
} from './countryHemisphere'

const NORTHERN_SET = new Set(NORTHERN_HEMISPHERE_COUNTRIES.map((c) => c.trim().toLowerCase()))
const SOUTHERN_SET = new Set(SOUTHERN_HEMISPHERE_COUNTRIES.map((c) => c.trim().toLowerCase()))
const STRADDLING_SET = new Set(EQUATOR_STRADDLING_COUNTRIES.map((c) => c.trim().toLowerCase()))

/**
 * Hemisphere from a latitude, as returned by the browser's Geolocation API.
 * Exactly 0 (the equator itself) is left undefined rather than picked
 * either way — vanishingly unlikely in practice, but there's no reason to
 * guess when it happens.
 */
export function hemisphereFromLatitude(latitude: number): Hemisphere | undefined {
  if (latitude > 0) return 'northern'
  if (latitude < 0) return 'southern'
  return undefined
}

/**
 * Hemisphere from a manually-typed country name, via the static lookup in
 * countryHemisphere.ts. Returns undefined — never a guess — for a country
 * that straddles the equator, or one not yet in the list.
 */
export function hemisphereFromCountry(country: string): Hemisphere | undefined {
  const key = country.trim().toLowerCase()
  if (!key || STRADDLING_SET.has(key)) return undefined
  if (NORTHERN_SET.has(key)) return 'northern'
  if (SOUTHERN_SET.has(key)) return 'southern'
  return undefined
}

export type Season = 'winter' | 'spring' | 'summer' | 'autumn'

/**
 * Meteorological season (Dec/Jan/Feb = winter in the Northern Hemisphere,
 * flipped for the Southern) for a given hemisphere and date. This is
 * general calendar/geography logic, not a horticultural judgment — it's
 * fine as context ("since it's spring where you are...") and for future
 * follow-up-timing use (Architecture §6.4), but it must never stand in for
 * the actual dormancy check. That check deliberately watches for real bud
 * swell on the gardener's own rose rather than trusting the calendar
 * (ARC-BUSHROSE-DORMANCY-01) — a calendar season can't know about an
 * unusual year or a local microclimate the way the actual plant can.
 */
export function seasonForHemisphere(hemisphere: Hemisphere, date: Date): Season {
  const month = date.getMonth() // 0 = January
  const northernSeason: Season =
    month === 11 || month <= 1
      ? 'winter'
      : month <= 4
        ? 'spring'
        : month <= 7
          ? 'summer'
          : 'autumn'

  if (hemisphere === 'northern') return northernSeason

  const FLIP: Record<Season, Season> = { winter: 'summer', summer: 'winter', spring: 'autumn', autumn: 'spring' }
  return FLIP[northernSeason]
}

/** Wraps the browser's callback-based Geolocation API in a Promise. */
export function getCurrentPosition(options?: PositionOptions): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error("This browser doesn't support location access."))
      return
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 15000,
      maximumAge: 5 * 60 * 1000,
      ...options,
    })
  })
}

/** Turns a GeolocationPositionError into a message a gardener will actually understand. */
export function describeGeolocationError(error: GeolocationPositionError): string {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return "Location access was denied — you can allow it in your browser's settings, or enter your location manually below."
    case error.POSITION_UNAVAILABLE:
      return "Couldn't determine your location right now. Try again, or enter it manually below."
    case error.TIMEOUT:
      return 'That took too long. Try again, or enter your location manually below.'
    default:
      return "Something went wrong getting your location. Enter it manually below."
  }
}

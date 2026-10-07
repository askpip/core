import { useCallback, useEffect, useMemo, useState } from 'react'
import { NOWHERE, placeFromPosition, placeFromText, type PlantPlace } from './place'
import type { PlantProject } from './types'

const skipKey = (plantId: string) => `pip.place.skip.${plantId}`

function skipped(plantId: string): boolean {
  try {
    return window.localStorage.getItem(skipKey(plantId)) === '1'
  } catch {
    return false
  }
}

/**
 * Where a plant is, for showing local statements (lib/place.ts).
 *
 * A typed location, or a region the gardener has picked for the plant, is read
 * straight away. A GPS position with no region saved is placed against the region
 * outlines, which are loaded only then (lib/placeGeo.ts). Until that finishes, and
 * whenever the place can't be told, local statements are simply not shown.
 *
 * `skipAsk` records, on this device, that the gardener chose not to say which region
 * the plant is in, so Pip doesn't keep asking.
 */
export function usePlantPlace(project: PlantProject | undefined): { place: PlantPlace; skipAsk: () => void } {
  const id = project?.id
  const { locationCity, locationRegion, locationCountry, latitude, longitude } = project ?? {}
  const fromText = useMemo(
    () => (id ? placeFromText({ locationCity, locationRegion, locationCountry, latitude, longitude }) : NOWHERE),
    [id, locationCity, locationRegion, locationCountry, latitude, longitude],
  )
  const [fromOutlines, setFromOutlines] = useState<PlantPlace>(NOWHERE)
  const [skip, setSkip] = useState(false)

  useEffect(() => {
    setSkip(id ? skipped(id) : false)
  }, [id])

  useEffect(() => {
    if (fromText !== undefined || latitude === undefined || longitude === undefined) return
    let current = true
    setFromOutlines(NOWHERE)
    void import('./placeGeo')
      .then(({ locate }) => {
        if (current) setFromOutlines(placeFromPosition({ locationCity, latitude, longitude }, locate(latitude, longitude)))
      })
      .catch((err) => console.warn('Region outlines not loaded:', err))
    return () => {
      current = false
    }
  }, [fromText, locationCity, latitude, longitude])

  const skipAsk = useCallback(() => {
    if (!id) return
    try {
      window.localStorage.setItem(skipKey(id), '1')
    } catch {
      // Private browsing: the choice lasts for this visit only.
    }
    setSkip(true)
  }, [id])

  const found = fromText ?? fromOutlines
  const place = skip && found.ask ? { ...found, ask: undefined } : found
  return { place, skipAsk }
}

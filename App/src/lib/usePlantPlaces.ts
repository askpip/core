import { useEffect, useMemo, useState } from 'react'
import { NOWHERE, placeFromPosition, placeFromText, type PlantPlace } from './place'
import type { PlantProject } from './types'

/**
 * Where each of several plants is (lib/place.ts), for the home screen. The same
 * rules as usePlantPlace: a typed place is read straight away; a GPS position with
 * no region saved is placed against the region outlines, loaded only when needed,
 * all on the gardener's own device.
 */
export function usePlantPlaces(projects: PlantProject[]): Map<string, PlantPlace> {
  const fromText = useMemo(() => {
    const m = new Map<string, PlantPlace | undefined>()
    for (const p of projects) m.set(p.id, placeFromText(p))
    return m
  }, [projects])
  const [fromOutlines, setFromOutlines] = useState<Map<string, PlantPlace>>(new Map())

  const needOutlines = useMemo(
    () => projects.filter((p) => fromText.get(p.id) === undefined && p.latitude !== undefined && p.longitude !== undefined),
    [projects, fromText],
  )

  useEffect(() => {
    if (needOutlines.length === 0) return
    let current = true
    void import('./placeGeo')
      .then(({ locate }) => {
        if (!current) return
        const m = new Map<string, PlantPlace>()
        for (const p of needOutlines) m.set(p.id, placeFromPosition(p, locate(p.latitude!, p.longitude!)))
        setFromOutlines(m)
      })
      .catch((err) => console.warn('Region outlines not loaded:', err))
    return () => {
      current = false
    }
  }, [needOutlines])

  return useMemo(() => {
    const m = new Map<string, PlantPlace>()
    for (const p of projects) m.set(p.id, fromText.get(p.id) ?? fromOutlines.get(p.id) ?? NOWHERE)
    return m
  }, [projects, fromText, fromOutlines])
}

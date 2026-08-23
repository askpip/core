import { useEffect, useState } from 'react'
import { supabase } from './supabase'

/**
 * Private bucket for gardener-uploaded rose photos — see supabase/schema.sql
 * for its RLS policies (one folder per user, keyed by auth.uid()).
 */
export const PLANT_PHOTOS_BUCKET = 'plant-photos'

/**
 * 'overview' is the plant's cover photo (NewPlant.tsx's onboarding step).
 * 'journey-overview' is Journey.tsx's 'photos' phase overview shot —
 * deliberately a separate path, not shared with 'overview', so a fresh
 * journey never has an old cover photo (or a previous journey's photo)
 * silently standing in for the current, up-to-date look Pip needs to see —
 * see PlantProject.journeyOverviewPhotoPath's doc comment in types.ts.
 *
 * 'variety-label' is a photo of the nursery tag/label itself, offered on
 * NewPlant.tsx's "what kind of rose is it" question as an alternative to
 * typing a name the gardener isn't sure they've read (or spelled) right —
 * see PlantProject.varietyLabelPhotoPath's doc comment in types.ts.
 *
 * There's no fixed slot for journey close-ups — see journeyCloseUpPhotoPath
 * below for why that one's a gallery instead.
 */
export type PlantPhotoSlot = 'overview' | 'journey-overview' | 'variety-label'

/**
 * One fixed storage path per (plant, slot) — deliberately no file extension
 * (the signed URL's content-type comes from what was actually uploaded, see
 * uploadPlantPhoto below, so the URL doesn't need one either). Re-uploading
 * a photo overwrites the previous one at this same path rather than
 * accumulating orphaned files as a gardener retakes a shot.
 */
export function plantPhotoPath(userId: string, profileId: string, slot: PlantPhotoSlot) {
  return `${userId}/${profileId}/${slot}`
}

/**
 * One path per progress-photo upload (photoId is a fresh id the caller
 * generates) — unlike plantPhotoPath's fixed per-slot path, these
 * accumulate rather than overwrite, since a gardener can add any number of
 * progress photos over time. Nested under "progress/" so they never collide
 * with the fixed "overview"/"close-up" objects even though all three share
 * the same first two path segments — and the bucket's RLS policies, which
 * only check that first segment, already cover these with no changes.
 */
export function progressPhotoPath(userId: string, profileId: string, photoId: string) {
  return `${userId}/${profileId}/progress/${photoId}`
}

/**
 * One path per journey close-up upload (photoId is a fresh id the caller
 * generates) — Journey.tsx's 'photos' phase asks for "a few close-ups of
 * where stems cross or look uncertain," which a single fixed slot couldn't
 * actually deliver (a second close-up just overwrote the first, with no way
 * to add more). Nested under "journey-close-up/" alongside the other fixed
 * slots' paths, same reasoning as progressPhotoPath above.
 */
export function journeyCloseUpPhotoPath(userId: string, profileId: string, photoId: string) {
  return `${userId}/${profileId}/journey-close-up/${photoId}`
}

/** Uploads (or replaces, via upsert) a gardener's photo at the given path. */
export async function uploadPlantPhoto(path: string, file: File) {
  const { error } = await supabase.storage.from(PLANT_PHOTOS_BUCKET).upload(path, file, {
    upsert: true,
    contentType: file.type || 'image/jpeg',
  })
  if (error) throw error
}

/** Deletes a gardener's photo — used when they remove one without replacing it. */
export async function removePlantPhoto(path: string) {
  const { error } = await supabase.storage.from(PLANT_PHOTOS_BUCKET).remove([path])
  if (error) throw error
}

/**
 * The bucket is private, so every display of a photo goes through a
 * time-limited signed URL rather than a stored public one — regenerated on
 * demand, since a signed URL expires and isn't safe to cache long-term.
 */
export async function getPlantPhotoUrl(path: string, expiresInSeconds = 3600) {
  const { data, error } = await supabase.storage.from(PLANT_PHOTOS_BUCKET).createSignedUrl(path, expiresInSeconds)
  if (error) throw error
  return data.signedUrl
}

/**
 * React hook wrapper around getPlantPhotoUrl: null while there's no path,
 * while the signed URL is still loading, or if fetching it failed — every
 * caller already has a sensible "no photo" fallback to show in that case
 * (see PhotoCard.tsx, PlantThumbnail.tsx), so failures are logged rather
 * than surfaced as their own error state.
 */
export function usePlantPhotoUrl(path?: string) {
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    if (!path) {
      setUrl(null)
      return
    }
    getPlantPhotoUrl(path)
      .then((signedUrl) => {
        if (active) setUrl(signedUrl)
      })
      .catch((err) => {
        console.error('Failed to load plant photo:', err)
        if (active) setUrl(null)
      })
    return () => {
      active = false
    }
  }, [path])

  return url
}

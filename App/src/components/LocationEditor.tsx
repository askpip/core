import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/Button'
import {
  describeGeolocationError,
  getCurrentPosition,
  hemisphereFromCountry,
  hemisphereFromLatitude,
} from '@/lib/location'
import type { PlantProject } from '@/lib/types'

/** Add a plant's own question (NewPlant.tsx), reused word for word. */
const PIP_ASKS = "Where is your rose growing? I'll use this to understand your local season."

type LocationPatch = Pick<
  PlantProject,
  'location' | 'locationMethod' | 'locationCity' | 'locationRegion' | 'locationCountry' | 'latitude' | 'longitude' | 'hemisphere'
>

/**
 * Changing a rose's place from its own page (APP-REMINDERS-AND-PLACE proposal §3,
 * approved 18 October 2026): the same two ways as Add a plant, GPS or typed. The
 * fields of the other way are cleared, so an old GPS position can't outlive a typed
 * town, or the reverse. Nothing else about the rose changes.
 */
export function LocationEditor({
  name,
  onSave,
  onClose,
}: {
  name: string
  onSave: (patch: LocationPatch) => Promise<unknown> | void
  onClose: () => void
}) {
  const [step, setStep] = useState<'choose' | 'geolocating' | 'manual'>('choose')
  const [geoError, setGeoError] = useState<string | null>(null)
  const [city, setCity] = useState('')
  const [region, setRegion] = useState('')
  const [country, setCountry] = useState('')
  const [saving, setSaving] = useState(false)

  async function save(patch: LocationPatch) {
    setSaving(true)
    await onSave(patch)
    setSaving(false)
    onClose()
  }

  async function locateMe() {
    setGeoError(null)
    setStep('geolocating')
    try {
      const { latitude, longitude } = (await getCurrentPosition()).coords
      await save({
        location: 'Current location',
        locationMethod: 'geolocation',
        latitude,
        longitude,
        hemisphere: hemisphereFromLatitude(latitude),
        locationCity: undefined,
        locationRegion: undefined,
        locationCountry: undefined,
      })
    } catch (err) {
      setGeoError(
        err && typeof err === 'object' && 'code' in err
          ? describeGeolocationError(err as GeolocationPositionError)
          : 'Something went wrong getting your location. Enter it manually below.',
      )
      setStep('choose')
    }
  }

  function submitManual() {
    const c = city.trim()
    const r = region.trim()
    const k = country.trim()
    if (!c || !k) return
    void save({
      location: [c, r, k].filter(Boolean).join(', '),
      locationMethod: 'manual',
      locationCity: c,
      locationRegion: r || undefined,
      locationCountry: k,
      hemisphere: hemisphereFromCountry(k),
      latitude: undefined,
      longitude: undefined,
    })
  }

  return (
    <div className="absolute inset-0 z-50 flex items-start justify-center bg-black/30 px-3 pt-16" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Where ${name} grows`}
        className="flex w-full max-w-md flex-col gap-3 rounded-2xl bg-pip-card p-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm leading-relaxed">{PIP_ASKS}</p>
          <button onClick={onClose} aria-label="Close" className="text-pip-text-soft">
            <X size={20} />
          </button>
        </div>
        {step === 'choose' && (
          <div className="flex flex-col gap-2.5">
            {geoError && <p className="text-xs text-red-600">{geoError}</p>}
            <Button onClick={() => void locateMe()}>Use my current location</Button>
            <Button variant="secondary" onClick={() => setStep('manual')}>
              Enter it manually
            </Button>
          </div>
        )}
        {step === 'geolocating' && <p className="text-sm text-pip-text-soft">Getting your location…</p>}
        {step === 'manual' && (
          <div className="flex flex-col gap-2.5">
            <input autoFocus value={city} onChange={(e) => setCity(e.target.value)} placeholder="Town / city" className="input w-full" />
            <input value={region} onChange={(e) => setRegion(e.target.value)} placeholder="Region / state (optional)" className="input w-full" />
            <input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submitManual()}
              placeholder="Country"
              className="input w-full"
            />
            <Button disabled={saving || !city.trim() || !country.trim()} onClick={submitManual}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
            <button onClick={() => setStep('choose')} className="text-sm text-pip-text-soft underline">
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

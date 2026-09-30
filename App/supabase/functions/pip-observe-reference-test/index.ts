// AskPIP — TEST ONLY: does giving Gemini labelled reference images help Pip's dead-wood look?
//
// Not used by the app. Deployed so the Founders can compare three variants on a
// gardener's own photo (1 October 2026, Shaphan: "Test offline first"):
//   current     — the live function's prompt and its own older copy of the signals
//   tight       — signals read from the Live Intelligence Library (PKR-OBS-000001,
//                 Published) plus a rule to say when a photo is too far away to judge
//   tight-refs  — as "tight", plus labelled reference images sent by the caller
//
// Same security as pip-observe-dead-wood: the caller's own token downloads the photo
// (Storage RLS applies), the Gemini key stays a server secret.

import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { encodeBase64 } from 'jsr:@std/encoding/base64'

const GEMINI_MODEL = 'gemini-3.5-flash-lite'
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...cors, 'Content-Type': 'application/json' } })

// The live function's copy (pip-observe-dead-wood, August 2026 wording), for the "current" variant.
const CURRENT_SIGNALS = [
  { signal: 'External stem/bark colour', reading: 'Green usually means living. Brown, gray, black, or shriveled usually means dead. Use caution on older canes, which can naturally look bronze without being dead.', confidence: 'Moderate', photographable: true },
  { signal: 'Dormant bud presence', reading: 'Plump, visible buds mean living. No buds visible anywhere on the stem means dead.', confidence: 'Moderate', photographable: true },
  { signal: 'Lesion pattern', reading: 'A visible lesion pattern suggests possible canker — a different problem from routine dead wood, not the same thing.', confidence: 'Low', photographable: 'Partially — some lesions are visible in a photo, but a full assessment usually needs closer physical inspection.' },
  { signal: 'Pith colour', reading: 'White or pale-green pith means living. Brown, gray, or black pith means dead.', confidence: 'High', photographable: false },
  { signal: 'Flexibility / brittleness', reading: 'A stem that bends means living. A stem that snaps or is brittle means dead.', confidence: 'Low', photographable: false },
]

const BASE_RULES = `You are "Pip", already mid-conversation with a gardener about their rose. Never greet or
introduce yourself. Keep the reply short: a handful of natural spoken sentences, no headers,
numbering or markdown. Use ONLY the signals below. For each signal a photo can show, look at the
photo, say briefly what you see and what it suggests, and name its confidence level in passing.
For signals a photo cannot show (pith, bending), say so in a few words and name the physical
check. Never blend signals into one overall confidence. Add no horticultural fact that isn't in
the signals.`

const TIGHT_RULES = `
Before judging any signal, decide honestly whether the photo is close and sharp enough to see it.
Individual buds are small: if the photo shows the whole plant from a distance, or the canes are
too thin, blurred or far away to make out buds, say plainly that you can't judge buds from this
photo and ask for a close-up of one cane. Do the same for bark colour or lesions if they can't be
made out. Never describe something you can't actually see. Saying "I can't tell from this photo"
is a good answer.`

const REF_RULES = `
You will also receive labelled REFERENCE ILLUSTRATIONS before the gardener's photo. They are
AI-generated illustrations, not photographs of this rose and not approved reference photos. Use
them only as a rough visual guide to what a signal can look like. Never say the gardener's rose
"matches" a reference, never mention the references to the gardener, and never let them override
what you can or can't see in the gardener's own photo.`

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: cors })
  try {
    const auth = req.headers.get('Authorization')
    if (!auth) return json({ error: 'Missing Authorization header.' }, 401)
    const key = Deno.env.get('GEMINI_API_KEY')
    if (!key) return json({ error: 'GEMINI_API_KEY not set.' }, 503)

    const { photoPath, variant = 'tight', references = [], question } = (await req.json()) as {
      photoPath?: string
      variant?: 'current' | 'tight' | 'tight-refs'
      references?: { label: string; mimeType: string; data: string }[]
      question?: string
    }
    if (!photoPath) return json({ error: 'Missing photoPath.' }, 400)

    const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: auth } },
    })

    let signals: unknown = CURRENT_SIGNALS
    let signalSource = 'pip-observe-dead-wood copy (Aug 2026)'
    if (variant !== 'current') {
      const { data, error } = await sb
        .from('lil_pkr')
        .select('version, content')
        .eq('pkr_id', 'PKR-OBS-000001')
        .eq('status', 'Published')
        .single()
      if (error || !data) return json({ error: 'Could not read PKR-OBS-000001 from the LIL.' }, 502)
      signals = { criteria: data.content.criteria, photo_limit: data.content.photo_limit }
      signalSource = `LIL PKR-OBS-000001 v${data.version}`
    }

    const { data: file, error: dl } = await sb.storage.from('plant-photos').download(photoPath)
    if (dl || !file) return json({ error: "Couldn't load that photo." }, 404)
    const photo = { mimeType: file.type || 'image/jpeg', data: encodeBase64(new Uint8Array(await file.arrayBuffer())) }

    const system =
      BASE_RULES + (variant === 'current' ? '' : TIGHT_RULES) + (variant === 'tight-refs' ? REF_RULES : '') +
      `\n\nSIGNALS:\n${JSON.stringify(signals, null, 2)}`

    const parts: unknown[] = []
    if (variant === 'tight-refs') {
      for (const r of references.slice(0, 6)) {
        parts.push({ text: `REFERENCE ILLUSTRATION — ${r.label}` })
        parts.push({ inlineData: { mimeType: r.mimeType, data: r.data } })
      }
      parts.push({ text: "GARDENER'S PHOTO:" })
    }
    parts.push({ inlineData: photo })
    parts.push({ text: `Gardener's question: "${question || 'What can you tell me about this stem?'}"` })

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systemInstruction: { role: 'system', parts: [{ text: system }] }, contents: [{ role: 'user', parts }] }),
      },
    )
    const body = await res.json()
    if (!res.ok) return json({ error: 'Gemini error', detail: body?.error?.message }, 502)
    const answer = body.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? '').join('')
    return json({ variant, signalSource, references: variant === 'tight-refs' ? references.length : 0, answer })
  } catch (e) {
    return json({ error: String(e) }, 500)
  }
})

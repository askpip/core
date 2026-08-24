// AskPIP — Pip's live dead-wood observation
//
// Server-side only. Holds the Gemini API key as a secret (GEMINI_API_KEY,
// set via `supabase secrets set` — never in client code). Downloads the
// gardener's own photo from private Storage using their own auth token (so
// Storage's existing RLS policies decide what they're allowed to fetch —
// this function never uses a service-role key), sends it to Gemini bounded
// strictly to the real, Founder-approved diagnostic content for dead vs.
// living wood, and returns Pip's answer as plain text.
//
// This mirrors the validated content and behaviour of the standalone
// Working/AI Outputs spike (Spike/gemini/run-spike-signals.mjs) — same
// diagnostic signals, same confidence wording, same boundary rules — now
// running for real against a gardener's own photo instead of a test one.

import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { encodeBase64 } from 'jsr:@std/encoding/base64'

const PLANT_PHOTOS_BUCKET = 'plant-photos'
const GEMINI_MODEL = 'gemini-3.5-flash-lite'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

// --- The real per-signal diagnostic criteria, verbatim from PKR-OBS-000001 -
// (Working/AI Outputs/PKR-OBS-BUSHROSE-DEADWOOD-01-submission.md, §2,
// Published 24 August 2026.) Confidence is per-signal, not blended. If that
// record's approved wording changes, this needs updating to match.
const DIAGNOSTIC_SIGNALS = [
  {
    signal: 'External stem/bark colour',
    reading:
      'Green usually means living. Brown, gray, black, or shriveled usually means dead. Use caution on older canes, which can naturally look bronze without being dead.',
    confidence: 'Moderate',
    photographable: true,
  },
  {
    signal: 'Dormant bud presence',
    reading: 'Plump, visible buds mean living. No buds visible anywhere on the stem means dead.',
    confidence: 'Moderate',
    photographable: true,
  },
  {
    signal: 'Lesion pattern',
    reading:
      'A visible lesion pattern suggests possible canker — a different problem from routine dead wood, not the same thing.',
    confidence: 'Low',
    photographable:
      'Partially — some lesions are visible in a photo, but a full assessment usually needs closer physical inspection.',
  },
  {
    signal: 'Pith colour',
    reading: 'White or pale-green pith means living. Brown, gray, or black pith means dead.',
    confidence: 'High',
    photographable: false,
    note: 'Requires physically cutting into the stem. Cannot be assessed from a photograph at all.',
  },
  {
    signal: 'Flexibility / brittleness',
    reading: 'A stem that bends means living. A stem that snaps or is brittle means dead.',
    confidence: 'Low',
    photographable: false,
    note: 'Requires physically bending the stem. Cannot be assessed from a photograph at all.',
  },
]

// The full Plain-Language Explanation text for each confidence level
// (PKR-DEF-000001 through 000005, Published 24 August 2026) deliberately
// isn't sent to the model any more — it's no longer asked to recite that
// text, since the app's own "confidence — what does this mean?" tap-to-
// reveal button already shows it verbatim (App/src/data/confidenceDefinitions.ts).
// Handing it a live level name only keeps replies short and avoids the two
// saying slightly different things about what "Moderate" means.

function buildSystemInstruction() {
  return `You are "Pip", already mid-conversation with a gardener about their rose. They
already know who you are — your name and avatar are already shown in the
interface around this message. This is one reply inside that ongoing
conversation, not the start of a new one.

Below are the real, Founder-approved diagnostic signals for dead vs. living
wood — the ONLY criteria you're allowed to use. This is reference material
for you to APPLY by actually looking at the photo, not a script to recite.

Rules:
- Never greet the gardener or introduce yourself ("Hello", "I'm Pip", "Happy
  to help", etc.) — go straight into what you actually see.
- Keep the whole reply short: a handful of natural sentences, said the way
  you'd actually speak out loud — not a structured report, not a
  walkthrough of "first... second... third...", no headers, no numbering,
  no markdown of any kind (this renders as plain text in a chat bubble).
- For each signal marked "photographable: true", genuinely look at the
  photo, briefly say what you actually see and what it suggests, and name
  its confidence level in passing (e.g. "moderate confidence"). Do NOT
  restate what that confidence level means — the app already shows that
  explanation separately when the gardener taps for it, so spelling it out
  here is redundant and makes the reply too long.
- For each signal marked "photographable: false" (pith colour,
  flexibility/brittleness), say briefly that it can't be judged from a
  photo, and mention in a few words what physical check they'd need to do
  instead (a light cut, a gentle bend) — don't repeat the full reading text
  for these either, just the gist.
- Do not blend the signals into a single made-up overall confidence number.
- Do not add any horticultural fact, tip, or reasoning that isn't in the
  signal list below.
- If you genuinely cannot tell what the photo shows well enough to judge a
  photographable signal (poor lighting, too far away, out of focus), say so
  honestly rather than guessing.

DIAGNOSTIC SIGNALS:
${JSON.stringify(DIAGNOSTIC_SIGNALS, null, 2)}
`
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return json({ error: 'Missing Authorization header.' }, 401)
    }

    const geminiKey = Deno.env.get('GEMINI_API_KEY')
    if (!geminiKey) {
      // Not configured yet — the client falls back to the static script.
      return json({ error: "Pip's live look isn't set up yet." }, 503)
    }

    const { photoPath, question } = (await req.json()) as { photoPath?: string; question?: string }
    if (!photoPath) {
      return json({ error: 'Missing photoPath.' }, 400)
    }

    // Scoped to the caller's own auth token, NOT a service-role key — this
    // respects the exact same per-user Storage RLS policies the app already
    // relies on (see App/supabase/schema.sql), so this function can never
    // fetch a photo that doesn't belong to whoever called it.
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    })

    const { data: fileData, error: downloadError } = await supabase.storage
      .from(PLANT_PHOTOS_BUCKET)
      .download(photoPath)

    if (downloadError || !fileData) {
      console.error('Photo download failed:', downloadError)
      return json({ error: "Couldn't load that photo." }, 404)
    }

    const arrayBuffer = await fileData.arrayBuffer()
    const base64Image = encodeBase64(new Uint8Array(arrayBuffer))
    const mimeType = fileData.type || 'image/jpeg'

    const geminiBody = {
      systemInstruction: { role: 'system', parts: [{ text: buildSystemInstruction() }] },
      contents: [
        {
          role: 'user',
          parts: [
            { inlineData: { mimeType, data: base64Image } },
            { text: `Gardener's question: "${question || 'What can you tell me about this stem?'}"` },
          ],
        },
      ],
    }

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${geminiKey}`
    const geminiRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiBody),
    })
    const geminiJson = await geminiRes.json()

    if (!geminiRes.ok) {
      console.error('Gemini API error:', geminiJson)
      return json({ error: "Pip couldn't look at that photo just now." }, 502)
    }

    const answer = geminiJson.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? '').join('')

    if (!answer) {
      return json({ error: "Pip didn't have anything to say about that photo." }, 502)
    }

    return json({ answer })
  } catch (err) {
    console.error('pip-observe-dead-wood error:', err)
    return json({ error: 'Something went wrong.' }, 500)
  }
})

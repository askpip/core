// AskPIP — Gemini validation spike, v2: real diagnostic signals
//
// Standalone script. NOT wired into the App. Where run-spike.mjs tests
// "does the model stay bounded and disclose honestly," this one tests
// something harder and more important: can the model actually LOOK at a
// photo and apply the real, Founder-approved diagnostic criteria itself —
// including correctly admitting when a signal can't be judged from a photo
// at all (pith colour and flexibility require physically cutting/bending
// the stem) — rather than reciting a finished sentence?
//
// Usage:
//   node run-spike-signals.mjs [photoPath] ["gardener question"]
//
// Defaults: photoPath = ./photos/sample-stem.jpg
//           question  = "What can you tell me about this stem?"
//
// Uses the same .env.local as run-spike.mjs — no separate setup needed.

import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

function loadEnvLocal() {
  const envPath = join(__dirname, '.env.local')
  if (!existsSync(envPath)) {
    console.error(
      `Missing ${envPath}\n` +
        `Copy .env.example to .env.local in this folder and add your GEMINI_API_KEY.`,
    )
    process.exit(1)
  }
  const out = {}
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    out[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim()
  }
  return out
}

const env = loadEnvLocal()
const API_KEY = env.GEMINI_API_KEY
const MODEL = env.GEMINI_MODEL || 'gemini-3.5-flash-lite'

if (!API_KEY || API_KEY.includes('your-')) {
  console.error('GEMINI_API_KEY is missing or still a placeholder in .env.local.')
  process.exit(1)
}

// --- the real per-signal diagnostic criteria, verbatim from PKR-OBS-000001 -
// (Working/AI Outputs/PKR-OBS-BUSHROSE-DEADWOOD-01-submission.md, §2,
// Published 24 August 2026.) Confidence is per-signal, not blended.
const DIAGNOSTIC_SIGNALS = [
  {
    signal: 'External stem/bark colour',
    reading: 'Green usually means living. Brown, gray, black, or shriveled usually means dead. Use caution on older canes, which can naturally look bronze without being dead.',
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
    reading: 'A visible lesion pattern suggests possible canker — a different problem from routine dead wood, not the same thing.',
    confidence: 'Low',
    photographable: 'Partially — some lesions are visible in a photo, but a full assessment usually needs closer physical inspection.',
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

const CONFIDENCE_EXPLANATIONS = {
  High: "This means the evidence behind this is reliable and generally consistent. There may be small gaps, but they're not enough to seriously doubt it.",
  Moderate:
    "This means the available evidence reasonably supports this information, but some real limitations or open questions remain. It's good information — worth using, just with a little extra care.",
  Low: 'This means the evidence behind this is limited. Treat it as a helpful pointer rather than something to rely on heavily on its own.',
}

const systemInstruction = `You are standing in for "Pip", a gardening guidance assistant helping a
gardener figure out whether a rose stem is dead or alive.

Below are the real, Founder-approved diagnostic signals for this — the ONLY
criteria you're allowed to use. This is reference material for you to APPLY
by actually looking at the photo, not a script to recite.

Rules:
- For each signal marked "photographable: true", genuinely look at the photo
  and say what you can actually see, then state what that signal suggests
  and its exact confidence level and meaning (use the wording given below,
  don't invent your own phrasing for what a confidence level means).
- For each signal marked "photographable: false", say plainly that this
  can't be judged from a photograph at all — do not guess, do not infer it
  from what you can see, do not skip mentioning it as if it didn't exist.
  Tell the gardener what physical check they'd need to do themselves
  (cutting or bending the stem) to get that signal.
- Do not blend the signals into a single made-up overall confidence number.
  Report per-signal.
- Do not add any horticultural fact, tip, or reasoning that isn't in the
  signal list below.
- If you genuinely cannot tell what the photo shows well enough to apply a
  photographable signal (poor lighting, too far away, out of focus), say so
  honestly rather than guessing.
- Speak directly and plainly to the gardener, the way Pip would — not as a
  form letter, and not padded with disclaimers beyond what's asked above.

DIAGNOSTIC SIGNALS:
${JSON.stringify(DIAGNOSTIC_SIGNALS, null, 2)}

CONFIDENCE LEVEL MEANINGS (use verbatim where you cite a level):
${JSON.stringify(CONFIDENCE_EXPLANATIONS, null, 2)}
`

const photoArg = process.argv[2] || join(__dirname, 'photos', 'sample-stem.jpg')
const question = process.argv[3] || 'What can you tell me about this stem?'

if (!existsSync(photoArg)) {
  console.error(`Photo not found: ${photoArg}\nSee photos/README.md for what to put there.`)
  process.exit(1)
}

const imageBytes = readFileSync(photoArg)
const base64Image = imageBytes.toString('base64')
const mimeType = photoArg.toLowerCase().endsWith('.png')
  ? 'image/png'
  : photoArg.toLowerCase().endsWith('.jpeg') || photoArg.toLowerCase().endsWith('.jpg')
    ? 'image/jpeg'
    : 'image/jpeg'

const body = {
  systemInstruction: { role: 'system', parts: [{ text: systemInstruction }] },
  contents: [
    {
      role: 'user',
      parts: [{ inlineData: { mimeType, data: base64Image } }, { text: `Gardener's question: "${question}"` }],
    },
  ],
}

const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`

console.log(`Calling Gemini model "${MODEL}" (signals mode)...\n`)

const res = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
})

const json = await res.json()

if (!res.ok) {
  console.error(`Gemini API error (HTTP ${res.status}):`)
  console.error(JSON.stringify(json, null, 2))
  process.exit(1)
}

const answer = json.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || '(no text returned)'

console.log('--- Pip (spike, signals mode) would say: ---------------------------\n')
console.log(answer)
console.log('\n-------------------------------------------------------------------')

if (json.usageMetadata) {
  console.log('\nToken usage:')
  console.log(json.usageMetadata)
}

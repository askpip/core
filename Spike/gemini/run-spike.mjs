// AskPIP — Gemini validation spike
//
// Standalone script. NOT wired into the App. Tests one thing: given the
// real Published dead-wood PKR content (proposal text, confidence rating,
// sources) plus a photo and a gardener's question, does a general-purpose
// AI model produce an honest, correctly-bounded answer — one that speaks
// only from the provided PKR content and doesn't invent anything beyond it?
//
// Usage:
//   node run-spike.mjs [photoPath] ["gardener question"]
//
// Defaults: photoPath = ./photos/sample-stem.jpg
//           question  = "Is this stem dead?"
//
// Setup:
//   1. Copy .env.example to .env.local in this same folder.
//   2. Put your Gemini API key in .env.local (GEMINI_API_KEY=...).
//      .env.local is gitignored — it never gets committed.
//   3. Put a photo of a rose stem in ./photos/ (see photos/README.md).
//   4. node run-spike.mjs

import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// --- tiny .env.local loader (no dependency needed) -------------------------
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
// ^ Verify this matches the exact model name shown for your key at
//   aistudio.google.com — model names change; the free-tier one you were
//   offered when creating the key may differ slightly from this default.

if (!API_KEY || API_KEY.includes('your-')) {
  console.error('GEMINI_API_KEY is missing or still a placeholder in .env.local.')
  process.exit(1)
}

// --- the real, Published PKR content this spike is bounded to --------------
// Copied verbatim from App/src/data/observationScript.ts (dead-wood entry)
// and App/src/data/confidenceDefinitions.ts, both Published 24 August 2026.
const PKR_CONTENT = {
  observation: {
    feature: 'Dead versus living wood',
    pipProposal:
      "This stem may be dead. It looks darker than the growth beside it, and I can't see a healthy bud in the photograph. Can you find the same stem on the rose and look at it closely?",
    comparisonNote: 'Approved comparison: dead wood vs. living wood, beginner-appropriate reference.',
  },
  confidenceLevel: 'Moderate',
  confidenceExplanation:
    "This means the available evidence reasonably supports this information, but some real limitations or open questions remain. It's good information — worth using, just with a little extra care.",
  sources: [
    { title: 'Rose pruning: general tips', publisher: 'Royal Horticultural Society' },
    { title: 'Pruning Roses', publisher: 'Colorado State University Extension (PlantTalk Colorado)' },
    { title: 'Pruning', publisher: 'University of Illinois Extension' },
    { title: 'Pruning Roses', publisher: 'Clemson University Cooperative Extension (HGIC)' },
    { title: 'How to Prune Roses', publisher: 'Iowa State University Extension and Outreach' },
    { title: 'Basic Pruning Principles', publisher: 'American Rose Society' },
  ],
}

const systemInstruction = `You are standing in for "Pip", a gardening guidance assistant.

Your job is to actually answer the gardener's specific question below, using
their photo. The PKR content beneath is your ONLY allowed source of
horticultural fact — but it is reference material, not a script. Do not
recite it by default. Only bring in pieces of it that are actually relevant
to what the gardener just asked.

Rules:
- If the gardener's question is about the specific thing the PKR content's
  "observation" covers (a particular stem possibly being dead), you may use
  that content, and if you state a confidence level or sources, use the
  exact wording given below — not your own paraphrase.
- If the gardener's question asks about anything the PKR content does NOT
  cover — including things that sound related, like the dormancy state of
  the whole plant, or of stems other than the one specific case described —
  say plainly and specifically that you don't have confidence-rated
  information covering that particular question. Do not guess, do not
  reason from general horticultural knowledge, and do not fall back to
  reciting the observation text as if it answered a different question.
- Never answer with the same wording twice for two different questions
  unless they are genuinely asking the same thing.
- Speak directly to the gardener, plainly and kindly, the way Pip would —
  briefly, not as a form letter.

PKR CONTENT (reference only — use what's relevant, ignore what isn't):
${JSON.stringify(PKR_CONTENT, null, 2)}
`

const photoArg = process.argv[2] || join(__dirname, 'photos', 'sample-stem.jpg')
const question = process.argv[3] || 'Is this stem dead?'

if (!existsSync(photoArg)) {
  console.error(`Photo not found: ${photoArg}\nSee photos/README.md for what to put there.`)
  process.exit(1)
}

const imageBytes = readFileSync(photoArg)
const base64Image = imageBytes.toString('base64')
const mimeType = photoArg.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg'

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

console.log(`Calling Gemini model "${MODEL}"...\n`)

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

console.log('--- Pip (spike) would say: ---------------------------------------\n')
console.log(answer)
console.log('\n-------------------------------------------------------------------')

if (json.usageMetadata) {
  console.log('\nToken usage (for cost-checking, even though this call is on the free tier):')
  console.log(json.usageMetadata)
}

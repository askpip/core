// AskPIP — Ask Pip in your own words
//
// Built to Working/Founder Review/APP-ASK-PIP-OWN-WORDS_Proposal.md (approved by a
// Founder in chat, 19 October 2026). A gardener types a question; Gemini only
// CHOOSES which of Pip's existing answers fits, or none. It never writes an answer:
// the app shows the chosen Published answer word for word (Pip Knowledge Rules,
// rule 8).
//
// The app sends the typed question and the list of questions Pip can answer (built
// from the Published records it has loaded), and nothing about the gardener or the
// rose. The reply is accepted only if it is one of those keys or one of the three
// outcomes below. Each question is recorded in public.pip_questions for the
// Founders, with the service role, which this function uses for that table only.
//
// Limits: 20 questions a day per gardener and MONTHLY_CAP for the whole app.
//
// Checking: with the header x-pip-eval set to the token held in Vault
// (public.pip_ask_eval_token(), service role only), the function takes a batch of
// test questions, records nothing and needs no gardener.

import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

const GEMINI_MODEL = 'gemini-3.5-flash-lite'
const DAILY_LIMIT = 20
const MONTHLY_CAP = 3000
const MAX_QUESTION = 300
const MAX_CANDIDATES = 80

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-pip-eval',
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
}

interface Candidate {
  key: string
  question: string
}

type Outcome = 'match' | 'none' | 'off-topic' | 'safety'

function instruction(candidates: Candidate[]) {
  return `You sort a gardener's question into one of the questions an app called Ask Pip can already answer.
The app only helps with garden roses. You do not answer the question yourself.

Reply with JSON only: {"choice": "<one value>"}. The value must be exactly one of:
- "safety": the question is about a person or animal possibly being hurt, poisoned or unwell (for example a child or pet eating part of a plant or a spray, a spray in someone's eyes, a deep thorn wound). Choose this first whenever it applies, even if roses are mentioned.
- "off-topic": the question is not about growing or caring for roses (another plant, a vegetable, a lawn, or anything else).
- one of the keys below: the question is about roses and that listed question would answer what the gardener is asking. Use the gardener's meaning, not just shared words. Misspellings and casual wording are normal.
- "none": the question is about roses, but none of the listed questions would answer it.

If two keys could fit, choose the one that answers the main thing asked. Never invent a key.

Questions Ask Pip can answer (key: question):
${candidates.map((c) => `${c.key}: ${c.question}`).join('\n')}`
}

// The Gemini key's plan allows only a few requests a minute (found when checking,
// 19 October 2026), so a busy reply is tried again after a short wait.
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function choose(geminiKey: string, candidates: Candidate[], question: string): Promise<{ outcome: Outcome; key?: string }> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await chooseOnce(geminiKey, candidates, question)
    } catch (err) {
      const busy = /Gemini (429|503)/.test(String(err))
      if (!busy || attempt >= 2) throw err
      await sleep(2000 * (attempt + 1))
    }
  }
}

async function chooseOnce(geminiKey: string, candidates: Candidate[], question: string): Promise<{ outcome: Outcome; key?: string }> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${geminiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { role: 'system', parts: [{ text: instruction(candidates) }] },
        contents: [{ role: 'user', parts: [{ text: `Gardener's question: ${JSON.stringify(question)}` }] }],
        generationConfig: {
          temperature: 0,
          responseMimeType: 'application/json',
          responseSchema: { type: 'OBJECT', properties: { choice: { type: 'STRING' } }, required: ['choice'] },
        },
      }),
    },
  )
  const body = await res.json()
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${JSON.stringify(body).slice(0, 300)}`)
  const text = body.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? '').join('') ?? ''
  let choice = ''
  try {
    choice = String(JSON.parse(text).choice ?? '').trim()
  } catch {
    choice = ''
  }
  if (choice === 'safety' || choice === 'off-topic' || choice === 'none') return { outcome: choice }
  if (candidates.some((c) => c.key === choice)) return { outcome: 'match', key: choice }
  // Anything else is treated as no answer, never guessed at.
  return { outcome: 'none' }
}

function cleanCandidates(raw: unknown): Candidate[] {
  if (!Array.isArray(raw)) return []
  return raw
    .filter((c): c is Candidate => typeof c?.key === 'string' && typeof c?.question === 'string')
    .map((c) => ({ key: c.key.slice(0, 60), question: c.question.slice(0, 160) }))
    .slice(0, MAX_CANDIDATES)
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  try {
    const geminiKey = Deno.env.get('GEMINI_API_KEY')
    if (!geminiKey) return json({ error: 'Not set up yet.' }, 503)
    const body = await req.json()
    const candidates = cleanCandidates(body.candidates)
    if (candidates.length === 0) return json({ error: 'No questions to choose from.' }, 400)

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const admin = createClient(supabaseUrl, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

    // Checking mode: a batch of test questions, nothing recorded.
    const evalHeader = req.headers.get('x-pip-eval')
    if (evalHeader) {
      const { data: evalToken } = await admin.rpc('pip_ask_eval_token')
      if (!evalToken || evalHeader !== evalToken) return json({ error: 'Not allowed.' }, 403)
      // One at a time, within the key's per-minute limit.
      const questions: string[] = Array.isArray(body.questions) ? body.questions.slice(0, 40) : []
      const results = []
      for (const q of questions) {
        results.push(
          await choose(geminiKey, candidates, String(q).slice(0, MAX_QUESTION)).catch((err) => ({
            outcome: 'error',
            error: String(err).slice(0, 120),
          })),
        )
      }
      return json({ results })
    }

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return json({ error: 'Missing Authorization header.' }, 401)
    const asCaller = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } },
    })
    const {
      data: { user },
    } = await asCaller.auth.getUser()
    if (!user) return json({ error: 'Not signed in.' }, 401)

    const question = String(body.question ?? '').trim().slice(0, MAX_QUESTION)
    if (!question) return json({ error: 'Empty question.' }, 400)

    const now = new Date()
    const dayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString()
    const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString()
    const [{ count: today }, { count: month }] = await Promise.all([
      admin.from('pip_questions').select('id', { count: 'exact', head: true }).eq('user_id', user.id).gte('created_at', dayStart),
      admin.from('pip_questions').select('id', { count: 'exact', head: true }).gte('created_at', monthStart),
    ])
    if ((today ?? 0) >= DAILY_LIMIT || (month ?? 0) >= MONTHLY_CAP) return json({ outcome: 'limit' })

    const result = await choose(geminiKey, candidates, question)
    const { error: insertError } = await admin
      .from('pip_questions')
      .insert({ user_id: user.id, question, outcome: result.outcome, matched_key: result.key ?? null })
    if (insertError) console.error('pip_questions insert failed:', insertError)
    return json(result)
  } catch (err) {
    console.error('pip-ask error:', err)
    return json({ error: 'Something went wrong.' }, 500)
  }
})

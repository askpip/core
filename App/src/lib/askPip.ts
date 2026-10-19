import { commonQuestions, type QuestionKey } from '@/data/commonQuestions'
import { supabase } from './supabase'

/**
 * Ask Pip in your own words (APP-ASK-PIP-OWN-WORDS proposal, approved by a Founder in
 * chat, 19 October 2026). The Edge Function `pip-ask` asks an AI model to choose which
 * of these questions fits what the gardener typed. The app then shows that question's
 * Published answer word for word; the model never writes one.
 */

/**
 * The questions Pip can answer, from the Published records loaded now. A topic's lead
 * answer also has a built-in key with the same question; the built-in one is kept,
 * because it carries the topic's "More about …" answers.
 */
export function askPipCandidates(): { key: QuestionKey; question: string }[] {
  const seen = new Set<string>()
  const out: { key: QuestionKey; question: string }[] = []
  for (const q of commonQuestions()) {
    if (q.pending || q.statements.length === 0 || seen.has(q.question)) continue
    seen.add(q.question)
    out.push({ key: q.key, question: q.question })
  }
  return out
}

export type AskPipResult =
  | { outcome: 'match'; key: QuestionKey }
  | { outcome: 'none' | 'off-topic' | 'safety' | 'limit' }

/** Throws when Pip can't be reached; the caller says so. */
export async function askPip(question: string): Promise<AskPipResult> {
  const candidates = askPipCandidates()
  const { data, error } = await supabase.functions.invoke<{ outcome?: string; key?: string; error?: string }>('pip-ask', {
    body: { question, candidates },
  })
  if (error) throw error
  if (data?.outcome === 'match' && data.key && candidates.some((c) => c.key === data.key)) {
    return { outcome: 'match', key: data.key as QuestionKey }
  }
  if (data?.outcome === 'none' || data?.outcome === 'off-topic' || data?.outcome === 'safety' || data?.outcome === 'limit') {
    return { outcome: data.outcome }
  }
  throw new Error(data?.error || 'No answer returned')
}

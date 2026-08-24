/**
 * Plain-language explanations for Pip's evidence-confidence ratings —
 * verbatim, Founder-approved wording from PKR-DEF-000001 through
 * PKR-DEF-000005, all **Published** 24 August 2026 (content approved 23
 * August 2026).
 *
 * See Working/AI Outputs/PKR-DEF-EVIDENCE-CONFIDENCE-submission.md. If that
 * record's approved wording changes, this needs updating to match.
 */
export type ConfidenceLevel = 'Very High' | 'High' | 'Moderate' | 'Low' | 'Very Low'

export const CONFIDENCE_LEVELS: ConfidenceLevel[] = ['Very High', 'High', 'Moderate', 'Low', 'Very Low']

export const CONFIDENCE_EXPLANATIONS: Record<ConfidenceLevel, string> = {
  'Very High':
    'This means the evidence behind this is extensive, reliable and consistent, with very little left in question. You can rely on it with a high degree of confidence.',
  High: "This means the evidence behind this is reliable and generally consistent. There may be small gaps, but they're not enough to seriously doubt it.",
  Moderate:
    "This means the available evidence reasonably supports this information, but some real limitations or open questions remain. It's good information — worth using, just with a little extra care.",
  Low: 'This means the evidence behind this is limited. Treat it as a helpful pointer rather than something to rely on heavily on its own.',
  'Very Low':
    "This means there's only minimal evidence behind this information. It shouldn't be relied on without more evidence.",
}

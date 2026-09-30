/**
 * Pip's evidence-confidence levels. The plain-language explanation of each
 * level is PKR-DEF-000001 to 000005 in the Live Intelligence Library, read
 * through data/pkr.ts; it is re-exported here so existing imports keep working.
 */
export type ConfidenceLevel = 'Very High' | 'High' | 'Moderate' | 'Low' | 'Very Low'

export const CONFIDENCE_LEVELS: ConfidenceLevel[] = ['Very High', 'High', 'Moderate', 'Low', 'Very Low']

export { CONFIDENCE_EXPLANATIONS } from './pkr'

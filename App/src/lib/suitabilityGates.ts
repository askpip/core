/**
 * Runtime evaluation of AskPIP's Suitability Gates — the branching safety
 * checks defined by Founder-approved Suitability/Observation/Decision Logic
 * PKRs. Per PKR Standard §9.1 ("Declarative Content Only"), this module is
 * general-purpose retrieval/evaluation logic — it does not itself decide
 * what counts as "established" or "too recent." Every threshold, question,
 * and acceptable answer below is transcribed directly from the published
 * PKR content; if the evidence behind those thresholds ever changes, the
 * PKR is revised first and this file is updated to match it, never the
 * other way around.
 *
 * Currently wires in PKR-SGT-000002 (Recently Planted) only. PKR-SGT-000001
 * (Dormancy) is still Draft — Dependency-Blocked, so Journey.tsx's dormancy
 * checklist item is deliberately left as a static self-attestation item
 * until that gate actually publishes.
 */

/** PKR-SGT-000002, Primary Question — the gardener's answer, or that they don't know. */
export type RecentlyPlantedPrimaryAnswer = 'established' | 'recent' | 'unknown'

/**
 * PKR-SGT-000002, Fallback Check — the three AF-2 signals, asked only when
 * the planting date is unknown. Each is a plain reading of "does this
 * support 'established'?", matching the PKR's two-row-per-signal table.
 */
export interface RecentlyPlantedFallbackSignals {
  activeNewGrowth: boolean
  caneCountAboveBaseline: boolean
  baseFeelsFirm: boolean
}

export type RecentlyPlantedGateResult =
  | { status: 'established'; allowedObservationIds: 'all' }
  | { status: 'restricted'; allowedObservationIds: string[]; reason: string }

/**
 * Observation ids (see data/observationScript.ts) permitted when the gate
 * restricts to dead-wood-only. Per AF-1, dead wood removal is explicitly
 * exempted from the "wait until established" finding — see PKR-SGT-000002
 * §4, "Why Dead Wood Is Exempted." This gate does not govern
 * PKR-DEC-000001 at all; it only controls which observations are offered.
 */
const DEAD_WOOD_ONLY_OBSERVATION_IDS = ['dead-wood']

/**
 * Evaluates PKR-SGT-000002's Primary Question:
 * "Do you know approximately when this rose was planted? If so, has it
 * been growing in this spot for about three years or more?"
 *
 * Mirrors the PKR's 3-row Acceptable Answer(s) table exactly:
 *   established (>= 3 years) -> gate passes, all observations proceed
 *   recent (< 3 years)       -> restricted to dead wood only
 *   unknown                  -> falls through to the Fallback Check
 */
export function evaluateRecentlyPlantedPrimary(
  answer: RecentlyPlantedPrimaryAnswer,
): RecentlyPlantedGateResult | 'needs-fallback' {
  if (answer === 'established') {
    return { status: 'established', allowedObservationIds: 'all' }
  }
  if (answer === 'recent') {
    return {
      status: 'restricted',
      allowedObservationIds: DEAD_WOOD_ONLY_OBSERVATION_IDS,
      reason:
        "This rose hasn't been in the ground long enough yet for the full check, so we'll only look at dead wood today.",
    }
  }
  return 'needs-fallback'
}

/**
 * Evaluates PKR-SGT-000002's Fallback Check, used only when the planting
 * date is unknown. Per the PKR: "Gate passes ... only if all three signals
 * support 'established.'" There is deliberately no majority-rules
 * shortcut — this reflects the Founder's explicit instruction that the app
 * must not guess on this safety-relevant determination, so a single "no"
 * or "not sure" signal falls through to the conservative, restricted
 * outcome rather than being outvoted by the other two.
 */
export function evaluateRecentlyPlantedFallback(
  signals: RecentlyPlantedFallbackSignals,
): RecentlyPlantedGateResult {
  const allSupportEstablished =
    signals.activeNewGrowth && signals.caneCountAboveBaseline && signals.baseFeelsFirm

  if (allSupportEstablished) {
    return { status: 'established', allowedObservationIds: 'all' }
  }

  return {
    status: 'restricted',
    allowedObservationIds: DEAD_WOOD_ONLY_OBSERVATION_IDS,
    reason:
      "We can't confirm this rose is established enough yet, so we'll only look at dead wood today, to stay safe.",
  }
}

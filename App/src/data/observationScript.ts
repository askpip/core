import type { ConfidenceLevel } from './confidenceDefinitions'

/**
 * The guided observation sequence, drawn directly from Marie's Story
 * (MVP/Stories/Maries_Story.md, Chapter 3) and the supported-observation set
 * defined in the Bush Rose V1 Architecture (MVP/Architecture, section 5.2).
 */
export interface ObservationSource {
  title: string
  publisher: string
  url: string
}

export interface ScriptedObservation {
  id: string
  feature: string
  pipProposal: string
  comparisonNote: string
  /** How Marie resolved it in the approved story, offered as the default path through the prototype. */
  suggestedOutcome: 'confirmed' | 'corrected' | 'unresolved'
  suggestedNote: string
  /**
   * Real, Founder-approved evidence-confidence and sources exist only for
   * the dead-wood observation so far — see PKR-OBS-000001's per-signal
   * Evidence Confidence and PKR-SRC-000001 through 000015 (Published 23
   * August 2026). The other three observations below are still the
   * unresearched placeholder text this prototype started from, so they're
   * left without a rating or sources rather than inventing ones with no
   * real research behind them yet.
   */
  confidenceLevel?: ConfidenceLevel
  sources?: ObservationSource[]
}

export const observationScript: ScriptedObservation[] = [
  {
    id: 'dead-wood',
    feature: 'Dead versus living wood',
    pipProposal:
      "This stem may be dead. It looks darker than the growth beside it, and I can't see a healthy bud in the photograph. Can you find the same stem on the rose and look at it closely?",
    comparisonNote: 'Approved comparison: dead wood vs. living wood, beginner-appropriate reference.',
    suggestedOutcome: 'confirmed',
    suggestedNote: 'Yes. I can see those signs on the rose — dry and brittle, no healthy buds.',
    // This proposal rests on two signals from PKR-OBS-000001: external
    // bark colour (AF-2) and dormant bud presence (AF-3) — both rated
    // Moderate confidence there. That record's own Status is still "Draft —
    // Dependency-Blocked" (blocked on a missing Comparison Image PKR, which
    // has nothing to do with these two signals' rating), but its content
    // was Founder-approved 23 August 2026.
    confidenceLevel: 'Moderate',
    sources: [
      {
        title: 'Rose pruning: general tips',
        publisher: 'Royal Horticultural Society',
        url: 'https://www.rhs.org.uk/plants/roses/pruning-guide',
      },
      {
        title: 'Pruning Roses',
        publisher: 'Colorado State University Extension (PlantTalk Colorado)',
        url: 'https://planttalk.colostate.edu/topics/trees-shrubs-vines/1763-pruning-roses/',
      },
      {
        title: 'Pruning',
        publisher: 'University of Illinois Extension',
        url: 'https://extension.illinois.edu/roses/pruning',
      },
      {
        title: 'Pruning Roses',
        publisher: 'Clemson University Cooperative Extension (HGIC)',
        url: 'https://hgic.clemson.edu/factsheet/pruning-roses/',
      },
      {
        title: 'How to Prune Roses',
        publisher: 'Iowa State University Extension and Outreach',
        url: 'https://yardandgarden.extension.iastate.edu/how-to/how-prune-roses',
      },
      {
        title: 'Basic Pruning Principles',
        publisher: 'American Rose Society',
        url: 'https://rose.org/basic-pruning-principles/',
      },
    ],
  },
  {
    id: 'crossing-stems',
    feature: 'Crossing or rubbing stems',
    pipProposal:
      'These two stems appear to cross. Can you follow both stems with your hands and find the point where they touch?',
    comparisonNote: 'Approved comparison: rubbing growth and the damage it can cause over time.',
    suggestedOutcome: 'confirmed',
    suggestedNote: 'They are rubbing.',
  },
  {
    id: 'inward-stem',
    feature: 'Inward-growing stems',
    pipProposal:
      'This stem may be growing into the centre of the rose. Can you check the actual angle and the space around it?',
    comparisonNote: 'Approved comparison: inward growth versus open space, shown from multiple angles.',
    suggestedOutcome: 'corrected',
    suggestedNote: 'It only looks inward from that angle. There is open space around it.',
  },
  {
    id: 'hidden-stem',
    feature: 'The main framework to retain',
    pipProposal:
      'This thick stem near the base is partly hidden by surrounding growth. Can you trace it through the congestion?',
    comparisonNote: 'Approved comparison: framework stems and how to trace them through congested growth.',
    suggestedOutcome: 'unresolved',
    suggestedNote: "I can't confirm this one — it stays unresolved.",
  },
]

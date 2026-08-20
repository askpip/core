/**
 * The guided observation sequence, drawn directly from Marie's Story
 * (MVP/Stories/Maries_Story.md, Chapter 3) and the supported-observation set
 * defined in the Bush Rose V1 Architecture (MVP/Architecture, section 5.2).
 */
export interface ScriptedObservation {
  id: string
  feature: string
  pipProposal: string
  comparisonNote: string
  /** How Marie resolved it in the approved story, offered as the default path through the prototype. */
  suggestedOutcome: 'confirmed' | 'corrected' | 'unresolved'
  suggestedNote: string
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

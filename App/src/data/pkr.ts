/**
 * PKR data module: the gardener-facing content of every Published PKR the
 * pruning journey uses, transcribed from Working/AI Outputs/PKR-*-submission.md.
 *
 * PKR Standard §9.1 (Declarative Content Only): this file holds content and
 * metadata only. Journey.tsx decides nothing about horticulture. It reads
 * these records and routes on the answers they define.
 *
 * Only records with status 'Published' are exposed. Everything the app reads
 * goes through the `published*` accessors at the bottom, which filter on
 * status. A record added here as 'Draft' is therefore invisible to the app
 * until its status is changed after Founder approval. If a record's approved
 * wording changes, update the PKR first, then this file to match.
 */
import type { ConfidenceLevel } from './confidenceDefinitions'
import { PKR_SOURCES, PKR_SUPPORTING_SOURCES, type PkrSource } from './pkrSources'
import type { Choice, SavedRoseType } from '@/lib/types'

export type PkrStatus = 'Published' | 'Draft'

export interface PkrMeta {
  id: string
  version: string
  status: PkrStatus
}

/** Confidence as shown to the gardener: one of the five levels, or an approved default / structural item. */
export type ShownConfidence = ConfidenceLevel | 'Approved default'

export interface Statement {
  text: string
  confidence?: ShownConfidence
}

// ---------------------------------------------------------------------------
// Suitability Gates
// ---------------------------------------------------------------------------

/** PKR-SGT-000003 v1.0 — rose type. */
export const ROSE_TYPE_GATE = {
  pkr: { id: 'PKR-SGT-000003', version: '1.0', status: 'Published' } as PkrMeta,
  question:
    'Do you know what type of rose this is — from its label or pot tag, a receipt or nursery listing, or someone experienced who has told you?',
  answers: [
    { id: 'hybrid-tea', label: 'Hybrid Tea (large-flowered)', passes: true },
    { id: 'floribunda', label: 'Floribunda (cluster-flowered)', passes: true },
    { id: 'grandiflora', label: 'Grandiflora', passes: true },
    { id: 'excluded', label: 'Another type (shrub, English, patio, miniature, groundcover, climbing or rambling, standard, old garden or species rose)', passes: false },
    { id: 'bush-only', label: 'The label only says "bush rose" or "rose bush"', passes: false },
    { id: 'variety-only', label: 'I know its variety name but not its type', passes: false },
    { id: 'unknown', label: "I don't know", passes: false },
  ] as const,
  grandifloraNote:
    'Grandiflora is supported provisionally. It gets the same guidance as a Hybrid Tea; there is no Grandiflora-specific advice.',
  roseFinder: {
    text: "The New Zealand Rose Society's Rose Finder lists a type for each rose it holds. Look the name up there, then answer this question again. If you can't find it, the answer is the same as \"I don't know\".",
    url: PKR_SOURCES['PKR-SRC-000033']?.url,
    confidence: 'Moderate' as ConfidenceLevel,
  },
  journalOnly: {
    base: "I can't yet help prune this rose. My pruning guidance so far covers only Hybrid Tea, Floribunda and Grandiflora bush roses.",
    excluded: "That type isn't one my pruning guidance covers yet.",
    bushOnly: '"Bush" on a label doesn\'t say which type a rose is — garden retailers use it for patio, shrub and groundcover roses too.',
    unknown:
      "Without a confirmed type I can't be sure the guidance fits, and I don't try to identify roses from photos, because that's unreliable even for experts.",
    keep: 'Your rose stays in your garden list as a journal: photos, notes and history all remain available. If you later confirm it is a Hybrid Tea, Floribunda or Grandiflora, you can answer this question again.',
    help: 'If you want the type identified, a local rose society or an experienced rose grower is the best place to ask.',
  },
}

export type RoseTypeAnswerId = (typeof ROSE_TYPE_GATE.answers)[number]['id']

/** Short name for gardener copy ("your Hybrid Tea…", or "your rose"), never "bush rose". */
export function roseTypeName(type?: SavedRoseType): string {
  return type === 'hybrid-tea' ? 'Hybrid Tea' : type === 'floribunda' ? 'Floribunda' : type === 'grandiflora' ? 'Grandiflora' : 'rose'
}

export function roseTypePasses(type?: SavedRoseType): boolean {
  return type === 'hybrid-tea' || type === 'floribunda' || type === 'grandiflora'
}

/** Labels for the saved types, for showing and changing on the plant page. */
export const SAVED_ROSE_TYPE_LABELS: Record<SavedRoseType, string> = {
  'hybrid-tea': 'Hybrid Tea',
  floribunda: 'Floribunda',
  grandiflora: 'Grandiflora (provisional)',
  excluded: 'Another type (not supported for pruning yet)',
  'bush-only': 'Label only says "bush rose"',
  unknown: "Don't know",
}

/** PKR-SGT-000001 v1.1 — dormancy (structural pruning only). */
export const DORMANCY_GATE = {
  pkr: { id: 'PKR-SGT-000001', version: '1.1', status: 'Published' } as PkrMeta,
  question:
    "Look closely at the dormant buds along your rose's canes. Has active new growth already begun — buds swelling, breaking open, or new leaves emerging anywhere on the plant — or does the plant still appear dormant?",
  caveat:
    'If your climate is mild or unusually warm, judge this by bud state specifically — not by whether the leaves have dropped. In milder climates a rose doesn\'t always lose all its leaves, and buds can sometimes break earlier than expected.',
  answers: {
    dormant: 'Still dormant — buds are tight and closed, or just beginning to swell; no new leaves have opened anywhere',
    growing: 'Active new growth is already well underway — leaves have opened and new shoots are clearly growing',
    notSure: 'Not sure',
  },
  notSureFallback:
    "That's alright — have another look at the buds specifically, not the leaves: are they still tight and closed, or have any started to swell or open? If you're still not certain after a closer look, the safest choice is to treat the rose as not quite ready yet, and check back in a week or two.",
  /** §2.1 removal-only session. */
  removalOnly: {
    intro: {
      text: 'Your rose is already growing, so this is not the time for full pruning. Pruning hard now can cost you flowers. But you can still remove wood that is dead, damaged or diseased.',
      confidence: 'Moderate' as ConfidenceLevel,
    },
    notSureIntro:
      "Since we can't be sure your rose is still dormant, we'll leave full pruning for now — check back in a week or two. You can still remove wood that is dead, damaged or diseased today.",
    conditions: [
      { text: "Remove only the wood you've confirmed. Don't shorten or shape healthy canes today.", confidence: 'Moderate' },
      { text: 'Go gently and avoid damaging the new leaves and shoots.', confidence: 'Low' },
      { text: 'Cut back until the pith is white or pale green, exactly as at any other time.', confidence: 'Moderate' },
      {
        text: 'For anything that looks like canker or disease, the usual care applies: cut well below the affected part, clean your blades, and bin the prunings.',
        confidence: 'High',
      },
    ] as Statement[],
    lateSeason: {
      text: 'Late in the season (advice only): sources advise against pruning late in the growing season, because it can encourage new growth that winter cold may damage. Diseased wood is the exception — remove it whenever you find it. Sources don\'t say whether dead (as distinct from diseased) wood is exempt.',
      confidence: 'High' as ConfidenceLevel,
    },
  },
}

/** PKR-SGT-000002 v1.0 — recently planted (evaluation logic lives in lib/suitabilityGates.ts). */
export const RECENTLY_PLANTED_GATE = {
  pkr: { id: 'PKR-SGT-000002', version: '1.0', status: 'Published' } as PkrMeta,
}

// ---------------------------------------------------------------------------
// Observations and Decision Logic
// ---------------------------------------------------------------------------

/** Which kind of cut a Cut choice is — selects the part of PKR-CGD-000002 shown (its own Presentation Points). */
export type CutKind = 'dead-wood' | 'remove-stem' | 'shorten' | 'sucker'

export interface DecisionOption {
  choice: Choice
  label: string
  cutKind?: CutKind
}

export interface ObservationDef {
  /** Stable key, also the `feature` saved with each observation record. */
  key: string
  feature: string
  obs: PkrMeta
  dec: PkrMeta
  /** What Pip asks the gardener to look for. */
  lookFor: string
  criteria: Statement[]
  photoLimit: string
  confirmQuestion: string
  confirmLabel: string
  doesntMatchLabel: string
  /** 'none': not present, never reaches a decision. 'decide': a different, defined decision path (framework old wood). */
  doesntMatchRoute: 'none' | 'decide'
  doesntMatchNote?: string
  notSureGuidance: string
  /** Choices offered when still not sure. Never includes 'cut'. */
  notSureChoices: DecisionOption[]
  anyMoreQuestion: string
  /** Decision after Confirmed. */
  choices: DecisionOption[]
  decisionNotes: Statement[]
  /** Decision after Doesn't Match, only when doesntMatchRoute === 'decide'. */
  doesntMatchChoices?: DecisionOption[]
  doesntMatchNotes?: Statement[]
  /** Rows shown with a Cut in the removal-only session (PKR-SGT-000001 v1.1 §2.1). */
  headlineConfidence: ConfidenceLevel
  /** Allowed when PKR-SGT-000001 does not pass (removal-only session). */
  allowedAfterBudBreak: boolean
  /** Allowed when PKR-SGT-000002 restricts the journey. */
  allowedWhenRecentlyPlanted: boolean
  /** Counts toward PKR-CGD-000001/000003 presentation (applies to DEC-000001 to 000006 only). */
  cutCareGuidance: boolean
}

const DEFAULT_NOT_SURE: DecisionOption[] = [
  { choice: 'decide-later', label: 'Decide later' },
  { choice: 'get-help', label: 'Get experienced local help' },
]

const STANDARD_CHOICES = (cutLabel: string, cutKind: CutKind): DecisionOption[] => [
  { choice: 'cut', label: cutLabel, cutKind },
  { choice: 'leave', label: 'Leave' },
  { choice: 'decide-later', label: 'Decide later' },
  { choice: 'get-help', label: 'Get experienced local help' },
]

/** In the order the journey works through them (PKR-DEC-000006 v1.1 order of work). */
const OBSERVATIONS: ObservationDef[] = [
  {
    key: 'dead-wood',
    feature: 'Dead versus living wood',
    obs: { id: 'PKR-OBS-000001', version: '1.0', status: 'Published' },
    dec: { id: 'PKR-DEC-000001', version: '1.1', status: 'Published' },
    lookFor:
      "Let's look for dead wood. Dead canes are usually brown, grey, black or shrivelled rather than green, and have no plump buds anywhere along them.",
    criteria: [
      { text: 'Bark colour: green suggests living; brown, grey, black or shrivelled suggests dead. Older or bronze canes can mislead.', confidence: 'Moderate' },
      { text: 'Buds: plump visible buds suggest living; none anywhere suggests dead.', confidence: 'Moderate' },
      { text: 'Sunken patches or lesions may be canker, not routine dead wood.', confidence: 'Low' },
      { text: 'The surest check is the pith once cut: white or pale green is living; brown, grey or black is dead.', confidence: 'High' },
      { text: 'A living cane bends; a dead one is brittle and snaps.', confidence: 'Low' },
    ],
    photoLimit: "A photo can't show the pith inside the cane or how it bends — check those on the plant.",
    confirmQuestion: 'Find that cane on your rose and look at it closely. Is it dead?',
    confirmLabel: 'Yes, it looks dead',
    doesntMatchLabel: "No — it's living wood",
    doesntMatchRoute: 'none',
    notSureGuidance:
      'Look again at the cane on the plant itself — its buds and its bark colour, right down low.',
    notSureChoices: DEFAULT_NOT_SURE,
    anyMoreQuestion: 'Can you see any more dead canes?',
    choices: STANDARD_CHOICES('Cut', 'dead-wood'),
    decisionNotes: [
      { text: 'Remove it back into living tissue — white or pale-green pith and green bark — not just to the first sign of dead tissue.', confidence: 'High' },
      { text: 'If dieback carries on after repeated cuts, keep going toward the bud union, or remove the whole cane.', confidence: 'Moderate' },
    ],
    headlineConfidence: 'High',
    allowedAfterBudBreak: true,
    allowedWhenRecentlyPlanted: true,
    cutCareGuidance: true,
  },
  {
    key: 'damaged-growth',
    feature: 'Damaged growth',
    obs: { id: 'PKR-OBS-000004', version: '1.0', status: 'Published' },
    dec: { id: 'PKR-DEC-000004', version: '1.1', status: 'Published' },
    lookFor:
      "Now let's look for damaged growth — canes that are injured or diseased but not simply dead.",
    criteria: [
      { text: 'Canker: tan to purplish-brown sunken patches with cracking edges, tiny black dots, or dieback above a patch that rings the cane.', confidence: 'High' },
      { text: 'Frost or winter injury: browned or blackened tips and discoloured canes. Confirming it needs a cut into the pith.', confidence: 'Moderate' },
      { text: 'Physical damage: a visibly broken cane, or worn, rubbed bark where canes touch.', confidence: 'Low' },
      { text: 'Borer: a new tip that suddenly wilts, an entry hole, or slight swelling. A hole in the end of an old pruning cut is often a harmless wasp nest.', confidence: 'Low' },
      { text: 'Not damage: mossy or spiny insect galls are generally harmless, and red, purple or yellow spots on young canes can be their normal colour.', confidence: 'Moderate' },
    ],
    photoLimit: "A photo can show outside signs, but not what's happening inside the cane. If it's unclear, look closely at the plant rather than taking another photo.",
    confirmQuestion: 'Find that cane on your rose. Can you see damage like this?',
    confirmLabel: 'Yes, I can see damage',
    doesntMatchLabel: "No — it's not damaged",
    doesntMatchRoute: 'none',
    notSureGuidance: 'Look closely at that spot on the plant itself, not at a photo.',
    notSureChoices: DEFAULT_NOT_SURE,
    anyMoreQuestion: 'Can you see any more damaged stems?',
    choices: STANDARD_CHOICES('Cut', 'remove-stem'),
    decisionNotes: [
      { text: 'Cut the damaged cane back until you reach healthy wood: white or pale-green pith. Brown, black or grey means keep cutting a little further down.', confidence: 'High' },
      { text: 'Slight damage: shorten just to healthy wood. Severe damage, or no living pith or buds below it: remove the whole cane at its base.', confidence: 'Moderate' },
      { text: 'If it looks like canker or disease: cut well below the patch (commonly 2–3 inches, about 5–8 cm), clean your blades between cuts, and bin or burn the prunings.', confidence: 'Moderate' },
      { text: 'If it looks like borer damage: cut below the damaged part until the pith is white or the hole is gone, then seal the fresh cut.', confidence: 'Moderate' },
      { text: 'Frost or winter damage often doesn\'t show its full extent straight away. Sources advise waiting until live growth is emerging, so "Decide later" is the recommended choice for a frost-damaged cane. When you come back, I\'ll help you remove it even if the rose is growing.', confidence: 'Moderate' },
      { text: 'Leave: sources advise cutting confirmed damage back to healthy wood.', confidence: 'High' },
    ],
    headlineConfidence: 'High',
    allowedAfterBudBreak: true,
    allowedWhenRecentlyPlanted: false,
    cutCareGuidance: true,
  },
  {
    key: 'crossing-stems',
    feature: 'Crossing or rubbing stems',
    obs: { id: 'PKR-OBS-000002', version: '1.0', status: 'Published' },
    dec: { id: 'PKR-DEC-000002', version: '1.0', status: 'Published' },
    lookFor: "Next, let's look for stems that cross each other or rub together.",
    criteria: [
      { text: 'A stem crossing another is a candidate. Crossing and rubbing are looked for together.', confidence: 'Moderate' },
      { text: 'Bark damage, wear or a flattened face where two stems touch: treat as rubbing.', confidence: 'Approved default' },
      { text: 'Stems close together with no contact or wear: treat as crossing, not rubbing.', confidence: 'Approved default' },
    ],
    photoLimit: "One photo can't reliably show whether two stems actually touch. Look from several sides.",
    confirmQuestion: 'Follow both stems with your hands. Do they cross or touch?',
    confirmLabel: 'Yes, they cross or rub',
    doesntMatchLabel: "No — they don't",
    doesntMatchRoute: 'none',
    notSureGuidance: 'Take another photo from a different angle, and look again from another side.',
    notSureChoices: DEFAULT_NOT_SURE,
    anyMoreQuestion: 'Can you see any more crossing or rubbing stems?',
    choices: STANDARD_CHOICES('Cut', 'remove-stem'),
    decisionNotes: [
      { text: 'Remove the crossing or rubbing stem as ordinary dormant pruning.', confidence: 'High' },
      { text: "Remove it completely, back to where it starts (the ground, the bud union, or the larger cane it grows from). Don't just shorten it.", confidence: 'Moderate' },
      { text: 'If you need to choose which one, the few sources that give a rule say remove the weaker, thinner one and keep the stronger one.', confidence: 'Low' },
      { text: "Why: stems rubbing together damage each other's bark, which lets disease in.", confidence: 'Moderate' },
      { text: "Take care not to damage the stem you're keeping; cut a tangled stem out in sections rather than pulling it whole.", confidence: 'Approved default' },
    ],
    headlineConfidence: 'High',
    allowedAfterBudBreak: false,
    allowedWhenRecentlyPlanted: false,
    cutCareGuidance: true,
  },
  {
    key: 'inward-stem',
    feature: 'Inward-growing stems',
    obs: { id: 'PKR-OBS-000003', version: '1.0', status: 'Published' },
    dec: { id: 'PKR-DEC-000003', version: '1.0', status: 'Published' },
    lookFor: "Now let's look for stems growing into the centre of the bush.",
    criteria: [{ text: 'A stem growing toward the centre of the bush is a candidate. No source gives a more specific sign.', confidence: 'Low' }],
    photoLimit: "One photo has real limits for judging which way a stem grows. Look from more than one side.",
    confirmQuestion: 'Check the stem on your rose from more than one side. Is it growing into the centre?',
    confirmLabel: 'Yes, it grows inward',
    doesntMatchLabel: "No — it doesn't",
    doesntMatchRoute: 'none',
    notSureGuidance: 'Take another photo that shows the middle of the bush more clearly, and look again from another side.',
    notSureChoices: DEFAULT_NOT_SURE,
    anyMoreQuestion: 'Can you see any more stems growing inward?',
    choices: STANDARD_CHOICES('Cut', 'remove-stem'),
    decisionNotes: [
      { text: 'Remove a confirmed inward-growing stem the same way as a crossing stem. Few sources cover this, but none disagrees.', confidence: 'Low' },
      { text: "Remove it completely, back to where it starts. Don't just shorten it.", confidence: 'Moderate' },
    ],
    headlineConfidence: 'Low',
    allowedAfterBudBreak: false,
    allowedWhenRecentlyPlanted: false,
    cutCareGuidance: true,
  },
  {
    key: 'weak-congested',
    feature: 'Weak or congested growth',
    obs: { id: 'PKR-OBS-000005', version: '1.0', status: 'Published' },
    dec: { id: 'PKR-DEC-000005', version: '1.1', status: 'Published' },
    lookFor:
      "Let's look for weak canes — thinner than a pencil, twiggy or unproductive — and at whether the middle of the bush is crowded.",
    criteria: [
      { text: 'A cane thinner than about a pencil is a candidate weak cane. No number is used.', confidence: 'Moderate' },
      { text: 'Twiggy or unproductive growth, with thin tips rather than full, lush canes.', confidence: 'Moderate' },
      { text: 'Crowded: the bush is densely packed, especially at ground level, rather than open in the middle.', confidence: 'Moderate' },
      { text: "A thin cane with brown or reddish thorns may be this season's new growth rather than a weak cane.", confidence: 'Low' },
    ],
    photoLimit: "Without a size reference, thickness can't be judged from a photo — hold a coin or pencil beside the cane. No photo can rule out crowding at the back of the bush.",
    confirmQuestion: 'Check the cane against a pencil, and look at the middle of the bush from more than one side. Is it weak, or is the bush crowded?',
    confirmLabel: 'Yes, weak or crowded',
    doesntMatchLabel: 'No',
    doesntMatchRoute: 'none',
    notSureGuidance: 'Take a photo with a coin or pencil beside the cane, or look at the middle from another side, then check again.',
    notSureChoices: DEFAULT_NOT_SURE,
    anyMoreQuestion: 'Can you see any more weak canes?',
    choices: STANDARD_CHOICES('Cut', 'remove-stem'),
    decisionNotes: [
      { text: "Weak cane: remove it completely, at its base or where it starts. Don't shorten it.", confidence: 'High' },
      { text: 'Crowded bush: remove whole canes, never part-shorten one. Keep the strongest, then aim for even spacing and an open, airy centre.', confidence: 'High' },
      { text: 'Keep roughly 3–7 strong canes, 4–6 typical, and fewer for a modest or young plant.', confidence: 'Moderate' },
      { text: 'If the plant already looks weak or small, prune it lightly.', confidence: 'Moderate' },
      { text: "In hot-summer areas, leave some growth in the middle to shade the graft. Don't clear all the crowding at once.", confidence: 'Moderate' },
      { text: 'Reaching inside the bush, wear eye protection and long-cuffed gloves.', confidence: 'Moderate' },
    ],
    headlineConfidence: 'High',
    allowedAfterBudBreak: false,
    allowedWhenRecentlyPlanted: false,
    cutCareGuidance: true,
  },
  {
    key: 'rootstock-sucker',
    feature: 'Rootstock suckers',
    obs: { id: 'PKR-OBS-000007', version: '1.0', status: 'Published' },
    dec: { id: 'PKR-DEC-000007', version: '1.0', status: 'Published' },
    lookFor:
      "Let's check for suckers. A sucker is a shoot from the rootstock your rose was grafted onto, below the bud union — the knobbly join near the base. It isn't your rose's own new cane.",
    criteria: [
      { text: "Where the shoot starts is the deciding check: below the bud union is a sucker; at the union or just above it is your rose's own new cane, which you keep.", confidence: 'High' },
      { text: 'A sucker can start below the soil, sometimes a little away from the plant.', confidence: 'High' },
      { text: 'Planting depth varies, so the bud union may be above, at or below the soil.', confidence: 'Moderate' },
    ],
    photoLimit: "A photo can't show where a shoot starts, especially under the soil. I never decide a shoot is a sucker from a photo.",
    confirmQuestion: 'Follow the shoot down with your fingers. Does it start below the bud union, or at or above it?',
    confirmLabel: 'Below the bud union',
    doesntMatchLabel: 'At or above the bud union',
    doesntMatchRoute: 'none',
    doesntMatchNote: "That's your rose's own new cane. Keep it — the rose's own basal canes are valuable. It's considered in the framework step.",
    notSureGuidance:
      "That's alright. It's easy to confuse these, even for experienced gardeners. Look again at where the shoot starts, on the plant, not in a photo.",
    notSureChoices: [
      { choice: 'leave', label: 'Leave it' },
      { choice: 'decide-later', label: 'Decide later' },
      { choice: 'get-help', label: 'Get experienced local help' },
    ],
    anyMoreQuestion: 'Can you see any more shoots like this coming from the base?',
    choices: [
      { choice: 'cut', label: 'Remove the sucker where it starts', cutKind: 'sucker' },
      { choice: 'leave', label: 'Leave' },
      { choice: 'decide-later', label: 'Decide later' },
      { choice: 'get-help', label: 'Get experienced local help' },
    ],
    decisionNotes: [
      { text: 'Suckers draw strength from your rose and, left alone, can take it over.', confidence: 'High' },
      { text: "Remove it early, while it's young — it's easier then.", confidence: 'High' },
      { text: 'Leave: sources advise removing confirmed suckers, because they weaken the rose.', confidence: 'High' },
      { text: 'If suckers keep coming back after removal, get experienced local help.', confidence: 'Low' },
    ],
    headlineConfidence: 'High',
    allowedAfterBudBreak: true,
    allowedWhenRecentlyPlanted: false,
    cutCareGuidance: false,
  },
  {
    key: 'framework',
    feature: 'The main framework to retain',
    obs: { id: 'PKR-OBS-000006', version: '1.1', status: 'Published' },
    dec: { id: 'PKR-DEC-000006', version: '1.1', status: 'Published' },
    lookFor:
      "Finally, let's choose the framework to keep: the strong canes spread around the base that will form the shape of your rose.",
    criteria: [
      { text: 'Keeper canes: strong, healthy, vigorous canes, generally the younger ones.', confidence: 'Moderate' },
      { text: 'Target shape: an open centre, with kept canes spread evenly around the base, like a vase or the spokes of a wheel.', confidence: 'High' },
      { text: 'Old wood: grey, rough, scaly or crusty bark, sometimes with worn prickles.', confidence: 'Moderate' },
      { text: 'New shoots from the base are a sign of good health and a way to renew the framework.', confidence: 'Low' },
      { text: "Keep your rose's own new canes from the base. First check where each starts: a shoot from below the bud union is a sucker.", confidence: 'High' },
    ],
    photoLimit: "A photo can show the outline, but not how vigorous a cane really is, the pith, or the base close up. Check those by hand.",
    confirmQuestion: 'Check this cane on your rose, down to the base. Is it a strong framework cane?',
    confirmLabel: "Yes, it's a strong cane",
    doesntMatchLabel: "No — it's old, grey or unproductive",
    doesntMatchRoute: 'decide',
    notSureGuidance: 'Look at the base close up and gently check the cane.',
    notSureChoices: [
      { choice: 'leave', label: 'Keep it for now and reassess next pruning' },
      { choice: 'decide-later', label: 'Decide later' },
      { choice: 'get-help', label: 'Get experienced local help' },
    ],
    anyMoreQuestion: 'Are there any more canes to check?',
    choices: [
      { choice: 'cut', label: 'Keep it, and shorten it', cutKind: 'shorten' },
      { choice: 'leave', label: 'Keep it as it is' },
      { choice: 'decide-later', label: 'Decide later' },
      { choice: 'get-help', label: 'Get experienced local help' },
    ],
    decisionNotes: [
      { text: 'Keep the strong, healthy canes spread around the base, aiming for an open centre.', confidence: 'High' },
      { text: 'Keep roughly 3–7 canes, 4–6 typical, and fewer for a modest or young plant.', confidence: 'Moderate' },
      { text: 'Shorten kept canes by roughly a third to a half. Hybrid Teas are cut lower, or to fewer canes, than Floribundas. Grandifloras are pruned as Hybrid Teas.', confidence: 'Moderate' },
    ],
    doesntMatchChoices: [
      { choice: 'cut', label: 'Remove this old cane at its base', cutKind: 'remove-stem' },
      { choice: 'leave', label: 'Leave' },
      { choice: 'decide-later', label: 'Decide later' },
      { choice: 'get-help', label: 'Get experienced local help' },
    ],
    doesntMatchNotes: [
      { text: 'Remove old, grey, unproductive canes at their base, in favour of younger ones.', confidence: 'Moderate' },
      { text: 'Renewing an old bush: remove about a third of the old canes each year, over several years, rather than all at once.', confidence: 'Low' },
      { text: 'For a badly overgrown, weak or sickly bush, experienced local help is worth asking — such a bush is sometimes better replaced.', confidence: 'Low' },
    ],
    headlineConfidence: 'High',
    allowedAfterBudBreak: false,
    allowedWhenRecentlyPlanted: false,
    cutCareGuidance: true,
  },
]

/** PKR-OBS-000007 extra confirmation steps (visible bud union; D6). */
export const SUCKER_STEPS = {
  hasShoot: "Is there a shoot coming from the base of your rose, or from the ground near it?",
  unionVisible: 'Can you see the bud union — the knobbly join near the base where your rose was grafted?',
  noUnion:
    "Then I won't call it a sucker. The union may just be buried. If you like, gently clear a little soil and look again — otherwise leave the shoot, and ask experienced local help if you're concerned.",
  ownRoot:
    "If you know your rose grows on its own roots (it wasn't grafted), shoots from the base are the same rose, so none is a sucker — keep them.",
  supporting:
    "In the growing season only, these can help you look, but never decide on their own: sucker leaves are often paler or smaller or have a different number of leaflets (though the \"seven leaflets\" rule isn't reliable); sucker flowers differ from your rose's; suckers are often unusually vigorous, straight and tall.",
}

/** PKR-DEC-000007 removal method (shown instead of PKR-CGD-000002 for a sucker). */
export const SUCKER_REMOVAL: Statement[] = [
  { text: 'Uncover the point where the sucker starts, clearing soil if needed, and remove it right there. Never cut it off at soil level — a sucker cut at the surface grows back.', confidence: 'High' },
  { text: 'Main method: with gloves on, grip the sucker as close to where it starts as you can and pull or tear it away. Tearing takes the hidden buds at its base with it, which makes regrowth less likely.', confidence: 'Moderate' },
  { text: 'Alternative: some sources cut it cleanly, flush at the point where it starts. Sources disagree on which works better; both agree it must go at the origin.', confidence: 'Moderate' },
  { text: 'Support the stem with one hand; afterwards refill the soil and firm it gently around the base.', confidence: 'Low' },
  { text: 'Take care around the base when weeding or digging — root damage is linked with suckering.', confidence: 'Low' },
]

// ---------------------------------------------------------------------------
// Care Guidance (PKR Standard v0.10 §5.7)
// ---------------------------------------------------------------------------

export interface CareGuidance {
  pkr: PkrMeta
  heading: string
  label?: string
  items: Statement[]
}

const CARE: CareGuidance[] = [
  {
    pkr: { id: 'PKR-CGD-000001', version: '1.0', status: 'Published' },
    heading: 'Your tools',
    items: [
      { text: 'Match the tool to the stem: bypass hand pruners for thin canes, loppers for thicker ones, and a pruning saw for the thickest or oldest canes.', confidence: 'High' },
      { text: 'Hand pruners are for stems up to about three-quarters of an inch (about 2 cm) thick. Use loppers or a saw above that.', confidence: 'Low' },
      { text: 'Use bypass (scissor-action) pruners. Anvil pruners are fine for clearing dead wood only.', confidence: 'Approved default' },
      { text: "Keep your tools sharp and clean, so each cut is clean and doesn't crush the cane.", confidence: 'High' },
      { text: 'Wipe the blades with 70 percent alcohol between plants, and after cutting out diseased wood. A sensible precaution, not a strict rule.', confidence: 'Moderate' },
    ],
  },
  {
    pkr: { id: 'PKR-CGD-000003', version: '1.0', status: 'Published' },
    heading: 'How much to remove',
    label: 'General pruning guidance, not specific to roses',
    items: [
      { text: "A general pruning rule for shrubs and trees is to remove no more than about a third of a plant's growth in one session. Removing more can stress the plant, drain its stored energy and cause a flush of uncontrolled regrowth.", confidence: 'Low' },
      { text: "One general source puts it as no more than a third of a plant's crown in any one year.", confidence: 'Moderate' },
      { text: 'If an overgrown bush needs more than that, the same guidance spreads the work over two or three years, about a third at a time.', confidence: 'Low' },
      { text: "This rule hasn't been tested on roses, and at least one rose source recommends a single hard renovation instead. Treat it as a cautious guide, not a limit.", confidence: 'Low' },
    ],
  },
  {
    pkr: { id: 'PKR-CGD-000005', version: '1.0', status: 'Published' },
    heading: 'Caring for a recently planted rose',
    items: [
      { text: "If your rose was planted within about the past year, leave as much of its leaves and stems as you can this first season. Only remove faded flowers, and don't cut stems for the vase. A new rose uses its leaves to make the energy it needs to grow roots.", confidence: 'High' },
      { text: 'Pay closer attention to watering for roughly the first two years after planting.', confidence: 'High' },
      { text: 'Full pruning usually waits until a rose has been in the ground about three years. I\'ll check this again next time.', confidence: 'Moderate' },
    ],
  },
  {
    pkr: { id: 'PKR-CGD-000004', version: '1.0', status: 'Published' },
    heading: 'Growing-season care',
    items: [
      { text: "Water deeply and less often, rather than a little and often. In the growing season, aim for roughly 1–2 inches (about 2.5–5 cm) of water a week, counting rain, when it's dry.", confidence: 'High' },
      { text: 'Spread organic mulch about 2–3 inches (5–8 cm) deep around the base — bark, well-rotted manure, wood chips or pine needles — kept a few inches clear of the stems.', confidence: 'High' },
      { text: 'Start feeding in spring as new growth begins, feed again through summer, and stop by mid-to-late summer so new growth can toughen before winter. Stop earlier where winter comes earlier.', confidence: 'High' },
      { text: 'Remove faded flowers through the growing season to encourage more. Stop in early-to-mid autumn, so the rose can form hips and slow down for winter.', confidence: 'High' },
      { text: 'Watch for blackspot, powdery mildew, aphids and spider mites. Water at the base, or in the morning if you water from above, to keep the leaves drier.', confidence: 'High' },
      { text: 'Look over the leaves, buds and stems regularly for yellowing, spots, dropping leaves, stunted or twisted growth, or fewer flowers. Noticing early is the useful first step.', confidence: 'Moderate' },
      { text: 'If your rose looks unwell, think about its growing conditions first: uneven watering, soggy soil or extreme weather. One extension service says these cause most decline.', confidence: 'Low' },
    ],
  },
  {
    pkr: { id: 'PKR-CGD-000006', version: '1.0', status: 'Published' },
    heading: 'Preparing for winter',
    label: 'If your winters bring hard frosts…',
    items: [
      { text: 'Once the rose has had several hard frosts and gone dormant, mound soil, compost or mulch about 10–12 inches (25–30 cm) high around the base, covering the graft union. Remove the mound in spring once hard frosts have passed.', confidence: 'Very High' },
      { text: 'For colder or exposed spots, sources also describe a collar of tar paper or wire mesh filled with straw, pine bark or peat moss, or wrapping canes in burlap or evergreen boughs.', confidence: 'Moderate' },
      { text: 'Water thoroughly after the first hard frost and before the ground freezes, and clear fallen leaves from around the plant before winter.', confidence: 'Moderate' },
    ],
  },
]

/** PKR-CGD-000002 v1.0 — making the cut, by part. */
export const MAKING_THE_CUT = {
  pkr: { id: 'PKR-CGD-000002', version: '1.0', status: 'Published' } as PkrMeta,
  removeStem: [
    { text: "Cut the stem off where it starts: at the base, at the bud union, or where it joins its parent stem. Don't leave a stub.", confidence: 'Moderate' },
  ] as Statement[],
  shorten: [
    { text: 'Cut just above a bud that faces outward, away from the centre of the bush.', confidence: 'High' },
    { text: "Cut about a quarter of an inch (about 6 mm) above the bud. Up to half an inch is also fine if you'd rather avoid the stub dying back.", confidence: 'Moderate' },
    { text: 'Make the cut on a slant, at roughly 45 degrees, not flat.', confidence: 'Moderate' },
    { text: 'Slant the cut away from the bud.', confidence: 'Low' },
  ] as Statement[],
  seal: {
    text: "On cuts roughly pencil-thick or larger, you can seal the end with wood glue, nail polish or pruning sealer, to keep cane-boring insects out. Thinner cuts don't need it.",
    confidence: 'Moderate' as ConfidenceLevel,
  },
}

/** ARC-BUSHROSE-BASICCARE-01 §5/§7 disclosure, shown with every care record until BASICCARE Decision 2 is decided. */
export const CARE_DISCLOSURE =
  'This care advice comes mainly from UK and US gardening services. Timings and amounts may differ where you live.'

/** One-third advisory cadence (PKR-CGD-000003 Presentation Points, Founder decision D2). */
export const ADVISORY_EVERY_N_CUTS = 3

// ---------------------------------------------------------------------------
// Published-only accessors
// ---------------------------------------------------------------------------

const isPublished = (m: PkrMeta) => m.status === 'Published'

export function publishedObservations(): ObservationDef[] {
  return OBSERVATIONS.filter((o) => isPublished(o.obs) && isPublished(o.dec))
}

export function publishedCare(id: string): CareGuidance | undefined {
  const c = CARE.find((x) => x.pkr.id === id)
  return c && isPublished(c.pkr) ? c : undefined
}

/** Sources behind a set of Published PKRs, de-duplicated, for "Where this comes from". */
export function sourcesFor(...pkrIds: string[]): PkrSource[] {
  const ids = new Set(pkrIds.flatMap((id) => PKR_SUPPORTING_SOURCES[id] ?? []))
  return [...ids].map((id) => PKR_SOURCES[id]).filter((s): s is PkrSource => Boolean(s))
}

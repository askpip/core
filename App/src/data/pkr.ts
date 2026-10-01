/**
 * The app's window onto the Live Intelligence Library (LIL).
 *
 * Every gardener-facing horticultural statement the app shows comes from a
 * Published PKR in the LIL (LIL Standard; PKR Standard §9.1). This module:
 *
 *   1. starts from the committed snapshot (./lil-snapshot.json), which KIT's
 *      build tool writes from the same records it publishes, so the app works
 *      offline and on first paint;
 *   2. replaces it with the live LIL (Supabase table public.lil_pkr, Published
 *      rows only) once loadLiveLil() succeeds, so newly published knowledge
 *      reaches gardeners without an app release;
 *   3. exposes the records through the same typed accessors the pages use.
 *
 * It decides nothing horticultural itself. If a record needed here is missing
 * from the live LIL, the whole live set is rejected and the snapshot stays in
 * use, rather than showing a partial journey.
 *
 * KIT maintains the records: see AI/Skills/KIT_LIL_Publication_Skill.md.
 */
import snapshot from './lil-snapshot.json'
import type { ConfidenceLevel } from './confidenceDefinitions'
import type { Choice, SavedRoseType } from '@/lib/types'

// ---------------------------------------------------------------------------
// Record shapes
// ---------------------------------------------------------------------------

export type PkrStatus = 'Published' | 'Draft'

export interface PkrMeta {
  id: string
  version: string
  status: PkrStatus
}

/** One LIL record as stored (schema pip-lil-record/1, minus provenance). */
export interface LilRecord {
  pkr_id: string
  version: string
  pkr_type: string
  title: string
  common: {
    applies_to?: string
    supporting_sources?: string[]
    related_pkrs?: { relationship: string; pkr_id: string }[]
    preserved_uncertainty?: string
    [k: string]: unknown
  }
  // Content is declarative JSON whose shape depends on pkr_type; read below.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any
}

/** Confidence as shown to the gardener: one of the five levels, or an approved default. */
export type ShownConfidence = ConfidenceLevel | 'Approved default'

export interface Statement {
  text: string
  confidence?: ShownConfidence
}

export type RoseTypeAnswerId = SavedRoseType | 'variety-only'

export interface RoseTypeGate {
  pkr: PkrMeta
  question: string
  /** PKR-SGT-000003 v1.1: what "Ht" and "Fl" on NZ shop labels usually mean. Optional so an older record still loads. */
  labelAbbreviations?: { text: string; confidence: ConfidenceLevel; sources: string[] }
  answers: { id: RoseTypeAnswerId; label: string; passes: boolean }[]
  grandifloraNote: string
  roseFinder: { text: string; url?: string; confidence: ConfidenceLevel }
  journalOnly: { base: string; excluded: string; bushOnly: string; unknown: string; keep: string; help: string }
}

export interface DormancyGate {
  pkr: PkrMeta
  question: string
  caveat: string
  answers: { dormant: string; growing: string; notSure: string }
  notSureFallback: string
  removalOnly: {
    intro: { text: string; confidence: ConfidenceLevel }
    notSureIntro: string
    conditions: Statement[]
    lateSeason: { text: string; confidence: ConfidenceLevel }
  }
}

export interface RecentlyPlantedGate {
  pkr: PkrMeta
  question: string
  answers: { established: string; recent: string; unknown: string }
  fallbackIntro: string
  fallbackQuestions: { key: 'activeNewGrowth' | 'caneCountAboveBaseline' | 'baseFeelsFirm'; label: string }[]
  restrictedReasonRecent: string
  restrictedReasonFallback: string
  /** Observation PKR ids exempt from this gate (dead wood). */
  exemptObservations: string[]
}

/** Which kind of cut a Cut choice is — selects the part of PKR-CGD-000002 shown (its own Presentation Points). */
export type CutKind = 'dead-wood' | 'remove-stem' | 'shorten' | 'sucker'

export interface DecisionOption {
  choice: Choice
  label: string
  cutKind?: CutKind
}

/** One observation as the journey uses it: its Observation PKR and Decision Logic PKR together. */
export interface ObservationDef {
  key: string
  feature: string
  obs: PkrMeta
  dec: PkrMeta
  lookFor: string
  criteria: Statement[]
  photoLimit: string
  confirmQuestion: string
  confirmLabel: string
  doesntMatchLabel: string
  doesntMatchRoute: 'none' | 'decide'
  doesntMatchNote?: string
  notSureGuidance: string
  notSureChoices: DecisionOption[]
  anyMoreQuestion: string
  choices: DecisionOption[]
  decisionNotes: Statement[]
  doesntMatchChoices?: DecisionOption[]
  doesntMatchNotes?: Statement[]
  headlineConfidence: ConfidenceLevel
  /** PKR-SGT-000001 v1.1: allowed in the removal-only session. */
  allowedAfterBudBreak: boolean
  /** PKR-SGT-000002: exempt from the recently-planted restriction. */
  allowedWhenRecentlyPlanted: boolean
  /** PKR-CGD-000001/000003 apply to this observation's Cut. */
  cutCareGuidance: boolean
  /** 'growing-season' observations (PKR-OBS-000008) run in their own check, never in the pruning journey. */
  session: 'pruning' | 'growing-season'
  /** Growing-season checks: when Pip offers the check (approved default). */
  offerWhen?: { question: string; yes: string; not_yet: string; not_sure: string; not_yet_note: string }
  /** How to make this observation's Cut, where its Decision Logic PKR gives one. */
  cutMethod?: Statement[]
  /** PKR-SGT-000002 applies to this observation's Cut. */
  recentlyPlantedApplies: boolean
}

export interface CareGuidance {
  pkr: PkrMeta
  heading: string
  label?: string
  items: Statement[]
}

export interface PkrSource {
  id: string
  title: string
  url?: string
}

// ---------------------------------------------------------------------------
// Live bindings (reassigned by hydrate)
// ---------------------------------------------------------------------------

export let ROSE_TYPE_GATE: RoseTypeGate
export let DORMANCY_GATE: DormancyGate
export let RECENTLY_PLANTED_GATE: RecentlyPlantedGate
export let SUCKER_STEPS: { hasShoot: string; unionVisible: string; noUnion: string; ownRoot: string; supporting: string }
export let SUCKER_REMOVAL: Statement[]
export let MAKING_THE_CUT: { pkr: PkrMeta; removeStem: Statement[]; shorten: Statement[]; seal: Statement & { confidence: ConfidenceLevel } }
/** ARC-BUSHROSE-BASICCARE-01 §5/§7 disclosure, carried on PKR-CGD-000004 to 000006. */
export let CARE_DISCLOSURE: string
/** PKR-CGD-000003 Presentation Points: repeat after every N cuts. */
export let ADVISORY_EVERY_N_CUTS: number
/** PKR-DEF-000001 to 000005. */
export let CONFIDENCE_EXPLANATIONS: Record<ConfidenceLevel, string>

let OBSERVATIONS: ObservationDef[] = []
let CARE = new Map<string, CareGuidance>()
let BY_ID = new Map<string, LilRecord>()
let SOURCE: 'snapshot' | 'live' = 'snapshot'

const meta = (r: LilRecord): PkrMeta => ({ id: r.pkr_id, version: r.version, status: 'Published' })

function hydrate(records: LilRecord[]) {
  const byId = new Map(records.map((r) => [r.pkr_id, r]))
  const need = (id: string) => {
    const r = byId.get(id)
    if (!r) throw new Error(`LIL record ${id} is not Published`)
    return r
  }

  const sgt3 = need('PKR-SGT-000003')
  const roseFinderUrl = byId.get(sgt3.content.roseFinder.source)?.content.url as string | undefined
  const rose: RoseTypeGate = { ...sgt3.content, pkr: meta(sgt3), roseFinder: { ...sgt3.content.roseFinder, url: roseFinderUrl } }

  const sgt1 = need('PKR-SGT-000001')
  const dorm: DormancyGate = { ...sgt1.content, pkr: meta(sgt1) }

  const sgt2 = need('PKR-SGT-000002')
  const c2 = sgt2.content
  const planted: RecentlyPlantedGate = {
    pkr: meta(sgt2),
    question: c2.question,
    answers: c2.answers,
    fallbackIntro: c2.fallback_intro,
    fallbackQuestions: c2.fallback_questions,
    restrictedReasonRecent: c2.restricted_reason_recent,
    restrictedReasonFallback: c2.restricted_reason_fallback,
    exemptObservations: c2.exempt_observations,
  }

  const observations: ObservationDef[] = records
    .filter((r) => r.pkr_type === 'observation')
    .map((o) => {
      const decId = o.common.related_pkrs?.find((x) => x.relationship === 'decided by')?.pkr_id
      const d = need(decId ?? '')
      const oc = o.content
      const dc = d.content
      return {
        order: oc.journey_order as number,
        def: {
          key: oc.key,
          feature: oc.feature,
          obs: meta(o),
          dec: meta(d),
          lookFor: oc.look_for,
          criteria: oc.criteria,
          photoLimit: oc.photo_limit,
          confirmQuestion: oc.confirm_question,
          confirmLabel: oc.confirm_label,
          doesntMatchLabel: oc.doesnt_match_label,
          doesntMatchRoute: oc.doesnt_match_route,
          doesntMatchNote: oc.doesnt_match_note ?? undefined,
          notSureGuidance: oc.not_sure_guidance,
          notSureChoices: dc.not_sure_choices,
          anyMoreQuestion: oc.any_more_question,
          choices: dc.choices,
          decisionNotes: dc.decision_notes,
          doesntMatchChoices: dc.doesnt_match_choices ?? undefined,
          doesntMatchNotes: dc.doesnt_match_notes ?? undefined,
          headlineConfidence: dc.headline_confidence,
          allowedAfterBudBreak: dc.gate_conditions['PKR-SGT-000001'] === 'removal_allowed_after_bud_break',
          allowedWhenRecentlyPlanted: dc.gate_conditions['PKR-SGT-000002'] === 'exempt',
          cutCareGuidance: dc.cut_care_guidance,
          session: oc.session === 'growing-season' ? 'growing-season' : 'pruning',
          offerWhen: oc.offer_when ?? undefined,
          cutMethod: dc.cut_method ?? undefined,
          recentlyPlantedApplies: dc.gate_conditions['PKR-SGT-000002'] === 'applies',
        } as ObservationDef,
      }
    })
    .sort((a, b) => a.order - b.order)
    .map((x) => x.def)
  if (!observations.some((o) => o.session === 'pruning')) throw new Error('LIL has no Published observations')

  const sucker = records.find((r) => r.pkr_type === 'observation' && r.content.key === 'rootstock-sucker')
  const suckerDec = sucker && need(sucker.common.related_pkrs?.find((x) => x.relationship === 'decided by')?.pkr_id ?? '')

  const cgd2 = need('PKR-CGD-000002')
  const care = new Map<string, CareGuidance>()
  for (const r of records.filter((x) => x.pkr_type === 'care_guidance' && x.pkr_id !== 'PKR-CGD-000002')) {
    care.set(r.pkr_id, { pkr: meta(r), heading: r.content.heading, label: r.content.label ?? undefined, items: r.content.items })
  }

  const conf = {} as Record<ConfidenceLevel, string>
  for (const r of records.filter((x) => x.pkr_type === 'definition' && x.content.level)) conf[r.content.level as ConfidenceLevel] = r.content.explanation

  // All checks passed: swap everything in at once.
  ROSE_TYPE_GATE = rose
  DORMANCY_GATE = dorm
  RECENTLY_PLANTED_GATE = planted
  SUCKER_STEPS = sucker?.content.sucker_steps
  SUCKER_REMOVAL = suckerDec?.content.removal_method ?? []
  MAKING_THE_CUT = { ...cgd2.content, pkr: meta(cgd2) }
  CARE_DISCLOSURE = need('PKR-CGD-000004').content.disclosure
  ADVISORY_EVERY_N_CUTS = need('PKR-CGD-000003').content.presentation.repeat_every_n_cuts
  CONFIDENCE_EXPLANATIONS = conf
  OBSERVATIONS = observations
  CARE = care
  BY_ID = byId
}

hydrate((snapshot as { records: LilRecord[] }).records)

// ---------------------------------------------------------------------------
// Live LIL
// ---------------------------------------------------------------------------

const listeners = new Set<() => void>()
let revision = 0

/** Where the content on screen came from: the live LIL, or the bundled snapshot. */
export function lilSource() {
  return SOURCE
}

export function subscribeLil(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function lilRevision() {
  return revision
}

/**
 * Loads the Published records from the live LIL. On any failure (offline, not
 * signed in, a required record missing) the snapshot stays in use.
 */
export async function loadLiveLil(
  fetchPublished: () => Promise<{ data: LilRecord[] | null; error: unknown }>,
): Promise<'live' | 'snapshot'> {
  try {
    const { data, error } = await fetchPublished()
    if (error || !data || data.length === 0) return SOURCE
    hydrate(data)
    SOURCE = 'live'
    revision += 1
    listeners.forEach((l) => l())
  } catch (err) {
    console.warn('Live LIL not used; staying on the bundled snapshot:', err)
  }
  return SOURCE
}

// ---------------------------------------------------------------------------
// Accessors
// ---------------------------------------------------------------------------

/** Short name for gardener copy ("your Hybrid Tea…", or "your rose"), never "bush rose". */
export function roseTypeName(type?: SavedRoseType): string {
  return type === 'hybrid-tea' ? 'Hybrid Tea' : type === 'floribunda' ? 'Floribunda' : type === 'grandiflora' ? 'Grandiflora' : 'rose'
}

export function roseTypePasses(type?: SavedRoseType): boolean {
  return ROSE_TYPE_GATE.answers.some((a) => a.id === type && a.passes)
}

/** Labels for the saved types, for showing and changing on the plant page (app UI text, not a PKR claim). */
export const SAVED_ROSE_TYPE_LABELS: Record<SavedRoseType, string> = {
  'hybrid-tea': 'Hybrid Tea',
  floribunda: 'Floribunda',
  grandiflora: 'Grandiflora (provisional)',
  excluded: 'Another type (not supported for pruning yet)',
  'bush-only': 'Label only says "bush rose"',
  unknown: "Don't know",
}

/** The pruning journey's observations (growing-season checks are excluded; they have their own screen). */
export function publishedObservations(): ObservationDef[] {
  return OBSERVATIONS.filter((o) => o.session === 'pruning')
}

/** A growing-season check's observation (e.g. 'blind-shoot'), if Published. */
export function growingSeasonObservation(key: string): ObservationDef | undefined {
  return OBSERVATIONS.find((o) => o.session === 'growing-season' && o.key === key)
}

/** One Published LIL record by ID (undefined if it isn't Published in the loaded LIL). */
export function publishedRecord(id: string): LilRecord | undefined {
  return BY_ID.get(id)
}

export function publishedCare(id: string): CareGuidance | undefined {
  return CARE.get(id)
}

/** Sources behind a set of Published PKRs, de-duplicated, for "Where this comes from". */
export function sourcesFor(...pkrIds: string[]): PkrSource[] {
  const ids = new Set(pkrIds.flatMap((id) => BY_ID.get(id)?.common.supporting_sources ?? []))
  return [...ids]
    .map((id) => BY_ID.get(id))
    .filter((r): r is LilRecord => Boolean(r))
    .map((r) => ({ id: r.pkr_id, title: r.title, url: r.content.url ?? undefined }))
}

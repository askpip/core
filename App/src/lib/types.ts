export type ObservationOutcome = 'confirmed' | 'corrected' | 'unresolved'
export type Choice = 'cut' | 'leave' | 'decide-later' | 'get-help'

export interface ObservationRecord {
  id: string
  feature: string
  pipProposal: string
  comparisonNote: string
  outcome: ObservationOutcome
  correction?: string
  choice?: Choice
}

export interface PlantProject {
  id: string
  name: string
  variety: string
  varietySource: string
  location: string
  personalMeaning?: string
  createdAt: string
  observations: ObservationRecord[]
  journeyComplete: boolean
}

import { createContext, useContext } from 'react'
import type { ApplicationAnswer, ApplicationStatus } from '@/panel/applications'

type CandidateApplication = {
  id: number
  first_name: string
  last_name: string
  email: string
  status: ApplicationStatus
  submitted_at: string
  edition_id: number
  organization_name: string
  organization_email: string
  organization_logo_url: string | null
  answers: ApplicationAnswer[]
}

type HistoryState = 'done' | 'current' | 'next'

type HistoryItem = {
  label: string
  state: HistoryState
}

type StatusView = {
  title: string
  description?: string
  stage: number
  history: HistoryItem[]
}

const STAGES = ['Zgłoszenie', 'Ocena', 'Rozmowa', 'Decyzja', 'Wdrożenie']

const SENT: HistoryItem = { label: 'Zgłoszenie wysłane', state: 'done' }
const RATED: HistoryItem = { label: 'Zgłoszenie ocenione', state: 'done' }

const STATUS_VIEWS: Record<ApplicationStatus, StatusView> = {
  new: {
    title: 'Dostaliśmy Twoje zgłoszenie',
    description: 'Zespół je teraz przegląda. Tutaj zobaczysz, co dalej.',
    stage: 1,
    history: [
      SENT,
      { label: 'Ocena zgłoszenia', state: 'current' },
      { label: 'Rozmowa', state: 'next' },
    ],
  },
  interview: {
    title: 'Zapraszamy Cię na rozmowę',
    description: 'Wkrótce poprosimy Cię tutaj o podanie, kiedy możesz.',
    stage: 2,
    history: [
      SENT,
      RATED,
      { label: 'Zaproszenie na rozmowę', state: 'current' },
      { label: 'Rozmowa', state: 'next' },
    ],
  },
  to_decide: {
    title: 'Czekamy na decyzję',
    description: 'Rozmowa za nami. Zespół da Ci znać, gdy podejmie decyzję.',
    stage: 3,
    history: [
      SENT,
      RATED,
      { label: 'Rozmowa', state: 'done' },
      { label: 'Decyzja', state: 'current' },
    ],
  },
  accepted: {
    title: 'Witamy w zespole!',
    stage: 4,
    history: [
      SENT,
      RATED,
      { label: 'Rozmowa', state: 'done' },
      { label: 'Decyzja: przyjęta', state: 'done' },
      { label: 'Wdrożenie', state: 'current' },
    ],
  },
  rejected: {
    title: 'Dziękujemy za udział w rekrutacji',
    description: 'Tym razem nie możemy zaproponować Ci miejsca.',
    stage: 3,
    history: [SENT, RATED, { label: 'Decyzja', state: 'current' }],
  },
}

const CandidateContext = createContext<CandidateApplication | null>(null)

function useCandidateApplication() {
  const application = useContext(CandidateContext)
  if (!application) {
    throw new Error(
      'useCandidateApplication must be used inside CandidateContext',
    )
  }
  return application
}

export { CandidateContext, STAGES, STATUS_VIEWS, useCandidateApplication }
export type { CandidateApplication, HistoryItem, HistoryState }

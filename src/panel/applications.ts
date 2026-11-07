import type { Person } from '@/panel/user'

type ApplicationStatus =
  'new' | 'interview' | 'to_decide' | 'accepted' | 'rejected'

type ApplicationListItem = {
  id: number
  first_name: string
  last_name: string
  email: string
  photo_url: string | null
  status: ApplicationStatus
  submitted_at: string
  rating_average: number | null
  rating_count: number
}

type ApplicationAnswer = {
  question: number
  question_text: string
  question_type: string
  text: string | null
  choices: string[]
}

type ApplicationDetail = ApplicationListItem & {
  accepted_at: string | null
  answers: ApplicationAnswer[]
}

type TeamEntry = {
  id: number
  membership: number | null
  first_name: string | null
  last_name: string | null
  email: string | null
}

const REMOVED_AUTHOR: Person = {
  first_name: 'Usunięta',
  last_name: 'osoba',
  email: '',
}

function getAuthor(entry: TeamEntry): Person {
  return entry.membership === null
    ? REMOVED_AUTHOR
    : {
        first_name: entry.first_name ?? '',
        last_name: entry.last_name ?? '',
        email: entry.email ?? '',
      }
}

type Rating = TeamEntry & {
  value: number
}

type Note = TeamEntry & {
  text: string
}

type ApplicationPage = {
  count: number
  next: string | null
  previous: string | null
  results: ApplicationListItem[]
}

const APPLICATION_PAGE_SIZE = 20

const STATUSES: ApplicationStatus[] = [
  'new',
  'interview',
  'to_decide',
  'accepted',
  'rejected',
]

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  new: 'Nowe zgłoszenie',
  interview: 'Rozmowa',
  to_decide: 'Do decyzji',
  accepted: 'Przyjęty',
  rejected: 'Odrzucony',
}

function formatRating(application: ApplicationListItem) {
  if (application.rating_average === null) {
    return null
  }
  return `${application.rating_average.toFixed(1)} (${application.rating_count})`
}

function formatDateTime(value: string) {
  const date = new Date(value)
  const time = date.toLocaleTimeString('pl-PL', {
    hour: '2-digit',
    minute: '2-digit',
  })
  return `${date.toLocaleDateString('pl-PL')} ${time}`
}

const AVATAR_COLORS = ['bg-muted', 'bg-sage-light', 'bg-sand/60']

export {
  APPLICATION_PAGE_SIZE,
  AVATAR_COLORS,
  STATUSES,
  STATUS_LABELS,
  formatDateTime,
  formatRating,
  getAuthor,
}
export type {
  ApplicationAnswer,
  ApplicationDetail,
  ApplicationListItem,
  ApplicationPage,
  ApplicationStatus,
  Note,
  Rating,
}

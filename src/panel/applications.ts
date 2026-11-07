type ApplicationStatus =
  'new' | 'interview' | 'to_decide' | 'accepted' | 'rejected'

type ApplicationListItem = {
  id: number
  first_name: string
  last_name: string
  email: string
  status: ApplicationStatus
  submitted_at: string
  rating_average: number | null
  rating_count: number
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

export {
  APPLICATION_PAGE_SIZE,
  STATUSES,
  STATUS_LABELS,
  formatDateTime,
  formatRating,
}
export type { ApplicationListItem, ApplicationPage, ApplicationStatus }

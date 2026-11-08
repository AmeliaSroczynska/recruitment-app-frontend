const ONBOARDING_SECTIONS = [
  { label: 'Zadania', path: 'tasks' },
  { label: 'Mentorzy', path: 'mentors' },
  { label: 'Baza wiedzy', path: 'knowledge' },
  { label: 'FAQ', path: 'faq' },
]

type Task = {
  id: number
  name: string
  description: string | null
  position: number
}

export { ONBOARDING_SECTIONS }
export type { Task }

import { House, IdCard, Sprout } from 'lucide-react'

const CANDIDATE_NAV = [
  {
    path: 'application',
    label: 'Twoje zgłoszenie',
    shortLabel: 'Zgłoszenie',
    icon: IdCard,
  },
  {
    path: '',
    label: 'Strona główna',
    shortLabel: 'Strona główna',
    icon: House,
  },
  {
    path: 'onboarding',
    label: 'Wdrożenie',
    shortLabel: 'Wdrożenie',
    icon: Sprout,
  },
]

export { CANDIDATE_NAV }

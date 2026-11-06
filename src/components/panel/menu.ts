import {
  BookOpen,
  Calendar,
  ChartColumn,
  CircleHelp,
  ClipboardCheck,
  Ellipsis,
  MessagesSquare,
  Settings,
  Sprout,
  TextAlignStart,
  Ticket,
  Users,
  type LucideIcon,
} from 'lucide-react'

type MenuItem = {
  label: string
  path: string
  icon: LucideIcon
  settings?: boolean
}

type MenuGroup = {
  label: string
  items: MenuItem[]
}

const MENU: MenuGroup[] = [
  {
    label: 'Rekrutacja',
    items: [
      { label: 'Zgłoszenia', path: 'applications', icon: Ticket },
      { label: 'Formularze', path: 'forms', icon: TextAlignStart },
      { label: 'Rozmowy', path: 'interviews', icon: MessagesSquare },
      { label: 'Kalendarz', path: 'calendar', icon: Calendar },
    ],
  },
  {
    label: 'Wdrożenie',
    items: [
      { label: 'Zadania wdrażające', path: 'tasks', icon: ClipboardCheck },
      { label: 'Baza wiedzy', path: 'knowledge', icon: BookOpen },
      { label: 'FAQ', path: 'faq', icon: CircleHelp },
      { label: 'Mentorzy', path: 'mentors', icon: Users },
    ],
  },
  {
    label: 'Administracja',
    items: [
      { label: 'Statystyki', path: 'statistics', icon: ChartColumn },
      {
        label: 'Ustawienia',
        path: 'settings',
        icon: Settings,
        settings: true,
      },
    ],
  },
]

type MobileNavItem = {
  label: string
  path: string
  icon: LucideIcon
  matches: string[]
}

const MOBILE_NAV: MobileNavItem[] = [
  {
    label: 'Kandydaci',
    path: 'applications',
    icon: Users,
    matches: ['applications'],
  },
  {
    label: 'Rozmowy',
    path: 'interviews',
    icon: MessagesSquare,
    matches: ['interviews', 'calendar'],
  },
  {
    label: 'Wdrożenie',
    path: 'tasks',
    icon: Sprout,
    matches: ['tasks', 'knowledge', 'faq', 'mentors'],
  },
  {
    label: 'Więcej',
    path: 'more',
    icon: Ellipsis,
    matches: ['more', 'forms', 'statistics', 'settings'],
  },
]

const SECTION_TITLES: Record<string, string> = Object.fromEntries(
  MENU.flatMap((group) => group.items).map((item) => [item.path, item.label]),
)

export { MENU, MOBILE_NAV, SECTION_TITLES }
export type { MenuItem }

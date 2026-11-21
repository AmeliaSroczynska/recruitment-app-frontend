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
import type { Access } from '@/panel/roles'

type MenuItem = {
  label: string
  path: string
  icon: LucideIcon
  access?: Access
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
      {
        label: 'Formularze',
        path: 'forms',
        icon: TextAlignStart,
        access: 'recruitment',
      },
      {
        label: 'Rozmowy',
        path: 'interviews',
        icon: MessagesSquare,
        access: 'recruitment',
      },
      {
        label: 'Kalendarz',
        path: 'calendar',
        icon: Calendar,
        access: 'recruitment',
      },
    ],
  },
  {
    label: 'Wdrożenie',
    items: [
      {
        label: 'Zadania wdrażające',
        path: 'tasks',
        icon: ClipboardCheck,
        access: 'onboarding',
      },
      {
        label: 'Baza wiedzy',
        path: 'knowledge',
        icon: BookOpen,
        access: 'onboarding',
      },
      { label: 'FAQ', path: 'faq', icon: CircleHelp, access: 'onboarding' },
      {
        label: 'Mentorzy',
        path: 'mentors',
        icon: Users,
        access: 'onboarding',
      },
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
        access: 'settings',
      },
    ],
  },
]

type MobileNavItem = {
  label: string
  path: string
  icon: LucideIcon
  matches: string[]
  access?: Access
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
    access: 'recruitment',
  },
  {
    label: 'Wdrożenie',
    path: 'tasks',
    icon: Sprout,
    matches: ['tasks', 'knowledge', 'faq', 'mentors'],
    access: 'onboarding',
  },
  {
    label: 'Więcej',
    path: 'more',
    icon: Ellipsis,
    matches: ['more', 'forms', 'statistics', 'settings'],
  },
]

const MENU_ITEMS = MENU.flatMap((group) => group.items)

const SECTION_TITLES: Record<string, string> = Object.fromEntries(
  MENU_ITEMS.map((item) => [item.path, item.label]),
)

export { MENU, MENU_ITEMS, MOBILE_NAV, SECTION_TITLES }
export type { MenuItem }

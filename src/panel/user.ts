import type { User } from '@/auth/AuthContext'

type Person = Pick<User, 'email' | 'first_name' | 'last_name'> & {
  photo_url?: string | null
}

function getDisplayName(person: Person) {
  return `${person.first_name} ${person.last_name}`.trim() || person.email
}

function getInitials(person: Person) {
  const initials = `${person.first_name.charAt(0)}${person.last_name.charAt(0)}`
  return (initials || person.email.charAt(0)).toUpperCase()
}

export { getDisplayName, getInitials }
export type { Person }

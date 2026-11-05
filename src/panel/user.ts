import type { User } from '@/auth/AuthContext'

function getDisplayName(user: User) {
  return `${user.first_name} ${user.last_name}`.trim() || user.email
}

function getInitials(user: User) {
  const initials = `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`
  return (initials || user.email.charAt(0)).toUpperCase()
}

export { getDisplayName, getInitials }

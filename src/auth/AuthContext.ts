import { createContext, useContext } from 'react'

type Membership = {
  id: number
  edition_id: number
  edition_name: string
  organization_name: string
  organization_slug: string
  role: string
}

type Application = {
  id: number
  edition_id: number
  edition_name: string
  organization_name: string
  organization_slug: string
  status: string
}

type User = {
  id: number
  email: string
  first_name: string
  last_name: string
  photo: string | null
  memberships: Membership[]
  applications: Application[]
}

type AuthContextValue = {
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}

export { AuthContext, useAuth }
export type { Application, Membership, User }

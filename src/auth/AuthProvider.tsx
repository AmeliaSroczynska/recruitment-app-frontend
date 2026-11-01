import { useEffect, useState, type ReactNode } from 'react'
import { AuthContext, type User } from '@/auth/AuthContext'
import { api } from '@/lib/api'

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    api<User>('auth/me/')
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false))
  }, [])

  async function logout() {
    await api('auth/logout/', { method: 'POST' })
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthProvider }

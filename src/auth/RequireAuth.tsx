import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'

function RequireAuth() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return null
  }
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return <Outlet />
}

export { RequireAuth }

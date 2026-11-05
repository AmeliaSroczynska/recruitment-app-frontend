import { createContext, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import type { Membership } from '@/auth/AuthContext'

const EditionContext = createContext<Membership | null>(null)

function useEdition() {
  const membership = useContext(EditionContext)
  if (!membership) {
    throw new Error('useEdition must be used inside EditionContext')
  }
  return membership
}

function useSection() {
  const { pathname } = useLocation()
  return pathname.split('/')[3] ?? ''
}

export { EditionContext, useEdition, useSection }

import type { CSSProperties } from 'react'
import { Navigate, Outlet, useParams } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'
import { MENU_ITEMS } from '@/components/panel/menu'
import { PanelMobileNav } from '@/components/panel/PanelMobileNav'
import { PanelSidebar } from '@/components/panel/PanelSidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { EditionContext, useSection } from '@/panel/EditionContext'
import { canSee } from '@/panel/roles'

function PanelLayout() {
  const { editionId } = useParams()
  const { user } = useAuth()
  const section = useSection()

  const membership = user?.memberships.find(
    (item) => String(item.edition_id) === editionId,
  )

  if (!membership) {
    return <Navigate to="/login/organization/organization" replace />
  }

  const item = MENU_ITEMS.find((menuItem) => menuItem.path === section)
  if (item && !canSee(membership.role, item.access)) {
    return <Navigate to={`/organization/${editionId}/applications`} replace />
  }

  return (
    <EditionContext.Provider value={membership}>
      <SidebarProvider
        style={
          {
            '--sidebar-width': '236px',
            '--sidebar-width-icon': '56px',
          } as CSSProperties
        }
        className="bg-background"
      >
        <PanelSidebar />
        <SidebarInset className="bg-background">
          <Outlet />
        </SidebarInset>
        <PanelMobileNav />
      </SidebarProvider>
    </EditionContext.Provider>
  )
}

export default PanelLayout

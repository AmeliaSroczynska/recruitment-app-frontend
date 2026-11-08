import { ArrowLeftRight, ChevronsUpDown, LogOut } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'
import { MENU } from '@/components/panel/menu'
import { OrganizationAvatar } from '@/components/panel/OrganizationAvatar'
import { UserAvatar } from '@/components/panel/UserAvatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { useEdition, useSection } from '@/panel/EditionContext'
import { canSeeSettings } from '@/panel/roles'
import { getDisplayName } from '@/panel/user'

function PanelSidebar() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const membership = useEdition()
  const section = useSection()

  if (!user) {
    return null
  }

  const basePath = `/organization/${membership.edition_id}`

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="flex-row items-center gap-2.5 px-5 pt-[23px] pb-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-3">
        <OrganizationAvatar
          name={membership.organization_name}
          logoUrl={membership.organization_logo_url}
          className="group-data-[collapsible=icon]:hidden"
        />
        <span className="min-w-0 flex-1 truncate font-heading text-lg font-extrabold tracking-[-0.3px] text-sidebar-accent-foreground group-data-[collapsible=icon]:hidden">
          {membership.organization_name}
        </span>
        <SidebarTrigger className="text-moss hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" />
      </SidebarHeader>
      <SidebarContent className="gap-0 px-1.5 group-data-[collapsible=icon]:px-1">
        {MENU.map((group) => (
          <SidebarGroup key={group.label} className="pt-1.5">
            <SidebarGroupLabel className="text-xs font-medium tracking-[0.1px] text-moss group-data-[collapsible=icon]:mt-0">
              {group.label}
            </SidebarGroupLabel>
            <SidebarMenu className="gap-0.5">
              {group.items
                .filter(
                  (item) => !item.settings || canSeeSettings(membership.role),
                )
                .map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      render={<NavLink to={`${basePath}/${item.path}`} end />}
                      isActive={section === item.path}
                      tooltip={item.label}
                      className="data-active:bg-sidebar-primary data-active:font-medium data-active:text-sidebar-primary-foreground"
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="px-3.5 pb-4 group-data-[collapsible=icon]:px-3">
        <SidebarMenu className="border-t border-sidebar-border pt-3 group-data-[collapsible=icon]:border-t-0">
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    className="data-popup-open:bg-sidebar-accent"
                  />
                }
              >
                <UserAvatar user={user} />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-medium">
                    {getDisplayName(user)}
                  </span>
                  <span className="truncate text-xs text-moss">
                    {user.email}
                  </span>
                </span>
                <ChevronsUpDown className="ml-auto text-moss" />
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="min-w-56">
                <DropdownMenuItem
                  onClick={() => navigate('/login/organization/organization')}
                >
                  <ArrowLeftRight />
                  Zmień organizację
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                  <LogOut />
                  Wyloguj się
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export { PanelSidebar }

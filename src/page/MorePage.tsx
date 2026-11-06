import {
  ArrowLeftRight,
  ChartColumn,
  ChevronRight,
  LogOut,
  Settings,
  TextAlignStart,
  type LucideIcon,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'
import { PanelPage } from '@/components/panel/PanelPage'
import { UserAvatar } from '@/components/panel/UserAvatar'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item'
import { cn } from '@/lib/utils'
import { useEdition } from '@/panel/EditionContext'
import { ROLE_LABELS, canSeeSettings } from '@/panel/roles'
import { getDisplayName } from '@/panel/user'

type MoreLinkProps = {
  icon: LucideIcon
  label: string
  to?: string
  onClick?: () => void
  danger?: boolean
}

function MoreLink({ icon: Icon, label, to, onClick, danger }: MoreLinkProps) {
  return (
    <Item
      render={
        to ? <Link to={to} /> : <button type="button" onClick={onClick} />
      }
      className="rounded-none px-4 py-3 text-left"
    >
      <ItemMedia
        className={cn(
          'size-9 rounded-[10px]',
          danger ? 'bg-destructive/10 text-destructive' : 'bg-muted text-olive',
        )}
      >
        <Icon className="size-4" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle
          className={cn(
            'text-[15px] font-medium',
            danger && 'text-destructive',
          )}
        >
          {label}
        </ItemTitle>
      </ItemContent>
      <ItemActions>
        <ChevronRight className="size-4 text-stone" />
      </ItemActions>
    </Item>
  )
}

function MorePage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const membership = useEdition()

  if (!user) {
    return null
  }

  const basePath = `/organization/${membership.edition_id}`

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <PanelPage title="Więcej">
      <div className="flex flex-col gap-3">
        <Item variant="outline" className="rounded-2xl bg-card p-4">
          <ItemMedia>
            <UserAvatar user={user} className="size-12" />
          </ItemMedia>
          <ItemContent className="min-w-0">
            <ItemTitle className="text-base font-semibold">
              {getDisplayName(user)}
            </ItemTitle>
            <ItemDescription className="truncate">
              {user.email} · {ROLE_LABELS[membership.role]}
            </ItemDescription>
          </ItemContent>
        </Item>
        <ItemGroup className="gap-0 overflow-hidden rounded-2xl border bg-card">
          <MoreLink
            icon={TextAlignStart}
            label="Formularze"
            to={`${basePath}/forms`}
          />
          <ItemSeparator className="my-0" />
          <MoreLink
            icon={ChartColumn}
            label="Statystyki"
            to={`${basePath}/statistics`}
          />
          {canSeeSettings(membership.role) && (
            <>
              <ItemSeparator className="my-0" />
              <MoreLink
                icon={Settings}
                label="Ustawienia"
                to={`${basePath}/settings`}
              />
            </>
          )}
        </ItemGroup>
        <ItemGroup className="gap-0 overflow-hidden rounded-2xl border bg-card">
          <MoreLink
            icon={ArrowLeftRight}
            label="Zmień organizację"
            to="/login/organization/organization"
          />
          <ItemSeparator className="my-0" />
          <MoreLink
            icon={LogOut}
            label="Wyloguj się"
            onClick={handleLogout}
            danger
          />
        </ItemGroup>
      </div>
    </PanelPage>
  )
}

export default MorePage

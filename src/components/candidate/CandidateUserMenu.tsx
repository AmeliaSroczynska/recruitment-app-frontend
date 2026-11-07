import { ArrowLeftRight, ChevronsUpDown, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'
import { UserAvatar } from '@/components/panel/UserAvatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getDisplayName } from '@/panel/user'

type CandidateUserMenuProps = {
  showName?: boolean
}

function CandidateUserMenu({ showName = false }: CandidateUserMenuProps) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  if (!user) {
    return null
  }

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Menu konta"
        className="flex items-center gap-2 rounded-[10px] p-1 text-left outline-none hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring data-popup-open:bg-secondary"
      >
        <UserAvatar
          user={user}
          className="size-8"
          fallbackClassName="bg-sand"
        />
        {showName && (
          <span className="hidden max-w-40 min-w-0 flex-col lg:flex">
            <span className="truncate text-sm font-medium text-foreground">
              {getDisplayName(user)}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {user.email}
            </span>
          </span>
        )}
        <ChevronsUpDown className="size-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56">
        <DropdownMenuItem
          onClick={() => navigate('/login/candidate/organization')}
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
  )
}

export { CandidateUserMenu }

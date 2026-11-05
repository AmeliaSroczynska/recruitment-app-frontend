import type { User } from '@/auth/AuthContext'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { getInitials } from '@/panel/user'

type UserAvatarProps = {
  user: User
  className?: string
}

function UserAvatar({ user, className }: UserAvatarProps) {
  return (
    <Avatar className={cn('after:border-0', className)}>
      <AvatarFallback className="bg-sage text-xs font-medium text-foreground">
        {getInitials(user)}
      </AvatarFallback>
    </Avatar>
  )
}

export { UserAvatar }

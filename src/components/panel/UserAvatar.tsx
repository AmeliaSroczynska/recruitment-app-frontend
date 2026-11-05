import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { getInitials, type Person } from '@/panel/user'

type UserAvatarProps = {
  user: Person
  className?: string
  fallbackClassName?: string
}

function UserAvatar({ user, className, fallbackClassName }: UserAvatarProps) {
  return (
    <Avatar className={cn('after:border-0', className)}>
      <AvatarFallback
        className={cn(
          'bg-sage text-xs font-medium text-foreground',
          fallbackClassName,
        )}
      >
        {getInitials(user)}
      </AvatarFallback>
    </Avatar>
  )
}

export { UserAvatar }

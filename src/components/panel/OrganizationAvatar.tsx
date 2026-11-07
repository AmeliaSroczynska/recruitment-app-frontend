import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

type OrganizationAvatarProps = {
  name: string
  className?: string
  fallbackClassName?: string
}

function OrganizationAvatar({
  name,
  className,
  fallbackClassName,
}: OrganizationAvatarProps) {
  return (
    <Avatar className={cn('size-[30px] rounded-lg after:border-0', className)}>
      <AvatarFallback
        className={cn(
          'rounded-[inherit] bg-ochre font-heading text-sm font-extrabold text-on-ochre',
          fallbackClassName,
        )}
      >
        {name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  )
}

export { OrganizationAvatar }

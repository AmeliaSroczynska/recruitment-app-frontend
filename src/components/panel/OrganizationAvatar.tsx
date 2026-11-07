import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

type OrganizationAvatarProps = {
  name: string
  logoUrl?: string | null
  className?: string
  fallbackClassName?: string
}

function OrganizationAvatar({
  name,
  logoUrl,
  className,
  fallbackClassName,
}: OrganizationAvatarProps) {
  return (
    <Avatar className={cn('size-[30px] rounded-lg after:border-0', className)}>
      {logoUrl && (
        <AvatarImage
          src={logoUrl}
          alt=""
          className="rounded-[inherit] object-cover"
        />
      )}
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

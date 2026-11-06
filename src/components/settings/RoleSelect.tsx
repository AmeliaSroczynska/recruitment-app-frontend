import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { ROLES, ROLE_LABELS } from '@/panel/roles'

type RoleSelectProps = {
  id?: string
  value: string
  disabled?: boolean
  className?: string
  onChange: (role: string) => void
}

function RoleSelect({
  id,
  value,
  disabled,
  className,
  onChange,
}: RoleSelectProps) {
  return (
    <Select
      items={ROLE_LABELS}
      value={value}
      disabled={disabled}
      onValueChange={(role) => role && onChange(role)}
    >
      <SelectTrigger
        id={id}
        aria-label="Rola"
        className={cn(
          'h-9 w-full rounded-lg border-border bg-card text-sm shadow-none md:w-[150px]',
          className,
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ROLES.map((role) => (
          <SelectItem key={role} value={role}>
            {ROLE_LABELS[role]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export { RoleSelect }

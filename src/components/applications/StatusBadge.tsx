import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { STATUS_LABELS, type ApplicationStatus } from '@/panel/applications'

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  new: 'bg-muted text-muted-foreground',
  interview: 'bg-muted text-ochre-dark',
  to_decide: 'bg-sand/40 text-on-ochre',
  accepted: 'bg-moss-light text-olive-dark',
  rejected: 'bg-destructive/15 text-destructive',
}

type StatusBadgeProps = {
  status: ApplicationStatus
  className?: string
}

function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge className={cn('rounded-lg', STATUS_STYLES[status], className)}>
      {STATUS_LABELS[status]}
    </Badge>
  )
}

export { StatusBadge }

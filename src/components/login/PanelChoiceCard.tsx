import { ArrowRight, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

type PanelChoiceCardProps = {
  to: string
  title: string
  description: string
  icon: LucideIcon
  iconClassName: string
}

function PanelChoiceCard({
  to,
  title,
  description,
  icon: Icon,
  iconClassName,
}: PanelChoiceCardProps) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-3.5 rounded-[14px] border border-border bg-card px-4 py-[15px] shadow-[0_1px_1px_rgba(34,32,27,0.05)] transition-colors outline-none hover:border-stone focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <span
        className={cn(
          'flex size-12 shrink-0 items-center justify-center rounded-xl',
          iconClassName,
        )}
      >
        <Icon className="size-[22px]" strokeWidth={1.75} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
        <span className="text-[15px] leading-[21.8px] font-semibold text-foreground">
          {title}
        </span>
        <span className="text-[13px] leading-[18.2px] text-muted-foreground">
          {description}
        </span>
      </span>
      <ArrowRight
        className="size-[18px] shrink-0 text-stone transition-transform group-hover:translate-x-0.5"
        strokeWidth={1.75}
      />
    </Link>
  )
}

export { PanelChoiceCard }

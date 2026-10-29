import { ArrowRight, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
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
    <Item
      variant="outline"
      render={<Link to={to} />}
      className="flex-nowrap rounded-[14px] bg-card py-[15px] shadow-[0_1px_1px_rgba(34,32,27,0.05)] [a]:hover:border-stone [a]:hover:bg-card"
    >
      <ItemMedia
        className={cn(
          'size-12 rounded-xl group-has-data-[slot=item-description]/item:translate-y-0 group-has-data-[slot=item-description]/item:self-center',
          iconClassName,
        )}
      >
        <Icon className="size-[22px]" strokeWidth={1.75} />
      </ItemMedia>
      <ItemContent className="min-w-0 gap-[3px]">
        <ItemTitle className="text-[15px] leading-[21.8px] font-semibold text-foreground">
          {title}
        </ItemTitle>
        <ItemDescription className="text-[13px] leading-[18.2px]">
          {description}
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <ArrowRight
          className="size-[18px] text-stone transition-transform group-hover/item:translate-x-0.5"
          strokeWidth={1.75}
        />
      </ItemActions>
    </Item>
  )
}

export { PanelChoiceCard }

import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { OrganizationAvatar } from '@/components/panel/OrganizationAvatar'
import { cn } from '@/lib/utils'

const LOGO_COLORS = [
  'bg-ochre text-on-ochre',
  'bg-olive text-surface',
  'bg-sage text-foreground',
]

type OrganizationTileProps = {
  to: string
  name: string
  index: number
}

function OrganizationTile({ to, name, index }: OrganizationTileProps) {
  return (
    <Item
      variant="outline"
      render={<Link to={to} />}
      className="h-[82px] flex-nowrap rounded-[14px] bg-card px-4 shadow-tile lg:h-[90px] lg:px-5 [a]:hover:border-stone [a]:hover:bg-card"
    >
      <ItemMedia>
        <OrganizationAvatar
          name={name}
          className="size-12 rounded-xl"
          fallbackClassName={cn(
            'text-xl',
            LOGO_COLORS[index % LOGO_COLORS.length],
          )}
        />
      </ItemMedia>
      <ItemContent className="min-w-0">
        <ItemTitle className="text-base leading-5 font-semibold text-foreground">
          {name}
        </ItemTitle>
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

export { OrganizationTile }

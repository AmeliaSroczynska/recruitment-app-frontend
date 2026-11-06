import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Item, ItemContent, ItemTitle } from '@/components/ui/item'

function NewOrganizationTile() {
  return (
    <Item
      variant="outline"
      render={<Link to="/login/organization/new" />}
      className="h-[82px] flex-nowrap justify-center gap-2 rounded-[14px] border-2 border-dashed border-sand bg-transparent px-4 text-ochre-dark lg:h-[90px] [a]:hover:border-ochre [a]:hover:bg-surface"
    >
      <Plus className="size-[18px]" strokeWidth={2} />
      <ItemContent className="flex-none">
        <ItemTitle className="text-base leading-5 font-semibold text-ochre-dark">
          Utwórz organizację
        </ItemTitle>
      </ItemContent>
    </Item>
  )
}

export { NewOrganizationTile }

import { Search } from 'lucide-react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'

type ApplicationFiltersProps = {
  search: string
  onSearchChange: (search: string) => void
}

function ApplicationFilters({
  search,
  onSearchChange,
}: ApplicationFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row md:justify-end">
      <InputGroup className="h-11 rounded-[10px] border-border bg-card shadow-none md:h-9 md:w-[270px]">
        <InputGroupAddon className="pr-1.5 pl-3">
          <Search />
        </InputGroupAddon>
        <InputGroupInput
          type="search"
          aria-label="Szukaj kandydata"
          placeholder="Szukaj kandydata"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          className="text-sm"
        />
      </InputGroup>
    </div>
  )
}

export { ApplicationFilters }

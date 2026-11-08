import { ArrowDown, ArrowUp } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { StatusBadge } from '@/components/applications/StatusBadge'
import { UserAvatar } from '@/components/panel/UserAvatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AVATAR_COLORS,
  formatDateTime,
  formatRating,
  type ApplicationListItem,
} from '@/panel/applications'
import { getDisplayName } from '@/panel/user'

type SortableHeadProps = {
  label: string
  field: string
  firstOrdering: string
  ordering: string
  onOrderingChange: (ordering: string) => void
  className?: string
}

function SortableHead({
  label,
  field,
  firstOrdering,
  ordering,
  onOrderingChange,
  className,
}: SortableHeadProps) {
  const active = ordering.replace('-', '') === field
  const descending = ordering.startsWith('-')
  const Icon = descending ? ArrowDown : ArrowUp

  function toggle() {
    if (!active) {
      onOrderingChange(firstOrdering)
      return
    }
    onOrderingChange(descending ? field : `-${field}`)
  }

  return (
    <TableHead
      className={className}
      aria-sort={active ? (descending ? 'descending' : 'ascending') : 'none'}
    >
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={toggle}
        className="-ml-2 h-7 gap-1 rounded-lg px-2 font-medium text-inherit"
      >
        {label}
        {active && <Icon className="size-3.5" />}
      </Button>
    </TableHead>
  )
}

type ApplicationTableProps = {
  applications: ApplicationListItem[]
  ordering: string
  onOrderingChange: (ordering: string) => void
}

function ApplicationTable({
  applications,
  ordering,
  onOrderingChange,
}: ApplicationTableProps) {
  const { search } = useLocation()
  const sortProps = { ordering, onOrderingChange }

  return (
    <Card className="gap-0 rounded-2xl py-0 shadow-card ring-border">
      <Table className="text-sm">
        <TableHeader className="bg-paper">
          <TableRow className="hover:bg-transparent">
            <SortableHead
              label="Kandydat"
              field="name"
              firstOrdering="name"
              className="h-10 w-[34%] border-r border-border px-4 text-muted-foreground"
              {...sortProps}
            />
            <TableHead className="h-10 px-4 font-medium text-muted-foreground">
              Status
            </TableHead>
            <SortableHead
              label="Ocena"
              field="rating"
              firstOrdering="-rating"
              className="h-10 px-4 text-muted-foreground"
              {...sortProps}
            />
            <SortableHead
              label="Zgłoszono"
              field="submitted_at"
              firstOrdering="submitted_at"
              className="h-10 px-4 text-muted-foreground"
              {...sortProps}
            />
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application, index) => {
            const rating = formatRating(application)
            return (
              <TableRow
                key={application.id}
                className="relative h-14 cursor-pointer hover:bg-paper/60"
              >
                <TableCell className="border-r border-border px-4">
                  <div className="flex items-center gap-3">
                    <UserAvatar
                      user={application}
                      className="size-9"
                      fallbackClassName={
                        AVATAR_COLORS[index % AVATAR_COLORS.length]
                      }
                    />
                    <div className="min-w-0">
                      <Link
                        to={`${application.id}`}
                        state={{ search }}
                        className="font-medium text-foreground after:absolute after:inset-0 hover:underline"
                      >
                        {getDisplayName(application)}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {application.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4">
                  <StatusBadge status={application.status} />
                </TableCell>
                <TableCell className="px-4">
                  {rating ?? <span className="text-stone">-</span>}
                </TableCell>
                <TableCell className="px-4 text-muted-foreground">
                  {formatDateTime(application.submitted_at)}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Card>
  )
}

export { ApplicationTable }

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { APPLICATION_PAGE_SIZE } from '@/panel/applications'

type ApplicationPaginationProps = {
  page: number
  count: number
  onPageChange: (page: number) => void
}

function ApplicationPagination({
  page,
  count,
  onPageChange,
}: ApplicationPaginationProps) {
  const pages = Math.ceil(count / APPLICATION_PAGE_SIZE)
  if (pages <= 1) {
    return null
  }
  const first = (page - 1) * APPLICATION_PAGE_SIZE + 1
  const last = Math.min(page * APPLICATION_PAGE_SIZE, count)

  return (
    <nav
      aria-label="Strony zgłoszeń"
      className="mt-4 flex items-center justify-between gap-3 text-sm text-muted-foreground"
    >
      <span>
        {first}-{last} z {count}
      </span>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          aria-label="Poprzednia strona"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-[10px] bg-card"
        >
          <ChevronLeft />
        </Button>
        <span>
          {page} / {pages}
        </span>
        <Button
          variant="outline"
          size="icon"
          aria-label="Następna strona"
          disabled={page >= pages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-[10px] bg-card"
        >
          <ChevronRight />
        </Button>
      </div>
    </nav>
  )
}

export { ApplicationPagination }

import { Link } from 'react-router-dom'
import { UserAvatar } from '@/components/panel/UserAvatar'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  formatDays,
  formatPercent,
  formatProgress,
  type RankingEntry,
} from '@/panel/statistics'
import { getDisplayName } from '@/panel/user'

const PODIUM_ORDER = [1, 0, 2]

const PODIUM_STYLES = [
  'h-[108px] bg-secondary text-ochre-dark',
  'h-20 bg-moss-light text-olive-dark',
  'h-16 bg-secondary text-muted-foreground',
]

type PodiumCardProps = {
  editionId: number
  ranking: RankingEntry[]
}

function getPath(editionId: number, entry: RankingEntry) {
  return `/organization/${editionId}/applications/${entry.application_id}`
}

function PodiumPlace({
  editionId,
  entry,
  place,
}: {
  editionId: number
  entry: RankingEntry
  place: number
}) {
  return (
    <Link
      to={getPath(editionId, entry)}
      className="group flex min-w-0 flex-1 flex-col items-center"
    >
      <UserAvatar
        user={entry}
        className={place === 0 ? 'size-12' : 'size-10'}
        fallbackClassName={cn(
          'bg-secondary text-foreground',
          place === 0 && 'text-sm',
        )}
      />
      <span className="mt-2 flex max-w-full flex-col items-center gap-0.5 text-center">
        <span className="truncate text-sm text-foreground group-hover:underline">
          {getDisplayName(entry)}
        </span>
        <span className="text-[11px] text-muted-foreground">
          {formatProgress(entry)}
        </span>
      </span>
      <span
        className={cn(
          'mt-2 flex w-full flex-col items-center justify-center rounded-t-xl',
          PODIUM_STYLES[place],
        )}
      >
        <span className="font-heading text-2xl leading-none font-bold">
          {place + 1}
        </span>
        <span className="mt-1.5 text-[11px]">
          {formatPercent(entry.percent) ?? 'x'}
        </span>
      </span>
    </Link>
  )
}

function PodiumCard({ editionId, ranking }: PodiumCardProps) {
  const podium = PODIUM_ORDER.filter((place) => ranking[place])
  const rest = ranking.slice(3)

  return (
    <Card className="gap-0 rounded-2xl bg-card py-5 shadow-card ring-border md:py-6">
      <CardContent className="flex flex-col gap-4 px-5 md:px-6">
        <h3 className="font-heading text-base font-semibold text-foreground">
          Podium wdrożeń
        </h3>
        {ranking.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Nikt nie jest jeszcze we wdrożeniu.
          </p>
        ) : (
          <>
            <div className="hidden items-end gap-3 pt-1 md:flex">
              {podium.map((place) => (
                <PodiumPlace
                  key={ranking[place].application_id}
                  editionId={editionId}
                  entry={ranking[place]}
                  place={place}
                />
              ))}
            </div>
            {rest.length > 0 && (
              <ol className="mt-1 hidden border-t border-border pt-2.5 md:block">
                {rest.map((entry, index) => (
                  <li key={entry.application_id}>
                    <Link
                      to={getPath(editionId, entry)}
                      className="group grid grid-cols-[20px_1fr_auto_64px] items-center gap-3 py-1 text-sm"
                    >
                      <span className="text-muted-foreground">
                        {index + 4}.
                      </span>
                      <span className="truncate text-foreground group-hover:underline">
                        {getDisplayName(entry)}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {formatDays(entry.days)}
                      </span>
                      <span className="text-right text-muted-foreground tabular-nums">
                        {formatPercent(entry.percent) ?? 'x'}
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            )}
            <ol className="md:hidden">
              {ranking.map((entry, index) => (
                <li
                  key={entry.application_id}
                  className="border-t border-border first:border-t-0"
                >
                  <Link
                    to={getPath(editionId, entry)}
                    className="flex items-center gap-3 py-3"
                  >
                    <span
                      className={cn(
                        'flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-medium',
                        index < 3
                          ? 'bg-ochre text-on-ochre'
                          : 'bg-secondary text-muted-foreground',
                      )}
                    >
                      {index + 1}
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-sm font-semibold text-foreground">
                        {getDisplayName(entry)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {index < 3
                          ? formatProgress(entry)
                          : formatDays(entry.days)}
                      </span>
                    </span>
                    <span className="text-sm font-semibold text-foreground tabular-nums">
                      {formatPercent(entry.percent) ?? 'x'}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export { PodiumCard }

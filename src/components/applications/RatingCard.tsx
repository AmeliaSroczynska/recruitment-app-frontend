import { useEffect, useState } from 'react'
import { CollapsibleCard } from '@/components/applications/CollapsibleCard'
import { UserAvatar } from '@/components/panel/UserAvatar'
import { FieldError } from '@/components/ui/field'
import { Skeleton } from '@/components/ui/skeleton'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { api, ApiError } from '@/lib/api'
import { cn } from '@/lib/utils'
import type { Rating } from '@/panel/applications'
import { getDisplayName } from '@/panel/user'

const VALUES = [1, 2, 3, 4, 5]

type RatingCardProps = {
  path: string
  membershipId: number
  canEdit: boolean
}

function RatingDots({ value }: { value: number }) {
  return (
    <span className="flex gap-1" aria-hidden="true">
      {VALUES.map((dot) => (
        <span
          key={dot}
          className={cn(
            'size-2 rounded-full',
            dot <= value ? 'bg-sage' : 'bg-border',
          )}
        />
      ))}
    </span>
  )
}

function RatingCard({ path, membershipId, canEdit }: RatingCardProps) {
  const [ratings, setRatings] = useState<Rating[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api<Rating[]>(path)
      .then(setRatings)
      .catch(() => setError('Nie udało się wczytać ocen.'))
  }, [path])

  async function rate(value: number) {
    setError('')
    try {
      setRatings(await api<Rating[]>(path, { method: 'POST', body: { value } }))
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : 'Brak połączenia z serwerem. Spróbuj ponownie.',
      )
    }
  }

  const mine = ratings?.find((rating) => rating.membership === membershipId)
  const others =
    ratings?.filter((rating) => rating.membership !== membershipId) ?? []
  const average =
    ratings && ratings.length > 0
      ? ratings.reduce((sum, rating) => sum + rating.value, 0) / ratings.length
      : null

  return (
    <CollapsibleCard title="Ocena kandydata">
      {!ratings && !error && <Skeleton className="mt-4 h-24 w-full" />}
      {ratings && (
        <div className="mt-4 grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-10">
          {canEdit && (
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-foreground">
                Twoja ocena ogólna
              </p>
              <ToggleGroup
                aria-label="Twoja ocena ogólna"
                variant="outline"
                spacing={0}
                value={mine ? [String(mine.value)] : []}
                onValueChange={(selected) =>
                  selected[0] && rate(Number(selected[0]))
                }
                className="rounded-[10px] bg-card"
              >
                {VALUES.map((value) => (
                  <ToggleGroupItem
                    key={value}
                    value={String(value)}
                    aria-label={`Ocena ${value}`}
                    className="h-10 w-10 border-border font-normal text-muted-foreground first:rounded-l-[10px]! last:rounded-r-[10px]! data-pressed:bg-sand/30 data-pressed:font-medium data-pressed:text-ochre-dark"
                  >
                    {value}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          )}
          <div
            className={cn('flex flex-col gap-2', !canEdit && 'md:col-span-2')}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-foreground">
                {canEdit ? 'Jak ocenili inni' : 'Oceny zespołu'}
              </p>
              {average !== null && (
                <p className="text-sm text-muted-foreground">
                  średnia zespołu {average.toFixed(1)}/5
                </p>
              )}
            </div>
            {others.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {canEdit
                  ? 'Nikt inny jeszcze nie ocenił kandydata.'
                  : 'Nikt jeszcze nie ocenił kandydata.'}
              </p>
            ) : (
              <ul className="divide-y divide-border border-b border-border">
                {others.map((rating) => (
                  <li
                    key={rating.id}
                    className="flex items-center gap-3 py-2.5 text-sm"
                  >
                    <UserAvatar
                      user={rating}
                      className="size-7"
                      fallbackClassName="bg-moss-light text-[11px]"
                    />
                    <span className="min-w-0 flex-1 truncate text-foreground">
                      {getDisplayName(rating)}
                    </span>
                    <RatingDots value={rating.value} />
                    <span className="w-4 text-right text-foreground">
                      {rating.value}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
      {error && <FieldError className="mt-3">{error}</FieldError>}
    </CollapsibleCard>
  )
}

export { RatingCard }

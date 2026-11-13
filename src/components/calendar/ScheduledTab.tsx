import { useEffect, useState } from 'react'
import { ScheduledCalendar } from '@/components/calendar/ScheduledCalendar'
import { ErrorAlert } from '@/components/panel/ErrorAlert'
import { Skeleton } from '@/components/ui/skeleton'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { api } from '@/lib/api'
import type { InterviewDays } from '@/panel/calendar'
import type { EditionInterview } from '@/panel/interviews'

type ScheduledTabProps = {
  editionId: number
  canFilterMine: boolean
}

type LoadedInterviews = {
  path: string
  interviews: EditionInterview[] | null
  days: string[]
}

function ScheduledTab({ editionId, canFilterMine }: ScheduledTabProps) {
  const [scope, setScope] = useState(canFilterMine ? 'mine' : 'all')
  const [loaded, setLoaded] = useState<LoadedInterviews | null>(null)
  const path = `editions/${editionId}/scheduled-interviews/${scope === 'mine' ? '?mine=true' : ''}`

  useEffect(() => {
    Promise.all([
      api<EditionInterview[]>(path),
      api<InterviewDays>(`editions/${editionId}/interview-days/`),
    ])
      .then(([interviews, interviewDays]) =>
        setLoaded({ path, interviews, days: interviewDays.dates }),
      )
      .catch(() => setLoaded({ path, interviews: null, days: [] }))
  }, [editionId, path])

  const isLoading = loaded?.path !== path
  const interviews = loaded?.interviews
  const days = [
    ...new Set([
      ...(loaded?.days ?? []),
      ...(interviews ?? []).flatMap((interview) =>
        interview.date ? [interview.date] : [],
      ),
    ]),
  ].sort()

  return (
    <div className="flex flex-col gap-4">
      {canFilterMine && (
        <ToggleGroup
          aria-label="Które rozmowy pokazać"
          variant="outline"
          spacing={2}
          value={[scope]}
          onValueChange={(selected) => selected[0] && setScope(selected[0])}
        >
          <ToggleGroupItem
            value="mine"
            className="h-9 rounded-[10px]! border-border bg-card px-4 data-pressed:border-ochre data-pressed:bg-ochre data-pressed:text-on-ochre"
          >
            Moje rozmowy
          </ToggleGroupItem>
          <ToggleGroupItem
            value="all"
            className="h-9 rounded-[10px]! border-border bg-card px-4 data-pressed:border-ochre data-pressed:bg-ochre data-pressed:text-on-ochre"
          >
            Wszystkie rozmowy
          </ToggleGroupItem>
        </ToggleGroup>
      )}
      {!loaded && <Skeleton className="h-96 w-full rounded-2xl" />}
      {loaded && !interviews && (
        <ErrorAlert>Nie udało się wczytać umówionych rozmów.</ErrorAlert>
      )}
      {interviews && days.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Nie ma jeszcze dni rozmów ani umówionych rozmów. Dni ustawisz w
          zakładce Konfiguracja.
        </p>
      )}
      {interviews && days.length > 0 && (
        <div className={isLoading ? 'opacity-60' : undefined}>
          {interviews.length === 0 && (
            <p className="mb-3 text-sm text-muted-foreground">
              {scope === 'mine'
                ? 'Nie prowadzisz jeszcze żadnej umówionej rozmowy.'
                : 'Nie ma jeszcze umówionych rozmów.'}
            </p>
          )}
          <ScheduledCalendar
            days={days}
            interviews={interviews}
            editionId={editionId}
          />
        </div>
      )}
    </div>
  )
}

export { ScheduledTab }

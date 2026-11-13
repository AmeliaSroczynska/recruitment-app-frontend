import { useEffect, useState } from 'react'
import { AvailabilityGrid } from '@/components/calendar/AvailabilityGrid'
import { ScheduleDialog } from '@/components/calendar/ScheduleDialog'
import { ErrorAlert } from '@/components/panel/ErrorAlert'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FieldError } from '@/components/ui/field'
import { Skeleton } from '@/components/ui/skeleton'
import { api, ApiError } from '@/lib/api'
import { cn } from '@/lib/utils'
import {
  cellsToSlots,
  formatDuration,
  formatShortDay,
  slotsToCells,
  toIsoDate,
  type ApplicationToSchedule,
  type AvailabilitySlot,
  type InterviewDays,
} from '@/panel/calendar'
import type { InterviewTemplate } from '@/panel/interviews'
import { getDisplayName } from '@/panel/user'

type ToScheduleTabProps = {
  editionId: number
  canEdit: boolean
}

function formatTerm(slot: AvailabilitySlot) {
  return `${formatShortDay(slot.date)}, ${slot.start_time}-${slot.end_time}`
}

function ToScheduleTab({ editionId, canEdit }: ToScheduleTabProps) {
  const [applications, setApplications] = useState<
    ApplicationToSchedule[] | null
  >(null)
  const [days, setDays] = useState<string[]>([])
  const [templates, setTemplates] = useState<InterviewTemplate[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [cells, setCells] = useState<Set<string>>(new Set())
  const [loadError, setLoadError] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isChoosingTemplate, setIsChoosingTemplate] = useState(false)

  useEffect(() => {
    Promise.all([
      api<ApplicationToSchedule[]>(`editions/${editionId}/to-schedule/`),
      api<InterviewDays>(`editions/${editionId}/interview-days/`),
    ])
      .then(([data, interviewDays]) => {
        setApplications(data)
        setDays(interviewDays.dates)
        setSelectedId(data[0]?.id ?? null)
      })
      .catch(() =>
        setLoadError('Nie udało się wczytać kandydatów do umówienia.'),
      )
  }, [editionId])

  useEffect(() => {
    if (canEdit) {
      api<InterviewTemplate[]>(`editions/${editionId}/interview-templates/`)
        .then(setTemplates)
        .catch(() => setTemplates([]))
    }
  }, [editionId, canEdit])

  if (!applications) {
    return loadError ? (
      <ErrorAlert>{loadError}</ErrorAlert>
    ) : (
      <Skeleton className="h-96 w-full rounded-2xl" />
    )
  }

  const selected = applications.find(
    (application) => application.id === selectedId,
  )
  const available = slotsToCells(selected?.slots ?? [])
  const today = toIsoDate(new Date())
  const columns = [
    ...new Set([...days, ...(selected?.slots ?? []).map((slot) => slot.date)]),
  ]
    .filter((day) => day >= today)
    .sort()
  const picked = cellsToSlots(cells, columns)
  const slot = picked.length === 1 ? picked[0] : null

  function select(applicationId: number) {
    setSelectedId(applicationId)
    setCells(new Set())
    setError('')
  }

  function pick(next: Set<string>) {
    const added = [...next].find((key) => !cells.has(key))
    const day = added?.split(' ')[0]
    setCells(
      new Set(
        [...next].filter(
          (key) => available.has(key) && (!day || key.startsWith(day)),
        ),
      ),
    )
    setError('')
    setMessage('')
  }

  async function schedule(templateId?: number) {
    if (!selected || !slot) {
      return
    }
    setIsChoosingTemplate(false)
    setError('')
    setIsSaving(true)
    try {
      await api(`editions/${editionId}/applications/${selected.id}/schedule/`, {
        method: 'POST',
        body: { ...slot, ...(templateId && { template_id: templateId }) },
      })
      const rest = (applications ?? []).filter(
        (application) => application.id !== selected.id,
      )
      setApplications(rest)
      setSelectedId(rest[0]?.id ?? null)
      setCells(new Set())
      setMessage(
        `Umówiono rozmowę z: ${getDisplayName(selected)}, ${formatTerm(slot)}. Kandydat dostał mail z terminem.`,
      )
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : 'Brak połączenia z serwerem. Spróbuj ponownie.',
      )
    }
    setIsSaving(false)
  }

  return (
    <div className="flex flex-col gap-4">
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
      {applications.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nikt nie czeka na umówienie. Tu pojawią się kandydaci ze statusem
          Rozmowa, którzy podali swoją dostępność.
        </p>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            {applications.map((application) => (
              <button
                key={application.id}
                type="button"
                onClick={() => select(application.id)}
                className={cn(
                  'rounded-[10px] border border-border bg-card px-3 py-1.5 text-sm text-foreground transition-colors hover:border-sand',
                  application.id === selectedId &&
                    'border-ochre bg-paper font-medium text-ochre-dark hover:border-ochre',
                )}
              >
                {getDisplayName(application)}
              </button>
            ))}
          </div>
          {selected && (
            <>
              {canEdit && (
                <p className="text-sm text-muted-foreground">
                  Jasne pola to dostępność kandydata. Zaznacz w nich godziny
                  rozmowy.
                </p>
              )}
              <AvailabilityGrid
                days={columns}
                cells={cells}
                highlighted={available}
                onChange={canEdit ? pick : undefined}
              />
              {canEdit && cells.size > 0 && (
                <Card className="flex-row flex-wrap items-center justify-between gap-3 rounded-2xl px-4 py-3 shadow-card ring-border">
                  {slot ? (
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {formatTerm(slot)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Rozmowa z: {getDisplayName(selected)} ·{' '}
                        {formatDuration(slot)}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Zaznacz jeden ciągły przedział.
                    </p>
                  )}
                  <Button
                    type="button"
                    variant="accent"
                    disabled={!slot || isSaving}
                    onClick={() =>
                      selected.pending_interview
                        ? schedule()
                        : setIsChoosingTemplate(true)
                    }
                    className="h-9 px-4"
                  >
                    {isSaving ? 'Umawianie...' : 'Umów rozmowę'}
                  </Button>
                </Card>
              )}
              {error && <FieldError>{error}</FieldError>}
            </>
          )}
        </>
      )}
      {isChoosingTemplate && selected && slot && (
        <ScheduleDialog
          name={getDisplayName(selected)}
          term={formatTerm(slot)}
          templates={templates}
          onOpenChange={setIsChoosingTemplate}
          onConfirm={schedule}
        />
      )}
    </div>
  )
}

export { ToScheduleTab }

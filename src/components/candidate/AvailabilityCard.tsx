import { Info } from 'lucide-react'
import { useEffect, useState } from 'react'
import { AvailabilityGrid } from '@/components/calendar/AvailabilityGrid'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FieldError } from '@/components/ui/field'
import { Skeleton } from '@/components/ui/skeleton'
import { api, ApiError } from '@/lib/api'
import {
  cellsToSlots,
  formatMonths,
  slotsToCells,
  type CandidateAvailability,
} from '@/panel/calendar'

type AvailabilityCardProps = {
  applicationId: number
}

function AvailabilityCard({ applicationId }: AvailabilityCardProps) {
  const path = `me/applications/${applicationId}/availability/`
  const [availability, setAvailability] =
    useState<CandidateAvailability | null>(null)
  const [cells, setCells] = useState<Set<string>>(new Set())
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  function show(data: CandidateAvailability) {
    setAvailability(data)
    setCells(slotsToCells(data.slots))
  }

  useEffect(() => {
    api<CandidateAvailability>(path)
      .then(show)
      .catch(() => setError('Nie udało się wczytać kalendarza.'))
  }, [path])

  async function send() {
    if (!availability) {
      return
    }
    setError('')
    setMessage('')
    setIsSaving(true)
    try {
      show(
        await api<CandidateAvailability>(path, {
          method: 'PUT',
          body: { slots: cellsToSlots(cells, availability.days) },
        }),
      )
      setMessage(
        'Wysłano. Możesz zmienić dostępność, dopóki nie wybierzemy terminu.',
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
    <Card className="gap-0 rounded-[18px] p-5 shadow-card ring-border md:p-6">
      <h2 className="font-heading text-base font-semibold text-foreground">
        Twoja dostępność
      </h2>
      {!availability && !error && <Skeleton className="mt-4 h-64 w-full" />}
      {availability && availability.days.length === 0 && (
        <p className="mt-2 text-sm text-muted-foreground">
          Organizacja nie ustaliła jeszcze dni rozmów. Zajrzyj tu za jakiś czas.
        </p>
      )}
      {availability && availability.days.length > 0 && (
        <>
          <p className="mt-1 text-sm text-muted-foreground">
            Zaznacz w kalendarzu godziny, w których możesz przyjść. Kliknij albo
            przeciągnij po polach.
          </p>
          {availability.info && (
            <p className="mt-4 flex gap-2 rounded-xl bg-paper px-3 py-2.5 text-sm whitespace-pre-line text-foreground">
              <Info className="mt-0.5 size-4 shrink-0 text-ochre-dark" />
              {availability.info}
            </p>
          )}
          <p className="mt-4 mb-2 text-xs text-muted-foreground">
            {formatMonths(availability.days)}
          </p>
          <AvailabilityGrid
            days={availability.days}
            cells={cells}
            onChange={(next) => {
              setCells(next)
              setMessage('')
            }}
          />
          <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-dashed border-border pt-5">
            <Button
              type="button"
              onClick={send}
              disabled={isSaving}
              className="h-9 px-4"
            >
              {isSaving ? 'Wysyłanie...' : 'Wyślij dostępność'}
            </Button>
            {message && (
              <p className="text-sm text-muted-foreground">{message}</p>
            )}
          </div>
        </>
      )}
      {error && <FieldError className="mt-3">{error}</FieldError>}
    </Card>
  )
}

export { AvailabilityCard }

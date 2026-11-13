import { useEffect, useState, type FormEvent } from 'react'
import { MonthCalendar } from '@/components/calendar/MonthCalendar'
import { SettingsCard } from '@/components/settings/SettingsCard'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { api, ApiError } from '@/lib/api'
import type { InterviewDays } from '@/panel/calendar'

const FORM_ID = 'interview-days-form'

type InterviewDaysFormProps = {
  editionId: number
  canEdit: boolean
  onSavingChange: (isSaving: boolean) => void
}

function InterviewDaysForm({
  editionId,
  canEdit,
  onSavingChange,
}: InterviewDaysFormProps) {
  const path = `editions/${editionId}/interview-days/`
  const [dates, setDates] = useState<Set<string> | null>(null)
  const [info, setInfo] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  function show(data: InterviewDays) {
    setDates(new Set(data.dates))
    setInfo(data.info ?? '')
  }

  useEffect(() => {
    api<InterviewDays>(path)
      .then(show)
      .catch(() => setError('Nie udało się wczytać dni rozmów.'))
  }, [path])

  function toggle(date: string) {
    setDates((current) => {
      const next = new Set(current)
      if (next.has(date)) {
        next.delete(date)
      } else {
        next.add(date)
      }
      return next
    })
    setMessage('')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!dates) {
      return
    }
    setError('')
    setMessage('')
    onSavingChange(true)
    try {
      show(
        await api<InterviewDays>(path, {
          method: 'PUT',
          body: { dates: [...dates].sort(), info },
        }),
      )
      setMessage('Zapisano zmiany.')
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : 'Brak połączenia z serwerem. Spróbuj ponownie.',
      )
    }
    onSavingChange(false)
  }

  if (!dates) {
    return error ? (
      <FieldError>{error}</FieldError>
    ) : (
      <Skeleton className="h-96 w-full max-w-[560px] rounded-2xl" />
    )
  }

  return (
    <form
      id={FORM_ID}
      onSubmit={handleSubmit}
      className="grid items-start gap-4 lg:grid-cols-[minmax(0,560px)_minmax(0,1fr)] lg:gap-5"
    >
      <SettingsCard title="Daty">
        <p className="mt-1 text-sm text-muted-foreground lg:min-h-10">
          {canEdit
            ? 'Zaznacz dni, w które prowadzicie rozmowy. Kandydaci podadzą dostępność tylko w te dni.'
            : 'Dni, w które odbywają się rozmowy.'}
        </p>
        <div className="mt-4">
          <MonthCalendar
            selected={dates}
            onToggle={canEdit ? toggle : undefined}
          />
        </div>
      </SettingsCard>
      <SettingsCard title="Informacja dla kandydata">
        <p className="mt-1 text-sm text-muted-foreground lg:min-h-10">
          Kandydat zobaczy ten tekst, kiedy będzie zaznaczać swoją dostępność.
        </p>
        <Field className="mt-4">
          <FieldLabel htmlFor="interview-info" className="sr-only">
            Informacja dla kandydata
          </FieldLabel>
          <Textarea
            id="interview-info"
            value={info}
            onChange={(event) => {
              setInfo(event.target.value)
              setMessage('')
            }}
            disabled={!canEdit}
            maxLength={2000}
            placeholder="Np. rozmowy odbywają się w budynku C-13 sala 2.14."
            className="min-h-28 rounded-[10px] bg-card"
          />
        </Field>
      </SettingsCard>
      {(error || message) && (
        <p
          className={
            error
              ? 'text-sm text-destructive lg:col-span-2'
              : 'text-sm text-muted-foreground lg:col-span-2'
          }
        >
          {error || message}
        </p>
      )}
    </form>
  )
}

export { FORM_ID, InterviewDaysForm }

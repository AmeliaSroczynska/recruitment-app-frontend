import { Clock, Info } from 'lucide-react'
import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FieldError } from '@/components/ui/field'
import { api, ApiError } from '@/lib/api'
import {
  formatLongDay,
  fromIsoDate,
  type CandidateAvailability,
  type ScheduledInterview,
} from '@/panel/calendar'

type InterviewCardProps = {
  path: string
  interview: ScheduledInterview
  info: string | null
  onChange: (availability: CandidateAvailability) => void
}

function InterviewCard({
  path,
  interview,
  info,
  onChange,
}: InterviewCardProps) {
  const [error, setError] = useState('')
  const [isCancelling, setIsCancelling] = useState(false)
  const date = fromIsoDate(interview.date)

  async function cancel() {
    setError('')
    setIsCancelling(true)
    try {
      onChange(await api<CandidateAvailability>(path, { method: 'POST' }))
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : 'Brak połączenia z serwerem. Spróbuj ponownie.',
      )
      setIsCancelling(false)
    }
  }

  return (
    <Card className="gap-0 rounded-[18px] p-5 shadow-card ring-border md:p-6">
      <h2 className="font-heading text-base font-semibold text-foreground">
        Twoja rozmowa
      </h2>
      <div className="mt-4 flex items-center gap-4">
        <div className="flex w-14 shrink-0 flex-col overflow-hidden rounded-xl border-2 border-olive text-center">
          <span className="bg-olive py-0.5 text-[11px] font-semibold text-surface">
            {date.toLocaleDateString('pl-PL', { month: 'short' })}
          </span>
          <span className="py-1 font-heading text-2xl font-extrabold text-olive">
            {date.getDate()}
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-[15px] font-medium text-foreground">
            {formatLongDay(interview.date)}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="size-3.5" />
            {interview.start_time}-{interview.end_time}
          </p>
        </div>
      </div>
      {info && (
        <p className="mt-4 flex gap-2 rounded-xl bg-paper px-3 py-2.5 text-sm whitespace-pre-line text-foreground">
          <Info className="mt-0.5 size-4 shrink-0 text-ochre-dark" />
          {info}
        </p>
      )}
      <AlertDialog>
        <AlertDialogTrigger
          disabled={isCancelling}
          render={
            <Button
              type="button"
              variant="outline"
              className="mt-4 h-9 self-start rounded-[10px] bg-card px-4 text-destructive hover:bg-destructive/10 hover:text-destructive"
            />
          }
        >
          {isCancelling ? 'Odwoływanie...' : 'Odwołaj rozmowę'}
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading font-semibold">
              Odwołać rozmowę?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Termin zostanie zwolniony, a zespół dostanie wiadomość. Potem
              możesz poprawić swoją dostępność i poczekać na nowy termin.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-10 rounded-[10px]">
              Zostaw rozmowę
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={cancel}
              className="h-10 rounded-[10px] font-semibold"
            >
              Odwołaj rozmowę
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {error && <FieldError className="mt-3">{error}</FieldError>}
    </Card>
  )
}

export { InterviewCard }

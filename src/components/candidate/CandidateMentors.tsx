import { Check, Info } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ConfirmMentorDialog } from '@/components/candidate/ConfirmMentorDialog'
import { MentorChosenDialog } from '@/components/candidate/MentorChosenDialog'
import { MentorPhoto } from '@/components/onboarding/MentorPhoto'
import { ErrorAlert } from '@/components/panel/ErrorAlert'
import { Button } from '@/components/ui/button'
import { FieldError } from '@/components/ui/field'
import { Skeleton } from '@/components/ui/skeleton'
import { api, ApiError } from '@/lib/api'
import { cn } from '@/lib/utils'
import type { CandidateMentor, MentorSummary } from '@/panel/onboarding'

type CandidateMentorsProps = {
  applicationId: number
}

function CandidateMentors({ applicationId }: CandidateMentorsProps) {
  const path = `me/applications/${applicationId}/mentors/`
  const [mentors, setMentors] = useState<CandidateMentor[] | null>(null)
  const [loadError, setLoadError] = useState('')
  const [error, setError] = useState('')
  const [choosingId, setChoosingId] = useState<number | null>(null)
  const [pending, setPending] = useState<CandidateMentor | null>(null)
  const [chosen, setChosen] = useState<MentorSummary | null>(null)

  useEffect(() => {
    api<CandidateMentor[]>(path)
      .then(setMentors)
      .catch(() => setLoadError('Nie udało się wczytać mentorów.'))
  }, [path])

  async function choose(mentor: MentorSummary) {
    setPending(null)
    setError('')
    setChoosingId(mentor.id)
    try {
      setMentors(
        await api<CandidateMentor[]>(path, {
          method: 'POST',
          body: { mentor_id: mentor.id },
        }),
      )
      setChosen(mentor)
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : 'Brak połączenia z serwerem. Spróbuj ponownie.',
      )
    }
    setChoosingId(null)
  }

  if (loadError) {
    return <ErrorAlert>{loadError}</ErrorAlert>
  }

  if (!mentors) {
    return <Skeleton className="h-64 w-full rounded-2xl" />
  }

  if (mentors.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Zespół nie dodał jeszcze żadnych mentorów.
      </p>
    )
  }

  const hasMentor = mentors.some((mentor) => mentor.is_selected)

  return (
    <div className="flex flex-col gap-4">
      <p className="flex items-start gap-2 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" />
        {hasMentor
          ? 'Mentora nie możesz już zmienić. Jeśli jednak chcesz to zrobić, skontaktuj się z organizacją.'
          : 'Wybierz osobę, która pomoże Ci na start w organizacji. Wyboru nie da się później zmienić.'}
      </p>
      {error && <FieldError>{error}</FieldError>}
      <ul className="grid gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3">
        {mentors.map((mentor) => {
          const isFull = mentor.taken >= mentor.capacity
          return (
            <li
              key={mentor.id}
              className={cn(
                'relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card',
                mentor.is_selected &&
                  'border-olive-dark ring-1 ring-olive-dark',
              )}
            >
              {mentor.is_selected && (
                <span className="absolute top-3 right-3 flex size-6 items-center justify-center rounded-full bg-olive-dark text-surface">
                  <Check className="size-3.5" />
                </span>
              )}
              <MentorPhoto mentor={mentor} />
              <div className="flex flex-1 flex-col border-t border-border p-4">
                <p className="text-sm font-semibold text-foreground">
                  {mentor.first_name} {mentor.last_name}
                </p>
                {mentor.section && (
                  <p className="mt-1 text-[13px] font-medium text-olive">
                    {mentor.section}
                  </p>
                )}
                {mentor.how_can_help && (
                  <p className="mt-2 text-[13px] text-muted-foreground">
                    {mentor.how_can_help}
                  </p>
                )}
                {mentor.free_time && (
                  <p className="mt-3 border-t border-dashed border-border pt-2.5 text-xs text-muted-foreground">
                    Po godzinach: {mentor.free_time}
                  </p>
                )}
                <div className="mt-auto pt-4">
                  {mentor.is_selected ? (
                    <Button
                      disabled
                      className="h-9 w-full rounded-[10px] disabled:opacity-100"
                    >
                      Twój mentor
                    </Button>
                  ) : (
                    !hasMentor && (
                      <Button
                        variant="outline"
                        disabled={isFull || choosingId !== null}
                        onClick={() => setPending(mentor)}
                        className="h-9 w-full rounded-[10px] bg-card"
                      >
                        {isFull ? 'Brak wolnych miejsc' : 'Wybierz'}
                      </Button>
                    )
                  )}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
      <ConfirmMentorDialog
        mentor={pending}
        onCancel={() => setPending(null)}
        onConfirm={choose}
      />
      <MentorChosenDialog mentor={chosen} onClose={() => setChosen(null)} />
    </div>
  )
}

export { CandidateMentors }

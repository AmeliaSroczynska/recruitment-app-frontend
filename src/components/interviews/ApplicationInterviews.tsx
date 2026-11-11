import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { CollapsibleCard } from '@/components/applications/CollapsibleCard'
import { InterviewAnswers } from '@/components/interviews/InterviewAnswers'
import { InterviewersBox } from '@/components/interviews/InterviewersBox'
import { DeleteEntryDialog } from '@/components/onboarding/DeleteEntryDialog'
import { SettingsCard } from '@/components/settings/SettingsCard'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { FieldError } from '@/components/ui/field'
import { Skeleton } from '@/components/ui/skeleton'
import { api, ApiError } from '@/lib/api'
import { cn } from '@/lib/utils'
import type { Interview, InterviewTemplate } from '@/panel/interviews'

type ApplicationInterviewsProps = {
  editionId: number
  path: string
  canEdit: boolean
}

function ApplicationInterviews({
  editionId,
  path,
  canEdit,
}: ApplicationInterviewsProps) {
  const listPath = `${path}interviews/`
  const [interviews, setInterviews] = useState<Interview[] | null>(null)
  const [templates, setTemplates] = useState<InterviewTemplate[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [loadError, setLoadError] = useState('')
  const [error, setError] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    api<Interview[]>(listPath)
      .then((data) => {
        setInterviews(data)
        setSelectedId(data[0]?.id ?? null)
      })
      .catch(() => setLoadError('Nie udało się wczytać rozmów.'))
  }, [listPath])

  useEffect(() => {
    if (canEdit) {
      api<InterviewTemplate[]>(`editions/${editionId}/interview-templates/`)
        .then(setTemplates)
        .catch(() => setTemplates([]))
    }
  }, [editionId, canEdit])

  async function addInterview(templateId: number) {
    setError('')
    setIsAdding(true)
    try {
      const interview = await api<Interview>(listPath, {
        method: 'POST',
        body: { template_id: templateId },
      })
      setInterviews((current) => current && [...current, interview])
      setSelectedId(interview.id)
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : 'Brak połączenia z serwerem. Spróbuj ponownie.',
      )
    }
    setIsAdding(false)
  }

  async function removeInterview(interviewId: number) {
    setError('')
    try {
      await api(`${listPath}${interviewId}/`, { method: 'DELETE' })
      const rest = (interviews ?? []).filter(
        (interview) => interview.id !== interviewId,
      )
      setInterviews(rest)
      setSelectedId(rest[0]?.id ?? null)
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : 'Brak połączenia z serwerem. Spróbuj ponownie.',
      )
    }
  }

  function replaceInterview(interview: Interview) {
    setInterviews(
      (current) =>
        current &&
        current.map((item) => (item.id === interview.id ? interview : item)),
    )
  }

  if (!interviews) {
    return (
      <SettingsCard>
        {loadError ? (
          <FieldError>{loadError}</FieldError>
        ) : (
          <Skeleton className="h-20 w-full" />
        )}
      </SettingsCard>
    )
  }

  const selected = interviews.find((interview) => interview.id === selectedId)

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <SettingsCard>
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-heading text-base font-semibold text-foreground">
            Rozmowy z tą osobą
          </h2>
          {canEdit && (
            <DropdownMenu>
              <DropdownMenuTrigger
                disabled={isAdding}
                render={
                  <Button
                    variant="link"
                    className="h-auto gap-1 p-0 text-sm text-ochre-dark"
                  />
                }
              >
                <Plus className="size-4" />
                Dodaj rozmowę
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Wybierz szablon</DropdownMenuLabel>
                  {templates.length > 0 ? (
                    templates.map((template) => (
                      <DropdownMenuItem
                        key={template.id}
                        onClick={() => addInterview(template.id)}
                      >
                        {template.name}
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <p className="px-2 py-1.5 text-sm text-muted-foreground">
                      Najpierw dodaj szablon w zakładce Rozmowy.
                    </p>
                  )}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        {interviews.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {interviews.map((interview) => (
              <button
                key={interview.id}
                type="button"
                onClick={() => setSelectedId(interview.id)}
                className={cn(
                  'rounded-[10px] border border-border bg-card px-3 py-1.5 text-sm text-foreground transition-colors hover:border-sand',
                  interview.id === selectedId &&
                    'border-ochre bg-paper font-medium hover:border-ochre',
                )}
              >
                {interview.template_name}
              </button>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            Z tą osobą nie ma jeszcze żadnej rozmowy.
          </p>
        )}
        {error && <FieldError className="mt-3">{error}</FieldError>}
      </SettingsCard>
      {selected && (
        <CollapsibleCard
          title="Pytania i odpowiedzi"
          aside={
            canEdit && (
              <DeleteEntryDialog
                label="Usuń rozmowę"
                title="Usunąć rozmowę?"
                description="Rozmowa zniknie na stałe, razem z notatkami i ocenami z tej rozmowy."
                onConfirm={() => removeInterview(selected.id)}
              />
            )
          }
        >
          <div className="mt-4">
            <InterviewersBox
              key={selected.id}
              editionId={editionId}
              path={`${listPath}${selected.id}/`}
              interview={selected}
              canEdit={canEdit}
              onChange={replaceInterview}
            />
            <InterviewAnswers
              key={`answers-${selected.id}`}
              path={`${listPath}${selected.id}/`}
              canEdit={canEdit}
            />
          </div>
        </CollapsibleCard>
      )}
    </div>
  )
}

export { ApplicationInterviews }

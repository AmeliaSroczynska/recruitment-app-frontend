import { useEffect, useState } from 'react'
import { FieldError } from '@/components/ui/field'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { api, ApiError } from '@/lib/api'
import type { InterviewAnswer } from '@/panel/interviews'

const SCORES = [1, 2, 3, 4, 5]

type AnswerChange = {
  note?: string
  score?: number | null
}

type InterviewAnswersProps = {
  path: string
  canEdit: boolean
}

type AnswerCardProps = {
  answer: InterviewAnswer
  number: number
  canEdit: boolean
  onSave: (questionId: number, change: AnswerChange) => Promise<void>
}

function AnswerCard({ answer, number, canEdit, onSave }: AnswerCardProps) {
  const [note, setNote] = useState(answer.note ?? '')
  const label = String(number).padStart(2, '0')

  function saveNote() {
    if (note.trim() !== (answer.note ?? '')) {
      onSave(answer.question_id, { note })
    }
  }

  return (
    <li className="rounded-xl border border-border bg-muted/60 px-3 py-3 md:px-4">
      <p className="flex gap-2 text-sm text-foreground">
        <span className="pt-px text-xs text-muted-foreground">{label}</span>
        <span>{answer.text}</span>
      </p>
      <div className="mt-2 flex flex-col gap-3 md:pl-6">
        {canEdit ? (
          <Textarea
            aria-label={`Odpowiedź kandydata na pytanie ${label}`}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            onBlur={saveNote}
            placeholder="Odpowiedź kandydata..."
            maxLength={5000}
            className="min-h-14 rounded-[10px] bg-card"
          />
        ) : (
          <p className="text-sm whitespace-pre-line text-muted-foreground">
            {answer.note || 'Brak notatki z odpowiedzi.'}
          </p>
        )}
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Ocena</span>
          {canEdit ? (
            <ToggleGroup
              aria-label={`Ocena odpowiedzi na pytanie ${label}`}
              variant="outline"
              spacing={0}
              value={answer.score ? [String(answer.score)] : []}
              onValueChange={(selected) =>
                onSave(answer.question_id, {
                  score: selected[0] ? Number(selected[0]) : null,
                })
              }
              className="rounded-[10px] bg-card"
            >
              {SCORES.map((score) => (
                <ToggleGroupItem
                  key={score}
                  value={String(score)}
                  aria-label={`Ocena ${score}`}
                  className="h-8 w-8 border-border font-normal text-muted-foreground first:rounded-l-[10px]! last:rounded-r-[10px]! data-pressed:bg-sand/30 data-pressed:font-medium data-pressed:text-ochre-dark"
                >
                  {score}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          ) : (
            answer.score && (
              <span className="text-sm text-foreground">{answer.score}/5</span>
            )
          )}
          {!answer.score && (
            <span className="text-xs text-muted-foreground">brak oceny</span>
          )}
        </div>
      </div>
    </li>
  )
}

function InterviewAnswers({ path, canEdit }: InterviewAnswersProps) {
  const answersPath = `${path}answers/`
  const [answers, setAnswers] = useState<InterviewAnswer[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api<InterviewAnswer[]>(answersPath)
      .then(setAnswers)
      .catch(() => setError('Nie udało się wczytać pytań.'))
  }, [answersPath])

  async function save(questionId: number, change: AnswerChange) {
    setError('')
    try {
      const saved = await api<InterviewAnswer>(`${answersPath}${questionId}/`, {
        method: 'PATCH',
        body: change,
      })
      setAnswers(
        (current) =>
          current &&
          current.map((answer) =>
            answer.question_id === questionId ? saved : answer,
          ),
      )
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : 'Brak połączenia z serwerem. Spróbuj ponownie.',
      )
    }
  }

  if (!answers) {
    return error ? (
      <FieldError className="mt-3">{error}</FieldError>
    ) : (
      <Skeleton className="mt-3 h-32 w-full" />
    )
  }

  return (
    <div className="mt-3 flex flex-col gap-3">
      {answers.length > 0 ? (
        <ol className="flex flex-col gap-3">
          {answers.map((answer, index) => (
            <AnswerCard
              key={answer.question_id}
              answer={answer}
              number={index + 1}
              canEdit={canEdit}
              onSave={save}
            />
          ))}
        </ol>
      ) : (
        <p className="text-sm text-muted-foreground">
          Szablon tej rozmowy nie ma jeszcze pytań.
        </p>
      )}
      {error && <FieldError>{error}</FieldError>}
    </div>
  )
}

export { InterviewAnswers }

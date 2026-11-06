import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { QuestionCard } from '@/components/forms/QuestionCard'
import { FieldError } from '@/components/ui/field'
import { Skeleton } from '@/components/ui/skeleton'
import { api, ApiError } from '@/lib/api'
import type { Question, QuestionType } from '@/panel/form'

type QuestionListProps = {
  editionId: number
  canEdit: boolean
}

function QuestionList({ editionId, canEdit }: QuestionListProps) {
  const [questions, setQuestions] = useState<Question[] | null>(null)
  const [types, setTypes] = useState<QuestionType[]>([])
  const [newQuestionId, setNewQuestionId] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    Promise.all([
      api<Question[]>(`editions/${editionId}/form/questions/`),
      api<QuestionType[]>('question-types/'),
    ])
      .then(([questionsData, typesData]) => {
        setQuestions(questionsData)
        setTypes(typesData)
      })
      .catch(() => setError('Nie udało się wczytać pytań.'))
  }, [editionId])

  async function addQuestion() {
    setError('')
    setIsAdding(true)
    try {
      const question = await api<Question>(
        `editions/${editionId}/form/questions/`,
        {
          method: 'POST',
          body: { type: 'short_text', text: 'Nowe pytanie' },
        },
      )
      setQuestions((current) => current && [...current, question])
      setNewQuestionId(question.id)
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : 'Brak połączenia z serwerem. Spróbuj ponownie.',
      )
    }
    setIsAdding(false)
  }

  function replaceQuestion(question: Question) {
    setQuestions(
      (current) =>
        current &&
        current.map((item) => (item.id === question.id ? question : item)),
    )
  }

  function removeQuestion(questionId: number) {
    setQuestions(
      (current) => current && current.filter((item) => item.id !== questionId),
    )
  }

  if (!questions) {
    return error ? (
      <FieldError className="mt-5">{error}</FieldError>
    ) : (
      <Skeleton className="mt-5 h-32 w-full" />
    )
  }

  return (
    <div className="mt-5 flex flex-col gap-5">
      {questions.length > 0 && (
        <ul className="flex flex-col gap-5">
          {questions.map((question) => (
            <QuestionCard
              key={question.id}
              editionId={editionId}
              question={question}
              types={types}
              canEdit={canEdit}
              isNew={question.id === newQuestionId}
              onChange={replaceQuestion}
              onDelete={() => removeQuestion(question.id)}
            />
          ))}
        </ul>
      )}
      {questions.length === 0 && !canEdit && (
        <p className="text-sm text-muted-foreground">
          Formularz nie ma jeszcze własnych pytań.
        </p>
      )}
      {error && <FieldError>{error}</FieldError>}
      {canEdit && (
        <button
          type="button"
          disabled={isAdding}
          onClick={addQuestion}
          className="flex h-14 items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed border-sand text-[15px] font-semibold text-ochre-dark transition-colors hover:bg-sand/15 disabled:opacity-50"
        >
          <Plus className="size-4" />
          Dodaj pytanie
        </button>
      )}
    </div>
  )
}

export { QuestionList }

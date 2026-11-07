import { CollapsibleCard } from '@/components/applications/CollapsibleCard'
import type { ApplicationAnswer } from '@/panel/applications'

type AnswerListProps = {
  answers: ApplicationAnswer[]
}

function formatAnswer(answer: ApplicationAnswer) {
  return answer.choices.length > 0 ? answer.choices.join(', ') : answer.text
}

function AnswerList({ answers }: AnswerListProps) {
  return (
    <CollapsibleCard title="Odpowiedzi z formularza zgłoszeniowego">
      {answers.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          Kandydat nie odpowiedział na żadne pytanie.
        </p>
      ) : (
        <dl className="mt-4 divide-y divide-border border-y border-border">
          {answers.map((answer) => (
            <div
              key={answer.question}
              className="grid gap-1 py-3 text-sm md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-6 md:px-2"
            >
              <dt className="text-muted-foreground">{answer.question_text}</dt>
              <dd className="whitespace-pre-line text-foreground">
                {formatAnswer(answer)}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </CollapsibleCard>
  )
}

export { AnswerList }

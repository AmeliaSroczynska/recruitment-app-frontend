import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import type { ApplicationAnswer } from '@/panel/applications'

type AnswerListProps = {
  answers: ApplicationAnswer[]
}

function formatAnswer(answer: ApplicationAnswer) {
  return answer.choices.length > 0 ? answer.choices.join(', ') : answer.text
}

function AnswerList({ answers }: AnswerListProps) {
  return (
    <Card className="gap-0 rounded-2xl bg-card py-5 shadow-[0_1px_2px_rgba(34,32,27,0.05)] ring-border md:py-6">
      <CardContent className="px-5 md:px-6">
        <Collapsible defaultOpen>
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-heading text-base font-semibold text-foreground">
              Odpowiedzi z formularza zgłoszeniowego
            </h2>
            <CollapsibleTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Zwiń lub rozwiń odpowiedzi"
                  className="group text-muted-foreground aria-expanded:bg-transparent hover:bg-muted"
                />
              }
            >
              <ChevronDown className="transition-transform group-data-panel-open:rotate-180" />
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
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
                    <dt className="text-muted-foreground">
                      {answer.question_text}
                    </dt>
                    <dd className="whitespace-pre-line text-foreground">
                      {formatAnswer(answer)}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}

export { AnswerList }

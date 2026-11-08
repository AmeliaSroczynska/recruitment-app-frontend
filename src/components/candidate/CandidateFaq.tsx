import { Info } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ErrorAlert } from '@/components/panel/ErrorAlert'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api'
import type { FaqQuestion } from '@/panel/onboarding'

type CandidateFaqProps = {
  applicationId: number
}

function CandidateFaq({ applicationId }: CandidateFaqProps) {
  const [questions, setQuestions] = useState<FaqQuestion[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api<FaqQuestion[]>(`me/applications/${applicationId}/faq/`)
      .then(setQuestions)
      .catch(() => setError('Nie udało się wczytać pytań.'))
  }, [applicationId])

  if (error) {
    return <ErrorAlert>{error}</ErrorAlert>
  }

  if (!questions) {
    return <Skeleton className="h-48 w-full rounded-2xl" />
  }

  if (questions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Zespół nie dodał jeszcze żadnych pytań.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Info className="size-4 shrink-0" />
        Tutaj znajdziesz pytania, które często zadają nowi członkowie razem z
        odpowiedziami.
      </p>
      <Card className="gap-0 rounded-2xl bg-card px-5 py-1 shadow-card ring-border">
        <Accordion defaultValue={[questions[0].id]}>
          {questions.map((question) => (
            <AccordionItem key={question.id} value={question.id}>
              <AccordionTrigger className="py-4 text-sm font-medium">
                {question.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm whitespace-pre-line text-muted-foreground">
                {question.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>
    </div>
  )
}

export { CandidateFaq }

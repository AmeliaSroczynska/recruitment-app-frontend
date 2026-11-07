import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  ApplicationFormHeader,
  ApplicationFormView,
} from '@/components/forms/ApplicationFormView'
import { Skeleton } from '@/components/ui/skeleton'
import { api, ApiError } from '@/lib/api'
import type { PublicForm } from '@/panel/form'

function PublicFormPage() {
  const { slug } = useParams()
  const [form, setForm] = useState<PublicForm | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api<PublicForm>(`forms/${slug}/`)
      .then(setForm)
      .catch((caught) =>
        setError(
          caught instanceof ApiError && caught.status === 404
            ? 'Nie znaleźliśmy takiego formularza. Sprawdź, czy link jest poprawny.'
            : 'Nie udało się wczytać formularza. Spróbuj ponownie.',
        ),
      )
  }, [slug])

  return (
    <main className="min-h-svh bg-paper md:px-[50px] md:py-6">
      <div className="mx-auto max-w-[1340px] border-border bg-surface px-5 py-8 md:rounded-2xl md:border md:px-[50px] md:py-14">
        {error && <p className="text-[15px] text-destructive">{error}</p>}
        {!error && !form && <Skeleton className="h-64 w-full" />}
        {form && !form.is_accepting_responses && (
          <>
            <ApplicationFormHeader
              title={form.title}
              description={null}
              organizationName={form.organization_name}
            />
            <p className="mt-6 text-[15px] text-muted-foreground">
              Ten formularz nie przyjmuje już zgłoszeń.
            </p>
          </>
        )}
        {form?.is_accepting_responses && (
          <ApplicationFormView
            title={form.title}
            description={form.description}
            organizationName={form.organization_name}
            questions={form.questions}
          />
        )}
      </div>
    </main>
  )
}

export default PublicFormPage

import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ApplicationFormHeader,
  ApplicationFormView,
  type Answers,
  type FieldErrors,
} from '@/components/forms/ApplicationFormView'
import { ErrorAlert } from '@/components/panel/ErrorAlert'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { api, ApiError } from '@/lib/api'
import type { ApplicationInput, PublicForm } from '@/panel/form'

const CHOICE_TYPES = ['single_choice', 'multiple_choice']

function firstMessage(value: unknown) {
  if (typeof value === 'string') {
    return value
  }
  if (Array.isArray(value) && typeof value[0] === 'string') {
    return value[0]
  }
  return ''
}

function getFieldErrors(data: unknown) {
  const errors: FieldErrors = {}
  if (!data || typeof data !== 'object') {
    return errors
  }
  for (const [name, value] of Object.entries(data)) {
    if (name === 'answers' && value && typeof value === 'object') {
      for (const [questionId, message] of Object.entries(value)) {
        errors[questionId] = firstMessage(message)
      }
    } else if (name !== 'detail') {
      errors[name] = firstMessage(value)
    }
  }
  return errors
}

function buildApplication(form: PublicForm, answers: Answers) {
  const text = (key: string) => {
    const value = answers[key]
    return typeof value === 'string' ? value : ''
  }
  const application: ApplicationInput = {
    first_name: text('first_name'),
    last_name: text('last_name'),
    email: text('email'),
    answers: form.questions.map((question) => {
      const value = answers[String(question.id)]
      if (CHOICE_TYPES.includes(question.type)) {
        return {
          question: question.id,
          choices: Array.isArray(value) ? value.map(Number) : [],
        }
      }
      return { question: question.id, text: text(String(question.id)) }
    }),
  }
  return application
}

function PublicFormPage() {
  const { slug } = useParams()
  const [form, setForm] = useState<PublicForm | null>(null)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sentTo, setSentTo] = useState('')

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

  async function handleSubmit(answers: Answers) {
    if (!form) {
      return
    }
    const application = buildApplication(form, answers)
    setSubmitting(true)
    setFormError('')
    try {
      await api(`forms/${slug}/applications/`, {
        method: 'POST',
        body: application,
      })
      setSentTo(application.email)
      window.scrollTo({ top: 0 })
    } catch (caught) {
      const errors =
        caught instanceof ApiError ? getFieldErrors(caught.data) : {}
      setFieldErrors(errors)
      if (Object.keys(errors).length === 0) {
        setFormError(
          caught instanceof ApiError
            ? caught.message
            : 'Nie udało się wysłać zgłoszenia. Spróbuj ponownie.',
        )
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-svh bg-paper md:px-[50px] md:py-6">
      <Card className="mx-auto max-w-[1340px] gap-0 overflow-visible rounded-none px-5 py-8 text-base shadow-none ring-0 md:rounded-2xl md:px-[50px] md:py-14 md:ring-1 md:ring-border">
        {error && <ErrorAlert>{error}</ErrorAlert>}
        {!error && !form && <Skeleton className="h-64 w-full" />}
        {form && sentTo && (
          <>
            <ApplicationFormHeader
              title="Dziękujemy za zgłoszenie!"
              description={null}
              organizationName={form.organization_name}
            />
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
              Wysłaliśmy potwierdzenie na adres{' '}
              <span className="font-medium text-foreground">{sentTo}</span>.
              Status zgłoszenia sprawdzisz w panelu kandydata. Zaloguj się tym
              samym adresem e-mail.
            </p>
            <Button
              nativeButton={false}
              render={<Link to="/login/candidate" />}
              variant="accent"
              className="mt-7 h-11 px-5 text-[15px]"
            >
              Przejdź do logowania
            </Button>
          </>
        )}
        {form && !sentTo && !form.is_accepting_responses && (
          <>
            <ApplicationFormHeader
              title={form.title}
              description={null}
              organizationName={form.organization_name}
              headerImageUrl={form.header_image_url}
            />
            <p className="mt-6 text-[15px] text-muted-foreground">
              Ten formularz nie przyjmuje już zgłoszeń.
            </p>
          </>
        )}
        {form && !sentTo && form.is_accepting_responses && (
          <ApplicationFormView
            title={form.title}
            description={form.description}
            organizationName={form.organization_name}
            headerImageUrl={form.header_image_url}
            questions={form.questions}
            onSubmit={handleSubmit}
            errors={fieldErrors}
            formError={formError}
            submitting={submitting}
          />
        )}
      </Card>
    </main>
  )
}

export default PublicFormPage

import { useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import type { Question } from '@/panel/form'

const FIXED_FIELDS = [
  { name: 'first_name', label: 'Imię', type: 'text' },
  { name: 'last_name', label: 'Nazwisko', type: 'text' },
  { name: 'email', label: 'Adres e-mail', type: 'email' },
]

const inputClassName =
  'h-12 rounded-[10px] border-border bg-surface px-4 text-[15px] shadow-none'

type Answers = Record<string, string | string[]>

type FormHeaderProps = {
  title: string
  description: string | null
  organizationName: string
}

function ApplicationFormHeader({
  title,
  description,
  organizationName,
}: FormHeaderProps) {
  return (
    <header>
      <p className="flex items-center gap-3.5 text-[13px] font-semibold tracking-wide text-ochre-dark">
        <span className="h-0.5 w-8 bg-ochre" />
        {organizationName}
      </p>
      <h1 className="mt-3 font-heading text-[26px] leading-tight font-extrabold text-foreground md:text-[32px]">
        {title}
      </h1>
      {description && (
        <p className="mt-3 text-[15px] leading-relaxed whitespace-pre-line text-muted-foreground">
          {description}
        </p>
      )}
    </header>
  )
}

function QuestionLabel({
  htmlFor,
  required,
  children,
}: {
  htmlFor?: string
  required: boolean
  children: ReactNode
}) {
  return (
    <FieldLabel htmlFor={htmlFor} className="text-[15px] font-medium">
      {children}
      {required && ' *'}
    </FieldLabel>
  )
}

type ApplicationFormViewProps = FormHeaderProps & {
  questions: Question[]
  onSubmit?: (answers: Answers) => void
}

function ApplicationFormView({
  title,
  description,
  organizationName,
  questions,
  onSubmit,
}: ApplicationFormViewProps) {
  const [answers, setAnswers] = useState<Answers>({})

  function setAnswer(key: string, value: string | string[]) {
    setAnswers((current) => ({ ...current, [key]: value }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit?.(answers)
  }

  const fields = (
    <>
      {FIXED_FIELDS.map((field) => (
        <Field key={field.name} className="gap-3">
          <QuestionLabel htmlFor={`answer-${field.name}`} required>
            {field.label}
          </QuestionLabel>
          <Input
            id={`answer-${field.name}`}
            type={field.type}
            required={Boolean(onSubmit)}
            value={(answers[field.name] as string) ?? ''}
            onChange={(event) => setAnswer(field.name, event.target.value)}
            className={inputClassName}
          />
        </Field>
      ))}
      {questions.map((question) => {
        const key = String(question.id)
        const id = `answer-${key}`
        if (
          question.type === 'single_choice' ||
          question.type === 'multiple_choice'
        ) {
          const multiple = question.type === 'multiple_choice'
          const value = answers[key]
          return (
            <Field key={key} className="gap-3">
              <QuestionLabel required={question.is_required}>
                {question.text}
              </QuestionLabel>
              <ToggleGroup
                aria-label={question.text}
                multiple={multiple}
                value={Array.isArray(value) ? value : []}
                onValueChange={(selected) => setAnswer(key, selected)}
                className="flex w-full flex-wrap gap-2"
              >
                {question.choices.map((choice) => (
                  <ToggleGroupItem
                    key={choice.id}
                    value={String(choice.id)}
                    className="h-auto min-h-10 rounded-[10px] border border-border bg-surface px-4 py-2 text-left text-[15px] font-normal whitespace-normal hover:bg-paper data-pressed:border-ochre data-pressed:bg-sand/30 data-pressed:text-ochre-dark"
                  >
                    {choice.text}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </Field>
          )
        }
        return (
          <Field key={key} className="gap-3">
            <QuestionLabel htmlFor={id} required={question.is_required}>
              {question.text}
            </QuestionLabel>
            {question.type === 'long_text' ? (
              <Textarea
                id={id}
                required={Boolean(onSubmit) && question.is_required}
                value={(answers[key] as string) ?? ''}
                onChange={(event) => setAnswer(key, event.target.value)}
                className="min-h-32 rounded-[10px] border-border bg-surface px-4 py-3 text-[15px] shadow-none"
              />
            ) : (
              <Input
                id={id}
                required={Boolean(onSubmit) && question.is_required}
                value={(answers[key] as string) ?? ''}
                onChange={(event) => setAnswer(key, event.target.value)}
                className={inputClassName}
              />
            )}
          </Field>
        )
      })}
      <div className="flex flex-col items-start gap-4">
        <Button
          type={onSubmit ? 'submit' : 'button'}
          className="h-11 rounded-[10px] bg-ochre px-5 text-[15px] font-semibold text-surface hover:bg-ochre-dark"
        >
          Wyślij zgłoszenie
        </Button>
        <p className="text-[13px] text-muted-foreground">
          Uzupełniałeś/aś już ten formularz?{' '}
          <Link
            to="/login/candidate"
            className="font-medium text-ochre-dark hover:underline"
          >
            Zaloguj się
          </Link>
        </p>
      </div>
    </>
  )

  return (
    <div>
      <ApplicationFormHeader
        title={title}
        description={description}
        organizationName={organizationName}
      />
      <Separator className="my-7" />
      {onSubmit ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-7">
          {fields}
        </form>
      ) : (
        <div className="flex flex-col gap-7">{fields}</div>
      )}
    </div>
  )
}

export { ApplicationFormHeader, ApplicationFormView }
export type { Answers }

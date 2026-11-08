import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import type { Question } from '@/panel/form'

const FIXED_FIELDS = [
  { name: 'first_name', label: 'Imię', type: 'text' },
  { name: 'last_name', label: 'Nazwisko', type: 'text' },
  { name: 'email', label: 'Adres e-mail', type: 'email' },
]

const inputClassName =
  'h-12 rounded-[10px] border-border bg-card px-4 text-[15px] shadow-none'

const choiceClassName =
  'rounded-[10px] border-border bg-card text-[15px] font-normal has-data-checked:border-ochre has-data-checked:bg-sand/30 *:data-[slot=field]:px-4 *:data-[slot=field]:py-2.5'

const choiceControlClassName =
  'data-checked:border-ochre data-checked:bg-ochre data-checked:text-surface'

type Answers = Record<string, string | string[]>

type FieldErrors = Record<string, string>

const NO_ERRORS: FieldErrors = {}

type FormHeaderProps = {
  title: string
  description: string | null
  organizationName: string
  headerImageUrl?: string | null
}

function ApplicationFormHeader({
  title,
  description,
  organizationName,
  headerImageUrl,
}: FormHeaderProps) {
  return (
    <header>
      {headerImageUrl && (
        <img
          src={headerImageUrl}
          alt=""
          className="mb-8 aspect-[3/1] w-full rounded-xl object-cover md:mb-10"
        />
      )}
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
  errors?: FieldErrors
  formError?: string
  submitting?: boolean
}

function ApplicationFormView({
  title,
  description,
  organizationName,
  headerImageUrl,
  questions,
  onSubmit,
  errors = NO_ERRORS,
  formError = '',
  submitting = false,
}: ApplicationFormViewProps) {
  const [answers, setAnswers] = useState<Answers>({})
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    formRef.current
      ?.querySelector('[data-invalid="true"]')
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [errors])

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
        <Field
          key={field.name}
          data-invalid={Boolean(errors[field.name])}
          className="gap-3"
        >
          <QuestionLabel htmlFor={`answer-${field.name}`} required>
            {field.label}
          </QuestionLabel>
          <Input
            id={`answer-${field.name}`}
            type={field.type}
            aria-invalid={Boolean(errors[field.name])}
            value={(answers[field.name] as string) ?? ''}
            onChange={(event) => setAnswer(field.name, event.target.value)}
            className={inputClassName}
          />
          <FieldError>{errors[field.name]}</FieldError>
        </Field>
      ))}
      {questions.map((question) => {
        const key = String(question.id)
        const id = `answer-${key}`
        if (
          question.type === 'single_choice' ||
          question.type === 'multiple_choice'
        ) {
          const value = answers[key]
          const selected = Array.isArray(value) ? value : []
          const options = question.choices.map((choice) => {
            const optionValue = String(choice.id)
            const optionId = `${id}-${choice.id}`
            return (
              <FieldLabel
                key={choice.id}
                htmlFor={optionId}
                className={choiceClassName}
              >
                <Field orientation="horizontal" className="gap-3">
                  {question.type === 'multiple_choice' ? (
                    <Checkbox
                      id={optionId}
                      checked={selected.includes(optionValue)}
                      onCheckedChange={(checked) =>
                        setAnswer(
                          key,
                          checked
                            ? [...selected, optionValue]
                            : selected.filter((item) => item !== optionValue),
                        )
                      }
                      className={choiceControlClassName}
                    />
                  ) : (
                    <RadioGroupItem
                      id={optionId}
                      value={optionValue}
                      className={choiceControlClassName}
                    />
                  )}
                  <span>{choice.text}</span>
                </Field>
              </FieldLabel>
            )
          })
          return (
            <Field
              key={key}
              data-invalid={Boolean(errors[key])}
              className="gap-3"
            >
              <QuestionLabel required={question.is_required}>
                {question.text}
              </QuestionLabel>
              {question.type === 'multiple_choice' ? (
                <div
                  role="group"
                  aria-label={question.text}
                  className="flex flex-col gap-2"
                >
                  {options}
                </div>
              ) : (
                <RadioGroup
                  aria-label={question.text}
                  value={selected[0] ?? ''}
                  onValueChange={(choice) => setAnswer(key, [String(choice)])}
                  className="gap-2"
                >
                  {options}
                </RadioGroup>
              )}
              <FieldError>{errors[key]}</FieldError>
            </Field>
          )
        }
        return (
          <Field
            key={key}
            data-invalid={Boolean(errors[key])}
            className="gap-3"
          >
            <QuestionLabel htmlFor={id} required={question.is_required}>
              {question.text}
            </QuestionLabel>
            {question.type === 'long_text' ? (
              <Textarea
                id={id}
                aria-invalid={Boolean(errors[key])}
                value={(answers[key] as string) ?? ''}
                onChange={(event) => setAnswer(key, event.target.value)}
                className="min-h-32 rounded-[10px] border-border bg-card px-4 py-3 text-[15px] shadow-none"
              />
            ) : (
              <Input
                id={id}
                aria-invalid={Boolean(errors[key])}
                value={(answers[key] as string) ?? ''}
                onChange={(event) => setAnswer(key, event.target.value)}
                className={inputClassName}
              />
            )}
            <FieldError>{errors[key]}</FieldError>
          </Field>
        )
      })}
      <div className="flex flex-col items-start gap-4">
        {formError && <FieldError>{formError}</FieldError>}
        <Button
          type={onSubmit ? 'submit' : 'button'}
          disabled={submitting}
          variant="accent"
          className="h-11 px-5 text-[15px]"
        >
          {submitting ? 'Wysyłanie...' : 'Wyślij zgłoszenie'}
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
        headerImageUrl={headerImageUrl}
      />
      <Separator className="my-7" />
      {onSubmit ? (
        <form
          ref={formRef}
          noValidate
          onSubmit={handleSubmit}
          className="flex flex-col gap-7"
        >
          {fields}
        </form>
      ) : (
        <div className="flex flex-col gap-7">{fields}</div>
      )}
    </div>
  )
}

export { ApplicationFormHeader, ApplicationFormView }
export type { Answers, FieldErrors }

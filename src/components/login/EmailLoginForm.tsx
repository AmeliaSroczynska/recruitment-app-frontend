import { useState, type FormEvent } from 'react'
import { Mail } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { LoginFormHeader } from '@/components/login/LoginFormHeader'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { api, ApiError } from '@/lib/api'

type EmailLoginFormProps = {
  description: string
  emailPlaceholder: string
  nextPath: string
}

function EmailLoginForm({
  description,
  emailPlaceholder,
  nextPath,
}: EmailLoginFormProps) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      await api('auth/code/', { method: 'POST', body: { email } })
      navigate(nextPath, { state: { email } })
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : 'Brak połączenia z serwerem. Spróbuj ponownie.',
      )
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <LoginFormHeader
        backTo="/login"
        backLabel="Zmień panel"
        title="Zaloguj się"
        description={description}
      />
      <form onSubmit={handleSubmit} className="mt-3.5 lg:mt-5">
        <Field className="gap-[7px]" data-invalid={Boolean(error)}>
          <FieldLabel
            htmlFor="email"
            className="text-[13px] leading-[18.9px] font-medium"
          >
            E-mail
          </FieldLabel>
          <InputGroup className="h-11 rounded-[10px] border-border bg-card shadow-none">
            <InputGroupAddon className="pr-1.5 pl-3">
              <Mail />
            </InputGroupAddon>
            <InputGroupInput
              id="email"
              type="email"
              autoComplete="email"
              placeholder={emailPlaceholder}
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={Boolean(error)}
              className="text-sm"
            />
          </InputGroup>
          {error && <FieldError>{error}</FieldError>}
        </Field>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-3.5 h-11 w-full rounded-[10px] text-sm font-semibold lg:mt-4"
        >
          {isSubmitting ? 'Wysyłanie...' : 'Wyślij kod'}
        </Button>
      </form>
    </>
  )
}

export { EmailLoginForm }

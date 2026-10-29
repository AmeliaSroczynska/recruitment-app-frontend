import { useState, type FormEvent } from 'react'
import { Mail } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { LoginFormHeader } from '@/components/login/LoginFormHeader'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel } from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'

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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    navigate(nextPath, { state: { email } })
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
        <Field className="gap-[7px]">
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
              className="text-sm"
            />
          </InputGroup>
        </Field>
        <Button
          type="submit"
          className="mt-3.5 h-11 w-full rounded-[10px] text-sm font-semibold lg:mt-4"
        >
          Wyślij kod
        </Button>
      </form>
    </>
  )
}

export { EmailLoginForm }

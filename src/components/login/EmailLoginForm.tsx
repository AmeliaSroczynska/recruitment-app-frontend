import type { FormEvent } from 'react'
import { ArrowLeft, Mail } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    navigate(nextPath)
  }

  return (
    <>
      <Button
        variant="link"
        nativeButton={false}
        render={<Link to="/login" />}
        className="h-auto gap-[5px] p-0 text-[13px] leading-[18.9px] font-semibold text-ochre-dark"
      >
        <ArrowLeft className="size-3.5" />
        Zmień panel
      </Button>
      <h2 className="mt-3.5 font-heading text-2xl leading-[34.8px] font-extrabold text-foreground lg:mt-4 lg:text-[28px] lg:leading-[40.6px] lg:tracking-[-0.3px]">
        Zaloguj się
      </h2>
      <p className="mt-[7px] text-sm leading-[20.3px] text-muted-foreground">
        {description}
      </p>
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

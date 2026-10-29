import { useState, type FormEvent } from 'react'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { LoginFormHeader } from '@/components/login/LoginFormHeader'
import { Button } from '@/components/ui/button'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { cn } from '@/lib/utils'

const CODE_LENGTH = 6

type CodeLoginFormProps = {
  emailPath: string
  nextPath: string
}

function CodeLoginForm({ emailPath, nextPath }: CodeLoginFormProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const email: string | undefined = location.state?.email
  const [code, setCode] = useState('')

  if (!email) {
    return <Navigate to={emailPath} replace />
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    navigate(nextPath)
  }

  return (
    <>
      <LoginFormHeader
        backTo={emailPath}
        backLabel="Zmień e-mail"
        title="Wpisz kod"
        description={
          <>
            Kod wysłaliśmy na{' '}
            <span className="font-semibold text-foreground">{email}</span>.
          </>
        }
      />
      <form onSubmit={handleSubmit} className="mt-3.5 lg:mt-5">
        <InputOTP
          maxLength={CODE_LENGTH}
          pattern={REGEXP_ONLY_DIGITS}
          autoComplete="one-time-code"
          value={code}
          onChange={setCode}
          aria-label="Kod jednorazowy"
          autoFocus
        >
          <InputOTPGroup className="w-full gap-2">
            {Array.from({ length: CODE_LENGTH }, (_, index) => (
              <InputOTPSlot
                key={index}
                index={index}
                className={cn(
                  'h-14 flex-1 rounded-[12px] border border-border bg-card font-heading text-2xl font-bold shadow-none first:rounded-[12px] last:rounded-[12px] lg:h-[58px]',
                  code[index] && 'border-ochre',
                )}
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
        <Button
          type="submit"
          disabled={code.length < CODE_LENGTH}
          className="mt-3.5 h-11 w-full rounded-[10px] text-sm font-semibold lg:mt-4"
        >
          Potwierdź kod
        </Button>
      </form>
    </>
  )
}

export { CodeLoginForm }

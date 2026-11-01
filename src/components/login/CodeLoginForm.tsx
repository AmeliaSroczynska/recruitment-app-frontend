import { useState, type FormEvent } from 'react'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth, type User } from '@/auth/AuthContext'
import { LoginFormHeader } from '@/components/login/LoginFormHeader'
import { Button } from '@/components/ui/button'
import { FieldError } from '@/components/ui/field'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { api, ApiError } from '@/lib/api'
import { cn } from '@/lib/utils'

const CODE_LENGTH = 6

type CodeLoginFormProps = {
  emailPath: string
  nextPath: string
}

function getErrorMessage(caught: unknown) {
  return caught instanceof ApiError
    ? caught.message
    : 'Brak połączenia z serwerem. Spróbuj ponownie.'
}

function CodeLoginForm({ emailPath, nextPath }: CodeLoginFormProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { setUser } = useAuth()
  const email: string | undefined = location.state?.email
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResending, setIsResending] = useState(false)

  if (!email) {
    return <Navigate to={emailPath} replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setInfo('')
    setIsSubmitting(true)
    try {
      const user = await api<User>('auth/login/', {
        method: 'POST',
        body: { email, code },
      })
      setUser(user)
      navigate(nextPath, { replace: true })
    } catch (caught) {
      setError(getErrorMessage(caught))
      setCode('')
      setIsSubmitting(false)
    }
  }

  async function handleResend() {
    setError('')
    setInfo('')
    setIsResending(true)
    try {
      await api('auth/code/', { method: 'POST', body: { email } })
      setCode('')
      setInfo('Wysłaliśmy nowy kod.')
    } catch (caught) {
      setError(getErrorMessage(caught))
    } finally {
      setIsResending(false)
    }
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
          aria-invalid={Boolean(error)}
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
        {error && <FieldError className="mt-2">{error}</FieldError>}
        {info && (
          <p role="status" className="mt-2 text-sm text-muted-foreground">
            {info}
          </p>
        )}
        <Button
          type="submit"
          disabled={code.length < CODE_LENGTH || isSubmitting}
          className="mt-3.5 h-11 w-full rounded-[10px] text-sm font-semibold lg:mt-4"
        >
          {isSubmitting ? 'Sprawdzanie...' : 'Potwierdź kod'}
        </Button>
      </form>
      <p className="mt-4 text-center text-[13px] leading-[18.9px] text-muted-foreground">
        Kod nie dotarł?{' '}
        <Button
          type="button"
          variant="link"
          disabled={isResending}
          onClick={handleResend}
          className="h-auto p-0 text-[13px] leading-[18.9px] font-semibold text-ochre-dark"
        >
          Wyślij ponownie
        </Button>
      </p>
    </>
  )
}

export { CodeLoginForm }

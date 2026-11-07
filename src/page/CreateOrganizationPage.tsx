import { useState, type FormEvent } from 'react'
import { ArrowLeft, Mail } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth, type User } from '@/auth/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { api, ApiError } from '@/lib/api'

type CreatedOrganization = {
  id: number
  name: string
  slug: string
  contact_email: string
  edition_id: number
}

function CreateOrganizationPage() {
  const navigate = useNavigate()
  const { user, setUser } = useAuth()
  const [name, setName] = useState('')
  const [contactEmail, setContactEmail] = useState(user?.email ?? '')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      const organization = await api<CreatedOrganization>('organizations/', {
        method: 'POST',
        body: { name, contact_email: contactEmail },
      })
      setUser(await api<User>('auth/me/'))
      navigate(`/organization/${organization.edition_id}`, { replace: true })
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
    <main className="min-h-svh bg-background px-[18px] pt-5 pb-10 lg:px-10 lg:pt-[123px]">
      <div className="mx-auto w-full lg:max-w-[456px]">
        <Button
          variant="link"
          nativeButton={false}
          render={<Link to="/login/organization/organization" />}
          className="h-auto gap-1.5 p-0 text-sm font-medium text-muted-foreground"
        >
          <ArrowLeft className="size-4" />
          Wróć
        </Button>
        <h1 className="mt-4 font-heading text-[26px] leading-[37.7px] font-extrabold tracking-[-0.3px] text-foreground lg:mt-5 lg:text-[34px] lg:leading-[49.3px]">
          Utwórz organizację
        </h1>
        <Card className="mt-5 gap-0 rounded-2xl bg-card py-6 shadow-card ring-border lg:mt-6 lg:py-7">
          <CardContent className="px-5 lg:px-7">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <Field className="gap-[7px]">
                <FieldLabel
                  htmlFor="organization-name"
                  className="text-[13px] leading-[18.9px] font-medium"
                >
                  Nazwa organizacji
                  <span className="text-ochre-dark">*</span>
                </FieldLabel>
                <Input
                  id="organization-name"
                  autoFocus
                  required
                  maxLength={200}
                  placeholder="np. Koło naukowe Synapsa"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="h-11 rounded-[10px] border-border bg-card px-3 text-sm shadow-none"
                />
              </Field>
              <Field className="gap-[7px]" data-invalid={Boolean(error)}>
                <FieldLabel
                  htmlFor="contact-email"
                  className="text-[13px] leading-[18.9px] font-medium"
                >
                  Mail kontaktowy
                </FieldLabel>
                <InputGroup className="h-11 rounded-[10px] border-border bg-card shadow-none">
                  <InputGroupAddon className="pr-1.5 pl-3">
                    <Mail />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="contact-email"
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(event) => setContactEmail(event.target.value)}
                    aria-invalid={Boolean(error)}
                    className="text-sm"
                  />
                </InputGroup>
                {error && <FieldError>{error}</FieldError>}
              </Field>
              <Button
                type="submit"
                disabled={!name.trim() || isSubmitting}
                className="h-11 w-full rounded-[10px] text-sm font-semibold"
              >
                {isSubmitting ? 'Tworzenie...' : 'Utwórz organizację'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

export default CreateOrganizationPage

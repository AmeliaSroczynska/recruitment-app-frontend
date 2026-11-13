import { useEffect, useState, type FormEvent } from 'react'
import { useAuth, type User } from '@/auth/AuthContext'
import { OrganizationLogoField } from '@/components/settings/OrganizationLogoField'
import { SettingsCard } from '@/components/settings/SettingsCard'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { api, ApiError } from '@/lib/api'
import type { Organization } from '@/panel/settings'

const FORM_ID = 'organization-form'

const inputClassName =
  'h-10 rounded-[10px] border-border bg-card px-3 text-sm shadow-none'

type OrganizationFormProps = {
  editionId: number
  canEdit: boolean
  onSavingChange: (isSaving: boolean) => void
}

function OrganizationForm({
  editionId,
  canEdit,
  onSavingChange,
}: OrganizationFormProps) {
  const { setUser } = useAuth()
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    api<Organization>(`editions/${editionId}/organization/`)
      .then(setOrganization)
      .catch(() => setError('Nie udało się wczytać danych organizacji.'))
  }, [editionId])

  function update(field: keyof Organization, value: string) {
    setOrganization((current) => current && { ...current, [field]: value })
    setMessage('')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!organization) {
      return
    }
    setError('')
    setMessage('')
    onSavingChange(true)
    try {
      setOrganization(
        await api<Organization>(`editions/${editionId}/organization/`, {
          method: 'PATCH',
          body: {
            name: organization.name,
            contact_email: organization.contact_email,
          },
        }),
      )
      setUser(await api<User>('auth/me/'))
      setMessage('Zapisano zmiany.')
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : 'Brak połączenia z serwerem. Spróbuj ponownie.',
      )
    }
    onSavingChange(false)
  }

  if (!organization) {
    return (
      <SettingsCard>
        {error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : (
          <Skeleton className="h-40 w-full" />
        )}
      </SettingsCard>
    )
  }

  return (
    <SettingsCard>
      <form
        id={FORM_ID}
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        <OrganizationLogoField
          editionId={editionId}
          logoUrl={organization.logo_url}
          canEdit={canEdit}
          onChange={(logoUrl) =>
            setOrganization(
              (current) => current && { ...current, logo_url: logoUrl },
            )
          }
        />
        <fieldset
          disabled={!canEdit}
          className="grid gap-4 md:grid-cols-2 md:gap-x-3"
        >
          <Field className="gap-[7px]">
            <FieldLabel htmlFor="organization-name" className="font-medium">
              Nazwa organizacji
            </FieldLabel>
            <Input
              id="organization-name"
              required
              maxLength={200}
              value={organization.name}
              onChange={(event) => update('name', event.target.value)}
              className={inputClassName}
            />
          </Field>
          <Field className="gap-[7px]">
            <FieldLabel htmlFor="organization-email" className="font-medium">
              Mail kontaktowy
            </FieldLabel>
            <Input
              id="organization-email"
              type="email"
              value={organization.contact_email}
              onChange={(event) => update('contact_email', event.target.value)}
              className={inputClassName}
            />
          </Field>
        </fieldset>
        {error && <FieldError>{error}</FieldError>}
        {message && <p className="text-sm text-olive">{message}</p>}
      </form>
    </SettingsCard>
  )
}

export { FORM_ID, OrganizationForm }

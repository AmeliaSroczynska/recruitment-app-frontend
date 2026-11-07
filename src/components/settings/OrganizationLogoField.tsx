import { useState } from 'react'
import { useAuth, type User } from '@/auth/AuthContext'
import { ImagePicker } from '@/components/files/ImagePicker'
import { api, ApiError } from '@/lib/api'
import type { Organization } from '@/panel/settings'

type OrganizationLogoFieldProps = {
  editionId: number
  logoUrl: string | null
  canEdit: boolean
  onChange: (logoUrl: string | null) => void
}

function OrganizationLogoField({
  editionId,
  logoUrl,
  canEdit,
  onChange,
}: OrganizationLogoFieldProps) {
  const { setUser } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  async function save(body?: FormData) {
    setError('')
    setIsSaving(true)
    try {
      const organization = await api<Organization>(
        `editions/${editionId}/organization/logo/`,
        { method: body ? 'POST' : 'DELETE', body },
      )
      onChange(organization.logo_url)
      setUser(await api<User>('auth/me/'))
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : 'Brak połączenia z serwerem. Spróbuj ponownie.',
      )
    }
    setIsSaving(false)
  }

  function handleSelect(file: File) {
    const body = new FormData()
    body.append('logo', file)
    void save(body)
  }

  return (
    <ImagePicker
      label="Logo organizacji"
      placeholder="logo organizacji"
      url={logoUrl}
      disabled={!canEdit || isSaving}
      error={error}
      onSelect={handleSelect}
      onRemove={canEdit ? () => void save() : undefined}
    />
  )
}

export { OrganizationLogoField }

import { useAuth, type User } from '@/auth/AuthContext'
import { ImageUploadField } from '@/components/files/ImageUploadField'
import { api } from '@/lib/api'
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

  async function handleSaved(organization: Organization) {
    onChange(organization.logo_url)
    setUser(await api<User>('auth/me/'))
  }

  return (
    <ImageUploadField<Organization>
      path={`editions/${editionId}/organization/logo/`}
      fieldName="logo"
      label="Logo organizacji"
      placeholder="logo organizacji"
      url={logoUrl}
      canEdit={canEdit}
      onSaved={handleSaved}
    />
  )
}

export { OrganizationLogoField }

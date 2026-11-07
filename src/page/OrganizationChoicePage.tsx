import { useNavigate } from 'react-router-dom'
import { useAuth, type Application, type Membership } from '@/auth/AuthContext'
import { NewOrganizationTile } from '@/components/login/NewOrganizationTile'
import { OrganizationTile } from '@/components/login/OrganizationTile'
import { Button } from '@/components/ui/button'

type OrganizationChoicePageProps = {
  panel: 'candidate' | 'organization'
}

function describeCount(count: number) {
  return count === 1 ? '1 organizacji' : `${count} organizacjach`
}

function isBetterEdition(
  edition: Membership | Application,
  current: Membership | Application,
) {
  if (edition.edition_is_active !== current.edition_is_active) {
    return edition.edition_is_active
  }
  return edition.edition_id > current.edition_id
}

function pickOnePerOrganization<T extends Membership | Application>(
  editions: T[],
) {
  const chosen = new Map<string, T>()
  for (const edition of editions) {
    const current = chosen.get(edition.organization_slug)
    if (!current || isBetterEdition(edition, current)) {
      chosen.set(edition.organization_slug, edition)
    }
  }
  return [...chosen.values()]
}

function OrganizationChoicePage({ panel }: OrganizationChoicePageProps) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  if (!user) {
    return null
  }

  const editions = pickOnePerOrganization<Membership | Application>(
    panel === 'candidate' ? user.applications : user.memberships,
  )
  const email = (
    <span className="font-semibold text-foreground">{user.email}</span>
  )

  let description
  if (panel === 'candidate') {
    description =
      editions.length === 0 ? (
        <>Twoje konto {email} nie ma jeszcze żadnych zgłoszeń.</>
      ) : (
        <>
          Twoje konto {email} ma{' '}
          {editions.length === 1 ? 'zgłoszenie' : 'zgłoszenia'} w{' '}
          {describeCount(editions.length)}.
        </>
      )
  } else {
    description =
      editions.length === 0 ? (
        <>Konto {email} nie należy jeszcze do żadnej organizacji.</>
      ) : (
        <>
          Konto {email} ma dostęp do panelu rekrutera w{' '}
          {describeCount(editions.length)}.
        </>
      )
  }

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <main className="min-h-svh bg-background px-[18px] pt-5 pb-10 lg:px-10 lg:pt-[92px]">
      <div className="mx-auto w-full lg:max-w-[916px]">
        <h1 className="font-heading text-[26px] leading-[37.7px] font-extrabold tracking-[-0.3px] text-foreground lg:text-[34px] lg:leading-[49.3px]">
          Wybierz organizację
        </h1>
        <p className="mt-2 text-sm leading-[20.3px] text-muted-foreground lg:text-[15px] lg:leading-[21.8px]">
          {description}
        </p>
        {(editions.length > 0 || panel === 'organization') && (
          <div className="mt-5 grid gap-3 lg:mt-[31px] lg:grid-cols-3 lg:gap-4">
            {editions.map((edition, index) => (
              <OrganizationTile
                key={edition.id}
                to={`/${panel}/${edition.edition_id}`}
                name={edition.organization_name}
                logoUrl={edition.organization_logo_url}
                index={index}
              />
            ))}
            {panel === 'organization' && <NewOrganizationTile />}
          </div>
        )}
        <Button
          type="button"
          variant="link"
          onClick={handleLogout}
          className="mt-[29px] h-auto p-0 text-sm leading-[20.3px] font-normal text-muted-foreground"
        >
          Wyloguj się
        </Button>
      </div>
    </main>
  )
}

export default OrganizationChoicePage

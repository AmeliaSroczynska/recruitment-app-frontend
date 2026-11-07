import { ApplicationHistory } from '@/components/candidate/ApplicationHistory'
import { CandidatePage } from '@/components/candidate/CandidatePage'
import { ContactCard } from '@/components/candidate/ContactCard'
import { StatusHero } from '@/components/candidate/StatusHero'
import { STATUS_VIEWS, useCandidateApplication } from '@/panel/candidate'

function CandidateHomePage() {
  const application = useCandidateApplication()
  const title = application.first_name
    ? `Cześć, ${application.first_name}`
    : 'Cześć!'

  return (
    <CandidatePage title={title}>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_413px] lg:gap-[22px]">
        <StatusHero
          status={application.status}
          onboardingPath={`/candidate/${application.edition_id}/onboarding`}
        />
        <div className="flex flex-col gap-10 lg:pt-2">
          <ApplicationHistory
            items={STATUS_VIEWS[application.status].history}
          />
          <ContactCard
            name={application.organization_name}
            email={application.organization_email}
            logoUrl={application.organization_logo_url}
          />
        </div>
      </div>
    </CandidatePage>
  )
}

export default CandidateHomePage

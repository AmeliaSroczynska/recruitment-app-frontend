import { useEffect, useState } from 'react'
import { ApplicationHistory } from '@/components/candidate/ApplicationHistory'
import { AvailabilityCard } from '@/components/candidate/AvailabilityCard'
import { CandidatePage } from '@/components/candidate/CandidatePage'
import { ContactCard } from '@/components/candidate/ContactCard'
import { InterviewCard } from '@/components/candidate/InterviewCard'
import { StatusHero } from '@/components/candidate/StatusHero'
import { FieldError } from '@/components/ui/field'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api'
import type { CandidateAvailability } from '@/panel/calendar'
import { getStatusView, useCandidateApplication } from '@/panel/candidate'

type LoadedAvailability = {
  path: string
  data: CandidateAvailability | null
}

function CandidateHomePage() {
  const application = useCandidateApplication()
  const isInvited = application.status === 'interview'
  const path = `me/applications/${application.id}/`
  const availabilityPath = `${path}availability/`
  const [loaded, setLoaded] = useState<LoadedAvailability | null>(null)
  const title = application.first_name
    ? `Cześć, ${application.first_name}`
    : 'Cześć!'

  useEffect(() => {
    if (!isInvited) {
      return
    }
    api<CandidateAvailability>(availabilityPath)
      .then((data) => setLoaded({ path: availabilityPath, data }))
      .catch(() => setLoaded({ path: availabilityPath, data: null }))
  }, [isInvited, availabilityPath])

  const isLoaded = isInvited && loaded?.path === availabilityPath
  const availability = isLoaded ? loaded.data : null
  const interview = availability?.interview ?? null

  function update(data: CandidateAvailability) {
    setLoaded({ path: availabilityPath, data })
  }

  return (
    <CandidatePage title={title}>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_413px] lg:gap-[22px]">
        <div className="flex flex-col gap-5">
          <StatusHero
            status={application.status}
            isScheduled={Boolean(interview)}
            onboardingPath={`/candidate/${application.edition_id}/onboarding`}
          />
          {isInvited && !isLoaded && (
            <Skeleton className="h-64 w-full rounded-[18px]" />
          )}
          {isLoaded && !availability && (
            <FieldError>Nie udało się wczytać kalendarza rozmów.</FieldError>
          )}
          {availability && interview && (
            <InterviewCard
              path={`${path}interview/cancel/`}
              interview={interview}
              info={availability.info}
              onChange={update}
            />
          )}
          {availability && !interview && (
            <AvailabilityCard
              path={availabilityPath}
              availability={availability}
              onChange={update}
            />
          )}
        </div>
        <div className="flex flex-col gap-10 lg:pt-2">
          <ApplicationHistory
            items={
              getStatusView(application.status, Boolean(interview)).history
            }
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

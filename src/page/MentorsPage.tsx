import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AddMentorDialog } from '@/components/onboarding/AddMentorDialog'
import { MentorTile } from '@/components/onboarding/MentorTile'
import { OnboardingPage } from '@/components/onboarding/OnboardingPage'
import { ErrorAlert } from '@/components/panel/ErrorAlert'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api'
import { useEdition } from '@/panel/EditionContext'
import type { Mentor } from '@/panel/onboarding'
import { canEditOnboarding } from '@/panel/roles'

function MentorsPage() {
  const membership = useEdition()
  const navigate = useNavigate()
  const canEdit = canEditOnboarding(membership.role)
  const basePath = `/organization/${membership.edition_id}/mentors`
  const [mentors, setMentors] = useState<Mentor[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api<Mentor[]>(`editions/${membership.edition_id}/mentors/`)
      .then(setMentors)
      .catch(() => setError('Nie udało się wczytać mentorów.'))
  }, [membership.edition_id])

  return (
    <OnboardingPage title="Mentorzy">
      {error ? (
        <ErrorAlert>{error}</ErrorAlert>
      ) : !mentors ? (
        <Skeleton className="h-64 w-full rounded-2xl" />
      ) : (
        <div className="flex flex-col gap-4 md:gap-5">
          {mentors.length > 0 && (
            <ul className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
              {mentors.map((mentor) => (
                <li key={mentor.id}>
                  <MentorTile mentor={mentor} to={`${basePath}/${mentor.id}`} />
                </li>
              ))}
            </ul>
          )}
          {mentors.length === 0 && !canEdit && (
            <p className="text-sm text-muted-foreground">
              Nie ma jeszcze żadnych mentorów.
            </p>
          )}
          {canEdit && (
            <AddMentorDialog
              editionId={membership.edition_id}
              onAdded={(mentor) => navigate(`${basePath}/${mentor.id}`)}
            />
          )}
        </div>
      )}
    </OnboardingPage>
  )
}

export default MentorsPage

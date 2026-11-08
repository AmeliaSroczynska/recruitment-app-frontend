import { EntryList } from '@/components/onboarding/EntryList'
import { OnboardingPage } from '@/components/onboarding/OnboardingPage'
import { useEdition } from '@/panel/EditionContext'
import { DOCUMENT_ENTRY } from '@/panel/onboarding'
import { canEditOnboarding } from '@/panel/roles'

function KnowledgePage() {
  const membership = useEdition()

  return (
    <OnboardingPage title="Baza wiedzy">
      <EntryList
        editionId={membership.edition_id}
        kind={DOCUMENT_ENTRY}
        canEdit={canEditOnboarding(membership.role)}
      />
    </OnboardingPage>
  )
}

export default KnowledgePage

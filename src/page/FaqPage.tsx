import { EntryList } from '@/components/onboarding/EntryList'
import { OnboardingPage } from '@/components/onboarding/OnboardingPage'
import { useEdition } from '@/panel/EditionContext'
import { FAQ_ENTRY } from '@/panel/onboarding'
import { canEditOnboarding } from '@/panel/roles'

function FaqPage() {
  const membership = useEdition()

  return (
    <OnboardingPage title="FAQ">
      <EntryList
        editionId={membership.edition_id}
        kind={FAQ_ENTRY}
        canEdit={canEditOnboarding(membership.role)}
      />
    </OnboardingPage>
  )
}

export default FaqPage

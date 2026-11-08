import { EntryList } from '@/components/onboarding/EntryList'
import { OnboardingPage } from '@/components/onboarding/OnboardingPage'
import { useEdition } from '@/panel/EditionContext'
import { TASK_ENTRY } from '@/panel/onboarding'
import { canEditOnboarding } from '@/panel/roles'

function TasksPage() {
  const membership = useEdition()

  return (
    <OnboardingPage title="Zadania wdrażające">
      <EntryList
        editionId={membership.edition_id}
        kind={TASK_ENTRY}
        canEdit={canEditOnboarding(membership.role)}
      />
    </OnboardingPage>
  )
}

export default TasksPage

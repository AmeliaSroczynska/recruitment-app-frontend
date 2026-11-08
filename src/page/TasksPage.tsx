import { OnboardingPage } from '@/components/onboarding/OnboardingPage'
import { TaskList } from '@/components/onboarding/TaskList'
import { useEdition } from '@/panel/EditionContext'
import { canEditOnboarding } from '@/panel/roles'

function TasksPage() {
  const membership = useEdition()

  return (
    <OnboardingPage title="Zadania wdrażające">
      <TaskList
        editionId={membership.edition_id}
        canEdit={canEditOnboarding(membership.role)}
      />
    </OnboardingPage>
  )
}

export default TasksPage

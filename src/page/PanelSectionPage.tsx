import { OnboardingPage } from '@/components/onboarding/OnboardingPage'
import { PanelPage } from '@/components/panel/PanelPage'
import { SECTION_TITLES } from '@/components/panel/menu'
import { useSection } from '@/panel/EditionContext'
import { ONBOARDING_SECTIONS } from '@/panel/onboarding'

function PanelSectionPage() {
  const section = useSection()
  const title = SECTION_TITLES[section] ?? 'Panel'
  const placeholder = (
    <p className="text-sm text-muted-foreground">
      Ten widok jest jeszcze w budowie
    </p>
  )

  if (ONBOARDING_SECTIONS.some((item) => item.path === section)) {
    return <OnboardingPage title={title}>{placeholder}</OnboardingPage>
  }

  return <PanelPage title={title}>{placeholder}</PanelPage>
}

export default PanelSectionPage

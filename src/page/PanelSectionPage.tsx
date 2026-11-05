import { PanelPage } from '@/components/panel/PanelPage'
import { SECTION_TITLES } from '@/components/panel/menu'
import { useSection } from '@/panel/EditionContext'

function PanelSectionPage() {
  const section = useSection()

  return (
    <PanelPage title={SECTION_TITLES[section] ?? 'Panel'}>
      <p className="text-sm text-muted-foreground">
        Ten widok jest jeszcze w budowie
      </p>
    </PanelPage>
  )
}

export default PanelSectionPage

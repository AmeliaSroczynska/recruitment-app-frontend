import { Link } from 'react-router-dom'
import { TemplatesTab } from '@/components/interviews/TemplatesTab'
import { PanelPage } from '@/components/panel/PanelPage'
import { PanelTabsList, PanelTabsTrigger } from '@/components/panel/PanelTabs'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { useEdition } from '@/panel/EditionContext'
import { canEditInterviews } from '@/panel/roles'

function InterviewsPage() {
  const membership = useEdition()
  const editionId = membership.edition_id

  return (
    <PanelPage
      title="Rozmowy"
      actions={
        <Button
          nativeButton={false}
          variant="outline"
          className="hidden h-9 rounded-[10px] bg-card px-4 md:inline-flex"
          render={<Link to={`/organization/${editionId}/calendar`} />}
        >
          Kalendarz rozmów
        </Button>
      }
    >
      <Tabs defaultValue="templates" className="gap-5 md:gap-6">
        <PanelTabsList>
          <PanelTabsTrigger value="templates">Szablony rozmów</PanelTabsTrigger>
          <PanelTabsTrigger value="all">Wszystkie rozmowy</PanelTabsTrigger>
        </PanelTabsList>
        <TabsContent value="templates">
          <TemplatesTab
            editionId={editionId}
            canEdit={canEditInterviews(membership.role)}
          />
        </TabsContent>
        <TabsContent value="all">
          <p className="text-sm text-muted-foreground">
            Ten widok jest jeszcze w budowie
          </p>
        </TabsContent>
      </Tabs>
    </PanelPage>
  )
}

export default InterviewsPage

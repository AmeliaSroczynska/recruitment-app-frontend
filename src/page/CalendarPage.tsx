import { useState } from 'react'
import {
  FORM_ID,
  InterviewDaysForm,
} from '@/components/calendar/InterviewDaysForm'
import { PanelPage } from '@/components/panel/PanelPage'
import { PanelTabsList, PanelTabsTrigger } from '@/components/panel/PanelTabs'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { useEdition } from '@/panel/EditionContext'
import { canEditInterviews } from '@/panel/roles'

function CalendarPage() {
  const membership = useEdition()
  const [tab, setTab] = useState('config')
  const [isSaving, setIsSaving] = useState(false)
  const canEdit = canEditInterviews(membership.role)

  return (
    <PanelPage
      title={
        <>
          <span className="md:hidden">Kalendarz</span>
          <span className="hidden md:inline">Kalendarz rozmów</span>
        </>
      }
      actions={
        canEdit &&
        tab === 'config' && (
          <Button
            type="submit"
            form={FORM_ID}
            disabled={isSaving}
            variant="accent"
            className="h-9 px-4"
          >
            {isSaving ? 'Zapisywanie...' : 'Zapisz zmiany'}
          </Button>
        )
      }
    >
      <Tabs value={tab} onValueChange={setTab} className="gap-5 md:gap-6">
        <PanelTabsList>
          <PanelTabsTrigger value="to-schedule">Do umówienia</PanelTabsTrigger>
          <PanelTabsTrigger value="scheduled">
            Umówione rozmowy
          </PanelTabsTrigger>
          <PanelTabsTrigger value="config">Konfiguracja</PanelTabsTrigger>
        </PanelTabsList>
        <TabsContent value="to-schedule">
          <p className="text-sm text-muted-foreground">
            Ten widok jest jeszcze w budowie
          </p>
        </TabsContent>
        <TabsContent value="scheduled">
          <p className="text-sm text-muted-foreground">
            Ten widok jest jeszcze w budowie
          </p>
        </TabsContent>
        <TabsContent value="config">
          <InterviewDaysForm
            key={membership.edition_id}
            editionId={membership.edition_id}
            canEdit={canEdit}
            onSavingChange={setIsSaving}
          />
        </TabsContent>
      </Tabs>
    </PanelPage>
  )
}

export default CalendarPage

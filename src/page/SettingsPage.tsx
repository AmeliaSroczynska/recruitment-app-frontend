import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { PanelPage } from '@/components/panel/PanelPage'
import { EditionsCard } from '@/components/settings/EditionsCard'
import { MembersCard } from '@/components/settings/MembersCard'
import {
  FORM_ID,
  OrganizationForm,
} from '@/components/settings/OrganizationForm'
import { PermissionsTable } from '@/components/settings/PermissionsTable'
import { RolesCard } from '@/components/settings/RolesCard'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEdition } from '@/panel/EditionContext'
import { canEditSettings, canSeeSettings } from '@/panel/roles'

const tabClassName =
  'h-full flex-none px-0 text-sm font-normal text-muted-foreground data-active:font-medium data-active:text-foreground after:bottom-[-2px]! after:bg-ochre!'

function SettingsPage() {
  const membership = useEdition()
  const [tab, setTab] = useState('organization')
  const [isSaving, setIsSaving] = useState(false)
  const canEdit = canEditSettings(membership.role)

  if (!canSeeSettings(membership.role)) {
    return <Navigate to="../applications" replace />
  }

  return (
    <PanelPage
      title="Ustawienia"
      actions={
        canEdit &&
        tab === 'organization' && (
          <Button
            type="submit"
            form={FORM_ID}
            disabled={isSaving}
            className="h-9 rounded-[10px] bg-ochre px-4 font-semibold text-surface hover:bg-ochre-dark"
          >
            {isSaving ? 'Zapisywanie...' : 'Zapisz zmiany'}
          </Button>
        )
      }
    >
      <Tabs value={tab} onValueChange={setTab} className="gap-5 md:gap-6">
        <div className="-mx-[18px] border-b border-border px-[18px] md:-mx-8 md:px-8">
          <TabsList
            variant="line"
            className="gap-5 p-0 group-data-horizontal/tabs:h-10"
          >
            <TabsTrigger value="organization" className={tabClassName}>
              Organizacja
            </TabsTrigger>
            <TabsTrigger value="permissions" className={tabClassName}>
              Uprawnienia
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="organization" className="flex flex-col gap-4">
          <OrganizationForm
            key={membership.edition_id}
            editionId={membership.edition_id}
            canEdit={canEdit}
            onSavingChange={setIsSaving}
          />
          <EditionsCard
            key={`editions-${membership.edition_id}`}
            editionId={membership.edition_id}
            canEdit={canEdit}
          />
        </TabsContent>
        <TabsContent value="permissions" className="flex flex-col gap-4">
          <RolesCard />
          <PermissionsTable />
          <MembersCard
            key={membership.edition_id}
            editionId={membership.edition_id}
            canEdit={canEdit}
          />
        </TabsContent>
      </Tabs>
    </PanelPage>
  )
}

export default SettingsPage

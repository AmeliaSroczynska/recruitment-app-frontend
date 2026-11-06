import { useEffect, useState, type FormEvent } from 'react'
import { FormHeaderCard } from '@/components/forms/FormHeaderCard'
import { FormLinkCard } from '@/components/forms/FormLinkCard'
import { FormSettingsCard } from '@/components/forms/FormSettingsCard'
import { PanelPage } from '@/components/panel/PanelPage'
import { PanelTabsList, PanelTabsTrigger } from '@/components/panel/PanelTabs'
import { SettingsCard } from '@/components/settings/SettingsCard'
import { Button } from '@/components/ui/button'
import { FieldError } from '@/components/ui/field'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { api, ApiError } from '@/lib/api'
import { useEdition } from '@/panel/EditionContext'
import type { ApplicationForm } from '@/panel/form'
import { canEditForm } from '@/panel/roles'

const FORM_ID = 'application-form-settings'

function FormsPage() {
  const membership = useEdition()
  const editionId = membership.edition_id
  const canEdit = canEditForm(membership.role)
  const [form, setForm] = useState<ApplicationForm | null>(null)
  const [savedForm, setSavedForm] = useState<ApplicationForm | null>(null)
  const [loadError, setLoadError] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    api<ApplicationForm>(`editions/${editionId}/form/`)
      .then((data) => {
        setForm(data)
        setSavedForm(data)
      })
      .catch(() => setLoadError('Nie udało się wczytać formularza.'))
  }, [editionId])

  function update(changes: Partial<ApplicationForm>) {
    setForm((current) => current && { ...current, ...changes })
    setMessage('')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!form) {
      return
    }
    setError('')
    setMessage('')
    setIsSaving(true)
    try {
      const data = await api<ApplicationForm>(`editions/${editionId}/form/`, {
        method: 'PATCH',
        body: {
          title: form.title,
          description: form.description,
          slug: form.slug,
          is_accepting_responses: form.is_accepting_responses,
        },
      })
      setForm(data)
      setSavedForm(data)
      setMessage('Zapisano zmiany.')
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : 'Brak połączenia z serwerem. Spróbuj ponownie.',
      )
    }
    setIsSaving(false)
  }

  return (
    <PanelPage
      title={
        <>
          <span className="md:hidden">Formularz</span>
          <span className="hidden md:inline">Formularz zgłoszeniowy</span>
        </>
      }
      actions={
        canEdit &&
        form && (
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
      {form && savedForm ? (
        <form id={FORM_ID} onSubmit={handleSubmit}>
          <Tabs defaultValue="questions" className="gap-5 md:gap-6">
            <PanelTabsList>
              <PanelTabsTrigger value="questions">Pytania</PanelTabsTrigger>
              <PanelTabsTrigger value="settings">Ustawienia</PanelTabsTrigger>
            </PanelTabsList>
            <TabsContent value="questions">
              <FormHeaderCard
                form={form}
                disabled={!canEdit}
                onChange={update}
              />
            </TabsContent>
            <TabsContent
              value="settings"
              className="grid items-start gap-4 md:grid-cols-[minmax(0,420px)_minmax(0,1fr)] md:gap-5"
            >
              <FormLinkCard
                slug={form.slug}
                savedSlug={savedForm.slug}
                disabled={!canEdit}
                onChange={(slug) => update({ slug })}
              />
              <FormSettingsCard
                isAcceptingResponses={form.is_accepting_responses}
                disabled={!canEdit}
                onChange={(isAcceptingResponses) =>
                  update({ is_accepting_responses: isAcceptingResponses })
                }
              />
            </TabsContent>
            {(error || message) && (
              <div>
                {error && <FieldError>{error}</FieldError>}
                {message && <p className="text-sm text-olive">{message}</p>}
              </div>
            )}
          </Tabs>
        </form>
      ) : (
        <SettingsCard>
          {loadError ? (
            <p className="text-sm text-destructive">{loadError}</p>
          ) : (
            <Skeleton className="h-40 w-full" />
          )}
        </SettingsCard>
      )}
    </PanelPage>
  )
}

export default FormsPage

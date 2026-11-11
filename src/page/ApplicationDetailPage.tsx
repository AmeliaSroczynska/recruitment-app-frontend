import { ArrowLeft, EyeOff, Info } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { AcceptApplicationDialog } from '@/components/applications/AcceptApplicationDialog'
import { ApplicationMentorCard } from '@/components/applications/ApplicationMentorCard'
import { ApplicationTasksCard } from '@/components/applications/ApplicationTasksCard'
import { AnswerList } from '@/components/applications/AnswerList'
import { NotesCard } from '@/components/applications/NotesCard'
import { RatingCard } from '@/components/applications/RatingCard'
import { StatusBadge } from '@/components/applications/StatusBadge'
import { StatusPicker } from '@/components/applications/StatusPicker'
import { ApplicationInterviews } from '@/components/interviews/ApplicationInterviews'
import { ErrorAlert } from '@/components/panel/ErrorAlert'
import { PanelPage } from '@/components/panel/PanelPage'
import { PanelTabsList, PanelTabsTrigger } from '@/components/panel/PanelTabs'
import { UserAvatar } from '@/components/panel/UserAvatar'
import { SettingsCard } from '@/components/settings/SettingsCard'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { FieldError } from '@/components/ui/field'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { api, ApiError } from '@/lib/api'
import type { ApplicationDetail, ApplicationStatus } from '@/panel/applications'
import { useEdition } from '@/panel/EditionContext'
import { canEditApplications, canEditNotes } from '@/panel/roles'
import { getDisplayName } from '@/panel/user'

type LoadedApplication = {
  key: string
  data: ApplicationDetail | null
  error: string
}

function ApplicationDetailPage() {
  const membership = useEdition()
  const { applicationId } = useParams()
  const location = useLocation()
  const canEdit = canEditApplications(membership.role)
  const path = `editions/${membership.edition_id}/applications/${applicationId}/`
  const listPath = `/organization/${membership.edition_id}/applications${location.state?.search ?? ''}`
  const [loaded, setLoaded] = useState<LoadedApplication | null>(null)
  const [status, setStatus] = useState<ApplicationStatus | null>(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)

  useEffect(() => {
    api<ApplicationDetail>(path)
      .then((data) => setLoaded({ key: path, data, error: '' }))
      .catch((caught) =>
        setLoaded({
          key: path,
          data: null,
          error:
            caught instanceof ApiError && caught.status === 404
              ? 'Nie znaleziono tego zgłoszenia.'
              : 'Nie udało się wczytać zgłoszenia.',
        }),
      )
  }, [path])

  const application = loaded?.key === path ? loaded.data : null
  const loadError = loaded?.key === path ? loaded.error : ''
  const selectedStatus = status ?? application?.status

  async function save() {
    if (!application || !selectedStatus) {
      return
    }
    setError('')
    setMessage('')
    setIsSaving(true)
    try {
      const data = await api<ApplicationDetail>(path, {
        method: 'PATCH',
        body: { status: selectedStatus },
      })
      setLoaded({ key: path, data, error: '' })
      setStatus(null)
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

  const needsConfirmation =
    selectedStatus === 'accepted' && !application?.accepted_at

  const saveButton = canEdit && application && (
    <Button
      type="button"
      disabled={isSaving || selectedStatus === application.status}
      onClick={() => (needsConfirmation ? setIsConfirming(true) : save())}
      variant="accent"
      className="h-9 px-4 md:h-10"
    >
      {isSaving ? 'Zapisywanie...' : 'Zapisz zmiany'}
    </Button>
  )

  return (
    <PanelPage
      breadcrumb={
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link to={listPath} />}>
                Zgłoszenia
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {application ? getDisplayName(application) : 'Kandydat'}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      }
      title={
        <span className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            nativeButton={false}
            render={<Link to={listPath} />}
            aria-label="Wróć do zgłoszeń"
            className="rounded-[10px] bg-card"
          >
            <ArrowLeft />
          </Button>
          Kandydat
        </span>
      }
      actions={saveButton}
    >
      {application && (
        <AcceptApplicationDialog
          open={isConfirming}
          name={getDisplayName(application)}
          onOpenChange={setIsConfirming}
          onConfirm={() => {
            setIsConfirming(false)
            save()
          }}
        />
      )}
      {application && selectedStatus ? (
        <Tabs defaultValue="application" className="gap-5 md:gap-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:pt-1">
            <div className="flex min-w-0 items-center gap-4">
              <UserAvatar
                user={application}
                className="size-14 md:size-16"
                fallbackClassName="bg-sand text-base"
              />
              <div className="min-w-0">
                <h1 className="truncate font-heading text-2xl font-bold text-foreground md:text-[28px]">
                  {getDisplayName(application)}
                </h1>
                <p className="truncate text-sm text-muted-foreground">
                  {application.email}
                </p>
              </div>
            </div>
            <div className="flex items-end gap-6">
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <p className="text-sm font-medium text-foreground">
                  Status kandydata
                </p>
                {canEdit ? (
                  <StatusPicker
                    value={selectedStatus}
                    disabled={isSaving}
                    onChange={(value) => {
                      setStatus(value)
                      setMessage('')
                    }}
                  />
                ) : (
                  <StatusBadge
                    status={application.status}
                    className="h-6 self-start px-2.5"
                  />
                )}
              </div>
              {saveButton && (
                <div className="hidden md:block">{saveButton}</div>
              )}
            </div>
          </div>
          {(error || message) && (
            <div className="-mt-2">
              {error && <FieldError>{error}</FieldError>}
              {message && <p className="text-sm text-olive">{message}</p>}
            </div>
          )}
          <PanelTabsList>
            <PanelTabsTrigger value="application">Zgłoszenie</PanelTabsTrigger>
            <PanelTabsTrigger value="interviews">Rozmowy</PanelTabsTrigger>
            <PanelTabsTrigger value="onboarding">Wdrożenie</PanelTabsTrigger>
            <PanelTabsTrigger value="notes">Notatki</PanelTabsTrigger>
          </PanelTabsList>
          <TabsContent value="application">
            <AnswerList answers={application.answers} />
          </TabsContent>
          <TabsContent value="interviews">
            <ApplicationInterviews
              editionId={membership.edition_id}
              path={path}
              canEdit={canEdit}
            />
          </TabsContent>
          <TabsContent
            value="onboarding"
            className="flex flex-col gap-4 md:gap-5"
          >
            {application.status === 'accepted' ? (
              <>
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Info className="size-4 shrink-0" />
                  Zadania odhacza sam kandydat w swoim panelu. Tutaj widzisz
                  tylko podgląd.
                </p>
                <ApplicationTasksCard path={`${path}tasks/`} />
                <ApplicationMentorCard
                  editionId={membership.edition_id}
                  mentor={application.mentor}
                />
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Wdrożenie zacznie się, gdy kandydat dostanie status Przyjęty.
              </p>
            )}
          </TabsContent>
          <TabsContent value="notes" className="flex flex-col gap-4 md:gap-5">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <EyeOff className="size-4 shrink-0" />
              Oceny i notatki widzi tylko zespół rekrutacyjny. Kandydat ich nie
              zobaczy.
            </p>
            <RatingCard
              path={`${path}ratings/`}
              membershipId={membership.id}
              canEdit={canEditNotes(membership.role)}
            />
            <NotesCard
              path={`${path}notes/`}
              membershipId={membership.id}
              canEdit={canEditNotes(membership.role)}
            />
          </TabsContent>
        </Tabs>
      ) : loadError ? (
        <ErrorAlert>{loadError}</ErrorAlert>
      ) : (
        <SettingsCard>
          <Skeleton className="h-40 w-full" />
        </SettingsCard>
      )}
    </PanelPage>
  )
}

export default ApplicationDetailPage

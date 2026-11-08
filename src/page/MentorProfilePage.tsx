import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ImageUploadField } from '@/components/files/ImageUploadField'
import { DeleteEntryDialog } from '@/components/onboarding/DeleteEntryDialog'
import { MenteesCard } from '@/components/onboarding/MenteesCard'
import { MentorDetailsCard } from '@/components/onboarding/MentorDetailsCard'
import { ErrorAlert } from '@/components/panel/ErrorAlert'
import { PanelPage } from '@/components/panel/PanelPage'
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
import { api, ApiError } from '@/lib/api'
import { useEdition } from '@/panel/EditionContext'
import type { MentorDetails } from '@/panel/onboarding'
import { canEditOnboarding } from '@/panel/roles'

function MentorProfilePage() {
  const membership = useEdition()
  const { mentorId } = useParams()
  const navigate = useNavigate()
  const canEdit = canEditOnboarding(membership.role)
  const listPath = `/organization/${membership.edition_id}/mentors`
  const path = `editions/${membership.edition_id}/mentors/${mentorId}/`
  const [mentor, setMentor] = useState<MentorDetails | null>(null)
  const [loadError, setLoadError] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    api<MentorDetails>(path)
      .then(setMentor)
      .catch((caught) =>
        setLoadError(
          caught instanceof ApiError && caught.status === 404
            ? 'Nie ma takiego mentora.'
            : 'Nie udało się wczytać mentora.',
        ),
      )
  }, [path])

  async function remove() {
    setError('')
    try {
      await api(path, { method: 'DELETE' })
      navigate(listPath)
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : 'Brak połączenia z serwerem. Spróbuj ponownie.',
      )
    }
  }

  const name = mentor ? `${mentor.first_name} ${mentor.last_name}` : 'Mentor'

  return (
    <PanelPage
      breadcrumb={
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link to={listPath} />}>
                Mentorzy
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{name}</BreadcrumbPage>
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
            aria-label="Wróć do mentorów"
            className="rounded-[10px] bg-card"
          >
            <ArrowLeft />
          </Button>
          Mentor
        </span>
      }
    >
      {loadError ? (
        <ErrorAlert>{loadError}</ErrorAlert>
      ) : !mentor ? (
        <Skeleton className="h-96 w-full rounded-2xl" />
      ) : (
        <div className="flex flex-col gap-5 md:gap-6">
          <div className="flex items-center justify-between gap-4">
            <h1 className="min-w-0 truncate font-heading text-2xl font-bold text-foreground md:text-[28px]">
              {name}
            </h1>
            {canEdit && (
              <DeleteEntryDialog
                label="Usuń mentora"
                title="Usunąć mentora?"
                description="Mentor i jego zdjęcie znikną na stałe. Osoby, które go wybrały, zostaną bez mentora."
                showLabel
                onConfirm={remove}
              />
            )}
          </div>
          {error && <FieldError>{error}</FieldError>}
          <div className="grid items-start gap-4 md:gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="flex flex-col gap-4 md:gap-5">
              <SettingsCard>
                <ImageUploadField<MentorDetails>
                  path={`${path}photo/`}
                  fieldName="photo"
                  label="Zdjęcie mentora"
                  placeholder="zdjęcie mentora"
                  url={mentor.photo_url}
                  canEdit={canEdit}
                  onSaved={setMentor}
                />
              </SettingsCard>
              <MentorDetailsCard
                path={path}
                mentor={mentor}
                canEdit={canEdit}
                onChange={setMentor}
              />
            </div>
            <MenteesCard
              editionId={membership.edition_id}
              mentees={mentor.mentees}
            />
          </div>
        </div>
      )}
    </PanelPage>
  )
}

export default MentorProfilePage

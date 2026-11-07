import { useEffect, useState } from 'react'
import { Navigate, Outlet, useParams } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'
import { CandidateHeader } from '@/components/candidate/CandidateHeader'
import { CandidateMobileNav } from '@/components/candidate/CandidateMobileNav'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api'
import { type CandidateApplication, CandidateContext } from '@/panel/candidate'

type LoadedApplication = {
  id: number
  data: CandidateApplication | null
}

function CandidateLayout() {
  const { editionId } = useParams()
  const { user } = useAuth()
  const [loaded, setLoaded] = useState<LoadedApplication | null>(null)

  const applicationId = user?.applications.find(
    (item) => String(item.edition_id) === editionId,
  )?.id

  useEffect(() => {
    if (!applicationId) {
      return
    }
    api<CandidateApplication>(`me/applications/${applicationId}/`)
      .then((data) => setLoaded({ id: applicationId, data }))
      .catch(() => setLoaded({ id: applicationId, data: null }))
  }, [applicationId])

  if (!applicationId) {
    return <Navigate to="/login/candidate/organization" replace />
  }

  const isCurrent = loaded?.id === applicationId
  const application = isCurrent ? loaded.data : null

  if (!application) {
    return (
      <main className="mx-auto flex min-h-svh max-w-[1136px] flex-col gap-5 bg-background px-[18px] pt-7 md:px-8">
        {isCurrent ? (
          <p className="text-sm text-destructive">
            Nie udało się wczytać zgłoszenia. Odśwież stronę.
          </p>
        ) : (
          <>
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-40 w-full max-w-[695px]" />
          </>
        )}
      </main>
    )
  }

  return (
    <CandidateContext.Provider value={application}>
      <div className="min-h-svh bg-background">
        <CandidateHeader />
        <main>
          <Outlet />
        </main>
        <CandidateMobileNav />
      </div>
    </CandidateContext.Provider>
  )
}

export default CandidateLayout

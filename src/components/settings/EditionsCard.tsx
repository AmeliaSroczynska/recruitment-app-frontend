import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'
import { DeleteEditionDialog } from '@/components/settings/DeleteEditionDialog'
import { NewEditionDialog } from '@/components/settings/NewEditionDialog'
import { SettingsCard } from '@/components/settings/SettingsCard'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import type { Edition } from '@/panel/settings'

type EditionsCardProps = {
  editionId: number
  canEdit: boolean
}

function EditionsCard({ editionId, canEdit }: EditionsCardProps) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [editions, setEditions] = useState<Edition[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api<Edition[]>(`editions/${editionId}/organization/editions/`)
      .then(setEditions)
      .catch(() => setError('Nie udało się wczytać edycji.'))
  }, [editionId])

  function isMember(edition: Edition) {
    return Boolean(
      user?.memberships.some((item) => item.edition_id === edition.id),
    )
  }

  return (
    <SettingsCard title="Aktualna edycja">
      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
      {!editions && !error && <Skeleton className="mt-3 h-8 w-64" />}
      {editions && (
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
          {editions.map((edition) => (
            <div key={edition.id} className="flex items-center gap-0.5">
              <Button
                variant="outline"
                disabled={!isMember(edition)}
                onClick={() => navigate(`/organization/${edition.id}/settings`)}
                className={cn(
                  'h-8 rounded-lg border-border bg-card px-3 text-sm font-normal shadow-none',
                  edition.id === editionId &&
                    'border-ochre bg-paper text-ochre-dark hover:bg-paper hover:text-ochre-dark',
                )}
              >
                {edition.name}
              </Button>
              {canEdit && editions.length > 1 && (
                <DeleteEditionDialog
                  edition={edition}
                  onDeleted={(deletedId) =>
                    setEditions(
                      (current) =>
                        current &&
                        current.filter((item) => item.id !== deletedId),
                    )
                  }
                />
              )}
            </div>
          ))}
        </div>
      )}
      {canEdit && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <NewEditionDialog editionId={editionId} />
        </div>
      )}
    </SettingsCard>
  )
}

export { EditionsCard }

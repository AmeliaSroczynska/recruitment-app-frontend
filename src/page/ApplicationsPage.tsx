import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ApplicationCards } from '@/components/applications/ApplicationCards'
import { ApplicationFilters } from '@/components/applications/ApplicationFilters'
import { ApplicationPagination } from '@/components/applications/ApplicationPagination'
import { ApplicationTable } from '@/components/applications/ApplicationTable'
import { PanelPage } from '@/components/panel/PanelPage'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api'
import type { ApplicationPage } from '@/panel/applications'
import { useEdition } from '@/panel/EditionContext'

const DEFAULT_ORDERING = 'submitted_at'

type LoadedPage = {
  key: string
  data: ApplicationPage | null
  error: string
}

function ApplicationsPage() {
  const membership = useEdition()
  const [params, setParams] = useSearchParams()
  const search = params.get('search') ?? ''
  const ordering = params.get('ordering') ?? DEFAULT_ORDERING
  const page = Number(params.get('page') ?? '1') || 1
  const [query, setQuery] = useState(search)
  const [loaded, setLoaded] = useState<LoadedPage | null>(null)

  const path = `editions/${membership.edition_id}/applications/?${new URLSearchParams(
    {
      ...(search && { search }),
      ordering,
      page: String(page),
    },
  )}`

  useEffect(() => {
    api<ApplicationPage>(path)
      .then((data) => setLoaded({ key: path, data, error: '' }))
      .catch(() =>
        setLoaded({
          key: path,
          data: null,
          error: 'Nie udało się wczytać zgłoszeń.',
        }),
      )
  }, [path])

  function update(changes: Record<string, string>, resetPage = true) {
    setParams(
      (current) => {
        const next = new URLSearchParams(current)
        for (const [name, value] of Object.entries(changes)) {
          if (value) {
            next.set(name, value)
          } else {
            next.delete(name)
          }
        }
        if (resetPage) {
          next.delete('page')
        }
        return next
      },
      { replace: true },
    )
  }

  useEffect(() => {
    if (query.trim() === search) {
      return
    }
    const timer = setTimeout(() => update({ search: query.trim() }), 300)
    return () => clearTimeout(timer)
  })

  const data = loaded?.data
  const isLoading = loaded?.key !== path
  const hasFilters = Boolean(search)

  const filters = (
    <ApplicationFilters search={query} onSearchChange={setQuery} />
  )

  return (
    <PanelPage
      actions={<div className="hidden md:block">{filters}</div>}
      title="Zgłoszenia"
    >
      <div className="mb-4 md:hidden">{filters}</div>
      <div>
        {loaded?.error && (
          <p className="text-sm text-destructive">{loaded.error}</p>
        )}
        {!data && !loaded?.error && <Skeleton className="h-64 w-full" />}
        {data && data.results.length === 0 && (
          <p className="rounded-2xl border border-border bg-card px-4 py-10 text-center text-sm text-muted-foreground">
            {hasFilters
              ? 'Żadne zgłoszenie nie pasuje do wyszukiwania.'
              : 'Nie ma jeszcze żadnych zgłoszeń.'}
          </p>
        )}
        {data && data.results.length > 0 && (
          <div className={isLoading ? 'opacity-60 transition-opacity' : ''}>
            <div className="hidden md:block">
              <ApplicationTable
                applications={data.results}
                ordering={ordering}
                onOrderingChange={(value) =>
                  update({
                    ordering: value === DEFAULT_ORDERING ? '' : value,
                  })
                }
              />
            </div>
            <div className="md:hidden">
              <ApplicationCards applications={data.results} />
            </div>
            <ApplicationPagination
              page={page}
              count={data.count}
              onPageChange={(value) =>
                update({ page: value > 1 ? String(value) : '' }, false)
              }
            />
          </div>
        )}
      </div>
    </PanelPage>
  )
}

export default ApplicationsPage

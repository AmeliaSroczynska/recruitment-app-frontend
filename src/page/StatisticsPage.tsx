import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ErrorAlert } from '@/components/panel/ErrorAlert'
import { PanelPage } from '@/components/panel/PanelPage'
import { RangeTabs, RangeToggle } from '@/components/statistics/RangePicker'
import { StatCard } from '@/components/statistics/StatCard'
import { StatisticsSection } from '@/components/statistics/StatisticsSection'
import { StatusChartCard } from '@/components/statistics/StatusChartCard'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api'
import { useEdition } from '@/panel/EditionContext'
import {
  DEFAULT_RANGE,
  isStatisticsRange,
  type Statistics,
  type StatisticsRange,
} from '@/panel/statistics'

type LoadedStatistics = {
  key: string
  data: Statistics | null
  error: string
}

function StatisticsPage() {
  const membership = useEdition()
  const [params, setParams] = useSearchParams()
  const rangeParam = params.get('range')
  const range = isStatisticsRange(rangeParam) ? rangeParam : DEFAULT_RANGE
  const [loaded, setLoaded] = useState<LoadedStatistics | null>(null)

  const path = `editions/${membership.edition_id}/statistics/?range=${range}`

  useEffect(() => {
    api<Statistics>(path)
      .then((data) => setLoaded({ key: path, data, error: '' }))
      .catch(() =>
        setLoaded({
          key: path,
          data: null,
          error: 'Nie udało się wczytać statystyk.',
        }),
      )
  }, [path])

  function changeRange(value: StatisticsRange) {
    setParams(value === DEFAULT_RANGE ? {} : { range: value }, {
      replace: true,
    })
  }

  const data = loaded?.data
  const isLoading = loaded?.key !== path

  return (
    <PanelPage
      title="Statystyki"
      actions={
        <div className="hidden md:block">
          <RangeToggle value={range} onChange={changeRange} />
        </div>
      }
    >
      <div className="-mt-1 mb-5 md:hidden">
        <RangeTabs value={range} onChange={changeRange} />
      </div>
      {loaded?.error && <ErrorAlert>{loaded.error}</ErrorAlert>}
      {!data && !loaded?.error && <Skeleton className="h-64 w-full" />}
      {data && (
        <div
          className={
            isLoading
              ? 'flex flex-col gap-6 opacity-60 transition-opacity'
              : 'flex flex-col gap-6'
          }
        >
          <StatisticsSection title="Rekrutacja">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
              <StatCard
                label="Zgłoszenia"
                value={data.recruitment.applications}
              />
              <StatCard
                label="Rozmowy odbyte"
                value={data.recruitment.interviews_done}
              />
              <StatCard label="Przyjęci" value={data.recruitment.accepted} />
            </div>
            <StatusChartCard statuses={data.recruitment.statuses} />
          </StatisticsSection>
        </div>
      )}
    </PanelPage>
  )
}

export default StatisticsPage

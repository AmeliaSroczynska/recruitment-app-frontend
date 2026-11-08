import type { ApplicationStatus } from '@/panel/applications'

type StatisticsRange = '7' | '30' | 'all'

type StatusStatistics = {
  name: ApplicationStatus
  label: string
  count: number
  percent: number
}

type RecruitmentStatistics = {
  applications: number
  interviews_done: number | null
  accepted: number
  statuses: StatusStatistics[]
}

type Statistics = {
  range: StatisticsRange
  recruitment: RecruitmentStatistics
}

const DEFAULT_RANGE: StatisticsRange = 'all'

const RANGES: { value: StatisticsRange; label: string }[] = [
  { value: '7', label: '7 dni' },
  { value: '30', label: '30 dni' },
  { value: 'all', label: 'Cała edycja' },
]

function isStatisticsRange(value: string | null): value is StatisticsRange {
  return RANGES.some((range) => range.value === value)
}

export { DEFAULT_RANGE, RANGES, isStatisticsRange }
export type { Statistics, StatisticsRange, StatusStatistics }

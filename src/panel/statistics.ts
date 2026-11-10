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

type TaskStatistics = {
  id: number
  name: string
  percent: number | null
}

type OnboardingStatistics = {
  people: number
  tasks_completed_percent: number | null
  average_days: number | null
  tasks: TaskStatistics[]
}

type Statistics = {
  range: StatisticsRange
  recruitment: RecruitmentStatistics
  onboarding: OnboardingStatistics
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

function formatPercent(value: number | null) {
  return value === null ? null : `${value}%`
}

function formatDays(value: number | null) {
  if (value === null) {
    return null
  }
  return value === 1 ? '1 dzień' : `${value} dni`
}

export { DEFAULT_RANGE, RANGES, formatDays, formatPercent, isStatisticsRange }
export type { Statistics, StatisticsRange, StatusStatistics, TaskStatistics }

type InterviewDays = {
  dates: string[]
  info: string | null
}

type AvailabilitySlot = {
  date: string
  start_time: string
  end_time: string
}

type ScheduledInterview = {
  id: number
  template_name: string
  date: string
  start_time: string
  end_time: string
}

type CandidateAvailability = {
  days: string[]
  info: string | null
  slots: AvailabilitySlot[]
  interview: ScheduledInterview | null
}

type ApplicationToSchedule = {
  id: number
  first_name: string
  last_name: string
  email: string
  photo_url: string | null
  slots: AvailabilitySlot[]
  pending_interview: { id: number; template_name: string } | null
}

const GRID_START_HOUR = 8
const GRID_END_HOUR = 20
const GRID_MINUTES = 15

function formatTime(minutes: number) {
  const hours = String(Math.floor(minutes / 60)).padStart(2, '0')
  return `${hours}:${String(minutes % 60).padStart(2, '0')}`
}

function toMinutes(time: string) {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

const GRID_TIMES = Array.from(
  { length: ((GRID_END_HOUR - GRID_START_HOUR) * 60) / GRID_MINUTES },
  (_, index) => formatTime(GRID_START_HOUR * 60 + index * GRID_MINUTES),
)

function toIsoDate(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

function fromIsoDate(value: string) {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function getCellKey(date: string, time: string) {
  return `${date} ${time}`
}

function slotsToCells(slots: AvailabilitySlot[]) {
  const cells = new Set<string>()
  for (const slot of slots) {
    const end = toMinutes(slot.end_time)
    for (
      let minutes = toMinutes(slot.start_time);
      minutes < end;
      minutes += GRID_MINUTES
    ) {
      cells.add(getCellKey(slot.date, formatTime(minutes)))
    }
  }
  return cells
}

function cellsToSlots(cells: Set<string>, days: string[]) {
  const slots: AvailabilitySlot[] = []
  for (const date of days) {
    let start: number | null = null
    for (const [index, time] of [...GRID_TIMES, null].entries()) {
      const isSelected = time !== null && cells.has(getCellKey(date, time))
      if (isSelected && start === null) {
        start = index
      }
      if (!isSelected && start !== null) {
        slots.push({
          date,
          start_time: GRID_TIMES[start],
          end_time: formatTime(GRID_START_HOUR * 60 + index * GRID_MINUTES),
        })
        start = null
      }
    }
  }
  return slots
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

function formatMonths(days: string[]) {
  const months = new Set(
    days.map((day) =>
      capitalize(
        fromIsoDate(day).toLocaleDateString('pl-PL', {
          month: 'long',
          year: 'numeric',
        }),
      ),
    ),
  )
  return [...months].join(' / ')
}

function formatShortDay(date: string) {
  const value = fromIsoDate(date)
  const weekday = value.toLocaleDateString('pl-PL', { weekday: 'short' })
  const day = value.toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'short',
  })
  return `${weekday} ${day}`
}

function formatLongDay(date: string) {
  return capitalize(
    fromIsoDate(date).toLocaleDateString('pl-PL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }),
  )
}

function formatDuration(slot: AvailabilitySlot) {
  const minutes = toMinutes(slot.end_time) - toMinutes(slot.start_time)
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return [hours && `${hours} h`, rest && `${rest} min`]
    .filter(Boolean)
    .join(' ')
}

export {
  GRID_TIMES,
  capitalize,
  cellsToSlots,
  formatDuration,
  formatLongDay,
  formatMonths,
  formatShortDay,
  fromIsoDate,
  getCellKey,
  slotsToCells,
  toIsoDate,
}
export type {
  ApplicationToSchedule,
  AvailabilitySlot,
  CandidateAvailability,
  InterviewDays,
  ScheduledInterview,
}

import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { GRID_TIMES, fromIsoDate } from '@/panel/calendar'
import { formatInterviewers, type EditionInterview } from '@/panel/interviews'
import { getDisplayName } from '@/panel/user'

const ROW_HEIGHT = 20
const GRID_START_MINUTES = 8 * 60

type ScheduledCalendarProps = {
  days: string[]
  interviews: EditionInterview[]
  editionId: number
}

function toMinutes(time: string) {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

type PlacedInterview = {
  interview: EditionInterview
  start: number
  end: number
  lane: number
  lanes: number
}

function getRange(interview: EditionInterview) {
  const start = toMinutes(interview.start_time ?? '08:00')
  const end = toMinutes(interview.end_time ?? interview.start_time ?? '08:15')
  return { start, end: Math.max(end, start + 30) }
}

function placeInterviews(interviews: EditionInterview[]) {
  const sorted = interviews
    .map((interview) => ({ interview, ...getRange(interview) }))
    .sort((a, b) => a.start - b.start || a.end - b.end)
  const placed: PlacedInterview[] = []
  let group: PlacedInterview[] = []
  let laneEnds: number[] = []
  let groupEnd = 0

  function closeGroup() {
    for (const item of group) {
      item.lanes = laneEnds.length
    }
    group = []
    laneEnds = []
  }

  for (const item of sorted) {
    if (group.length > 0 && item.start >= groupEnd) {
      closeGroup()
    }
    let lane = laneEnds.findIndex((end) => end <= item.start)
    if (lane === -1) {
      lane = laneEnds.length
      laneEnds.push(item.end)
    } else {
      laneEnds[lane] = item.end
    }
    const entry = { ...item, lane, lanes: 1 }
    group.push(entry)
    placed.push(entry)
    groupEnd = group.length === 1 ? item.end : Math.max(groupEnd, item.end)
  }
  closeGroup()
  return placed
}

function getPosition({ start, end, lane, lanes }: PlacedInterview) {
  const width = `(100% - 8px) / ${lanes}`
  return {
    top: ((start - GRID_START_MINUTES) / 15) * ROW_HEIGHT,
    height: ((end - start) / 15) * ROW_HEIGHT - 2,
    left: `calc(4px + ${width} * ${lane})`,
    width: `calc(${width} - ${lanes > 1 ? 2 : 0}px)`,
  }
}

function ScheduledCalendar({
  days,
  interviews,
  editionId,
}: ScheduledCalendarProps) {
  const height = GRID_TIMES.length * ROW_HEIGHT

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-card">
      <div
        className="grid min-w-fit"
        style={{
          gridTemplateColumns: `52px repeat(${days.length}, minmax(150px, 1fr))`,
        }}
      >
        <div className="sticky left-0 z-20 border-b border-border bg-card" />
        {days.map((day) => {
          const date = fromIsoDate(day)
          return (
            <div
              key={day}
              className="border-b border-l border-border bg-card px-3 py-2"
            >
              <p className="text-[11px] text-muted-foreground">
                {date.toLocaleDateString('pl-PL', { weekday: 'short' })}
              </p>
              <p className="font-heading text-sm font-bold text-foreground">
                {date.toLocaleDateString('pl-PL', {
                  day: 'numeric',
                  month: 'short',
                })}
              </p>
            </div>
          )
        })}
        <div className="sticky left-0 z-20 bg-card" style={{ height }}>
          {GRID_TIMES.filter((time) => time.endsWith(':00')).map(
            (time, index) => (
              <span
                key={time}
                className="absolute left-0 w-[52px] px-2 pt-1 text-[11px] leading-none text-muted-foreground"
                style={{ top: index * 4 * ROW_HEIGHT }}
              >
                {time}
              </span>
            ),
          )}
        </div>
        {days.map((day) => (
          <div
            key={day}
            className="relative border-l border-border"
            style={{
              height,
              backgroundImage: `repeating-linear-gradient(to bottom, var(--color-border) 0 1px, transparent 1px ${ROW_HEIGHT * 4}px)`,
            }}
          >
            {placeInterviews(
              interviews.filter((interview) => interview.date === day),
            ).map((item) => {
              const { interview } = item
              return (
                <Link
                  key={interview.id}
                  to={`/organization/${editionId}/applications/${interview.application_id}`}
                  state={{ tab: 'interviews', interviewId: interview.id }}
                  className={cn(
                    'absolute overflow-hidden rounded-md border-l-[3px] border-ochre bg-paper px-2 py-1 text-left transition-colors hover:bg-sand/40',
                  )}
                  style={getPosition(item)}
                >
                  <p className="truncate text-xs font-medium text-foreground">
                    {getDisplayName(interview)}
                  </p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {interview.start_time?.slice(0, 5)}-
                    {interview.end_time?.slice(0, 5)} ·{' '}
                    {formatInterviewers(interview)}
                  </p>
                </Link>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export { ScheduledCalendar }

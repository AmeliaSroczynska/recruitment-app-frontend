import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { capitalize, fromIsoDate, toIsoDate } from '@/panel/calendar'

const WEEKDAYS = ['pon.', 'wt.', 'śr.', 'czw.', 'pt.', 'sob.', 'niedz.']

type MonthCalendarProps = {
  selected: Set<string>
  onToggle?: (date: string) => void
}

function getMonthStart(selected: Set<string>) {
  const first = [...selected].sort()[0]
  const date = first ? fromIsoDate(first) : new Date()
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function getMonthDays(month: Date) {
  const offset = (month.getDay() + 6) % 7
  return Array.from(
    { length: 42 },
    (_, index) =>
      new Date(month.getFullYear(), month.getMonth(), index - offset + 1),
  )
}

function MonthCalendar({ selected, onToggle }: MonthCalendarProps) {
  const [month, setMonth] = useState(() => getMonthStart(selected))
  const days = getMonthDays(month)
  const weeks = days[35].getMonth() === month.getMonth() ? 6 : 5

  function moveMonth(step: number) {
    setMonth(new Date(month.getFullYear(), month.getMonth() + step, 1))
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Poprzedni miesiąc"
          onClick={() => moveMonth(-1)}
          className="rounded-[10px] bg-card"
        >
          <ChevronLeft />
        </Button>
        <p className="font-heading text-base font-semibold text-foreground">
          {capitalize(
            month.toLocaleDateString('pl-PL', {
              month: 'long',
              year: 'numeric',
            }),
          )}
        </p>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Następny miesiąc"
          onClick={() => moveMonth(1)}
          className="rounded-[10px] bg-card"
        >
          <ChevronRight />
        </Button>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-1.5 md:gap-2">
        {WEEKDAYS.map((weekday) => (
          <span
            key={weekday}
            className="pb-1 text-center text-xs text-muted-foreground"
          >
            {weekday}
          </span>
        ))}
        {days.slice(0, weeks * 7).map((day) => {
          const iso = toIsoDate(day)
          const isSelected = selected.has(iso)
          const isOtherMonth = day.getMonth() !== month.getMonth()
          return (
            <button
              key={iso}
              type="button"
              aria-pressed={isSelected}
              aria-label={day.toLocaleDateString('pl-PL', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
              disabled={!onToggle}
              onClick={() => onToggle?.(iso)}
              className={cn(
                'h-10 rounded-[10px] border border-border bg-card text-sm text-foreground transition-colors hover:border-sand disabled:cursor-default disabled:hover:border-border',
                isOtherMonth && 'text-stone',
                isSelected &&
                  'border-ochre bg-ochre font-medium text-on-ochre hover:border-ochre disabled:hover:border-ochre',
              )}
            >
              {day.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export { MonthCalendar }

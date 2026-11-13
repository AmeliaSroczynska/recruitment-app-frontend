import { useEffect, useRef, type MouseEvent, type PointerEvent } from 'react'
import { cn } from '@/lib/utils'
import { GRID_TIMES, fromIsoDate, getCellKey } from '@/panel/calendar'

type AvailabilityGridProps = {
  days: string[]
  cells: Set<string>
  highlighted?: Set<string>
  onChange?: (cells: Set<string>) => void
}

function AvailabilityGrid({
  days,
  cells,
  highlighted,
  onChange,
}: AvailabilityGridProps) {
  const paintMode = useRef<boolean | null>(null)
  const pointerType = useRef('')

  useEffect(() => {
    function stop() {
      paintMode.current = null
    }
    window.addEventListener('pointerup', stop)
    return () => window.removeEventListener('pointerup', stop)
  }, [])

  function paint(key: string, isSelected: boolean) {
    if (!onChange || cells.has(key) === isSelected) {
      return
    }
    const next = new Set(cells)
    if (isSelected) {
      next.add(key)
    } else {
      next.delete(key)
    }
    onChange(next)
  }

  function handlePointerDown(event: PointerEvent, key: string) {
    pointerType.current = event.pointerType
    if (event.pointerType === 'mouse' && event.button === 0) {
      event.preventDefault()
      paintMode.current = !cells.has(key)
      paint(key, paintMode.current)
    }
  }

  function handleClick(event: MouseEvent, key: string) {
    if (event.detail === 0 || pointerType.current !== 'mouse') {
      paint(key, !cells.has(key))
    }
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <div
        className="grid min-w-fit select-none"
        style={{
          gridTemplateColumns: `52px repeat(${days.length}, minmax(64px, 1fr))`,
        }}
      >
        <div className="sticky left-0 z-10 border-b border-border bg-card" />
        {days.map((day) => {
          const date = fromIsoDate(day)
          return (
            <div
              key={day}
              className="border-b border-l border-border bg-card px-2 py-1.5"
            >
              <p className="text-[11px] text-muted-foreground">
                {date.toLocaleDateString('pl-PL', { weekday: 'short' })}
              </p>
              <p className="text-sm font-semibold text-foreground">
                {date.toLocaleDateString('pl-PL', {
                  day: 'numeric',
                  month: 'short',
                })}
              </p>
            </div>
          )
        })}
        {GRID_TIMES.map((time) => {
          const isHour = time.endsWith(':00')
          return [
            <div
              key={time}
              className={cn(
                'sticky left-0 z-10 bg-card px-2 text-[11px] leading-none text-muted-foreground',
                isHour && 'border-t border-border pt-1',
              )}
            >
              {isHour ? time : ''}
            </div>,
            ...days.map((day) => {
              const key = getCellKey(day, time)
              const isSelected = cells.has(key)
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={isSelected}
                  aria-label={`${day} ${time}`}
                  disabled={!onChange}
                  onPointerDown={(event) => handlePointerDown(event, key)}
                  onPointerEnter={() =>
                    paintMode.current !== null && paint(key, paintMode.current)
                  }
                  onClick={(event) => handleClick(event, key)}
                  className={cn(
                    'h-5 border-l border-border bg-card transition-colors hover:bg-paper disabled:cursor-default disabled:hover:bg-card',
                    isHour ? 'border-t' : 'border-t border-t-border/40',
                    !isSelected &&
                      highlighted?.has(key) &&
                      'bg-sand/45 hover:bg-sand/70 disabled:hover:bg-sand/45',
                    isSelected &&
                      'bg-ochre hover:bg-ochre/90 disabled:hover:bg-ochre',
                  )}
                />
              )
            }),
          ]
        })}
      </div>
    </div>
  )
}

export { AvailabilityGrid }

import { cn } from '@/lib/utils'
import type { HistoryItem } from '@/panel/candidate'

type ApplicationHistoryProps = {
  items: HistoryItem[]
}

function ApplicationHistory({ items }: ApplicationHistoryProps) {
  return (
    <section>
      <h2 className="font-heading text-[22px] leading-tight font-extrabold tracking-[-0.2px] text-foreground">
        Historia zgłoszenia
      </h2>
      <ol className="mt-4 flex flex-col">
        {items.map((item, index) => (
          <li
            key={item.label}
            aria-current={item.state === 'current' ? 'step' : undefined}
            className={cn(
              'relative flex min-h-9 items-center gap-3',
              index < items.length - 1 &&
                'before:absolute before:top-1/2 before:left-2 before:h-full before:w-0.5 before:bg-border',
            )}
          >
            <span
              className={cn(
                'relative size-[18px] shrink-0 rounded-full border-2',
                item.state === 'done' && 'border-sage bg-sage',
                item.state === 'current' && 'border-olive bg-olive',
                item.state === 'next' &&
                  'border-dashed border-stone bg-background',
              )}
            />
            <span
              className={cn(
                'text-sm',
                item.state === 'done' && 'font-semibold text-foreground',
                item.state === 'current' &&
                  'my-1 flex-1 rounded-[10px] bg-olive px-3 py-1.5 font-semibold text-surface',
                item.state === 'next' && 'font-medium text-muted-foreground',
              )}
            >
              {item.label}
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}

export { ApplicationHistory }

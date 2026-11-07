import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ApplicationStatus } from '@/panel/applications'
import { STAGES, STATUS_VIEWS } from '@/panel/candidate'

type StatusHeroProps = {
  status: ApplicationStatus
  onboardingPath: string
}

function getBarClassName(index: number, stage: number) {
  if (index < stage) {
    return 'bg-sage'
  }
  return index === stage ? 'bg-ochre' : 'bg-olive-dark'
}

function StatusHero({ status, onboardingPath }: StatusHeroProps) {
  const view = STATUS_VIEWS[status]
  const isRejected = status === 'rejected'

  return (
    <section
      className={cn(
        'self-start rounded-[18px] p-5 md:p-6',
        isRejected
          ? 'border border-border bg-card shadow-[0_1px_2px_rgba(34,32,27,0.05)]'
          : 'bg-olive',
      )}
    >
      <h2
        className={cn(
          'font-heading text-2xl leading-tight font-extrabold tracking-[-0.4px] md:text-[28px]',
          isRejected ? 'text-foreground' : 'text-surface',
        )}
      >
        {view.title}
      </h2>
      {view.description && (
        <p
          className={cn(
            'mt-3 text-sm md:mt-4',
            isRejected ? 'text-muted-foreground' : 'text-sage-light',
          )}
        >
          {view.description}
        </p>
      )}
      <ol className="mt-5 grid grid-cols-5 gap-1.5">
        {STAGES.map((stage, index) => (
          <li key={stage} className="flex min-w-0 flex-col gap-2">
            <span
              className={cn(
                'h-1.5 rounded-[3px]',
                isRejected
                  ? 'bg-secondary'
                  : getBarClassName(index, view.stage),
              )}
            />
            <span
              aria-current={index === view.stage ? 'step' : undefined}
              className={cn(
                'truncate text-[11px] md:text-xs',
                isRejected ? 'text-muted-foreground' : 'text-moss',
                index === view.stage &&
                  (isRejected
                    ? 'text-destructive'
                    : 'font-semibold text-surface'),
              )}
            >
              {stage}
            </span>
          </li>
        ))}
      </ol>
      {status === 'accepted' && (
        <Button
          nativeButton={false}
          render={<Link to={onboardingPath} />}
          className="mt-5 h-9 rounded-[10px] bg-ochre px-3 font-semibold text-on-ochre hover:bg-ochre/90"
        >
          Przejdź do wdrożenia
          <ArrowRight />
        </Button>
      )}
    </section>
  )
}

export { StatusHero }

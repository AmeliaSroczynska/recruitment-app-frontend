import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
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
    <Card
      className={cn(
        'gap-0 self-start rounded-[18px] p-5 md:p-6',
        isRejected ? 'shadow-card ring-border' : 'bg-olive shadow-none ring-0',
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
          variant="accent"
          className="mt-5 h-9 px-3"
        >
          Przejdź do wdrożenia
          <ArrowRight />
        </Button>
      )}
    </Card>
  )
}

export { StatusHero }

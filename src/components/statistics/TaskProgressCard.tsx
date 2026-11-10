import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { formatPercent, type TaskStatistics } from '@/panel/statistics'

type TaskProgressCardProps = {
  tasks: TaskStatistics[]
}

function TaskProgressCard({ tasks }: TaskProgressCardProps) {
  return (
    <Card className="gap-0 rounded-2xl bg-card py-5 shadow-card ring-border md:py-6">
      <CardContent className="flex flex-col gap-4 px-5 md:px-6">
        <h3 className="font-heading text-base font-semibold text-foreground">
          Odhaczenia zadań wdrażających
        </h3>
        {tasks.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Brak zadań wdrażających.
          </p>
        ) : (
          <ul className="flex flex-col gap-4 md:gap-3">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 text-sm md:grid-cols-[220px_1fr_48px]"
              >
                <span className="truncate text-foreground">{task.name}</span>
                <Progress
                  value={task.percent ?? 0}
                  aria-label={`Odhaczenia: ${task.name}`}
                  className="col-span-2 row-start-2 md:col-span-1 md:row-start-auto [&_[data-slot=progress-indicator]]:bg-ochre [&_[data-slot=progress-track]]:bg-secondary"
                />
                <span className="text-right text-muted-foreground tabular-nums">
                  {formatPercent(task.percent) ?? 'x'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

export { TaskProgressCard }

import { useEffect, useState } from 'react'
import { CollapsibleCard } from '@/components/applications/CollapsibleCard'
import { Checkbox } from '@/components/ui/checkbox'
import { FieldError } from '@/components/ui/field'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import type { CandidateTask } from '@/panel/onboarding'

type ApplicationTasksCardProps = {
  path: string
}

function ApplicationTasksCard({ path }: ApplicationTasksCardProps) {
  const [tasks, setTasks] = useState<CandidateTask[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api<CandidateTask[]>(path)
      .then(setTasks)
      .catch(() => setError('Nie udało się wczytać zadań.'))
  }, [path])

  const done = tasks?.filter((task) => task.completed).length ?? 0

  return (
    <CollapsibleCard
      title="Zadania wdrożeniowe"
      aside={
        tasks && (
          <span className="text-sm text-muted-foreground">
            {done} z {tasks.length} ukończonych
          </span>
        )
      }
    >
      {error ? (
        <FieldError className="mt-4">{error}</FieldError>
      ) : !tasks ? (
        <Skeleton className="mt-4 h-24 w-full" />
      ) : tasks.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          Lista zadań wdrażających jest jeszcze pusta.
        </p>
      ) : (
        <ul className="mt-3">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center gap-3 border-b border-border py-3"
            >
              <Checkbox
                checked={task.completed}
                disabled
                aria-label={task.name}
                className="disabled:opacity-100"
              />
              <span
                className={cn(
                  'text-sm text-foreground',
                  task.completed && 'text-muted-foreground line-through',
                )}
              >
                {task.name}
              </span>
            </li>
          ))}
        </ul>
      )}
    </CollapsibleCard>
  )
}

export { ApplicationTasksCard }

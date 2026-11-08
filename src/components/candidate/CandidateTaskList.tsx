import { useEffect, useState } from 'react'
import { ErrorAlert } from '@/components/panel/ErrorAlert'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { FieldError } from '@/components/ui/field'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { api, ApiError } from '@/lib/api'
import { cn } from '@/lib/utils'
import type { CandidateTask } from '@/panel/onboarding'

type CandidateTaskListProps = {
  applicationId: number
}

function CandidateTaskList({ applicationId }: CandidateTaskListProps) {
  const [tasks, setTasks] = useState<CandidateTask[] | null>(null)
  const [loadError, setLoadError] = useState('')
  const [error, setError] = useState('')
  const path = `me/applications/${applicationId}/tasks/`

  useEffect(() => {
    api<CandidateTask[]>(path)
      .then(setTasks)
      .catch(() => setLoadError('Nie udało się wczytać zadań.'))
  }, [path])

  function setCompleted(taskId: number, completed: boolean) {
    setTasks(
      (current) =>
        current &&
        current.map((task) =>
          task.id === taskId ? { ...task, completed } : task,
        ),
    )
  }

  async function toggle(task: CandidateTask, completed: boolean) {
    setError('')
    setCompleted(task.id, completed)
    try {
      await api(`${path}${task.id}/completion/`, {
        method: completed ? 'PUT' : 'DELETE',
      })
    } catch (caught) {
      setCompleted(task.id, !completed)
      setError(
        caught instanceof ApiError
          ? caught.message
          : 'Brak połączenia z serwerem. Spróbuj ponownie.',
      )
    }
  }

  if (loadError) {
    return <ErrorAlert>{loadError}</ErrorAlert>
  }

  if (!tasks) {
    return <Skeleton className="h-64 w-full rounded-2xl" />
  }

  const done = tasks.filter((task) => task.completed).length

  return (
    <Card className="gap-0 rounded-2xl bg-card py-0 shadow-card ring-border">
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-base font-semibold text-foreground">
            Zadania wdrażające
          </h2>
          <span className="text-sm text-muted-foreground">
            {done} z {tasks.length}
          </span>
        </div>
        <Progress
          value={tasks.length ? (done / tasks.length) * 100 : 0}
          aria-label="Postęp zadań"
          className="mt-3"
        />
      </div>
      {tasks.length === 0 ? (
        <p className="border-t border-border px-5 py-4 text-sm text-muted-foreground">
          Zespół nie dodał jeszcze żadnych zadań.
        </p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id} className="border-t border-border">
              <label className="flex cursor-pointer items-start gap-3 px-5 py-4">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={(checked) => toggle(task, checked)}
                  className="mt-0.5 size-5 rounded-full border-sand"
                />
                <span className="min-w-0">
                  <span
                    className={cn(
                      'block text-sm font-medium text-foreground',
                      task.completed && 'text-muted-foreground line-through',
                    )}
                  >
                    {task.name}
                  </span>
                  {task.description && (
                    <span className="mt-0.5 block text-[13px] text-muted-foreground">
                      {task.description}
                    </span>
                  )}
                </span>
              </label>
            </li>
          ))}
        </ul>
      )}
      {error && <FieldError className="px-5 pb-4">{error}</FieldError>}
    </Card>
  )
}

export { CandidateTaskList }

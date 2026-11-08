import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { TaskCard } from '@/components/onboarding/TaskCard'
import { Button } from '@/components/ui/button'
import { FieldError } from '@/components/ui/field'
import { Skeleton } from '@/components/ui/skeleton'
import { api, ApiError } from '@/lib/api'
import type { Task } from '@/panel/onboarding'

type TaskListProps = {
  editionId: number
  canEdit: boolean
}

function TaskList({ editionId, canEdit }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[] | null>(null)
  const [newTaskId, setNewTaskId] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  useEffect(() => {
    api<Task[]>(`editions/${editionId}/tasks/`)
      .then(setTasks)
      .catch(() => setError('Nie udało się wczytać zadań.'))
  }, [editionId])

  async function addTask() {
    setError('')
    setIsAdding(true)
    try {
      const task = await api<Task>(`editions/${editionId}/tasks/`, {
        method: 'POST',
        body: { name: 'Nowe zadanie' },
      })
      setTasks((current) => current && [...current, task])
      setNewTaskId(task.id)
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : 'Brak połączenia z serwerem. Spróbuj ponownie.',
      )
    }
    setIsAdding(false)
  }

  async function handleDragEnd({ active, over }: DragEndEvent) {
    if (!tasks || !over || active.id === over.id) {
      return
    }
    const previous = tasks
    const reordered = arrayMove(
      tasks,
      tasks.findIndex((task) => task.id === active.id),
      tasks.findIndex((task) => task.id === over.id),
    )
    setTasks(reordered)
    setError('')
    try {
      await api(`editions/${editionId}/tasks/order/`, {
        method: 'POST',
        body: { ids: reordered.map((task) => task.id) },
      })
    } catch (caught) {
      setTasks(previous)
      setError(
        caught instanceof ApiError
          ? caught.message
          : 'Brak połączenia z serwerem. Spróbuj ponownie.',
      )
    }
  }

  function replaceTask(task: Task) {
    setTasks(
      (current) =>
        current && current.map((item) => (item.id === task.id ? task : item)),
    )
  }

  function removeTask(taskId: number) {
    setTasks(
      (current) => current && current.filter((item) => item.id !== taskId),
    )
  }

  if (!tasks) {
    return error ? (
      <FieldError>{error}</FieldError>
    ) : (
      <Skeleton className="h-32 w-full" />
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {tasks.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={tasks.map((task) => task.id)}
            strategy={verticalListSortingStrategy}
          >
            <ul className="flex flex-col gap-5">
              {tasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  editionId={editionId}
                  task={task}
                  number={index + 1}
                  canEdit={canEdit}
                  isNew={task.id === newTaskId}
                  onChange={replaceTask}
                  onDelete={() => removeTask(task.id)}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}
      {tasks.length === 0 && !canEdit && (
        <p className="text-sm text-muted-foreground">
          Lista zadań wdrażających jest jeszcze pusta.
        </p>
      )}
      {error && <FieldError>{error}</FieldError>}
      {canEdit && (
        <Button
          type="button"
          variant="dashed"
          disabled={isAdding}
          onClick={addTask}
          className="h-14 w-full rounded-xl text-[15px]"
        >
          <Plus />
          Dodaj zadanie
        </Button>
      )}
    </div>
  )
}

export { TaskList }

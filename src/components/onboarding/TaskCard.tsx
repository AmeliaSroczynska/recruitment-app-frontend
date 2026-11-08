import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { useState } from 'react'
import { DeleteTaskDialog } from '@/components/onboarding/DeleteTaskDialog'
import { Button } from '@/components/ui/button'
import { FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { api, ApiError } from '@/lib/api'
import { cn } from '@/lib/utils'
import type { Task } from '@/panel/onboarding'

type TaskCardProps = {
  editionId: number
  task: Task
  number: number
  canEdit: boolean
  isNew: boolean
  onChange: (task: Task) => void
  onDelete: () => void
}

function TaskCard({
  editionId,
  task,
  number,
  canEdit,
  isNew,
  onChange,
  onDelete,
}: TaskCardProps) {
  const [name, setName] = useState(task.name)
  const [description, setDescription] = useState(task.description ?? '')
  const [error, setError] = useState('')
  const path = `editions/${editionId}/tasks/${task.id}/`
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, disabled: !canEdit })

  async function save(changes: Partial<Task>) {
    setError('')
    try {
      onChange(await api<Task>(path, { method: 'PATCH', body: changes }))
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : 'Brak połączenia z serwerem. Spróbuj ponownie.',
      )
    }
  }

  async function remove() {
    setError('')
    try {
      await api(path, { method: 'DELETE' })
      onDelete()
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : 'Brak połączenia z serwerem. Spróbuj ponownie.',
      )
    }
  }

  return (
    <li
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        transition,
      }}
      className={cn(
        'rounded-xl border border-border bg-card p-4 md:p-6',
        isDragging && 'relative z-10 shadow-lg',
      )}
    >
      <div className="flex items-center gap-2 md:gap-3">
        {canEdit && (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            ref={setActivatorNodeRef}
            aria-label="Przeciągnij, aby zmienić kolejność"
            className="-ml-1 cursor-grab touch-none text-muted-foreground active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="size-4" />
          </Button>
        )}
        <span className="text-sm text-muted-foreground">Zadanie {number}</span>
        {canEdit && (
          <div className="ml-auto">
            <DeleteTaskDialog onConfirm={remove} />
          </div>
        )}
      </div>
      <div className="mt-3 flex flex-col gap-2.5 md:pl-7">
        <Input
          aria-label="Nazwa zadania"
          autoFocus={isNew}
          disabled={!canEdit}
          value={name}
          onFocus={(event) => isNew && event.target.select()}
          onChange={(event) => setName(event.target.value)}
          onBlur={() => name !== task.name && save({ name })}
          className="h-11 rounded-[10px] border-border bg-card px-3 text-sm font-medium shadow-none"
        />
        <Textarea
          aria-label="Opis zadania"
          placeholder="Opis zadania (opcjonalnie)"
          disabled={!canEdit}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          onBlur={() =>
            description !== (task.description ?? '') && save({ description })
          }
          className="min-h-14 rounded-[10px] border-border bg-card px-3 py-2.5 text-sm shadow-none"
        />
        {error && <FieldError>{error}</FieldError>}
      </div>
    </li>
  )
}

export { TaskCard }

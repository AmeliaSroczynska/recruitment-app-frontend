import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { useState } from 'react'
import { ChoiceList } from '@/components/forms/ChoiceList'
import { DeleteQuestionDialog } from '@/components/forms/DeleteQuestionDialog'
import { RequiredBadge } from '@/components/forms/FixedFields'
import { FieldError } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { api, ApiError } from '@/lib/api'
import { cn } from '@/lib/utils'
import type { Question, QuestionType } from '@/panel/form'

const CHOICE_TYPES = ['single_choice', 'multiple_choice']

type QuestionCardProps = {
  editionId: number
  question: Question
  types: QuestionType[]
  canEdit: boolean
  isNew: boolean
  onChange: (question: Question) => void
  onDelete: () => void
}

function QuestionCard({
  editionId,
  question,
  types,
  canEdit,
  isNew,
  onChange,
  onDelete,
}: QuestionCardProps) {
  const [text, setText] = useState(question.text)
  const [error, setError] = useState('')
  const path = `editions/${editionId}/form/questions/${question.id}/`
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id, disabled: !canEdit })

  async function save(changes: Partial<Question>) {
    setError('')
    try {
      onChange(await api<Question>(path, { method: 'PATCH', body: changes }))
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
        'rounded-xl border border-border bg-surface p-4 md:p-6',
        isDragging && 'relative z-10 shadow-lg',
      )}
    >
      <div className="flex items-center gap-2 md:gap-3">
        {canEdit && (
          <button
            type="button"
            ref={setActivatorNodeRef}
            aria-label="Przeciągnij, aby zmienić kolejność"
            className="-ml-1 flex size-6 cursor-grab touch-none items-center justify-center rounded text-muted-foreground active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="size-4" />
          </button>
        )}
        <Select
          items={Object.fromEntries(
            types.map((type) => [type.name, type.label]),
          )}
          value={question.type}
          disabled={!canEdit}
          onValueChange={(type) => type && save({ type })}
        >
          <SelectTrigger
            aria-label="Typ pytania"
            className="h-9 w-[170px] rounded-lg border-border bg-card text-sm shadow-none"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {types.map((type) => (
              <SelectItem key={type.name} value={type.name}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <button
          type="button"
          disabled={!canEdit}
          aria-label={
            question.is_required
              ? 'Zmień na opcjonalne'
              : 'Zmień na obowiązkowe'
          }
          onClick={() => save({ is_required: !question.is_required })}
          className="rounded-full disabled:cursor-default"
        >
          <RequiredBadge required={question.is_required} />
        </button>
        {canEdit && (
          <div className="ml-auto">
            <DeleteQuestionDialog onConfirm={remove} />
          </div>
        )}
      </div>
      <div className="mt-3 md:pl-7">
        <Textarea
          aria-label="Treść pytania"
          autoFocus={isNew}
          disabled={!canEdit}
          value={text}
          onFocus={(event) => isNew && event.target.select()}
          onChange={(event) => setText(event.target.value)}
          onBlur={() => text !== question.text && save({ text })}
          className="min-h-14 rounded-[10px] border-border bg-card px-3 py-2.5 text-sm shadow-none"
        />
        {CHOICE_TYPES.includes(question.type) && (
          <ChoiceList
            path={`${path}choices/`}
            choices={question.choices}
            multiple={question.type === 'multiple_choice'}
            canEdit={canEdit}
            onChange={(choices) => onChange({ ...question, choices })}
          />
        )}
        {error && <FieldError className="mt-2">{error}</FieldError>}
      </div>
    </li>
  )
}

export { QuestionCard }

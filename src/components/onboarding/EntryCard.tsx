import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { useState } from 'react'
import { FilePicker } from '@/components/files/FilePicker'
import { DeleteEntryDialog } from '@/components/onboarding/DeleteEntryDialog'
import { Button } from '@/components/ui/button'
import { FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { api, ApiError } from '@/lib/api'
import { cn } from '@/lib/utils'
import type { Entry, EntryKind } from '@/panel/onboarding'

type EntryCardProps = {
  editionId: number
  kind: EntryKind
  entry: Entry
  number: number
  canEdit: boolean
  isNew: boolean
  onChange: (entry: Entry) => void
  onDelete: () => void
}

function EntryCard({
  editionId,
  kind,
  entry,
  number,
  canEdit,
  isNew,
  onChange,
  onDelete,
}: EntryCardProps) {
  const savedTitle = String(entry[kind.titleField] ?? '')
  const savedBody = String(entry[kind.bodyField] ?? '')
  const [title, setTitle] = useState(savedTitle)
  const [body, setBody] = useState(savedBody)
  const [error, setError] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const path = `editions/${editionId}/${kind.path}/${entry.id}/`
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: entry.id, disabled: !canEdit })

  async function save(field: string, value: string) {
    setError('')
    try {
      onChange(
        await api<Entry>(path, { method: 'PATCH', body: { [field]: value } }),
      )
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : 'Brak połączenia z serwerem. Spróbuj ponownie.',
      )
    }
  }

  async function replaceFile(file: File) {
    setError('')
    setIsUploading(true)
    const body = new FormData()
    body.append('file', file)
    try {
      onChange(await api<Entry>(`${path}file/`, { method: 'POST', body }))
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : 'Brak połączenia z serwerem. Spróbuj ponownie.',
      )
    }
    setIsUploading(false)
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
        <span className="text-sm text-muted-foreground">
          {kind.itemLabel} {number}
        </span>
        {canEdit && (
          <div className="ml-auto">
            <DeleteEntryDialog
              label={kind.deleteLabel}
              title={kind.deleteTitle}
              description={kind.deleteDescription}
              onConfirm={remove}
            />
          </div>
        )}
      </div>
      <div className="mt-3 flex flex-col gap-2.5 md:pl-7">
        <Input
          aria-label={kind.titleLabel}
          autoFocus={isNew}
          disabled={!canEdit}
          value={title}
          onFocus={(event) => isNew && event.target.select()}
          onChange={(event) => setTitle(event.target.value)}
          onBlur={() => title !== savedTitle && save(kind.titleField, title)}
          className="h-11 rounded-[10px] border-border bg-card px-3 text-sm font-medium shadow-none"
        />
        <Textarea
          aria-label={kind.bodyLabel}
          placeholder={kind.bodyPlaceholder}
          disabled={!canEdit}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          onBlur={() => body !== savedBody && save(kind.bodyField, body)}
          className="min-h-14 rounded-[10px] border-border bg-card px-3 py-2.5 text-sm shadow-none"
        />
        {kind.hasFile && (
          <FilePicker
            kind="file"
            url={entry.file_url ? String(entry.file_url) : null}
            fileName={`Plik ${entry.file_type}`}
            disabled={!canEdit || isUploading}
            onSelect={replaceFile}
          />
        )}
        {error && <FieldError>{error}</FieldError>}
      </div>
    </li>
  )
}

export { EntryCard }

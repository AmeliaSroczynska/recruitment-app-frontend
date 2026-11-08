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
import { EntryCard } from '@/components/onboarding/EntryCard'
import { Button } from '@/components/ui/button'
import { FieldError } from '@/components/ui/field'
import { Skeleton } from '@/components/ui/skeleton'
import { api, ApiError } from '@/lib/api'
import type { Entry, EntryKind } from '@/panel/onboarding'

type EntryListProps = {
  editionId: number
  kind: EntryKind
  canEdit: boolean
}

function EntryList({ editionId, kind, canEdit }: EntryListProps) {
  const path = `editions/${editionId}/${kind.path}/`
  const [entries, setEntries] = useState<Entry[] | null>(null)
  const [newEntryId, setNewEntryId] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  useEffect(() => {
    api<Entry[]>(path)
      .then(setEntries)
      .catch(() => setError(kind.loadError))
  }, [path, kind.loadError])

  async function addEntry() {
    setError('')
    setIsAdding(true)
    try {
      const entry = await api<Entry>(path, {
        method: 'POST',
        body: { [kind.titleField]: kind.newTitle },
      })
      setEntries((current) => current && [...current, entry])
      setNewEntryId(entry.id)
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
    if (!entries || !over || active.id === over.id) {
      return
    }
    const previous = entries
    const reordered = arrayMove(
      entries,
      entries.findIndex((entry) => entry.id === active.id),
      entries.findIndex((entry) => entry.id === over.id),
    )
    setEntries(reordered)
    setError('')
    try {
      await api(`${path}order/`, {
        method: 'POST',
        body: { ids: reordered.map((entry) => entry.id) },
      })
    } catch (caught) {
      setEntries(previous)
      setError(
        caught instanceof ApiError
          ? caught.message
          : 'Brak połączenia z serwerem. Spróbuj ponownie.',
      )
    }
  }

  function replaceEntry(entry: Entry) {
    setEntries(
      (current) =>
        current && current.map((item) => (item.id === entry.id ? entry : item)),
    )
  }

  function removeEntry(entryId: number) {
    setEntries(
      (current) => current && current.filter((item) => item.id !== entryId),
    )
  }

  if (!entries) {
    return error ? (
      <FieldError>{error}</FieldError>
    ) : (
      <Skeleton className="h-32 w-full" />
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {entries.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={entries.map((entry) => entry.id)}
            strategy={verticalListSortingStrategy}
          >
            <ul className="flex flex-col gap-5">
              {entries.map((entry, index) => (
                <EntryCard
                  key={entry.id}
                  editionId={editionId}
                  kind={kind}
                  entry={entry}
                  number={index + 1}
                  canEdit={canEdit}
                  isNew={entry.id === newEntryId}
                  onChange={replaceEntry}
                  onDelete={() => removeEntry(entry.id)}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}
      {entries.length === 0 && !canEdit && (
        <p className="text-sm text-muted-foreground">{kind.emptyText}</p>
      )}
      {error && <FieldError>{error}</FieldError>}
      {canEdit && (
        <Button
          type="button"
          variant="dashed"
          disabled={isAdding}
          onClick={addEntry}
          className="h-14 w-full rounded-xl text-[15px]"
        >
          <Plus />
          {kind.addLabel}
        </Button>
      )}
    </div>
  )
}

export { EntryList }

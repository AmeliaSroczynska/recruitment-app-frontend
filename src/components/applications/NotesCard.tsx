import { Pencil } from 'lucide-react'
import { useEffect, useState } from 'react'
import { CollapsibleCard } from '@/components/applications/CollapsibleCard'
import { DeleteNoteDialog } from '@/components/applications/DeleteNoteDialog'
import { UserAvatar } from '@/components/panel/UserAvatar'
import { Button } from '@/components/ui/button'
import { FieldError } from '@/components/ui/field'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { api, ApiError } from '@/lib/api'
import type { Note } from '@/panel/applications'
import { getDisplayName } from '@/panel/user'

const textareaClassName =
  'min-h-28 rounded-[10px] border-border bg-card px-3 py-2.5 text-sm shadow-none'

const saveButtonClassName =
  'h-10 rounded-[10px] bg-ochre px-4 font-semibold text-surface hover:bg-ochre-dark'

function getMessage(caught: unknown) {
  return caught instanceof ApiError
    ? caught.message
    : 'Brak połączenia z serwerem. Spróbuj ponownie.'
}

type NoteItemProps = {
  path: string
  note: Note
  canEdit: boolean
  onChange: (note: Note) => void
  onDelete: () => void
}

function NoteItem({ path, note, canEdit, onChange, onDelete }: NoteItemProps) {
  const [text, setText] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const notePath = `${path}${note.id}/`

  async function save() {
    setError('')
    setIsSaving(true)
    try {
      onChange(await api<Note>(notePath, { method: 'PATCH', body: { text } }))
      setText(null)
    } catch (caught) {
      setError(getMessage(caught))
    }
    setIsSaving(false)
  }

  async function remove() {
    setError('')
    try {
      await api(notePath, { method: 'DELETE' })
      onDelete()
    } catch (caught) {
      setError(getMessage(caught))
    }
  }

  return (
    <li className="flex gap-3 py-3.5">
      <UserAvatar
        user={note}
        className="size-8"
        fallbackClassName="bg-moss-light text-[11px]"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium text-foreground">
            {getDisplayName(note)}
          </p>
          {canEdit && text === null && (
            <div className="flex shrink-0 items-center">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Edytuj notatkę"
                onClick={() => setText(note.text)}
                className="text-muted-foreground"
              >
                <Pencil />
              </Button>
              <DeleteNoteDialog onConfirm={remove} />
            </div>
          )}
        </div>
        {text === null ? (
          <p className="mt-1 text-sm whitespace-pre-line text-foreground">
            {note.text}
          </p>
        ) : (
          <div className="mt-2 flex flex-col gap-2">
            <Textarea
              aria-label="Treść notatki"
              autoFocus
              maxLength={5000}
              value={text}
              onChange={(event) => setText(event.target.value)}
              className={textareaClassName}
            />
            <div className="flex gap-2">
              <Button
                type="button"
                disabled={isSaving || !text.trim()}
                onClick={save}
                className={saveButtonClassName}
              >
                {isSaving ? 'Zapisywanie...' : 'Zapisz'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setText(null)}
                className="h-10 rounded-[10px]"
              >
                Anuluj
              </Button>
            </div>
          </div>
        )}
        {error && <FieldError className="mt-2">{error}</FieldError>}
      </div>
    </li>
  )
}

type NotesCardProps = {
  path: string
  membershipId: number
  canEdit: boolean
}

function NotesCard({ path, membershipId, canEdit }: NotesCardProps) {
  const [notes, setNotes] = useState<Note[] | null>(null)
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    api<Note[]>(path)
      .then(setNotes)
      .catch(() => setError('Nie udało się wczytać notatek.'))
  }, [path])

  async function add() {
    setError('')
    setIsSaving(true)
    try {
      const note = await api<Note>(path, { method: 'POST', body: { text } })
      setNotes((current) => [...(current ?? []), note])
      setText('')
    } catch (caught) {
      setError(getMessage(caught))
    }
    setIsSaving(false)
  }

  return (
    <CollapsibleCard title="Notatki rekrutera">
      {!notes && !error && <Skeleton className="mt-4 h-24 w-full" />}
      {notes && notes.length > 0 && (
        <ul className="mt-2 divide-y divide-border border-b border-border">
          {notes.map((note) => (
            <NoteItem
              key={note.id}
              path={path}
              note={note}
              canEdit={note.membership === membershipId}
              onChange={(updated) =>
                setNotes(
                  (current) =>
                    current?.map((item) =>
                      item.id === updated.id ? updated : item,
                    ) ?? null,
                )
              }
              onDelete={() =>
                setNotes(
                  (current) =>
                    current?.filter((item) => item.id !== note.id) ?? null,
                )
              }
            />
          ))}
        </ul>
      )}
      {notes && notes.length === 0 && !canEdit && (
        <p className="mt-4 text-sm text-muted-foreground">
          Nikt jeszcze nie dodał notatki.
        </p>
      )}
      {notes && canEdit && (
        <div className="mt-4 flex flex-col items-start gap-3">
          <Textarea
            aria-label="Nowa notatka"
            placeholder="Wrażenia, cytaty, rzeczy do sprawdzenia przed decyzją..."
            maxLength={5000}
            value={text}
            onChange={(event) => setText(event.target.value)}
            className={textareaClassName}
          />
          <Button
            type="button"
            disabled={isSaving || !text.trim()}
            onClick={add}
            className={saveButtonClassName}
          >
            {isSaving ? 'Zapisywanie...' : 'Zapisz notatkę'}
          </Button>
        </div>
      )}
      {error && <FieldError className="mt-3">{error}</FieldError>}
    </CollapsibleCard>
  )
}

export { NotesCard }

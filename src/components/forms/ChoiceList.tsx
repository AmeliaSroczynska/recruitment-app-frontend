import { X } from 'lucide-react'
import { useState, type KeyboardEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { api, ApiError } from '@/lib/api'
import { cn } from '@/lib/utils'
import type { Choice } from '@/panel/form'

const inputClassName =
  'h-9 rounded-[10px] border-border bg-card px-3 text-sm shadow-none'

type ChoiceListProps = {
  path: string
  choices: Choice[]
  multiple: boolean
  canEdit: boolean
  onChange: (choices: Choice[]) => void
}

function getMessage(caught: unknown) {
  return caught instanceof ApiError
    ? caught.message
    : 'Brak połączenia z serwerem. Spróbuj ponownie.'
}

function blurOnEnter(event: KeyboardEvent<HTMLInputElement>) {
  if (event.key === 'Enter') {
    event.preventDefault()
    event.currentTarget.blur()
  }
}

function ChoiceMarker({
  multiple,
  dashed,
}: {
  multiple: boolean
  dashed?: boolean
}) {
  const className = cn(
    'border-[1.5px] border-muted-foreground/60 shadow-none disabled:cursor-default disabled:opacity-100',
    dashed && 'border-dashed border-muted-foreground/40',
  )
  if (multiple) {
    return <Checkbox disabled aria-hidden className={className} />
  }
  return (
    <RadioGroup disabled aria-hidden className="w-auto">
      <RadioGroupItem value="" className={className} />
    </RadioGroup>
  )
}

type ChoiceRowProps = {
  path: string
  choice: Choice
  multiple: boolean
  canEdit: boolean
  onChange: (choice: Choice) => void
  onDelete: () => void
  onError: (message: string) => void
}

function ChoiceRow({
  path,
  choice,
  multiple,
  canEdit,
  onChange,
  onDelete,
  onError,
}: ChoiceRowProps) {
  const [text, setText] = useState(choice.text)
  const choicePath = `${path}${choice.id}/`

  async function save() {
    if (text === choice.text) {
      return
    }
    try {
      onChange(
        await api<Choice>(choicePath, { method: 'PATCH', body: { text } }),
      )
    } catch (caught) {
      onError(getMessage(caught))
    }
  }

  async function remove() {
    try {
      await api(choicePath, { method: 'DELETE' })
      onDelete()
    } catch (caught) {
      onError(getMessage(caught))
    }
  }

  return (
    <li className="flex items-center gap-2 md:gap-3">
      <ChoiceMarker multiple={multiple} />
      <Input
        aria-label="Opcja odpowiedzi"
        disabled={!canEdit}
        maxLength={200}
        value={text}
        onChange={(event) => setText(event.target.value)}
        onBlur={save}
        onKeyDown={blurOnEnter}
        className={inputClassName}
      />
      {canEdit && (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`Usuń opcję ${choice.text}`}
          onClick={remove}
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <X />
        </Button>
      )}
    </li>
  )
}

function ChoiceList({
  path,
  choices,
  multiple,
  canEdit,
  onChange,
}: ChoiceListProps) {
  const [newText, setNewText] = useState('')
  const [error, setError] = useState('')

  async function addChoice() {
    if (!newText.trim()) {
      return
    }
    setError('')
    try {
      const choice = await api<Choice>(path, {
        method: 'POST',
        body: { text: newText.trim() },
      })
      onChange([...choices, choice])
      setNewText('')
    } catch (caught) {
      setError(getMessage(caught))
    }
  }

  return (
    <div className="mt-3 flex flex-col gap-2">
      {choices.length > 0 && (
        <ul className="flex flex-col gap-2">
          {choices.map((choice) => (
            <ChoiceRow
              key={choice.id}
              path={path}
              choice={choice}
              multiple={multiple}
              canEdit={canEdit}
              onChange={(updated) =>
                onChange(
                  choices.map((item) =>
                    item.id === updated.id ? updated : item,
                  ),
                )
              }
              onDelete={() =>
                onChange(choices.filter((item) => item.id !== choice.id))
              }
              onError={setError}
            />
          ))}
        </ul>
      )}
      {canEdit && (
        <div className="flex items-center gap-2 md:gap-3">
          <ChoiceMarker multiple={multiple} dashed />
          <Input
            aria-label="Nowa opcja"
            placeholder="Dodaj opcję..."
            maxLength={200}
            value={newText}
            onChange={(event) => setNewText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                addChoice()
              }
            }}
            className={inputClassName}
          />
          <Button
            type="button"
            variant="outline"
            onClick={addChoice}
            className="h-9 rounded-[10px] border-border bg-card px-3 shadow-none"
          >
            Dodaj
          </Button>
        </div>
      )}
      {error && <FieldError>{error}</FieldError>}
    </div>
  )
}

export { ChoiceList }

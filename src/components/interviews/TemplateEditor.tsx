import { useEffect, useState } from 'react'
import { DeleteEntryDialog } from '@/components/onboarding/DeleteEntryDialog'
import { EntryList } from '@/components/onboarding/EntryList'
import { SettingsCard } from '@/components/settings/SettingsCard'
import { FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { api, ApiError } from '@/lib/api'
import {
  getQuestionEntry,
  type InterviewTemplate,
  type InterviewTemplateDetails,
} from '@/panel/interviews'

type TemplateEditorProps = {
  editionId: number
  templateId: number
  canEdit: boolean
  isNew: boolean
  onChange: (changes: Partial<InterviewTemplate>) => void
  onCountChange: (count: number) => void
  onDelete: () => void
}

function TemplateEditor({
  editionId,
  templateId,
  canEdit,
  isNew,
  onChange,
  onCountChange,
  onDelete,
}: TemplateEditorProps) {
  const path = `editions/${editionId}/interview-templates/${templateId}/`
  const [template, setTemplate] = useState<InterviewTemplateDetails | null>(
    null,
  )
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    api<InterviewTemplateDetails>(path)
      .then((data) => {
        setTemplate(data)
        setName(data.name)
      })
      .catch(() => setError('Nie udało się wczytać szablonu.'))
  }, [path])

  async function saveName() {
    if (!template || name === template.name) {
      return
    }
    setError('')
    try {
      const data = await api<InterviewTemplateDetails>(path, {
        method: 'PATCH',
        body: { name },
      })
      setTemplate(data)
      onChange({ name: data.name })
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

  if (!template) {
    return (
      <SettingsCard>
        {error ? (
          <FieldError>{error}</FieldError>
        ) : (
          <Skeleton className="h-40 w-full" />
        )}
      </SettingsCard>
    )
  }

  return (
    <SettingsCard>
      <div className="flex items-center gap-2">
        <Input
          aria-label="Nazwa szablonu"
          autoFocus={isNew}
          disabled={!canEdit}
          maxLength={200}
          value={name}
          onFocus={(event) => isNew && event.target.select()}
          onChange={(event) => setName(event.target.value)}
          onBlur={saveName}
          className="h-11 rounded-[10px] border-border bg-card px-3 font-heading text-lg font-extrabold shadow-none md:text-2xl"
        />
        {canEdit && (
          <DeleteEntryDialog
            label="Usuń szablon"
            title="Usunąć szablon?"
            description="Szablon zniknie z listy i nie da się go wybrać do nowych rozmów. Rozmowy, które już z niego powstały, zostaną."
            onConfirm={remove}
          />
        )}
      </div>
      {error && <FieldError className="mt-2">{error}</FieldError>}
      <Separator className="my-5" />
      <EntryList
        editionId={editionId}
        kind={getQuestionEntry(templateId)}
        canEdit={canEdit}
        onCountChange={onCountChange}
      />
    </SettingsCard>
  )
}

export { TemplateEditor }

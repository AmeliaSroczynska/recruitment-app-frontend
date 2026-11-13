import { useCallback, useEffect, useState } from 'react'
import { TemplateEditor } from '@/components/interviews/TemplateEditor'
import { TemplateTiles } from '@/components/interviews/TemplateTiles'
import { ErrorAlert } from '@/components/panel/ErrorAlert'
import { FieldError } from '@/components/ui/field'
import { Skeleton } from '@/components/ui/skeleton'
import { api, ApiError } from '@/lib/api'
import {
  NEW_TEMPLATE_NAME,
  type InterviewTemplate,
  type InterviewTemplateDetails,
} from '@/panel/interviews'

type TemplatesTabProps = {
  editionId: number
  canEdit: boolean
}

function TemplatesTab({ editionId, canEdit }: TemplatesTabProps) {
  const path = `editions/${editionId}/interview-templates/`
  const [templates, setTemplates] = useState<InterviewTemplate[] | null>(null)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [newTemplateId, setNewTemplateId] = useState<number | null>(null)
  const [loadError, setLoadError] = useState('')
  const [error, setError] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    api<InterviewTemplate[]>(path)
      .then((data) => {
        setTemplates(data)
        setSelectedId(data[0]?.id ?? null)
      })
      .catch(() => setLoadError('Nie udało się wczytać szablonów rozmów.'))
  }, [path])

  const updateTemplate = useCallback(
    (templateId: number, changes: Partial<InterviewTemplate>) => {
      setTemplates(
        (current) =>
          current &&
          current.map((template) =>
            template.id === templateId ? { ...template, ...changes } : template,
          ),
      )
    },
    [],
  )

  const updateCount = useCallback(
    (count: number) => {
      if (selectedId !== null) {
        updateTemplate(selectedId, { question_count: count })
      }
    },
    [selectedId, updateTemplate],
  )

  async function addTemplate() {
    setError('')
    setIsAdding(true)
    try {
      const template = await api<InterviewTemplateDetails>(path, {
        method: 'POST',
        body: { name: NEW_TEMPLATE_NAME },
      })
      setTemplates(
        (current) =>
          current && [
            ...current,
            { id: template.id, name: template.name, question_count: 0 },
          ],
      )
      setSelectedId(template.id)
      setNewTemplateId(template.id)
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : 'Brak połączenia z serwerem. Spróbuj ponownie.',
      )
    }
    setIsAdding(false)
  }

  function removeTemplate(templateId: number) {
    const rest = (templates ?? []).filter(
      (template) => template.id !== templateId,
    )
    setTemplates(rest)
    setSelectedId(rest[0]?.id ?? null)
  }

  if (!templates) {
    return loadError ? (
      <ErrorAlert>{loadError}</ErrorAlert>
    ) : (
      <Skeleton className="h-40 w-full" />
    )
  }

  return (
    <div className="flex flex-col gap-5 md:gap-6">
      <TemplateTiles
        templates={templates}
        selectedId={selectedId}
        canEdit={canEdit}
        isAdding={isAdding}
        onSelect={setSelectedId}
        onAdd={addTemplate}
      />
      {error && <FieldError>{error}</FieldError>}
      {selectedId !== null && (
        <TemplateEditor
          key={selectedId}
          editionId={editionId}
          templateId={selectedId}
          canEdit={canEdit}
          isNew={selectedId === newTemplateId}
          onChange={(changes) => updateTemplate(selectedId, changes)}
          onCountChange={updateCount}
          onDelete={() => removeTemplate(selectedId)}
        />
      )}
    </div>
  )
}

export { TemplatesTab }

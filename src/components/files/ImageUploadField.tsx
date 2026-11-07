import { useState } from 'react'
import { ImagePicker } from '@/components/files/ImagePicker'
import { api, ApiError } from '@/lib/api'

type ImageUploadFieldProps<T> = {
  path: string
  fieldName: string
  label: string
  placeholder: string
  url: string | null
  canEdit: boolean
  className?: string
  onSaved: (data: T) => void | Promise<void>
}

function ImageUploadField<T>({
  path,
  fieldName,
  label,
  placeholder,
  url,
  canEdit,
  className,
  onSaved,
}: ImageUploadFieldProps<T>) {
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  async function save(body?: FormData) {
    setError('')
    setIsSaving(true)
    try {
      const data = await api<T>(path, {
        method: body ? 'POST' : 'DELETE',
        body,
      })
      await onSaved(data)
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : 'Brak połączenia z serwerem. Spróbuj ponownie.',
      )
    }
    setIsSaving(false)
  }

  function handleSelect(file: File) {
    const body = new FormData()
    body.append(fieldName, file)
    void save(body)
  }

  return (
    <ImagePicker
      label={label}
      placeholder={placeholder}
      url={url}
      disabled={!canEdit || isSaving}
      error={error}
      className={className}
      onSelect={handleSelect}
      onRemove={canEdit ? () => void save() : undefined}
    />
  )
}

export { ImageUploadField }

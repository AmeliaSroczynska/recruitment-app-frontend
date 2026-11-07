import { Camera, Trash2 } from 'lucide-react'
import { useRef, useState, type ChangeEvent } from 'react'
import { useAuth, type User } from '@/auth/AuthContext'
import { Button } from '@/components/ui/button'
import { api, ApiError } from '@/lib/api'
import { getAccept, getFileError } from '@/lib/files'

function ProfilePhotoActions() {
  const { user, setUser } = useAuth()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  async function save(body?: FormData) {
    setError('')
    setIsSaving(true)
    try {
      setUser(
        await api<User>('auth/me/photo/', {
          method: body ? 'POST' : 'DELETE',
          body,
        }),
      )
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : 'Brak połączenia z serwerem. Spróbuj ponownie.',
      )
    }
    setIsSaving(false)
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) {
      return
    }
    const fileError = getFileError(file, 'image')
    if (fileError) {
      setError(fileError)
      return
    }
    const body = new FormData()
    body.append('photo', file)
    void save(body)
  }

  const hasPhoto = Boolean(user?.photo_url)

  return (
    <div className="flex flex-col items-start gap-1.5">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isSaving}
          onClick={() => inputRef.current?.click()}
        >
          <Camera />
          {hasPhoto ? 'Zmień zdjęcie' : 'Dodaj zdjęcie'}
        </Button>
        {hasPhoto && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={isSaving}
            onClick={() => void save()}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 />
            Usuń
          </Button>
        )}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept={getAccept('image')}
        className="hidden"
        onChange={handleChange}
      />
    </div>
  )
}

export { ProfilePhotoActions }

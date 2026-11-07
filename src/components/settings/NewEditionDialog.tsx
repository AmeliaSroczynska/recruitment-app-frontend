import { useState, type FormEvent } from 'react'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth, type User } from '@/auth/AuthContext'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { api, ApiError } from '@/lib/api'
import type { Edition } from '@/panel/settings'

type NewEditionDialogProps = {
  editionId: number
}

function NewEditionDialog({ editionId }: NewEditionDialogProps) {
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      const edition = await api<Edition>(
        `editions/${editionId}/organization/editions/`,
        { method: 'POST', body: { name } },
      )
      setUser(await api<User>('auth/me/'))
      navigate(`/organization/${edition.id}/settings`)
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : 'Brak połączenia z serwerem. Spróbuj ponownie.',
      )
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            className="h-10 gap-1.5 rounded-[10px] border-dashed border-sand bg-transparent px-5 text-sm font-semibold text-ochre-dark shadow-none hover:bg-paper hover:text-ochre-dark"
          />
        }
      >
        <Plus />
        Nowa edycja
      </DialogTrigger>
      <DialogContent className="bg-card">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-semibold">
              Nowa edycja naboru
            </DialogTitle>
            <DialogDescription>
              Nowa edycja zaczyna się od zera: bez osób, formularzy, zadań i
              treści. Zostaniesz jej koordynatorem, a obecna edycja przestanie
              być aktywna.
            </DialogDescription>
          </DialogHeader>
          <Field className="gap-[7px]" data-invalid={Boolean(error)}>
            <FieldLabel htmlFor="edition-name" className="font-medium">
              Nazwa edycji
            </FieldLabel>
            <Input
              id="edition-name"
              autoFocus
              required
              maxLength={200}
              placeholder="np. Nabór wiosenny 2027"
              value={name}
              onChange={(event) => setName(event.target.value)}
              aria-invalid={Boolean(error)}
              className="h-10 rounded-[10px] border-border bg-card px-3 text-sm shadow-none"
            />
            {error && <FieldError>{error}</FieldError>}
          </Field>
          <DialogFooter>
            <DialogClose
              render={
                <Button variant="outline" className="h-10 rounded-[10px]" />
              }
            >
              Anuluj
            </DialogClose>
            <Button
              type="submit"
              disabled={!name.trim() || isSubmitting}
              className="h-10 rounded-[10px] font-semibold"
            >
              {isSubmitting ? 'Tworzenie...' : 'Utwórz edycję'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export { NewEditionDialog }

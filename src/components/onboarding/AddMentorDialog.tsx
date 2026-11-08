import { Plus } from 'lucide-react'
import { useState, type FormEvent } from 'react'
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
import type { Mentor } from '@/panel/onboarding'

const inputClassName =
  'h-10 rounded-[10px] border-border bg-card px-3 text-sm shadow-none'

type AddMentorDialogProps = {
  editionId: number
  onAdded: (mentor: Mentor) => void
}

function AddMentorDialog({ editionId, onAdded }: AddMentorDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleOpenChange(open: boolean) {
    setIsOpen(open)
    if (open) {
      setFirstName('')
      setLastName('')
      setError('')
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      onAdded(
        await api<Mentor>(`editions/${editionId}/mentors/`, {
          method: 'POST',
          body: { first_name: firstName, last_name: lastName },
        }),
      )
      setIsOpen(false)
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : 'Brak połączenia z serwerem. Spróbuj ponownie.',
      )
    }
    setIsSubmitting(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            variant="dashed"
            className="h-14 w-full rounded-xl text-[15px]"
          />
        }
      >
        <Plus />
        Dodaj mentora
      </DialogTrigger>
      <DialogContent className="bg-card">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-semibold">
              Dodaj mentora
            </DialogTitle>
            <DialogDescription>
              Zdjęcie, liczbę miejsc i opis uzupełnisz w profilu mentora.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field className="gap-[7px]">
              <FieldLabel htmlFor="mentor-first-name" className="font-medium">
                Imię
              </FieldLabel>
              <Input
                id="mentor-first-name"
                autoFocus
                required
                maxLength={150}
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                className={inputClassName}
              />
            </Field>
            <Field className="gap-[7px]">
              <FieldLabel htmlFor="mentor-last-name" className="font-medium">
                Nazwisko
              </FieldLabel>
              <Input
                id="mentor-last-name"
                required
                maxLength={150}
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                className={inputClassName}
              />
            </Field>
          </div>
          {error && <FieldError>{error}</FieldError>}
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
              disabled={!firstName.trim() || !lastName.trim() || isSubmitting}
              className="h-10 rounded-[10px] font-semibold"
            >
              {isSubmitting ? 'Dodawanie...' : 'Dodaj'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export { AddMentorDialog }

import { useState, type FormEvent } from 'react'
import { Plus } from 'lucide-react'
import { RoleSelect } from '@/components/settings/RoleSelect'
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
import type { Member } from '@/panel/settings'

type AddMemberDialogProps = {
  editionId: number
  onAdded: (member: Member) => void
}

function AddMemberDialog({ editionId, onAdded }: AddMemberDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('recruiter')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleOpenChange(open: boolean) {
    setIsOpen(open)
    if (open) {
      setEmail('')
      setRole('recruiter')
      setError('')
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      onAdded(
        await api<Member>(`editions/${editionId}/members/`, {
          method: 'POST',
          body: { email, role },
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
            variant="outline"
            className="h-12 w-full gap-1.5 rounded-xl border-dashed border-sand bg-transparent text-sm font-semibold text-ochre-dark shadow-none hover:bg-paper hover:text-ochre-dark"
          />
        }
      >
        <Plus />
        Dodaj osobę
      </DialogTrigger>
      <DialogContent className="bg-surface">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-semibold">
              Dodaj osobę
            </DialogTitle>
            <DialogDescription>
              Osoba zaloguje się tym adresem e-mail i zobaczy organizację na
              liście.
            </DialogDescription>
          </DialogHeader>
          <Field className="gap-[7px]" data-invalid={Boolean(error)}>
            <FieldLabel htmlFor="member-email" className="font-medium">
              E-mail
            </FieldLabel>
            <Input
              id="member-email"
              type="email"
              autoFocus
              required
              placeholder="imie@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={Boolean(error)}
              className="h-10 rounded-[10px] border-border bg-card px-3 text-sm shadow-none"
            />
          </Field>
          <Field className="gap-[7px]">
            <FieldLabel htmlFor="member-role" className="font-medium">
              Rola
            </FieldLabel>
            <RoleSelect
              id="member-role"
              value={role}
              onChange={setRole}
              className="h-10 md:w-full"
            />
          </Field>
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
              disabled={!email.trim() || isSubmitting}
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

export { AddMemberDialog }

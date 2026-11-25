import { startTransition, useState } from 'react'
import { Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth, type User } from '@/auth/AuthContext'
import { SettingsCard } from '@/components/settings/SettingsCard'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { api, ApiError } from '@/lib/api'
import { useEdition } from '@/panel/EditionContext'

function DeleteOrganizationCard() {
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const membership = useEdition()
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const isConfirmed = confirmation.trim() === membership.organization_name

  function handleOpenChange(open: boolean) {
    if (!open) {
      setConfirmation('')
      setError('')
    }
  }

  async function handleDelete() {
    setError('')
    setIsDeleting(true)
    try {
      await api(`editions/${membership.edition_id}/organization/`, {
        method: 'DELETE',
      })
      const user = await api<User>('auth/me/')
      startTransition(() => {
        navigate('/login/organization/organization', { replace: true })
        setUser(user)
      })
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : 'Brak połączenia z serwerem. Spróbuj ponownie.',
      )
      setIsDeleting(false)
    }
  }

  return (
    <SettingsCard title="Usuń organizację">
      <p className="mt-1 text-sm text-muted-foreground">
        Organizacja zniknie razem ze wszystkimi edycjami, osobami, zgłoszeniami,
        rozmowami, zadaniami i plikami. Tego nie da się cofnąć.
      </p>
      <AlertDialog onOpenChange={handleOpenChange}>
        <AlertDialogTrigger
          render={
            <Button
              variant="outline"
              className="mt-4 h-10 rounded-[10px] border-destructive/40 px-5 text-destructive shadow-none hover:bg-destructive/10 hover:text-destructive"
            />
          }
        >
          <Trash2 />
          Usuń organizację
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading font-semibold">
              Usunąć organizację „{membership.organization_name}”?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Znikną wszystkie edycje i ich dane, także te, w których nie masz
              roli. Tego nie da się cofnąć.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Field className="gap-[7px]" data-invalid={Boolean(error)}>
            <FieldLabel htmlFor="delete-organization-name">
              Wpisz nazwę organizacji, żeby potwierdzić
            </FieldLabel>
            <Input
              id="delete-organization-name"
              autoComplete="off"
              placeholder={membership.organization_name}
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              className="h-10 rounded-[10px] border-border bg-card px-3 text-sm shadow-none"
            />
            {error && <FieldError>{error}</FieldError>}
          </Field>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-10 rounded-[10px]">
              Anuluj
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={!isConfirmed || isDeleting}
              onClick={handleDelete}
              className="h-10 rounded-[10px] font-semibold"
            >
              {isDeleting ? 'Usuwanie...' : 'Usuń organizację'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SettingsCard>
  )
}

export { DeleteOrganizationCard }

import { startTransition, useState } from 'react'
import { Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth, type User } from '@/auth/AuthContext'
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
import { api, ApiError } from '@/lib/api'
import { useEdition } from '@/panel/EditionContext'

function DeleteEditionDialog() {
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const membership = useEdition()
  const [error, setError] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    setError('')
    setIsDeleting(true)
    try {
      await api(`editions/${membership.edition_id}/`, { method: 'DELETE' })
      const user = await api<User>('auth/me/')
      const next = user.memberships
        .filter(
          (item) => item.organization_slug === membership.organization_slug,
        )
        .sort((a, b) => b.edition_id - a.edition_id)[0]
      startTransition(() => {
        navigate(
          next
            ? `/organization/${next.edition_id}/settings`
            : '/login/organization/organization',
          { replace: true },
        )
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
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button
            variant="ghost"
            className="h-10 gap-1.5 rounded-[10px] px-3 text-sm text-muted-foreground hover:bg-paper hover:text-destructive"
          />
        }
      >
        <Trash2 />
        Usuń tę edycję
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-surface">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-heading font-semibold">
            Usunąć edycję „{membership.edition_name}”?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Znikną wszystkie dane tej edycji: osoby, zgłoszenia, rozmowy,
            formularze, zadania i treści. Tego nie da się cofnąć.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <AlertDialogFooter>
          <AlertDialogCancel className="h-10 rounded-[10px]">
            Anuluj
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isDeleting}
            onClick={handleDelete}
            className="h-10 rounded-[10px] font-semibold"
          >
            {isDeleting ? 'Usuwanie...' : 'Usuń edycję'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { DeleteEditionDialog }

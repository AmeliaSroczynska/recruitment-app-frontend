import { Trash2 } from 'lucide-react'
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

type DeleteApplicationDialogProps = {
  name: string
  onConfirm: () => void
}

function DeleteApplicationDialog({
  name,
  onConfirm,
}: DeleteApplicationDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Usuń zgłoszenie: ${name}`}
            className="relative z-10 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          />
        }
      >
        <Trash2 />
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-card">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-heading font-semibold">
            Usunąć zgłoszenie?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Zgłoszenie osoby {name} zniknie razem z odpowiedziami, ocenami,
            notatkami i rozmowami. Jeśli ta osoba nie ma innych zgłoszeń,
            usuniemy też jej konto. Tego nie da się cofnąć.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="h-10 rounded-[10px]">
            Anuluj
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={onConfirm}
            className="h-10 rounded-[10px] font-semibold"
          >
            Usuń
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { DeleteApplicationDialog }

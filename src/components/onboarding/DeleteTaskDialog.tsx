import { X } from 'lucide-react'
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

type DeleteTaskDialogProps = {
  onConfirm: () => void
}

function DeleteTaskDialog({ onConfirm }: DeleteTaskDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Usuń zadanie"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          />
        }
      >
        <X />
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-card">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-heading font-semibold">
            Usunąć zadanie?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Zadanie zniknie na stałe, także u przyjętych kandydatów, razem z ich
            odhaczeniami.
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

export { DeleteTaskDialog }

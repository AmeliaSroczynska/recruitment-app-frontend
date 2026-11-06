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

type DeleteQuestionDialogProps = {
  onConfirm: () => void
}

function DeleteQuestionDialog({ onConfirm }: DeleteQuestionDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Usuń pytanie"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          />
        }
      >
        <X />
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-surface">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-heading font-semibold">
            Usunąć pytanie?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Pytanie zniknie z formularza. Odpowiedzi, które kandydaci już
            wysłali, zostaną w ich zgłoszeniach.
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

export { DeleteQuestionDialog }

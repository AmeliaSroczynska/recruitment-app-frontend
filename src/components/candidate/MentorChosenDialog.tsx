import { Check } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { MentorSummary } from '@/panel/onboarding'

type MentorChosenDialogProps = {
  mentor: MentorSummary | null
  onClose: () => void
}

function MentorChosenDialog({ mentor, onClose }: MentorChosenDialogProps) {
  return (
    <AlertDialog
      open={Boolean(mentor)}
      onOpenChange={(open) => !open && onClose()}
    >
      <AlertDialogContent size="sm" className="bg-card data-[size=sm]:max-w-sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="size-12 rounded-full bg-sage-light/60 text-olive-dark">
            <Check className="size-5" />
          </AlertDialogMedia>
          <AlertDialogTitle className="font-heading text-lg font-semibold">
            Wybrano mentora: {mentor?.first_name} {mentor?.last_name}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {mentor?.first_name} skontaktuje się z Tobą wkrótce. Do tego czasu
            nie musisz nic robić, po prostu czekaj na wiadomość.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="group-data-[size=sm]/alert-dialog-content:grid-cols-1">
          <AlertDialogAction
            onClick={onClose}
            className="h-10 w-full rounded-[10px] font-semibold"
          >
            Rozumiem
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { MentorChosenDialog }

import { UserRoundCheck } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { MentorSummary } from '@/panel/onboarding'

type ConfirmMentorDialogProps = {
  mentor: MentorSummary | null
  onCancel: () => void
  onConfirm: (mentor: MentorSummary) => void
}

function ConfirmMentorDialog({
  mentor,
  onCancel,
  onConfirm,
}: ConfirmMentorDialogProps) {
  return (
    <AlertDialog
      open={Boolean(mentor)}
      onOpenChange={(open) => !open && onCancel()}
    >
      <AlertDialogContent size="sm" className="bg-card data-[size=sm]:max-w-sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="size-12 rounded-full bg-secondary text-olive-dark">
            <UserRoundCheck className="size-5" />
          </AlertDialogMedia>
          <AlertDialogTitle className="font-heading text-lg font-semibold">
            Wybrać mentora: {mentor?.first_name} {mentor?.last_name}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Tego wyboru nie da się cofnąć. Jeśli później zechcesz zmienić
            mentora, trzeba będzie skontaktować się z organizacją.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="h-10 rounded-[10px]">
            Anuluj
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => mentor && onConfirm(mentor)}
            className="h-10 rounded-[10px] font-semibold"
          >
            Wybierz
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { ConfirmMentorDialog }

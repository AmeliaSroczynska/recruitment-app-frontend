import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

const CONFIRMATIONS = {
  accepted: {
    title: 'Przyjąć kandydata?',
    description: (name: string) =>
      `${name} dostanie mail powitalny z linkiem do wdrożenia. Tego maila nie da się cofnąć.`,
    action: 'Przyjmij i wyślij mail',
  },
  interview: {
    title: 'Czy jesteś pewny?',
    description: (name: string) =>
      `${name} dostanie mail z zaproszeniem na rozmowę. Po zalogowaniu zaznaczy w kalendarzu, kiedy może. Tego maila nie da się cofnąć.`,
    action: 'Zaproś i wyślij mail',
  },
}

type ConfirmedStatus = keyof typeof CONFIRMATIONS

type AcceptApplicationDialogProps = {
  status: ConfirmedStatus
  open: boolean
  name: string
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

function AcceptApplicationDialog({
  status,
  open,
  name,
  onOpenChange,
  onConfirm,
}: AcceptApplicationDialogProps) {
  const confirmation = CONFIRMATIONS[status]

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-card">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-heading font-semibold">
            {confirmation.title}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {confirmation.description(name)}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="h-10 rounded-[10px]">
            Anuluj
          </AlertDialogCancel>
          <AlertDialogAction
            variant="accent"
            onClick={onConfirm}
            className="h-10 rounded-[10px] font-semibold"
          >
            {confirmation.action}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { AcceptApplicationDialog }
export type { ConfirmedStatus }

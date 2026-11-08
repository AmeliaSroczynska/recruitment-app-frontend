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

type AcceptApplicationDialogProps = {
  open: boolean
  name: string
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

function AcceptApplicationDialog({
  open,
  name,
  onOpenChange,
  onConfirm,
}: AcceptApplicationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-card">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-heading font-semibold">
            Przyjąć kandydata?
          </AlertDialogTitle>
          <AlertDialogDescription>
            {name} dostanie mail powitalny z linkiem do wdrożenia. Tego maila
            nie da się cofnąć.
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
            Przyjmij i wyślij mail
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { AcceptApplicationDialog }

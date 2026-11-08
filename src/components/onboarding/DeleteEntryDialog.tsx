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

type DeleteEntryDialogProps = {
  label: string
  title: string
  description: string
  showLabel?: boolean
  onConfirm: () => void
}

function DeleteEntryDialog({
  label,
  title,
  description,
  showLabel,
  onConfirm,
}: DeleteEntryDialogProps) {
  return (
    <AlertDialog>
      {showLabel ? (
        <AlertDialogTrigger
          render={
            <Button
              type="button"
              variant="outline"
              className="h-9 rounded-[10px] bg-card px-4 md:h-10"
            />
          }
        >
          {label}
        </AlertDialogTrigger>
      ) : (
        <AlertDialogTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={label}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            />
          }
        >
          <X />
        </AlertDialogTrigger>
      )}
      <AlertDialogContent className="bg-card">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-heading font-semibold">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
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

export { DeleteEntryDialog }

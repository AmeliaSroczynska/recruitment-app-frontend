import { CircleAlert } from 'lucide-react'
import type { ReactNode } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { cn } from '@/lib/utils'

type ErrorAlertProps = {
  className?: string
  children: ReactNode
}

function ErrorAlert({ className, children }: ErrorAlertProps) {
  return (
    <Alert
      variant="destructive"
      className={cn('rounded-[10px] border-destructive/30', className)}
    >
      <CircleAlert />
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  )
}

export { ErrorAlert }

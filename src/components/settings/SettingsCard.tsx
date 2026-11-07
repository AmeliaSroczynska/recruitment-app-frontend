import type { ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type SettingsCardProps = {
  title?: string
  className?: string
  children: ReactNode
}

function SettingsCard({ title, className, children }: SettingsCardProps) {
  return (
    <Card
      className={cn(
        'gap-0 rounded-2xl bg-card py-5 shadow-[0_1px_2px_rgba(34,32,27,0.05)] ring-border md:py-6',
        className,
      )}
    >
      <CardContent className="px-5 md:px-6">
        {title && (
          <h2 className="font-heading text-base font-semibold text-foreground">
            {title}
          </h2>
        )}
        {children}
      </CardContent>
    </Card>
  )
}

export { SettingsCard }

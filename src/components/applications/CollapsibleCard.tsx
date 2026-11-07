import { ChevronDown } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

type CollapsibleCardProps = {
  title: string
  children: ReactNode
}

function CollapsibleCard({ title, children }: CollapsibleCardProps) {
  return (
    <Card className="gap-0 rounded-2xl bg-card py-5 shadow-card ring-border md:py-6">
      <CardContent className="px-5 md:px-6">
        <Collapsible defaultOpen>
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-heading text-base font-semibold text-foreground">
              {title}
            </h2>
            <CollapsibleTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Zwiń lub rozwiń: ${title}`}
                  className="group text-muted-foreground hover:bg-muted aria-expanded:bg-transparent"
                />
              }
            >
              <ChevronDown className="transition-transform group-data-panel-open:rotate-180" />
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>{children}</CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}

export { CollapsibleCard }

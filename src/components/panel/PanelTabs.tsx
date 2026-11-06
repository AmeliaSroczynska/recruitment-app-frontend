import type { ComponentProps, ReactNode } from 'react'
import { TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

function PanelTabsList({ children }: { children: ReactNode }) {
  return (
    <div className="-mx-[18px] border-b border-border px-[18px] md:-mx-8 md:px-8">
      <TabsList
        variant="line"
        className="gap-5 p-0 group-data-horizontal/tabs:h-10"
      >
        {children}
      </TabsList>
    </div>
  )
}

function PanelTabsTrigger({
  className,
  ...props
}: ComponentProps<typeof TabsTrigger>) {
  return (
    <TabsTrigger
      className={cn(
        'h-full flex-none px-0 text-sm font-normal text-muted-foreground data-active:font-medium data-active:text-foreground after:bottom-[-2px]! after:bg-ochre!',
        className,
      )}
      {...props}
    />
  )
}

export { PanelTabsList, PanelTabsTrigger }

import type { ReactNode } from 'react'

type StatisticsSectionProps = {
  title: string
  children: ReactNode
}

function StatisticsSection({ title, children }: StatisticsSectionProps) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm text-muted-foreground">{title}</h2>
      {children}
    </section>
  )
}

export { StatisticsSection }

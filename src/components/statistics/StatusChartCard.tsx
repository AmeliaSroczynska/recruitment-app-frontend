import { Pie, PieChart } from 'recharts'
import { Card, CardContent } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import type { StatusStatistics } from '@/panel/statistics'

const CHART_CONFIG = {
  new: { label: 'Nowe zgłoszenie', color: 'var(--chart-1)' },
  interview: { label: 'Rozmowa', color: 'var(--chart-2)' },
  to_decide: { label: 'Do decyzji', color: 'var(--chart-3)' },
  accepted: { label: 'Przyjęty', color: 'var(--chart-4)' },
  rejected: { label: 'Odrzucony', color: 'var(--chart-5)' },
} satisfies ChartConfig

type StatusChartCardProps = {
  statuses: StatusStatistics[]
}

function StatusChartCard({ statuses }: StatusChartCardProps) {
  const total = statuses.reduce((sum, status) => sum + status.count, 0)
  const data = statuses
    .filter((status) => status.count > 0)
    .map((status) => ({
      name: status.name,
      count: status.count,
      fill: `var(--color-${status.name})`,
    }))

  return (
    <Card className="gap-0 rounded-2xl bg-card py-5 shadow-card ring-border md:py-6">
      <CardContent className="flex flex-col gap-4 px-5 md:px-6">
        <h3 className="font-heading text-base font-semibold text-foreground">
          Zgłoszenia według statusu
        </h3>
        {total === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Brak zgłoszeń w tym okresie.
          </p>
        ) : (
          <div className="flex flex-col items-center gap-5 md:flex-row md:gap-10">
            <ChartContainer
              config={CHART_CONFIG}
              className="aspect-square w-full max-w-[200px] shrink-0"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent nameKey="name" hideLabel />}
                />
                <Pie
                  data={data}
                  dataKey="count"
                  nameKey="name"
                  innerRadius="58%"
                  startAngle={90}
                  endAngle={-270}
                  strokeWidth={2}
                />
              </PieChart>
            </ChartContainer>
            <ul className="flex w-full flex-col gap-3">
              {statuses.map((status) => (
                <li
                  key={status.name}
                  className="flex items-center gap-3 text-sm"
                >
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: CHART_CONFIG[status.name].color }}
                    aria-hidden="true"
                  />
                  <span className="flex-1 text-foreground">{status.label}</span>
                  <span className="text-muted-foreground tabular-nums">
                    {status.count} · {status.percent}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export { StatusChartCard }

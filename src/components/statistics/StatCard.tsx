import { Card, CardContent } from '@/components/ui/card'

type StatCardProps = {
  label: string
  value: number | string | null
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <Card className="gap-0 rounded-2xl bg-card py-4 shadow-card ring-border md:py-5">
      <CardContent className="flex flex-col gap-1 px-4 md:px-5">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="font-heading text-[28px] leading-tight font-bold text-foreground">
          {value ?? 'x'}
        </span>
      </CardContent>
    </Card>
  )
}

export { StatCard }

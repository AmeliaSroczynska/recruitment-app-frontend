import { Lock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const FIXED_FIELDS = ['Imię', 'Nazwisko', 'Adres e-mail']

function RequiredBadge({ required = true }: { required?: boolean }) {
  return (
    <Badge
      className={cn(
        required
          ? 'bg-sand/50 text-ochre-dark'
          : 'bg-muted text-muted-foreground',
      )}
    >
      {required ? 'obowiązkowe' : 'opcjonalne'}
    </Badge>
  )
}

function FixedFields() {
  return (
    <Card className="gap-0 bg-paper p-4 shadow-none ring-border md:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
          <Lock className="size-4 text-muted-foreground" />
          Stałe pola
        </h2>
        <span className="text-xs text-muted-foreground">
          zawsze w formularzu
        </span>
      </div>
      <ul className="mt-3 flex flex-col gap-3">
        {FIXED_FIELDS.map((field) => (
          <li
            key={field}
            className="flex h-10 items-center justify-between rounded-[10px] border border-border bg-card px-3 text-sm"
          >
            {field}
            <RequiredBadge />
          </li>
        ))}
      </ul>
    </Card>
  )
}

export { FixedFields, RequiredBadge }

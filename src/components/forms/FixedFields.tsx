import { Lock } from 'lucide-react'

const FIXED_FIELDS = ['Imię', 'Nazwisko', 'Adres e-mail']

function RequiredBadge() {
  return (
    <span className="rounded-full bg-sand/50 px-2 py-0.5 text-xs font-medium text-ochre-dark">
      obowiązkowe
    </span>
  )
}

function FixedFields() {
  return (
    <section className="rounded-xl border border-border bg-paper p-4 md:p-6">
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
            className="flex h-10 items-center justify-between rounded-[10px] border border-border bg-surface px-3 text-sm"
          >
            {field}
            <RequiredBadge />
          </li>
        ))}
      </ul>
    </section>
  )
}

export { FixedFields, RequiredBadge }

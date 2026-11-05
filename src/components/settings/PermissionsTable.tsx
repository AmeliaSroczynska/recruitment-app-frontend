import { Check, Eye } from 'lucide-react'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ROLES, ROLE_LABELS } from '@/panel/roles'

type Access = 'edit' | 'view' | 'none'

const PERMISSIONS: [string, Access, Access, Access, Access][] = [
  ['Karta kandydata', 'edit', 'edit', 'edit', 'view'],
  ['Zgłoszenia', 'edit', 'edit', 'view', 'view'],
  ['Statusy', 'edit', 'edit', 'none', 'view'],
  ['Formularz', 'edit', 'edit', 'none', 'view'],
  ['Rozmowy', 'edit', 'edit', 'none', 'view'],
  ['Kalendarz', 'edit', 'edit', 'none', 'view'],
  ['Zadania wdrażające', 'edit', 'none', 'edit', 'view'],
  ['Baza wiedzy', 'edit', 'none', 'edit', 'view'],
  ['FAQ', 'edit', 'none', 'edit', 'view'],
  ['Mentorzy', 'edit', 'none', 'edit', 'view'],
  ['Statystyki', 'view', 'view', 'view', 'view'],
  ['Ustawienia', 'edit', 'none', 'none', 'view'],
]

const ACCESS_LABELS: Record<Access, string> = {
  edit: 'edycja',
  view: 'tylko podgląd',
  none: 'brak',
}

function AccessIcon({ access }: { access: Access }) {
  if (access === 'none') {
    return (
      <span className="text-muted-foreground" aria-label={ACCESS_LABELS.none}>
        -
      </span>
    )
  }
  const Icon = access === 'edit' ? Check : Eye
  return (
    <span
      aria-label={ACCESS_LABELS[access]}
      className="inline-flex size-6 items-center justify-center rounded-md bg-paper"
    >
      <Icon
        className={
          access === 'edit'
            ? 'size-3.5 text-ochre-dark'
            : 'size-3.5 text-muted-foreground'
        }
      />
    </span>
  )
}

function PermissionsTable() {
  return (
    <Card className="gap-0 overflow-hidden rounded-2xl bg-surface py-0 shadow-[0_1px_2px_rgba(34,32,27,0.05)] ring-border">
      <Table className="min-w-[560px]">
        <TableHeader className="bg-paper">
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="h-11 px-5 font-heading text-sm font-semibold text-foreground">
              Uprawnienie
            </TableHead>
            {ROLES.map((role) => (
              <TableHead
                key={role}
                className="h-11 text-center text-sm font-normal text-muted-foreground"
              >
                {ROLE_LABELS[role]}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {PERMISSIONS.map(([name, ...accesses]) => (
            <TableRow key={name} className="border-border hover:bg-transparent">
              <TableCell className="h-11 px-5 text-sm text-foreground">
                {name}
              </TableCell>
              {accesses.map((access, index) => (
                <TableCell key={ROLES[index]} className="text-center">
                  <AccessIcon access={access} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex flex-wrap items-center gap-4 border-t border-border px-5 py-3 text-xs text-muted-foreground">
        {(['edit', 'view', 'none'] as const).map((access) => (
          <span key={access} className="flex items-center gap-1.5">
            <AccessIcon access={access} />
            {ACCESS_LABELS[access]}
          </span>
        ))}
      </div>
    </Card>
  )
}

export { PermissionsTable }

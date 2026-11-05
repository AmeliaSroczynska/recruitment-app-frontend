import { SettingsCard } from '@/components/settings/SettingsCard'
import { ROLES, ROLE_LABELS } from '@/panel/roles'

const ROLE_DESCRIPTIONS: Record<string, string> = {
  coordinator: 'Wszystkie zakładki, w tym Ustawienia i uprawnienia.',
  recruiter: 'Edycja zakładek rekrutacyjnych, wdrożenie tylko do podglądu.',
  mentor: 'Pracuje w zakładkach wdrożenia, rekrutację widzi w wąskim zakresie.',
  observer: 'Podgląd zakładek i pełne Statystyki, bez edycji i ocen.',
}

function RolesCard() {
  return (
    <SettingsCard title="Role w organizacji">
      <dl className="mt-3 divide-y divide-border border-t border-border">
        {ROLES.map((role) => (
          <div
            key={role}
            className="flex flex-col gap-1 py-3 md:flex-row md:items-center md:gap-0"
          >
            <dt className="text-sm font-medium text-foreground md:w-36 md:shrink-0">
              {ROLE_LABELS[role]}
            </dt>
            <dd className="text-sm text-muted-foreground">
              {ROLE_DESCRIPTIONS[role]}
            </dd>
          </div>
        ))}
      </dl>
    </SettingsCard>
  )
}

export { RolesCard }

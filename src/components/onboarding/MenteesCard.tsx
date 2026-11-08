import { Link } from 'react-router-dom'
import { SettingsCard } from '@/components/settings/SettingsCard'
import type { Mentee } from '@/panel/onboarding'
import { getDisplayName } from '@/panel/user'

type MenteesCardProps = {
  editionId: number
  mentees: Mentee[]
}

function MenteesCard({ editionId, mentees }: MenteesCardProps) {
  return (
    <SettingsCard title="Wybrali tego mentora">
      {mentees.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          Nikt jeszcze nie wybrał tego mentora.
        </p>
      ) : (
        <ul className="mt-4 flex flex-col gap-2">
          {mentees.map((mentee) => (
            <li key={mentee.id}>
              <Link
                to={`/organization/${editionId}/applications/${mentee.id}`}
                className="block truncate rounded-[10px] border border-border px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-secondary"
              >
                {getDisplayName(mentee)}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </SettingsCard>
  )
}

export { MenteesCard }

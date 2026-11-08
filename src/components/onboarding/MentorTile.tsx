import { Link } from 'react-router-dom'
import { MentorPhoto } from '@/components/onboarding/MentorPhoto'
import type { Mentor } from '@/panel/onboarding'

type MentorTileProps = {
  mentor: Mentor
  to: string
}

function MentorTile({ mentor, to }: MentorTileProps) {
  return (
    <Link
      to={to}
      className="block overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-colors hover:border-sand"
    >
      <MentorPhoto mentor={mentor} />
      <div className="border-t border-border px-4 py-3.5">
        <p className="truncate text-sm font-semibold text-foreground">
          {mentor.first_name} {mentor.last_name}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {mentor.taken} z {mentor.capacity} miejsc zajętych
        </p>
      </div>
    </Link>
  )
}

export { MentorTile }

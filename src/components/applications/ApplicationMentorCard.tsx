import { Link } from 'react-router-dom'
import { CollapsibleCard } from '@/components/applications/CollapsibleCard'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useEdition } from '@/panel/EditionContext'
import type { MentorSummary } from '@/panel/onboarding'
import { canSeeOnboarding } from '@/panel/roles'

type ApplicationMentorCardProps = {
  editionId: number
  mentor: MentorSummary | null
}

function ApplicationMentorCard({
  editionId,
  mentor,
}: ApplicationMentorCardProps) {
  const membership = useEdition()

  if (!mentor) {
    return (
      <CollapsibleCard title="Mentor opiekujący się osobą">
        <p className="mt-4 text-sm text-muted-foreground">
          Kandydat nie wybrał jeszcze mentora.
        </p>
      </CollapsibleCard>
    )
  }

  const content = (
    <>
      <Avatar className="after:border-0">
        {mentor.photo_url && <AvatarImage src={mentor.photo_url} alt="" />}
        <AvatarFallback className="bg-sage-light text-xs font-medium text-foreground">
          {`${mentor.first_name.charAt(0)}${mentor.last_name.charAt(0)}`.toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <span className="truncate text-sm font-medium text-foreground">
        {mentor.first_name} {mentor.last_name}
      </span>
    </>
  )

  return (
    <CollapsibleCard title="Mentor opiekujący się osobą">
      {canSeeOnboarding(membership.role) ? (
        <Link
          to={`/organization/${editionId}/mentors/${mentor.id}`}
          className="mt-4 flex items-center gap-3 rounded-[10px] bg-secondary px-3 py-3 transition-colors hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)]"
        >
          {content}
        </Link>
      ) : (
        <div className="mt-4 flex items-center gap-3 rounded-[10px] bg-secondary px-3 py-3">
          {content}
        </div>
      )}
    </CollapsibleCard>
  )
}

export { ApplicationMentorCard }

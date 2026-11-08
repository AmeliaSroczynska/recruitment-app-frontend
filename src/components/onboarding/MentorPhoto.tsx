import { UserRound } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MentorSummary } from '@/panel/onboarding'

type MentorPhotoProps = {
  mentor: MentorSummary
  className?: string
}

function MentorPhoto({ mentor, className }: MentorPhotoProps) {
  return (
    <div
      className={cn(
        'flex aspect-square w-full items-center justify-center overflow-hidden bg-secondary text-muted-foreground',
        className,
      )}
    >
      {mentor.photo_url ? (
        <img src={mentor.photo_url} alt="" className="size-full object-cover" />
      ) : (
        <UserRound className="size-7" strokeWidth={1.5} />
      )}
    </div>
  )
}

export { MentorPhoto }

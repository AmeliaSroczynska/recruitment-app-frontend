import { Star } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { StatusBadge } from '@/components/applications/StatusBadge'
import { UserAvatar } from '@/components/panel/UserAvatar'
import { Card } from '@/components/ui/card'
import {
  AVATAR_COLORS,
  formatRating,
  type ApplicationListItem,
} from '@/panel/applications'
import { getDisplayName } from '@/panel/user'

type ApplicationCardsProps = {
  applications: ApplicationListItem[]
}

function ApplicationCards({ applications }: ApplicationCardsProps) {
  const { search } = useLocation()

  return (
    <ul className="flex flex-col gap-3">
      {applications.map((application, index) => {
        const rating = formatRating(application)
        return (
          <li key={application.id}>
            <Link
              to={`${application.id}`}
              state={{ search }}
              className="group/link block rounded-2xl"
            >
              <Card className="gap-0 rounded-2xl p-4 shadow-card ring-border transition-colors group-hover/link:bg-paper/60">
                <div className="flex items-center gap-3">
                  <UserAvatar
                    user={application}
                    className="size-10"
                    fallbackClassName={
                      AVATAR_COLORS[index % AVATAR_COLORS.length]
                    }
                  />
                  <p className="min-w-0 flex-1 truncate text-[15px] font-semibold text-foreground">
                    {getDisplayName(application)}
                  </p>
                  <StatusBadge
                    status={application.status}
                    className="h-6 px-2.5"
                  />
                </div>
                <p className="mt-3 flex items-center gap-1 text-[13px] text-muted-foreground">
                  {rating ? (
                    <>
                      <Star className="size-3.5 fill-current" />
                      {rating}
                    </>
                  ) : (
                    'bez oceny'
                  )}
                </p>
              </Card>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export { ApplicationCards }

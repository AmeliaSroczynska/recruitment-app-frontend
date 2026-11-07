import { NavLink } from 'react-router-dom'
import { CandidateUserMenu } from '@/components/candidate/CandidateUserMenu'
import { CANDIDATE_NAV } from '@/components/candidate/menu'
import { OrganizationAvatar } from '@/components/panel/OrganizationAvatar'
import { cn } from '@/lib/utils'
import { useCandidateApplication } from '@/panel/candidate'

function CandidateHeader() {
  const application = useCandidateApplication()

  return (
    <header className="sticky top-0 z-20 hidden h-16 grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-border bg-card px-7 md:grid">
      <div className="flex min-w-0 items-center gap-2.5">
        <OrganizationAvatar
          name={application.organization_name}
          logoUrl={application.organization_logo_url}
        />
        <span className="truncate font-heading text-lg font-extrabold tracking-[-0.3px] text-foreground">
          {application.organization_name}
        </span>
      </div>
      <nav className="flex gap-1 rounded-xl bg-secondary p-1">
        {CANDIDATE_NAV.map((item) => (
          <NavLink
            key={item.path}
            to={`/candidate/${application.edition_id}${item.path && `/${item.path}`}`}
            end
            className={({ isActive }) =>
              cn(
                'flex h-9 items-center gap-2 rounded-[9px] px-3.5 text-sm font-medium whitespace-nowrap transition-colors',
                isActive
                  ? 'bg-olive text-surface'
                  : 'text-muted-foreground hover:text-foreground',
              )
            }
          >
            <item.icon className="size-4" strokeWidth={1.75} />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="flex justify-end">
        <CandidateUserMenu showName />
      </div>
    </header>
  )
}

export { CandidateHeader }

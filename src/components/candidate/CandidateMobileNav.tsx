import { NavLink } from 'react-router-dom'
import { CANDIDATE_NAV } from '@/components/candidate/menu'
import { cn } from '@/lib/utils'
import { useCandidateApplication } from '@/panel/candidate'

function CandidateMobileNav() {
  const application = useCandidateApplication()
  const [first, home, last] = CANDIDATE_NAV

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-3 items-end rounded-t-[28px] border-t border-border bg-card pt-3.5 pb-[max(14px,env(safe-area-inset-bottom))] md:hidden">
      {[first, home, last].map((item) => (
        <NavLink
          key={item.path}
          to={`/candidate/${application.edition_id}${item.path && `/${item.path}`}`}
          end
          aria-label={item === home ? item.label : undefined}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center gap-1 text-xs font-medium',
              isActive ? 'text-olive' : 'text-stone',
            )
          }
        >
          {item === home ? (
            <span className="-mt-12 flex size-14 items-center justify-center rounded-full bg-olive text-surface shadow-[0_2px_6px_rgba(34,32,27,0.15)] ring-4 ring-background">
              <item.icon className="size-6" strokeWidth={1.75} />
            </span>
          ) : (
            <>
              <item.icon className="size-5" strokeWidth={1.75} />
              {item.shortLabel}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

export { CandidateMobileNav }

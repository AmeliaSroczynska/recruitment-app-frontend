import { NavLink } from 'react-router-dom'
import { MOBILE_NAV } from '@/components/panel/menu'
import { cn } from '@/lib/utils'
import { useEdition, useSection } from '@/panel/EditionContext'

function PanelMobileNav() {
  const membership = useEdition()
  const section = useSection()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t border-border bg-surface pt-3.5 pb-[max(14px,env(safe-area-inset-bottom))] md:hidden">
      {MOBILE_NAV.map((item) => {
        const isActive = item.matches.includes(section)
        return (
          <NavLink
            key={item.label}
            to={`/organization/${membership.edition_id}/${item.path}`}
            end
            className={cn(
              'flex flex-col items-center gap-[3px] text-[10.5px] leading-[15.2px] font-medium',
              isActive ? 'text-olive' : 'text-stone',
            )}
          >
            <span
              className={cn(
                'flex h-7 w-11 items-center justify-center rounded-full',
                isActive && 'bg-moss-light',
              )}
            >
              <item.icon className="size-5" strokeWidth={1.75} />
            </span>
            {item.label}
          </NavLink>
        )
      })}
    </nav>
  )
}

export { PanelMobileNav }

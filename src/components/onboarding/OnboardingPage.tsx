import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { PanelPage } from '@/components/panel/PanelPage'
import { cn } from '@/lib/utils'
import { useEdition } from '@/panel/EditionContext'
import { ONBOARDING_SECTIONS } from '@/panel/onboarding'

type OnboardingPageProps = {
  title: string
  children?: ReactNode
}

function OnboardingPage({ title, children }: OnboardingPageProps) {
  const membership = useEdition()

  return (
    <PanelPage title={title}>
      <nav className="-mx-[18px] mb-5 flex gap-5 border-b border-border px-[18px] md:hidden">
        {ONBOARDING_SECTIONS.map((section) => (
          <NavLink
            key={section.path}
            to={`/organization/${membership.edition_id}/${section.path}`}
            className={({ isActive }) =>
              cn(
                'relative flex h-10 items-center text-sm text-muted-foreground',
                isActive &&
                  'font-medium text-foreground after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-ochre',
              )
            }
          >
            {section.label}
          </NavLink>
        ))}
      </nav>
      {children}
    </PanelPage>
  )
}

export { OnboardingPage }

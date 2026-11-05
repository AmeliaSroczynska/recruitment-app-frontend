import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'
import { UserAvatar } from '@/components/panel/UserAvatar'
import { useEdition } from '@/panel/EditionContext'

type PanelPageProps = {
  title: string
  children?: ReactNode
}

function PanelPage({ title, children }: PanelPageProps) {
  const { user } = useAuth()
  const membership = useEdition()

  return (
    <div className="px-[18px] pt-5 pb-28 md:px-8 md:pt-7 md:pb-10">
      <header className="flex items-center justify-between gap-4">
        <h1 className="font-heading text-[28px] leading-tight font-extrabold tracking-[-0.3px] text-foreground md:text-[34px]">
          {title}
        </h1>
        {user && (
          <Link
            to={`/organization/${membership.edition_id}/more`}
            className="md:hidden"
          >
            <UserAvatar user={user} className="size-10" />
          </Link>
        )}
      </header>
      <div className="mt-5 md:mt-6">{children}</div>
    </div>
  )
}

export { PanelPage }

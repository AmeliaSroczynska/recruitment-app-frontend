import type { ReactNode } from 'react'
import { CandidateUserMenu } from '@/components/candidate/CandidateUserMenu'

type CandidatePageProps = {
  title: string
  children?: ReactNode
}

function CandidatePage({ title, children }: CandidatePageProps) {
  return (
    <div className="mx-auto w-full max-w-[1136px] px-[18px] pt-5 pb-32 md:px-8 md:pt-7 md:pb-12">
      <header className="flex items-center justify-between gap-4">
        <h1 className="font-heading text-[28px] leading-tight font-extrabold tracking-[-0.3px] text-foreground md:text-[34px]">
          {title}
        </h1>
        <div className="md:hidden">
          <CandidateUserMenu />
        </div>
      </header>
      <div className="mt-5 md:mt-6">{children}</div>
    </div>
  )
}

export { CandidatePage }

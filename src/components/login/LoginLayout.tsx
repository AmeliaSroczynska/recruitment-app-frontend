import type { ReactNode } from 'react'
import { LoginArt, MobileLoginHeader } from '@/components/login/LoginArt'

type LoginLayoutProps = {
  artTitle: string
  artDescription: string
  mobileTitle: string
  mobileDescription: string
  mirrored?: boolean
  children: ReactNode
}

function LoginLayout({
  artTitle,
  artDescription,
  mobileTitle,
  mobileDescription,
  mirrored = false,
  children,
}: LoginLayoutProps) {
  return (
    <div className="flex min-h-svh flex-col bg-olive lg:flex-row lg:bg-background">
      <LoginArt
        title={artTitle}
        description={artDescription}
        mirrored={mirrored}
      />
      <MobileLoginHeader
        title={mobileTitle}
        description={mobileDescription}
        mirrored={mirrored}
      />
      <main className="flex flex-1 flex-col rounded-t-[30px] bg-background px-[22px] pt-[25px] pb-10 lg:items-center lg:justify-center lg:rounded-none lg:p-10">
        <div className="w-full lg:max-w-[360px]">{children}</div>
      </main>
    </div>
  )
}

export { LoginLayout }

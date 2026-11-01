import { cn } from '@/lib/utils'

type LoginArtProps = {
  title: string
  description: string
  mirrored?: boolean
}

function LoginArt({ title, description, mirrored = false }: LoginArtProps) {
  return (
    <aside className="relative hidden w-[51.2%] shrink-0 overflow-hidden bg-olive lg:block">
      <div
        className={cn(
          'absolute -bottom-[170px] size-[760px] rounded-full bg-olive-dark',
          mirrored ? '-right-[410px]' : '-left-[170px]',
        )}
      />
      <div
        className={cn(
          'absolute -bottom-[70px] size-80 rounded-full bg-sage opacity-55',
          mirrored ? '-right-[70px]' : '-left-[70px]',
        )}
      />
      <div
        className={cn(
          'absolute bottom-[150px] size-24 rounded-full bg-ochre opacity-90',
          mirrored ? 'left-[60px]' : 'right-[60px]',
        )}
      />
      <div className="relative px-[86px] pt-[92px]">
        <h1 className="max-w-[561px] font-heading text-[63px] leading-[66.5px] font-extrabold tracking-[-1.3px] text-surface">
          {title}
        </h1>
        <p className="mt-[12px] max-w-[441px] text-[17px] leading-[24.7px] text-sage-light">
          {description}
        </p>
      </div>
    </aside>
  )
}

type MobileLoginHeaderProps = {
  title: string
  description: string
  mirrored?: boolean
}

function MobileLoginHeader({
  title,
  description,
  mirrored = false,
}: MobileLoginHeaderProps) {
  return (
    <header className="relative h-[220px] shrink-0 overflow-hidden lg:hidden">
      <div
        className={cn(
          'absolute -top-[30px] size-[220px] rounded-full bg-olive-dark',
          mirrored ? '-right-[70px]' : '-left-[70px]',
        )}
      />
      <div
        className={cn(
          'absolute top-[60px] size-[120px] rounded-full bg-sage opacity-55',
          mirrored ? '-right-[10px]' : '-left-[10px]',
        )}
      />
      <div
        className={cn(
          'absolute top-10 size-[46px] rounded-full bg-ochre',
          mirrored ? 'left-[120px]' : 'right-[120px]',
        )}
      />
      <div
        className={cn(
          'relative flex flex-col px-[25px] pt-[79px]',
          mirrored ? 'items-start text-left' : 'items-end text-right',
        )}
      >
        <p className="font-heading text-[38px] leading-[55px] font-extrabold tracking-[-0.8px] text-surface">
          {title}
        </p>
        <p className="mt-1 text-sm leading-[20.3px] text-sage-light">
          {description}
        </p>
      </div>
    </header>
  )
}

export { LoginArt, MobileLoginHeader }

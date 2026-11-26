import { ArrowRight } from 'lucide-react'
import { HomeArt } from '@/components/home/HomeArt'
import { TransitionLink } from '@/components/login/TransitionLink'
import { Button } from '@/components/ui/button'

function HomePage() {
  return (
    <div className="relative flex h-svh flex-col overflow-hidden bg-primary text-card">
      <HomeArt />
      <header className="relative flex items-center gap-2.5 px-6 pt-7 lg:px-[86px] lg:pt-10">
        <img src="/favicon.svg" alt="" className="size-8" />
        <span className="font-heading text-lg font-extrabold tracking-[-0.3px]">
          Rekrutownik
        </span>
      </header>
      <main className="relative flex flex-1 flex-col justify-end px-6 pb-10 lg:w-[58%] lg:justify-center lg:px-[86px] lg:pb-16">
        <h1 className="max-w-[680px] font-heading text-[clamp(30px,9.5vw,40px)] leading-[1.08] font-extrabold tracking-[-0.8px] text-balance motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700 lg:text-[min(52px,7.5vh)] lg:tracking-[-1.2px] xl:text-[min(62px,7.5vh)]">
          Rekrutacja i&nbsp;wdrożenie dla organizacji studenckich
          na&nbsp;Politechnice Wrocławskiej
        </h1>
        <Button
          nativeButton={false}
          render={<TransitionLink to="/login" />}
          variant="accent"
          className="mt-8 h-12 w-full gap-2 px-6 text-[15px] text-foreground hover:bg-sand motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:fill-mode-both motion-safe:delay-200 motion-safe:duration-700 sm:w-fit lg:mt-10"
        >
          Zaloguj się
          <ArrowRight
            data-icon="inline-end"
            className="transition-transform group-hover/button:translate-x-0.5"
          />
        </Button>
      </main>
    </div>
  )
}

export default HomePage

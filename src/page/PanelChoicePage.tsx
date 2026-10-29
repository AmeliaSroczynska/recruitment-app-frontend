import { User, Users } from 'lucide-react'
import { LoginArt, MobileLoginHeader } from '@/components/login/LoginArt'
import { PanelChoiceCard } from '@/components/login/PanelChoiceCard'

function PanelChoicePage() {
  return (
    <div className="flex min-h-svh flex-col bg-olive lg:flex-row lg:bg-background">
      <LoginArt />
      <MobileLoginHeader />
      <main className="flex flex-1 flex-col rounded-t-[30px] bg-background px-[22px] pt-[25px] pb-10 lg:items-center lg:justify-center lg:rounded-none lg:p-10">
        <div className="w-full lg:max-w-[360px]">
          <h2 className="font-heading text-2xl leading-[34.8px] font-extrabold text-foreground lg:hidden">
            Kim jesteś?
          </h2>
          <h2 className="hidden font-heading text-[28px] leading-[40.6px] font-extrabold tracking-[-0.3px] text-foreground lg:block">
            Witaj!
          </h2>
          <p className="mt-[7px] text-sm leading-[20.3px] text-muted-foreground">
            Wybierz, do którego panelu chcesz się zalogować.
          </p>
          <div className="mt-[19px] flex flex-col gap-3.5 lg:mt-[21px] lg:gap-4">
            <PanelChoiceCard
              to="/login/candidate"
              title="Jestem kandydatem"
              description="Sprawdź status zgłoszenia, zapisz się na rozmowę i zacznij wdrożenie."
              icon={User}
              iconClassName="bg-olive text-surface"
            />
            <PanelChoiceCard
              to="/login/organization"
              title="Jestem z organizacji"
              description="Panel rekrutera: zgłoszenia, rozmowy, wdrożenia i statystyki."
              icon={Users}
              iconClassName="bg-ochre text-on-ochre"
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default PanelChoicePage

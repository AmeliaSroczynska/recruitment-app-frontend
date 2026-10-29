function LoginArt() {
  return (
    <aside className="relative hidden w-[51.2%] shrink-0 overflow-hidden bg-olive lg:block">
      <div className="absolute -bottom-[170px] -left-[170px] size-[760px] rounded-full bg-olive-dark" />
      <div className="absolute -bottom-[70px] -left-[70px] size-80 rounded-full bg-sage opacity-55" />
      <div className="absolute right-[60px] bottom-[150px] size-24 rounded-full bg-ochre opacity-90" />
      <div className="relative px-[86px] pt-[92px]">
        <h1 className="max-w-[561px] font-heading text-[63px] leading-[66.5px] font-extrabold tracking-[-1.3px] text-surface">
          Rekrutacja i wdrożenie w jednym miejscu.
        </h1>
        <p className="mt-[12px] max-w-[441px] text-[17px] leading-[24.7px] text-sage-light">
          Dla kandydatów, którzy chcą dołączyć, i dla zespołu, który ich
          przyjmuje.
        </p>
      </div>
    </aside>
  )
}

function MobileLoginHeader() {
  return (
    <header className="relative h-[220px] shrink-0 overflow-hidden lg:hidden">
      <div className="absolute -top-[30px] -left-[70px] size-[220px] rounded-full bg-olive-dark" />
      <div className="absolute top-[60px] -left-[10px] size-[120px] rounded-full bg-sage opacity-55" />
      <div className="absolute top-10 left-[227px] size-[46px] rounded-full bg-ochre" />
      <div className="relative flex flex-col items-end px-[25px] pt-[79px] text-right">
        <p className="font-heading text-[38px] leading-[55px] font-extrabold tracking-[-0.8px] text-surface">
          Witaj!
        </p>
        <p className="mt-[14px] text-sm leading-[20.3px] text-sage-light">
          Rekrutacja i wdrożenie w jednym miejscu.
        </p>
      </div>
    </header>
  )
}

export { LoginArt, MobileLoginHeader }

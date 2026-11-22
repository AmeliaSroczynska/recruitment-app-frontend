function HomeArt() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute inset-y-0 right-0 hidden w-[54%] lg:block">
        <div className="absolute top-[48%] left-[52%] size-[780px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-olive-dark [view-transition-name:circle-large]" />
        <div className="absolute top-[48%] left-[52%] size-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-sage-light/15" />
        <div className="absolute top-[48%] left-[52%] size-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-sage-light/10" />
        <div className="absolute -right-[70px] -bottom-[110px] size-[360px] rounded-full bg-sage opacity-55 [view-transition-name:circle-sage]" />
        <div className="absolute top-[14%] right-[16%] size-28 rounded-full bg-ochre opacity-90 [view-transition-name:circle-ochre] motion-safe:animate-float motion-safe:[animation-duration:9s]" />
      </div>
      <div className="absolute inset-x-0 top-0 h-[55%] lg:hidden">
        <div className="absolute -top-[110px] -right-[130px] size-[380px] rounded-full bg-olive-dark [view-transition-name:circle-large]" />
        <div className="absolute -top-[40px] -right-[60px] size-[240px] rounded-full border border-sage-light/15" />
        <div className="absolute top-[150px] -left-[70px] size-[180px] rounded-full bg-sage opacity-55 [view-transition-name:circle-sage]" />
        <div className="absolute top-[86px] left-[34%] size-12 rounded-full bg-ochre [view-transition-name:circle-ochre] motion-safe:animate-float" />
      </div>
    </div>
  )
}

export { HomeArt }

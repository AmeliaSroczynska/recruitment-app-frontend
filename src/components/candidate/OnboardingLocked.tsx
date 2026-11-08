import { Lock } from 'lucide-react'

function OnboardingLocked() {
  return (
    <div className="mx-auto flex max-w-[340px] flex-col items-center pt-10 text-center md:pt-16">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-paper text-olive-dark">
        <Lock className="size-6" />
      </div>
      <h2 className="mt-4 text-base font-semibold text-foreground">
        Wdrożenie czeka na Ciebie
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Zadania, mentorzy, baza wiedzy i FAQ pojawią się tutaj po przyjęciu do
        organizacji.
      </p>
    </div>
  )
}

export { OnboardingLocked }

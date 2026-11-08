import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MAX_MENTOR_CAPACITY, MIN_MENTOR_CAPACITY } from '@/panel/onboarding'

type CapacityStepperProps = {
  id: string
  value: number
  disabled: boolean
  onChange: (value: number) => void
}

function CapacityStepper({
  id,
  value,
  disabled,
  onChange,
}: CapacityStepperProps) {
  return (
    <div className="flex h-10 items-center overflow-hidden rounded-[10px] border border-border bg-card">
      <Button
        type="button"
        variant="ghost"
        aria-label="Mniej osób"
        disabled={disabled || value <= MIN_MENTOR_CAPACITY}
        onClick={() => onChange(value - 1)}
        className="h-full w-10 rounded-none border-r border-border"
      >
        <Minus />
      </Button>
      <output
        id={id}
        aria-live="polite"
        className="min-w-12 flex-1 text-center text-sm text-foreground"
      >
        {value}
      </output>
      <Button
        type="button"
        variant="ghost"
        aria-label="Więcej osób"
        disabled={disabled || value >= MAX_MENTOR_CAPACITY}
        onClick={() => onChange(value + 1)}
        className="h-full w-10 rounded-none border-l border-border"
      >
        <Plus />
      </Button>
    </div>
  )
}

export { CapacityStepper }

import type { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

type LoginFormHeaderProps = {
  backTo: string
  backLabel: string
  title: string
  description: ReactNode
}

function LoginFormHeader({
  backTo,
  backLabel,
  title,
  description,
}: LoginFormHeaderProps) {
  return (
    <>
      <Button
        variant="link"
        nativeButton={false}
        render={<Link to={backTo} />}
        className="h-auto gap-[5px] p-0 text-[13px] leading-[18.9px] font-semibold text-ochre-dark"
      >
        <ArrowLeft className="size-3.5" />
        {backLabel}
      </Button>
      <h2 className="mt-3.5 font-heading text-2xl leading-[34.8px] font-extrabold text-foreground lg:mt-4 lg:text-[28px] lg:leading-[40.6px] lg:tracking-[-0.3px]">
        {title}
      </h2>
      <p className="mt-[7px] text-sm leading-[20.3px] text-muted-foreground">
        {description}
      </p>
    </>
  )
}

export { LoginFormHeader }

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { OrganizationAvatar } from '@/components/panel/OrganizationAvatar'

type ContactCardProps = {
  name: string
  email: string
  logoUrl: string | null
}

function ContactCard({ name, email, logoUrl }: ContactCardProps) {
  const [isCopied, setIsCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(email)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <section>
      <h2 className="font-heading text-[22px] leading-tight font-extrabold tracking-[-0.2px] text-foreground">
        Masz pytania?
      </h2>
      <div className="mt-4 flex items-center gap-3">
        <OrganizationAvatar
          name={name}
          logoUrl={logoUrl}
          className="size-9 rounded-[10px]"
          fallbackClassName="text-[15px]"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {name}
          </p>
          <p className="text-[12.5px] text-muted-foreground">
            Kontakt do organizacji
          </p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3 rounded-[10px] border border-border bg-card py-2 pr-2 pl-3">
        <a
          href={`mailto:${email}`}
          className="min-w-0 truncate text-[13px] text-foreground hover:underline"
        >
          {email}
        </a>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={copy}
          className="h-7 shrink-0 rounded-lg bg-card px-2.5 text-xs"
        >
          {isCopied ? 'Skopiowano' : 'Kopiuj'}
        </Button>
      </div>
    </section>
  )
}

export { ContactCard }

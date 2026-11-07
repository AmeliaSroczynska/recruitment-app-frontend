import { Pencil } from 'lucide-react'
import { useState } from 'react'
import { SettingsCard } from '@/components/settings/SettingsCard'
import { Button } from '@/components/ui/button'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group'

type FormLinkCardProps = {
  slug: string
  savedSlug: string
  disabled: boolean
  onChange: (slug: string) => void
}

function FormLinkCard({
  slug,
  savedSlug,
  disabled,
  onChange,
}: FormLinkCardProps) {
  const [copied, setCopied] = useState(false)

  async function copyLink() {
    await navigator.clipboard.writeText(
      `${window.location.origin}/form/${savedSlug}`,
    )
    setCopied(true)
  }

  return (
    <SettingsCard title="Link do formularza">
      <div className="mt-4 flex flex-col gap-4">
        <InputGroup className="h-10 rounded-[10px] border-border bg-card shadow-none">
          <InputGroupAddon className="pr-0 pl-3">
            <InputGroupText className="text-sm">
              rekrutownik.vercel.app/form/
            </InputGroupText>
          </InputGroupAddon>
          <InputGroupInput
            aria-label="Adres formularza"
            required
            disabled={disabled}
            maxLength={50}
            pattern="[a-z0-9\-]+"
            title="Tylko małe litery bez polskich znaków, cyfry i myślniki."
            value={slug}
            onChange={(event) => {
              onChange(event.target.value)
              setCopied(false)
            }}
            className="pl-0 text-sm"
          />
          {!disabled && (
            <InputGroupAddon align="inline-end">
              <Pencil className="size-4 text-muted-foreground" />
            </InputGroupAddon>
          )}
        </InputGroup>
        <Button
          type="button"
          onClick={copyLink}
          variant="accent"
          className="h-10"
        >
          {copied ? 'Skopiowano!' : 'Kopiuj link do formularza'}
        </Button>
      </div>
    </SettingsCard>
  )
}

export { FormLinkCard }

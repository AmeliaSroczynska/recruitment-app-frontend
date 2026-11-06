import { SettingsCard } from '@/components/settings/SettingsCard'
import { Switch } from '@/components/ui/switch'

type FormSettingsCardProps = {
  isAcceptingResponses: boolean
  disabled: boolean
  onChange: (isAcceptingResponses: boolean) => void
}

function FormSettingsCard({
  isAcceptingResponses,
  disabled,
  onChange,
}: FormSettingsCardProps) {
  return (
    <SettingsCard title="Ustawienia formularza">
      <label className="mt-4 flex gap-3 border-b border-border pb-4">
        <Switch
          checked={isAcceptingResponses}
          disabled={disabled}
          onCheckedChange={onChange}
          className="mt-0.5 data-checked:bg-ochre"
        />
        <span className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-foreground">
            Włączone zbieranie odpowiedzi
          </span>
          <span className="text-sm text-muted-foreground">
            Wyłącz, aby formularz przestał przyjmować nowe zgłoszenia.
          </span>
        </span>
      </label>
    </SettingsCard>
  )
}

export { FormSettingsCard }

import { SettingsCard } from '@/components/settings/SettingsCard'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field'
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
      <Field
        orientation="horizontal"
        className="mt-4 border-b border-border pb-4"
      >
        <Switch
          id="is-accepting-responses"
          checked={isAcceptingResponses}
          disabled={disabled}
          onCheckedChange={onChange}
          className="mt-0.5 data-checked:bg-ochre"
        />
        <FieldContent className="gap-0.5">
          <FieldLabel htmlFor="is-accepting-responses">
            Włączone zbieranie odpowiedzi
          </FieldLabel>
          <FieldDescription>
            Wyłącz, aby formularz przestał przyjmować nowe zgłoszenia.
          </FieldDescription>
        </FieldContent>
      </Field>
    </SettingsCard>
  )
}

export { FormSettingsCard }

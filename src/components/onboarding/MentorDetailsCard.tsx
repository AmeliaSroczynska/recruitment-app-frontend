import { useState } from 'react'
import { CapacityStepper } from '@/components/onboarding/CapacityStepper'
import { SettingsCard } from '@/components/settings/SettingsCard'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { api, ApiError } from '@/lib/api'
import type { MentorDetails } from '@/panel/onboarding'

type TextField =
  'first_name' | 'last_name' | 'section' | 'free_time' | 'how_can_help'

const inputClassName =
  'h-10 rounded-[10px] border-border bg-card px-3 text-sm shadow-none'

const textareaClassName =
  'min-h-16 rounded-[10px] border-border bg-card px-3 py-2.5 text-sm shadow-none'

const DESCRIPTIONS: { field: TextField; label: string; placeholder: string }[] =
  [
    {
      field: 'section',
      label: 'Gdzie działa',
      placeholder: 'Na przykład sekcja eventowa, projekty, którymi się zajmuje',
    },
    {
      field: 'free_time',
      label: 'Jak spędza wolny czas',
      placeholder: 'Hobby i zainteresowania',
    },
    {
      field: 'how_can_help',
      label: 'Jak może pomóc kandydatowi',
      placeholder: 'W czym pomoże nowej osobie na start',
    },
  ]

type MentorDetailsCardProps = {
  path: string
  mentor: MentorDetails
  canEdit: boolean
  onChange: (mentor: MentorDetails) => void
}

function MentorDetailsCard({
  path,
  mentor,
  canEdit,
  onChange,
}: MentorDetailsCardProps) {
  const [values, setValues] = useState<Record<TextField, string>>({
    first_name: mentor.first_name,
    last_name: mentor.last_name,
    section: mentor.section,
    free_time: mentor.free_time,
    how_can_help: mentor.how_can_help,
  })
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  async function save(body: Partial<MentorDetails>) {
    setError('')
    setIsSaving(true)
    try {
      onChange(await api<MentorDetails>(path, { method: 'PATCH', body }))
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : 'Brak połączenia z serwerem. Spróbuj ponownie.',
      )
    }
    setIsSaving(false)
  }

  function saveText(field: TextField) {
    if (values[field] !== mentor[field]) {
      void save({ [field]: values[field] })
    }
  }

  function update(field: TextField, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  return (
    <SettingsCard title="Dane mentora">
      <fieldset disabled={!canEdit} className="mt-4 flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto]">
          <Field className="gap-[7px]">
            <FieldLabel htmlFor="mentor-first-name" className="font-medium">
              Imię
            </FieldLabel>
            <Input
              id="mentor-first-name"
              maxLength={150}
              value={values.first_name}
              onChange={(event) => update('first_name', event.target.value)}
              onBlur={() => saveText('first_name')}
              className={inputClassName}
            />
          </Field>
          <Field className="gap-[7px]">
            <FieldLabel htmlFor="mentor-last-name" className="font-medium">
              Nazwisko
            </FieldLabel>
            <Input
              id="mentor-last-name"
              maxLength={150}
              value={values.last_name}
              onChange={(event) => update('last_name', event.target.value)}
              onBlur={() => saveText('last_name')}
              className={inputClassName}
            />
          </Field>
          <Field className="gap-[7px]">
            <FieldLabel htmlFor="mentor-capacity" className="font-medium">
              Ile osób chce prowadzić
            </FieldLabel>
            <CapacityStepper
              id="mentor-capacity"
              value={mentor.capacity}
              disabled={!canEdit || isSaving}
              onChange={(capacity) => void save({ capacity })}
            />
          </Field>
        </div>
        {DESCRIPTIONS.map(({ field, label, placeholder }) => (
          <Field key={field} className="gap-[7px]">
            <FieldLabel htmlFor={`mentor-${field}`} className="font-medium">
              {label}
            </FieldLabel>
            <Textarea
              id={`mentor-${field}`}
              placeholder={placeholder}
              value={values[field]}
              onChange={(event) => update(field, event.target.value)}
              onBlur={() => saveText(field)}
              className={textareaClassName}
            />
          </Field>
        ))}
        {error && <FieldError>{error}</FieldError>}
      </fieldset>
    </SettingsCard>
  )
}

export { MentorDetailsCard }

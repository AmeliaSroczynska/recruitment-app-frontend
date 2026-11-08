import type { ReactNode } from 'react'
import { ImageUploadField } from '@/components/files/ImageUploadField'
import { FixedFields } from '@/components/forms/FixedFields'
import { SettingsCard } from '@/components/settings/SettingsCard'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import type { ApplicationForm } from '@/panel/form'

type FormHeaderCardProps = {
  editionId: number
  form: ApplicationForm
  disabled: boolean
  onChange: (changes: Partial<ApplicationForm>) => void
  children?: ReactNode
}

function FormHeaderCard({
  editionId,
  form,
  disabled,
  onChange,
  children,
}: FormHeaderCardProps) {
  return (
    <SettingsCard>
      <div className="flex flex-col gap-2">
        <Input
          aria-label="Tytuł formularza"
          required
          disabled={disabled}
          maxLength={200}
          value={form.title}
          onChange={(event) => onChange({ title: event.target.value })}
          className="h-11 rounded-[10px] border-border bg-card px-3 font-heading text-xl font-extrabold shadow-none md:max-w-[420px] md:text-2xl"
        />
        <Textarea
          aria-label="Opis formularza"
          placeholder="Opis formularza, np. ile zajmie wypełnienie i kiedy odpowiecie."
          disabled={disabled}
          value={form.description ?? ''}
          onChange={(event) => onChange({ description: event.target.value })}
          className="min-h-16 rounded-[10px] border-border bg-card px-3 py-2.5 text-sm shadow-none"
        />
      </div>
      <Separator className="my-5" />
      <ImageUploadField<ApplicationForm>
        path={`editions/${editionId}/form/header-image/`}
        fieldName="header_image"
        label="Zdjęcie nagłówka"
        placeholder="zdjęcie nagłówka"
        url={form.header_image_url}
        canEdit={!disabled}
        className="mb-4"
        onSaved={(data) =>
          onChange({ header_image_url: data.header_image_url })
        }
      />
      <FixedFields />
      {children}
    </SettingsCard>
  )
}

export { FormHeaderCard }

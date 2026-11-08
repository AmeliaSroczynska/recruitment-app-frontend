import { Monitor, Smartphone } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ApplicationFormView } from '@/components/forms/ApplicationFormView'
import { FieldError } from '@/components/ui/field'
import { Skeleton } from '@/components/ui/skeleton'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import { useEdition } from '@/panel/EditionContext'
import type { ApplicationForm, Question } from '@/panel/form'

type FormPreviewProps = {
  form: ApplicationForm
}

function FormPreview({ form }: FormPreviewProps) {
  const membership = useEdition()
  const [questions, setQuestions] = useState<Question[] | null>(null)
  const [error, setError] = useState('')
  const [device, setDevice] = useState('desktop')

  useEffect(() => {
    api<Question[]>(`editions/${membership.edition_id}/form/questions/`)
      .then(setQuestions)
      .catch(() => setError('Nie udało się wczytać pytań.'))
  }, [membership.edition_id])

  return (
    <div className="flex flex-col gap-4">
      <ToggleGroup
        aria-label="Widok podglądu"
        value={[device]}
        onValueChange={(selected) => selected[0] && setDevice(selected[0])}
        className="hidden gap-2 self-end md:flex"
      >
        {[
          { value: 'desktop', label: 'Desktop', icon: Monitor },
          { value: 'phone', label: 'Telefon', icon: Smartphone },
        ].map(({ value, label, icon: Icon }) => (
          <ToggleGroupItem
            key={value}
            value={value}
            className="h-9 gap-2 rounded-[10px] border border-border bg-card px-3 font-normal hover:bg-paper data-pressed:border-ochre data-pressed:bg-sand/30 data-pressed:text-ochre-dark"
          >
            <Icon className="size-4" />
            {label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <div
        className={cn(
          'w-full rounded-2xl border border-border bg-card px-5 py-8',
          device === 'phone'
            ? 'max-w-[393px] md:mx-auto'
            : 'md:px-[50px] md:py-14',
        )}
      >
        {error && <FieldError>{error}</FieldError>}
        {!error && !questions && <Skeleton className="h-64 w-full" />}
        {questions && (
          <ApplicationFormView
            title={form.title}
            description={form.description}
            organizationName={membership.organization_name}
            headerImageUrl={form.header_image_url}
            questions={questions}
          />
        )}
      </div>
    </div>
  )
}

export { FormPreview }

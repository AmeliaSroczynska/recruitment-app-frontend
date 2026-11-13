import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Field, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { InterviewTemplate } from '@/panel/interviews'

type ScheduleDialogProps = {
  name: string
  term: string
  templates: InterviewTemplate[]
  onOpenChange: (open: boolean) => void
  onConfirm: (templateId: number) => void
}

function ScheduleDialog({
  name,
  term,
  templates,
  onOpenChange,
  onConfirm,
}: ScheduleDialogProps) {
  const [templateId, setTemplateId] = useState<string | null>(
    templates[0] ? String(templates[0].id) : null,
  )
  const items = Object.fromEntries(
    templates.map((template) => [String(template.id), template.name]),
  )

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="bg-card">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg font-semibold">
            Umówić rozmowę?
          </DialogTitle>
          <DialogDescription>
            {name} nie ma jeszcze rozmowy bez terminu. Wybierz szablon, a
            powstanie nowa rozmowa na {term}. Kandydat dostanie mail z terminem.
          </DialogDescription>
        </DialogHeader>
        {templates.length > 0 ? (
          <Field>
            <FieldLabel htmlFor="schedule-template">Szablon rozmowy</FieldLabel>
            <Select
              items={items}
              value={templateId}
              onValueChange={(value) => value && setTemplateId(value)}
            >
              <SelectTrigger
                id="schedule-template"
                className="h-10 w-full rounded-[10px] border-border bg-card text-sm shadow-none"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={String(template.id)}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        ) : (
          <p className="text-sm text-muted-foreground">
            Najpierw dodaj szablon w zakładce Rozmowy.
          </p>
        )}
        <DialogFooter>
          <DialogClose
            render={
              <Button variant="outline" className="h-10 rounded-[10px]" />
            }
          >
            Anuluj
          </DialogClose>
          <Button
            type="button"
            variant="accent"
            disabled={!templateId}
            onClick={() => templateId && onConfirm(Number(templateId))}
            className="h-10 rounded-[10px] font-semibold"
          >
            Umów i wyślij mail
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { ScheduleDialog }

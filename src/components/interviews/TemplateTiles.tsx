import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatQuestionCount, type InterviewTemplate } from '@/panel/interviews'

type TemplateTilesProps = {
  templates: InterviewTemplate[]
  selectedId: number | null
  canEdit: boolean
  isAdding: boolean
  onSelect: (templateId: number) => void
  onAdd: () => void
}

function TemplateTiles({
  templates,
  selectedId,
  canEdit,
  isAdding,
  onSelect,
  onAdd,
}: TemplateTilesProps) {
  return (
    <section>
      <h2 className="text-sm text-muted-foreground">Szablony</h2>
      <div className="-mx-[18px] mt-3 flex gap-3 overflow-x-auto px-[18px] pb-1 md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0 md:pb-0">
        {templates.map((template) => (
          <button
            key={template.id}
            type="button"
            onClick={() => onSelect(template.id)}
            className={cn(
              'flex min-w-44 shrink-0 flex-col items-start rounded-xl border border-border bg-card px-4 py-3 text-left shadow-card transition-colors hover:border-sand md:min-w-0',
              template.id === selectedId &&
                'border-ochre bg-paper hover:border-ochre',
            )}
          >
            <span className="w-full truncate text-sm font-semibold text-foreground">
              {template.name}
            </span>
            <span className="mt-0.5 text-xs text-muted-foreground">
              {formatQuestionCount(template.question_count)}
            </span>
          </button>
        ))}
        {canEdit && (
          <Button
            type="button"
            variant="dashed"
            disabled={isAdding}
            onClick={onAdd}
            className="h-auto min-h-14 min-w-44 shrink-0 rounded-xl text-[15px] md:min-w-0"
          >
            <Plus />
            Nowy szablon
          </Button>
        )}
      </div>
      {templates.length === 0 && !canEdit && (
        <p className="mt-3 text-sm text-muted-foreground">
          Nie ma jeszcze żadnych szablonów rozmów.
        </p>
      )}
    </section>
  )
}

export { TemplateTiles }

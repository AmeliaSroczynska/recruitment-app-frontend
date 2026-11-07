import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  STATUSES,
  STATUS_LABELS,
  type ApplicationStatus,
} from '@/panel/applications'

type StatusPickerProps = {
  value: ApplicationStatus
  disabled?: boolean
  onChange: (status: ApplicationStatus) => void
}

function StatusPicker({ value, disabled, onChange }: StatusPickerProps) {
  return (
    <div className="-mx-[18px] overflow-x-auto px-[18px] md:mx-0 md:px-0">
      <ToggleGroup
        aria-label="Status kandydata"
        variant="outline"
        spacing={0}
        value={[value]}
        disabled={disabled}
        onValueChange={(selected) =>
          selected[0] && onChange(selected[0] as ApplicationStatus)
        }
        className="rounded-[10px] bg-card"
      >
        {STATUSES.map((status) => (
          <ToggleGroupItem
            key={status}
            value={status}
            className="h-10 border-border px-4! font-normal text-muted-foreground first:rounded-l-[10px]! last:rounded-r-[10px]! data-pressed:bg-sand/30 data-pressed:font-medium data-pressed:text-ochre-dark"
          >
            {STATUS_LABELS[status]}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}

export { StatusPicker }

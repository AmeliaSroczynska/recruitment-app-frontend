import { PanelTabsList, PanelTabsTrigger } from '@/components/panel/PanelTabs'
import { Tabs } from '@/components/ui/tabs'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { RANGES, type StatisticsRange } from '@/panel/statistics'

type RangePickerProps = {
  value: StatisticsRange
  onChange: (range: StatisticsRange) => void
}

function RangeToggle({ value, onChange }: RangePickerProps) {
  return (
    <ToggleGroup
      aria-label="Zakres danych"
      variant="outline"
      spacing={0}
      value={[value]}
      onValueChange={(selected) =>
        selected[0] && onChange(selected[0] as StatisticsRange)
      }
      className="rounded-[10px] bg-card"
    >
      {RANGES.map((range) => (
        <ToggleGroupItem
          key={range.value}
          value={range.value}
          className="h-9 border-border px-3! font-normal text-muted-foreground first:rounded-l-[10px]! last:rounded-r-[10px]! data-pressed:bg-sand/30 data-pressed:font-medium data-pressed:text-ochre-dark"
        >
          {range.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

function RangeTabs({ value, onChange }: RangePickerProps) {
  return (
    <Tabs
      value={value}
      onValueChange={(selected) => onChange(selected as StatisticsRange)}
    >
      <PanelTabsList>
        {RANGES.map((range) => (
          <PanelTabsTrigger key={range.value} value={range.value}>
            {range.label}
          </PanelTabsTrigger>
        ))}
      </PanelTabsList>
    </Tabs>
  )
}

export { RangeTabs, RangeToggle }

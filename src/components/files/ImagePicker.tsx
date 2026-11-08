import { ImageIcon, Trash2 } from 'lucide-react'
import { useRef, useState, type ChangeEvent } from 'react'
import { Button } from '@/components/ui/button'
import { getAccept, getFileError } from '@/lib/files'
import { cn } from '@/lib/utils'

type ImagePickerProps = {
  label: string
  placeholder: string
  url: string | null
  disabled?: boolean
  error?: string
  className?: string
  onSelect: (file: File) => void
  onRemove?: () => void
}

function ImagePicker({
  label,
  placeholder,
  url,
  disabled,
  error,
  className,
  onSelect,
  onRemove,
}: ImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [fileError, setFileError] = useState<string | null>(null)

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) {
      return
    }
    const nextError = getFileError(file, 'image')
    setFileError(nextError)
    if (!nextError) {
      onSelect(file)
    }
  }

  const message = fileError ?? error

  return (
    <div
      className={cn(
        'flex items-center gap-5 rounded-xl border border-border bg-background p-5',
        className,
      )}
    >
      <Button
        type="button"
        variant="ghost"
        disabled={disabled}
        aria-label={url ? `Zmień: ${label}` : `Dodaj: ${label}`}
        onClick={() => inputRef.current?.click()}
        className="h-[120px] w-[195px] shrink-0 flex-col gap-2 overflow-hidden rounded-[10px] border border-dashed border-muted-foreground/50 bg-secondary p-0 text-sm font-normal text-muted-foreground hover:border-muted-foreground hover:bg-secondary hover:text-muted-foreground disabled:opacity-100 [&_svg:not([class*='size-'])]:size-7"
      >
        {url ? (
          <img src={url} alt="" className="size-full object-contain p-3" />
        ) : (
          <>
            <ImageIcon strokeWidth={1.5} />
            {placeholder}
          </>
        )}
      </Button>
      <div className="flex min-w-0 flex-col items-start gap-1">
        <p className="text-base font-semibold text-foreground">{label}</p>
        {message ? (
          <p className="text-sm text-destructive">{message}</p>
        ) : (
          <p className="text-sm text-muted-foreground">Maksymalnie 4 MB.</p>
        )}
        {url && onRemove && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled}
            onClick={() => {
              setFileError(null)
              onRemove()
            }}
            className="mt-1 -ml-2.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 />
            Usuń
          </Button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={getAccept('image')}
        className="hidden"
        onChange={handleChange}
      />
    </div>
  )
}

export { ImagePicker }

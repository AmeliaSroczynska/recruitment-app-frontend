import { FileText, Trash2, Upload } from 'lucide-react'
import { useRef, useState, type ChangeEvent } from 'react'
import { Button } from '@/components/ui/button'
import { getAccept, getFileError, type FileKind } from '@/lib/files'
import { cn } from '@/lib/utils'

type FilePickerProps = {
  kind: FileKind
  url: string | null
  fileName?: string | null
  disabled?: boolean
  className?: string
  onSelect: (file: File) => void
  onRemove?: () => void
}

function FilePicker({
  kind,
  url,
  fileName,
  disabled,
  className,
  onSelect,
  onRemove,
}: FilePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) {
      return
    }
    const fileError = getFileError(file, kind)
    setError(fileError)
    if (!fileError) {
      onSelect(file)
    }
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex flex-wrap items-center gap-3">
        {url && kind === 'image' && (
          <img
            src={url}
            alt=""
            className="size-16 rounded-[10px] border border-border object-cover"
          />
        )}
        {url && kind === 'file' && (
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="flex min-w-0 items-center gap-2 text-sm font-medium text-foreground underline-offset-4 hover:underline"
          >
            <FileText className="size-4 shrink-0 text-muted-foreground" />
            <span className="truncate">{fileName ?? 'Pobierz plik'}</span>
          </a>
        )}
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
        >
          <Upload />
          {url ? 'Zmień plik' : 'Wybierz plik'}
        </Button>
        {url && onRemove && (
          <Button
            type="button"
            variant="ghost"
            disabled={disabled}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => {
              setError(null)
              onRemove()
            }}
          >
            <Trash2 />
            Usuń
          </Button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={getAccept(kind)}
        className="hidden"
        onChange={handleChange}
      />
      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : (
        <p className="text-xs text-muted-foreground">Maksymalnie 4 MB.</p>
      )}
    </div>
  )
}

export { FilePicker }

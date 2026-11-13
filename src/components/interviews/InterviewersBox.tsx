import { useState } from 'react'
import { AssignInterviewersDialog } from '@/components/interviews/AssignInterviewersDialog'
import { UserAvatar } from '@/components/panel/UserAvatar'
import { Button } from '@/components/ui/button'
import type { Interview } from '@/panel/interviews'
import { getDisplayName } from '@/panel/user'

type InterviewersBoxProps = {
  editionId: number
  path: string
  interview: Interview
  canEdit: boolean
  onChange: (interview: Interview) => void
}

function InterviewersBox({
  editionId,
  path,
  interview,
  canEdit,
  onChange,
}: InterviewersBoxProps) {
  const [isOpen, setIsOpen] = useState(false)
  const people = interview.interviewers

  return (
    <div className="rounded-xl border border-border bg-muted/60 px-3 py-3 md:px-4">
      <div className="hidden items-center justify-between gap-3 md:flex">
        <p className="text-sm font-medium text-foreground">Prowadzą rozmowę</p>
        {canEdit && people.length > 0 && (
          <Button
            type="button"
            variant="link"
            onClick={() => setIsOpen(true)}
            className="h-auto p-0 text-sm text-ochre-dark"
          >
            Dodaj lub zmień osoby
          </Button>
        )}
      </div>
      <div className="flex items-center gap-3 md:mt-2">
        {people.length > 0 ? (
          <ul className="flex min-w-0 flex-1 flex-wrap gap-x-4 gap-y-2">
            {people.map((person) => (
              <li key={person.id} className="flex min-w-0 items-center gap-2">
                <UserAvatar user={person} className="size-7" />
                <span className="truncate text-sm text-foreground">
                  {getDisplayName(person)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="flex min-w-0 flex-1 items-center gap-3 text-sm text-muted-foreground">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-sand/60 text-xs text-foreground">
              ?
            </span>
            Nikt jeszcze nie przypisany
          </p>
        )}
        {canEdit && (
          <>
            <Button
              type="button"
              variant="link"
              onClick={() => setIsOpen(true)}
              className="h-auto p-0 text-sm text-ochre-dark md:hidden"
            >
              {people.length > 0 ? 'Zmień' : 'Przypisz'}
            </Button>
            {people.length === 0 && (
              <Button
                type="button"
                variant="accent"
                onClick={() => setIsOpen(true)}
                className="hidden h-9 px-4 md:inline-flex"
              >
                Przypisz osoby
              </Button>
            )}
          </>
        )}
      </div>
      {canEdit && isOpen && (
        <AssignInterviewersDialog
          editionId={editionId}
          path={path}
          interview={interview}
          onOpenChange={setIsOpen}
          onSaved={onChange}
        />
      )}
    </div>
  )
}

export { InterviewersBox }

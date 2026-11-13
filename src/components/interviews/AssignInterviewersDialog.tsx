import { useEffect, useState } from 'react'
import { UserAvatar } from '@/components/panel/UserAvatar'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FieldError } from '@/components/ui/field'
import { Skeleton } from '@/components/ui/skeleton'
import { api, ApiError } from '@/lib/api'
import { INTERVIEWER_ROLES, type Interview } from '@/panel/interviews'
import { ROLE_LABELS } from '@/panel/roles'
import type { Member } from '@/panel/settings'
import { getDisplayName } from '@/panel/user'

type AssignInterviewersDialogProps = {
  editionId: number
  path: string
  interview: Interview
  onOpenChange: (open: boolean) => void
  onSaved: (interview: Interview) => void
}

function AssignInterviewersDialog({
  editionId,
  path,
  interview,
  onOpenChange,
  onSaved,
}: AssignInterviewersDialogProps) {
  const [members, setMembers] = useState<Member[] | null>(null)
  const [selectedIds, setSelectedIds] = useState(() =>
    interview.interviewers.map((person) => person.id),
  )
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    api<Member[]>(`editions/${editionId}/members/`)
      .then((data) =>
        setMembers(
          data.filter((member) => INTERVIEWER_ROLES.includes(member.role)),
        ),
      )
      .catch(() => setError('Nie udało się wczytać zespołu.'))
  }, [editionId])

  function toggle(memberId: number, checked: boolean) {
    setSelectedIds((current) =>
      checked
        ? [...current, memberId]
        : current.filter((id) => id !== memberId),
    )
  }

  async function save() {
    setError('')
    setIsSaving(true)
    try {
      onSaved(
        await api<Interview>(`${path}interviewers/`, {
          method: 'PUT',
          body: { membership_ids: selectedIds },
        }),
      )
      onOpenChange(false)
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : 'Brak połączenia z serwerem. Spróbuj ponownie.',
      )
    }
    setIsSaving(false)
  }

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="bg-card">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg font-semibold">
            Prowadzą rozmowę
          </DialogTitle>
          <DialogDescription>
            Zaznacz osoby, które poprowadzą tę rozmowę. Na liście są rekruterzy
            i koordynatorzy tej edycji.
          </DialogDescription>
        </DialogHeader>
        {members ? (
          <ul className="flex max-h-80 flex-col overflow-y-auto">
            {members.map((member) => (
              <li
                key={member.id}
                className="border-b border-border last:border-0"
              >
                <label className="flex cursor-pointer items-center gap-3 py-2.5">
                  <Checkbox
                    checked={selectedIds.includes(member.id)}
                    onCheckedChange={(checked) => toggle(member.id, checked)}
                  />
                  <UserAvatar user={member} className="size-8" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-foreground">
                      {getDisplayName(member)}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {ROLE_LABELS[member.role]}
                    </span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        ) : (
          !error && <Skeleton className="h-24 w-full" />
        )}
        {error && <FieldError>{error}</FieldError>}
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
            disabled={!members || isSaving}
            onClick={save}
            className="h-10 rounded-[10px] font-semibold"
          >
            {isSaving ? 'Zapisywanie...' : 'Zapisz'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { AssignInterviewersDialog }

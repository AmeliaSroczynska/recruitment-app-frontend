import { useEffect, useState } from 'react'
import { useAuth, type User } from '@/auth/AuthContext'
import { UserAvatar } from '@/components/panel/UserAvatar'
import { AddMemberDialog } from '@/components/settings/AddMemberDialog'
import { RemoveMemberDialog } from '@/components/settings/RemoveMemberDialog'
import { RoleSelect } from '@/components/settings/RoleSelect'
import { SettingsCard } from '@/components/settings/SettingsCard'
import { Skeleton } from '@/components/ui/skeleton'
import { api, ApiError } from '@/lib/api'
import { ROLE_LABELS } from '@/panel/roles'
import type { Member } from '@/panel/settings'
import { getDisplayName } from '@/panel/user'

type MembersCardProps = {
  editionId: number
  canEdit: boolean
}

function MembersCard({ editionId, canEdit }: MembersCardProps) {
  const { user, setUser } = useAuth()
  const [members, setMembers] = useState<Member[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api<Member[]>(`editions/${editionId}/members/`)
      .then(setMembers)
      .catch(() => setError('Nie udało się wczytać osób.'))
  }, [editionId])

  async function refreshSelf(member: Member) {
    if (member.user_id === user?.id) {
      setUser(await api<User>('auth/me/'))
    }
  }

  async function changeRole(member: Member, role: string) {
    setError('')
    try {
      const updated = await api<Member>(
        `editions/${editionId}/members/${member.id}/`,
        { method: 'PATCH', body: { role } },
      )
      setMembers(
        (current) =>
          current?.map((item) => (item.id === updated.id ? updated : item)) ??
          null,
      )
      await refreshSelf(member)
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : 'Brak połączenia z serwerem. Spróbuj ponownie.',
      )
    }
  }

  async function removeMember(member: Member) {
    setError('')
    try {
      await api(`editions/${editionId}/members/${member.id}/`, {
        method: 'DELETE',
      })
      setMembers(
        (current) => current?.filter((item) => item.id !== member.id) ?? null,
      )
      await refreshSelf(member)
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : 'Brak połączenia z serwerem. Spróbuj ponownie.',
      )
    }
  }

  return (
    <SettingsCard title="Osoby w organizacji">
      {!members && !error && <Skeleton className="mt-3 h-32 w-full" />}
      {members && (
        <ul className="mt-3 divide-y divide-border border-t border-border">
          {members.map((member, index) => (
            <li
              key={member.id}
              className="flex flex-wrap items-center gap-3 py-3.5 md:flex-nowrap"
            >
              <UserAvatar
                user={member}
                className="size-9"
                fallbackClassName={index % 2 ? 'bg-sage-light' : 'bg-sand'}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {getDisplayName(member)}
                </p>
                {getDisplayName(member) !== member.email && (
                  <p className="truncate text-xs text-muted-foreground">
                    {member.email}
                  </p>
                )}
              </div>
              {canEdit ? (
                <div className="flex w-full items-center gap-1 pl-12 md:w-auto md:pl-0">
                  <RoleSelect
                    value={member.role}
                    onChange={(role) => changeRole(member, role)}
                  />
                  <RemoveMemberDialog
                    name={getDisplayName(member)}
                    onConfirm={() => removeMember(member)}
                  />
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">
                  {ROLE_LABELS[member.role]}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
      {canEdit && (
        <div className="mt-2">
          <AddMemberDialog
            editionId={editionId}
            onAdded={(member) =>
              setMembers((current) => [...(current ?? []), member])
            }
          />
        </div>
      )}
    </SettingsCard>
  )
}

export { MembersCard }

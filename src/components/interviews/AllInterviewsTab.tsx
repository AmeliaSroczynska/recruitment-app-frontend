import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ApplicationFilters } from '@/components/applications/ApplicationFilters'
import { ErrorAlert } from '@/components/panel/ErrorAlert'
import { UserAvatar } from '@/components/panel/UserAvatar'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { api } from '@/lib/api'
import { AVATAR_COLORS } from '@/panel/applications'
import {
  formatInterviewers,
  formatInterviewTerm,
  type EditionInterview,
} from '@/panel/interviews'
import { getDisplayName } from '@/panel/user'

type LoadedInterviews = {
  key: string
  data: EditionInterview[] | null
  error: string
}

type InterviewListProps = {
  interviews: EditionInterview[]
  editionId: number
}

function getCandidateLink(editionId: number, interview: EditionInterview) {
  return `/organization/${editionId}/applications/${interview.application_id}`
}

function InterviewTable({ interviews, editionId }: InterviewListProps) {
  return (
    <Card className="hidden gap-0 rounded-2xl py-0 shadow-card ring-border md:flex">
      <Table className="text-sm">
        <TableHeader className="bg-paper">
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-10 w-[34%] border-r border-border px-4 font-medium text-muted-foreground">
              Kandydat
            </TableHead>
            <TableHead className="h-10 px-4 font-medium text-muted-foreground">
              Szablon
            </TableHead>
            <TableHead className="h-10 px-4 font-medium text-muted-foreground">
              Termin
            </TableHead>
            <TableHead className="h-10 px-4 font-medium text-muted-foreground">
              Prowadzi
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {interviews.map((interview, index) => (
            <TableRow
              key={interview.id}
              className="relative h-14 cursor-pointer hover:bg-paper/60"
            >
              <TableCell className="border-r border-border px-4">
                <div className="flex items-center gap-3">
                  <UserAvatar
                    user={interview}
                    className="size-9"
                    fallbackClassName={
                      AVATAR_COLORS[index % AVATAR_COLORS.length]
                    }
                  />
                  <Link
                    to={getCandidateLink(editionId, interview)}
                    state={{ tab: 'interviews', interviewId: interview.id }}
                    className="min-w-0 truncate font-medium text-foreground after:absolute after:inset-0 hover:underline"
                  >
                    {getDisplayName(interview)}
                  </Link>
                </div>
              </TableCell>
              <TableCell className="px-4 text-muted-foreground">
                {interview.template_name}
              </TableCell>
              <TableCell className="px-4 text-muted-foreground">
                {formatInterviewTerm(interview)}
              </TableCell>
              <TableCell className="px-4 whitespace-normal text-muted-foreground">
                {formatInterviewers(interview)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}

function InterviewCards({ interviews, editionId }: InterviewListProps) {
  return (
    <ul className="flex flex-col gap-3 md:hidden">
      {interviews.map((interview, index) => (
        <li key={interview.id}>
          <Link
            to={getCandidateLink(editionId, interview)}
            state={{ tab: 'interviews', interviewId: interview.id }}
            className="group/link block rounded-2xl"
          >
            <Card className="gap-0 rounded-2xl p-4 shadow-card ring-border transition-colors group-hover/link:bg-paper/60">
              <div className="flex items-center gap-3">
                <UserAvatar
                  user={interview}
                  className="size-10"
                  fallbackClassName={
                    AVATAR_COLORS[index % AVATAR_COLORS.length]
                  }
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-semibold text-foreground">
                    {getDisplayName(interview)}
                  </p>
                  <p className="truncate text-[13px] text-muted-foreground">
                    {interview.template_name}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-[13px] text-muted-foreground">
                {formatInterviewTerm(interview)} ·{' '}
                {formatInterviewers(interview)}
              </p>
            </Card>
          </Link>
        </li>
      ))}
    </ul>
  )
}

function AllInterviewsTab({ editionId }: { editionId: number }) {
  const [query, setQuery] = useState('')
  const [search, setSearch] = useState('')
  const [loaded, setLoaded] = useState<LoadedInterviews | null>(null)
  const path = `editions/${editionId}/interviews/${search ? `?${new URLSearchParams({ search })}` : ''}`

  useEffect(() => {
    api<EditionInterview[]>(path)
      .then((data) => setLoaded({ key: path, data, error: '' }))
      .catch(() =>
        setLoaded({
          key: path,
          data: null,
          error: 'Nie udało się wczytać rozmów.',
        }),
      )
  }, [path])

  useEffect(() => {
    const timer = setTimeout(() => setSearch(query.trim()), 300)
    return () => clearTimeout(timer)
  }, [query])

  const data = loaded?.data

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <ApplicationFilters search={query} onSearchChange={setQuery} />
      {loaded?.error && <ErrorAlert>{loaded.error}</ErrorAlert>}
      {!loaded && <Skeleton className="h-64 w-full rounded-2xl" />}
      {data && data.length === 0 && (
        <p className="text-sm text-muted-foreground">
          {search
            ? 'Nie ma rozmów z kandydatem o takich danych.'
            : 'Nie ma jeszcze żadnych rozmów. Dodasz je w karcie kandydata, w zakładce Rozmowy.'}
        </p>
      )}
      {data && data.length > 0 && (
        <>
          <InterviewTable interviews={data} editionId={editionId} />
          <InterviewCards interviews={data} editionId={editionId} />
        </>
      )}
    </div>
  )
}

export { AllInterviewsTab }

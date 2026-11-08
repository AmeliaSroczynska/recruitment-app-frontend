import { Download, FileText, Info } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ErrorAlert } from '@/components/panel/ErrorAlert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api'
import type { KnowledgeDocument } from '@/panel/onboarding'

type CandidateDocumentsProps = {
  applicationId: number
}

function CandidateDocuments({ applicationId }: CandidateDocumentsProps) {
  const [documents, setDocuments] = useState<KnowledgeDocument[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api<KnowledgeDocument[]>(`me/applications/${applicationId}/documents/`)
      .then(setDocuments)
      .catch(() => setError('Nie udało się wczytać dokumentów.'))
  }, [applicationId])

  if (error) {
    return <ErrorAlert>{error}</ErrorAlert>
  }

  if (!documents) {
    return <Skeleton className="h-48 w-full rounded-2xl" />
  }

  if (documents.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Zespół nie dodał jeszcze żadnych dokumentów.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="flex items-start gap-2 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" />
        Tutaj znajdziesz dokumenty, które warto przeczytać na start, na przykład
        regulamin albo poradniki.
      </p>
      <Card className="gap-0 rounded-2xl bg-card py-0 shadow-card ring-border">
        <ul className="divide-y divide-border">
          {documents.map((document) => (
            <li key={document.id} className="flex items-center gap-3 px-5 py-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-paper text-muted-foreground">
                <FileText className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="truncate text-sm font-medium text-foreground">
                    {document.name}
                  </span>
                  <Badge variant="outline" className="shrink-0">
                    {document.file_type}
                  </Badge>
                </span>
                {document.description && (
                  <span className="mt-0.5 block text-[13px] text-muted-foreground">
                    {document.description}
                  </span>
                )}
              </span>
              <Button
                variant="outline"
                size="icon"
                aria-label={`Pobierz ${document.name}`}
                className="shrink-0"
                render={
                  <a
                    href={document.file_url}
                    target="_blank"
                    rel="noreferrer"
                  />
                }
                nativeButton={false}
              >
                <Download />
              </Button>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

export { CandidateDocuments }

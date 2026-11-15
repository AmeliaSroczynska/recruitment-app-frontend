import { Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FieldError } from '@/components/ui/field'
import { api, ApiError } from '@/lib/api'
import type { ApplicationDetail } from '@/panel/applications'

type AiAnalysisCardProps = {
  analysis: string | null
  path: string
  canGenerate: boolean
  onGenerated: (application: ApplicationDetail) => void
}

function AiAnalysisCard({
  analysis,
  path,
  canGenerate,
  onGenerated,
}: AiAnalysisCardProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')

  async function generate() {
    setError('')
    setIsGenerating(true)
    try {
      onGenerated(await api<ApplicationDetail>(path, { method: 'POST' }))
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : 'Brak połączenia z serwerem. Spróbuj ponownie.',
      )
    }
    setIsGenerating(false)
  }

  return (
    <Card className="gap-0 rounded-2xl bg-paper py-5 shadow-card ring-sand/70 md:py-6">
      <CardContent className="flex flex-col gap-3 px-5 md:px-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 font-heading text-base font-semibold text-ochre-dark">
            <Sparkles className="size-4" />
            Analiza AI
          </h2>
          {canGenerate && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isGenerating}
              onClick={generate}
              className="rounded-[10px] bg-card"
            >
              {isGenerating
                ? 'Analizuję...'
                : analysis
                  ? 'Wygeneruj ponownie'
                  : 'Wygeneruj analizę'}
            </Button>
          )}
        </div>
        {analysis ? (
          <>
            <p className="text-sm whitespace-pre-line text-foreground">
              {analysis}
            </p>
            <p className="text-xs text-muted-foreground">
              Wygenerowane przez AI - sprawdź przed decyzją.
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            Ten kandydat nie ma jeszcze analizy AI.
          </p>
        )}
        {error && <FieldError>{error}</FieldError>}
      </CardContent>
    </Card>
  )
}

export { AiAnalysisCard }

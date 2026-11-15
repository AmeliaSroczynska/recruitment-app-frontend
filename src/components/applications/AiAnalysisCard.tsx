import { Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

type AiAnalysisCardProps = {
  analysis: string | null
}

function AiAnalysisCard({ analysis }: AiAnalysisCardProps) {
  return (
    <Card className="gap-0 rounded-2xl bg-paper py-5 shadow-card ring-sand/70 md:py-6">
      <CardContent className="flex flex-col gap-3 px-5 md:px-6">
        <h2 className="flex items-center gap-2 font-heading text-base font-semibold text-ochre-dark">
          <Sparkles className="size-4" />
          Analiza AI
        </h2>
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
      </CardContent>
    </Card>
  )
}

export { AiAnalysisCard }

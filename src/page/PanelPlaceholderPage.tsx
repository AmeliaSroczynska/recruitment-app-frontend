import { Link } from 'react-router-dom'

type PanelPlaceholderPageProps = {
  panel: 'candidate' | 'organization'
}

function PanelPlaceholderPage({ panel }: PanelPlaceholderPageProps) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-3 bg-background p-6 text-center">
      <h1 className="font-heading text-2xl font-extrabold text-foreground">
        Panel jest w budowie
      </h1>
      <Link
        to={`/login/${panel}/organization`}
        className="text-sm text-ochre-dark"
      >
        Wróć do wyboru organizacji
      </Link>
    </main>
  )
}

export default PanelPlaceholderPage

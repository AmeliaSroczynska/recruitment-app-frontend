import { EmailLoginForm } from '@/components/login/EmailLoginForm'
import { LoginLayout } from '@/components/login/LoginLayout'

function OrganizationLoginPage() {
  return (
    <LoginLayout
      mirrored
      artTitle="Prowadź rekrutację w jednym miejscu."
      artDescription="Zgłoszenia, rozmowy, wdrożenia i statystyki Twojej organizacji."
      mobileTitle="Cześć!"
      mobileDescription="Witaj w panelu rekrutera."
    >
      <EmailLoginForm
        description="Podaj e-mail, na który koordynator rekrutacji dodał Cię do Twojej organizacji. Wyślemy Ci jednorazowy kod."
        emailPlaceholder="hanna@organizacja.app"
        nextPath="/login/organization/code"
      />
    </LoginLayout>
  )
}

export default OrganizationLoginPage

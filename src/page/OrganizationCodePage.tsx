import { CodeLoginForm } from '@/components/login/CodeLoginForm'
import { LoginLayout } from '@/components/login/LoginLayout'

function OrganizationCodePage() {
  return (
    <LoginLayout
      mirrored
      artTitle="Prowadź rekrutację w jednym miejscu."
      artDescription="Zgłoszenia, rozmowy, wdrożenia i statystyki Twojej organizacji."
      mobileTitle="Cześć!"
      mobileDescription="Witaj w panelu rekrutera."
    >
      <CodeLoginForm
        emailPath="/login/organization"
        nextPath="/login/organization/organization"
      />
    </LoginLayout>
  )
}

export default OrganizationCodePage

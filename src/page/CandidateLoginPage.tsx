import { EmailLoginForm } from '@/components/login/EmailLoginForm'
import { LoginLayout } from '@/components/login/LoginLayout'

function CandidateLoginPage() {
  return (
    <LoginLayout
      mirrored
      artTitle="Śledź swoją rekrutację w jednym miejscu."
      artDescription="Sprawdzisz status zgłoszenia, zapiszesz się na rozmowę, a po przyjęciu zaczniesz wdrożenie."
      mobileTitle="Cześć!"
      mobileDescription="Witaj w panelu kandydata."
    >
      <EmailLoginForm
        description="Podaj e-mail podany w formularzu rejestracyjnym. Wyślemy Ci jednorazowy kod."
        emailPlaceholder="julia.kowalska@gmail.com"
        nextPath="/login/candidate/code"
      />
    </LoginLayout>
  )
}

export default CandidateLoginPage

import { CodeLoginForm } from '@/components/login/CodeLoginForm'
import { LoginLayout } from '@/components/login/LoginLayout'

function CandidateCodePage() {
  return (
    <LoginLayout
      mirrored
      artTitle="Śledź swoją rekrutację w jednym miejscu."
      artDescription="Sprawdzisz status zgłoszenia, zapiszesz się na rozmowę, a po przyjęciu zaczniesz wdrożenie."
      mobileTitle="Cześć!"
      mobileDescription="Witaj w panelu kandydata."
    >
      <CodeLoginForm
        emailPath="/login/candidate"
        nextPath="/login/candidate/organization"
      />
    </LoginLayout>
  )
}

export default CandidateCodePage

import { AnswerList } from '@/components/applications/AnswerList'
import { CandidatePage } from '@/components/candidate/CandidatePage'
import { UserAvatar } from '@/components/panel/UserAvatar'
import { Card } from '@/components/ui/card'
import { useCandidateApplication } from '@/panel/candidate'
import { getDisplayName } from '@/panel/user'

function CandidateApplicationPage() {
  const application = useCandidateApplication()

  return (
    <CandidatePage title="Twoje zgłoszenie">
      <div className="flex max-w-[860px] flex-col gap-4 md:gap-5">
        <Card className="flex-row items-center gap-4 rounded-2xl p-5 shadow-card ring-border">
          <UserAvatar
            user={application}
            className="size-16 md:size-[86px]"
            fallbackClassName="bg-sand text-xl md:text-[28px]"
          />
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold text-foreground md:text-xl">
              {getDisplayName(application)}
            </p>
            <p className="truncate text-sm text-muted-foreground">
              {application.email}
            </p>
          </div>
        </Card>
        <AnswerList answers={application.answers} />
      </div>
    </CandidatePage>
  )
}

export default CandidateApplicationPage

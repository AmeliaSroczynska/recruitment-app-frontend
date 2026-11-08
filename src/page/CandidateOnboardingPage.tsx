import { CandidatePage } from '@/components/candidate/CandidatePage'
import { CandidateTaskList } from '@/components/candidate/CandidateTaskList'
import { OnboardingLocked } from '@/components/candidate/OnboardingLocked'
import { PanelTabsTrigger } from '@/components/panel/PanelTabs'
import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs'
import { useCandidateApplication } from '@/panel/candidate'
import { ONBOARDING_SECTIONS } from '@/panel/onboarding'

function CandidateOnboardingPage() {
  const application = useCandidateApplication()

  if (application.status !== 'accepted') {
    return (
      <CandidatePage title="Wdrożenie">
        <OnboardingLocked />
      </CandidatePage>
    )
  }

  return (
    <CandidatePage title="Wdrożenie">
      <Tabs defaultValue="tasks" className="max-w-[860px] gap-5">
        <div className="border-b border-border">
          <TabsList
            variant="line"
            className="gap-5 p-0 group-data-horizontal/tabs:h-10"
          >
            {ONBOARDING_SECTIONS.map((section) => (
              <PanelTabsTrigger key={section.path} value={section.path}>
                {section.label}
              </PanelTabsTrigger>
            ))}
          </TabsList>
        </div>
        <TabsContent value="tasks">
          <CandidateTaskList applicationId={application.id} />
        </TabsContent>
        {ONBOARDING_SECTIONS.filter((section) => section.path !== 'tasks').map(
          (section) => (
            <TabsContent key={section.path} value={section.path}>
              <p className="text-sm text-muted-foreground">
                Ten widok jest jeszcze w budowie
              </p>
            </TabsContent>
          ),
        )}
      </Tabs>
    </CandidatePage>
  )
}

export default CandidateOnboardingPage

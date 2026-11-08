import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '@/auth/AuthProvider'
import { RequireAuth } from '@/auth/RequireAuth'
import ApplicationDetailPage from '@/page/ApplicationDetailPage'
import ApplicationsPage from '@/page/ApplicationsPage'
import CandidateApplicationPage from '@/page/CandidateApplicationPage'
import CandidateCodePage from '@/page/CandidateCodePage'
import CandidateHomePage from '@/page/CandidateHomePage'
import CandidateLayout from '@/page/CandidateLayout'
import CandidateLoginPage from '@/page/CandidateLoginPage'
import CandidateOnboardingPage from '@/page/CandidateOnboardingPage'
import CreateOrganizationPage from '@/page/CreateOrganizationPage'
import FaqPage from '@/page/FaqPage'
import FormsPage from '@/page/FormsPage'
import KnowledgePage from '@/page/KnowledgePage'
import MentorProfilePage from '@/page/MentorProfilePage'
import MentorsPage from '@/page/MentorsPage'
import MorePage from '@/page/MorePage'
import OrganizationChoicePage from '@/page/OrganizationChoicePage'
import OrganizationCodePage from '@/page/OrganizationCodePage'
import OrganizationLoginPage from '@/page/OrganizationLoginPage'
import PanelChoicePage from '@/page/PanelChoicePage'
import PanelLayout from '@/page/PanelLayout'
import PanelSectionPage from '@/page/PanelSectionPage'
import PublicFormPage from '@/page/PublicFormPage'
import SettingsPage from '@/page/SettingsPage'
import TasksPage from '@/page/TasksPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<PanelChoicePage />} />
          <Route path="/form/:slug" element={<PublicFormPage />} />
          <Route path="/login/candidate" element={<CandidateLoginPage />} />
          <Route path="/login/candidate/code" element={<CandidateCodePage />} />
          <Route
            path="/login/organization"
            element={<OrganizationLoginPage />}
          />
          <Route
            path="/login/organization/code"
            element={<OrganizationCodePage />}
          />
          <Route element={<RequireAuth />}>
            <Route
              path="/login/candidate/organization"
              element={<OrganizationChoicePage panel="candidate" />}
            />
            <Route
              path="/login/organization/organization"
              element={<OrganizationChoicePage panel="organization" />}
            />
            <Route
              path="/login/organization/new"
              element={<CreateOrganizationPage />}
            />
            <Route path="/candidate/:editionId" element={<CandidateLayout />}>
              <Route index element={<CandidateHomePage />} />
              <Route
                path="application"
                element={<CandidateApplicationPage />}
              />
              <Route path="onboarding" element={<CandidateOnboardingPage />} />
            </Route>
            <Route path="/organization/:editionId" element={<PanelLayout />}>
              <Route index element={<Navigate to="applications" replace />} />
              <Route path="applications" element={<ApplicationsPage />} />
              <Route
                path="applications/:applicationId"
                element={<ApplicationDetailPage />}
              />
              <Route path="more" element={<MorePage />} />
              <Route path="forms" element={<FormsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="tasks" element={<TasksPage />} />
              <Route path="mentors" element={<MentorsPage />} />
              <Route path="mentors/:mentorId" element={<MentorProfilePage />} />
              <Route path="knowledge" element={<KnowledgePage />} />
              <Route path="faq" element={<FaqPage />} />
              <Route path=":section" element={<PanelSectionPage />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

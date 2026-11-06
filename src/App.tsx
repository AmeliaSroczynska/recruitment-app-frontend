import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '@/auth/AuthProvider'
import { RequireAuth } from '@/auth/RequireAuth'
import CandidateCodePage from '@/page/CandidateCodePage'
import CandidateLoginPage from '@/page/CandidateLoginPage'
import CreateOrganizationPage from '@/page/CreateOrganizationPage'
import MorePage from '@/page/MorePage'
import OrganizationChoicePage from '@/page/OrganizationChoicePage'
import OrganizationCodePage from '@/page/OrganizationCodePage'
import OrganizationLoginPage from '@/page/OrganizationLoginPage'
import PanelChoicePage from '@/page/PanelChoicePage'
import PanelLayout from '@/page/PanelLayout'
import PanelPlaceholderPage from '@/page/PanelPlaceholderPage'
import PanelSectionPage from '@/page/PanelSectionPage'
import SettingsPage from '@/page/SettingsPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<PanelChoicePage />} />
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
            <Route
              path="/candidate/:editionId"
              element={<PanelPlaceholderPage panel="candidate" />}
            />
            <Route path="/organization/:editionId" element={<PanelLayout />}>
              <Route index element={<Navigate to="applications" replace />} />
              <Route path="more" element={<MorePage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path=":section" element={<PanelSectionPage />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

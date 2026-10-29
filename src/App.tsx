import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import CandidateCodePage from '@/page/CandidateCodePage'
import CandidateLoginPage from '@/page/CandidateLoginPage'
import OrganizationCodePage from '@/page/OrganizationCodePage'
import OrganizationLoginPage from '@/page/OrganizationLoginPage'
import PanelChoicePage from '@/page/PanelChoicePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<PanelChoicePage />} />
        <Route path="/login/candidate" element={<CandidateLoginPage />} />
        <Route path="/login/candidate/code" element={<CandidateCodePage />} />
        <Route path="/login/organization" element={<OrganizationLoginPage />} />
        <Route
          path="/login/organization/code"
          element={<OrganizationCodePage />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App

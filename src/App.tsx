import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import CandidateLoginPage from '@/page/CandidateLoginPage'
import OrganizationLoginPage from '@/page/OrganizationLoginPage'
import PanelChoicePage from '@/page/PanelChoicePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<PanelChoicePage />} />
        <Route path="/login/candidate" element={<CandidateLoginPage />} />
        <Route path="/login/organization" element={<OrganizationLoginPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

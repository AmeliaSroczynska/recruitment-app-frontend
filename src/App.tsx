import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import PanelChoicePage from '@/page/PanelChoicePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<PanelChoicePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

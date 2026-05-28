import { Routes, Route } from 'react-router'
import Layout from '@/components/Layout'
import HomePage from '@/pages/HomePage'
import InsightsPage from '@/pages/InsightsPage'
import SkillHubPage from '@/pages/SkillHubPage'
import KnowledgePage from '@/pages/KnowledgePage'
import PosterPage from '@/pages/PosterPage'
import LoginPage from '@/pages/LoginPage'
import { AuthProvider } from '@/lib/auth'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/skillhub" element={<SkillHubPage />} />
          <Route path="/knowledge" element={<KnowledgePage />} />
          <Route path="/poster" element={<PosterPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
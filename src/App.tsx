import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider } from './lib/authContext'
import Layout from './components/Layout'
import SplashScreen from './components/SplashScreen'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import CursoDetallePage from './pages/CursoDetallePage'
import AprenderPage from './pages/AprenderPage'
import MiProgresoPage from './pages/MiProgresoPage'

export default function App() {
  const [splashDone, setSplashDone] = useState(false)

  return (
    <BrowserRouter>
      <AuthProvider>
        <AnimatePresence>
          {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}
        </AnimatePresence>

        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/curso/:slug" element={<CursoDetallePage />} />
            <Route path="/curso/:slug/aprender" element={<AprenderPage />} />
            <Route path="/mi-progreso" element={<MiProgresoPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  )
}

import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import ParticlesCanvas from './ParticlesCanvas'
import { useAuth } from '../lib/authContext'
import { BG, VDIM, VBORDER, VL, GRAD } from '../lib/theme'

export default function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: 'Inter, system-ui, -apple-system, sans-serif', color: '#fff', overflowX: 'hidden' }}>
      <ParticlesCanvas />

      {/* Top glow */}
      <div style={{
        position: 'fixed', top: '-220px', left: '50%', transform: 'translateX(-50%)',
        width: '700px', height: '450px',
        background: 'radial-gradient(ellipse,rgba(139,53,232,0.2) 0%,transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          position: 'relative', zIndex: 10,
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(16px)',
          background: 'rgba(8,8,24,0.75)',
        }}
      >
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
            <img src="/alma-logo.png" alt="Alma" style={{ height: '72px', width: 'auto', objectFit: 'contain' }} />
          </Link>

          <nav style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link to="/" style={navLinkStyle}>Recursos</Link>
            {user ? (
              <>
                <Link to="/mi-progreso" style={navLinkStyle}>Mi progreso</Link>
                <button onClick={handleLogout} style={{ ...navLinkStyle, background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}>
                  Salir
                </button>
              </>
            ) : (
              <Link
                to="/login"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  background: VDIM, border: `1px solid ${VBORDER}`,
                  color: VL, fontSize: '13px', fontWeight: 700,
                  padding: '8px 16px', borderRadius: '20px', textDecoration: 'none',
                }}
              >
                Entrar a mi aula
              </Link>
            )}
          </nav>
        </div>
      </motion.header>

      {children}

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.07)', background: 'rgba(0,0,0,0.25)', position: 'relative', zIndex: 1 }}>
        <div style={{
          maxWidth: '1000px', margin: '0 auto', padding: '20px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontSize: '12px', color: 'rgba(255,255,255,0.22)', flexWrap: 'wrap', gap: '10px',
        }}>
          <span>© Alma Creative Intelligence Studio</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: GRAD }} />
            Academia · Alma Agencia Creativa
          </span>
        </div>
      </footer>
    </div>
  )
}

const navLinkStyle: React.CSSProperties = {
  color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: 600,
  textDecoration: 'none', padding: '8px 10px',
}

import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../lib/authContext'
import { CARD, VL, VBORDER, GRAD } from '../lib/theme'

type Mode = 'login' | 'registro'

export default function LoginPage() {
  const { user, loading, login, registrar } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const redirect = params.get('redirect') || '/mi-progreso'

  const [mode, setMode]         = useState<Mode>('login')
  const [nombre, setNombre]     = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [busy, setBusy]         = useState(false)

  // Ya autenticado → salir de la pantalla de login
  useEffect(() => {
    if (!loading && user) navigate(redirect, { replace: true })
  }, [loading, user, navigate, redirect])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      if (mode === 'registro') {
        if (!nombre.trim()) { setError('Escribe tu nombre'); setBusy(false); return }
        await registrar(nombre, email, password)
      } else {
        await login(email, password)
      }
      navigate(redirect, { replace: true })
    } catch (err) {
      setError(errorMsg(err))
    } finally {
      setBusy(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px', borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(0,0,0,0.25)',
    color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
  }

  return (
    <section style={{ position: 'relative', zIndex: 1, maxWidth: '440px', margin: '0 auto', padding: '64px 24px 96px' }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ background: CARD, border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '32px 28px' }}
      >
        <h1 style={{ margin: '0 0 6px', fontSize: '24px', fontWeight: 900 }}>
          {mode === 'login' ? 'Entra a tu aula' : 'Crea tu cuenta'}
        </h1>
        <p style={{ margin: '0 0 24px', color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
          {mode === 'login' ? 'Accede para retomar tus cursos.' : 'Regístrate gratis para inscribirte y guardar tu progreso.'}
        </p>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '22px' }}>
          {(['login', 'registro'] as Mode[]).map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setError('') }}
              style={{
                flex: 1, padding: '10px', borderRadius: '10px', cursor: 'pointer',
                border: `1px solid ${mode === m ? VBORDER : 'rgba(255,255,255,0.1)'}`,
                background: mode === m ? 'rgba(139,53,232,0.15)' : 'transparent',
                color: mode === m ? VL : 'rgba(255,255,255,0.5)',
                fontWeight: 700, fontSize: '13px',
              }}
            >
              {m === 'login' ? 'Iniciar sesión' : 'Registrarme'}
            </button>
          ))}
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {mode === 'registro' && (
            <div>
              <label style={labelStyle}>Nombre</label>
              <input value={nombre} onChange={e => setNombre(e.target.value)} style={inputStyle} placeholder="Tu nombre" autoComplete="name" />
            </div>
          )}
          <div>
            <label style={labelStyle}>Correo</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} placeholder="tu@correo.com" autoComplete="email" required />
          </div>
          <div>
            <label style={labelStyle}>Contraseña</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} placeholder="••••••••" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} required minLength={6} />
          </div>

          {error && (
            <p style={{ margin: 0, color: '#F87171', fontSize: '13px' }}>⚠️ {error}</p>
          )}

          <button
            type="submit"
            disabled={busy}
            style={{
              marginTop: '4px', padding: '13px', borderRadius: '12px', border: 'none',
              background: busy ? 'rgba(139,53,232,0.4)' : GRAD, color: '#fff',
              fontWeight: 700, fontSize: '15px', cursor: busy ? 'not-allowed' : 'pointer',
            }}
          >
            {busy ? 'Un momento…' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
          </button>
        </form>
      </motion.div>
    </section>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: '6px',
}

function errorMsg(err: unknown): string {
  const code = (err as { code?: string })?.code ?? ''
  if (code.includes('email-already-in-use')) return 'Ese correo ya está registrado. Inicia sesión.'
  if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found')) return 'Correo o contraseña incorrectos.'
  if (code.includes('weak-password')) return 'La contraseña debe tener al menos 6 caracteres.'
  if (code.includes('invalid-email')) return 'El correo no es válido.'
  return 'No se pudo completar. Intenta de nuevo.'
}

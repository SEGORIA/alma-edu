import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../lib/authContext'
import { getCursoBySlug, getInscripcion, inscribir } from '../lib/db'
import { CURSO_CATEGORIAS, NIVEL_LABEL, totalLecciones, type Curso } from '../lib/types'
import { IconPlay, IconArrowLeft } from '../components/icons'
import { CARD, VL, VDIM, VBORDER, GRAD } from '../lib/theme'

export default function CursoDetallePage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [curso, setCurso]       = useState<Curso | null | undefined>(undefined)
  const [inscrito, setInscrito] = useState(false)
  const [busy, setBusy]         = useState(false)

  useEffect(() => {
    if (!slug) return
    getCursoBySlug(slug).then(setCurso)
  }, [slug])

  useEffect(() => {
    if (!user || !curso) return
    getInscripcion(user.uid, curso._id).then(i => setInscrito(!!i))
  }, [user, curso])

  const handleInscribir = async () => {
    if (!curso) return
    if (!user) { navigate(`/login?redirect=/curso/${curso.slug}`); return }
    setBusy(true)
    try {
      await inscribir(user.uid, curso._id)
      setInscrito(true)
      navigate(`/curso/${curso.slug}/aprender`)
    } finally {
      setBusy(false)
    }
  }

  if (curso === undefined) {
    return <div style={{ padding: '80px 24px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>Cargando…</div>
  }
  if (curso === null) {
    return (
      <div style={{ padding: '80px 24px', textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>
        <p style={{ fontSize: '18px', fontWeight: 700 }}>Curso no encontrado</p>
        <Link to="/" style={{ color: VL, fontWeight: 600 }}>← Volver al inicio</Link>
      </div>
    )
  }

  const cat = CURSO_CATEGORIAS.find(c => c.value === curso.categoria)
  const nLecc = totalLecciones(curso)

  return (
    <section style={{ position: 'relative', zIndex: 1, maxWidth: '860px', margin: '0 auto', padding: '40px 24px 96px' }}>
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.55)', textDecoration: 'none', fontSize: '13px', fontWeight: 600, marginBottom: '24px' }}>
        <IconArrowLeft /> Volver
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Portada */}
        <div style={{
          height: '200px', borderRadius: '20px', overflow: 'hidden', marginBottom: '24px',
          background: curso.imagen_portada ? `url(${curso.imagen_portada}) center/cover` : GRAD,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px',
        }}>
          {!curso.imagen_portada && (cat?.icon ?? '📚')}
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: VDIM, border: `1px solid ${VBORDER}`, color: VL, fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: '20px' }}>
            {cat?.icon} {cat?.label ?? curso.categoria}
          </span>
          {curso.nivel && (
            <span style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.55)', fontSize: '11px', fontWeight: 600, padding: '4px 12px', borderRadius: '20px' }}>
              {NIVEL_LABEL[curso.nivel]}
            </span>
          )}
        </div>

        <h1 style={{ margin: '0 0 12px', fontSize: 'clamp(26px,5vw,38px)', fontWeight: 900, lineHeight: 1.15 }}>
          {curso.titulo}
        </h1>
        <p style={{ margin: '0 0 20px', color: 'rgba(255,255,255,0.6)', fontSize: '16px', lineHeight: 1.65 }}>
          {curso.descripcion}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap', marginBottom: '28px', color: 'rgba(255,255,255,0.45)', fontSize: '13px' }}>
          <span>📚 {curso.modulos.length} módulo{curso.modulos.length !== 1 ? 's' : ''}</span>
          <span>🎬 {nLecc} lección{nLecc !== 1 ? 'es' : ''}</span>
          {curso.instructor && <span>👤 {curso.instructor}</span>}
        </div>

        <button
          onClick={inscrito ? () => navigate(`/curso/${curso.slug}/aprender`) : handleInscribir}
          disabled={busy}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            background: GRAD, color: '#fff', padding: '14px 30px', borderRadius: '14px',
            fontWeight: 700, fontSize: '15px', border: 'none', cursor: busy ? 'not-allowed' : 'pointer',
            boxShadow: '0 0 32px rgba(139,53,232,0.35)', marginBottom: '40px',
          }}
        >
          <IconPlay /> {busy ? 'Un momento…' : inscrito ? 'Continuar curso' : 'Inscribirme gratis'}
        </button>

        {/* Temario */}
        <h2 style={{ margin: '0 0 16px', fontSize: '20px', fontWeight: 800 }}>Contenido del curso</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {curso.modulos.map((m, mi) => (
            <div key={m.id} style={{ background: CARD, border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, color: VL, letterSpacing: '1px', textTransform: 'uppercase' }}>Módulo {mi + 1}</p>
                <p style={{ margin: '3px 0 0', fontSize: '15px', fontWeight: 700 }}>{m.titulo}</p>
              </div>
              <div>
                {m.lecciones.map((l, li) => (
                  <div key={l.id} style={{
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px',
                    borderTop: li === 0 ? 'none' : '1px solid rgba(255,255,255,0.04)',
                  }}>
                    <span style={{ fontSize: '13px' }}>{l.tipo === 'video' ? '🎬' : '📝'}</span>
                    <span style={{ flex: 1, fontSize: '14px', color: 'rgba(255,255,255,0.75)' }}>{l.titulo || `Lección ${li + 1}`}</span>
                    {l.duracion_min ? <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>{l.duracion_min} min</span> : null}
                  </div>
                ))}
                {m.lecciones.length === 0 && (
                  <p style={{ padding: '12px 20px', margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>Sin lecciones aún.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

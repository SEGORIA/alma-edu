import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../lib/authContext'
import { getCursoBySlug, getInscripcion, setLeccionCompletada } from '../lib/db'
import { totalLecciones, type Curso, type Leccion } from '../lib/types'
import { toEmbedUrl } from '../lib/video'
import { IconCheck, IconArrowLeft } from '../components/icons'
import { CARD, VL, VDIM, VBORDER, GRAD } from '../lib/theme'

export default function AprenderPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { user, loading } = useAuth()

  const [curso, setCurso]           = useState<Curso | null | undefined>(undefined)
  const [completadas, setCompletadas] = useState<string[]>([])
  const [activeId, setActiveId]     = useState<string | null>(null)
  const [ready, setReady]           = useState(false)

  // Requiere sesión
  useEffect(() => {
    if (!loading && !user && slug) navigate(`/login?redirect=/curso/${slug}/aprender`, { replace: true })
  }, [loading, user, slug, navigate])

  // Carga curso + inscripción
  useEffect(() => {
    if (!slug || !user) return
    let active = true
    ;(async () => {
      const c = await getCursoBySlug(slug)
      if (!active) return
      setCurso(c)
      if (c) {
        const insc = await getInscripcion(user.uid, c._id)
        if (!active) return
        if (!insc) { navigate(`/curso/${c.slug}`, { replace: true }); return }
        setCompletadas(insc.leccionesCompletadas ?? [])
      }
      setReady(true)
    })()
    return () => { active = false }
  }, [slug, user, navigate])

  // Lista plana de lecciones en orden
  const flat = useMemo<Leccion[]>(() => {
    if (!curso) return []
    return curso.modulos.flatMap(m => m.lecciones)
  }, [curso])

  // Lección activa por defecto: primera sin completar, o la primera
  useEffect(() => {
    if (!ready || flat.length === 0 || activeId) return
    const firstPending = flat.find(l => !completadas.includes(l.id))
    setActiveId(firstPending?.id ?? flat[0].id)
  }, [ready, flat, completadas, activeId])

  if (loading || curso === undefined || !ready) {
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

  const active = flat.find(l => l.id === activeId) ?? null
  const nTotal = totalLecciones(curso)
  const progreso = nTotal > 0 ? Math.round((completadas.length / nTotal) * 100) : 0

  const toggleCompletada = async (leccionId: string) => {
    if (!user) return
    const next = completadas.includes(leccionId)
      ? completadas.filter(id => id !== leccionId)
      : [...completadas, leccionId]
    setCompletadas(next)
    await setLeccionCompletada(user.uid, curso._id, next, next.length === nTotal)
  }

  const goNext = () => {
    const idx = flat.findIndex(l => l.id === activeId)
    if (idx >= 0 && idx < flat.length - 1) setActiveId(flat[idx + 1].id)
  }

  return (
    <section style={{ position: 'relative', zIndex: 1, maxWidth: '1100px', margin: '0 auto', padding: '32px 24px 96px' }}>
      <Link to={`/curso/${curso.slug}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.55)', textDecoration: 'none', fontSize: '13px', fontWeight: 600, marginBottom: '20px' }}>
        <IconArrowLeft /> {curso.titulo}
      </Link>

      {/* Barra de progreso */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
          <span>Tu progreso</span>
          <span style={{ color: VL, fontWeight: 700 }}>{progreso}%</span>
        </div>
        <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ width: `${progreso}%`, height: '100%', background: GRAD, borderRadius: '3px', transition: 'width 0.3s ease' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 300px', gap: '24px', alignItems: 'start' }}>
        {/* Contenido de la lección */}
        <div style={{ minWidth: 0 }}>
          {active ? (
            <>
              {active.tipo === 'video' && active.video_url ? (
                <div style={{ position: 'relative', paddingTop: '56.25%', borderRadius: '16px', overflow: 'hidden', background: '#000', marginBottom: '20px' }}>
                  <iframe
                    src={toEmbedUrl(active.video_url)}
                    title={active.titulo}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                  />
                </div>
              ) : active.tipo === 'texto' ? (
                <div style={{ background: CARD, border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '28px', marginBottom: '20px', color: 'rgba(255,255,255,0.82)', fontSize: '15px', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
                  {active.contenido_html || 'Esta lección aún no tiene contenido.'}
                </div>
              ) : (
                <div style={{ background: CARD, border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '28px', marginBottom: '20px', color: 'rgba(255,255,255,0.5)' }}>
                  Esta lección aún no tiene contenido.
                </div>
              )}

              <h2 style={{ margin: '0 0 8px', fontSize: '22px', fontWeight: 800 }}>{active.titulo}</h2>

              {/* Recursos de la lección */}
              {active.recursos && active.recursos.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '16px 0' }}>
                  <p style={{ margin: 0, fontSize: '12px', fontWeight: 700, color: VL, letterSpacing: '1px', textTransform: 'uppercase' }}>Recursos</p>
                  {active.recursos.map((r, i) => (
                    <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      📎 {r.nombre}
                    </a>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '20px' }}>
                <button
                  onClick={() => toggleCompletada(active.id)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '12px 22px', borderRadius: '12px', fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                    ...(completadas.includes(active.id)
                      ? { background: 'rgba(34,197,94,0.15)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.3)' }
                      : { background: GRAD, color: '#fff', border: 'none' }),
                  }}
                >
                  <IconCheck /> {completadas.includes(active.id) ? 'Completada' : 'Marcar como completada'}
                </button>
                {flat.findIndex(l => l.id === activeId) < flat.length - 1 && (
                  <button
                    onClick={goNext}
                    style={{ padding: '12px 22px', borderRadius: '12px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', background: 'rgba(255,255,255,0.06)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    Siguiente →
                  </button>
                )}
              </div>
            </>
          ) : (
            <div style={{ padding: '48px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
              Este curso aún no tiene lecciones.
            </div>
          )}
        </div>

        {/* Índice de lecciones */}
        <aside style={{ background: CARD, border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', overflow: 'hidden', position: 'sticky', top: '20px' }}>
          <div style={{ padding: '16px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ margin: 0, fontSize: '13px', fontWeight: 800 }}>Temario</p>
          </div>
          <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {curso.modulos.map((m, mi) => (
              <div key={m.id}>
                <p style={{ margin: 0, padding: '12px 18px 6px', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  {mi + 1}. {m.titulo}
                </p>
                {m.lecciones.map(l => {
                  const done = completadas.includes(l.id)
                  const isActive = l.id === activeId
                  return (
                    <button
                      key={l.id}
                      onClick={() => setActiveId(l.id)}
                      style={{
                        width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '10px 18px', cursor: 'pointer', border: 'none',
                        background: isActive ? VDIM : 'transparent',
                        borderLeft: `3px solid ${isActive ? VBORDER : 'transparent'}`,
                      }}
                    >
                      <span style={{
                        width: '18px', height: '18px', flexShrink: 0, borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px',
                        background: done ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.08)',
                        color: done ? '#4ade80' : 'rgba(255,255,255,0.4)',
                      }}>
                        {done ? '✓' : (l.tipo === 'video' ? '▶' : '·')}
                      </span>
                      <span style={{ flex: 1, fontSize: '13px', color: isActive ? '#fff' : 'rgba(255,255,255,0.65)', lineHeight: 1.35 }}>
                        {l.titulo || 'Lección'}
                      </span>
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  )
}

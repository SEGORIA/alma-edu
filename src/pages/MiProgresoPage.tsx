import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../lib/authContext'
import { getInscripciones, getCursosPublicados } from '../lib/db'
import { totalLecciones, type Curso, type Inscripcion } from '../lib/types'
import CourseCard from '../components/CourseCard'
import { VL, GRAD } from '../lib/theme'

export default function MiProgresoPage() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  const [cursos, setCursos]           = useState<Curso[]>([])
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([])
  const [busy, setBusy]               = useState(true)

  useEffect(() => {
    if (!loading && !user) navigate('/login?redirect=/mi-progreso', { replace: true })
  }, [loading, user, navigate])

  useEffect(() => {
    if (!user) return
    Promise.all([getInscripciones(user.uid), getCursosPublicados()])
      .then(([insc, cur]) => { setInscripciones(insc); setCursos(cur) })
      .finally(() => setBusy(false))
  }, [user])

  if (loading || busy) {
    return <div style={{ padding: '80px 24px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>Cargando…</div>
  }

  const inscritos = inscripciones
    .map(insc => {
      const curso = cursos.find(c => c._id === insc.cursoId)
      if (!curso) return null
      const nTotal = totalLecciones(curso)
      const progreso = nTotal > 0 ? Math.round((insc.leccionesCompletadas.length / nTotal) * 100) : 0
      return { curso, progreso }
    })
    .filter((x): x is { curso: Curso; progreso: number } => x !== null)

  return (
    <section style={{ position: 'relative', zIndex: 1, maxWidth: '1000px', margin: '0 auto', padding: '48px 24px 96px' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p style={{ margin: '0 0 4px', color: VL, fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>Tu aula</p>
        <h1 style={{ margin: '0 0 6px', fontSize: 'clamp(26px,5vw,36px)', fontWeight: 900 }}>
          Hola{user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''} 👋
        </h1>
        <p style={{ margin: '0 0 36px', color: 'rgba(255,255,255,0.5)', fontSize: '15px' }}>
          {inscritos.length > 0 ? 'Retoma donde lo dejaste.' : 'Aún no te has inscrito a ningún curso.'}
        </p>

        {inscritos.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '18px' }}>
            <p style={{ margin: '0 0 20px', color: 'rgba(255,255,255,0.6)', fontSize: '15px' }}>
              Explora el catálogo y empieza tu primer curso gratis.
            </p>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: GRAD, color: '#fff', padding: '12px 26px', borderRadius: '12px', fontWeight: 700, fontSize: '14px', textDecoration: 'none' }}>
              Ver cursos
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '16px' }}>
            {inscritos.map(({ curso, progreso }, i) => (
              <CourseCard key={curso._id} curso={curso} index={i} progreso={progreso} />
            ))}
          </div>
        )}
      </motion.div>
    </section>
  )
}

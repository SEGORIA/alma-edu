import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import HeroSphere from '../components/HeroSphere'
import ResourceCard from '../components/ResourceCard'
import CourseCard from '../components/CourseCard'
import { IconIG, IconStar } from '../components/icons'
import { getRecursosPublicados, getCursosPublicados } from '../lib/db'
import type { Recurso, Curso } from '../lib/types'
import { VDIM, VBORDER, VL, GRAD } from '../lib/theme'

export default function HomePage() {
  const [recursos, setRecursos] = useState<Recurso[]>([])
  const [cursos, setCursos]     = useState<Curso[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([getRecursosPublicados(), getCursosPublicados()])
      .then(([r, c]) => { setRecursos(r); setCursos(c) })
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      {/* ── Hero ── */}
      <section style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto', padding: '64px 24px 40px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginBottom: '28px', filter: 'drop-shadow(0 0 30px rgba(139,53,232,0.45))' }}
          >
            <HeroSphere size={180} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: VDIM, border: `1px solid ${VBORDER}`, color: VL,
              fontSize: '11px', fontWeight: 600, padding: '6px 14px', borderRadius: '20px',
              marginBottom: '22px', letterSpacing: '0.3px',
            }}
          >
            <IconIG /> Academia · Alma Agencia Creativa
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{ margin: '0 0 18px', lineHeight: 1.1, letterSpacing: '-1.5px', fontSize: 'clamp(32px,6vw,54px)', fontWeight: 900 }}
          >
            Aprende a crecer{' '}
            <span style={{ background: GRAD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>con Alma</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            style={{ margin: '0 auto', maxWidth: '480px', color: 'rgba(255,255,255,0.52)', fontSize: '17px', lineHeight: 1.65 }}
          >
            Recursos gratis para empezar hoy y cursos para llevar tu marca al siguiente nivel.
          </motion.p>
        </div>
      </section>

      <main style={{ position: 'relative', zIndex: 1, maxWidth: '1000px', margin: '0 auto', padding: '0 24px 96px' }}>

        {/* ── Recursos gratis ── */}
        <SectionHeader icon="🎁" eyebrow="Empieza gratis" title="Recursos gratis" subtitle="Plantillas y prompts listos para copiar y usar hoy mismo." />

        {loading ? (
          <SkeletonGrid />
        ) : recursos.length === 0 ? (
          <EmptyNote text="Pronto publicaremos los primeros recursos gratis." />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: '16px' }}>
            {recursos.map((r, i) => <ResourceCard key={r._id} recurso={r} index={i} />)}
          </div>
        )}

        {/* ── Cursos ── */}
        <div style={{ marginTop: '72px' }}>
          <SectionHeader icon="📚" eyebrow="Formación" title="Cursos" subtitle="Regístrate gratis para inscribirte y guardar tu progreso." />

          {loading ? (
            <SkeletonGrid />
          ) : cursos.length === 0 ? (
            <EmptyNote text="Estamos preparando los primeros cursos. Vuelve muy pronto." />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '16px' }}>
              {cursos.map((c, i) => <CourseCard key={c._id} curso={c} index={i} />)}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
            <Link
              to="/login"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                background: GRAD, color: '#fff', padding: '14px 30px', borderRadius: '14px',
                fontWeight: 700, fontSize: '15px', textDecoration: 'none',
                boxShadow: '0 0 32px rgba(139,53,232,0.35)',
              }}
            >
              <IconStar /> Entra a tu aula
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}

/* ── Bits ── */
function SectionHeader({ icon, eyebrow, title, subtitle }: { icon: string; eyebrow: string; title: string; subtitle: string }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <p style={{ margin: '0 0 4px', color: VL, fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>{eyebrow}</p>
      <h2 style={{ margin: '0 0 6px', fontSize: 'clamp(22px,4vw,30px)', fontWeight: 900 }}>{icon} {title}</h2>
      <p style={{ margin: 0, color: 'rgba(255,255,255,0.45)', fontSize: '15px' }}>{subtitle}</p>
    </div>
  )
}

function SkeletonGrid() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: '16px' }}>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} style={{ height: '140px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '18px' }} />
      ))}
    </div>
  )
}

function EmptyNote({ text }: { text: string }) {
  return (
    <div style={{ padding: '40px', textAlign: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '18px', color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
      {text}
    </div>
  )
}

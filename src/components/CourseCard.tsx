import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CARD, VL, VDIM, VBORDER, GRAD } from '../lib/theme'
import { CURSO_CATEGORIAS, NIVEL_LABEL, totalLecciones, type Curso } from '../lib/types'

export default function CourseCard({ curso, index = 0, progreso }: {
  curso: Curso; index?: number; progreso?: number
}) {
  const cat = CURSO_CATEGORIAS.find(c => c.value === curso.categoria)
  const nLecc = totalLecciones(curso)

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to={`/curso/${curso.slug}`}
        style={{
          display: 'flex', flexDirection: 'column', height: '100%',
          background: CARD, border: '1px solid rgba(255,255,255,0.07)', borderRadius: '18px',
          overflow: 'hidden', textDecoration: 'none', transition: 'border-color 0.25s ease',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = VBORDER }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)' }}
      >
        {/* Portada */}
        <div style={{
          height: '140px', flexShrink: 0,
          background: curso.imagen_portada
            ? `url(${curso.imagen_portada}) center/cover`
            : GRAD,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '44px',
        }}>
          {!curso.imagen_portada && (cat?.icon ?? '📚')}
        </div>

        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              background: VDIM, border: `1px solid ${VBORDER}`, color: VL,
              fontSize: '10px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px',
            }}>
              {cat?.icon} {cat?.label ?? curso.categoria}
            </span>
            {curso.nivel && (
              <span style={{
                background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.55)',
                fontSize: '10px', fontWeight: 600, padding: '3px 10px', borderRadius: '20px',
              }}>
                {NIVEL_LABEL[curso.nivel]}
              </span>
            )}
          </div>

          <h3 style={{ margin: '0 0 6px', color: '#fff', fontSize: '16px', fontWeight: 800, lineHeight: 1.3 }}>
            {curso.titulo}
          </h3>
          <p style={{ margin: '0 0 14px', color: 'rgba(255,255,255,0.48)', fontSize: '13px', lineHeight: 1.55, flex: 1 }}>
            {curso.descripcion}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
              {curso.modulos.length} módulo{curso.modulos.length !== 1 ? 's' : ''} · {nLecc} lección{nLecc !== 1 ? 'es' : ''}
            </span>
            {curso.instructor && (
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{curso.instructor}</span>
            )}
          </div>

          {typeof progreso === 'number' && (
            <div style={{ marginTop: '14px' }}>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${progreso}%`, height: '100%', background: GRAD, borderRadius: '3px' }} />
              </div>
              <p style={{ margin: '6px 0 0', fontSize: '11px', color: VL, fontWeight: 600 }}>
                {progreso}% completado
              </p>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  )
}

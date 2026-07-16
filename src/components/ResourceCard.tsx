import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCardTilt } from '../hooks/useCardTilt'
import { IconCopy, IconCheck } from './icons'
import { CARD, VL, VBORDER, GRAD } from '../lib/theme'
import { RECURSO_TIPOS, type Recurso } from '../lib/types'

export default function ResourceCard({ recurso, index }: { recurso: Recurso; index: number }) {
  const [copied, setCopied]     = useState(false)
  const [expanded, setExpanded] = useState(false)
  const { ref, onMouseMove, onMouseLeave: tiltLeave } = useCardTilt()

  const tipoMeta = RECURSO_TIPOS[recurso.tipo] ?? RECURSO_TIPOS.otro
  const hasContenido = !!recurso.contenido?.trim()
  const hasUrl = !!recurso.url?.trim()

  const copy = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!recurso.contenido) return
    navigator.clipboard.writeText(recurso.contenido)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    const w = window as unknown as { gtag?: (...a: unknown[]) => void }
    if (typeof w.gtag === 'function') {
      w.gtag('event', 'recurso_copy', { recurso_titulo: recurso.titulo })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: (index % 6) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      style={{ willChange: 'transform' }}
    >
      <div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = VBORDER }}
        onMouseLeave={e => {
          tiltLeave()
          ;(e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)'
        }}
        onClick={() => hasContenido && setExpanded(x => !x)}
        style={{
          background: CARD, border: '1px solid rgba(255,255,255,0.07)', borderRadius: '18px',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          transformStyle: 'preserve-3d', transition: 'border-color 0.25s ease',
          cursor: hasContenido ? 'pointer' : 'default',
        }}
      >
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '30px', lineHeight: 1, flexShrink: 0 }}>{tipoMeta.icon}</span>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: 0, color: '#fff', fontSize: '15px', fontWeight: 700, lineHeight: 1.35 }}>
                {recurso.titulo}
              </h3>
              <p style={{ margin: '6px 0 0', color: 'rgba(255,255,255,0.48)', fontSize: '13px', lineHeight: 1.55 }}>
                {recurso.descripcion}
              </p>
            </div>
            {hasContenido && (
              <motion.svg
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke={VL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ flexShrink: 0, marginTop: '3px' }}
              >
                <polyline points="6 9 12 15 18 9" />
              </motion.svg>
            )}
          </div>

          {hasContenido && (
            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  key="contenido"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{
                    marginTop: '18px', background: 'rgba(0,0,0,0.35)',
                    border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '16px',
                  }}>
                    <pre style={{
                      margin: 0, color: 'rgba(255,255,255,0.78)', fontSize: '12px',
                      whiteSpace: 'pre-wrap', fontFamily: 'inherit', lineHeight: 1.7,
                    }}>
                      {recurso.contenido}
                    </pre>
                  </div>

                  <motion.button
                    onClick={copy}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      marginTop: '14px', width: '100%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      padding: '12px', borderRadius: '10px',
                      fontWeight: 600, fontSize: '13px', cursor: 'pointer', border: 'none',
                      ...(copied
                        ? { background: 'rgba(34,197,94,0.15)', color: '#4ade80', outline: '1px solid rgba(34,197,94,0.3)' }
                        : { background: GRAD, color: '#fff' }),
                    }}
                  >
                    {copied ? <><IconCheck /> ¡Copiado!</> : <><IconCopy /> Copiar</>}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {hasContenido && !expanded && (
            <p style={{ margin: '12px 0 0', color: 'rgba(255,255,255,0.25)', fontSize: '11px', fontWeight: 500 }}>
              Toca para ver el contenido completo
            </p>
          )}

          {!hasContenido && hasUrl && (
            <a
              href={recurso.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{
                marginTop: '16px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '11px', borderRadius: '10px', background: GRAD, color: '#fff',
                fontWeight: 600, fontSize: '13px', textDecoration: 'none',
              }}
            >
              Abrir {tipoMeta.label.toLowerCase()} →
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}

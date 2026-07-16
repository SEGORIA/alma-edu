import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { BG, GRAD } from '../lib/theme'

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // Fallback: auto-dismiss after 4.5s if video doesn't fire onEnded
    timerRef.current = setTimeout(onDone, 4500)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [onDone])

  const handleEnd = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setTimeout(onDone, 300)
  }

  return (
    <motion.div
      key="splash"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: BG,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: '20px',
        // Decorativo: nunca debe interceptar clics del contenido de debajo,
        // ni siquiera durante su animación de salida.
        pointerEvents: 'none',
      }}
    >
      <div style={{
        position: 'absolute', width: '600px', height: '500px',
        background: 'radial-gradient(ellipse, rgba(139,53,232,0.25) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <motion.video
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        autoPlay muted playsInline
        onEnded={handleEnd}
        style={{ width: 'min(380px, 75vw)', height: 'auto', position: 'relative', zIndex: 1, mixBlendMode: 'screen' }}
      >
        <source src="/alma-logo.webm" type="video/webm" />
        <source src="/alma-logo.mp4" type="video/mp4" />
        <img src="/alma-logo.png" alt="Alma" style={{ width: '100%' }} />
      </motion.video>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 3.8, ease: 'linear' }}
        style={{
          position: 'relative', zIndex: 1,
          width: '120px', height: '2px',
          background: GRAD, borderRadius: '2px',
          transformOrigin: 'left',
        }}
      />
    </motion.div>
  )
}

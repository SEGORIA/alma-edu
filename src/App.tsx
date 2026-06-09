import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ParticlesCanvas from './components/ParticlesCanvas'
import HeroSphere from './components/HeroSphere'
import { useCardTilt } from './hooks/useCardTilt'

/* ── Brand tokens ────────────────────────────────────────────────────────────── */
const V = '#8B35E8'
const VL = '#A855F7'
const VDIM = 'rgba(139,53,232,0.15)'
const VBORDER = 'rgba(139,53,232,0.3)'
const BG = '#080818'
const CARD = '#13132a'
const GRAD = `linear-gradient(135deg,${V},#C026D3)`

/* ── Data ────────────────────────────────────────────────────────────────────── */
const hacks = [
  {
    numero: '01',
    titulo: 'Estrategia de contenido mensual',
    descripcion: 'Planifica 30 días de contenido estratégico en minutos. Deja de improvisar y empieza a publicar con propósito.',
    prompt: `Actúa como un estratega de redes sociales experto en Instagram. Necesito un plan de contenido para el mes de [MES] para mi agencia creativa [NOMBRE].

Mi nicho: [DESCRIBE TU NICHO]
Mi público objetivo: [DESCRIBE TU AUDIENCIA]
Mis pilares de contenido: [LISTA 3-4 TEMAS PRINCIPALES]

Crea un calendario con 20 publicaciones que incluya:
- Tipo de contenido (Reel, carrusel, imagen estática, Story)
- Tema específico de cada publicación
- Objetivo de cada post (alcance, engagement, conversión)
- Mejor día y hora para publicar

Equilibra contenido educativo, entretenimiento y ventas en proporción 70/20/10.`,
  },
  {
    numero: '02',
    titulo: 'Captions que generan comentarios',
    descripcion: 'Escribe descripciones que hacen que tu audiencia no pueda evitar interactuar. El engagement que necesitas, sin bloqueo creativo.',
    prompt: `Eres un copywriter especialista en Instagram con historial de generar alto engagement. Escribe 5 versiones de caption para este post:

Tema del post: [DESCRIBE EL CONTENIDO]
Tono de mi marca: [DESCRIBE TU TONO: profesional/cercano/divertido/inspiracional]
Mi audiencia: [DESCRIBE TU AUDIENCIA]

Cada caption debe:
- Comenzar con un gancho irresistible (primera línea que pare el scroll)
- Tener entre 150-300 palabras
- Incluir una pregunta que invite a comentar
- Terminar con un CTA claro
- Incluir espaciado visual con saltos de línea
- Sugerir 3-5 emojis estratégicos

Al final dame el caption que recomiendas usar y explica por qué.`,
  },
  {
    numero: '03',
    titulo: 'Hashtags de nicho estratégicos',
    descripcion: 'Encuentra los hashtags que tu audiencia busca pero tu competencia ignora. Más alcance real, menos ruido.',
    prompt: `Actúa como un experto en SEO para Instagram. Necesito una estrategia completa de hashtags para mi cuenta.

Mi negocio: [DESCRIBE TU NEGOCIO]
Mi nicho: [DESCRIBE TU NICHO]
Mi ubicación (si es relevante): [CIUDAD/PAÍS]
Tipo de contenido que publico: [DESCRIBE TUS POSTS]

Dame una lista de 30 hashtags dividida así:
- 10 hashtags grandes (1M-10M posts) para mayor alcance
- 10 hashtags medianos (100K-1M posts) para audiencia media
- 10 hashtags pequeños de nicho (10K-100K posts) para audiencia muy específica

Para cada categoría explica la estrategia de uso. También dame 5 hashtags de comunidad y cómo usarlos para conectar con creadores de mi nicho.`,
  },
  {
    numero: '04',
    titulo: 'Guión para Reels virales',
    descripcion: 'Crea guiones con estructura probada que maximizan reproducciones y compartidos. Tu próximo viral empieza aquí.',
    prompt: `Eres un director creativo de contenido viral en Instagram. Crea un guión completo para un Reel de [DURACIÓN: 30/60/90 segundos].

Tema del Reel: [TEMA]
Objetivo: [EDUCAR / ENTRETENER / VENDER / INSPIRAR]
Tono: [TONO DE LA MARCA]

El guión debe incluir:
- Hook (primeros 3 segundos): qué se ve en pantalla + qué se dice
- Desarrollo (cuerpo): escena por escena con texto en pantalla y narración
- Cierre y CTA (últimos 5 segundos): llamada a la acción

También dame:
- Texto para el primer frame para parar el scroll
- Sugerencia de música o sonido tendencia
- Ideas para la miniatura (cover del Reel)
- Caption de 100 palabras para acompañar el Reel`,
  },
  {
    numero: '05',
    titulo: 'Análisis de competencia profundo',
    descripcion: 'Descubre exactamente qué hace tu competencia y cómo superarla. El framework que usan las agencias top.',
    prompt: `Actúa como un analista de marketing digital especializado en Instagram. Voy a darte información sobre 3 competidores y necesito un análisis estratégico.

Mi cuenta: [DESCRIBE TU CUENTA Y NICHO]
Competidor 1: [CUENTA + DESCRIPCIÓN]
Competidor 2: [CUENTA + DESCRIPCIÓN]
Competidor 3: [CUENTA + DESCRIPCIÓN]

Analiza cada uno y dime:
1. ¿Qué tipos de contenido generan más engagement?
2. ¿Qué frecuencia de publicación usan?
3. ¿Cuál es su propuesta de valor diferencial?
4. ¿Qué están haciendo bien que yo debería adoptar?
5. ¿Qué huecos o oportunidades están dejando que yo puedo aprovechar?

Concluye con una estrategia de diferenciación específica para mi cuenta.`,
  },
  {
    numero: '06',
    titulo: 'Bio que convierte visitas en seguidores',
    descripcion: 'Optimiza tu bio para que cada visitante sepa por qué debe seguirte. 150 caracteres que valen oro.',
    prompt: `Eres un especialista en optimización de perfiles de Instagram con experiencia en growth hacking. Necesito reescribir mi bio.

Mi negocio/marca: [NOMBRE Y DESCRIPCIÓN]
Lo que hago: [DESCRIBE TU SERVICIO/PRODUCTO]
Para quién: [DESCRIBE TU CLIENTE IDEAL]
Mi propuesta de valor única: [QUÉ TE DIFERENCIA]
Mi CTA actual (enlace en bio): [DÓNDE DIRIGES A LA GENTE]

Crea 3 versiones de bio considerando:
- Máximo 150 caracteres
- Primera línea como headline con tu diferencial
- Uso estratégico de emojis (máximo 3)
- Palabras clave relevantes para búsqueda
- CTA claro hacia el enlace en bio

Para cada versión explica qué perfil de audiencia atraería mejor. Dame también ideas para el nombre del perfil para mejorar la búsqueda.`,
  },
  {
    numero: '07',
    titulo: 'Identidad visual coherente',
    descripcion: 'Define la estética de tu feed y crea un sistema visual que haga reconocible tu marca al instante.',
    prompt: `Actúa como un director de arte especializado en branding para Instagram. Necesito crear una identidad visual coherente para mi perfil.

Mi marca: [NOMBRE]
Sector/nicho: [DESCRIBE TU INDUSTRIA]
Personalidad de marca (elige 3-5 adjetivos): [ej: moderna, elegante, cercana, audaz, minimalista]
Referencias visuales que me gustan: [MENCIONA CUENTAS O MARCAS]
Lo que NO quiero: [ESTILOS A EVITAR]

Dame un sistema visual completo:
1. Paleta de colores principal (3 colores con códigos hex) + 2 colores de acento
2. Tipografías recomendadas (1 para títulos, 1 para textos) disponibles en Canva
3. Estilo fotográfico (composición, luz, fondos, props)
4. Plantilla de cuadrícula del feed (patrón de publicación)
5. Filtro o preset de edición de fotos a aplicar (describe los ajustes)
6. Elementos gráficos recurrentes (marcos, líneas, formas)

Concluye con las 5 reglas de oro de consistencia visual que debo seguir siempre.`,
  },
]

/* ── Inline icons ─────────────────────────────────────────────────────────── */
const IconCopy = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="14" height="14" x="8" y="8" rx="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
)
const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)
const IconIG = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)
const IconStar = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
)

/* ── SplashScreen ────────────────────────────────────────────────────────────── */
function SplashScreen({ onDone }: { onDone: () => void }) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // Fallback: auto-dismiss after 4.5s if video doesn't fire onEnded
    timerRef.current = setTimeout(onDone, 4500)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [onDone])

  const handleEnd = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    // Small pause after video ends before fading out
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
      }}
    >
      {/* Radial glow behind logo */}
      <div style={{
        position: 'absolute', width: '600px', height: '500px',
        background: 'radial-gradient(ellipse, rgba(139,53,232,0.25) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Logo video */}
      <motion.video
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        autoPlay
        muted
        playsInline
        onEnded={handleEnd}
        style={{ width: 'min(380px, 75vw)', height: 'auto', position: 'relative', zIndex: 1, mixBlendMode: 'screen' }}
      >
        <source src="/alma-logo.webm" type="video/webm" />
        <source src="/alma-logo.mp4" type="video/mp4" />
        {/* Fallback image if browser blocks autoplay */}
        <img src="/alma-logo.png" alt="Alma" style={{ width: '100%' }} />
      </motion.video>

      {/* Subtle loading bar */}
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

/* ── HackCard ────────────────────────────────────────────────────────────────── */
function HackCard({ hack, index }: { hack: (typeof hacks)[0]; index: number }) {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const { ref, onMouseMove, onMouseLeave: tiltLeave } = useCardTilt()

  const copy = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(hack.prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    // GA4 event
    if (typeof window !== 'undefined' && typeof (window as unknown as Record<string, unknown>).gtag === 'function') {
      ;(window as unknown as { gtag: (...a: unknown[]) => void }).gtag('event', 'prompt_copy', {
        hack_numero: hack.numero,
        hack_titulo: hack.titulo,
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      style={{ willChange: 'transform' }}
    >
      <div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseEnter={e => {
          ;(e.currentTarget as HTMLDivElement).style.borderColor = VBORDER
        }}
        onMouseLeave={e => {
          tiltLeave()
          ;(e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)'
        }}
        onClick={() => setExpanded(x => !x)}
        style={{
          background: CARD,
          border: `1px solid rgba(255,255,255,0.07)`,
          borderRadius: '18px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transformStyle: 'preserve-3d',
          transition: 'border-color 0.25s ease',
          cursor: 'pointer',
        }}
      >
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          {/* number + title + chevron */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <span style={{
              fontSize: '38px', fontWeight: 900, lineHeight: 1, flexShrink: 0,
              background: GRAD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              {hack.numero}
            </span>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: 0, color: '#fff', fontSize: '15px', fontWeight: 700, lineHeight: 1.35 }}>
                {hack.titulo}
              </h3>
              <p style={{ margin: '6px 0 0', color: 'rgba(255,255,255,0.48)', fontSize: '13px', lineHeight: 1.55 }}>
                {hack.descripcion}
              </p>
            </div>
            {/* chevron */}
            <motion.svg
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke={VL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ flexShrink: 0, marginTop: '3px' }}
            >
              <polyline points="6 9 12 15 18 9" />
            </motion.svg>
          </div>

          {/* expandable prompt */}
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                key="prompt"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{
                  marginTop: '18px',
                  background: 'rgba(0,0,0,0.35)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '10px',
                  padding: '16px',
                }}>
                  <pre style={{
                    margin: 0, color: 'rgba(255,255,255,0.78)', fontSize: '12px',
                    whiteSpace: 'pre-wrap', fontFamily: 'inherit', lineHeight: 1.7,
                  }}>
                    {hack.prompt}
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
                  {copied ? <><IconCheck /> ¡Prompt copiado!</> : <><IconCopy /> Copiar prompt</>}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* collapsed hint */}
          {!expanded && (
            <p style={{ margin: '12px 0 0', color: 'rgba(255,255,255,0.25)', fontSize: '11px', fontWeight: 500 }}>
              Toca para ver el prompt completo
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

/* ── App ─────────────────────────────────────────────────────────────────────── */
export default function App() {
  const [splashDone, setSplashDone] = useState(false)

  return (
    <>
      <AnimatePresence>
        {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}
      </AnimatePresence>

    <div style={{ minHeight: '100vh', background: BG, fontFamily: 'system-ui,-apple-system,sans-serif', color: '#fff', overflowX: 'hidden' }}>

      {/* Particle background */}
      <ParticlesCanvas />

      {/* Top glow */}
      <div style={{
        position: 'fixed', top: '-220px', left: '50%', transform: 'translateX(-50%)',
        width: '700px', height: '450px',
        background: 'radial-gradient(ellipse,rgba(139,53,232,0.2) 0%,transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* ── Header ── */}
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
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <img
            src="/alma-logo.png"
            alt="Alma"
            style={{ height: '108px', width: 'auto', objectFit: 'contain' }}
          />
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: VDIM, border: `1px solid ${VBORDER}`,
            color: VL, fontSize: '11px', fontWeight: 600,
            padding: '6px 12px', borderRadius: '20px',
          }}>
            <IconStar /> 7 Hacks de Instagram
          </div>
        </div>
      </motion.header>

      {/* ── Hero ── */}
      <section style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto', padding: '72px 24px 56px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0' }}>

          {/* Sphere */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginBottom: '32px', filter: 'drop-shadow(0 0 30px rgba(139,53,232,0.45))' }}
          >
            <HeroSphere size={200} />
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: VDIM, border: `1px solid ${VBORDER}`,
              color: VL, fontSize: '11px', fontWeight: 600,
              padding: '6px 14px', borderRadius: '20px',
              marginBottom: '24px', letterSpacing: '0.3px',
            }}
          >
            <IconIG /> Instagram × Claude AI · Alma Agencia Creativa
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{
              margin: '0 0 18px', lineHeight: 1.1, letterSpacing: '-1.5px',
              fontSize: 'clamp(34px,6vw,56px)', fontWeight: 900,
            }}
          >
            Domina Instagram{' '}
            <span style={{ background: GRAD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              con IA
            </span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            style={{ margin: '0 auto 10px', maxWidth: '480px', color: 'rgba(255,255,255,0.52)', fontSize: '17px', lineHeight: 1.65 }}
          >
            7 prompts para Claude que transforman cómo gestionas tu presencia en Instagram.
            Copia, personaliza y usa.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            style={{ margin: 0, color: 'rgba(255,255,255,0.28)', fontSize: '13px', fontWeight: 500 }}
          >
            Haz clic en cualquier hack → copia el prompt → úsalo en Claude
          </motion.p>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.9, ease: 'easeOut' }}
            style={{ marginTop: '44px', width: '64px', height: '2px', background: GRAD, borderRadius: '2px' }}
          />
        </div>
      </section>

      {/* ── Grid ── */}
      <main style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto', padding: '0 24px 96px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(330px,1fr))', gap: '16px' }}>
          {hacks.map((hack, i) => (
            <HackCard key={hack.numero} hack={hack} index={i} />
          ))}
        </div>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            marginTop: '56px', padding: '44px 40px', borderRadius: '22px',
            textAlign: 'center',
            background: 'linear-gradient(135deg,rgba(139,53,232,0.22),rgba(192,38,211,0.14))',
            border: `1px solid ${VBORDER}`, position: 'relative', overflow: 'hidden',
          }}
        >
          <div style={{
            position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)',
            width: '360px', height: '240px',
            background: 'radial-gradient(ellipse,rgba(139,53,232,0.28) 0%,transparent 70%)',
            pointerEvents: 'none',
          }} />
          <p style={{ margin: '0 0 6px', color: VL, fontSize: '11px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', position: 'relative' }}>
            Alma Agencia Creativa
          </p>
          <h2 style={{ margin: '0 0 10px', fontSize: 'clamp(20px,4vw,26px)', fontWeight: 900, lineHeight: 1.2, position: 'relative' }}>
            ¿Listo para llevar tus redes al siguiente nivel?
          </h2>
          <p style={{ margin: '0 0 28px', color: 'rgba(255,255,255,0.55)', fontSize: '15px', lineHeight: 1.65, maxWidth: '400px', marginInline: 'auto', position: 'relative' }}>
            Agenda tu asesoría personalizada con Alma y diseñemos juntos la estrategia que impulsa tu presencia digital.
          </p>
          <motion.a
            href="https://wa.me/573013369325?text=Hola%2C%20quiero%20agendar%20mi%20asesor%C3%ADa%20personalizada%20para%20impulsar%20mis%20redes%20sociales%20con%20Alma%20Agencia%20Creativa"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              background: '#25D366', color: '#fff',
              padding: '15px 32px', borderRadius: '14px',
              fontWeight: 700, fontSize: '15px', textDecoration: 'none',
              boxShadow: '0 0 32px rgba(37,211,102,0.35)',
              position: 'relative',
            }}
          >
            {/* WhatsApp icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Agenda tu asesoría gratis
          </motion.a>
          <p style={{ margin: '14px 0 0', color: 'rgba(255,255,255,0.3)', fontSize: '12px', position: 'relative' }}>
            Respuesta en menos de 24 horas · Sin compromiso
          </p>
        </motion.div>
      </main>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.07)', background: 'rgba(0,0,0,0.25)', position: 'relative', zIndex: 1 }}>
        <div style={{
          maxWidth: '800px', margin: '0 auto', padding: '20px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontSize: '12px', color: 'rgba(255,255,255,0.22)',
        }}>
          <span>© Alma Creative Intelligence Studio</span>
          <span>Recursos de Instagram con Claude AI</span>
        </div>
      </footer>
    </div>
    </>
  )
}

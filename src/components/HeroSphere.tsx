import { useEffect, useRef } from 'react'

const VIOLET = 'rgba(139,53,232,'
const VIOLET_LIGHT = 'rgba(168,85,247,'

export default function HeroSphere({ size = 220 }: { size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    const cx = size / 2
    const cy = size / 2
    const R = size * 0.36

    // Dots on sphere surface
    const dots: [number, number, number][] = []
    const rows = 20
    for (let i = 0; i <= rows; i++) {
      const phi = (Math.PI * i) / rows
      const cols = Math.max(1, Math.round(rows * 1.6 * Math.sin(phi)))
      for (let j = 0; j < cols; j++) {
        const theta = (2 * Math.PI * j) / cols
        dots.push([
          Math.sin(phi) * Math.cos(theta),
          Math.cos(phi),
          Math.sin(phi) * Math.sin(theta),
        ])
      }
    }

    // Orbital rings — [tilt angle, scale]
    const rings: [number, number][] = [
      [0.42, 1.55],
      [-0.28, 1.62],
      [1.1, 1.48],
    ]

    let angle = 0
    let animId: number

    // Simple perspective projection
    const project = (x: number, y: number, z: number, rotY: number) => {
      const rx = x * Math.cos(rotY) - z * Math.sin(rotY)
      const rz = x * Math.sin(rotY) + z * Math.cos(rotY)
      const fov = 2.8
      const s = fov / (fov + rz + 1)
      return { px: cx + rx * R * s, py: cy - y * R * s, s, depth: rz }
    }

    const draw = () => {
      ctx.clearRect(0, 0, size, size)

      // Outer glow
      const glow = ctx.createRadialGradient(cx, cy, R * 0.3, cx, cy, R * 1.6)
      glow.addColorStop(0, VIOLET + '0.18)')
      glow.addColorStop(0.5, VIOLET + '0.06)')
      glow.addColorStop(1, VIOLET + '0)')
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, size, size)

      // Orbital rings
      rings.forEach(([tilt, scale]) => {
        const pts: { px: number; py: number; depth: number }[] = []
        const n = 80
        for (let i = 0; i < n; i++) {
          const t = (2 * Math.PI * i) / n
          const rx = Math.cos(t) * scale
          const ry = Math.sin(t) * Math.sin(tilt) * scale
          const rz = Math.sin(t) * Math.cos(tilt) * scale
          pts.push(project(rx, ry, rz, angle * 0.6))
        }
        ctx.beginPath()
        pts.forEach((p, i) => {
          if (i === 0) ctx.moveTo(p.px, p.py)
          else ctx.lineTo(p.px, p.py)
        })
        ctx.closePath()
        ctx.strokeStyle = VIOLET + '0.28)'
        ctx.lineWidth = 0.8
        ctx.stroke()

        // Glowing dot on ring
        const glowDot = pts[Math.floor((angle * 8) % n)]
        if (glowDot) {
          ctx.beginPath()
          ctx.arc(glowDot.px, glowDot.py, 3, 0, Math.PI * 2)
          ctx.fillStyle = VIOLET_LIGHT + '0.9)'
          ctx.fill()
          ctx.shadowColor = '#A855F7'
          ctx.shadowBlur = 8
          ctx.fill()
          ctx.shadowBlur = 0
        }
      })

      // Sphere dots (sorted back-to-front)
      const projected = dots
        .map(([x, y, z]) => project(x, y, z, angle))
        .sort((a, b) => a.depth - b.depth)

      projected.forEach(({ px, py, s, depth }) => {
        const brightness = (depth + 1) / 2
        const opacity = brightness * 0.7 + 0.08
        const r = s * 2.2 + 0.3
        ctx.beginPath()
        ctx.arc(px, py, r, 0, Math.PI * 2)
        ctx.fillStyle = VIOLET_LIGHT + opacity + ')'
        ctx.fill()
      })

      // Equator highlight
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.strokeStyle = VIOLET + '0.12)'
      ctx.lineWidth = 1
      ctx.stroke()

      angle += 0.006
      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animId)
  }, [size])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size, display: 'block' }}
    />
  )
}

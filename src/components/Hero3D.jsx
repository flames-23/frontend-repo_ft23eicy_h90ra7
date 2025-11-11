import { useEffect, useRef } from 'react'
import Spline from '@splinetool/react-spline'

export default function Hero3D() {
  const canvasRef = useRef(null)
  const rafRef = useRef(0)
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { alpha: true })

    let w = (canvas.width = window.innerWidth)
    let h = (canvas.height = window.innerHeight)

    const particles = Array.from({ length: Math.min(220, Math.floor((w * h) / 12000)) }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      z: Math.random() * 1 + 0.2,
      r: Math.random() * 1.8 + 0.2,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      a: Math.random() * Math.PI * 2,
      tw: Math.random() * 0.02 + 0.005,
    }))

    function resize() {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }

    const onMouseMove = (e) => {
      mouseRef.current.x = (e.clientX / w - 0.5) * 2
      mouseRef.current.y = (e.clientY / h - 0.5) * 2
    }

    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouseMove)

    function draw() {
      // subtle vignette background for extra depth
      const g = ctx.createRadialGradient(w / 2, h * 0.8, Math.min(w, h) * 0.2, w / 2, h / 2, Math.max(w, h))
      g.addColorStop(0, 'rgba(18,18,30,1)')
      g.addColorStop(1, 'rgba(0,0,0,1)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)

      // parallax based on mouse
      const parallaxX = mouseRef.current.x * 12
      const parallaxY = mouseRef.current.y * 8

      // connection lines
      ctx.lineWidth = 0.5
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx * p.z
        p.y += p.vy * p.z
        p.a += p.tw

        if (p.x < -50) p.x = w + 50
        if (p.x > w + 50) p.x = -50
        if (p.y < -50) p.y = h + 50
        if (p.y > h + 50) p.y = -50

        // star
        const twinkle = (Math.sin(p.a) + 1) * 0.5
        const size = p.r + twinkle * 0.8
        ctx.beginPath()
        ctx.arc(p.x + parallaxX * p.z, p.y + parallaxY * p.z, size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${0.3 + twinkle * 0.7})`
        ctx.fill()

        // draw connections within certain distance
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const dx = (p.x - q.x)
          const dy = (p.y - q.y)
          const dist = Math.hypot(dx, dy)
          if (dist < 120) {
            const alpha = 1 - dist / 120
            ctx.strokeStyle = `rgba(125, 155, 255, ${0.12 * alpha})`
            ctx.beginPath()
            ctx.moveTo(p.x + parallaxX * p.z, p.y + parallaxY * p.z)
            ctx.lineTo(q.x + parallaxX * q.z, q.y + parallaxY * q.z)
            ctx.stroke()
          }
        }
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Full-bleed Spline scene */}
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/VyGeZv58yuk8j7Yy/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Particles & lines overlay for WOW effect */}
      <canvas ref={canvasRef} className="absolute inset-0 z-[5]" />

      {/* Depth overlays */}
      <div className="pointer-events-none absolute inset-0 z-[6] bg-gradient-to-b from-black/70 via-black/30 to-black/80" />
      <div className="pointer-events-none absolute inset-0 z-[6] mix-blend-screen bg-[radial-gradient(1400px_700px_at_50%_20%,rgba(99,102,241,0.35),transparent)]" />

      {/* Centered hero copy */}
      <div className="relative z-10 flex h-full items-center justify-center px-6">
        <div className="max-w-3xl text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
            Un vrai fond 3D immersif
          </h1>
          <p className="mt-4 text-base md:text-lg text-white/80">
            Plein écran. Zéro blanc visible. Animation réactive et profonde.
          </p>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center text-white/70">
        <span className="text-xs uppercase tracking-widest">Faire défiler</span>
        <div className="mt-2 h-8 w-[2px] overflow-hidden rounded bg-white/20">
          <div className="h-8 w-[2px] animate-[scrollDown_1.6s_ease-in-out_infinite] bg-white" />
        </div>
      </div>

      <style>{`
        @keyframes scrollDown {
          0% { transform: translateY(-100%); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translateY(100%); opacity: 0; }
        }
      `}</style>
    </section>
  )
}

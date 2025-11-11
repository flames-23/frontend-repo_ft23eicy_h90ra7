import Spline from '@splinetool/react-spline'

export default function Hero3D() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Spline full-bleed background */}
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/VyGeZv58yuk8j7Yy/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Overlays for contrast and vibe */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/70" />
      <div className="pointer-events-none absolute inset-0 mix-blend-screen bg-[radial-gradient(1200px_600px_at_50%_20%,rgba(99,102,241,0.35),transparent)]" />

      {/* Centered hero content */}
      <div className="relative z-10 flex h-full items-center justify-center px-6">
        <div className="max-w-3xl text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
            Notes IA 3D — immersives
          </h1>
          <p className="mt-4 text-base md:text-lg text-white/80">
            Créez, organisez et retrouvez vos idées dans un univers 3D pleine page, 
            avec une interface épurée et futuriste.
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

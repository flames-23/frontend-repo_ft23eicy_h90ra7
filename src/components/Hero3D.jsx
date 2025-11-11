import Spline from '@splinetool/react-spline'

export default function Hero3D() {
  return (
    <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden rounded-2xl bg-black">
      <Spline scene="https://prod.spline.design/VyGeZv58yuk8j7Yy/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1000px_400px_at_50%_80%,rgba(255,255,255,0.7),transparent)]" />
      <div className="absolute inset-x-0 bottom-6 flex flex-col items-center gap-3">
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-gray-900 text-center">
          Notes IA 3D
        </h1>
        <p className="text-gray-600 text-center max-w-2xl">
          Prenez des notes intelligentes dans une ambiance 3D minimaliste, interactive et futuriste.
        </p>
      </div>
    </div>
  )
}

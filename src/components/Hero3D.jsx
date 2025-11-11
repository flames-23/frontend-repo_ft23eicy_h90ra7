import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { Environment, Float, OrbitControls, PerspectiveCamera, Sparkles, shaderMaterial } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'

// Custom neon grid shader (inspired by synthwave floors)
const GridMaterial = shaderMaterial(
  { uTime: 0, uGlow: 1, uColor: new THREE.Color('#4f46e5') },
  `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
  `uniform float uTime; uniform float uGlow; uniform vec3 uColor; varying vec2 vUv; void main(){
    vec2 uv = vUv * 20.0; // density
    vec2 g = abs(fract(uv - 0.5) - 0.5) / fwidth(uv);
    float line = 1.0 - min(min(g.x, g.y), 1.0);
    float pulse = 0.5 + 0.5 * sin(uTime * 0.8 + vUv.y * 4.0);
    float glow = smoothstep(0.7, 1.0, pulse) * uGlow;
    vec3 col = mix(vec3(0.0), uColor, line * 0.8 + glow * 0.2);
    gl_FragColor = vec4(col, 1.0);
  }`
)

// Register the custom material so it can be used as <gridMaterial />
extend({ GridMaterial })

function NeonGrid() {
  const matRef = useRef()
  useFrame((_, dt) => { if (matRef.current) matRef.current.uTime += dt })
  return (
    <mesh rotation={[-Math.PI / 2.2, 0, 0]} position={[0, -2.2, 0]}>
      <planeGeometry args={[80, 80, 2, 2]} />
      <gridMaterial ref={matRef} uGlow={1.2} uColor={new THREE.Color('#7c3aed')} />
    </mesh>
  )
}

function GlassOrb() {
  const mesh = useRef()
  const mat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#ffffff'), roughness: 0.05, transmission: 1, thickness: 1.2,
    ior: 1.5, reflectivity: 0.9, metalness: 0.05, envMapIntensity: 1.2, clearcoat: 1, clearcoatRoughness: 0.05
  }), [])
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (mesh.current) {
      mesh.current.rotation.y = t * 0.25
      mesh.current.position.y = Math.sin(t * 0.8) * 0.3 + 0.2
    }
  })
  return (
    <Float speed={1} rotationIntensity={0.4} floatIntensity={0.5}>
      <mesh ref={mesh} position={[0, 0.2, 0]} castShadow>
        <icosahedronGeometry args={[1.2, 2]} />
        <primitive object={mat} attach="material" />
      </mesh>
    </Float>
  )
}

function Particles() {
  return (
    <group>
      <Sparkles count={200} scale={[20, 8, 20]} size={2} speed={0.5} color="#a5b4fc" />
      <Sparkles count={120} scale={[14, 6, 14]} size={1.2} speed={0.8} color="#f472b6" />
    </group>
  )
}

function Scene() {
  return (
    <>
      <color attach="background" args={[0, 0, 0]} />
      <fog attach="fog" args={[new THREE.Color('#050510'), 10, 40]} />

      <PerspectiveCamera makeDefault position={[0, 1.2, 6]} fov={50} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 8, 5]} intensity={2} castShadow color={'#bd93f9'} />
      <directionalLight position={[-5, 6, -5]} intensity={1.5} color={'#93c5fd'} />

      <NeonGrid />
      <GlassOrb />
      <Particles />

      <Environment preset="city" />

      <EffectComposer>
        <Bloom intensity={1.2} luminanceThreshold={0.2} luminanceSmoothing={0.9} mipmapBlur />
        <Vignette eskil={false} offset={0.2} darkness={0.9} />
      </EffectComposer>

      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.7} />
    </>
  )
}

export default function Hero3D() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true }} camera={{ position: [0, 1.2, 6], fov: 50 }}>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>

      <div className="pointer-events-none absolute inset-0 z-[6] bg-gradient-to-b from-black/50 via-transparent to-black/80" />
      <div className="pointer-events-none absolute inset-0 z-[6] mix-blend-screen bg-[radial-gradient(900px_500px_at_50%_20%,rgba(99,102,241,0.25),transparent)]" />

      <div className="absolute inset-0 z-10 flex items-center justify-center px-6 text-center">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-white">Active Hop style 3D vibe</h1>
          <p className="mt-4 text-base md:text-lg text-white/80">Neon grid + glass orb + sparkles + bloom. Full-screen, immersive.</p>
        </div>
      </div>

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

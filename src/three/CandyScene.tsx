import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, OrbitControls } from '@react-three/drei'
import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry.js'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { buildCandy, type ShapeBuild } from './geometry'
import { createPatternTexture, createStudioEnvironment, getWrapperNormalMap } from './textures'
import { useLogoTexture, type LogoTextureState } from './useLogoTexture'
import { darken } from '../lib/color'
import {
  FINISHES,
  LIGHTS,
  useEditor,
  type BackgroundKey,
  type FinishKey,
  type LightKey,
} from '../store/editor'

export interface ViewerApi {
  gl: THREE.WebGLRenderer
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
}

export interface ViewerApiRef {
  current: ViewerApi | null
}

export type ViewName = 'front' | 'threeQuarter' | 'top'

export interface ViewRequest {
  name: ViewName
  id: number
}

const VIEW_POSITIONS: Record<ViewName, [number, number, number]> = {
  front: [0, 0.15, 8.4],
  threeQuarter: [5.0, 2.3, 6.3],
  top: [0.01, 8.35, 0.45],
}

function usePatternTexture(): THREE.Texture {
  const baseColor = useEditor((state) => state.baseColor)
  const patternColor = useEditor((state) => state.patternColor)
  const pattern = useEditor((state) => state.pattern)
  const patternScale = useEditor((state) => state.patternScale)
  const patternDensity = useEditor((state) => state.patternDensity)
  const patternRotation = useEditor((state) => state.patternRotation)

  const create = useCallback(
    () =>
      createPatternTexture({
        baseColor,
        patternColor,
        pattern,
        scale: patternScale,
        density: patternDensity,
        rotation: patternRotation,
      }),
    [baseColor, patternColor, pattern, patternScale, patternDensity, patternRotation],
  )

  const [texture, setTexture] = useState<THREE.Texture>(() => create())
  const createRef = useRef(create)
  createRef.current = create
  const textureRef = useRef(texture)
  textureRef.current = texture

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const previous = textureRef.current
      const next = createRef.current()
      setTexture(next)
      if (previous && previous !== next) {
        window.setTimeout(() => previous.dispose(), 60)
      }
    }, 80)

    return () => window.clearTimeout(timer)
  }, [baseColor, patternColor, pattern, patternScale, patternDensity, patternRotation])

  useEffect(
    () => () => {
      textureRef.current.dispose()
    },
    [],
  )

  return texture
}

function SceneBridge({ apiRef }: { apiRef: ViewerApiRef }) {
  const gl = useThree((state) => state.gl)
  const scene = useThree((state) => state.scene)
  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera

  useEffect(() => {
    apiRef.current = { gl, scene, camera }
    return () => {
      apiRef.current = null
    }
  }, [apiRef, gl, scene, camera])

  return null
}

function StudioControls({ viewRequest }: { viewRequest: ViewRequest | null }) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null)
  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera
  const invalidate = useThree((state) => state.invalidate)
  const autoRotate = useEditor((state) => state.autoRotate)
  const targetRef = useRef<THREE.Vector3 | null>(null)

  useEffect(() => {
    if (!viewRequest) return
    targetRef.current = new THREE.Vector3(...VIEW_POSITIONS[viewRequest.name])
    invalidate()
  }, [viewRequest, invalidate])

  useFrame((state, delta) => {
    const target = targetRef.current
    if (!target) return

    camera.position.lerp(target, Math.min(1, delta * 5.5))
    if (camera.position.distanceToSquared(target) < 0.0005) {
      camera.position.copy(target)
      targetRef.current = null
    } else {
      // With frameloop="demand" the camera tween has to keep requesting frames
      // until it reaches the preset; otherwise the view moves only one step.
      state.invalidate()
    }
    controlsRef.current?.update()
  })

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      minDistance={4.6}
      maxDistance={12.5}
      minPolarAngle={0.02}
      maxPolarAngle={Math.PI / 2 + 0.18}
      autoRotate={autoRotate}
      autoRotateSpeed={1.25}
      onStart={() => {
        targetRef.current = null
      }}
    />
  )
}

function Lighting({ preset }: { preset: LightKey }) {
  const light = LIGHTS[preset]
  const scene = useThree((state) => state.scene)
  const environment = useMemo(
    () =>
      createStudioEnvironment(
        light.envTop,
        light.envLeft,
        darken(light.envRight, 0.55),
      ),
    [light],
  )

  useEffect(() => {
    scene.environment = environment
    return () => {
      if (scene.environment === environment) scene.environment = null
      environment.dispose()
    }
  }, [scene, environment])

  return (
    <>
      <ambientLight intensity={light.ambient} color="#fff6ea" />
      <directionalLight
        position={[5, 7, 6]}
        intensity={light.keyIntensity}
        color={light.key}
      />
      <directionalLight
        position={[-6, 2, 4]}
        intensity={light.fillIntensity}
        color={light.fill}
      />
      <directionalLight
        position={[0, 4, -7]}
        intensity={light.rimIntensity}
        color={light.rim}
      />
    </>
  )
}

interface LogoDecalProps {
  bodyMesh: THREE.Mesh | null
  build: ShapeBuild
  logoState: LogoTextureState | null
  logoScale: number
  logoX: number
  logoY: number
  logoRotation: number
  logoBothSides: boolean
}

function LogoDecal({
  bodyMesh,
  build,
  logoState,
  logoScale,
  logoX,
  logoY,
  logoRotation,
  logoBothSides,
}: LogoDecalProps) {
  const [decals, setDecals] = useState<THREE.BufferGeometry[]>([])

  useEffect(() => {
    if (!bodyMesh || !logoState) {
      setDecals([])
      return
    }

    bodyMesh.updateWorldMatrix(true, false)

    const baseSize = Math.min(build.bodyWidth, build.bodyHeight) * 0.62 * logoScale
    const width = baseSize
    const height = baseSize / (logoState.aspect || 1)
    const x = logoX * build.bodyWidth * 0.3
    const y = build.bodyCenterY + logoY * build.bodyHeight * 0.26
    const rotation = THREE.MathUtils.degToRad(logoRotation)
    const size = new THREE.Vector3(width, height, 1.6)

    const front = new DecalGeometry(
      bodyMesh,
      new THREE.Vector3(x, y, build.bodyFrontZ + 0.22),
      new THREE.Euler(0, 0, rotation),
      size,
    )

    const next: THREE.BufferGeometry[] = [front]

    if (logoBothSides) {
      const back = new DecalGeometry(
        bodyMesh,
        new THREE.Vector3(-x, y, build.bodyBackZ - 0.22),
        new THREE.Euler(0, Math.PI, rotation),
        size,
      )
      next.push(back)
    }

    setDecals(next)
  }, [bodyMesh, build, logoState, logoScale, logoX, logoY, logoRotation, logoBothSides])

  useEffect(
    () => () => {
      decals.forEach((geometry) => geometry.dispose())
    },
    [decals],
  )

  if (!logoState) return null

  return (
    <>
      {decals.map((geometry, index) => (
        <mesh key={index} geometry={geometry}>
          <meshStandardMaterial
            map={logoState.texture}
            transparent
            alphaTest={0.03}
            roughness={0.55}
            metalness={0}
            polygonOffset
            polygonOffsetFactor={-4}
            polygonOffsetUnits={-4}
          />
        </mesh>
      ))}
    </>
  )
}

function CandyContent({
  apiRef,
  viewRequest,
}: {
  apiRef: ViewerApiRef
  viewRequest: ViewRequest | null
}) {
  const shape = useEditor((state) => state.shape)
  const baseColor = useEditor((state) => state.baseColor)
  const finishKey = useEditor((state) => state.finish)
  const lightKey = useEditor((state) => state.light)
  const backgroundKey = useEditor((state) => state.background)
  const logo = useEditor((state) => state.logo)
  const logoScale = useEditor((state) => state.logoScale)
  const logoX = useEditor((state) => state.logoX)
  const logoY = useEditor((state) => state.logoY)
  const logoRotation = useEditor((state) => state.logoRotation)
  const logoBothSides = useEditor((state) => state.logoBothSides)

  const build = useMemo(() => buildCandy(shape), [shape])
  useEffect(
    () => () => {
      build.parts.forEach((part) => part.geometry.dispose())
    },
    [build],
  )

  const patternTexture = usePatternTexture()
  const normalMap = useMemo(() => getWrapperNormalMap(), [])
  const normalScale = useMemo(() => new THREE.Vector2(0.04, 0.04), [])
  const finish = FINISHES[finishKey]
  const logoState = useLogoTexture(logo)
  const [bodyMesh, setBodyMesh] = useState<THREE.Mesh | null>(null)

  const shadowColor = backgroundKey === 'oscuro' ? '#000000' : '#4a2416'

  return (
    <>
      <SceneBridge apiRef={apiRef} />
      <Lighting preset={lightKey} />
      <StudioControls viewRequest={viewRequest} />

      <group>
        {build.parts.map((part, index) => {
          const isBody = part.geometry === build.body
          return (
            <mesh
              key={index}
              ref={isBody ? setBodyMesh : undefined}
              geometry={part.geometry}
              castShadow={false}
              receiveShadow={false}
            >
              {part.kind === 'wrapper' ? (
                <meshPhysicalMaterial
                  color="#ffffff"
                  map={patternTexture}
                  normalMap={normalMap}
                  normalScale={normalScale}
                  roughness={finish.roughness}
                  metalness={finish.metalness}
                  clearcoat={finish.clearcoat}
                  clearcoatRoughness={finish.clearcoatRoughness}
                  envMapIntensity={finish.envMapIntensity}
                  side={THREE.DoubleSide}
                />
              ) : part.kind === 'tail' ? (
                <meshStandardMaterial
                  color="#ffffff"
                  map={patternTexture}
                  roughness={0.64}
                  metalness={0}
                  envMapIntensity={0.45}
                  side={THREE.DoubleSide}
                />
              ) : part.kind === 'crimp' ? (
                <meshPhysicalMaterial
                  color={baseColor}
                  normalMap={normalMap}
                  normalScale={normalScale}
                  roughness={finish.roughness}
                  metalness={finish.metalness}
                  clearcoat={finish.clearcoat}
                  clearcoatRoughness={finish.clearcoatRoughness}
                  envMapIntensity={finish.envMapIntensity}
                  side={THREE.DoubleSide}
                />
              ) : (
                <meshStandardMaterial
                  color="#e9dfcf"
                  roughness={0.52}
                  metalness={0.02}
                />
              )}
            </mesh>
          )
        })}

        <LogoDecal
          bodyMesh={bodyMesh}
          build={build}
          logoState={logoState}
          logoScale={logoScale}
          logoX={logoX}
          logoY={logoY}
          logoRotation={logoRotation}
          logoBothSides={logoBothSides}
        />
      </group>

      <group name="studio-shadow">
        <ContactShadows
          key={`${shape}-${backgroundKey}`}
          position={[0, build.groundY, 0]}
          opacity={0.34}
          scale={10}
          blur={2.7}
          far={4.6}
          resolution={512}
          frames={1}
          color={shadowColor}
        />
      </group>
    </>
  )
}

export function CandyCanvas({
  apiRef,
  viewRequest,
}: {
  apiRef: ViewerApiRef
  viewRequest: ViewRequest | null
}) {
  const autoRotate = useEditor((state) => state.autoRotate)

  return (
    <Canvas
      shadows={false}
      dpr={[1, 2]}
      frameloop={autoRotate ? 'always' : 'demand'}
      gl={{
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true,
        powerPreference: 'high-performance',
      }}
      camera={{ position: [5.0, 2.3, 6.3], fov: 34, near: 0.1, far: 100 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 0.98
        gl.outputColorSpace = THREE.SRGBColorSpace
        gl.setClearAlpha(0)
      }}
    >
      <CandyContent apiRef={apiRef} viewRequest={viewRequest} />
    </Canvas>
  )
}

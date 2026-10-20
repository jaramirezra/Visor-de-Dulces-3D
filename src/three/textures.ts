import * as THREE from 'three'

export type PatternType = 'none' | 'hearts' | 'stars' | 'dots' | 'stripes' | 'confetti'

export interface PatternOptions {
  baseColor: string
  patternColor: string
  pattern: PatternType
  scale: number
  density: number
  rotation: number
}

const TAU = Math.PI * 2

function mulberry32(seed: number) {
  let state = seed
  return () => {
    state |= 0
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number) {
  const s = size * 0.55
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rotation)
  ctx.scale(s, s)
  ctx.beginPath()
  ctx.moveTo(0, 0.74)
  ctx.bezierCurveTo(-0.18, 0.5, -0.86, 0.24, -0.86, -0.24)
  ctx.bezierCurveTo(-0.86, -0.7, -0.36, -0.86, 0, -0.42)
  ctx.bezierCurveTo(0.36, -0.86, 0.86, -0.7, 0.86, -0.24)
  ctx.bezierCurveTo(0.86, 0.24, 0.18, 0.5, 0, 0.74)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number) {
  const s = size * 0.5
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rotation)
  ctx.scale(s, s)
  ctx.beginPath()
  for (let i = 0; i < 10; i++) {
    const radius = i % 2 === 0 ? 1 : 0.45
    const angle = -Math.PI / 2 + (i * Math.PI) / 5
    const px = Math.cos(angle) * radius
    const py = Math.sin(angle) * radius
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

function drawDot(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rotation)
  ctx.beginPath()
  ctx.arc(0, 0, size * 0.3, 0, TAU)
  ctx.fill()
  ctx.restore()
}

function drawStripes(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  density: number,
  scale: number,
  color: string,
) {
  const bands = Math.max(2, Math.round(9 * density))
  const spacing = width / bands
  const bandWidth = spacing * Math.min(0.62, 0.28 * scale)
  ctx.fillStyle = color
  ctx.globalAlpha = 0.92
  for (let i = 0; i < bands; i++) {
    ctx.fillRect(i * spacing + (spacing - bandWidth) / 2, 0, bandWidth, height)
  }
  ctx.globalAlpha = 1
}

export function createPatternTexture(options: PatternOptions): THREE.CanvasTexture {
  const width = 2048
  const height = 1024
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = options.baseColor
  ctx.fillRect(0, 0, width, height)

  if (options.pattern === 'stripes') {
    drawStripes(ctx, width, height, options.density, options.scale, options.patternColor)
  } else if (options.pattern !== 'none') {
    const random = mulberry32(0x51f15e)
    const count = Math.max(4, Math.round(34 * options.density))
    const aspect = width / height
    const cols = Math.max(1, Math.round(Math.sqrt(count * aspect)))
    const rows = Math.max(1, Math.ceil(count / cols))
    const cellWidth = width / cols
    const cellHeight = height / rows
    const baseRotation = (options.rotation * Math.PI) / 180

    ctx.fillStyle = options.patternColor
    ctx.globalAlpha = 0.93

    let index = 0
    for (let row = 0; row < rows && index < count; row++) {
      for (let col = 0; col < cols && index < count; col++) {
        index++
        const x = (col + 0.5 + (random() - 0.5) * 0.7) * cellWidth
        const y = (row + 0.5 + (random() - 0.5) * 0.7) * cellHeight
        const size =
          Math.min(cellWidth, cellHeight) * 0.38 * options.scale * (0.78 + random() * 0.44)
        const rotation = baseRotation + (random() - 0.5) * 0.3

        let kind = options.pattern
        if (kind === 'confetti') {
          const pick = random()
          kind = pick < 0.36 ? 'hearts' : pick < 0.68 ? 'stars' : 'dots'
        }

        const draw = (drawX: number) => {
          if (kind === 'hearts') drawHeart(ctx, drawX, y, size, rotation)
          else if (kind === 'stars') drawStar(ctx, drawX, y, size, rotation)
          else drawDot(ctx, drawX, y, size, rotation)
        }

        draw(x)
        if (x < size) draw(x + width)
        if (x > width - size) draw(x - width)
      }
    }

    ctx.globalAlpha = 1
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  texture.anisotropy = 8
  texture.needsUpdate = true
  return texture
}

let normalMap: THREE.DataTexture | null = null

/**
 * A tileable set of low-frequency waves turned into a normal map. It gives the
 * wrapper a subtle paper / foil grain without shipping any image assets.
 */
export function getWrapperNormalMap(): THREE.DataTexture {
  if (normalMap) return normalMap

  const size = 256
  const waves = [
    { fx: 3, fy: 2, amp: 0.22, phase: 0.3 },
    { fx: 9, fy: 5, amp: 0.18, phase: 2.1 },
    { fx: 19, fy: 13, amp: 0.12, phase: 4.2 },
    { fx: 43, fy: 31, amp: 0.08, phase: 1.2 },
    { fx: 79, fy: 53, amp: 0.05, phase: 5.1 },
  ]

  const heightAt = (x: number, y: number) => {
    let value = 0
    for (const wave of waves) {
      value +=
        wave.amp *
        Math.sin((TAU * (wave.fx * x + wave.fy * y)) / size + wave.phase)
    }
    return value
  }

  const data = new Uint8Array(size * size * 4)
  const strength = 3.2

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = heightAt(x + 1, y) - heightAt(x - 1, y)
      const dy = heightAt(x, y + 1) - heightAt(x, y - 1)
      const nx = -dx * strength
      const ny = -dy * strength
      const length = Math.hypot(nx, ny, 1)
      const offset = (y * size + x) * 4
      data[offset] = Math.round((nx / length) * 0.5 * 255 + 127.5)
      data[offset + 1] = Math.round((ny / length) * 0.5 * 255 + 127.5)
      data[offset + 2] = Math.round((1 / length) * 0.5 * 255 + 127.5)
      data[offset + 3] = 255
    }
  }

  normalMap = new THREE.DataTexture(data, size, size, THREE.RGBAFormat)
  normalMap.wrapS = THREE.RepeatWrapping
  normalMap.wrapT = THREE.RepeatWrapping
  normalMap.repeat.set(8, 4)
  normalMap.minFilter = THREE.LinearMipmapLinearFilter
  normalMap.magFilter = THREE.LinearFilter
  normalMap.generateMipmaps = true
  normalMap.colorSpace = THREE.NoColorSpace
  normalMap.needsUpdate = true
  return normalMap
}


/**
 * A soft equirectangular studio gradient. Unlike rectangular lightformers, it
 * does not produce hard white blobs on the flat faces of the wrapper.
 */
export function createStudioEnvironment(
  topColor: string,
  sideColor: string,
  floorColor: string,
): THREE.CanvasTexture {
  const width = 512
  const height = 256
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')!

  const gradient = context.createLinearGradient(0, 0, 0, height)
  gradient.addColorStop(0, topColor)
  gradient.addColorStop(0.42, sideColor)
  gradient.addColorStop(0.56, '#eadccb')
  gradient.addColorStop(1, floorColor)
  context.fillStyle = gradient
  context.fillRect(0, 0, width, height)

  const highlight = context.createRadialGradient(
    width * 0.5,
    height * 0.2,
    8,
    width * 0.5,
    height * 0.2,
    width * 0.42,
  )
  highlight.addColorStop(0, 'rgba(255, 255, 255, 0.5)')
  highlight.addColorStop(1, 'rgba(255, 255, 255, 0)')
  context.fillStyle = highlight
  context.fillRect(0, 0, width, height)

  const texture = new THREE.CanvasTexture(canvas)
  texture.mapping = THREE.EquirectangularReflectionMapping
  texture.colorSpace = THREE.SRGBColorSpace
  texture.needsUpdate = true
  return texture
}

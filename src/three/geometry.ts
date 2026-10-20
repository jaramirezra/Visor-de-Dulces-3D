import * as THREE from 'three'

export type ShapeKey = 'pillow' | 'lollipop' | 'twist' | 'oval' | 'vertical'
export type PartKind = 'wrapper' | 'crimp' | 'stick' | 'tail'

export interface ShapePart {
  geometry: THREE.BufferGeometry
  kind: PartKind
}

export interface ShapeBuild {
  parts: ShapePart[]
  body: THREE.BufferGeometry
  bodyWidth: number
  bodyHeight: number
  bodyFrontZ: number
  bodyBackZ: number
  bodyCenterY: number
  groundY: number
  radius: number
}

const TAU = Math.PI * 2

function signedPow(value: number, exponent: number) {
  return Math.sign(value) * Math.pow(Math.abs(value), exponent)
}

function surfaceNormal(
  point: (u: number, v: number, target: THREE.Vector3) => void,
  u: number,
  v: number,
  vMin: number,
  vMax: number,
  target: THREE.Vector3,
  flip = false,
): THREE.Vector3 {
  const h = 1e-4
  const p = new THREE.Vector3()
  const a = new THREE.Vector3()
  const b = new THREE.Vector3()
  const du = new THREE.Vector3()
  const dv = new THREE.Vector3()

  point(u - h, v, a)
  point(u + h, v, b)
  du.subVectors(b, a)

  const vLow = Math.max(vMin, v - h)
  const vHigh = Math.min(vMax, v + h)
  point(u, vLow, a)
  point(u, vHigh, b)
  dv.subVectors(b, a)

  // The raw differences are tiny (h = 1e-4), so their cross product can be
  // close to zero even on a perfectly valid surface. Normalize the tangents
  // first; only genuinely degenerate points (the poles) fall back.
  if (du.lengthSq() < 1e-24 || dv.lengthSq() < 1e-24) {
    target.set(0, Math.sin(v) >= 0 ? 1 : -1, 0)
    return target
  }

  du.normalize()
  dv.normalize()
  if (flip) target.crossVectors(du, dv)
  else target.crossVectors(dv, du)
  if (target.lengthSq() < 1e-12) {
    target.set(0, Math.sin(v) >= 0 ? 1 : -1, 0)
  } else {
    target.normalize()
  }
  return target
}

interface SuperellipsoidOptions {
  width: number
  height: number
  depth: number
  e1?: number
  e2?: number
  bulge?: number
  wrinkle?: number
  folds?: number
  segU?: number
  segV?: number
}

/**
 * A closed superellipsoid with a soft pillow bulge and optional vertical
 * wrinkling. Normals are derived from the surface itself, so the texture seam
 * on the back stays invisible.
 */
function createSuperellipsoid({
  width,
  height,
  depth,
  e1 = 0.5,
  e2 = 0.5,
  bulge = 0,
  wrinkle = 0,
  folds = 12,
  segU = 96,
  segV = 64,
}: SuperellipsoidOptions): THREE.BufferGeometry {
  const a = width / 2
  const b = height / 2
  const c = depth / 2

  const point = (u: number, v: number, out: THREE.Vector3) => {
    const cu = signedPow(Math.cos(u), e2)
    const su = signedPow(Math.sin(u), e2)
    const cv = signedPow(Math.cos(v), e1)
    const sv = signedPow(Math.sin(v), e1)

    let x = a * cv * cu
    const y = b * sv
    let z = c * cv * su

    if (bulge !== 0) {
      const nx = Math.min(1, Math.abs(x / a))
      const ny = Math.min(1, Math.abs(y / b))
      z *= 1 + bulge * (1 - nx ** 4) * (1 - ny ** 4)
    }

    if (wrinkle !== 0) {
      const radius = Math.hypot(x, z)
      if (radius > 1e-6) {
        const angle = Math.atan2(z, x)
        const fade = Math.pow(Math.max(0, Math.cos(v)), 0.55)
        const factor = 1 + wrinkle * Math.cos(folds * angle) * fade
        x *= factor
        z *= factor
      }
    }

    out.set(x, y, z)
  }

  const positions: number[] = []
  const normals: number[] = []
  const uvs: number[] = []
  const indices: number[] = []
  const p = new THREE.Vector3()
  const n = new THREE.Vector3()
  const previous = new THREE.Vector3()
  const current = new THREE.Vector3()

  // Superellipsoids compress their angular parameterisation near the flat
  // faces. Mapping UVs to the real arc length keeps the printed motifs the same
  // size across the whole wrapper instead of blowing them up in the centre.
  const uCoords = new Float32Array(segU + 1)
  point(0, 0, previous)
  let uTotal = 0
  for (let iu = 1; iu <= segU; iu++) {
    const u = (iu / segU) * TAU
    point(u, 0, current)
    uTotal += current.distanceTo(previous)
    uCoords[iu] = uTotal
    previous.copy(current)
  }
  for (let iu = 0; iu <= segU; iu++) {
    uCoords[iu] = uTotal > 0 ? uCoords[iu] / uTotal : iu / segU
  }

  const vCoords = new Float32Array(segV + 1)
  point(Math.PI / 2, -Math.PI / 2, previous)
  let vTotal = 0
  for (let iv = 1; iv <= segV; iv++) {
    const v = -Math.PI / 2 + (iv / segV) * Math.PI
    point(Math.PI / 2, v, current)
    vTotal += current.distanceTo(previous)
    vCoords[iv] = vTotal
    previous.copy(current)
  }
  for (let iv = 0; iv <= segV; iv++) {
    vCoords[iv] = vTotal > 0 ? vCoords[iv] / vTotal : iv / segV
  }

  for (let iv = 0; iv <= segV; iv++) {
    const v = -Math.PI / 2 + (iv / segV) * Math.PI
    for (let iu = 0; iu <= segU; iu++) {
      const u = (iu / segU) * TAU
      point(u, v, p)
      positions.push(p.x, p.y, p.z)
      uvs.push(uCoords[iu], vCoords[iv])
      surfaceNormal(point, u, v, -Math.PI / 2, Math.PI / 2, n)
      normals.push(n.x, n.y, n.z)
    }
  }

  const cols = segU + 1
  for (let iv = 0; iv < segV; iv++) {
    for (let iu = 0; iu < segU; iu++) {
      const a0 = iv * cols + iu
      const b0 = a0 + 1
      const c0 = a0 + cols
      const d0 = c0 + 1
      indices.push(a0, c0, b0, b0, c0, d0)
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geometry.setIndex(indices)
  geometry.computeBoundingBox()
  geometry.computeBoundingSphere()
  return geometry
}

interface TailOptions {
  length: number
  startRadius: number
  endRadius: number
  flutes?: number
  amplitude?: number
  twist?: number
  segU?: number
  segV?: number
}

/**
 * The gathered, fluted end of a twist-wrapped candy. It grows from a narrow
 * neck to a star-shaped fan and is closed with a small crumpled cap.
 */
function createTwistTail({
  length,
  startRadius,
  endRadius,
  flutes = 12,
  amplitude = 0.18,
  twist = 0.5,
  segU = 96,
  segV = 48,
}: TailOptions): THREE.BufferGeometry {
  const point = (u: number, v: number, out: THREE.Vector3) => {
    const t = v
    const base = startRadius + (endRadius - startRadius) * Math.pow(t, 1.5)
    const amp = amplitude * Math.pow(t, 1.8)
    const wave = Math.cos(flutes * u + twist * TAU * t)
    const radius = base * (1 + amp * wave)
    const x = length * t + 0.014 * t * t * Math.cos(flutes * u + 0.6)
    const flatten = 1 - 0.32 * Math.pow(t, 1.3)
    out.set(x, radius * Math.cos(u), radius * Math.sin(u) * flatten)
  }

  const positions: number[] = []
  const normals: number[] = []
  const uvs: number[] = []
  const indices: number[] = []
  const p = new THREE.Vector3()
  const n = new THREE.Vector3()

  for (let iv = 0; iv <= segV; iv++) {
    const v = iv / segV
    for (let iu = 0; iu <= segU; iu++) {
      const u = (iu / segU) * TAU
      point(u, v, p)
      positions.push(p.x, p.y, p.z)
      uvs.push(iu / segU, v)
      surfaceNormal(point, u, v, 0, 1, n, true)
      normals.push(n.x, n.y, n.z)
    }
  }

  const cols = segU + 1
  for (let iv = 0; iv < segV; iv++) {
    for (let iu = 0; iu < segU; iu++) {
      const a0 = iv * cols + iu
      const b0 = a0 + 1
      const c0 = a0 + cols
      const d0 = c0 + 1
      indices.push(a0, b0, c0, b0, d0, c0)
    }
  }

  // The narrow end is tucked inside the candy body; cap it anyway so the
  // geometry stays watertight.
  const startRingStart = positions.length / 3
  for (let iu = 0; iu <= segU; iu++) {
    const u = (iu / segU) * TAU
    point(u, 0, p)
    positions.push(p.x, p.y, p.z)
    normals.push(-1, 0, 0)
    uvs.push(iu / segU, 0)
  }
  const startCenter = positions.length / 3
  positions.push(0, 0, 0)
  normals.push(-1, 0, 0)
  uvs.push(0.5, 0)
  for (let iu = 0; iu < segU; iu++) {
    indices.push(startRingStart + iu + 1, startRingStart + iu, startCenter)
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geometry.setIndex(indices)
  geometry.computeBoundingBox()
  geometry.computeBoundingSphere()
  return geometry
}

/**
 * A thin, serrated seal at one end of a flow-wrapped candy.
 */
function createCrimp(width: number, height: number, side: -1 | 1): THREE.BufferGeometry {
  const halfWidth = width / 2
  const halfHeight = (height / 2) * 1.035
  const band = 0.14
  const teeth = 20
  const innerX = side * (halfWidth - 0.1)
  const outerX = side * (halfWidth + band)
  const tooth = side * 0.028

  const shape = new THREE.Shape()
  shape.moveTo(innerX, -halfHeight)
  shape.lineTo(outerX, -halfHeight)
  for (let i = 1; i <= teeth; i++) {
    const y = -halfHeight + (2 * halfHeight * i) / teeth
    shape.lineTo(outerX + (i % 2 === 0 ? tooth : 0), y)
  }
  shape.lineTo(innerX, halfHeight)
  shape.closePath()

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.024,
    bevelEnabled: true,
    bevelThickness: 0.006,
    bevelSize: 0.006,
    bevelSegments: 2,
    steps: 1,
    curveSegments: 1,
  })
  geometry.translate(0, 0, -0.012)
  geometry.computeBoundingBox()
  geometry.computeBoundingSphere()
  return geometry
}

function addCrimps(parts: ShapePart[], width: number, height: number) {
  parts.push({ geometry: createCrimp(width, height, -1), kind: 'crimp' })
  parts.push({ geometry: createCrimp(width, height, 1), kind: 'crimp' })
}

function finalize(parts: ShapePart[], body: THREE.BufferGeometry): ShapeBuild {
  const box = new THREE.Box3()
  for (const part of parts) {
    part.geometry.computeBoundingBox()
    if (part.geometry.boundingBox) box.union(part.geometry.boundingBox)
  }

  const center = box.getCenter(new THREE.Vector3())
  for (const part of parts) {
    part.geometry.translate(-center.x, -center.y, -center.z)
  }

  body.computeBoundingBox()
  const bodyBox = body.boundingBox!
  const size = box.getSize(new THREE.Vector3())

  return {
    parts,
    body,
    bodyWidth: bodyBox.max.x - bodyBox.min.x,
    bodyHeight: bodyBox.max.y - bodyBox.min.y,
    bodyFrontZ: bodyBox.max.z,
    bodyBackZ: bodyBox.min.z,
    bodyCenterY: (bodyBox.max.y + bodyBox.min.y) / 2,
    groundY: -size.y / 2 - 0.045,
    radius: Math.max(size.x, size.y, size.z) / 2,
  }
}

function buildPillow(): ShapeBuild {
  const width = 3.3
  const height = 1.9
  const depth = 0.95

  const body = createSuperellipsoid({
    width,
    height,
    depth,
    e1: 0.3,
    e2: 0.36,
    bulge: 0.05,
    segU: 96,
    segV: 64,
  })

  const parts: ShapePart[] = [{ geometry: body, kind: 'wrapper' }]
  addCrimps(parts, width, height)
  return finalize(parts, body)
}

function buildLollipop(): ShapeBuild {
  const width = 2.15
  const height = 2.15
  const depth = 0.92

  const body = createSuperellipsoid({
    width,
    height,
    depth,
    e1: 0.3,
    e2: 0.36,
    bulge: 0.05,
    segU: 88,
    segV: 60,
  })

  const parts: ShapePart[] = [{ geometry: body, kind: 'wrapper' }]
  addCrimps(parts, width, height)

  const stick = new THREE.CapsuleGeometry(0.055, 0.9, 8, 20)
  stick.translate(0, -height / 2 - 0.44, 0)
  parts.push({ geometry: stick, kind: 'stick' })

  return finalize(parts, body)
}

function buildTwist(): ShapeBuild {
  const width = 2.5
  const height = 1.22
  const depth = 1.18

  const body = createSuperellipsoid({
    width,
    height,
    depth,
    e1: 0.36,
    e2: 0.32,
    bulge: 0.03,
    segU: 88,
    segV: 56,
  })

  const baseX = width / 2 - 0.25
  const rightTail = createTwistTail({
    length: 1.0,
    startRadius: 0.28,
    endRadius: 0.7,
    flutes: 16,
    amplitude: 0.1,
    twist: 0.55,
  })
  rightTail.translate(baseX, 0, 0)

  const leftTail = createTwistTail({
    length: 1.0,
    startRadius: 0.28,
    endRadius: 0.7,
    flutes: 16,
    amplitude: 0.1,
    twist: 0.55,
  })
  leftTail.rotateY(Math.PI)
  leftTail.translate(-baseX, 0, 0)

  const parts: ShapePart[] = [
    { geometry: body, kind: 'wrapper' },
    { geometry: leftTail, kind: 'tail' },
    { geometry: rightTail, kind: 'tail' },
  ]

  return finalize(parts, body)
}

function buildOval(): ShapeBuild {
  const width = 2.7
  const height = 1.55
  const depth = 1.5

  const body = createSuperellipsoid({
    width,
    height,
    depth,
    e1: 0.82,
    e2: 0.72,
    bulge: 0.02,
    segU: 96,
    segV: 64,
  })

  const baseX = width / 2 - 0.23
  const tailOptions: TailOptions = {
    length: 0.9,
    startRadius: 0.26,
    endRadius: 0.62,
    flutes: 16,
    amplitude: 0.1,
    twist: 0.5,
  }

  const rightTail = createTwistTail(tailOptions)
  rightTail.translate(baseX, 0, 0)

  const leftTail = createTwistTail(tailOptions)
  leftTail.rotateY(Math.PI)
  leftTail.translate(-baseX, 0, 0)

  const parts: ShapePart[] = [
    { geometry: body, kind: 'wrapper' },
    { geometry: leftTail, kind: 'tail' },
    { geometry: rightTail, kind: 'tail' },
  ]

  return finalize(parts, body)
}

function buildVertical(): ShapeBuild {
  const width = 1.6
  const height = 2.15
  const depth = 1.35

  const body = createSuperellipsoid({
    width,
    height,
    depth,
    e1: 0.45,
    e2: 0.5,
    bulge: 0.05,
    wrinkle: 0.028,
    folds: 14,
    segU: 96,
    segV: 72,
  })

  const tail = createTwistTail({
    length: 1.05,
    startRadius: 0.4,
    endRadius: 0.72,
    flutes: 15,
    amplitude: 0.11,
    twist: 0.5,
  })
  tail.rotateZ(Math.PI / 2)
  tail.translate(0, height / 2 - 0.25, 0)

  const parts: ShapePart[] = [
    { geometry: body, kind: 'wrapper' },
    { geometry: tail, kind: 'tail' },
  ]

  return finalize(parts, body)
}

export function buildCandy(shape: ShapeKey): ShapeBuild {
  switch (shape) {
    case 'lollipop':
      return buildLollipop()
    case 'twist':
      return buildTwist()
    case 'oval':
      return buildOval()
    case 'vertical':
      return buildVertical()
    case 'pillow':
    default:
      return buildPillow()
  }
}

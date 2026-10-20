import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

export interface LogoTextureState {
  texture: THREE.Texture
  aspect: number
}

export function useLogoTexture(url: string | null): LogoTextureState | null {
  const [state, setState] = useState<LogoTextureState | null>(null)
  const textureRef = useRef<THREE.Texture | null>(null)

  useEffect(() => {
    if (!url) {
      textureRef.current?.dispose()
      textureRef.current = null
      setState(null)
      return
    }

    let cancelled = false
    const loader = new THREE.TextureLoader()

    loader.load(
      url,
      (texture) => {
        if (cancelled) {
          texture.dispose()
          return
        }
        texture.colorSpace = THREE.SRGBColorSpace
        texture.anisotropy = 8
        texture.minFilter = THREE.LinearMipmapLinearFilter
        texture.magFilter = THREE.LinearFilter
        texture.needsUpdate = true

        const image = texture.image as { width?: number; height?: number } | undefined
        const width = image?.width ?? 1
        const height = image?.height ?? 1

        textureRef.current?.dispose()
        textureRef.current = texture
        setState({ texture, aspect: width / height || 1 })
      },
      undefined,
      () => {
        if (!cancelled) {
          setState(null)
        }
      },
    )

    return () => {
      cancelled = true
    }
  }, [url])

  useEffect(
    () => () => {
      textureRef.current?.dispose()
    },
    [],
  )

  return state
}

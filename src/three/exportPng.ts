import * as THREE from 'three'
import type { ViewerApi } from './CandyScene'

/**
 * Renders the current scene into a square off-screen buffer and returns a PNG
 * data URL. The live canvas is restored immediately afterwards.
 */
export async function exportViewerPng(
  api: ViewerApi,
  size: number,
  background: string | null,
): Promise<string> {
  const { gl, scene, camera } = api
  const previousSize = gl.getSize(new THREE.Vector2())
  const previousPixelRatio = gl.getPixelRatio()
  const previousAspect = camera.aspect
  const previousBackground = scene.background
  const previousClearAlpha = gl.getClearAlpha()
  const hidden: THREE.Object3D[] = []

  // On solid backgrounds the soft contact shadow helps ground the candy. On a
  // transparent PNG it would only look like a dirty smudge, so hide it there.
  if (background === null) {
    scene.traverse((object) => {
      if (object.name === 'studio-shadow' && object.visible) {
        object.visible = false
        hidden.push(object)
      }
    })
  }

  try {
    gl.setPixelRatio(1)
    gl.setSize(size, size, false)
    camera.aspect = 1
    camera.updateProjectionMatrix()

    if (background) {
      scene.background = new THREE.Color(background)
    } else {
      scene.background = null
      gl.setClearAlpha(0)
    }

    gl.render(scene, camera)
    return gl.domElement.toDataURL('image/png')
  } finally {
    scene.background = previousBackground
    gl.setClearAlpha(previousClearAlpha)
    hidden.forEach((object) => {
      object.visible = true
    })
    gl.setPixelRatio(previousPixelRatio)
    gl.setSize(previousSize.x, previousSize.y, false)
    camera.aspect = previousAspect
    camera.updateProjectionMatrix()
    gl.render(scene, camera)
  }
}

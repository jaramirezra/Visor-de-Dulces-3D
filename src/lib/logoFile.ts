const MAX_DATA_URL_LENGTH = 4_000_000

function ensureStorageSize(dataUrl: string): string {
  if (dataUrl.length > MAX_DATA_URL_LENGTH) {
    throw new Error(
      'El logo es demasiado grande para guardarlo. Usa una imagen más simple o de menor resolución.',
    )
  }
  return dataUrl
}

function readAsDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('No se pudo leer el archivo.'))
    reader.readAsDataURL(blob)
  })
}

/**
 * Keeps uploaded logos small enough to live comfortably in localStorage while
 * preserving transparency.
 */
export async function processLogoFile(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('El archivo debe ser una imagen (PNG, SVG, JPG o WebP).')
  }
  if (file.size > 8 * 1024 * 1024) {
    throw new Error('El logo no puede superar los 8 MB.')
  }

  if (file.type === 'image/svg+xml') {
    return ensureStorageSize(await readAsDataUrl(file))
  }

  const bitmap = await createImageBitmap(file)
  const maxDimension = 1200
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height))

  if (scale === 1) {
    bitmap.close()
    return ensureStorageSize(await readAsDataUrl(file))
  }

  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(bitmap.width * scale))
  canvas.height = Math.max(1, Math.round(bitmap.height * scale))
  const context = canvas.getContext('2d')

  if (!context) {
    bitmap.close()
    throw new Error('No se pudo procesar la imagen.')
  }

  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
  if (!blob) {
    throw new Error('No se pudo procesar la imagen.')
  }

  return ensureStorageSize(await readAsDataUrl(blob))
}

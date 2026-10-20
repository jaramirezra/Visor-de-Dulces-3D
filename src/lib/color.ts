export interface ColorPreset {
  name: string
  value: string
}

export const COLOR_PRESETS: ColorPreset[] = [
  { name: 'Rosa', value: '#f6bfc7' },
  { name: 'Crema', value: '#f6e6c8' },
  { name: 'Menta', value: '#cfe8d8' },
  { name: 'Limón', value: '#f4e39a' },
  { name: 'Melocotón', value: '#f7c49a' },
  { name: 'Cielo', value: '#c9d8f0' },
  { name: 'Lavanda', value: '#d9c8ea' },
  { name: 'Nube', value: '#eee8df' },
  { name: 'Cacao', value: '#7b4638' },
  { name: 'Cereza', value: '#b9354c' },
  { name: 'Bosque', value: '#2f4a43' },
  { name: 'Blanco', value: '#fbf7f1' },
]

export function normalizeHex(input: string): string | null {
  const value = input.trim()
  if (/^#[0-9a-f]{6}$/i.test(value)) return value.toLowerCase()
  if (/^[0-9a-f]{6}$/i.test(value)) return `#${value.toLowerCase()}`
  return null
}

function parseHex(hex: string): [number, number, number] {
  const clean = hex.replace('#', '')
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((char) => char + char)
          .join('')
      : clean
  const value = Number.parseInt(full, 16)
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255]
}

function toHex(r: number, g: number, b: number) {
  const part = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0')
  return `#${part(r)}${part(g)}${part(b)}`
}

export function mixHex(a: string, b: string, amount: number): string {
  const t = Math.max(0, Math.min(1, amount))
  const [ar, ag, ab] = parseHex(a)
  const [br, bg, bb] = parseHex(b)
  return toHex(ar + (br - ar) * t, ag + (bg - ag) * t, ab + (bb - ab) * t)
}

export function lighten(hex: string, amount: number): string {
  return mixHex(hex, '#ffffff', amount)
}

export function darken(hex: string, amount: number): string {
  return mixHex(hex, '#000000', amount)
}

export function isLightColor(hex: string): boolean {
  const [r, g, b] = parseHex(hex)
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
  return luminance > 0.62
}

export function finishPreview(finish: string, baseColor: string): string {
  switch (finish) {
    case 'mate':
      return `linear-gradient(145deg, ${lighten(baseColor, 0.1)}, ${baseColor})`
    case 'satinado':
      return `linear-gradient(140deg, ${darken(baseColor, 0.08)} 0%, ${lighten(baseColor, 0.32)} 48%, ${baseColor} 100%)`
    case 'brillante':
      return `radial-gradient(circle at 32% 26%, #ffffff 0%, ${lighten(baseColor, 0.28)} 22%, ${baseColor} 58%, ${darken(baseColor, 0.12)} 100%)`
    case 'metalizado':
      return `linear-gradient(118deg, ${darken(baseColor, 0.4)} 0%, #ffffff 18%, ${lighten(baseColor, 0.1)} 34%, ${darken(baseColor, 0.3)} 52%, #ffffff 68%, ${baseColor} 84%, ${darken(baseColor, 0.35)} 100%)`
    default:
      return baseColor
  }
}

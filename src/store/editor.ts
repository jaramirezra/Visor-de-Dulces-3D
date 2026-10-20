import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ShapeKey } from '../three/geometry'
import type { PatternType } from '../three/textures'
import { DEFAULT_LOGO } from '../lib/sampleLogo'

export type FinishKey = 'mate' | 'satinado' | 'brillante' | 'metalizado'
export type BackgroundKey = 'transparente' | 'crema' | 'blanco' | 'oscuro'
export type LightKey = 'estudio' | 'calido' | 'frio'

export interface FinishPreset {
  label: string
  description: string
  roughness: number
  metalness: number
  clearcoat: number
  clearcoatRoughness: number
  envMapIntensity: number
}

export const FINISHES: Record<FinishKey, FinishPreset> = {
  mate: {
    label: 'Mate',
    description: 'Papel suave',
    roughness: 0.78,
    metalness: 0,
    clearcoat: 0,
    clearcoatRoughness: 0.7,
    envMapIntensity: 0.55,
  },
  satinado: {
    label: 'Satinado',
    description: 'Brillo discreto',
    roughness: 0.4,
    metalness: 0,
    clearcoat: 0.16,
    clearcoatRoughness: 0.45,
    envMapIntensity: 0.8,
  },
  brillante: {
    label: 'Brillante',
    description: 'Plástico luminoso',
    roughness: 0.18,
    metalness: 0,
    clearcoat: 0.55,
    clearcoatRoughness: 0.18,
    envMapIntensity: 1.0,
  },
  metalizado: {
    label: 'Metalizado',
    description: 'Foil premium',
    roughness: 0.3,
    metalness: 0.5,
    clearcoat: 0.2,
    clearcoatRoughness: 0.25,
    envMapIntensity: 1.0,
  },
}

export interface BackgroundPreset {
  label: string
  color: string | null
}

export const BACKGROUNDS: Record<BackgroundKey, BackgroundPreset> = {
  transparente: { label: 'Transparente', color: null },
  crema: { label: 'Crema', color: '#f7efe3' },
  blanco: { label: 'Blanco', color: '#ffffff' },
  oscuro: { label: 'Tinta', color: '#241b16' },
}

export interface LightPreset {
  label: string
  ambient: number
  key: string
  keyIntensity: number
  fill: string
  fillIntensity: number
  rim: string
  rimIntensity: number
  envTop: string
  envLeft: string
  envRight: string
}

export const LIGHTS: Record<LightKey, LightPreset> = {
  estudio: {
    label: 'Estudio',
    ambient: 0.55,
    key: '#fff6e9',
    keyIntensity: 2.0,
    fill: '#dce8ff',
    fillIntensity: 0.75,
    rim: '#ffe2c8',
    rimIntensity: 1.0,
    envTop: '#fff1dc',
    envLeft: '#cfe0ff',
    envRight: '#ffd7c2',
  },
  calido: {
    label: 'Cálida',
    ambient: 0.36,
    key: '#ffdcb4',
    keyIntensity: 2.7,
    fill: '#ffc9a8',
    fillIntensity: 0.55,
    rim: '#fff0d8',
    rimIntensity: 1.1,
    envTop: '#ffd6a8',
    envLeft: '#ffb98f',
    envRight: '#ffe8c8',
  },
  frio: {
    label: 'Fría',
    ambient: 0.5,
    key: '#f2f7ff',
    keyIntensity: 2.35,
    fill: '#c6dcff',
    fillIntensity: 1.05,
    rim: '#e8f3ff',
    rimIntensity: 1.1,
    envTop: '#e8f2ff',
    envLeft: '#b8d2ff',
    envRight: '#dcecff',
  },
}

export const EXPORT_SIZES = [
  { value: 1024, label: '1K', detail: '1024 px' },
  { value: 2048, label: '2K', detail: '2048 px' },
  { value: 4096, label: '4K', detail: '4096 px' },
]

export interface EditorState {
  shape: ShapeKey
  baseColor: string
  pattern: PatternType
  patternColor: string
  patternScale: number
  patternDensity: number
  patternRotation: number
  logo: string | null
  logoScale: number
  logoX: number
  logoY: number
  logoRotation: number
  logoBothSides: boolean
  finish: FinishKey
  background: BackgroundKey
  light: LightKey
  exportSize: number
  autoRotate: boolean
  update: (patch: Partial<EditorState>) => void
  reset: () => void
}

const defaults = {
  shape: 'pillow' as ShapeKey,
  baseColor: '#f6bfc7',
  pattern: 'hearts' as PatternType,
  patternColor: '#fff4ef',
  patternScale: 0.7,
  patternDensity: 1.25,
  patternRotation: 0,
  logo: DEFAULT_LOGO,
  logoScale: 1,
  logoX: 0,
  logoY: 0,
  logoRotation: 0,
  logoBothSides: false,
  finish: 'mate' as FinishKey,
  background: 'transparente' as BackgroundKey,
  light: 'estudio' as LightKey,
  exportSize: 2048,
  autoRotate: false,
}

export const useEditor = create<EditorState>()(
  persist(
    (set) => ({
      ...defaults,
      update: (patch) => set(patch),
      reset: () => set({ ...defaults }),
    }),
    {
      name: 'dulce-studio-v1',
      version: 1,
      partialize: (state) => ({
        shape: state.shape,
        baseColor: state.baseColor,
        pattern: state.pattern,
        patternColor: state.patternColor,
        patternScale: state.patternScale,
        patternDensity: state.patternDensity,
        patternRotation: state.patternRotation,
        logo: state.logo,
        logoScale: state.logoScale,
        logoX: state.logoX,
        logoY: state.logoY,
        logoRotation: state.logoRotation,
        logoBothSides: state.logoBothSides,
        finish: state.finish,
        background: state.background,
        light: state.light,
        exportSize: state.exportSize,
        autoRotate: state.autoRotate,
      }),
    },
  ),
)

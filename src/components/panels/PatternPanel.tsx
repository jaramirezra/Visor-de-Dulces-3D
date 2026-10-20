import type { ComponentType, SVGProps } from 'react'
import type { PatternType } from '../../three/textures'
import { useEditor } from '../../store/editor'
import {
  ConfettiIcon,
  DotIcon,
  HeartIcon,
  InfoIcon,
  StarIcon,
  StripeIcon,
} from '../Icons'
import { ColorField } from '../ui/ColorField'
import { Slider } from '../ui/Slider'

type PreviewIcon = ComponentType<SVGProps<SVGSVGElement>>

const PATTERNS: Array<{ key: PatternType; label: string; icons: PreviewIcon[] }> = [
  { key: 'none', label: 'Sin patrón', icons: [] },
  { key: 'hearts', label: 'Corazones', icons: [HeartIcon, HeartIcon, HeartIcon] },
  { key: 'stars', label: 'Estrellas', icons: [StarIcon, StarIcon, StarIcon] },
  { key: 'dots', label: 'Lunares', icons: [DotIcon, DotIcon, DotIcon] },
  { key: 'stripes', label: 'Rayas', icons: [StripeIcon] },
  { key: 'confetti', label: 'Confeti', icons: [ConfettiIcon] },
]

export function PatternPanel() {
  const baseColor = useEditor((state) => state.baseColor)
  const pattern = useEditor((state) => state.pattern)
  const patternColor = useEditor((state) => state.patternColor)
  const patternScale = useEditor((state) => state.patternScale)
  const patternDensity = useEditor((state) => state.patternDensity)
  const patternRotation = useEditor((state) => state.patternRotation)
  const update = useEditor((state) => state.update)

  const rotationDisabled =
    pattern === 'none' || pattern === 'dots' || pattern === 'stripes'

  return (
    <div className="section">
      <div className="section-heading">
        <h2 className="section-title">Patrón</h2>
        <p className="section-sub">
          Añade motivos impresos a la envoltura y ajústalos a tu gusto.
        </p>
      </div>

      <div className="pattern-grid" role="group" aria-label="Motivo del patrón">
        {PATTERNS.map(({ key, label, icons }) => {
          const active = pattern === key
          return (
            <button
              key={key}
              type="button"
              className={`pattern-option${active ? ' active' : ''}`}
              onClick={() => update({ pattern: key })}
              aria-pressed={active}
            >
              <span
                className="pattern-preview"
                style={{ background: baseColor, color: patternColor }}
              >
                {key === 'none' ? (
                  <span className="pattern-none">—</span>
                ) : key === 'stripes' ? (
                  <StripeIcon className="pattern-icon single" />
                ) : key === 'confetti' ? (
                  <ConfettiIcon className="pattern-icon single" />
                ) : (
                  icons.map((Icon, index) => (
                    <Icon key={index} className={`pattern-icon spot spot-${index + 1}`} />
                  ))
                )}
              </span>
              <span>{label}</span>
            </button>
          )
        })}
      </div>

      <ColorField
        label="Color del patrón"
        value={patternColor}
        onChange={(value) => update({ patternColor: value })}
      />

      <Slider
        label="Escala"
        value={patternScale}
        min={0.5}
        max={1.8}
        step={0.01}
        onChange={(value) => update({ patternScale: value })}
        format={(value) => `${Math.round(value * 100)}%`}
        disabled={pattern === 'none'}
      />
      <Slider
        label="Densidad"
        value={patternDensity}
        min={0.3}
        max={1.8}
        step={0.01}
        onChange={(value) => update({ patternDensity: value })}
        format={(value) => `${Math.round(value * 100)}%`}
        disabled={pattern === 'none'}
      />
      <Slider
        label="Rotación"
        value={patternRotation}
        min={0}
        max={360}
        step={1}
        onChange={(value) => update({ patternRotation: value })}
        format={(value) => `${Math.round(value)}°`}
        disabled={rotationDisabled}
      />

      <p className="tip">
        <InfoIcon />
        El patrón se repite por toda la envoltura, también en el reverso.
      </p>
    </div>
  )
}

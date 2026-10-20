import type { ComponentType, SVGProps } from 'react'
import type { ShapeKey } from '../three/geometry'
import { useEditor } from '../store/editor'
import {
  ShapeLollipop,
  ShapeOval,
  ShapePillow,
  ShapeTwist,
  ShapeVertical,
} from './Icons'

interface ShapeItem {
  key: ShapeKey
  label: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
}

const SHAPES: ShapeItem[] = [
  { key: 'pillow', label: 'Clásico', icon: ShapePillow },
  { key: 'lollipop', label: 'Palito', icon: ShapeLollipop },
  { key: 'twist', label: 'Twist', icon: ShapeTwist },
  { key: 'oval', label: 'Ovalado', icon: ShapeOval },
  { key: 'vertical', label: 'Vertical', icon: ShapeVertical },
]

export function ShapeRail() {
  const shape = useEditor((state) => state.shape)
  const update = useEditor((state) => state.update)

  return (
    <nav className="rail" aria-label="Forma del dulce">
      <span className="rail-title">Forma</span>
      {SHAPES.map(({ key, label, icon: Icon }) => {
        const active = shape === key
        return (
          <button
            key={key}
            type="button"
            className={`shape-btn${active ? ' active' : ''}`}
            onClick={() => update({ shape: key })}
            aria-pressed={active}
            title={label}
          >
            <Icon />
            <span>{label}</span>
          </button>
        )
      })}
    </nav>
  )
}

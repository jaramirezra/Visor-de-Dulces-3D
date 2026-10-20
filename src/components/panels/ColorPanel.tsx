import { COLOR_PRESETS, isLightColor } from '../../lib/color'
import { useEditor } from '../../store/editor'
import { CheckIcon, InfoIcon } from '../Icons'
import { ColorField } from '../ui/ColorField'

export function ColorPanel() {
  const baseColor = useEditor((state) => state.baseColor)
  const update = useEditor((state) => state.update)

  return (
    <div className="section">
      <div className="section-heading">
        <h2 className="section-title">Color del envoltorio</h2>
        <p className="section-sub">
          Elige el color base de la envoltura. El patrón y el logo se aplican encima.
        </p>
      </div>

      <ColorField
        label="Color base"
        value={baseColor}
        onChange={(value) => update({ baseColor: value })}
      />

      <div className="swatches" role="group" aria-label="Colores predefinidos">
        {COLOR_PRESETS.map((preset) => {
          const active = preset.value.toLowerCase() === baseColor.toLowerCase()
          return (
            <button
              key={preset.value}
              type="button"
              className={`swatch${active ? ' active' : ''}`}
              style={{ background: preset.value }}
              onClick={() => update({ baseColor: preset.value })}
              title={preset.name}
              aria-label={preset.name}
              aria-pressed={active}
            >
              {active && (
                <CheckIcon
                  className="swatch-check"
                  style={{ color: isLightColor(preset.value) ? '#2a1a12' : '#fff8ee' }}
                />
              )}
            </button>
          )
        })}
      </div>

      <p className="tip">
        <InfoIcon />
        El color cubre toda la envoltura, incluidas las puntas y los pliegues.
      </p>
    </div>
  )
}

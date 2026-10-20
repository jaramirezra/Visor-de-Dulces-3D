import { finishPreview } from '../../lib/color'
import {
  BACKGROUNDS,
  FINISHES,
  LIGHTS,
  useEditor,
  type BackgroundKey,
  type FinishKey,
  type LightKey,
} from '../../store/editor'
import { CheckIcon, InfoIcon, SparkleIcon } from '../Icons'

export function FinishPanel() {
  const baseColor = useEditor((state) => state.baseColor)
  const finish = useEditor((state) => state.finish)
  const light = useEditor((state) => state.light)
  const background = useEditor((state) => state.background)
  const update = useEditor((state) => state.update)

  return (
    <div className="section">
      <div className="section-heading">
        <h2 className="section-title">Acabado del papel</h2>
        <p className="section-sub">
          Cambia cómo responde la superficie a la luz: papel, plástico o foil.
        </p>
      </div>

      <div className="finish-grid" role="group" aria-label="Acabado">
        {(Object.keys(FINISHES) as FinishKey[]).map((key) => {
          const preset = FINISHES[key]
          const active = finish === key
          return (
            <button
              key={key}
              type="button"
              className={`finish-card${active ? ' active' : ''}`}
              onClick={() => update({ finish: key })}
              aria-pressed={active}
            >
              <span
                className="finish-orb"
                style={{ background: finishPreview(key, baseColor) }}
              />
              <span className="finish-copy">
                <strong>{preset.label}</strong>
                <small>{preset.description}</small>
              </span>
              {active && <CheckIcon className="card-check" />}
            </button>
          )
        })}
      </div>

      <div className="sub-section">
        <div className="field-head">
          <span className="field-label">Iluminación</span>
          <SparkleIcon className="field-icon" />
        </div>
        <div className="segmented" role="group" aria-label="Iluminación">
          {(Object.keys(LIGHTS) as LightKey[]).map((key) => (
            <button
              key={key}
              type="button"
              className={light === key ? 'active' : ''}
              onClick={() => update({ light: key })}
              aria-pressed={light === key}
            >
              {LIGHTS[key].label}
            </button>
          ))}
        </div>
      </div>

      <div className="sub-section">
        <div className="section-heading compact">
          <h3 className="section-title">Fondo del PNG</h3>
          <p className="section-sub">
            La vista usa un fondo de estudio; esta opción se aplica al archivo exportado.
          </p>
        </div>
        <div className="bg-grid" role="group" aria-label="Fondo del PNG">
          {(Object.keys(BACKGROUNDS) as BackgroundKey[]).map((key) => {
            const preset = BACKGROUNDS[key]
            const active = background === key
            return (
              <button
                key={key}
                type="button"
                className={`bg-option${active ? ' active' : ''}`}
                onClick={() => update({ background: key })}
                aria-pressed={active}
              >
                <span
                  className={`bg-chip${key === 'transparente' ? ' transparent' : ''}`}
                  style={preset.color ? { background: preset.color } : undefined}
                >
                  {active && (
                    <CheckIcon
                      style={{ color: key === 'oscuro' ? '#fff8ee' : '#2a1a12' }}
                    />
                  )}
                </span>
                <span>{preset.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <p className="tip">
        <InfoIcon />
        Los fondos transparentes se exportan sin sombra para que puedas montar el dulce
        sobre cualquier diseño.
      </p>
    </div>
  )
}

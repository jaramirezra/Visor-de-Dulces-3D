import { useEffect } from 'react'
import { BACKGROUNDS, EXPORT_SIZES, useEditor } from '../store/editor'
import { CheckIcon, CloseIcon, DownloadIcon, SpinnerIcon } from './Icons'

interface ExportDialogProps {
  open: boolean
  exporting: boolean
  onClose: () => void
  onExport: () => void
}

export function ExportDialog({ open, exporting, onClose, onExport }: ExportDialogProps) {
  const exportSize = useEditor((state) => state.exportSize)
  const background = useEditor((state) => state.background)
  const update = useEditor((state) => state.update)

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !exporting) onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, exporting, onClose])

  if (!open) return null

  const backgroundPreset = BACKGROUNDS[background]

  return (
    <div
      className="modal-backdrop"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget && !exporting) onClose()
      }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-title"
      >
        <div className="modal-head">
          <div className="modal-title-wrap">
            <span className="modal-icon">
              <DownloadIcon />
            </span>
            <div>
              <h2 id="export-title">Descargar PNG</h2>
              <p>Se exporta el ángulo actual del visor, sin fondo de estudio.</p>
            </div>
          </div>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Cerrar"
            disabled={exporting}
          >
            <CloseIcon />
          </button>
        </div>

        <p className="option-label">Resolución</p>
        <div className="res-grid" role="group" aria-label="Resolución">
          {EXPORT_SIZES.map((option) => {
            const active = exportSize === option.value
            return (
              <button
                key={option.value}
                type="button"
                className={`res-option${active ? ' active' : ''}`}
                onClick={() => update({ exportSize: option.value })}
                aria-pressed={active}
                disabled={exporting}
              >
                <strong>{option.label}</strong>
                <small>{option.detail}</small>
                {active && <CheckIcon className="res-check" />}
              </button>
            )
          })}
        </div>

        <p className="option-label">Fondo</p>
        <div className="bg-grid" role="group" aria-label="Fondo del PNG">
          {(Object.keys(BACKGROUNDS) as Array<keyof typeof BACKGROUNDS>).map((key) => {
            const preset = BACKGROUNDS[key]
            const active = background === key
            return (
              <button
                key={key}
                type="button"
                className={`bg-option${active ? ' active' : ''}`}
                onClick={() => update({ background: key })}
                aria-pressed={active}
                disabled={exporting}
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

        <div className="modal-summary">
          <span>{exportSize} × {exportSize} px</span>
          <span>Fondo {backgroundPreset.label.toLowerCase()}</span>
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onClose}
            disabled={exporting}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onExport}
            disabled={exporting}
          >
            {exporting ? (
              <>
                <SpinnerIcon className="spin" />
                Generando…
              </>
            ) : (
              <>
                <DownloadIcon />
                Descargar PNG
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

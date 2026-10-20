import { useRef, useState, type DragEvent } from 'react'
import { processLogoFile } from '../../lib/logoFile'
import { DEFAULT_LOGO } from '../../lib/sampleLogo'
import { useEditor } from '../../store/editor'
import { InfoIcon, TrashIcon, UploadIcon } from '../Icons'
import { Slider } from '../ui/Slider'

interface LogoPanelProps {
  onToast: (message: string) => void
}

export function LogoPanel({ onToast }: LogoPanelProps) {
  const logo = useEditor((state) => state.logo)
  const logoScale = useEditor((state) => state.logoScale)
  const logoX = useEditor((state) => state.logoX)
  const logoY = useEditor((state) => state.logoY)
  const logoRotation = useEditor((state) => state.logoRotation)
  const logoBothSides = useEditor((state) => state.logoBothSides)
  const update = useEditor((state) => state.update)

  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = async (file: File | undefined) => {
    if (!file) return
    setError(null)
    setBusy(true)
    try {
      const dataUrl = await processLogoFile(file)
      update({ logo: dataUrl })
      onToast('Logo aplicado')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No se pudo cargar el logo.')
    } finally {
      setBusy(false)
    }
  }

  const handleDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setDragging(false)
    void handleFile(event.dataTransfer.files[0])
  }

  const formatOffset = (value: number) =>
    `${value > 0 ? '+' : ''}${Math.round(value * 100)}%`

  return (
    <div className="section">
      <div className="section-heading">
        <h2 className="section-title">Logo de la empresa</h2>
        <p className="section-sub">
          Súbelo y se proyectará sobre la curvatura real de la envoltura.
        </p>
      </div>

      <input
        ref={inputRef}
        className="sr-only"
        type="file"
        accept="image/png,image/svg+xml,image/jpeg,image/webp"
        onChange={(event) => {
          const file = event.target.files?.[0]
          event.target.value = ''
          void handleFile(file)
        }}
      />

      {logo ? (
        <div className="logo-preview">
          <div className="logo-thumb">
            <img src={logo} alt="Logo cargado" />
          </div>
          <div className="logo-info">
            <strong>{busy ? 'Procesando…' : 'Logo cargado'}</strong>
            <span>Se adapta a los pliegues del dulce.</span>
          </div>
          <div className="logo-actions">
            <button
              type="button"
              className="mini-btn"
              onClick={() => inputRef.current?.click()}
            >
              Cambiar
            </button>
            <button
              type="button"
              className="icon-btn"
              onClick={() => update({ logo: null })}
              aria-label="Quitar logo"
              title="Quitar logo"
            >
              <TrashIcon />
            </button>
          </div>
        </div>
      ) : (
        <>
          <button
            type="button"
            className={`dropzone${dragging ? ' dragging' : ''}`}
            onClick={() => inputRef.current?.click()}
            onDragOver={(event) => {
              event.preventDefault()
              setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
          >
            <span className="dropzone-icon">
              <UploadIcon />
            </span>
            <strong>{busy ? 'Procesando…' : 'Arrastra tu logo aquí'}</strong>
            <span>
              o <u>selecciona un archivo</u>
            </span>
            <small>PNG, SVG, JPG o WebP · máx. 8 MB</small>
          </button>
          <button
            type="button"
            className="link-btn"
            onClick={() => update({ logo: DEFAULT_LOGO })}
          >
            Usar logo de ejemplo
          </button>
        </>
      )}

      {error && <p className="error-text">{error}</p>}

      {logo && (
        <div className="sub-section">
          <Slider
            label="Tamaño"
            value={logoScale}
            min={0.35}
            max={1.9}
            step={0.01}
            onChange={(value) => update({ logoScale: value })}
            format={(value) => `${Math.round(value * 100)}%`}
          />
          <Slider
            label="Posición horizontal"
            value={logoX}
            min={-1}
            max={1}
            step={0.01}
            onChange={(value) => update({ logoX: value })}
            format={formatOffset}
          />
          <Slider
            label="Posición vertical"
            value={logoY}
            min={-1}
            max={1}
            step={0.01}
            onChange={(value) => update({ logoY: value })}
            format={formatOffset}
          />
          <Slider
            label="Rotación"
            value={logoRotation}
            min={-180}
            max={180}
            step={1}
            onChange={(value) => update({ logoRotation: value })}
            format={(value) => `${Math.round(value)}°`}
          />

          <label className="switch-row">
            <span className="switch-copy">
              <strong>Repetir en la parte trasera</strong>
              <small>Añade el logo también al reverso de la envoltura.</small>
            </span>
            <span className="switch">
              <input
                type="checkbox"
                checked={logoBothSides}
                onChange={(event) => update({ logoBothSides: event.target.checked })}
              />
              <span className="switch-track" aria-hidden="true" />
            </span>
          </label>
        </div>
      )}

      <p className="tip">
        <InfoIcon />
        Usa un PNG con fondo transparente para integrar el logo con el color del papel.
      </p>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { normalizeHex } from '../../lib/color'

interface ColorFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
}

export function ColorField({ label, value, onChange }: ColorFieldProps) {
  const [draft, setDraft] = useState(value.toUpperCase())

  useEffect(() => {
    setDraft(value.toUpperCase())
  }, [value])

  const commit = () => {
    const parsed = normalizeHex(draft)
    if (parsed) {
      onChange(parsed)
      setDraft(parsed.toUpperCase())
    } else {
      setDraft(value.toUpperCase())
    }
  }

  return (
    <div className="color-hero">
      <label className="color-dot-label" aria-label={`Elegir ${label.toLowerCase()}`}>
        <span className="color-dot" style={{ background: value }} />
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-label={`Selector de ${label.toLowerCase()}`}
        />
      </label>
      <div className="color-meta">
        <span className="color-label">{label}</span>
        <input
          className="hex-input"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              commit()
              event.currentTarget.blur()
            }
          }}
          spellCheck={false}
          aria-label={`Código hexadecimal de ${label.toLowerCase()}`}
        />
      </div>
    </div>
  )
}

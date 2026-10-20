import type { CSSProperties } from 'react'

interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  format?: (value: number) => string
  disabled?: boolean
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  format,
  disabled = false,
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div className={`field${disabled ? ' is-disabled' : ''}`}>
      <div className="field-head">
        <label htmlFor={`slider-${label.replace(/\s/g, '-')}`}>{label}</label>
        <span>{format ? format(value) : value}</span>
      </div>
      <input
        id={`slider-${label.replace(/\s/g, '-')}`}
        className="range"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
        style={{ '--p': `${percentage}%` } as CSSProperties}
      />
    </div>
  )
}

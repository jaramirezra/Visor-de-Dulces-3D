import { useState } from 'react'
import { ColorPanel } from './panels/ColorPanel'
import { FinishPanel } from './panels/FinishPanel'
import { LogoPanel } from './panels/LogoPanel'
import { PatternPanel } from './panels/PatternPanel'
import { ImageIcon, PaletteIcon, PatternIcon, SparkleIcon } from './Icons'

const TABS = [
  { key: 'color', label: 'Color', icon: PaletteIcon },
  { key: 'pattern', label: 'Patrón', icon: PatternIcon },
  { key: 'logo', label: 'Logo', icon: ImageIcon },
  { key: 'finish', label: 'Acabado', icon: SparkleIcon },
] as const

type TabKey = (typeof TABS)[number]['key']

interface EditorPanelProps {
  onToast: (message: string) => void
}

export function EditorPanel({ onToast }: EditorPanelProps) {
  const [tab, setTab] = useState<TabKey>('color')

  return (
    <aside className="panel">
      <div className="panel-tabs" role="tablist" aria-label="Herramientas de diseño">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            className={`tab${tab === key ? ' active' : ''}`}
            onClick={() => setTab(key)}
          >
            <Icon className="tab-icon" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="panel-body" role="tabpanel">
        {tab === 'color' && <ColorPanel />}
        {tab === 'pattern' && <PatternPanel />}
        {tab === 'logo' && <LogoPanel onToast={onToast} />}
        {tab === 'finish' && <FinishPanel />}
      </div>

      <div className="panel-footer">
        <span className="save-dot" aria-hidden="true" />
        Guardado automático en este navegador
      </div>
    </aside>
  )
}

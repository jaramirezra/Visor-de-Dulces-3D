import { useState } from 'react'
import {
  CandyCanvas,
  type ViewerApiRef,
  type ViewName,
  type ViewRequest,
} from '../three/CandyScene'
import { useEditor } from '../store/editor'
import { FrontIcon, OrbitIcon, PauseIcon, PlayIcon, QuarterIcon, TopIcon } from './Icons'

interface ViewerProps {
  apiRef: ViewerApiRef
}

export function Viewer({ apiRef }: ViewerProps) {
  const [viewRequest, setViewRequest] = useState<ViewRequest | null>(null)
  const [activeView, setActiveView] = useState<ViewName>('threeQuarter')
  const autoRotate = useEditor((state) => state.autoRotate)
  const update = useEditor((state) => state.update)

  const requestView = (name: ViewName) => {
    setViewRequest({ name, id: Date.now() })
    setActiveView(name)
    if (autoRotate) update({ autoRotate: false })
  }

  return (
    <section className="stage" aria-label="Visor 3D del dulce">
      <div className="stage-canvas">
        <CandyCanvas apiRef={apiRef} viewRequest={viewRequest} />
      </div>

      <div className="stage-top">
        <span className="stage-badge">
          <OrbitIcon />
          Vista 360°
        </span>
        <span className="stage-hint">Arrastra para girar · rueda para acercar</span>
      </div>

      <div className="stage-tools" role="toolbar" aria-label="Vistas de cámara">
        <button
          type="button"
          className={`tool-btn${activeView === 'front' ? ' active' : ''}`}
          onClick={() => requestView('front')}
          title="Vista frontal"
          aria-label="Vista frontal"
        >
          <FrontIcon />
        </button>
        <button
          type="button"
          className={`tool-btn${activeView === 'threeQuarter' ? ' active' : ''}`}
          onClick={() => requestView('threeQuarter')}
          title="Vista 3/4"
          aria-label="Vista tres cuartos"
        >
          <QuarterIcon />
        </button>
        <button
          type="button"
          className={`tool-btn${activeView === 'top' ? ' active' : ''}`}
          onClick={() => requestView('top')}
          title="Vista superior"
          aria-label="Vista superior"
        >
          <TopIcon />
        </button>

        <span className="tool-divider" aria-hidden="true" />

        <button
          type="button"
          className={`tool-btn${autoRotate ? ' active' : ''}`}
          onClick={() => update({ autoRotate: !autoRotate })}
          title={autoRotate ? 'Pausar giro' : 'Girar automáticamente'}
          aria-label={autoRotate ? 'Pausar giro automático' : 'Girar automáticamente'}
          aria-pressed={autoRotate}
        >
          {autoRotate ? <PauseIcon /> : <PlayIcon />}
        </button>
      </div>
    </section>
  )
}

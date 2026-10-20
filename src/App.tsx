import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { EditorPanel } from './components/EditorPanel'
import { ExportDialog } from './components/ExportDialog'
import { CandyMark, CheckIcon, DownloadIcon, ResetIcon } from './components/Icons'
import { ShapeRail } from './components/ShapeRail'
import { BACKGROUNDS, useEditor } from './store/editor'
import type { ViewerApi } from './three/CandyScene'

const Viewer = lazy(() =>
  import('./components/Viewer').then((module) => ({ default: module.Viewer })),
)

interface ToastState {
  id: number
  message: string
}

export default function App() {
  const shape = useEditor((state) => state.shape)
  const background = useEditor((state) => state.background)
  const exportSize = useEditor((state) => state.exportSize)
  const autoRotate = useEditor((state) => state.autoRotate)
  const update = useEditor((state) => state.update)
  const reset = useEditor((state) => state.reset)

  const viewerRef = useRef<ViewerApi | null>(null)
  const toastTimer = useRef<number | null>(null)
  const [toast, setToast] = useState<ToastState | null>(null)
  const [exportOpen, setExportOpen] = useState(false)
  const [exporting, setExporting] = useState(false)

  const showToast = useCallback((message: string) => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current)
    setToast({ id: Date.now(), message })
    toastTimer.current = window.setTimeout(() => setToast(null), 3200)
  }, [])

  useEffect(
    () => () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current)
    },
    [],
  )

  const handleReset = () => {
    reset()
    setExportOpen(false)
    showToast('Diseño restablecido')
  }

  const openExport = () => {
    if (autoRotate) update({ autoRotate: false })
    setExportOpen(true)
  }

  const handleExport = async () => {
    if (!viewerRef.current) {
      showToast('El visor todavía no está listo')
      return
    }

    setExporting(true)
    await new Promise((resolve) => window.setTimeout(resolve, 80))

    try {
      const { exportViewerPng } = await import('./three/exportPng')
      const dataUrl = await exportViewerPng(
        viewerRef.current,
        exportSize,
        BACKGROUNDS[background].color,
      )

      const link = document.createElement('a')
      link.href = dataUrl
      link.download = `dulce-${shape}-${exportSize}px.png`
      document.body.appendChild(link)
      link.click()
      link.remove()

      setExportOpen(false)
      showToast(`PNG de ${exportSize} × ${exportSize} px descargado`)
    } catch (error) {
      console.error(error)
      showToast('No se pudo generar el PNG. Inténtalo de nuevo.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">
            <CandyMark />
          </div>
          <div className="brand-copy">
            <h1>Dulce Studio</h1>
            <p>Maquetador 3D de envolturas</p>
          </div>
        </div>

        <div className="top-actions">
          <button type="button" className="btn btn-ghost" onClick={handleReset}>
            <ResetIcon />
            <span>Restablecer</span>
          </button>
          <button type="button" className="btn btn-primary" onClick={openExport}>
            <DownloadIcon />
            <span>Descargar PNG</span>
          </button>
        </div>
      </header>

      <main className="workspace">
        <ShapeRail />
        <Suspense
          fallback={
            <div className="stage stage-loading">
              <span className="stage-loading-dot" />
              Cargando visor 3D…
            </div>
          }
        >
          <Viewer apiRef={viewerRef} />
        </Suspense>
        <EditorPanel onToast={showToast} />
      </main>

      <ExportDialog
        open={exportOpen}
        exporting={exporting}
        onClose={() => {
          if (!exporting) setExportOpen(false)
        }}
        onExport={() => void handleExport()}
      />

      {toast && (
        <div key={toast.id} className="toast" role="status">
          <CheckIcon />
          {toast.message}
        </div>
      )}
    </div>
  )
}

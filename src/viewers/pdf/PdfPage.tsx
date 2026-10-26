import { useEffect, useRef } from 'react'
import type { Size } from '@/player/useFitBox'
import type { PDFDocumentProxy, RenderTask } from './pdfjs'

interface PdfPageProps {
  doc: PDFDocumentProxy
  /** 1-based, like pdf.js. */
  pageNumber: number
  size: Size
}

/** Renders one PDF page into a canvas at device resolution. */
export function PdfPage({ doc, pageNumber, size }: PdfPageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || size.width === 0) return

    let cancelled = false
    let task: RenderTask | undefined

    void doc.getPage(pageNumber).then((page) => {
      if (cancelled) return
      const base = page.getViewport({ scale: 1 })
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
      const viewport = page.getViewport({ scale: (size.width / base.width) * pixelRatio })

      canvas.width = Math.floor(viewport.width)
      canvas.height = Math.floor(viewport.height)
      task = page.render({ canvas, viewport })
      task.promise.catch(() => {
        /* cancelled by a resize or unmount — expected */
      })
    })

    return () => {
      cancelled = true
      task?.cancel()
    }
  }, [doc, pageNumber, size.width])

  return (
    <canvas
      ref={canvasRef}
      className="block bg-white"
      style={{ width: size.width, height: size.height }}
    />
  )
}

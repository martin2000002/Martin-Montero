import { useEffect, useState } from 'react'
import { loadPdf, type PDFDocumentProxy } from './pdfjs'

type PdfState =
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'ready'; doc: PDFDocumentProxy; aspect: number }

export function usePdf(url: string): PdfState {
  // Results are tagged with their url, so switching files reads as "loading"
  // until the new document arrives — no reset inside the effect needed.
  const [result, setResult] = useState<{ url: string; state: PdfState } | null>(null)

  useEffect(() => {
    let cancelled = false

    loadPdf(url)
      .then(async (doc) => {
        const first = await doc.getPage(1)
        const { width, height } = first.getViewport({ scale: 1 })
        if (!cancelled) setResult({ url, state: { status: 'ready', doc, aspect: width / height } })
      })
      .catch((error: Error) => {
        if (!cancelled) setResult({ url, state: { status: 'error', error } })
      })

    return () => {
      cancelled = true
    }
  }, [url])

  return result?.url === url ? result.state : { status: 'loading' }
}

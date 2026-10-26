// The legacy build ships polyfills: the modern one needs brand-new browser APIs
// (e.g. Uint8Array#toHex) and fails on many of the screens people present on.
import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy } from 'pdfjs-dist/legacy/build/pdf.mjs'
import workerUrl from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs?url'

GlobalWorkerOptions.workerSrc = workerUrl

const documents = new Map<string, Promise<PDFDocumentProxy>>()

/** Loads (once) and caches a PDF, so thumbnails and the player share one parse. */
export function loadPdf(url: string) {
  let pending = documents.get(url)
  if (!pending) {
    pending = getDocument({ url }).promise
    pending.catch(() => documents.delete(url))
    documents.set(url, pending)
  }
  return pending
}

export type { PDFDocumentProxy, RenderTask } from 'pdfjs-dist/legacy/build/pdf.mjs'

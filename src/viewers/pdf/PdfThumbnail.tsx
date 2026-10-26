import type { Size } from '@/player/useFitBox'
import { PdfPage } from './PdfPage'
import { usePdf } from './usePdf'

/** First page of a PDF, for the home page card. */
export default function PdfThumbnail({ url, size }: { url: string; size: Size }) {
  const pdf = usePdf(url)
  if (pdf.status !== 'ready') return null

  // Fit the page inside the card's 16:9 box, whatever its own ratio is.
  const width = Math.min(size.width, size.height * pdf.aspect)
  const pageSize = { width, height: width / pdf.aspect }

  return (
    <div className="grid h-full w-full place-items-center">
      <PdfPage doc={pdf.doc} pageNumber={1} size={pageSize} />
    </div>
  )
}

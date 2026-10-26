import { useCallback } from 'react'
import type { ContentFile } from '@/content/types'
import { Player } from '@/player/Player'
import type { Size } from '@/player/useFitBox'
import { StatusScreen } from '@/ui/StatusScreen'
import { PdfPage } from './PdfPage'
import { usePdf } from './usePdf'

/** A PDF presented page-by-page in the player — the go-to for exported decks. */
export default function PdfPresentation({ file }: { file: ContentFile }) {
  const pdf = usePdf(file.url)
  const doc = pdf.status === 'ready' ? pdf.doc : null

  const renderSlide = useCallback(
    (index: number, size: Size) => doc && <PdfPage doc={doc} pageNumber={index + 1} size={size} />,
    [doc],
  )

  if (pdf.status === 'loading') return <StatusScreen title="Cargando PDF…" />
  if (pdf.status === 'error')
    return <StatusScreen title="No se pudo abrir el PDF" detail={pdf.error.message} />

  return (
    <Player
      title={file.name}
      count={pdf.doc.numPages}
      aspect={pdf.aspect}
      renderSlide={renderSlide}
      download={{ url: file.url, name: file.name }}
    />
  )
}

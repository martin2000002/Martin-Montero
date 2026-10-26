import { Link } from 'react-router'
import type { ContentFile } from '@/content/types'
import { CopyLinkButton } from '@/ui/CopyLinkButton'
import { DownloadLink } from '@/ui/DownloadLink'
import { StatusScreen } from '@/ui/StatusScreen'
import { Back, Download } from '@/ui/icons'
import { useDocumentTitle } from '@/ui/useDocumentTitle'

const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname)

/**
 * PowerPoint/Word/Excel via Microsoft's free web viewer. It fetches the file
 * from our public URL, so it only works once the site is deployed.
 * For pixel-perfect results, export the deck to PDF instead.
 */
export function OfficeViewer({ file }: { file: ContentFile }) {
  useDocumentTitle(file.name)

  if (isLocal) {
    return (
      <StatusScreen
        title={file.name}
        detail="La vista previa de Office funciona cuando el sitio está publicado (Microsoft necesita poder descargar el archivo). Tip: exporta a PDF para una presentación perfecta."
      >
        <DownloadLink file={file} />
      </StatusScreen>
    )
  }

  const absoluteUrl = new URL(file.url, window.location.origin).href
  const viewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(absoluteUrl)}`

  return (
    <div className="fixed inset-0 flex flex-col bg-black">
      <header className="flex items-center gap-3 px-4 py-3 text-white sm:px-6">
        <Link to="/" className="hud-button" aria-label="Volver al inicio">
          <Back />
        </Link>
        <h1 className="flex-1 truncate text-sm font-medium text-white/90">{file.name}</h1>
        <CopyLinkButton className="hud-button" />
        <a className="hud-button" href={file.url} download={file.name} aria-label="Descargar">
          <Download />
        </a>
      </header>
      <iframe title={file.name} src={viewerUrl} className="w-full flex-1 border-0" allowFullScreen />
    </div>
  )
}

import type { ContentFile } from '@/content/types'
import { Download } from './icons'

export const DownloadLink = ({ file }: { file: ContentFile }) => (
  <a
    href={file.url}
    download={file.name}
    className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-canvas transition hover:opacity-90"
  >
    <Download width={16} height={16} /> Descargar
  </a>
)

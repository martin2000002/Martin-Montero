/**
 * Picks the right viewer for a file. To support a new kind of file, add a
 * `FileKind` in content/types.ts, map its extensions in the registry and add
 * a case here.
 */
import { lazy } from 'react'
import type { ContentFile } from '@/content/types'
import { Player } from '@/player/Player'
import { DownloadLink } from '@/ui/DownloadLink'
import { StatusScreen } from '@/ui/StatusScreen'
import { OfficeViewer } from './OfficeViewer'

const PdfPresentation = lazy(() => import('./pdf/PdfPresentation'))

export function FileViewer({ file }: { file: ContentFile }) {
  switch (file.kind) {
    case 'pdf':
      return <PdfPresentation file={file} />

    case 'image':
      return (
        <Player
          title={file.name}
          count={1}
          renderSlide={(_, size) => (
            <img src={file.url} alt={file.name} className="object-contain" style={size} />
          )}
          download={{ url: file.url, name: file.name }}
        />
      )

    case 'video':
      return (
        <Player
          title={file.name}
          count={1}
          renderSlide={(_, size) => (
            <video src={file.url} controls autoPlay playsInline className="bg-black" style={size} />
          )}
          download={{ url: file.url, name: file.name }}
        />
      )

    case 'office':
      return <OfficeViewer file={file} />

    default:
      return (
        <StatusScreen
          title={file.name}
          detail={file.kind === 'audio' ? undefined : 'Este tipo de archivo no tiene vista previa.'}
        >
          {file.kind === 'audio' && <audio src={file.url} controls autoPlay className="w-full" />}
          <DownloadLink file={file} />
        </StatusScreen>
      )
  }
}

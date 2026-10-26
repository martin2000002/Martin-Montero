import { useParams } from 'react-router'
import { findFile } from '@/content/registry'
import { FileViewer } from '@/viewers/FileViewer'
import { NotFoundPage } from './NotFoundPage'

export function FilePage() {
  // react-router already decodes the splat (`/f/charlas/mi%20charla.pdf`).
  const { '*': path = '' } = useParams()
  const file = findFile(path)

  if (!file) return <NotFoundPage />
  return <FileViewer file={file} />
}

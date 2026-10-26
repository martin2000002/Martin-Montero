import { StatusScreen } from '@/ui/StatusScreen'
import { useDocumentTitle } from '@/ui/useDocumentTitle'

export function NotFoundPage() {
  useDocumentTitle('No encontrado')
  return <StatusScreen title="No encontrado" detail="Este link no existe o la presentación fue movida." />
}

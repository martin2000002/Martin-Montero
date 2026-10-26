import { useEffect } from 'react'

const SITE = 'Martin Montero'

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${SITE}` : SITE
  }, [title])
}

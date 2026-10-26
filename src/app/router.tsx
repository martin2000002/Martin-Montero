import { Suspense, type ReactNode } from 'react'
import { createBrowserRouter } from 'react-router'
import { DeckPage } from '@/pages/DeckPage'
import { FilePage } from '@/pages/FilePage'
import { HomePage } from '@/pages/HomePage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { StatusScreen } from '@/ui/StatusScreen'

const withSuspense = (element: ReactNode) => (
  <Suspense fallback={<StatusScreen title="Cargando…" />}>{element}</Suspense>
)

/** Route shapes must stay in sync with `paths.ts`. */
export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/d/:slug', element: <DeckPage /> },
  { path: '/f/*', element: withSuspense(<FilePage />) },
  { path: '*', element: <NotFoundPage /> },
])

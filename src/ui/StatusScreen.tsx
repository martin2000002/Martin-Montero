import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { Back } from './icons'

interface StatusScreenProps {
  title: string
  detail?: ReactNode
  children?: ReactNode
}

/** Full-screen message: loading, errors, "not found", unsupported file… */
export function StatusScreen({ title, detail, children }: StatusScreenProps) {
  return (
    <main className="grid min-h-dvh place-items-center bg-canvas px-4 text-ink">
      <div className="flex max-w-md flex-col items-center gap-4 text-center">
        <h1 className="font-serif text-4xl">{title}</h1>
        {detail && <p className="text-sm text-muted">{detail}</p>}
        {children}
        <Link to="/" className="mt-2 inline-flex items-center gap-2 text-sm text-muted transition hover:text-ink">
          <Back width={16} height={16} /> Volver al inicio
        </Link>
      </div>
    </main>
  )
}

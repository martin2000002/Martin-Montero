import { lazy, Suspense, type ReactNode } from 'react'
import { Link } from 'react-router'
import { decks, files } from '@/content/registry'
import type { ContentFile, Deck } from '@/content/types'
import { ScaledSlide } from '@/deck/ScaledSlide'
import { SlidePreview } from '@/player/SlidePreview'
import { deckPath, filePath } from '@/app/paths'
import { CopyLinkButton } from '@/ui/CopyLinkButton'
import { FileBadge, Play } from '@/ui/icons'
import { useDocumentTitle } from '@/ui/useDocumentTitle'

const PdfThumbnail = lazy(() => import('@/viewers/pdf/PdfThumbnail'))

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })

export function HomePage() {
  useDocumentTitle()

  return (
    <main className="mx-auto min-h-dvh max-w-6xl px-4 pt-16 pb-24 sm:px-8 sm:pt-24">
      <header className="mb-16 flex flex-col gap-4 sm:mb-24">
        <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase">Presentaciones &amp; archivos</p>
        <h1 className="font-serif text-6xl leading-none tracking-tight sm:text-8xl">Martin Montero</h1>
        <p className="max-w-xl text-base text-muted sm:text-lg">
          Abre cualquiera y preséntala en pantalla completa desde aquí. Usa ← → para avanzar,
          <kbd className="kbd">F</kbd> para pantalla completa y <kbd className="kbd">O</kbd> para ver todas las diapositivas.
        </p>
      </header>

      <Section title="Presentaciones" count={decks.length}>
        {decks.length === 0 ? (
          <Empty>
            Crea una con <code className="font-mono text-ink">npm run new -- "Mi charla"</code>
          </Empty>
        ) : (
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {decks.map((deck) => (
              <DeckCard key={deck.slug} deck={deck} />
            ))}
          </div>
        )}
      </Section>

      <Section title="Archivos" count={files.length}>
        {files.length === 0 ? (
          <Empty>
            Arrastra PDFs, PowerPoints, imágenes o videos a <code className="font-mono text-ink">content/files/</code>
          </Empty>
        ) : (
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {files.map((file) => (
              <FileCard key={file.path} file={file} />
            ))}
          </div>
        )}
      </Section>
    </main>
  )
}

function Section({ title, count, children }: { title: string; count: number; children: ReactNode }) {
  return (
    <section className="mb-20">
      <div className="mb-6 flex items-baseline gap-3 border-b border-line pb-3">
        <h2 className="text-sm font-semibold tracking-wide">{title}</h2>
        <span className="font-mono text-xs text-muted tabular-nums">{count}</span>
      </div>
      {children}
    </section>
  )
}

const Empty = ({ children }: { children: ReactNode }) => (
  <p className="rounded-2xl border border-dashed border-line px-6 py-10 text-center text-sm text-muted">{children}</p>
)

interface CardProps {
  to: string
  preview: ReactNode
  title: string
  meta: ReactNode
  description?: string
}

function Card({ to, preview, title, meta, description }: CardProps) {
  return (
    <Link to={to} className="group relative flex flex-col gap-4 outline-none">
      <div className="relative overflow-hidden rounded-2xl bg-surface ring-1 ring-line transition duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:shadow-black/30 group-focus-visible:ring-2 group-focus-visible:ring-accent">
        {preview}
        <div className="pointer-events-none absolute inset-0 grid place-items-center bg-black/0 transition group-hover:bg-black/25">
          <span className="grid size-12 scale-90 place-items-center rounded-full bg-white/90 text-black opacity-0 shadow-lg transition group-hover:scale-100 group-hover:opacity-100">
            <Play />
          </span>
        </div>
        <CopyLinkButton
          path={to}
          className="absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur transition group-hover:opacity-100 hover:bg-black/80 focus-visible:opacity-100"
        />
      </div>
      <div className="flex flex-col gap-1 px-1">
        <h3 className="font-medium text-ink">{title}</h3>
        {description && <p className="line-clamp-2 text-sm text-muted">{description}</p>}
        <div className="mt-1 flex items-center gap-2 text-xs text-muted">{meta}</div>
      </div>
    </Link>
  )
}

function DeckCard({ deck }: { deck: Deck }) {
  return (
    <Card
      to={deckPath(deck.slug)}
      title={deck.title}
      description={deck.description}
      preview={
        <SlidePreview
          aspect={16 / 9}
          className="w-full"
          render={(size) => <ScaledSlide slide={deck.slides[0]} theme={deck.theme} size={size} />}
        />
      }
      meta={
        <>
          <span className="tabular-nums">{deck.slides.length} diapositivas</span>
          {deck.date && (
            <>
              <span aria-hidden>·</span>
              <time dateTime={deck.date}>{formatDate(deck.date)}</time>
            </>
          )}
        </>
      }
    />
  )
}

function FileCard({ file }: { file: ContentFile }) {
  const folder = file.path.includes('/') ? file.path.slice(0, file.path.lastIndexOf('/')) : null

  return (
    <Card
      to={filePath(file.path)}
      title={file.name}
      preview={
        <SlidePreview aspect={16 / 9} className="w-full" render={(size) => <FilePreview file={file} size={size} />} />
      }
      meta={
        <>
          <FileBadge kind={file.kind} ext={file.ext} />
          {folder && <span className="truncate">{folder}</span>}
        </>
      }
    />
  )
}

function FilePreview({ file, size }: { file: ContentFile; size: { width: number; height: number } }) {
  switch (file.kind) {
    case 'image':
      return <img src={file.url} alt="" loading="lazy" className="h-full w-full object-cover" />
    case 'video':
      return <video src={`${file.url}#t=0.5`} muted preload="metadata" className="h-full w-full object-cover" />
    case 'pdf':
      return (
        <Suspense>
          <PdfThumbnail url={file.url} size={size} />
        </Suspense>
      )
    default:
      return (
        <div className="grid h-full w-full place-items-center">
          <span className="font-serif text-5xl text-muted uppercase">{file.ext || 'file'}</span>
        </div>
      )
  }
}

import { lazy, Suspense, type ReactNode } from 'react'
import { Link } from 'react-router'
import { decks, files, htmlPresentations } from '@/content/registry'
import type { ContentFile, Deck, HtmlPresentation } from '@/content/types'
import { SLIDE_HEIGHT, SLIDE_WIDTH } from '@/deck/kit'
import { ScaledSlide } from '@/deck/ScaledSlide'
import { SlidePreview } from '@/player/SlidePreview'
import { deckPath, filePath, htmlPresentationPath } from '@/app/paths'
import { CopyLinkButton } from '@/ui/CopyLinkButton'
import { FileBadge, Play } from '@/ui/icons'
import { useDocumentTitle } from '@/ui/useDocumentTitle'

const PdfThumbnail = lazy(() => import('@/viewers/pdf/PdfThumbnail'))

type Presentation = { kind: 'deck'; item: Deck } | { kind: 'html'; item: HtmlPresentation }

/** Decks and HTML presentations share one list, newest first. */
const presentations: Presentation[] = [
  ...decks.map((item) => ({ kind: 'deck' as const, item })),
  ...htmlPresentations.map((item) => ({ kind: 'html' as const, item })),
].sort(
  (a, b) => (b.item.date ?? '').localeCompare(a.item.date ?? '') || a.item.title.localeCompare(b.item.title),
)

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

      <Section title="Presentaciones" count={presentations.length}>
        {presentations.length === 0 ? (
          <Empty>
            Crea una con <code className="font-mono text-ink">npm run new -- "Mi charla"</code>
          </Empty>
        ) : (
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {presentations.map((p) =>
              p.kind === 'deck' ? (
                <DeckCard key={`d-${p.item.slug}`} deck={p.item} />
              ) : (
                <HtmlPresentationCard key={`p-${p.item.slug}`} presentation={p.item} />
              ),
            )}
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
  /** Full page load, for pages served outside the app (HTML presentations). */
  reloadDocument?: boolean
  preview: ReactNode
  title: string
  meta: ReactNode
  description?: string
}

function Card({ to, reloadDocument, preview, title, meta, description }: CardProps) {
  return (
    <Link to={to} reloadDocument={reloadDocument} className="group relative flex flex-col gap-4 outline-none">
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

const DateMeta = ({ count, date }: { count?: number; date?: string }) => (
  <>
    {count !== undefined && <span className="tabular-nums">{count} diapositivas</span>}
    {count !== undefined && date && <span aria-hidden>·</span>}
    {date && <time dateTime={date}>{formatDate(date)}</time>}
  </>
)

function HtmlPresentationCard({ presentation }: { presentation: HtmlPresentation }) {
  const to = htmlPresentationPath(presentation.slug)
  return (
    <Card
      to={to}
      reloadDocument
      title={presentation.title}
      description={presentation.description}
      preview={
        <SlidePreview
          aspect={16 / 9}
          className="w-full"
          render={(size) => (
            // The real page, rendered at 1920×1080 and scaled down: always matches its cover.
            <div className="overflow-hidden" style={size}>
              <iframe
                src={`${to}#1`}
                title={presentation.title}
                tabIndex={-1}
                aria-hidden
                loading="lazy"
                className="pointer-events-none origin-top-left border-0"
                style={{ width: SLIDE_WIDTH, height: SLIDE_HEIGHT, transform: `scale(${size.width / SLIDE_WIDTH})` }}
              />
            </div>
          )}
        />
      }
      meta={<DateMeta count={presentation.slideCount} date={presentation.date} />}
    />
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
      meta={<DateMeta count={deck.slides.length} date={deck.date} />}
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

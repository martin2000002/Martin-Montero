/**
 * Single source of truth for everything the site shows.
 *
 * Content is discovered at build time from the `content/` folder — there is no
 * database and no upload API. Add a folder or drop a file, rebuild, deploy.
 */
import { parseMarkdownDeck } from './markdown'
import htmlPresentationMeta from 'virtual:html-presentations'
import type { ContentFile, Deck, DeckDefinition, FileKind, HtmlPresentation } from './types'

const tsxDecks = import.meta.glob<DeckDefinition>('/content/decks/*/deck.tsx', {
  eager: true,
  import: 'default',
})

const mdDecks = import.meta.glob<string>('/content/decks/*/deck.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

/** Images/media living next to a deck, so Markdown can reference `./foto.png`. */
const deckAssets = import.meta.glob<string>(
  '/content/decks/*/**/*.{png,jpg,jpeg,gif,webp,avif,svg,mp4,webm}',
  { eager: true, query: '?url', import: 'default' },
)

const rawFiles = import.meta.glob<string>('/content/files/**/*', {
  eager: true,
  query: '?url',
  import: 'default',
})

const slugOf = (path: string) => path.split('/').at(-2)!

function assetResolverFor(slug: string) {
  const base = `/content/decks/${slug}/`
  return (relative: string) => deckAssets[base + relative.replace(/^\.\//, '')]
}

function buildDecks(): Deck[] {
  const decks: Deck[] = []

  for (const [path, definition] of Object.entries(tsxDecks)) {
    decks.push({ ...definition, slug: slugOf(path), source: 'tsx' })
  }

  for (const [path, raw] of Object.entries(mdDecks)) {
    const slug = slugOf(path)
    decks.push({ ...parseMarkdownDeck(raw, assetResolverFor(slug)), slug, source: 'md' })
  }

  return decks.sort(
    (a, b) => (b.date ?? '').localeCompare(a.date ?? '') || a.title.localeCompare(b.title),
  )
}

const KIND_BY_EXT: Record<string, FileKind> = {
  pdf: 'pdf',
  png: 'image', jpg: 'image', jpeg: 'image', gif: 'image', webp: 'image', avif: 'image', svg: 'image',
  mp4: 'video', webm: 'video', mov: 'video',
  mp3: 'audio', wav: 'audio', ogg: 'audio', m4a: 'audio',
  ppt: 'office', pptx: 'office', doc: 'office', docx: 'office', xls: 'office', xlsx: 'office',
}

function buildFiles(): ContentFile[] {
  return Object.entries(rawFiles)
    .map(([fullPath, url]) => {
      const path = fullPath.replace('/content/files/', '')
      const name = path.split('/').at(-1)!
      const ext = name.includes('.') ? name.split('.').at(-1)!.toLowerCase() : ''
      return { path, name, ext, kind: KIND_BY_EXT[ext] ?? 'other', url }
    })
    .sort((a, b) => a.path.localeCompare(b.path))
}

export const decks = buildDecks()
export const files = buildFiles()

/** Discovered by build/html-presentations.ts (Vite plugin), not by a glob. */
export const htmlPresentations: HtmlPresentation[] = [...htmlPresentationMeta].sort(
  (a, b) => (b.date ?? '').localeCompare(a.date ?? '') || a.title.localeCompare(b.title),
)

export const findDeck = (slug: string) => decks.find((d) => d.slug === slug)
export const findFile = (path: string) => files.find((f) => f.path === path)

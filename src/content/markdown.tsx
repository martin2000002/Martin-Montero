/**
 * Markdown decks: `content/decks/<slug>/deck.md`
 *
 *   ---
 *   title: Mi charla
 *   date: 2026-10-26
 *   theme: paper
 *   ---
 *
 *   # Primera diapositiva
 *
 *   ---
 *   <!-- layout: center -->
 *   ## Segunda
 *
 * Slides are separated by a line containing only `---` (ignored inside code
 * fences). An optional `<!-- layout: ... -->` comment picks the slide layout.
 */
import { marked } from 'marked'
import { Slide, type SlideLayout } from '@/deck/kit'
import type { DeckDefinition, ThemeName } from './types'

type ResolveAsset = (relativePath: string) => string | undefined

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/
const LAYOUT_DIRECTIVE = /^\s*<!--\s*layout:\s*([\w-]+)\s*-->\s*\n?/

function parseFrontmatter(raw: string) {
  const match = raw.match(FRONTMATTER)
  if (!match) return { data: {} as Record<string, string>, body: raw }

  const data: Record<string, string> = {}
  for (const line of match[1].split(/\r?\n/)) {
    const separator = line.indexOf(':')
    if (separator === -1) continue
    const key = line.slice(0, separator).trim()
    const value = line.slice(separator + 1).trim().replace(/^["']|["']$/g, '')
    if (key) data[key] = value
  }
  return { data, body: raw.slice(match[0].length) }
}

function splitSlides(body: string): string[] {
  const slides: string[] = []
  let current: string[] = []
  let inFence = false

  for (const line of body.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence
    if (!inFence && line.trim() === '---') {
      slides.push(current.join('\n'))
      current = []
    } else {
      current.push(line)
    }
  }
  slides.push(current.join('\n'))
  return slides.filter((s) => s.trim() !== '')
}

/** Rewrites `./foto.png` style references to the hashed URL Vite emitted. */
function resolveRelativeUrls(html: string, resolve: ResolveAsset) {
  return html.replace(/(src|href)="(\.\/[^"]+)"/g, (whole, attr: string, path: string) => {
    const url = resolve(decodeURI(path))
    return url ? `${attr}="${url}"` : whole
  })
}

export function parseMarkdownDeck(raw: string, resolveAsset: ResolveAsset): DeckDefinition {
  const { data, body } = parseFrontmatter(raw)

  const slides = splitSlides(body).map((source, index) => {
    const layout = (source.match(LAYOUT_DIRECTIVE)?.[1] ?? 'default') as SlideLayout
    const html = resolveRelativeUrls(
      marked.parse(source.replace(LAYOUT_DIRECTIVE, ''), { async: false }),
      resolveAsset,
    )
    return (
      <Slide key={index} layout={layout}>
        <div className="md" dangerouslySetInnerHTML={{ __html: html }} />
      </Slide>
    )
  })

  return {
    title: data.title ?? 'Sin título',
    description: data.description,
    date: data.date,
    theme: data.theme as ThemeName | undefined,
    slides,
  }
}

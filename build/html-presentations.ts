/**
 * Self-contained HTML presentations: `content/html/<slug>/index.html` (+ its
 * assets) is published byte-for-byte at `/p/<slug>/`. Vite never processes
 * these files, so a deck exported or hand-written as plain HTML keeps working
 * exactly as it does when opened from disk.
 *
 * - dev:   serves the folders through a middleware
 * - build: copies them into dist/p/
 * - app:   `virtual:html-presentations` exposes their metadata to the registry
 *
 * Optional `meta.json` next to index.html: { "title", "description", "date" }.
 * Without it, the title comes from the page's <title>.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { extname, join, normalize, relative, sep } from 'node:path'
import type { Plugin, ViteDevServer } from 'vite'

const ROOT = join(import.meta.dirname, '..', 'content', 'html')
const PUBLIC_PREFIX = '/p/'
const VIRTUAL_ID = 'virtual:html-presentations'
const RESOLVED_ID = `\0${VIRTUAL_ID}`

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
}

interface HtmlPresentationMeta {
  slug: string
  title: string
  description?: string
  date?: string
  slideCount?: number
}

const slugs = () =>
  existsSync(ROOT)
    ? readdirSync(ROOT).filter((name) => existsSync(join(ROOT, name, 'index.html')))
    : []

function readMeta(slug: string): HtmlPresentationMeta {
  const html = readFileSync(join(ROOT, slug, 'index.html'), 'utf8')
  const metaFile = join(ROOT, slug, 'meta.json')
  const meta = existsSync(metaFile) ? JSON.parse(readFileSync(metaFile, 'utf8')) : {}
  const slideCount = html.match(/<section\b[^>]*class="[^"]*\bslide\b/g)?.length

  return {
    slug,
    title: meta.title ?? html.match(/<title>([^<]*)<\/title>/i)?.[1]?.trim() ?? slug,
    description: meta.description,
    date: meta.date,
    slideCount: slideCount || undefined,
  }
}

function* walk(dir: string): Generator<string> {
  for (const name of readdirSync(dir)) {
    if (name.startsWith('.')) continue
    const path = join(dir, name)
    if (statSync(path).isDirectory()) yield* walk(path)
    else yield path
  }
}

function serve(server: ViteDevServer) {
  server.middlewares.use((req, res, next) => {
    const url = decodeURIComponent((req.url ?? '').split(/[?#]/)[0])
    if (!url.startsWith(PUBLIC_PREFIX)) return next()

    const [slug, ...rest] = url.slice(PUBLIC_PREFIX.length).split('/')
    if (!slug || !slugs().includes(slug)) return next()

    // `/p/x` → `/p/x/` so relative asset paths resolve (Firebase does the same).
    if (rest.length === 0) {
      res.statusCode = 301
      res.setHeader('Location', `${PUBLIC_PREFIX}${slug}/`)
      return res.end()
    }

    const base = join(ROOT, slug)
    const file = normalize(join(base, rest.join('/') || 'index.html'))
    if (!file.startsWith(base + sep) || !existsSync(file) || statSync(file).isDirectory()) return next()

    res.setHeader('Content-Type', MIME[extname(file).toLowerCase()] ?? 'application/octet-stream')
    res.end(readFileSync(file))
  })
}

export function htmlPresentations(): Plugin {
  return {
    name: 'html-presentations',

    resolveId: (id) => (id === VIRTUAL_ID ? RESOLVED_ID : undefined),

    load(id) {
      if (id !== RESOLVED_ID) return
      for (const slug of slugs()) this.addWatchFile(join(ROOT, slug, 'meta.json'))
      return `export default ${JSON.stringify(slugs().map(readMeta))}`
    },

    configureServer(server) {
      serve(server)
      server.watcher.add(ROOT)
      const reload = (path: string) => {
        if (!path.startsWith(ROOT)) return
        const module = server.moduleGraph.getModuleById(RESOLVED_ID)
        if (module) server.moduleGraph.invalidateModule(module)
        server.ws.send({ type: 'full-reload' })
      }
      server.watcher.on('add', reload)
      server.watcher.on('change', reload)
      server.watcher.on('unlink', reload)
    },

    generateBundle() {
      for (const slug of slugs()) {
        for (const file of walk(join(ROOT, slug))) {
          const path = relative(join(ROOT, slug), file).split(sep).join('/')
          if (path === 'meta.json') continue
          this.emitFile({
            type: 'asset',
            fileName: `${PUBLIC_PREFIX.slice(1)}${slug}/${path}`,
            source: readFileSync(file),
          })
        }
      }
    },
  }
}

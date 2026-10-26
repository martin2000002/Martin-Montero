import type { ReactNode } from 'react'

export type ThemeName = 'midnight' | 'paper' | 'aurora'

export interface DeckMeta {
  title: string
  description?: string
  /** ISO date (YYYY-MM-DD). Used to sort the home page, newest first. */
  date?: string
  theme?: ThemeName
}

/** What a `content/decks/<slug>/deck.tsx` file default-exports. */
export interface DeckDefinition extends DeckMeta {
  slides: ReactNode[]
}

export interface Deck extends DeckDefinition {
  slug: string
  source: 'tsx' | 'md'
}

export type FileKind = 'pdf' | 'image' | 'video' | 'audio' | 'office' | 'other'

export interface ContentFile {
  /** Path relative to `content/files/`, e.g. `charlas/ia.pdf`. Used in the URL. */
  path: string
  name: string
  ext: string
  kind: FileKind
  url: string
}

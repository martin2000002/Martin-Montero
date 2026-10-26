/**
 * Public API for deck authors. Decks in `content/decks/*` import only from
 * here: `import { defineDeck, Slide, Title } from '@/deck'`.
 */
import type { DeckDefinition } from '@/content/types'

export * from './kit'
export type { DeckDefinition, ThemeName } from '@/content/types'

/** Identity helper that gives a deck file full type-checking and autocompletion. */
export const defineDeck = (deck: DeckDefinition) => deck

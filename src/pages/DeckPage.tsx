import { useCallback } from 'react'
import { useParams } from 'react-router'
import { findDeck } from '@/content/registry'
import { ScaledSlide } from '@/deck/ScaledSlide'
import { Player } from '@/player/Player'
import type { Size } from '@/player/useFitBox'
import { NotFoundPage } from './NotFoundPage'

export function DeckPage() {
  const { slug = '' } = useParams()
  const deck = findDeck(slug)

  const renderSlide = useCallback(
    (index: number, size: Size) =>
      deck && <ScaledSlide slide={deck.slides[index]} theme={deck.theme} size={size} />,
    [deck],
  )

  if (!deck) return <NotFoundPage />
  return <Player title={deck.title} count={deck.slides.length} renderSlide={renderSlide} />
}

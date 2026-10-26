import type { ReactNode } from 'react'
import type { ThemeName } from '@/content/types'
import type { Size } from '@/player/useFitBox'
import { SLIDE_HEIGHT, SLIDE_WIDTH } from './kit'

interface ScaledSlideProps {
  slide: ReactNode
  theme?: ThemeName
  size: Size
}

/** Renders a slide on its 1920×1080 canvas and scales it to `size`. */
export function ScaledSlide({ slide, theme = 'midnight', size }: ScaledSlideProps) {
  return (
    <div className="overflow-hidden" style={{ width: size.width, height: size.height }}>
      <div
        className={`deck-theme deck-theme--${theme}`}
        style={{
          width: SLIDE_WIDTH,
          height: SLIDE_HEIGHT,
          transform: `scale(${size.width / SLIDE_WIDTH})`,
          transformOrigin: '0 0',
        }}
      >
        {slide}
      </div>
    </div>
  )
}

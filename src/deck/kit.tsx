/**
 * Building blocks for writing slides. Every slide is laid out on a fixed
 * 1920×1080 canvas and scaled to the screen, so sizes here are real pixels
 * and a deck looks identical on a laptop, a projector or a phone.
 */
import type { CSSProperties, ReactNode } from 'react'
import { cx } from '@/ui/cx'

export const SLIDE_WIDTH = 1920
export const SLIDE_HEIGHT = 1080

/**
 * - `default` — content from the top-left
 * - `center`  — everything centered (statements, section breaks)
 * - `cover`   — big title anchored bottom-left (first slide)
 * - `split`   — two columns; pass exactly two children
 * - `full`    — no padding, for full-bleed images or video
 */
export type SlideLayout = 'default' | 'center' | 'cover' | 'split' | 'full'

interface SlideProps {
  layout?: SlideLayout
  /** Any CSS background: a color, a gradient or `url(...)`. */
  background?: string
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

export function Slide({ layout = 'default', background, className, style, children }: SlideProps) {
  return (
    <section
      className={cx('slide', `slide--${layout}`, className)}
      style={{ ...(background && { background }), ...style }}
    >
      {children}
    </section>
  )
}

export const Eyebrow = ({ children }: { children: ReactNode }) => (
  <p className="slide-eyebrow">{children}</p>
)

export const Title = ({ children, size = 'lg' }: { children: ReactNode; size?: 'md' | 'lg' | 'xl' }) => (
  <h1 className={cx('slide-title', `slide-title--${size}`)}>{children}</h1>
)

export const Lead = ({ children }: { children: ReactNode }) => <p className="slide-lead">{children}</p>

export const Text = ({ children }: { children: ReactNode }) => <p className="slide-text">{children}</p>

export const Bullets = ({ items }: { items: ReactNode[] }) => (
  <ul className="slide-bullets">
    {items.map((item, i) => (
      <li key={i}>{item}</li>
    ))}
  </ul>
)

export const Columns = ({ children, gap = 96 }: { children: ReactNode; gap?: number }) => (
  <div className="slide-columns" style={{ gap }}>
    {children}
  </div>
)

export const Stat = ({ value, label }: { value: ReactNode; label: ReactNode }) => (
  <div className="slide-stat">
    <span className="slide-stat__value">{value}</span>
    <span className="slide-stat__label">{label}</span>
  </div>
)

export const Quote = ({ children, by }: { children: ReactNode; by?: ReactNode }) => (
  <figure className="slide-quote">
    <blockquote>{children}</blockquote>
    {by && <figcaption>— {by}</figcaption>}
  </figure>
)

export const Code = ({ children }: { children: string }) => (
  <pre className="slide-code">
    <code>{children.trim()}</code>
  </pre>
)

interface MediaProps {
  src: string
  alt?: string
  fit?: 'cover' | 'contain'
  rounded?: boolean
}

/** Image or video (by extension). Import the file so Vite fingerprints it. */
export function Media({ src, alt = '', fit = 'cover', rounded = true }: MediaProps) {
  const className = cx('slide-media', rounded && 'slide-media--rounded')
  const style = { objectFit: fit }
  return /\.(mp4|webm|mov)(\?|$)/i.test(src) ? (
    <video className={className} style={style} src={src} autoPlay muted loop playsInline />
  ) : (
    <img className={className} style={style} src={src} alt={alt} />
  )
}

/**
 * The presentation player. It knows nothing about *what* a slide is — decks,
 * PDFs and images all plug in through `renderSlide`. Keep it that way: new
 * content types should add a renderer, not branch in here.
 */
import { useMemo, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { Link } from 'react-router'
import { CopyLinkButton } from '@/ui/CopyLinkButton'
import { cx } from '@/ui/cx'
import { ArrowLeft, ArrowRight, Back, Download, Expand, Grid, Shrink } from '@/ui/icons'
import { useDocumentTitle } from '@/ui/useDocumentTitle'
import { Overview } from './Overview'
import { useFitBox, type Size } from './useFitBox'
import { useFullscreen } from './useFullscreen'
import { useIdle } from './useIdle'
import { useKeyboard, useSlideNavigation } from './useSlideNavigation'

export type RenderSlide = (index: number, size: Size) => ReactNode

export interface PlayerProps {
  title: string
  count: number
  /** width / height of a slide. 16:9 for decks; PDFs pass their page ratio. */
  aspect?: number
  renderSlide: RenderSlide
  download?: { url: string; name: string }
}

const SWIPE_THRESHOLD = 50

export function Player({ title, count, aspect = 16 / 9, renderSlide, download }: PlayerProps) {
  const { index, goTo, next, prev } = useSlideNavigation(count)
  const [overview, setOverview] = useState(false)
  const fullscreen = useFullscreen()
  const idle = useIdle()
  const [stageRef, size] = useFitBox<HTMLDivElement>(aspect)
  const swipeStart = useRef<number | null>(null)
  useDocumentTitle(title)

  const bindings = useMemo(
    () => ({
      ArrowRight: next, ArrowDown: next, PageDown: next, ' ': next,
      ArrowLeft: prev, ArrowUp: prev, PageUp: prev, Backspace: prev,
      Home: () => goTo(0),
      End: () => goTo(count - 1),
      f: fullscreen.toggle,
      o: () => setOverview(true),
    }),
    [next, prev, goTo, count, fullscreen.toggle],
  )
  const overviewBindings = useMemo(
    () => ({ Escape: () => setOverview(false), o: () => setOverview(false) }),
    [],
  )
  useKeyboard(bindings, !overview)
  useKeyboard(overviewBindings, overview)

  const onPointerDown = (event: PointerEvent) => {
    swipeStart.current = event.pointerType === 'mouse' ? null : event.clientX
  }
  const onPointerUp = (event: PointerEvent) => {
    if (swipeStart.current === null) return
    const delta = event.clientX - swipeStart.current
    swipeStart.current = null
    if (delta < -SWIPE_THRESHOLD) next()
    else if (delta > SWIPE_THRESHOLD) prev()
  }

  // Keep neighbours mounted: they preload (PDF canvases, images) and crossfade.
  const mounted = [index - 1, index, index + 1].filter((i) => i >= 0 && i < count)
  const hudHidden = idle && !overview

  return (
    <div className={cx('fixed inset-0 overflow-hidden bg-black text-white select-none', hudHidden && 'cursor-none')}>
      <div
        ref={stageRef}
        className="absolute inset-0 grid touch-pan-y place-items-center"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <div className="relative" style={{ width: size.width, height: size.height }}>
          {size.width > 0 &&
            mounted.map((i) => (
              <div
                key={i}
                aria-hidden={i !== index}
                className={cx(
                  'absolute inset-0 transition-opacity duration-300 ease-out',
                  i === index ? 'opacity-100' : 'pointer-events-none opacity-0',
                )}
              >
                {renderSlide(i, size)}
              </div>
            ))}
        </div>
      </div>

      {/* HUD */}
      <div className={cx('pointer-events-none absolute inset-0 transition-opacity duration-500', hudHidden && 'opacity-0')}>
        <header className="pointer-events-auto absolute inset-x-0 top-0 flex items-center gap-3 bg-gradient-to-b from-black/70 to-transparent px-4 pt-4 pb-10 sm:px-6">
          <Link to="/" className="hud-button" aria-label="Volver al inicio" title="Inicio">
            <Back />
          </Link>
          <h1 className="truncate text-sm font-medium text-white/90">{title}</h1>
        </header>

        <footer className="pointer-events-auto absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/70 to-transparent px-4 pt-10 pb-4 sm:px-6">
          <div className="flex items-center gap-1">
            <button type="button" className="hud-button" onClick={prev} disabled={index === 0} aria-label="Anterior">
              <ArrowLeft />
            </button>
            <span className="min-w-16 text-center font-mono text-xs text-white/70 tabular-nums">
              {index + 1} / {count}
            </span>
            <button type="button" className="hud-button" onClick={next} disabled={index === count - 1} aria-label="Siguiente">
              <ArrowRight />
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button type="button" className="hud-button" onClick={() => setOverview(true)} aria-label="Vista general" title="Vista general (O)">
              <Grid />
            </button>
            <CopyLinkButton className="hud-button" />
            {download && (
              <a className="hud-button" href={download.url} download={download.name} aria-label="Descargar" title="Descargar">
                <Download />
              </a>
            )}
            {fullscreen.supported && (
              <button type="button" className="hud-button" onClick={fullscreen.toggle} aria-label="Pantalla completa" title="Pantalla completa (F)">
                {fullscreen.active ? <Shrink /> : <Expand />}
              </button>
            )}
          </div>
        </footer>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-white/10">
        <div
          className="h-full bg-accent transition-[width] duration-300 ease-out"
          style={{ width: `${((index + 1) / count) * 100}%` }}
        />
      </div>

      {overview && (
        <Overview
          count={count}
          aspect={aspect}
          current={index}
          renderSlide={renderSlide}
          onSelect={(i) => {
            goTo(i)
            setOverview(false)
          }}
          onClose={() => setOverview(false)}
        />
      )}
    </div>
  )
}

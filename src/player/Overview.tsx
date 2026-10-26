import { useEffect, useRef } from 'react'
import { cx } from '@/ui/cx'
import { Close } from '@/ui/icons'
import type { RenderSlide } from './Player'
import { SlidePreview } from './SlidePreview'

interface OverviewProps {
  count: number
  aspect: number
  current: number
  renderSlide: RenderSlide
  onSelect: (index: number) => void
  onClose: () => void
}

export function Overview({ count, aspect, current, renderSlide, onSelect, onClose }: OverviewProps) {
  const currentRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    currentRef.current?.scrollIntoView({ block: 'center' })
    currentRef.current?.focus({ preventScroll: true })
  }, [])

  return (
    <div className="absolute inset-0 z-10 overflow-y-auto bg-black/90 backdrop-blur-xl" role="dialog" aria-label="Vista general">
      <div className="sticky top-0 z-10 flex items-center justify-between bg-gradient-to-b from-black to-transparent px-4 py-4 sm:px-6">
        <p className="font-mono text-xs tracking-wider text-white/60 uppercase">{count} diapositivas</p>
        <button type="button" className="hud-button" onClick={onClose} aria-label="Cerrar vista general">
          <Close />
        </button>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4 px-4 pb-10 sm:gap-6 sm:px-6">
        {Array.from({ length: count }, (_, i) => (
          <button
            key={i}
            ref={i === current ? currentRef : undefined}
            type="button"
            onClick={() => onSelect(i)}
            className="group flex flex-col gap-2 text-left outline-none"
          >
            <SlidePreview
              aspect={aspect}
              render={(size) => renderSlide(i, size)}
              className={cx(
                'pointer-events-none w-full overflow-hidden rounded-lg bg-white/5 ring-1 transition group-hover:ring-white/40 group-focus-visible:ring-2 group-focus-visible:ring-accent',
                i === current ? 'ring-2 ring-accent' : 'ring-white/10',
              )}
            />
            <span className="font-mono text-xs text-white/50 tabular-nums">{i + 1}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { useFitBox, type Size } from './useFitBox'

interface SlidePreviewProps {
  aspect: number
  render: (size: Size) => ReactNode
  className?: string
}

/**
 * A responsive, lazily-rendered thumbnail: it measures its own width and only
 * renders once scrolled near the viewport (a 200-page PDF stays cheap).
 */
export function SlidePreview({ aspect, render, className }: SlidePreviewProps) {
  const [ref, size] = useFitBox<HTMLDivElement>(aspect)
  const visible = useNearViewport(ref)

  return (
    <div ref={ref} className={className} style={{ aspectRatio: aspect }}>
      {visible && size.width > 0 && render(size)}
    </div>
  )
}

function useNearViewport(ref: RefObject<HTMLElement | null>) {
  const [visible, setVisible] = useState(false)
  const seen = useRef(false)

  useEffect(() => {
    const element = ref.current
    if (!element || seen.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        seen.current = true
        setVisible(true)
        observer.disconnect()
      },
      { rootMargin: '400px' },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref])

  return visible
}

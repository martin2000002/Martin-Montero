import { useLayoutEffect, useRef, useState } from 'react'

export interface Size {
  width: number
  height: number
}

/** Largest box with the given aspect ratio that fits inside the ref'd element. */
export function useFitBox<T extends HTMLElement>(aspect: number) {
  const ref = useRef<T>(null)
  const [size, setSize] = useState<Size>({ width: 0, height: 0 })

  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      const fitWidth = Math.min(width, height * aspect)
      setSize({ width: Math.floor(fitWidth), height: Math.floor(fitWidth / aspect) })
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [aspect])

  return [ref, size] as const
}

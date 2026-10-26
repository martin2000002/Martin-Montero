import { useCallback, useEffect, useState } from 'react'

export function useFullscreen() {
  const [active, setActive] = useState(() => Boolean(document.fullscreenElement))

  useEffect(() => {
    const sync = () => setActive(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', sync)
    return () => document.removeEventListener('fullscreenchange', sync)
  }, [])

  const toggle = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen()
    else void document.documentElement.requestFullscreen?.()
  }, [])

  return { active, toggle, supported: Boolean(document.documentElement.requestFullscreen) }
}

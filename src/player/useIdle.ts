import { useEffect, useState } from 'react'

/** True after `timeout` ms without pointer or key activity — used to hide the HUD. */
export function useIdle(timeout = 2500) {
  const [idle, setIdle] = useState(false)

  useEffect(() => {
    let timer = window.setTimeout(() => setIdle(true), timeout)
    const wake = () => {
      setIdle(false)
      window.clearTimeout(timer)
      timer = window.setTimeout(() => setIdle(true), timeout)
    }
    const events = ['pointermove', 'pointerdown', 'keydown'] as const
    events.forEach((name) => window.addEventListener(name, wake))
    return () => {
      window.clearTimeout(timer)
      events.forEach((name) => window.removeEventListener(name, wake))
    }
  }, [timeout])

  return idle
}

import { useCallback, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'

const clamp = (value: number, max: number) => Math.min(Math.max(value, 0), max)

/**
 * The current slide lives in the URL hash (`#3` = third slide), so any link
 * can point straight at a slide and reloading keeps your place.
 */
export function useSlideNavigation(count: number) {
  const location = useLocation()
  const navigate = useNavigate()

  const index = clamp((Number.parseInt(location.hash.slice(1), 10) || 1) - 1, count - 1)

  const goTo = useCallback(
    (target: number) => {
      const next = clamp(target, count - 1)
      navigate({ pathname: location.pathname, search: location.search, hash: `#${next + 1}` }, { replace: true })
    },
    [count, location.pathname, location.search, navigate],
  )

  return {
    index,
    goTo,
    next: useCallback(() => goTo(index + 1), [goTo, index]),
    prev: useCallback(() => goTo(index - 1), [goTo, index]),
  }
}

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))

/** Binds a key → action map to the window while `enabled`. */
export function useKeyboard(bindings: Record<string, () => void>, enabled = true) {
  useEffect(() => {
    if (!enabled) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || isTyping(event.target)) return
      const action = bindings[event.key] ?? bindings[event.key.toLowerCase()]
      if (!action) return
      event.preventDefault()
      action()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [bindings, enabled])
}

import { useState, type MouseEvent } from 'react'
import { cx } from './cx'
import { Check, LinkIcon } from './icons'

interface CopyLinkButtonProps {
  /** Path on this site, e.g. `/d/bienvenida`. Defaults to the current page. */
  path?: string
  className?: string
  label?: string
}

export function CopyLinkButton({ path, className, label = 'Copiar link' }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false)

  const copy = async (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    const url = new URL(path ?? window.location.pathname, window.location.origin).href
    await navigator.clipboard.writeText(url)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <button type="button" onClick={copy} className={className} title={label} aria-label={label}>
      <span className={cx('grid place-items-center transition', copied && 'text-accent')}>
        {copied ? <Check /> : <LinkIcon />}
      </span>
    </button>
  )
}

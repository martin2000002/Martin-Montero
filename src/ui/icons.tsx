import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const base = (props: IconProps) => ({
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  ...props,
})

export const ArrowLeft = (p: IconProps) => (
  <svg {...base(p)}><path d="M15 6l-6 6 6 6" /></svg>
)
export const ArrowRight = (p: IconProps) => (
  <svg {...base(p)}><path d="M9 6l6 6-6 6" /></svg>
)
export const Back = (p: IconProps) => (
  <svg {...base(p)}><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
)
export const Grid = (p: IconProps) => (
  <svg {...base(p)}><rect x="4" y="4" width="6.5" height="6.5" rx="1.5" /><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" /><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" /><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" /></svg>
)
export const Expand = (p: IconProps) => (
  <svg {...base(p)}><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>
)
export const Shrink = (p: IconProps) => (
  <svg {...base(p)}><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" /></svg>
)
export const LinkIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M10 14a4.5 4.5 0 006.4 0l3-3a4.5 4.5 0 00-6.4-6.4l-1 1" /><path d="M14 10a4.5 4.5 0 00-6.4 0l-3 3a4.5 4.5 0 006.4 6.4l1-1" /></svg>
)
export const Check = (p: IconProps) => (
  <svg {...base(p)}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
)
export const Download = (p: IconProps) => (
  <svg {...base(p)}><path d="M12 4v11M7 10.5l5 5 5-5M5 20h14" /></svg>
)
export const Close = (p: IconProps) => (
  <svg {...base(p)}><path d="M6 6l12 12M18 6L6 18" /></svg>
)
export const Play = (p: IconProps) => (
  <svg {...base(p)}><path d="M8 5.5v13l10.5-6.5z" fill="currentColor" stroke="none" /></svg>
)

const FILE_LABEL: Record<string, string> = {
  pdf: 'PDF', image: 'IMG', video: 'VID', audio: 'AUD', office: 'DOC', other: 'FILE',
}

export const FileBadge = ({ kind, ext }: { kind: string; ext: string }) => (
  <span className="inline-flex h-6 items-center rounded-md border border-line bg-surface px-2 font-mono text-[11px] font-medium tracking-wide text-muted uppercase">
    {ext || FILE_LABEL[kind]}
  </span>
)

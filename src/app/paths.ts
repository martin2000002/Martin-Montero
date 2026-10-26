/** URL builders — the only place that knows how routes are shaped. */
export const deckPath = (slug: string) => `/d/${slug}`

/** Served as a static page outside the app — link with a full page load. */
export const htmlPresentationPath = (slug: string) => `/p/${slug}/`

export const filePath = (path: string) =>
  `/f/${path.split('/').map(encodeURIComponent).join('/')}`

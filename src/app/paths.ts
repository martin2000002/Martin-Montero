/** URL builders — the only place that knows how routes are shaped. */
export const deckPath = (slug: string) => `/d/${slug}`

export const filePath = (path: string) =>
  `/f/${path.split('/').map(encodeURIComponent).join('/')}`

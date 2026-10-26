import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { htmlPresentations } from './build/html-presentations.ts'

export default defineConfig({
  plugins: [react(), tailwindcss(), htmlPresentations()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    // Never inline content files as data: URIs — every file needs a real,
    // shareable URL (the Office viewer and downloads depend on it).
    assetsInlineLimit: 0,
  },
})

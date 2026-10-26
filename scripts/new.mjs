#!/usr/bin/env node
/**
 * Scaffolds a new deck.
 *
 *   npm run new -- "Mi charla"          → content/decks/mi-charla/deck.tsx
 *   npm run new -- "Mi charla" --md     → content/decks/mi-charla/deck.md
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const args = process.argv.slice(2)
const markdown = args.includes('--md')
const title = args.filter((a) => !a.startsWith('--')).join(' ').trim()

if (!title) {
  console.error('Uso: npm run new -- "Título de la presentación" [--md]')
  process.exit(1)
}

const slug = title
  .normalize('NFD')
  .replace(/[̀-ͯ]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '')

const dir = join(import.meta.dirname, '..', 'content', 'decks', slug)
if (existsSync(dir)) {
  console.error(`Ya existe: content/decks/${slug}/`)
  process.exit(1)
}

const today = new Date().toISOString().slice(0, 10)
const quoted = JSON.stringify(title)

const tsx = `import { Bullets, defineDeck, Eyebrow, Lead, Slide, Title } from '@/deck'

export default defineDeck({
  title: ${quoted},
  description: '',
  date: '${today}',
  theme: 'midnight', // 'midnight' | 'paper' | 'aurora'
  slides: [
    <Slide layout="cover">
      <Eyebrow>Martin Montero</Eyebrow>
      <Title size="xl">{${quoted}}</Title>
      <Lead>Subtítulo de la presentación.</Lead>
    </Slide>,

    <Slide>
      <Title size="md">Primera idea</Title>
      <Bullets items={['Punto uno', 'Punto dos', 'Punto tres']} />
    </Slide>,

    <Slide layout="center">
      <Title>Gracias</Title>
    </Slide>,
  ],
})
`

const md = `---
title: ${title}
description:
date: ${today}
theme: midnight
---

<!-- layout: cover -->

### Martin Montero

# ${title}

Subtítulo de la presentación.

---

## Primera idea

- Punto uno
- Punto dos
- Punto tres

---

<!-- layout: center -->

# Gracias
`

mkdirSync(dir, { recursive: true })
const file = markdown ? 'deck.md' : 'deck.tsx'
writeFileSync(join(dir, file), markdown ? md : tsx)

console.log(`✔ content/decks/${slug}/${file}`)
console.log(`  npm run dev  →  http://localhost:5173/d/${slug}`)

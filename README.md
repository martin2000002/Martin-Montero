# Martin Montero: presentaciones

Mi sitio para **presentar desde un link**. Armo una presentación o dejo un archivo en
`content/`, publico y comparto el link. Funciona en cualquier pantalla con navegador.

**En vivo:** https://martin-montero.web.app

## Uso rápido

```bash
npm install
npm run dev                         # http://localhost:5173
```

### 1. Presentación programada (React/TSX)

```bash
npm run new -- "Mi charla"          # crea content/decks/mi-charla/deck.tsx
```

```tsx
import { defineDeck, Slide, Title, Lead, Bullets } from '@/deck'

export default defineDeck({
  title: 'Mi charla',
  date: '2026-10-26',
  theme: 'midnight',                // 'midnight' | 'paper' | 'aurora'
  slides: [
    <Slide layout="cover">
      <Title size="xl">Hola <em>mundo</em></Title>
      <Lead>Subtítulo</Lead>
    </Slide>,
    <Slide>
      <Bullets items={['Uno', 'Dos']} />
    </Slide>,
  ],
})
```

Componentes: `Slide` (layouts `default`, `center`, `cover`, `split`, `full`), `Eyebrow`,
`Title`, `Lead`, `Text`, `Bullets`, `Columns`, `Stat`, `Quote`, `Code`, `Media`.
Cada diapositiva mide 1920×1080 y se escala a la pantalla, así que se ve igual en un
proyector y en un celular. También puedes escribir JSX y CSS libre.

### 2. Presentación en Markdown

```bash
npm run new -- "Notas" --md         # crea content/decks/notas/deck.md
```

Cada línea que tenga solo `---` separa una diapositiva. Para el layout usa `<!-- layout: center -->`,
y para imágenes guárdalas junto al `.md` y enlázalas así: `![](./foto.jpg)`.

### 3. Archivos (PDF, PowerPoint, imágenes, video)

Arrástralos a `content/files/` (se pueden usar subcarpetas). Aparecen solos en la página de inicio.

| Tipo | Cómo se ve |
| --- | --- |
| **PDF** | Como presentación, página por página. **Es la mejor opción** para Keynote/PowerPoint/Canva: exporta a PDF. |
| PPT/PPTX/DOCX/XLSX | Visor de Microsoft (solo funciona con el sitio publicado). |
| Imagen / video / audio | A pantalla completa. |
| Otro | Botón de descarga. |

## Presentar

| Tecla | Acción |
| --- | --- |
| `→` `↓` `Espacio` `PageDown` | Siguiente |
| `←` `↑` `PageUp` | Anterior |
| `F` | Pantalla completa |
| `O` | Vista general |
| `Inicio` / `Fin` | Primera / última |

En el celular se avanza deslizando. El link incluye la diapositiva actual: `…/d/mi-charla#4`.

## Publicar

**Automático:** cada push o merge a `main` compila y publica el sitio (GitHub Actions →
Firebase Hosting) en ~1 minuto. Cada pull request recibe un link de preview temporal.

```bash
git add -A && git commit -m "Nueva charla" && git push
```

**Manual (respaldo):** `npm run deploy`. La primera vez, inicia sesión con la cuenta correcta:

```bash
firebase login:add martin2000002@gmail.com
firebase login:use martin2000002@gmail.com
```

## Stack

Vite · React 19 · TypeScript · Tailwind CSS v4 · React Router · pdf.js · Firebase Hosting.
La arquitectura está explicada en [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

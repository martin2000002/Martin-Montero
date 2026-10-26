# CLAUDE.md

## Para qué existe este proyecto (no olvidar)

Sitio personal de **Martin Montero** para **presentar desde un link**. Martin arma una
presentación (en código o en Markdown) o deja un archivo (PDF, PPTX, imagen, video) en
la carpeta `content/`, publica, y comparte el link. Cualquier pantalla con navegador
sirve para presentar; nada depende de su computadora.

- **Solo frontend. Sin backend, sin base de datos, sin subir archivos desde el navegador.**
  El contenido entra al sitio por el repo (`content/`) y se publica con un deploy.
  Esto lo decidió Martin explícitamente: no agregar Firebase Storage, Firestore, Auth
  ni formularios de subida salvo que él lo pida.
- **Todo es público**: quien tenga el link lo ve. No hay contenido privado.
- El objetivo es la **rapidez**: de idea a link compartible en minutos.

## Cuentas y destinos

- Firebase project: **`martin-montero`** (plan Spark, gratis, sin facturación) →
  https://martin-montero.web.app
- La cuenta de Google correcta es **martin2000002@gmail.com**. El Firebase CLI de esta
  máquina puede tener otra cuenta activa (memontero@salihub.app): antes de hacer un deploy,
  verifica con `firebase login:list` / `firebase login:use martin2000002@gmail.com`.
- GitHub: https://github.com/martin2000002/Martin-Montero (rama `main`).
- **Deploy automático:** cada push/merge a `main` → GitHub Actions (`.github/workflows/deploy.yml`)
  hace lint + build y publica en Firebase Hosting. Cada PR recibe un link de preview
  temporal (`preview.yml`). Usa el secreto `FIREBASE_SERVICE_ACCOUNT_MARTIN_MONTERO`.
  `npm run deploy` desde la terminal es solo un respaldo manual.

## Comandos

```bash
npm run dev                      # http://localhost:5173
npm run new -- "Título"          # nuevo deck TSX en content/decks/<slug>/deck.tsx
npm run new -- "Título" --md     # nuevo deck Markdown
npm run build                    # typecheck + build a dist/
npm run lint
npm run deploy                   # build + firebase deploy --only hosting
```

Antes de dar algo por terminado: `npm run build` y `npm run lint` sin errores.

## Cómo está organizado

Lee `docs/ARCHITECTURE.md` antes de cambiar la estructura. Resumen:

- `content/`: **lo único que se edita para agregar contenido.** Se descubre solo
  (`import.meta.glob` en `src/content/registry.ts`); no hay que registrar nada a mano.
- `content/html/<slug>/`: presentaciones HTML autónomas (con su propio JS) publicadas **tal cual**
  en `/p/<slug>/` por el plugin `build/html-presentations.ts`. No las modifiques ni las conviertas a
  TSX salvo que Martin lo pida: traen su propio temporizador y sus atajos.
- `src/player/`: reproductor genérico (teclado, swipe, hash `#n`, pantalla completa,
  vista general). No sabe qué es una diapositiva: recibe `renderSlide`.
- `src/deck/`: kit para escribir diapositivas (`Slide`, `Title`, …) en un lienzo fijo de 1920×1080 + temas.
- `src/viewers/`: un visor por tipo de archivo (PDF con pdf.js, Office, imagen, video).
- `src/pages/`, `src/app/`: rutas (`/`, `/d/:slug`, `/f/*`) y constructores de URL (`paths.ts`).

## Subir una presentación que Martin ya tiene

- `.html` autónomo + assets → copia a `content/html/<slug>/` (HTML como `index.html`) y agrega `meta.json`.
  No copies material de apoyo como guiones o notas (`.md`) salvo que lo pida: todo lo publicado es público.
- PDF, PPTX, imágenes o video → `content/files/`.
- Lee todo el archivo antes de publicarlo.

## Reglas

- Los decks en `content/` importan **solo** desde `@/deck`.
- Un tipo de contenido nuevo se agrega como un renderer o visor nuevo; no metas ramas en `Player`.
- pdf.js se usa en su build **legacy** (`pdfjs-dist/legacy/...`): la build moderna se
  rompe en navegadores que no son de última versión.
- Las URLs públicas (`/d/<slug>`, `/p/<slug>/`, `/f/<ruta>`, `#n`) son links que Martin ya compartió:
  no las cambies sin dejar un redirect en `firebase.json`.
- La interfaz está en español.

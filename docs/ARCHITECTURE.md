# Arquitectura

## Principios

1. **El contenido es código.** Todo lo que se muestra vive en `content/` y se descubre
   al compilar. No hay base de datos, API ni panel de administración. Publicar = deploy.
2. **Sitio 100% estático.** El resultado de `npm run build` es HTML/JS/CSS y archivos.
   Firebase Hosting lo sirve desde un CDN, gratis en el plan Spark.
3. **Un solo reproductor, muchos renderers.** El `Player` maneja la navegación, el teclado,
   la pantalla completa y la vista general, y no sabe qué está mostrando. Cada tipo de
   contenido le entrega una función `renderSlide(index, size)`.
4. **Lienzo fijo.** Las diapositivas se diseñan en 1920×1080 px y se escalan con
   `transform`. Lo que ves en tu pantalla es lo que se ve en el proyector.
5. **Las URLs son un contrato.** Los links ya se compartieron, así que `/d/<slug>`,
   `/f/<ruta>` y `#n` no se cambian sin dejar un redirect.

## Flujo de datos

```
content/decks/*/deck.tsx ─┐
content/decks/*/deck.md  ─┼─► src/content/registry.ts ─► decks[], files[]
content/files/**/*       ─┘      (import.meta.glob)           │
                                                              ▼
                       pages/HomePage   (galería, miniaturas)
                       pages/DeckPage   ─► Player ◄─ renderSlide = ScaledSlide
                       pages/FilePage   ─► viewers/FileViewer
                                             ├─ pdf    ─► Player ◄─ renderSlide = PdfPage
                                             ├─ image/video ─► Player (1 diapositiva)
                                             ├─ office ─► OfficeViewer (iframe de Microsoft)
                                             └─ otro   ─► descarga
```

## Carpetas

```
content/                    ← lo ÚNICO que se toca para agregar contenido
  decks/<slug>/deck.tsx     deck en React (slug = nombre de la carpeta = URL)
  decks/<slug>/deck.md      deck en Markdown (+ imágenes al lado)
  files/**                  PDFs, PPTX, imágenes, videos (con subcarpetas)

src/
  app/          router.tsx (rutas), paths.ts (único lugar que construye URLs)
  content/      types.ts (modelo), registry.ts (descubrimiento), markdown.tsx (parser de .md)
  deck/         API pública para autores (index.ts), kit.tsx (componentes),
                deck.css (layouts + temas), ScaledSlide.tsx (escalado 1920×1080)
  player/       Player, Overview, SlidePreview y hooks (navegación por hash,
                teclado, idle, fullscreen, useFitBox)
  viewers/      FileViewer (elige el visor), OfficeViewer, pdf/ (pdf.js)
  pages/        HomePage, DeckPage, FilePage, NotFoundPage
  ui/           piezas compartidas (iconos, CopyLinkButton, StatusScreen…)
  styles/       tokens del sitio (claro/oscuro) + Tailwind

scripts/new.mjs             crea un deck desde una plantilla
.github/workflows/          deploy.yml (push a main → producción), preview.yml (PR → link temporal)
firebase.json               hosting: SPA rewrite + cache inmutable en /assets
```

### Dependencias entre capas

```
pages ─► viewers ─► player ─► ui
  │         │
  └────► deck ◄──── content/ (los decks importan solo desde @/deck)
  └────► content (registry)
```

- `player/` no importa de `deck/`, `viewers/` ni `pages/`.
- `content/` (la carpeta de contenido) solo importa `@/deck`.
- `paths.ts` y `router.tsx` deben coincidir.

## Puntos de extensión

| Quiero… | Dónde |
| --- | --- |
| Un componente nuevo para diapositivas | `src/deck/kit.tsx` + estilos en `deck.css` (se exporta solo vía `index.ts`) |
| Un tema nuevo | Agregar `.deck-theme--<nombre>` en `deck.css` y el nombre en `ThemeName` (`content/types.ts`) |
| Un layout nuevo | `SlideLayout` en `kit.tsx` + `.slide--<nombre>` en `deck.css` |
| Soportar otro tipo de archivo | `FileKind` (types.ts) → `KIND_BY_EXT` (registry.ts) → `case` en `FileViewer.tsx` (+ miniatura en `HomePage`) |
| Otra sintaxis de deck (p. ej. MDX) | Un glob + parser nuevo en `registry.ts` que devuelva `DeckDefinition` |
| Una función del reproductor (notas del presentador, temporizador…) | `src/player/`, sin acoplarla a un tipo de contenido |

## Publicación (CI/CD)

```
push / merge a main ─► GitHub Actions: npm ci → lint → build ─► Firebase Hosting (live)
pull request        ─► GitHub Actions: npm ci → lint → build ─► canal de preview (7 días, link en el PR)
```

La autenticación usa el service account guardado en el secreto del repo
`FIREBASE_SERVICE_ACCOUNT_MARTIN_MONTERO`, así que no depende de ninguna sesión local.
Si el lint o el build fallan, no se publica nada y el sitio sigue con la versión anterior.

## Rendimiento

- pdf.js (~430 kB) y su worker solo se cargan al abrir o previsualizar un PDF (`lazy`).
- Las miniaturas se renderizan cuando entran en pantalla (`SlidePreview` + IntersectionObserver).
- El `Player` mantiene montadas la diapositiva anterior y la siguiente: precarga y transición suave.
- Los archivos y assets llevan un hash en el nombre, y `/assets/**` se cachea un año como `immutable`.
  `index.html` no se cachea, así que un deploy nuevo se ve de inmediato.

## Cuándo crecer (y cómo)

La arquitectura está pensada para decenas o cientos de presentaciones sin cambios. Señales y siguientes pasos:

| Señal | Paso siguiente |
| --- | --- |
| El bundle principal pesa demasiado (muchos decks TSX pesados) | Cambiar el glob de decks a carga perezosa y mover el `meta` a un `meta.ts` por deck |
| Archivos grandes (>100 MB) o mucho tráfico de video | Firebase Storage o YouTube/Vimeo; el plan Spark de Hosting tiene 10 GB de almacenamiento y ~360 MB/día de transferencia |
| Quiero contenido privado | Firebase Auth + reglas de Hosting no alcanzan: haría falta Storage con reglas (plan Blaze). Es un cambio de principio, así que hay que decidirlo primero |
| Subir archivos desde el navegador | Rompe el principio 1. Solo si Martin lo pide explícitamente |

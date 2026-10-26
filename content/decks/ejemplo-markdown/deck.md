---
title: Ejemplo en Markdown
description: La forma más rápida de armar una presentación. Solo texto.
date: 2026-10-25
theme: paper
---

<!-- layout: cover -->

### Ejemplo

# Escribir slides en *Markdown*

Separa cada diapositiva con una línea que diga solo `---`.

---

## Listas, **negritas** y código

- Cada `---` empieza una diapositiva nueva
- Las imágenes van junto al archivo: `![](./foto.jpg)`
- Elige el layout con `<!-- layout: center -->`

---

<!-- layout: split -->

<div>

## Dos columnas

Con `layout: split`, envuelve cada columna en un `<div>`.

</div>
<div>

```ts
const slides = markdown.split('---')
```

</div>

---

<!-- layout: center -->

> Menos diseño, más contenido.

---

<!-- layout: center -->

# Gracias

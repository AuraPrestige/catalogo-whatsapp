# Catálogo de WhatsApp · Aura Prestige

Este repositorio mantiene al día el catálogo de WhatsApp (Meta) de **Aura Prestige**
a partir del catálogo público de laboncler.es.

## Cómo funciona

1. Cada día a las 06:10 UTC, GitHub ejecuta `build.mjs`.
2. El script lee el catálogo de laboncler.es y genera `catalogo-whatsapp.csv`
   con precios, ofertas y disponibilidad (agotado / disponible).
3. Si algo ha cambiado, el archivo se actualiza en este repositorio.
4. Meta descarga ese archivo cada día y actualiza el catálogo de WhatsApp.

No hace falta tener ningún ordenador encendido.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `build.mjs` | Descarga el catálogo de laboncler.es y escribe el CSV |
| `buildFeed.js` | Reglas del catálogo: precios, categorías, agotados, perfumes |
| `catalogo-whatsapp.csv` | El archivo que descarga Meta (se regenera solo) |
| `.github/workflows/actualizar-catalogo.yml` | La programación diaria |

## Lanzarlo a mano

Pestaña **Actions** → *Actualizar catálogo de WhatsApp* → **Run workflow**.

## Reglas aplicadas

- Los perfumes de equivalencia llevan el precio propio de Aura Prestige (14,95 € / 6,95 €).
- Los productos sin stock aparecen como **agotados** si ya estaban en el catálogo;
  los que nunca estuvieron y no tienen stock no se publican.
- Las ofertas se publican con el precio anterior tachado.
- Se excluyen catálogos, carteles, muestras y material de apoyo.

Si laboncler.es devuelve menos de 300 productos, el proceso se detiene sin tocar nada
para evitar vaciar el catálogo por un fallo puntual de su web.

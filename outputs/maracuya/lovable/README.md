# MARACUYA — proyecto de Lovable

Copia del proyecto **"Maracuya: Mercado Latino"** de Lovable
(`bad49ffc-091d-4335-a3be-56e094ad5aea`, workspace `cristiantoro's Lovable`),
traída a este repositorio el 2026-09-16 desde el commit `b707f6a`.

- Editor: https://lovable.dev/projects/bad49ffc-091d-4335-a3be-56e094ad5aea
- Vista previa: https://id-preview--bad49ffc-091d-4335-a3be-56e094ad5aea.lovable.app

## Qué es

Una aplicación **React + TanStack Start + Vite + Tailwind v4 + shadcn/ui**.
No es un tema de Shopify y no se puede subir a Shopify como tal.

```
src/routes/        index.tsx (portada), tienda.tsx (catálogo), __root.tsx
src/components/site/   header, footer, cart (contexto + panel), product-card
src/lib/catalogo.ts    12 productos y 4 categorías de demostración
src/styles.css         sistema de diseño: verde selva, amarillo maracuyá,
                       hibisco, arena; Fraunces (display) + Outfit (texto)
```

## Cómo ejecutarlo

```
bun install
bun run dev      # http://localhost:3000
bun run build    # verificado: compila sin errores
```

## Qué NO se pudo traer, y por qué

**Las 12 imágenes originales.** El servidor MCP de Lovable solo devuelve
archivos como texto, así que los binarios llegan corrompidos, y `lovable.dev`
y sus CDN están bloqueados por el proxy de salida de este entorno. Se
verificó: `https://lovable.dev/` y `https://screenshot2.lovable.dev/`
devuelven error de conexión.

En su lugar, `src/assets/*.jpg` son **marcadores de posición generados
aquí**, con el nombre del archivo escrito encima para que no haya duda de
que no son fotografías reales. Para recuperar las originales hay dos vías:

1. Descargarlas desde el editor de Lovable y copiarlas sobre
   `src/assets/`, conservando los nombres.
2. Conectar el proyecto de Lovable a GitHub; entonces el repositorio se
   puede clonar aquí con las imágenes incluidas.

**El logotipo** sí es el real: `logo.asset.json` apuntaba al CDN de Lovable
y ahora apunta a `/maracuya-logo.svg`, el logotipo de marca que ya estaba en
este repositorio.

**47 componentes de `src/components/ui/`** que shadcn instala por defecto y
que esta aplicación no importa (accordion, calendar, chart, table…). Solo se
trajeron los tres que se usan: `button`, `sheet` y `sonner`. Si hicieran
falta: `bunx shadcn@latest add <nombre>`.

## Contenido de demostración

Los 12 productos, sus precios, orígenes y descripciones son inventados, igual
que los plazos y tarifas de envío. El propio texto de la página lo dice: "Los
plazos y precios son una propuesta inicial". Nada de esto debe publicarse como
información comercial real.

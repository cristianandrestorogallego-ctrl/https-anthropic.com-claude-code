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

## De dónde salió cada archivo

El proyecto se trajo primero archivo a archivo por el servidor MCP de
Lovable, que solo devuelve texto: los binarios llegaban corrompidos y
`lovable.dev` y sus CDN están bloqueados por el proxy de salida de este
entorno. Después Cristian conectó el proyecto a GitHub, y el repositorio
`cristianandrestorogallego-ctrl/maracuya-mercado-latino` se clonó aquí,
así que **las 13 imágenes y los 46 componentes de shadcn son los reales**.

La transcripción por MCP se verificó contra el clon: 24 de 26 archivos
salieron byte a byte idénticos. Los dos que no (`styles.css` y
`__root.tsx`) difieren solo por el `prettier` del propio proyecto, que
Lovable no había ejecutado sobre ellos.

Una sola cosa se aparta del original a propósito: **`logo.asset.json`**.
Apuntaba a `/__l5e/assets-v1/…/MARACUYA-logo.png`, una ruta que solo
resuelve dentro de la vista previa de Lovable. Ahora apunta a
`/maracuya-logo.svg`, el logotipo de marca real, que está en `public/` y
por tanto funciona en los dos sitios.

## Dos copias, un aviso

Este directorio y el repositorio `maracuya-mercado-latino` son copias
distintas del mismo proyecto. Los commits que se empujan a la rama
conectada de ese repositorio se sincronizan con el editor de Lovable; los
de aquí, no. Si se trabaja en los dos sitios a la vez, divergen.

## Cambios hechos aquí sobre el original

- **Filtro de categoría en la URL.** Las tarjetas de categoría de la portada
  enlazaban todas a `/tienda` sin filtrar, así que pulsar "Bebidas" mostraba
  el catálogo entero. Ahora el filtro es un search param validado con zod
  (`/tienda?categoria=bebidas`), los botones navegan en vez de guardar
  estado local, y el enlace se puede compartir.
- **Página de producto** en `/producto/$id`: migas de pan, selector de
  cantidad, añadir a la cesta, condiciones de envío y productos
  relacionados de la misma categoría. Un id inexistente devuelve 404.
- `agregar()` del carrito acepta una cantidad, para que el selector de la
  ficha funcione de una sola vez.

Verificado: `bun run build` y `bunx tsc --noEmit` pasan sin errores y
`bun run lint` sin errores (quedan avisos de `react-refresh` propios del
patrón de shadcn). Las rutas responden 200, y `/producto/no-existe`
responde 404.

## Contenido de demostración

Los 12 productos, sus precios, orígenes y descripciones son inventados, igual
que los plazos y tarifas de envío. El propio texto de la página lo dice: "Los
plazos y precios son una propuesta inicial". Nada de esto debe publicarse como
información comercial real.

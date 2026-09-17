# MARACUYA mercado latino — aplicación web

Tienda de productos latinoamericanos para España. **React + TanStack Start

- Vite + Tailwind v4 + shadcn/ui.**

```bash
bun install
bun run dev      # http://localhost:3000
bun run build    # compila y regenera src/routeTree.gen.ts
bunx tsc --noEmit
bun run lint     # bun run format arregla el formato
```

## De dónde viene

El diseño nació en Lovable, en el proyecto "Maracuya: Mercado Latino".
Cristian prefirió ese diseño al prototipo anterior, y como su acceso a
Lovable se terminó, el proyecto se trajo aquí **y se independizó**:

- `vite.config.ts` es propio. Sustituye a `@lovable.dev/vite-tanstack-config`,
  que además de componer los plugins traía un proxy de los assets de Lovable,
  detección de su sandbox, diagnósticos de su build y un preset de Cloudflare.
  Ahora la build es para Node y el host se decide al desplegar.
- `src/lib/error-reporting.ts` sustituye al reporte de errores de Lovable.
  Escribe en consola y nada más; cuando haya un servicio de telemetría de
  verdad, se conecta ahí y en ningún otro sitio.
- El logotipo se importa directamente desde `src/assets/maracuya-logo.svg`.
  Antes era un `logo.asset.json` que apuntaba al CDN de Lovable, una ruta que
  solo resolvía dentro de su vista previa.
- Ya no queda ninguna dependencia ni referencia a Lovable.

Las fotografías son las originales del proyecto de Lovable, recuperadas del
repositorio `maracuya-mercado-latino` que Cristian sincronizó a GitHub.

## Estructura

```
src/routes/            index (portada), tienda, producto.$id, __root
src/components/site/   header, footer, cart (contexto + panel), product-card
src/components/ui/     shadcn — 46 componentes; la app usa button, sheet y sonner
src/lib/catalogo.ts    12 productos y 4 categorías
src/styles.css         sistema de diseño en oklch
```

**Diseño:** verde `selva` como color principal, amarillo `maracuya` de
acento, `hibisco` y `arena`; Fraunces para titulares y Outfit para el texto.

## Estado

Funciona: portada, catálogo con filtro de categoría en la URL, ficha de
producto con relacionados, y cesta con panel lateral. `bun run build`,
`tsc --noEmit` y `lint` pasan limpios.

Falta, del encargo original: recetas con paquete de ingredientes, ofertas del
día y del mes, filtro por país, pedido por WhatsApp y estimación de entrega.
Todo eso existe escrito en `../prototype/` y se puede trasladar a este diseño.

**Esto no es un tema de Shopify y no se puede subir a Shopify.** Para vender
habría que conectar la Storefront API y desplegar la app por separado. El
tema Liquid que sí instala Shopify está en `../theme/`, terminado y
verificado, sin publicar.

## Contenido de demostración

Los 12 productos, sus precios, orígenes, descripciones y los plazos y tarifas
de envío son inventados. La propia ficha de producto lo dice. Nada de esto
debe publicarse como información comercial real.

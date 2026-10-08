import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { CabeceraPais } from "@/components/site/cabecera-pais";
import { ProductCard } from "@/components/site/product-card";
import { Reveal, stagger } from "@/components/site/reveal";
import { banderaUrl, categorias, paises, productos, type Producto } from "@/lib/catalogo";
import { cn } from "@/lib/utils";

const CATEGORIAS = categorias.map((c) => c.id) as [string, ...string[]];
const PAISES = paises.map((p) => p.id) as [string, ...string[]];

/**
 * Los filtros viven en la URL, no en useState: así la cabecera, el panel
 * lateral y la portada pueden enlazar a un estado concreto de la tienda, y
 * ese enlace se puede compartir o guardar.
 */
const busquedaTienda = z.object({
  q: z.string().trim().min(1).optional(),
  categoria: z.enum(CATEGORIAS).optional(),
  subcategoria: z.string().trim().min(1).optional(),
  pais: z.enum(PAISES).optional(),
  oferta: z.boolean().optional(),
  disponible: z.boolean().optional(),
  orden: z.enum(["relevancia", "precio-asc", "precio-desc"]).optional(),
});

type BusquedaTienda = z.infer<typeof busquedaTienda>;

const ORDENES = [
  ["relevancia", "Relevancia"],
  ["precio-asc", "Precio ↑"],
  ["precio-desc", "Precio ↓"],
] as const;

/**
 * Si un producto entra en una combinación de filtros.
 *
 * Está fuera del componente porque no solo filtra la cuadrícula: también
 * sirve para contar. Cada opción de la columna lleva al lado cuántos
 * productos quedarían si se pulsara, y eso es volver a pasar el catálogo
 * entero por aquí con un filtro cambiado. Son 172 productos y una veintena
 * de opciones: se nota menos que pedírselo al servidor.
 */
function cumple(p: Producto, f: BusquedaTienda, termino?: string) {
  if (f.categoria && p.categoria !== f.categoria) return false;
  if (f.subcategoria && p.subcategoria !== f.subcategoria) return false;
  if (f.pais && p.pais !== f.pais) return false;
  if (f.oferta && p.precioAnterior === undefined) return false;
  if (f.disponible && !p.disponible) return false;
  if (termino) {
    const heno = `${p.nombre} ${p.marca} ${p.subcategoria} ${p.descripcion}`.toLowerCase();
    if (!heno.includes(termino)) return false;
  }
  return true;
}

export const Route = createFileRoute("/tienda")({
  validateSearch: busquedaTienda,
  head: () => ({
    meta: [
      { title: "Tienda online de productos latinos | MARACUYA mercado latino" },
      {
        name: "description",
        content:
          "Harinas, ajíes, jugos tropicales y dulces de América Latina, por categoría y por país.",
      },
      { property: "og:title", content: "Tienda online de productos latinos | MARACUYA" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Tienda,
});

function Tienda() {
  const filtros = Route.useSearch();

  const activa = filtros.categoria ? categorias.find((c) => c.id === filtros.categoria) : undefined;
  const paisActivo = filtros.pais ? paises.find((p) => p.id === filtros.pais) : undefined;

  const termino = filtros.q?.toLowerCase();
  let lista = productos.filter((p) => cumple(p, filtros, termino));

  if (filtros.orden === "precio-asc") lista = [...lista].sort((a, b) => a.precio - b.precio);
  if (filtros.orden === "precio-desc") lista = [...lista].sort((a, b) => b.precio - a.precio);

  /** Cuántos productos quedarían cambiando solo esto. */
  const cuantos = (parcial: Partial<BusquedaTienda>) =>
    productos.filter((p) => cumple(p, { ...filtros, ...parcial }, termino)).length;

  const puestos = [
    filtros.q,
    filtros.categoria,
    filtros.subcategoria,
    filtros.pais,
    filtros.oferta,
    filtros.disponible,
  ].filter(Boolean).length;

  const titulo = filtros.q
    ? `Resultados para «${filtros.q}»`
    : paisActivo
      ? `Productos de ${paisActivo.nombre}`
      : filtros.oferta
        ? "Ofertas"
        : (filtros.subcategoria ?? activa?.nombre ?? "El mercado completo");

  const entradilla = filtros.q
    ? "Buscamos en el nombre, la marca, la subcategoría y la descripción."
    : paisActivo
      ? paisActivo.nota
      : filtros.oferta
        ? "Productos con precio rebajado sobre su precio anterior."
        : filtros.subcategoria && activa
          ? `Dentro de ${activa.nombre}.`
          : (activa?.claim ??
            "Una selección corta y honesta: solo entran los productos que usamos en nuestra propia cocina.");

  /** Conserva el resto de filtros al cambiar uno solo. */
  const con = (parcial: Partial<BusquedaTienda>): BusquedaTienda => {
    const siguiente = { ...filtros, ...parcial };
    for (const clave of Object.keys(siguiente) as (keyof BusquedaTienda)[]) {
      const valor = siguiente[clave];
      if (valor === undefined || valor === false || valor === "") delete siguiente[clave];
    }
    return siguiente;
  };

  const panel = (conRotulo: boolean) => (
    <Filtros
      filtros={filtros}
      con={con}
      cuantos={cuantos}
      puestos={puestos}
      conRotulo={conRotulo}
    />
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-9 sm:py-12">
        {paisActivo ? (
          <CabeceraPais pais={paisActivo} />
        ) : (
          <>
            <h1 className="font-display text-4xl tracking-[-0.025em] sm:text-5xl">{titulo}</h1>
            <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">{entradilla}</p>
          </>
        )}

        {/* Dos columnas a partir de pantalla ancha: los filtros a la
            izquierda y el género a la derecha. Antes iban arriba, apilados
            en tres filas de botones, y entrar en la tienda era encontrarse
            una pared de opciones antes de ver un solo producto. El orden de
            la página lo marca ahora la cuadrícula, no el filtro.

            `items-start` es lo que permite que la columna se quede pegada al
            desplazar: sin él la rejilla estira las dos celdas a la misma
            altura y `sticky` no tiene margen donde moverse. */}
        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[14rem_minmax(0,1fr)]">
          {/* En móvil no hay sitio para una columna, y volver a poner los
              filtros encima sería deshacer justo esto. Así que ahí van
              dentro de un <details> cerrado: una línea de alto en vez de
              tres filas, y el navegador se encarga de abrirlo sin que haga
              falta estado ni JavaScript.

              La `key` lo vuelve a montar —y por tanto lo cierra— cada vez
              que cambian los filtros. Un <details> es un elemento con
              memoria propia: React no lo toca al repintar, así que sin esto
              se quedaba abierto tapando justo los productos que acababa de
              filtrar. */}
          <details
            key={JSON.stringify(filtros)}
            className="group rounded-2xl border bg-card lg:hidden"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
              <span className="flex items-center gap-2 text-sm font-medium">
                <SlidersHorizontal className="size-4 text-muted-foreground" aria-hidden="true" />
                Filtros
                {puestos > 0 && (
                  <span className="tabular rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                    {puestos}
                  </span>
                )}
              </span>
              <ChevronDown
                className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <div className="border-t px-4 py-5">{panel(false)}</div>
          </details>

          {/* La columna se queda a la vista al desplazar, pero con su propio
              desplazamiento: la lista entera mide más que una pantalla, y
              pegada sin más se quedaba con las últimas opciones cortadas y
              sin forma de llegar a ellas. El hueco de arriba es la cabecera,
              que también va pegada. */}
          <aside className="hidden lg:sticky lg:top-40 lg:block lg:max-h-[calc(100dvh-12rem)] lg:overflow-y-auto lg:pr-1 lg:[scrollbar-width:thin]">
            {panel(true)}
          </aside>

          <div>
            {/* El orden no es un filtro: no quita productos, los recoloca.
                Por eso vive encima de la cuadrícula, al lado de la cuenta
                que cambia, y no en la columna de la izquierda. */}
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
              <p className="tabular text-sm text-muted-foreground">
                {lista.length === 1 ? "1 producto" : `${lista.length} productos`}
              </p>
              <div className="flex items-center gap-1">
                <span className="mr-1 hidden text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground sm:inline">
                  Ordenar
                </span>
                {ORDENES.map(([valor, etiqueta]) => (
                  <Fila
                    key={valor}
                    busqueda={con({ orden: valor === "relevancia" ? undefined : valor })}
                    activo={(filtros.orden ?? "relevancia") === valor}
                  >
                    {etiqueta}
                  </Fila>
                ))}
              </div>
            </div>

            {lista.length === 0 ? (
              <div className="mt-5 rounded-2xl bg-arena/50 px-6 py-16 text-center">
                <h2 className="font-display text-xl">No encontramos nada con esos filtros</h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                  Prueba con menos filtros, o revisa la ortografía si has buscado por texto.
                </p>
                <Button asChild className="mt-6">
                  <Link to="/tienda" search={{}}>
                    Ver todo el catálogo
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="mt-4 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {lista.map((p, i) => (
                  <Reveal key={p.id} delay={stagger(i)}>
                    <ProductCard producto={p} />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

/**
 * La columna de filtros.
 *
 * Se pinta dos veces —dentro del <details> de móvil y en la columna de
 * escritorio— y solo una de las dos está visible a la vez, porque a la otra
 * la esconde `display:none` y de ahí no lee nadie, ni un lector de
 * pantalla. Es la forma barata de no tener dos juegos de filtros que
 * mantener a la par.
 *
 * El ancho manda en la forma: el `@container` pone las categorías en una
 * columna en la barra estrecha y en dos cuando el panel es ancho, como en
 * una tableta. Mirando el tamaño del contenedor, no el de la pantalla, que
 * es lo que de verdad decide si «Panadería y repostería» cabe en una línea.
 */
function Filtros({
  filtros,
  con,
  cuantos,
  puestos,
  conRotulo,
}: {
  filtros: BusquedaTienda;
  con: (parcial: Partial<BusquedaTienda>) => BusquedaTienda;
  cuantos: (parcial: Partial<BusquedaTienda>) => number;
  puestos: number;
  /** En móvil el rótulo lo pone el resumen del <details>, y repetirlo sobra. */
  conRotulo: boolean;
}) {
  const activa = filtros.categoria ? categorias.find((c) => c.id === filtros.categoria) : undefined;

  return (
    <div className="@container space-y-7">
      {(conRotulo || puestos > 0) && (
        <div className="flex items-baseline justify-between gap-2">
          {conRotulo && (
            <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.16em]">Filtros</h2>
          )}
          {puestos > 0 && (
            <Link
              to="/tienda"
              search={{}}
              className="ml-auto flex items-center gap-1 text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              <X className="size-3" aria-hidden="true" />
              Quitar todo
            </Link>
          )}
        </div>
      )}

      {/* La búsqueda se puede quitar por separado: es el único filtro que
          cuesta volver a escribir. */}
      {filtros.q && (
        <Grupo titulo="Búsqueda">
          <Link
            to="/tienda"
            search={con({ q: undefined })}
            className="flex items-center justify-between gap-2 rounded-lg bg-arena/60 px-2.5 py-1.5 text-sm hover:bg-arena"
          >
            <span className="truncate">«{filtros.q}»</span>
            <X className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
          </Link>
        </Grupo>
      )}

      <Grupo titulo="Categoría">
        <div className="grid gap-0.5 @[26rem]:grid-cols-2">
          <Fila
            busqueda={con({ categoria: undefined, subcategoria: undefined })}
            activo={!filtros.categoria}
            cuenta={cuantos({ categoria: undefined, subcategoria: undefined })}
          >
            Todas
          </Fila>
          {categorias.map((c) => (
            <Fila
              key={c.id}
              // Al cambiar de categoría hay que soltar la subcategoría: es
              // de la anterior, y la combinación no deja ni un producto.
              busqueda={con({ categoria: c.id, subcategoria: undefined })}
              activo={filtros.categoria === c.id}
              cuenta={cuantos({ categoria: c.id, subcategoria: undefined })}
            >
              {c.nombre}
            </Fila>
          ))}
        </div>

        {/* Las subcategorías solo salen dentro de su categoría. Las de las
            trece a la vez serían una lista más larga que la tienda. */}
        {activa && activa.subcategorias.length > 0 && (
          <div className="mt-2 ml-2.5 space-y-0.5 border-l pl-2.5">
            {activa.subcategorias.map((s) => (
              <Fila
                key={s}
                busqueda={con({ subcategoria: filtros.subcategoria === s ? undefined : s })}
                activo={filtros.subcategoria === s}
                cuenta={cuantos({ subcategoria: s })}
              >
                {s}
              </Fila>
            ))}
          </div>
        )}
      </Grupo>

      <Grupo titulo="País">
        <div className="grid grid-cols-2 gap-0.5">
          {paises.map((p) => (
            <Fila
              key={p.id}
              busqueda={con({ pais: filtros.pais === p.id ? undefined : p.id })}
              activo={filtros.pais === p.id}
              compacta
            >
              <img
                src={banderaUrl(p.codigo)}
                alt=""
                width={20}
                height={14}
                loading="lazy"
                className="h-3.5 w-5 shrink-0 rounded-[2px] object-cover"
              />
              <span className="truncate">{p.nombre}</span>
            </Fila>
          ))}
        </div>
      </Grupo>

      <Grupo titulo="Mostrar">
        <Fila
          busqueda={con({ oferta: !filtros.oferta })}
          activo={Boolean(filtros.oferta)}
          cuenta={cuantos({ oferta: true })}
        >
          Solo ofertas
        </Fila>
        <Fila
          busqueda={con({ disponible: !filtros.disponible })}
          activo={Boolean(filtros.disponible)}
          cuenta={cuantos({ disponible: true })}
        >
          Solo disponibles
        </Fila>
      </Grupo>
    </div>
  );
}

function Grupo({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {titulo}
      </h3>
      <div className="mt-2.5 space-y-0.5">{children}</div>
    </div>
  );
}

/**
 * Una opción de la columna.
 *
 * Es un enlace, no un botón: cada filtro es una dirección de la tienda, y
 * así se puede abrir en otra pestaña, guardar o compartir. La cuenta de al
 * lado dice cuántos productos deja esa opción con los demás filtros puestos
 * —por eso baja a cero en algunas combinaciones—; el enlace sigue
 * funcionando, y lleva al aviso de que no hay nada, que trae su salida.
 */
function Fila({
  busqueda,
  activo,
  cuenta,
  compacta,
  children,
}: {
  busqueda: BusquedaTienda;
  activo: boolean;
  cuenta?: number;
  compacta?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      to="/tienda"
      search={busqueda}
      aria-current={activo ? "true" : undefined}
      className={cn(
        "flex items-center rounded-lg transition-colors",
        compacta ? "gap-1.5 px-1.5 py-1.5 text-xs" : "gap-2 px-2.5 py-1.5 text-sm",
        activo
          ? "bg-primary font-medium text-primary-foreground"
          : "text-muted-foreground hover:bg-arena hover:text-foreground",
      )}
    >
      {children}
      {cuenta !== undefined && (
        <span
          className={cn(
            "tabular ml-auto pl-2 text-xs",
            activo ? "text-primary-foreground/70" : "text-muted-foreground/60",
            cuenta === 0 && !activo && "opacity-50",
          )}
        >
          {cuenta}
        </span>
      )}
    </Link>
  );
}

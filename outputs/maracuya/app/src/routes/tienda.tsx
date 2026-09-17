import { createFileRoute, Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { ProductCard } from "@/components/site/product-card";
import { Reveal, stagger } from "@/components/site/reveal";
import { banderaUrl, categorias, paises, productos } from "@/lib/catalogo";

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
  pais: z.enum(PAISES).optional(),
  oferta: z.boolean().optional(),
  disponible: z.boolean().optional(),
  orden: z.enum(["relevancia", "precio-asc", "precio-desc"]).optional(),
});

type BusquedaTienda = z.infer<typeof busquedaTienda>;

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
  let lista = productos.filter((p) => {
    if (filtros.categoria && p.categoria !== filtros.categoria) return false;
    if (filtros.pais && p.pais !== filtros.pais) return false;
    if (filtros.oferta && p.precioAnterior === undefined) return false;
    if (filtros.disponible && !p.disponible) return false;
    if (termino) {
      const heno = `${p.nombre} ${p.marca} ${p.subcategoria} ${p.descripcion}`.toLowerCase();
      if (!heno.includes(termino)) return false;
    }
    return true;
  });

  if (filtros.orden === "precio-asc") lista = [...lista].sort((a, b) => a.precio - b.precio);
  if (filtros.orden === "precio-desc") lista = [...lista].sort((a, b) => b.precio - a.precio);

  const hayFiltros =
    Boolean(filtros.q) ||
    Boolean(filtros.categoria) ||
    Boolean(filtros.pais) ||
    Boolean(filtros.oferta) ||
    Boolean(filtros.disponible);

  const titulo = filtros.q
    ? `Resultados para «${filtros.q}»`
    : paisActivo
      ? `Productos de ${paisActivo.nombre}`
      : filtros.oferta
        ? "Ofertas"
        : (activa?.nombre ?? "El mercado completo");

  const entradilla = filtros.q
    ? "Buscamos en el nombre, la marca, la subcategoría y la descripción."
    : paisActivo
      ? paisActivo.nota
      : filtros.oferta
        ? "Productos con precio rebajado sobre su precio anterior."
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="font-display text-4xl tracking-[-0.025em] sm:text-5xl">{titulo}</h1>
        <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">{entradilla}</p>

        {/* Categorías */}
        <div className="mt-8 flex flex-wrap gap-2">
          <Button asChild variant={filtros.categoria ? "outline" : "default"} size="sm">
            <Link to="/tienda" search={con({ categoria: undefined })}>
              Todas
            </Link>
          </Button>
          {categorias.map((c) => (
            <Button
              key={c.id}
              asChild
              variant={filtros.categoria === c.id ? "default" : "outline"}
              size="sm"
            >
              <Link to="/tienda" search={con({ categoria: c.id })}>
                {c.nombre}
              </Link>
            </Button>
          ))}
        </div>

        {/* País, ofertas, disponibilidad y orden */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {paises.map((p) => (
            <Button
              key={p.id}
              asChild
              variant={filtros.pais === p.id ? "default" : "ghost"}
              size="sm"
              className="gap-1.5 px-2.5"
            >
              <Link to="/tienda" search={con({ pais: filtros.pais === p.id ? undefined : p.id })}>
                <img
                  src={banderaUrl(p.codigo)}
                  alt=""
                  width={20}
                  height={14}
                  className="h-3.5 w-5 rounded-[2px] object-cover"
                />
                {p.nombre}
              </Link>
            </Button>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Button asChild variant={filtros.oferta ? "default" : "outline"} size="sm">
            <Link to="/tienda" search={con({ oferta: !filtros.oferta })}>
              Solo ofertas
            </Link>
          </Button>
          <Button asChild variant={filtros.disponible ? "default" : "outline"} size="sm">
            <Link to="/tienda" search={con({ disponible: !filtros.disponible })}>
              Solo disponibles
            </Link>
          </Button>
          <span className="ml-1 text-sm text-muted-foreground">Ordenar:</span>
          {(
            [
              ["relevancia", "Relevancia"],
              ["precio-asc", "Precio ↑"],
              ["precio-desc", "Precio ↓"],
            ] as const
          ).map(([valor, etiqueta]) => (
            <Button
              key={valor}
              asChild
              variant={(filtros.orden ?? "relevancia") === valor ? "default" : "ghost"}
              size="sm"
            >
              <Link
                to="/tienda"
                search={con({ orden: valor === "relevancia" ? undefined : valor })}
              >
                {etiqueta}
              </Link>
            </Button>
          ))}

          {hayFiltros && (
            <Button asChild variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
              <Link to="/tienda" search={{}}>
                <X className="size-3.5" aria-hidden="true" />
                Quitar filtros
              </Link>
            </Button>
          )}
        </div>

        <p className="tabular mt-7 text-sm text-muted-foreground">
          {lista.length === 1 ? "1 producto" : `${lista.length} productos`}
        </p>

        {lista.length === 0 ? (
          <div className="mt-6 rounded-2xl bg-arena/50 px-6 py-16 text-center">
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
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {lista.map((p, i) => (
              <Reveal key={p.id} delay={stagger(i)}>
                <ProductCard producto={p} />
              </Reveal>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

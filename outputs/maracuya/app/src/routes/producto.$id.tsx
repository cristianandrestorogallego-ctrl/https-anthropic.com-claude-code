import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight, Minus, Plus, ShoppingBag, Snowflake, Truck } from "lucide-react";

import { esCongelado } from "@/lib/congelados";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { ProductCard } from "@/components/site/product-card";
import { useCarrito } from "@/components/site/cart";
import { banderaUrl, categorias, formatoPrecio, paisPorId, productos } from "@/lib/catalogo";
import { PLAZO, ZONA, listaFuera, precioYGratis } from "@/lib/envio";

export const Route = createFileRoute("/producto/$id")({
  loader: ({ params }) => {
    const producto = productos.find((p) => p.id === params.id);
    if (!producto) throw notFound();
    return { producto };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.producto;
    if (!p) return {};
    return {
      meta: [
        { title: `${p.nombre} | MARACUYA mercado latino` },
        { name: "description", content: `${p.descripcion} ${p.marca}, ${p.formato}.` },
        { property: "og:title", content: `${p.nombre} | MARACUYA` },
        { property: "og:description", content: p.descripcion },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: DetalleProducto,
});

function DetalleProducto() {
  const { producto } = Route.useLoaderData();
  const { agregar } = useCarrito();
  const [cantidad, setCantidad] = useState(1);

  const categoria = categorias.find((c) => c.id === producto.categoria);
  const pais = paisPorId(producto.pais);
  const relacionados = productos
    .filter((p) => p.categoria === producto.categoria && p.id !== producto.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-10">
        <nav
          aria-label="Ruta de navegación"
          className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground"
        >
          <Link to="/" className="hover:text-primary">
            Inicio
          </Link>
          <ChevronRight className="size-3.5 shrink-0" aria-hidden="true" />
          <Link to="/tienda" search={{}} className="hover:text-primary">
            Tienda
          </Link>
          {categoria && (
            <>
              <ChevronRight className="size-3.5 shrink-0" aria-hidden="true" />
              <Link
                to="/tienda"
                search={{ categoria: categoria.id }}
                className="hover:text-primary"
              >
                {categoria.nombre}
              </Link>
            </>
          )}
          <ChevronRight className="size-3.5 shrink-0" aria-hidden="true" />
          <span aria-current="page" className="text-foreground">
            {producto.nombre}
          </span>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="aspect-4/5 w-full rounded-3xl bg-arena object-cover shadow-[var(--shadow-e3)]"
          />

          <div className="lg:py-4">
            {producto.etiqueta && (
              <span className="inline-block rounded-full bg-maracuya px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-wide text-maracuya-foreground">
                {producto.etiqueta}
              </span>
            )}

            <h1 className="mt-4 font-display text-3xl leading-tight tracking-[-0.025em] sm:text-4xl">
              {producto.nombre}
            </h1>
            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <img
                  src={banderaUrl(pais.codigo)}
                  alt=""
                  width={20}
                  height={14}
                  className="h-3.5 w-5 rounded-[2px] object-cover"
                />
                {pais.nombre}
              </span>
              <span>{producto.marca}</span>
              <span>{producto.formato}</span>
              {producto.fabricadoEn && <span>Fabricado en {producto.fabricadoEn}</span>}
            </p>
            <p className="mt-5 max-w-prose leading-relaxed text-muted-foreground">
              {producto.descripcion}
            </p>

            <p className="mt-7 flex flex-wrap items-baseline gap-3">
              <span className="tabular font-display text-4xl tracking-[-0.02em]">
                {formatoPrecio(producto.precio)}
              </span>
              {producto.precioAnterior && (
                <span className="tabular text-lg text-muted-foreground line-through">
                  {formatoPrecio(producto.precioAnterior)}
                </span>
              )}
              <span
                className={`text-sm font-medium ${producto.disponible ? "text-primary" : "text-destructive"}`}
              >
                {producto.disponible ? "Disponible" : "Agotado"}
              </span>
            </p>

            {producto.variantes && producto.variantes.length > 0 && (
              <p className="mt-3 text-sm text-muted-foreground">
                Variantes: {producto.variantes.join(" · ")}
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 rounded-md border p-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-8"
                  aria-label="Quitar una unidad"
                  disabled={cantidad <= 1}
                  onClick={() => setCantidad((n) => Math.max(1, n - 1))}
                >
                  <Minus className="size-3.5" />
                </Button>
                <span className="tabular w-8 text-center text-sm">{cantidad}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-8"
                  aria-label="Añadir una unidad"
                  onClick={() => setCantidad((n) => n + 1)}
                >
                  <Plus className="size-3.5" />
                </Button>
              </div>

              {/* Los congelados no van a la cesta: se piden. Ver
                  lib/congelados.ts para el porqué. */}
              {esCongelado(producto) ? (
                <Button
                  asChild
                  size="lg"
                  className="gap-2 shadow-[var(--shadow-e1)] transition-[transform,box-shadow] duration-200 hover:shadow-[var(--shadow-e2)] active:translate-y-px"
                >
                  <Link to="/congelados">
                    <Snowflake className="size-4" />
                    Pedir congelados
                  </Link>
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="gap-2 shadow-[var(--shadow-e1)] transition-[transform,box-shadow] duration-200 hover:shadow-[var(--shadow-e2)] active:translate-y-px"
                  disabled={!producto.disponible}
                  onClick={() => agregar(producto, cantidad)}
                >
                  <ShoppingBag className="size-4" />
                  Añadir a la cesta · {formatoPrecio(producto.precio * cantidad)}
                </Button>
              )}
            </div>

            {/* El envío de un congelado no es el mismo que el del resto, y
                enseñar aquí "24-72 h a España peninsular" sería prometer
                algo que la paquetería no hace con producto congelado. */}
            <div className="mt-8 space-y-3 rounded-2xl bg-card p-5 text-sm shadow-[var(--shadow-e1)] ring-1 ring-[var(--ring-linea)]">
              {esCongelado(producto) ? (
                <>
                  <p className="flex items-center gap-2 font-medium">
                    <Snowflake className="size-4 text-primary" />
                    Este producto no se envía por paquetería
                  </p>
                  <p className="text-muted-foreground">
                    Los congelados se entregan en mano en la provincia de Barcelona. Pídelo y te
                    decimos cómo y cuándo podemos llevártelo.
                  </p>
                </>
              ) : (
                <>
                  <p className="flex items-center gap-2 font-medium">
                    <Truck className="size-4 text-primary" />
                    Envío en {PLAZO} a {ZONA}
                  </p>
                  <p className="text-muted-foreground">
                    {precioYGratis()}. Todavía no llegamos a {listaFuera()}.
                  </p>
                </>
              )}
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              Ficha de demostración: el precio, el origen y el formato son de ejemplo y aún no
              corresponden a un producto en venta.
            </p>
          </div>
        </div>

        {relacionados.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-2xl sm:text-3xl">
              También en {categoria?.nombre.toLowerCase() ?? "el mercado"}
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relacionados.map((p) => (
                <ProductCard key={p.id} producto={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight, Minus, Plus, ShoppingBag, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { ProductCard } from "@/components/site/product-card";
import { useCarrito } from "@/components/site/cart";
import { categorias, formatoPrecio, productos } from "@/lib/catalogo";

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
        { name: "description", content: `${p.descripcion} ${p.origen}, ${p.formato}.` },
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
            <p className="mt-2 text-sm text-muted-foreground">
              {producto.origen} · {producto.formato}
            </p>
            <p className="mt-5 max-w-prose leading-relaxed text-muted-foreground">
              {producto.descripcion}
            </p>

            <p className="tabular mt-7 font-display text-4xl tracking-[-0.02em]">
              {formatoPrecio(producto.precio)}
            </p>

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

              <Button
                size="lg"
                className="gap-2 shadow-[var(--shadow-e1)] transition-[transform,box-shadow] duration-200 hover:shadow-[var(--shadow-e2)] active:translate-y-px"
                onClick={() => agregar(producto, cantidad)}
              >
                <ShoppingBag className="size-4" />
                Añadir a la cesta · {formatoPrecio(producto.precio * cantidad)}
              </Button>
            </div>

            <div className="mt-8 space-y-3 rounded-2xl bg-card p-5 text-sm shadow-[var(--shadow-e1)] ring-1 ring-[oklch(0.27_0.06_158_/_0.08)]">
              <p className="flex items-center gap-2 font-medium">
                <Truck className="size-4 text-primary" />
                Envío en 24-72 h a España peninsular
              </p>
              <p className="text-muted-foreground">
                4,95 € y gratis a partir de 49 €. Baleares en 48-96 h. Para Canarias, Ceuta y
                Melilla, consulta condiciones antes de pedir.
              </p>
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

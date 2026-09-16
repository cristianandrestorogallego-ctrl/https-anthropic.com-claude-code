import { createFileRoute, Link } from "@tanstack/react-router";
import { Leaf, PackageCheck, Sparkles, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { ProductCard } from "@/components/site/product-card";
import { categorias, productos } from "@/lib/catalogo";
import heroMesa from "@/assets/hero-mesa.jpg";
import historiaImg from "@/assets/historia.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MARACUYA mercado latino | Productos latinoamericanos en España" },
      {
        name: "description",
        content:
          "Harinas para arepas, ajíes, jugos tropicales y dulces de América Latina. Envío a toda España en 24-72 h y gratis desde 49 €.",
      },
      {
        property: "og:title",
        content: "MARACUYA mercado latino | Sabor de América Latina en España",
      },
      {
        property: "og:description",
        content:
          "Mercado latino online: despensa, ajíes, bebidas y dulces seleccionados, con envío rápido a toda España.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const destacados = productos.filter((p) => p.etiqueta).slice(0, 4);

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero */}
        <section className="relative isolate overflow-hidden bg-selva text-selva-foreground">
          <img
            src={heroMesa}
            alt="Mesa latina con arepas, empanadas, ajíes, maracuyá y jugos tropicales"
            width={1600}
            height={1104}
            className="absolute inset-0 size-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-selva via-selva/85 to-transparent" />
          <div className="relative mx-auto grid max-w-6xl gap-6 px-4 py-24 sm:py-32">
            <span className="w-fit rounded-full border border-white/25 px-4 py-1 text-xs uppercase tracking-[0.25em]">
              Mercado latino en España
            </span>
            <h1 className="max-w-2xl text-balance-title font-display text-4xl leading-[1.05] sm:text-6xl">
              El sabor de casa,
              <span className="block text-maracuya">a dos días de tu cocina</span>
            </h1>
            <p className="max-w-lg text-base opacity-90 sm:text-lg">
              Harinas para arepas, ajíes con carácter, jugos tropicales y dulces de siempre.
              Seleccionamos poco y bien, para que cocines como en casa sin buscar de tienda en
              tienda.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-maracuya text-maracuya-foreground hover:bg-maracuya/90"
              >
                <Link to="/tienda" search={{}}>
                  Ver el catálogo
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 bg-transparent text-selva-foreground hover:bg-white/10 hover:text-selva-foreground"
              >
                <a href="#categorias">Explorar por categoría</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Ventajas */}
        <section className="border-b bg-arena/60">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:grid-cols-3">
            {[
              { icon: Truck, t: "Envío 24-72 h", d: "A toda España, gratis desde 49 €" },
              { icon: PackageCheck, t: "Producto original", d: "Marcas latinas de verdad" },
              { icon: Leaf, t: "Selección corta", d: "Solo lo que cocinamos nosotros" },
            ].map(({ icon: Icon, t, d }) => (
              <div key={t} className="flex items-center gap-3">
                <Icon className="size-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">{t}</p>
                  <p className="text-sm text-muted-foreground">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Categorías */}
        <section id="categorias" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Pasillos del mercado
              </p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl">Elige por antojo</h2>
            </div>
            <Button asChild variant="link" className="px-0">
              <Link to="/tienda" search={{}}>
                Ver todo el catálogo →
              </Link>
            </Button>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categorias.map((c) => (
              <Link
                key={c.id}
                to="/tienda"
                search={{ categoria: c.id }}
                className="group relative overflow-hidden rounded-2xl"
              >
                <img
                  src={c.imagen}
                  alt={c.nombre}
                  loading="lazy"
                  width={912}
                  height={1104}
                  className="aspect-3/4 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-selva/90 via-selva/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-selva-foreground">
                  <h3 className="font-display text-xl">{c.nombre}</h3>
                  <p className="text-sm opacity-85">{c.claim}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Destacados */}
        <section className="bg-secondary/50 py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="size-4" />
              <p className="text-xs uppercase tracking-[0.3em]">Lo más pedido</p>
            </div>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl">
              Los imprescindibles de la casa
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {destacados.map((p) => (
                <ProductCard key={p.id} producto={p} />
              ))}
            </div>
          </div>
        </section>

        {/* Historia */}
        <section id="historia" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <img
              src={historiaImg}
              alt="Manos amasando arepas en una cocina casera"
              loading="lazy"
              width={1200}
              height={912}
              className="w-full rounded-3xl object-cover shadow-[var(--shadow-soft)]"
            />
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Nuestra historia
              </p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl">
                Empezó por una arepa en un piso de Madrid
              </h2>
              <p className="mt-4 text-muted-foreground">
                MARACUYA nació de la nostalgia compartida: encontrar la harina correcta, el ají que
                sabe a casa, el dulce de leche de la abuela. Hoy traemos ese mercado a cualquier
                cocina de España, con productos originales y explicados en español claro.
              </p>
              <p className="mt-3 text-muted-foreground">
                Probamos cada referencia antes de venderla. Si no la ponemos en nuestra mesa, no
                entra en la tienda.
              </p>
              <Button asChild className="mt-6">
                <Link to="/tienda" search={{}}>
                  Descubrir productos
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Envíos */}
        <section id="envios" className="scroll-mt-24 bg-arena/60 py-20">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="font-display text-3xl sm:text-4xl">Envíos claros, sin sorpresas</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {[
                {
                  t: "Península",
                  d: "24-72 h laborables. 4,95 € y gratis a partir de 49 €.",
                },
                {
                  t: "Baleares",
                  d: "48-96 h laborables. 7,95 € y gratis a partir de 69 €.",
                },
                {
                  t: "Canarias, Ceuta y Melilla",
                  d: "Consulta condiciones y trámites aduaneros antes de pedir.",
                },
              ].map((e) => (
                <div key={e.t} className="rounded-2xl border bg-card p-6">
                  <h3 className="font-display text-xl">{e.t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{e.d}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Los plazos y precios son una propuesta inicial: los ajustamos contigo antes de
              publicar la tienda.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Leaf, PackageCheck, Sparkles, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { ProductCard } from "@/components/site/product-card";
import { HeroCarousel } from "@/components/site/hero-carousel";
import { Reveal, stagger } from "@/components/site/reveal";
import { banderaUrl, categorias, paises, productos, recetas } from "@/lib/catalogo";
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
        {/* Hero: el carrusel ya existía como componente pero no estaba
            puesto en la portada. */}
        <HeroCarousel />

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
              <h2 className="mt-2 font-display text-3xl sm:text-4xl">Elige por antojo</h2>
            </div>
            <Button asChild variant="link" className="px-0">
              <Link to="/tienda">Ver todo el catálogo →</Link>
            </Button>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categorias.map((c) => (
              <Link key={c.id} to="/tienda" className="group relative overflow-hidden rounded-2xl">
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

        {/* Cocina con MARACUYA */}
        <section id="recetas" className="mx-auto max-w-6xl scroll-mt-32 px-4 py-20 sm:py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl tracking-[-0.02em] sm:text-4xl">
                Cocina con MARACUYA
              </h2>
              <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">
                Elige el plato, ajusta las raciones y te decimos qué envases necesitas comprar y qué
                pones tú de tu cocina.
              </p>
            </div>
            <Link
              to="/recetas"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Ver todas las recetas
              <ArrowRight
                className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recetas.slice(0, 3).map((r, i) => (
              <Reveal key={r.slug} delay={stagger(i)}>
                <Link
                  to="/receta/$slug"
                  params={{ slug: r.slug }}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl bg-card text-card-foreground shadow-[var(--shadow-e1)] ring-1 ring-[var(--ring-linea)] transition-[transform,box-shadow] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:shadow-[var(--shadow-e3)]"
                >
                  <div className="aspect-4/3 overflow-hidden bg-arena">
                    <img
                      src={r.imagen}
                      alt=""
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.06]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <h3 className="font-display text-lg leading-snug tracking-[-0.012em]">
                      {r.nombre}
                    </h3>
                    <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {r.resumen}
                    </p>
                    <p className="mt-auto flex items-center gap-1.5 pt-3 text-sm text-muted-foreground">
                      <Clock className="size-4" aria-hidden="true" />
                      <span className="tabular">{r.minutos} min</span>
                      <span aria-hidden="true">·</span>
                      {r.dificultad}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Compra por tradición y país */}
        <section
          id="paises"
          className="scroll-mt-32 border-y border-border bg-arena/40 py-20 sm:py-24"
        >
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="font-display text-3xl tracking-[-0.02em] sm:text-4xl">
              Compra por tradición y país
            </h2>
            <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">
              La tradición a la que pertenece cada producto. Cuando el país de fabricación es otro,
              lo decimos en su ficha.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {paises.map((p, i) => (
                <Reveal key={p.id} delay={stagger(i, 50)}>
                  <Link
                    to="/tienda"
                    search={{ pais: p.id }}
                    className="flex h-full flex-col items-center gap-3 rounded-2xl bg-card px-4 py-6 text-center shadow-[var(--shadow-e1)] ring-1 ring-[var(--ring-linea)] transition-[transform,box-shadow] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:shadow-[var(--shadow-e3)]"
                  >
                    <img
                      src={banderaUrl(p.codigo)}
                      alt=""
                      width={80}
                      height={56}
                      loading="lazy"
                      className="h-10 w-14 rounded-[3px] object-cover shadow-[var(--shadow-e1)]"
                    />
                    <span className="font-medium">{p.nombre}</span>
                  </Link>
                </Reveal>
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
                <Link to="/tienda">Descubrir productos</Link>
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

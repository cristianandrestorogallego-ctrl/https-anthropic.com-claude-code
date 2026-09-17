import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Leaf, PackageCheck, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { ProductCard } from "@/components/site/product-card";
import { Reveal, stagger } from "@/components/site/reveal";
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

const zonasEnvio = [
  { zona: "Península", plazo: "24-72 h laborables", precio: "4,95 €", gratis: "desde 49 €" },
  { zona: "Baleares", plazo: "48-96 h laborables", precio: "7,95 €", gratis: "desde 69 €" },
  {
    zona: "Canarias, Ceuta y Melilla",
    plazo: "Consulta condiciones",
    precio: "Por confirmar",
    gratis: "Con trámites aduaneros",
  },
];

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* ── Momento focal ──────────────────────────────────────────────
            La única secuencia con autoría de la página: la fotografía
            asienta desde un encuadre algo más cerrado mientras el velo
            resuelve, y las dos líneas del titular llegan en orden. Todo lo
            demás de la página es respuesta a una acción, no espectáculo. */}
        <section className="relative isolate overflow-hidden bg-selva text-selva-foreground">
          <img
            src={heroMesa}
            alt="Mesa latina con arepas, empanadas, ajíes, maracuyá y jugos tropicales"
            width={1600}
            height={1104}
            fetchPriority="high"
            className="mrc-hero-photo absolute inset-0 size-full object-cover opacity-65 will-change-transform"
          />
          <div className="mrc-hero-scrim absolute inset-0 bg-gradient-to-r from-selva via-selva/85 to-selva/10" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-selva/80 to-transparent" />

          <div className="relative mx-auto grid max-w-6xl gap-7 px-4 py-28 sm:py-36 lg:py-44">
            <h1 className="max-w-3xl text-balance-title font-display text-[2.7rem] leading-[1.02] tracking-[-0.03em] sm:text-6xl lg:text-7xl">
              <span className="mrc-rise block [animation-delay:120ms]">El sabor de casa,</span>
              <span className="mrc-rise block text-maracuya [animation-delay:280ms]">
                a dos días de tu cocina
              </span>
            </h1>

            <p className="mrc-rise max-w-lg text-base leading-relaxed text-selva-foreground/85 [animation-delay:420ms] sm:text-lg">
              Harinas para arepas, ajíes con carácter, jugos tropicales y dulces de siempre.
              Seleccionamos poco y bien, para que cocines como en casa sin buscar de tienda en
              tienda.
            </p>

            <div className="mrc-rise flex flex-wrap gap-3 [animation-delay:540ms]">
              <Button
                asChild
                size="lg"
                className="bg-maracuya text-maracuya-foreground shadow-[var(--shadow-e2)] transition-[transform,box-shadow] duration-200 hover:bg-maracuya/90 hover:shadow-[var(--shadow-e3)] active:translate-y-px"
              >
                <Link to="/tienda" search={{}}>
                  Ver el catálogo
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-selva-foreground/35 bg-transparent text-selva-foreground transition-colors duration-200 hover:bg-selva-foreground/10 hover:text-selva-foreground active:translate-y-px"
              >
                <a href="#categorias">Explorar por categoría</a>
              </Button>
            </div>
          </div>
        </section>

        {/* ── Franja de condiciones ──────────────────────────────────────
            Un letrero, no tres tarjetas: reglas finas que separan, sin caja
            ni fondo propio, para que pese lo que dice y no el contenedor. */}
        <section className="border-b border-border bg-arena/50">
          <div className="mx-auto max-w-6xl px-4">
            <dl className="grid divide-y divide-border/80 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {[
                { icon: Truck, t: "Envío 24-72 h", d: "A toda España, gratis desde 49 €" },
                { icon: PackageCheck, t: "Producto original", d: "Marcas latinas de verdad" },
                { icon: Leaf, t: "Selección corta", d: "Solo lo que cocinamos nosotros" },
              ].map(({ icon: Icon, t, d }, i) => (
                <div key={t} className={`py-6 ${i === 0 ? "sm:pr-8" : "sm:px-8"}`}>
                  <dt className="flex items-center gap-2 font-medium">
                    <Icon className="size-4 shrink-0 text-primary" aria-hidden="true" />
                    {t}
                  </dt>
                  <dd className="mt-1 text-sm text-muted-foreground">{d}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── Categorías ─────────────────────────────────────────────── */}
        <section id="categorias" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20 sm:py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-3xl tracking-[-0.02em] sm:text-4xl">
              Elige por antojo
            </h2>
            <Link
              to="/tienda"
              search={{}}
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Ver todo el catálogo
              <ArrowRight
                className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categorias.map((c, i) => (
              <Reveal key={c.id} delay={stagger(i)}>
                <Link
                  to="/tienda"
                  search={{ categoria: c.id }}
                  className="group relative block h-full overflow-hidden rounded-2xl shadow-[var(--shadow-e2)] ring-1 ring-[oklch(0.27_0.06_158_/_0.08)] transition-[transform,box-shadow] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:shadow-[var(--shadow-e3)]"
                >
                  <img
                    src={c.imagen}
                    alt=""
                    loading="lazy"
                    width={912}
                    height={1104}
                    className="aspect-3/4 w-full object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-selva via-selva/45 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-selva-foreground">
                    <h3 className="font-display text-2xl tracking-[-0.015em]">{c.nombre}</h3>
                    <p className="mt-1 text-sm text-selva-foreground/80">{c.claim}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-maracuya opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                      Ver productos
                      <ArrowRight className="size-3.5" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Destacados ─────────────────────────────────────────────────
            El pico del scroll. Fondo profundo para que las tarjetas blancas
            floten de verdad: sobre crema la misma sombra no se lee. */}
        <section className="relative isolate overflow-hidden bg-selva py-20 text-selva-foreground sm:py-24">
          <div
            aria-hidden="true"
            className="absolute -left-40 -top-40 size-[34rem] rounded-full bg-[radial-gradient(circle,oklch(0.82_0.16_82_/_0.12),transparent_68%)]"
          />
          <div className="relative mx-auto max-w-6xl px-4">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="max-w-xl font-display text-3xl tracking-[-0.02em] sm:text-4xl">
                Los imprescindibles de la casa
              </h2>
              <Link
                to="/tienda"
                search={{}}
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-maracuya underline-offset-4 hover:underline"
              >
                Ver todo
                <ArrowRight
                  className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {destacados.map((p, i) => (
                <Reveal key={p.id} delay={stagger(i)}>
                  <ProductCard producto={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Historia ─────────────────────────────────────────────────── */}
        <section id="historia" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20 sm:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <img
              src={historiaImg}
              alt="Manos amasando arepas en una cocina casera"
              loading="lazy"
              width={1200}
              height={912}
              className="w-full rounded-3xl object-cover shadow-[var(--shadow-e3)]"
            />
            <div>
              <h2 className="max-w-lg font-display text-3xl tracking-[-0.02em] sm:text-4xl">
                Empezó por una arepa en un piso de Madrid
              </h2>
              <p className="mt-5 max-w-prose leading-relaxed text-muted-foreground">
                MARACUYA nació de la nostalgia compartida: encontrar la harina correcta, el ají que
                sabe a casa, el dulce de leche de la abuela. Hoy traemos ese mercado a cualquier
                cocina de España, con productos originales y explicados en español claro.
              </p>
              <p className="mt-3 max-w-prose leading-relaxed text-muted-foreground">
                Probamos cada referencia antes de venderla. Si no la ponemos en nuestra mesa, no
                entra en la tienda.
              </p>
              <Button
                asChild
                className="mt-7 shadow-[var(--shadow-e1)] transition-[transform,box-shadow] duration-200 hover:shadow-[var(--shadow-e2)] active:translate-y-px"
              >
                <Link to="/tienda" search={{}}>
                  Descubrir productos
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ── Envíos ─────────────────────────────────────────────────────
            Una tabla de condiciones, no tres cajas iguales: son datos que
            se comparan entre sí, y una tabla es como se comparan. */}
        <section
          id="envios"
          className="scroll-mt-24 border-y border-border bg-arena/50 py-20 sm:py-24"
        >
          <div className="mx-auto max-w-4xl px-4">
            <h2 className="font-display text-3xl tracking-[-0.02em] sm:text-4xl">
              Envíos claros, sin sorpresas
            </h2>

            <dl className="mt-10 divide-y divide-border">
              {zonasEnvio.map((z) => (
                <div key={z.zona} className="grid gap-2 py-5 sm:grid-cols-[1fr_auto] sm:gap-8">
                  <dt className="font-display text-xl tracking-[-0.01em]">{z.zona}</dt>
                  <dd className="flex flex-wrap items-baseline gap-x-6 gap-y-1 text-sm text-muted-foreground sm:justify-end">
                    <span>{z.plazo}</span>
                    <span className="tabular font-medium text-foreground">{z.precio}</span>
                    <span>{z.gratis}</span>
                  </dd>
                </div>
              ))}
            </dl>

            <p className="mt-8 max-w-prose text-sm text-muted-foreground">
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

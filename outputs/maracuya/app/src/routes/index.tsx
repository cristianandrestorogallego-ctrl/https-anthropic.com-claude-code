import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Leaf, PackageCheck, Store, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { ProductCard } from "@/components/site/product-card";
import { HeroCarousel } from "@/components/site/hero-carousel";
import { OfertasFlash } from "@/components/site/ofertas-flash";
import { Marcas } from "@/components/site/marcas";
import { BloqueTartas } from "@/components/site/bloque-tartas";
import { Reveal, stagger } from "@/components/site/reveal";
import { banderaUrl, categorias, formatoPrecio, paises, productos, recetas } from "@/lib/catalogo";
import {
  MINIMO,
  PESO_MAXIMO,
  PESO_MAXIMO_PUNTO,
  PLAZO,
  PRECIO_DESDE,
  RECOGIDA,
  REGALO_DESDE,
  TRAMOS,
  ZONA,
  conPunto,
  etiquetaTramo,
  umbral,
} from "@/lib/envio";
import historiaImg from "@/assets/historia.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MARACUYA mercado latino | Productos latinoamericanos en España" },
      {
        name: "description",
        content: `Harinas para arepas, ajíes, jugos tropicales y dulces de América Latina. Envío a ${ZONA} en ${PLAZO} desde ${umbral(MINIMO)}, o recógelo gratis en tienda.`,
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

        <OfertasFlash />

        {/* Ventajas */}
        <section className="border-b bg-arena/60">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:grid-cols-3">
            {[
              {
                icon: Truck,
                t: `Envío ${PLAZO.replace(" laborables", "")}`,
                d: `${ZONA}, desde ${umbral(MINIMO)}`,
              },
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
              <h2 className="font-display text-3xl tracking-[-0.02em] sm:text-4xl">
                Elige por antojo
              </h2>
            </div>
            <Button asChild variant="link" className="px-0">
              <Link to="/tienda">Ver todo el catálogo →</Link>
            </Button>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categorias.map((c, i) => (
              <Reveal key={c.id} delay={stagger(i)}>
                {/* El rótulo va debajo, no encima. Las fotos de categoría
                    están llenas de producto y un degradado con el título
                    dentro tapaba justo la mitad que interesa ver. */}
                <Link
                  to="/tienda"
                  search={{ categoria: c.id }}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-e1)] ring-1 ring-[var(--ring-linea)] transition-[transform,box-shadow] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:shadow-[var(--shadow-e3)]"
                >
                  <img
                    src={c.imagen}
                    alt={c.nombre}
                    loading="lazy"
                    width={1050}
                    height={700}
                    className="aspect-3/2 w-full object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105"
                  />
                  <div className="flex flex-1 flex-col gap-1 p-5">
                    <h3 className="flex items-center gap-2 font-display text-xl tracking-[-0.012em] transition-colors duration-200 group-hover:text-primary">
                      <span aria-hidden="true" className="text-lg leading-none">
                        {c.emoji}
                      </span>
                      {c.nombre}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{c.claim}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Destacados */}
        <section className="bg-secondary/50 py-20">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="font-display text-3xl tracking-[-0.02em] sm:text-4xl">
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

        <BloqueTartas />

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

        <Marcas />

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
                Nació en Barcelona y de aquí sale a toda España
              </h2>
              <p className="mt-4 text-muted-foreground">
                MARACUYA es un mercado latino en {RECOGIDA.municipio}, en el Baix Llobregat. No es
                un catálogo sin sitio: hay una dirección, y quien la tenga cerca puede venir a
                recoger su pedido sin pagar envío y sin pedido mínimo.
              </p>
              <p className="mt-3 text-muted-foreground">
                La idea no hace falta adornarla: encontrar la harina correcta, el ají que sabe a
                casa y el dulce de leche de la abuela. Los traemos de {paises.length} países y los
                explicamos en español claro.
              </p>
              {/* Esta regla no es un eslogan: es la que parte la tienda en dos.
                  Explica por qué los congelados y las tartas tienen formulario
                  propio en vez de botón de comprar, y por qué hay una zona de
                  reparto. Si algún día cambia, cambian también esas páginas. */}
              <p className="mt-3 text-muted-foreground">
                Con una regla que nos marca el resto:{" "}
                <strong className="font-medium text-foreground">
                  lo que no puede viajar, no viaja
                </strong>
                . Los congelados y las tartas se entregan en mano aquí, en la provincia de
                Barcelona, porque la paquetería no tiene cadena de frío. Lo demás sale por
                mensajería a {ZONA}.
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
            <h2 className="font-display text-3xl tracking-[-0.02em] sm:text-4xl">
              Envíos claros, sin sorpresas
            </h2>
            <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">
              Enviamos a {ZONA}. Nada más, y lo decimos aquí para que nadie llegue al pago y se
              lleve el chasco.
            </p>

            <dl className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { t: "Plazo", d: PLAZO },
                { t: "Envío", d: `Desde ${formatoPrecio(PRECIO_DESDE)}` },
                { t: "Pedido mínimo", d: umbral(MINIMO) },
                { t: "Regalo", d: `Desde ${umbral(REGALO_DESDE)}` },
              ].map((e) => (
                <div
                  key={e.t}
                  className="rounded-2xl bg-card p-6 shadow-[var(--shadow-e1)] ring-1 ring-[var(--ring-linea)]"
                >
                  <dt className="text-sm font-medium text-muted-foreground">{e.t}</dt>
                  <dd className="mt-1 font-display text-2xl tracking-[-0.015em]">{e.d}</dd>
                </div>
              ))}
            </dl>

            {/* El precio del envío depende del peso y de a dónde va, y
                decir solo "desde 4,99 €" deja al cliente adivinando. Aquí
                está la tabla entera: en el pago solo verá la línea que le
                toque, así que este es el único sitio donde puede cuadrarlo
                antes de comprar. */}
            <div className="mt-6 overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-e1)] ring-1 ring-[var(--ring-linea)]">
              <p className="border-b px-6 py-4 text-sm leading-relaxed text-muted-foreground">
                El envío va por peso, porque es lo que cobra el transportista. Dejarlo en un punto
                de recogida cuesta menos que subirlo a tu casa, y esa diferencia te la pasamos a ti.
                Lo verás calculado en la cesta antes de pagar.
              </p>
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">
                    <th scope="col" className="px-4 py-3 font-medium sm:px-6">
                      Peso
                    </th>
                    <th scope="col" className="px-2 py-3 text-right font-medium sm:px-3">
                      Punto de recogida
                    </th>
                    <th scope="col" className="px-4 py-3 text-right font-medium sm:px-6">
                      A domicilio
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {TRAMOS.map((tramo, i) => (
                    <tr key={tramo.hasta}>
                      <th
                        scope="row"
                        className="px-4 py-3 text-sm font-normal text-muted-foreground sm:px-6"
                      >
                        {etiquetaTramo(tramo, TRAMOS[i - 1])}
                      </th>
                      {/* Por encima de los 10 kg no hay punto de recogida: el
                          guion lo dice sin repetir el motivo en cada fila, y
                          el pie de la tabla lo explica una vez. */}
                      <td className="tabular px-2 py-3 text-right font-display text-lg sm:px-3">
                        {conPunto(tramo) ? (
                          formatoPrecio(tramo.punto)
                        ) : (
                          <span className="text-muted-foreground/50">
                            <span aria-hidden="true">—</span>
                            <span className="sr-only">No disponible</span>
                          </span>
                        )}
                      </td>
                      <td className="tabular px-4 py-3 text-right font-display text-lg sm:px-6">
                        {formatoPrecio(tramo.domicilio)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="border-t px-6 py-4 text-sm leading-relaxed text-muted-foreground">
                A partir de {PESO_MAXIMO_PUNTO} kg solo llevamos a domicilio: esa caja ya no se
                lleva a pie desde el punto de recogida hasta casa.
              </p>
            </div>

            {/* La recogida va aparte y destacada: es la única forma de no
                pagar envío, no tiene mínimo, y a la tienda no le cuesta
                nada. Merece más sitio que una línea en la tabla. */}
            <div className="mt-6 flex items-start gap-4 rounded-2xl bg-maracuya/15 p-6 ring-1 ring-maracuya/30">
              <Store className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <p className="font-display text-xl tracking-[-0.015em]">
                  O recógelo en nuestra tienda, gratis y sin mínimo
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {RECOGIDA.calle}, {RECOGIDA.municipio} ({RECOGIDA.cp}). Normalmente listo en{" "}
                  {RECOGIDA.listoEn}: te avisamos por correo cuando lo esté.
                </p>
                {/* Dos cosas de la misma página se llaman "recogida" y no son
                    lo mismo: el punto de la tabla lo cobra el transportista,
                    este mostrador no cobra nada. Si no se dice, se confunden. */}
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Es nuestro mostrador, no un punto de recogida de mensajería: aquí no se paga
                  envío.
                </p>
              </div>
            </div>

            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              <strong className="font-medium text-foreground">
                Todavía no llegamos a Baleares, Canarias, Ceuta ni Melilla.
              </strong>{" "}
              Por encima de {PESO_MAXIMO} kg harían falta dos bultos y todavía no está montado:
              escríbenos y lo resolvemos a mano. Los plazos y precios son una propuesta inicial: los
              ajustamos contigo antes de publicar la tienda.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

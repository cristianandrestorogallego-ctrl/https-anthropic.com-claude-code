import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, Flame } from "lucide-react";
import { z } from "zod";

import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Reveal, stagger } from "@/components/site/reveal";
import { banderaUrl, paisPorId, paises, recetas, tiposReceta, type PaisId } from "@/lib/catalogo";

const PAISES_RECETA = paises.map((p) => p.id) as [string, ...string[]];

/** Los filtros viven en la URL, como en la tienda: un enlace se comparte. */
const busquedaRecetas = z.object({
  tipo: z.enum(tiposReceta).optional(),
  pais: z.enum(PAISES_RECETA).optional(),
});

export const Route = createFileRoute("/recetas")({
  validateSearch: busquedaRecetas,
  head: () => ({
    meta: [
      { title: "Cocina con MARACUYA | Recetas latinas y sus ingredientes" },
      {
        name: "description",
        content:
          "Recetas de América Latina con los ingredientes calculados por raciones: sabes cuántos envases necesitas antes de comprar.",
      },
      { property: "og:title", content: "Cocina con MARACUYA" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Recetas,
});

function Recetas() {
  const { tipo, pais: paisBruto } = Route.useSearch();
  // El esquema ya lo limitó a los ids de `paises`; aquí solo se nombra.
  const pais = paisBruto as PaisId | undefined;
  const lista = recetas.filter((r) => (!tipo || r.tipo === tipo) && (!pais || r.pais === pais));
  const filtrado = Boolean(tipo || pais);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="font-display text-4xl tracking-[-0.025em] sm:text-5xl">
          Cocina con MARACUYA
        </h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
          Elige el plato, ajusta las raciones y te decimos exactamente qué envases necesitas comprar
          y qué pones tú de tu cocina. Sin listas de la compra a ojo.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          <Link
            to="/recetas"
            search={{}}
            className={`rounded-full px-3.5 py-1.5 text-sm transition-colors duration-200 ${
              filtrado
                ? "bg-secondary text-secondary-foreground hover:bg-arena"
                : "bg-primary text-primary-foreground"
            }`}
          >
            Todas
          </Link>
          {tiposReceta.map((t) => (
            <Link
              key={t}
              to="/recetas"
              search={pais ? { tipo: t, pais } : { tipo: t }}
              className={`rounded-full px-3.5 py-1.5 text-sm transition-colors duration-200 ${
                tipo === t
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-arena"
              }`}
            >
              {t}
            </Link>
          ))}
          {pais && (
            <Link
              to="/recetas"
              search={tipo ? { tipo } : {}}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-3.5 py-1.5 text-sm text-primary-foreground"
            >
              <img
                src={banderaUrl(paisPorId(pais).codigo)}
                alt=""
                width={20}
                height={14}
                className="h-3.5 w-5 rounded-[2px] object-cover"
              />
              {paisPorId(pais).nombre}
              <span aria-hidden="true">×</span>
              <span className="sr-only">Quitar el filtro de país</span>
            </Link>
          )}
        </div>

        {lista.length === 0 ? (
          <p className="mt-12 rounded-2xl bg-card p-8 text-center text-muted-foreground shadow-[var(--shadow-e1)] ring-1 ring-[var(--ring-linea)]">
            Todavía no hay recetas con ese filtro.{" "}
            <Link
              to="/recetas"
              search={{}}
              className="text-primary underline-offset-4 hover:underline"
            >
              Ver todas
            </Link>
            .
          </p>
        ) : null}

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {lista.map((r, i) => {
            const pais = paisPorId(r.pais);
            return (
              <Reveal key={r.slug} delay={stagger(i)}>
                <Link
                  to="/receta/$slug"
                  params={{ slug: r.slug }}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl bg-card text-card-foreground shadow-[var(--shadow-e1)] ring-1 ring-[var(--ring-linea)] transition-[transform,box-shadow] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:shadow-[var(--shadow-e3)]"
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-arena">
                    <img
                      src={r.imagen}
                      alt=""
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.06]"
                    />
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-background/92 px-3 py-1 text-xs font-medium shadow-[var(--shadow-e1)] backdrop-blur">
                      <img
                        src={banderaUrl(pais.codigo)}
                        alt=""
                        width={20}
                        height={14}
                        className="h-3.5 w-5 rounded-[2px] object-cover"
                      />
                      {pais.nombre}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <h2 className="font-display text-xl leading-snug tracking-[-0.012em]">
                      {r.nombre}
                    </h2>
                    <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {r.resumen}
                    </p>
                    <p className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-3 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="size-4" aria-hidden="true" />
                        <span className="tabular">{r.minutos} min</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Flame className="size-4" aria-hidden="true" />
                        {r.dificultad}
                      </span>
                      <span className="tabular">{r.racionesBase} raciones</span>
                    </p>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}

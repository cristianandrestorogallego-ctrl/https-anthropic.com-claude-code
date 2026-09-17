import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { ProductCard } from "@/components/site/product-card";
import { Reveal, stagger } from "@/components/site/reveal";
import { categorias, productos } from "@/lib/catalogo";

const CATEGORIA_IDS = ["despensa", "salsas", "bebidas", "dulces"] as const;

// El filtro vive en la URL, no en useState: así la portada puede enlazar
// directamente a un pasillo del mercado y el enlace se puede compartir.
const tiendaSearchSchema = z.object({
  categoria: z.enum(CATEGORIA_IDS).optional(),
});

export const Route = createFileRoute("/tienda")({
  validateSearch: tiendaSearchSchema,
  head: () => ({
    meta: [
      { title: "Tienda online de productos latinos | MARACUYA mercado latino" },
      {
        name: "description",
        content:
          "Harinas, ajíes, jugos tropicales y dulces de América Latina con envío a toda España en 24-72 h.",
      },
      { property: "og:title", content: "Tienda online de productos latinos | MARACUYA" },
      {
        property: "og:description",
        content:
          "Catálogo de despensa, salsas, bebidas y dulces latinoamericanos seleccionados para España.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Tienda,
});

function Tienda() {
  const { categoria } = Route.useSearch();
  const lista = categoria ? productos.filter((p) => p.categoria === categoria) : productos;
  const activa = categoria ? categorias.find((c) => c.id === categoria) : undefined;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="font-display text-4xl tracking-[-0.025em] sm:text-5xl">
          {activa ? activa.nombre : "El mercado completo"}
        </h1>
        <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
          {activa
            ? activa.claim
            : "Una selección corta y honesta: solo entran los productos que usamos en nuestra propia cocina."}
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          <Button asChild variant={categoria ? "outline" : "default"} size="sm">
            <Link to="/tienda" search={{}}>
              Todos
            </Link>
          </Button>
          {categorias.map((c) => (
            <Button
              key={c.id}
              asChild
              variant={categoria === c.id ? "default" : "outline"}
              size="sm"
            >
              <Link to="/tienda" search={{ categoria: c.id }}>
                {c.nombre}
              </Link>
            </Button>
          ))}
        </div>

        <p className="tabular mt-6 text-sm text-muted-foreground">
          {lista.length === 1 ? "1 producto" : `${lista.length} productos`}
        </p>

        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {lista.map((p, i) => (
            <Reveal key={p.id} delay={stagger(i)}>
              <ProductCard producto={p} />
            </Reveal>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

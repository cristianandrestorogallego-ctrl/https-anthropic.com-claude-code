import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { ProductCard } from "@/components/site/product-card";
import { categorias, productos, type Categoria } from "@/lib/catalogo";

export const Route = createFileRoute("/tienda")({
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
  const [filtro, setFiltro] = useState<Categoria | "todos">("todos");
  const lista = filtro === "todos" ? productos : productos.filter((p) => p.categoria === filtro);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Catálogo</p>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl">El mercado completo</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Una selección corta y honesta: solo entran los productos que usamos en nuestra
          propia cocina.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          <Button
            variant={filtro === "todos" ? "default" : "outline"}
            size="sm"
            onClick={() => setFiltro("todos")}
          >
            Todos
          </Button>
          {categorias.map((c) => (
            <Button
              key={c.id}
              variant={filtro === c.id ? "default" : "outline"}
              size="sm"
              onClick={() => setFiltro(c.id)}
            >
              {c.nombre}
            </Button>
          ))}
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {lista.map((p) => (
            <ProductCard key={p.id} producto={p} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

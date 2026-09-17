import { useCallback, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import heroMesa from "@/assets/hero-mesa.jpg";
import heroMercado from "@/assets/hero-mercado.jpg";
import heroPlatos from "@/assets/hero-platos.jpg";

const slides = [
  {
    imagen: heroMesa,
    alt: "Mesa latina con arepas, ajíes, maracuyá y jugos tropicales",
    titulo: "Los sabores de Latinoamérica, cerca de ti",
    texto:
      "Harinas, ajíes, jugos y dulces seleccionados para cocinar como en casa, sin buscar de tienda en tienda.",
  },
  {
    imagen: heroMercado,
    alt: "Puesto de mercado latino con frutas tropicales y productos de despensa",
    titulo: "El mercado latino, en tu cocina",
    texto: "Despensa, snacks y bebidas por categorías y por país, fáciles de encontrar.",
  },
  {
    imagen: heroPlatos,
    alt: "Platos latinos: arepas, empanadas, ceviche y jugo de maracuyá",
    titulo: "Cocina con MARACUYA",
    texto: "Recetas paso a paso y los ingredientes del catálogo, listos para añadir a la cesta.",
  },
];

export function HeroCarousel() {
  const [activo, setActivo] = useState(0);
  const [pausado, setPausado] = useState(false);

  const ir = useCallback((delta: number) => {
    setActivo((prev) => (prev + delta + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (pausado) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const id = window.setInterval(() => ir(1), 6000);
    return () => window.clearInterval(id);
  }, [ir, pausado]);

  return (
    <section
      className="relative isolate overflow-hidden bg-selva text-selva-foreground"
      aria-roledescription="carrusel"
      aria-label="Destacados de MARACUYA"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
    >
      {slides.map((s, i) => (
        <img
          key={s.imagen}
          src={s.imagen}
          alt={s.alt}
          width={1600}
          height={1104}
          aria-hidden={i !== activo}
          className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ${
            i === activo ? "opacity-55" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-selva via-selva/85 to-transparent" />

      <div className="relative mx-auto grid max-w-6xl gap-6 px-4 py-20 sm:py-28">
        <h1 className="max-w-2xl text-balance-title font-display text-4xl leading-[1.05] sm:text-6xl">
          {slides[activo]?.titulo}
        </h1>
        <p className="max-w-lg text-base opacity-90 sm:text-lg">{slides[activo]?.texto}</p>

        <div className="flex flex-wrap gap-3">
          <Button
            asChild
            size="lg"
            className="bg-maracuya text-maracuya-foreground hover:bg-maracuya/90"
          >
            <Link to="/tienda">Explorar productos</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/40 bg-transparent text-selva-foreground hover:bg-white/10 hover:text-selva-foreground"
          >
            <a href="#ofertas">Ver ofertas</a>
          </Button>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <Button
            size="icon"
            variant="outline"
            aria-label="Imagen anterior"
            className="size-9 border-white/40 bg-transparent text-selva-foreground hover:bg-white/10 hover:text-selva-foreground"
            onClick={() => ir(-1)}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            aria-label="Imagen siguiente"
            className="size-9 border-white/40 bg-transparent text-selva-foreground hover:bg-white/10 hover:text-selva-foreground"
            onClick={() => ir(1)}
          >
            <ChevronRight className="size-4" />
          </Button>
          <div className="flex gap-2">
            {slides.map((s, i) => (
              <button
                key={s.titulo}
                type="button"
                aria-label={`Ir a la imagen ${i + 1}`}
                aria-current={i === activo}
                onClick={() => setActivo(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === activo ? "w-8 bg-maracuya" : "w-3 bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

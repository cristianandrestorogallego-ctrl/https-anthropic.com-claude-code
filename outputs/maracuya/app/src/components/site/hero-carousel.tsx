import { useCallback, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import heroMesa from "@/assets/hero-mesa.jpg";
import heroMercado from "@/assets/hero-mercado.jpg";
import heroPlatos from "@/assets/hero-platos.jpg";

type Accion =
  | { etiqueta: string; to: "/recetas" }
  | { etiqueta: string; to: "/tienda"; oferta?: true }
  | { etiqueta: string; href: string };

/** El destino, ya estrechado a una ruta concreta. */
function Destino({
  accion,
  children,
  className,
}: {
  accion: Accion;
  children: React.ReactNode;
  className?: string;
}) {
  if ("href" in accion) {
    return (
      <a href={accion.href} className={className}>
        {children}
      </a>
    );
  }
  if (accion.to === "/tienda") {
    return (
      <Link to="/tienda" search={accion.oferta ? { oferta: true } : {}} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <Link to="/recetas" search={{}} className={className}>
      {children}
    </Link>
  );
}

/**
 * El hero.
 *
 * Dos decisiones que lo separan de la versión anterior:
 *
 * 1. La fotografía va a opacidad plena. Antes se atenuaba al 55 % para que
 *    el texto encima se leyera, lo que desperdicia el mejor material que
 *    tiene la tienda. Ahora el texto vive en un panel opaco propio y la
 *    comida se ve como comida.
 * 2. Abre la receta, no el catálogo. "Los sabores de Latinoamérica" lo
 *    puede decir cualquiera; "dinos el plato y te mandamos los envases"
 *    no lo dice nadie más en España.
 */
const slides: {
  imagen: string;
  alt: string;
  titulo: string;
  texto: string;
  principal: Accion;
  secundario: Accion;
}[] = [
  {
    imagen: heroPlatos,
    alt: "Arepas, empanadas y ceviche servidos en una mesa",
    titulo: "Dinos el plato. Nosotros contamos los envases.",
    texto:
      "Eliges la receta y para cuántos sois. Te decimos qué comprar, cuánto sobra de cada envase y qué pones tú de tu cocina.",
    principal: { etiqueta: "Elegir una receta", to: "/recetas" },
    secundario: { etiqueta: "Ver el catálogo", to: "/tienda" },
  },
  {
    imagen: heroMesa,
    alt: "Mesa latina con arepas, ajíes, maracuyá y jugos tropicales",
    titulo: "La despensa que echabas de menos",
    texto:
      "Harinas para arepas, ajíes, jugos tropicales y dulces. Una selección corta: solo lo que cocinamos nosotros.",
    principal: { etiqueta: "Explorar productos", to: "/tienda" },
    secundario: { etiqueta: "Ver ofertas", to: "/tienda", oferta: true },
  },
  {
    imagen: heroMercado,
    alt: "Puesto de mercado latino con frutas tropicales y productos de despensa",
    titulo: "Ocho países en el mismo estante",
    texto:
      "Colombia, México, Perú, Venezuela, Ecuador, Brasil, Argentina y Paraguay. Cada producto dice de dónde viene.",
    principal: { etiqueta: "Comprar por país", href: "/#paises" },
    secundario: { etiqueta: "Ver el catálogo", to: "/tienda" },
  },
];

function AccionBoton({
  accion,
  variante,
}: {
  accion: Accion;
  variante: "principal" | "secundario";
}) {
  const clases =
    variante === "principal"
      ? "bg-maracuya text-maracuya-foreground shadow-[var(--shadow-e2)] transition-[transform,box-shadow] duration-200 hover:bg-maracuya/90 hover:shadow-[var(--shadow-e3)] active:translate-y-px"
      : "border-primary-foreground/35 bg-transparent text-primary-foreground transition-colors duration-200 hover:bg-primary-foreground/10 hover:text-primary-foreground";

  const contenido = (
    <>
      {accion.etiqueta}
      {variante === "principal" && (
        <ArrowRight
          className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      )}
    </>
  );

  return (
    <Button
      asChild
      size="lg"
      variant={variante === "principal" ? "default" : "outline"}
      className={`group w-full gap-2 sm:w-auto ${clases}`}
    >
      <Destino accion={accion}>{contenido}</Destino>
    </Button>
  );
}

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
    // Hay texto que leer, no solo una imagen que mirar.
    const id = window.setInterval(() => ir(1), 7500);
    return () => window.clearInterval(id);
  }, [ir, pausado]);

  const slide = slides[activo] ?? slides[0]!;

  return (
    <section
      className="relative isolate bg-background text-primary-foreground lg:bg-primary"
      aria-roledescription="carrusel"
      aria-label="Qué hace MARACUYA"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocusCapture={() => setPausado(true)}
      onBlurCapture={() => setPausado(false)}
    >
      {/* La foto: a pantalla completa en escritorio, en su propio bloque en
          móvil para que el panel no se la coma. */}
      <div className="relative aspect-4/3 w-full sm:aspect-21/9 lg:absolute lg:inset-0 lg:aspect-auto lg:h-full">
        {slides.map((s, i) => (
          <img
            key={s.imagen}
            src={s.imagen}
            alt={i === activo ? s.alt : ""}
            width={1600}
            height={1104}
            loading={i === 0 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : "auto"}
            aria-hidden={i !== activo}
            className={`absolute inset-0 size-full object-cover transition-opacity duration-[900ms] ease-[var(--ease-out-expo)] ${
              i === activo ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        {/* En escritorio el panel se apoya sobre la foto; este velo por la
            izquierda evita que el borde del panel corte en seco. */}
        <div
          className="pointer-events-none absolute inset-0 hidden lg:block bg-[linear-gradient(90deg,var(--primary)_0%,var(--primary)_27%,color-mix(in_oklab,var(--primary)_78%,transparent)_45%,transparent_72%)]"
          aria-hidden="true"
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 lg:px-4">
        <div className="-mt-12 rounded-3xl bg-primary p-6 shadow-[var(--shadow-e3)] ring-1 ring-primary-foreground/10 sm:-mt-16 sm:p-9 lg:mt-0 lg:max-w-2xl lg:rounded-none lg:bg-transparent lg:p-0 lg:py-24 lg:shadow-none lg:ring-0">
          <div key={activo} className="mrc-rise">
            <h1 className="text-balance-title font-display text-[clamp(1.9rem,5.2vw,3.6rem)] leading-[1.04] tracking-[-0.03em]">
              {slide.titulo}
            </h1>
            <p className="mt-4 max-w-lg text-[0.98rem] leading-relaxed text-primary-foreground/85 sm:text-lg">
              {slide.texto}
            </p>
            <div className="mt-7 grid gap-3 sm:flex sm:flex-wrap">
              <AccionBoton accion={slide.principal} variante="principal" />
              <AccionBoton accion={slide.secundario} variante="secundario" />
            </div>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <Button
              size="icon"
              variant="outline"
              aria-label="Anterior"
              className="size-9 border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              onClick={() => ir(-1)}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              aria-label="Siguiente"
              className="size-9 border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              onClick={() => ir(1)}
            >
              <ChevronRight className="size-4" />
            </Button>
            <div className="flex gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.titulo}
                  type="button"
                  aria-label={s.titulo}
                  aria-current={i === activo}
                  onClick={() => setActivo(i)}
                  className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ease-[var(--ease-out-expo)] ${
                    i === activo ? "w-8 bg-maracuya" : "w-3 bg-primary-foreground/35"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

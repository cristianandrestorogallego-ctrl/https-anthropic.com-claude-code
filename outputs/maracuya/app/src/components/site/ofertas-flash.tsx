import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight, Timer, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatoPrecio, ofertasVivas, porcentajeDescuento } from "@/lib/catalogo";

/** Lo que queda, ya partido en horas, minutos y segundos. */
function restante(hasta: string, ahora: number) {
  const ms = new Date(hasta).getTime() - ahora;
  if (ms <= 0) return null;
  const total = Math.floor(ms / 1000);
  return {
    dias: Math.floor(total / 86400),
    horas: Math.floor((total % 86400) / 3600),
    minutos: Math.floor((total % 3600) / 60),
    segundos: total % 60,
  };
}

const dosDigitos = (n: number) => String(n).padStart(2, "0");

function Cifra({ valor, unidad }: { valor: number; unidad: string }) {
  return (
    <span className="inline-flex items-baseline gap-1">
      <span className="tabular text-base font-semibold sm:text-lg">{dosDigitos(valor)}</span>
      <span className="text-[0.7rem] opacity-70">{unidad}</span>
    </span>
  );
}

/**
 * Ofertas flash.
 *
 * El reloj sale de la fecha de fin de cada oferta, no de un temporizador
 * inventado que se reinicia en cada visita. Si la fecha pasa, la oferta
 * desaparece de la lista sola: prefiero que la sección se quede vacía a que
 * mienta sobre una urgencia que no existe.
 */
export function OfertasFlash() {
  const [ahora, setAhora] = useState<number | null>(null);
  const [activo, setActivo] = useState(0);

  // El reloj arranca después de montar: en el servidor no hay "ahora" que
  // valga y una cuenta atrás renderizada allí se desincroniza al hidratar.
  useEffect(() => {
    setAhora(Date.now());
    const id = window.setInterval(() => setAhora(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const ofertas = useMemo(() => ofertasVivas(ahora ? new Date(ahora) : undefined), [ahora]);

  useEffect(() => {
    if (activo >= ofertas.length) setActivo(0);
  }, [activo, ofertas.length]);

  if (ofertas.length === 0) return null;

  const oferta = ofertas[Math.min(activo, ofertas.length - 1)]!;
  const cuenta = ahora ? restante(oferta.ofertaHasta!, ahora) : null;
  const descuento = porcentajeDescuento(oferta);
  const ir = (delta: number) =>
    setActivo((prev) => (prev + delta + ofertas.length) % ofertas.length);

  return (
    <section
      id="ofertas"
      aria-label="Ofertas flash"
      className="relative isolate scroll-mt-24 overflow-hidden bg-primary text-primary-foreground"
    >
      <img
        key={oferta.id}
        src={oferta.imagen}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 size-full object-cover"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(90deg,var(--primary)_0%,var(--primary)_32%,color-mix(in_oklab,var(--primary)_80%,transparent)_52%,color-mix(in_oklab,var(--primary)_35%,transparent)_100%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex max-w-6xl items-center gap-4 px-4 py-12 sm:py-16">
        <Button
          size="icon"
          variant="outline"
          aria-label="Oferta anterior"
          className="hidden size-9 shrink-0 border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground sm:inline-flex"
          onClick={() => ir(-1)}
        >
          <ChevronLeft className="size-4" />
        </Button>

        <div key={oferta.id} className="mrc-rise min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-maracuya px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-maracuya-foreground">
              <Zap className="size-3.5" aria-hidden="true" />
              Oferta flash
            </span>
            {cuenta ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-[color-mix(in_oklab,var(--foreground)_55%,transparent)] px-3 py-1.5">
                <Timer className="size-3.5 shrink-0" aria-hidden="true" />
                <span className="text-[0.7rem] uppercase tracking-[0.08em] opacity-80">
                  Termina en
                </span>
                {cuenta.dias > 0 && <Cifra valor={cuenta.dias} unidad="d" />}
                <Cifra valor={cuenta.horas} unidad="h" />
                <Cifra valor={cuenta.minutos} unidad="min" />
                <Cifra valor={cuenta.segundos} unidad="s" />
              </span>
            ) : (
              // Reserva el alto exacto: sin esto, el reloj empuja el titular
              // hacia abajo en cuanto hidrata.
              <span className="inline-block h-[34px]" aria-hidden="true" />
            )}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-4">
            {descuento > 0 && (
              <span className="rounded-2xl bg-maracuya px-4 py-2 font-display text-3xl font-semibold text-maracuya-foreground shadow-[var(--shadow-e2)] sm:text-4xl">
                −{descuento}%
              </span>
            )}
            <h2 className="font-display text-[clamp(1.6rem,4vw,2.6rem)] leading-tight tracking-[-0.025em]">
              {oferta.nombre}
            </h2>
          </div>

          <p className="mt-3 max-w-xl leading-relaxed text-primary-foreground/85">
            {oferta.descripcion}
          </p>

          <p className="mt-4 flex items-baseline gap-3">
            <span className="tabular font-display text-2xl">{formatoPrecio(oferta.precio)}</span>
            <span className="tabular text-primary-foreground/60 line-through">
              {formatoPrecio(oferta.precioAnterior!)}
            </span>
            <span className="text-sm text-primary-foreground/70">{oferta.formato}</span>
          </p>

          <div className="mt-7 grid gap-3 sm:flex sm:flex-wrap">
            <Button
              asChild
              size="lg"
              className="group w-full gap-2 bg-maracuya text-maracuya-foreground shadow-[var(--shadow-e2)] transition-[transform,box-shadow] duration-200 hover:bg-maracuya/90 hover:shadow-[var(--shadow-e3)] active:translate-y-px sm:w-auto"
            >
              <Link to="/producto/$id" params={{ id: oferta.id }}>
                Ver la oferta
                <ArrowRight
                  className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full border-primary-foreground/35 bg-transparent text-primary-foreground transition-colors duration-200 hover:bg-primary-foreground/10 hover:text-primary-foreground sm:w-auto"
            >
              <Link to="/tienda" search={{ oferta: true }}>
                Ver todas las ofertas
              </Link>
            </Button>
          </div>

          {ofertas.length > 1 && (
            <div className="mt-7 flex items-center gap-3">
              <Button
                size="icon"
                variant="outline"
                aria-label="Oferta anterior"
                className="size-9 border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground sm:hidden"
                onClick={() => ir(-1)}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                aria-label="Oferta siguiente"
                className="size-9 border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground sm:hidden"
                onClick={() => ir(1)}
              >
                <ChevronRight className="size-4" />
              </Button>
              <div className="flex gap-2">
                {ofertas.map((o, i) => (
                  <button
                    key={o.id}
                    type="button"
                    aria-label={o.nombre}
                    aria-current={i === activo}
                    onClick={() => setActivo(i)}
                    className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ease-[var(--ease-out-expo)] ${
                      i === activo ? "w-8 bg-maracuya" : "w-3 bg-primary-foreground/35"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <Button
          size="icon"
          variant="outline"
          aria-label="Oferta siguiente"
          className="hidden size-9 shrink-0 border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground sm:inline-flex"
          onClick={() => ir(1)}
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </section>
  );
}

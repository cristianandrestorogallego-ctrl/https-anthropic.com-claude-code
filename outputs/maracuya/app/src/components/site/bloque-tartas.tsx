import { Link } from "@tanstack/react-router";
import { ArrowRight, CakeSlice, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * El bloque de tartas en la portada.
 *
 * Dice de entrada las dos cosas que evitan un viaje en balde: que es bajo
 * presupuesto y que solo se sirve en la provincia de Barcelona. Esconder la
 * limitación hasta el formulario sería ganar un clic y perder la confianza.
 */
export function BloqueTartas() {
  return (
    <section id="tartas" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:py-20">
      <div className="overflow-hidden rounded-3xl bg-primary text-primary-foreground shadow-[var(--shadow-e3)]">
        <div className="grid items-center gap-8 p-7 sm:p-10 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
          <div>
            <h2 className="font-display text-[clamp(1.7rem,3.6vw,2.6rem)] leading-tight tracking-[-0.025em]">
              Tartas personalizadas, por encargo
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-primary-foreground/85">
              Cumpleaños, bautizos, la que te apetezca. Nos cuentas las raciones, el sabor y la
              fecha, y te pasamos presupuesto. Sin compromiso.
            </p>

            <p className="mt-5 flex items-start gap-2.5 text-sm leading-relaxed text-primary-foreground/80">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>
                Servicio disponible únicamente en la provincia de Barcelona. Precio y fecha sujetos
                a confirmación.
              </span>
            </p>

            <Button
              asChild
              size="lg"
              className="group mt-7 w-full gap-2 bg-maracuya text-maracuya-foreground shadow-[var(--shadow-e2)] transition-[transform,box-shadow] duration-200 hover:bg-maracuya/90 hover:shadow-[var(--shadow-e3)] active:translate-y-px sm:w-auto"
            >
              <Link to="/tartas" search={{}}>
                Ver tartas y pedir presupuesto
                <ArrowRight
                  className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </Button>
          </div>

          <ul className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {[
              { t: "Tú eliges", d: "Raciones, sabor, relleno y temática" },
              { t: "Con tu foto", d: "Súbenos la referencia que tengas" },
              { t: "Presupuesto", d: "Te respondemos con precio y fecha" },
            ].map((x) => (
              <li
                key={x.t}
                className="flex items-start gap-3 rounded-2xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/15"
              >
                <CakeSlice className="mt-0.5 size-5 shrink-0 text-maracuya" aria-hidden="true" />
                <div>
                  <p className="font-medium">{x.t}</p>
                  <p className="text-sm text-primary-foreground/75">{x.d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

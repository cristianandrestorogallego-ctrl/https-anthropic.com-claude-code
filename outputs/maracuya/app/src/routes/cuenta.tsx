import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Heart, Info, KeyRound, MapPin, Package, Truck, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Reveal, stagger } from "@/components/site/reveal";
import { CUENTAS_CONECTADAS, QUE_FALTA_CUENTA, ventajas } from "@/lib/cuenta";

export const Route = createFileRoute("/cuenta")({
  head: () => ({
    meta: [
      { title: "Tu cuenta | MARACUYA mercado latino" },
      {
        name: "description",
        content:
          "Entra en tu cuenta de MARACUYA para ver tus pedidos, seguir tus envíos y guardar tus direcciones.",
      },
    ],
  }),
  component: Cuenta,
});

const ICONOS: Record<string, LucideIcon> = {
  pedidos: Package,
  seguimiento: Truck,
  direcciones: MapPin,
  deseos: Heart,
};

function Cuenta() {
  const [correo, setCorreo] = useState("");
  const [enviado, setEnviado] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <section className="border-b bg-arena/50">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
            <h1 className="max-w-3xl font-display text-[clamp(2rem,5vw,3.4rem)] leading-[1.05] tracking-[-0.03em]">
              Tu cuenta
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Para tener a mano lo que has pedido, seguir tus envíos y no volver a escribir tu
              dirección cada vez.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:py-20 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-16">
          {/* Entrar */}
          <div>
            <div className="rounded-2xl bg-card p-6 shadow-[var(--shadow-e2)] ring-1 ring-[var(--ring-linea)]">
              {enviado ? (
                <div role="status">
                  <h2 className="font-display text-2xl tracking-[-0.02em]">
                    {CUENTAS_CONECTADAS ? "Mira tu correo" : "Así se vería al entrar"}
                  </h2>
                  {CUENTAS_CONECTADAS ? (
                    <p className="mt-3 leading-relaxed text-muted-foreground">
                      Te hemos enviado un código de seis cifras a{" "}
                      <span className="font-medium text-foreground">{correo}</span>. Escríbelo aquí
                      y entras.
                    </p>
                  ) : (
                    <>
                      <p className="mt-3 leading-relaxed text-muted-foreground">
                        <strong className="font-medium text-foreground">
                          Esto es una demostración: no se ha creado ninguna cuenta ni se ha enviado
                          ningún código.
                        </strong>{" "}
                        La pantalla está entera, pero todavía no hay nada detrás.
                      </p>
                      <ul className="mt-4 grid gap-2 text-sm text-muted-foreground">
                        {QUE_FALTA_CUENTA.map((f) => (
                          <li key={f} className="flex gap-2">
                            <span aria-hidden="true">·</span>
                            {f}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  <Button variant="outline" className="mt-6" onClick={() => setEnviado(false)}>
                    Volver
                  </Button>
                </div>
              ) : (
                <form
                  className="grid gap-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setEnviado(true);
                  }}
                >
                  <h2 className="font-display text-2xl tracking-[-0.02em]">Entrar o registrarse</h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Con tu correo basta. Si es la primera vez, la cuenta se crea al entrar.
                  </p>

                  <div className="grid gap-1.5">
                    <Label htmlFor="correo-cuenta">
                      Correo electrónico <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="correo-cuenta"
                      name="correo"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="tunombre@correo.com"
                      value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    Continuar
                  </Button>

                  {/* Sin contraseña, y conviene decir por qué: quita el miedo
                      a "otra cuenta más con otra clave que apuntar". */}
                  <p className="flex items-start gap-2 rounded-lg bg-arena p-3 text-xs leading-relaxed text-muted-foreground">
                    <KeyRound className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                    <span>
                      Sin contraseña. Te enviamos un código de un solo uso a tu correo: no hay nada
                      que memorizar, ni nada que se pueda filtrar.
                    </span>
                  </p>
                </form>
              )}
            </div>

            {!CUENTAS_CONECTADAS && (
              <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span>
                  Las cuentas se activarán al conectar la tienda con Shopify. Hasta entonces esta
                  página no guarda ningún dato.
                </span>
              </p>
            )}
          </div>

          {/* Qué tendrás dentro */}
          <div>
            <h2 className="font-display text-3xl tracking-[-0.02em] sm:text-4xl">
              Qué tendrás dentro
            </h2>
            <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">
              Nada de esto funciona todavía. Es lo que traerá la cuenta cuando la tienda esté
              conectada.
            </p>

            <ul className="mt-8 grid gap-5 sm:grid-cols-2">
              {ventajas.map((v, i) => {
                const Icono = ICONOS[v.clave] ?? Package;
                return (
                  <li key={v.clave}>
                    <Reveal delay={stagger(i)}>
                      <article className="flex h-full flex-col gap-2 rounded-2xl bg-card p-5 shadow-[var(--shadow-e1)] ring-1 ring-[var(--ring-linea)]">
                        <Icono className="size-6 text-primary" aria-hidden="true" />
                        <h3 className="font-display text-lg leading-snug tracking-[-0.012em]">
                          {v.titulo}
                        </h3>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {v.descripcion}
                        </p>
                      </article>
                    </Reveal>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

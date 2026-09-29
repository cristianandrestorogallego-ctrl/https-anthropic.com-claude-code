import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Check, Info, Loader2, Snowflake } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Reveal, stagger } from "@/components/site/reveal";
import { BotonWhatsapp } from "@/components/site/boton-whatsapp";
import { CamposZona, useZona } from "@/components/site/zona";
import { CADENCIA } from "@/lib/boletin";
import { POR_QUE_SE_PIDE, productosCongelados, QUE_FALTA_CONGELADOS } from "@/lib/congelados";
import { CORREO, enlaceCorreo } from "@/lib/contacto";
import { enviarCongelados } from "@/lib/enviar-congelados";
import type { Respuesta } from "@/lib/solicitud";
import { enlaceWhatsapp } from "@/lib/whatsapp";

export const Route = createFileRoute("/congelados")({
  head: () => ({
    meta: [
      { title: "Congelados por encargo | MARACUYA mercado latino" },
      {
        name: "description",
        content:
          "Yuca, pulpas y tequeños congelados. No van por paquetería: se piden y se entregan en mano en la provincia de Barcelona.",
      },
    ],
  }),
  component: Congelados,
});

/** Lo que se enseña cuando la llamada al servidor ni siquiera vuelve. */
const SIN_RESPUESTA =
  "Algo ha fallado por el camino. Puede ser la conexión; inténtalo otra vez o usa WhatsApp.";

/** Ver `diagnostico` en el esquema: solo lo pide quien abre con ?diagnostico. */
function pidenDiagnostico(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).has("diagnostico");
}

function Congelados() {
  const z = useZona();
  const [diagnostico] = useState(pidenDiagnostico);
  const [elegidos, setElegidos] = useState<string[]>([]);
  const [detalle, setDetalle] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [quiereRecetas, setQuiereRecetas] = useState(false);
  const [consiento, setConsiento] = useState(false);
  const [envio, setEnvio] = useState<
    { fase: "quieto" } | { fase: "enviando" } | { fase: "hecho"; r: Respuesta }
  >({ fase: "quieto" });

  const hayCorreo = correo.trim() !== "";
  const listo =
    z.puedeEnviar &&
    elegidos.length > 0 &&
    nombre.trim() !== "" &&
    telefono.trim() !== "" &&
    consiento &&
    envio.fase !== "enviando";

  const alternar = (id: string) =>
    setElegidos((e) => (e.includes(id) ? e.filter((x) => x !== id) : [...e, id]));

  /** El pedido ya redactado, para la vía de WhatsApp. */
  const mensajeWhatsapp = [
    "Hola, quiero pedir congelados en MARACUYA:",
    ...elegidos
      .map((id) => productosCongelados.find((p) => p.id === id))
      .filter((p) => p !== undefined)
      .map((p) => `· ${p.nombre} (${p.formato})`),
    detalle && `\nCantidades: ${detalle}`,
    z.municipio && `\nZona: ${z.municipio} ${z.cp}`,
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Por qué esto no es un carrito. Va primero y sin rodeos: quien
            llega buscando el botón de comprar merece entender en dos
            líneas por qué no está, en vez de buscarlo por la página. */}
        <section className="border-b bg-arena/50">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
            <Reveal>
              <h1 className="flex items-center gap-3 font-display text-4xl tracking-[-0.025em] sm:text-5xl">
                <Snowflake className="size-8 shrink-0 text-primary" aria-hidden="true" />
                Congelados por encargo
              </h1>
            </Reveal>
            <Reveal delay={stagger(1)}>
              <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">
                {POR_QUE_SE_PIDE}
              </p>
            </Reveal>
            <Reveal delay={stagger(2)}>
              <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
                Pedir no te compromete a nada. Te decimos qué hay, cómo llega y cuánto cuesta el
                reparto antes de que confirmes.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
          <h2 className="font-display text-3xl tracking-[-0.02em]">¿Qué quieres?</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Marca lo que te interese. Las cantidades las ajustamos al responderte.
          </p>

          {envio.fase === "hecho" ? (
            <div
              role="status"
              className="mt-8 rounded-2xl bg-card p-6 shadow-[var(--shadow-e2)] ring-1 ring-[var(--ring-linea)]"
            >
              {envio.r.estado === "enviada" && (
                <>
                  <h3 className="flex items-center gap-2 font-display text-xl">
                    <Check className="size-5 text-primary" aria-hidden="true" />
                    Solicitud recibida
                  </h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    Te decimos qué podemos llevarte, cómo y cuándo. Nada está confirmado hasta que
                    te respondamos.
                  </p>
                  {envio.r.acuse && (
                    <p className="mt-3 leading-relaxed text-muted-foreground">
                      Te hemos mandado una copia a{" "}
                      <span className="font-medium text-foreground">{correo}</span>. Si no la ves,
                      mira en el correo no deseado.
                    </p>
                  )}
                </>
              )}

              {envio.r.estado === "sin-configurar" && (
                <>
                  <h3 className="flex items-center gap-2 font-display text-xl">
                    <Info className="size-5 text-primary" aria-hidden="true" />
                    Así se vería al enviarla
                  </h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    <strong className="font-medium text-foreground">
                      Esto es una demostración: la solicitud no se ha enviado a ninguna parte.
                    </strong>{" "}
                    El formulario está entero y valida la zona, pero al servicio le falta esto:
                  </p>
                  <ul className="mt-4 grid gap-2 text-sm text-muted-foreground">
                    {QUE_FALTA_CONGELADOS.map((f) => (
                      <li key={f} className="flex gap-2">
                        <span aria-hidden="true">·</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {envio.r.estado === "error" && (
                <>
                  <h3 className="flex items-center gap-2 font-display text-xl">
                    <AlertTriangle className="size-5 text-destructive" aria-hidden="true" />
                    {envio.r.motivo === SIN_RESPUESTA
                      ? "No hemos llegado al servidor"
                      : "El servidor no ha podido enviarla"}
                  </h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{envio.r.motivo}</p>
                  {envio.r.pista && (
                    <p className="mt-3 rounded-lg bg-arena/60 px-3 py-2 font-mono text-xs leading-relaxed text-muted-foreground">
                      {envio.r.pista}
                    </p>
                  )}
                </>
              )}

              {/* Si no salió, las otras dos vías siguen ahí y llevan el
                  pedido escrito: nadie se va con las manos vacías. */}
              {envio.r.estado !== "enviada" && (
                <div className="mt-5 grid gap-3">
                  <BotonWhatsapp mensaje={mensajeWhatsapp} className="w-full sm:w-auto" />
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    O escríbenos a{" "}
                    <a
                      href={enlaceCorreo("Pedido de congelados", mensajeWhatsapp)}
                      className="font-medium text-foreground underline underline-offset-2 hover:text-primary"
                    >
                      {CORREO}
                    </a>
                    , con el pedido ya redactado.
                  </p>
                </div>
              )}

              <Button
                variant="outline"
                className="mt-6"
                onClick={() => setEnvio({ fase: "quieto" })}
              >
                Volver al formulario
              </Button>
            </div>
          ) : (
            <form
              className="mt-8 grid gap-6"
              onSubmit={(e) => {
                e.preventDefault();
                if (!listo) return;
                void (async () => {
                  setEnvio({ fase: "enviando" });
                  try {
                    const r = await enviarCongelados({
                      data: {
                        codigoPostal: z.cp,
                        municipio: z.municipio,
                        productos: elegidos,
                        detalle,
                        nombre,
                        telefono,
                        correo,
                        ...(quiereRecetas && hayCorreo ? { boletin: true } : {}),
                        consentimiento: true,
                        ...(diagnostico ? { diagnostico: true } : {}),
                      },
                    });
                    setEnvio({ fase: "hecho", r });
                  } catch (error) {
                    console.error("Falló el envío de congelados:", error);
                    setEnvio({
                      fase: "hecho",
                      r: {
                        estado: "error",
                        motivo: SIN_RESPUESTA,
                        ...(diagnostico ? { pista: `${String(error)}`.slice(0, 200) } : {}),
                      },
                    });
                  }
                })();
              }}
            >
              <fieldset className="grid gap-3 rounded-2xl bg-card p-5 shadow-[var(--shadow-e1)] ring-1 ring-[var(--ring-linea)]">
                <legend className="float-left w-full font-display text-lg">Productos</legend>
                {productosCongelados.map((p) => (
                  <label
                    key={p.id}
                    className="flex cursor-pointer items-start gap-3 rounded-lg p-2 text-sm leading-relaxed transition-colors duration-200 hover:bg-arena/40"
                  >
                    <input
                      type="checkbox"
                      checked={elegidos.includes(p.id)}
                      onChange={() => alternar(p.id)}
                      className="mt-0.5 size-4 shrink-0 accent-primary"
                    />
                    <span>
                      <span className="font-medium text-foreground">{p.nombre}</span>
                      <span className="text-muted-foreground"> · {p.formato}</span>
                    </span>
                  </label>
                ))}
                <div className="mt-2 grid gap-1.5">
                  <Label htmlFor="detalle">Cantidades, o algo que no esté en la lista</Label>
                  <Textarea
                    id="detalle"
                    maxLength={600}
                    rows={3}
                    placeholder="Por ejemplo: 2 kg de yuca y una bolsa de tequeños"
                    value={detalle}
                    onChange={(e) => setDetalle(e.target.value)}
                  />
                </div>
              </fieldset>

              {/* Zona antes que los datos: si no llegamos, mejor saberlo
                  antes de rellenar el resto. */}
              <fieldset className="grid gap-4 rounded-2xl bg-card p-5 shadow-[var(--shadow-e1)] ring-1 ring-[var(--ring-linea)]">
                <legend className="float-left w-full font-display text-lg">
                  ¿Dónde te lo llevamos?
                </legend>
                <CamposZona
                  z={z}
                  fuera="En esa zona no llegamos con congelados. Al no poder ir por paquetería, solo los entregamos en la provincia de Barcelona."
                />
              </fieldset>

              <fieldset className="grid gap-4 rounded-2xl bg-card p-5 shadow-[var(--shadow-e1)] ring-1 ring-[var(--ring-linea)]">
                <legend className="float-left w-full font-display text-lg">Cómo te avisamos</legend>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-1.5">
                    <Label htmlFor="nombre">
                      Nombre <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="nombre"
                      required
                      autoComplete="name"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="telefono">
                      Teléfono <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="telefono"
                      type="tel"
                      required
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="600 000 000"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-1.5 sm:col-span-2">
                    <Label htmlFor="correo">Correo electrónico</Label>
                    <Input
                      id="correo"
                      type="email"
                      autoComplete="email"
                      placeholder="tunombre@correo.com"
                      value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                    />
                    {/* Permiso aparte del de abajo: pedir congelados no es
                        decir que sí a la publicidad. */}
                    <label
                      className={`mt-1 flex items-start gap-2.5 text-sm leading-relaxed ${
                        hayCorreo ? "cursor-pointer" : "cursor-not-allowed opacity-55"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={quiereRecetas && hayCorreo}
                        disabled={!hayCorreo}
                        onChange={(e) => setQuiereRecetas(e.target.checked)}
                        className="mt-0.5 size-4 shrink-0 accent-primary"
                      />
                      <span className="text-muted-foreground">
                        Quiero recibir las recetas de MARACUYA, {CADENCIA}.
                        {hayCorreo ? "" : " Escribe tu correo arriba para poder apuntarte."}
                      </span>
                    </label>
                  </div>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Te respondemos por WhatsApp o por correo, como prefieras.
                </p>
              </fieldset>

              <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-card p-5 text-sm leading-relaxed shadow-[var(--shadow-e1)] ring-1 ring-[var(--ring-linea)]">
                <input
                  type="checkbox"
                  required
                  checked={consiento}
                  onChange={(e) => setConsiento(e.target.checked)}
                  className="mt-0.5 size-4 shrink-0 accent-primary"
                />
                <span>
                  Acepto que MARACUYA guarde estos datos{" "}
                  <span className="font-medium text-foreground">
                    solo para responder a esta solicitud
                  </span>
                  . No se ceden a nadie ni se usan para publicidad. Puedes pedir que los borremos
                  escribiendo a{" "}
                  <a
                    href={enlaceCorreo("Baja de mis datos")}
                    className="font-medium text-foreground underline underline-offset-2"
                  >
                    {CORREO}
                  </a>
                  .
                </span>
              </label>

              <div className="grid gap-3 sm:flex sm:items-center">
                <Button
                  type="submit"
                  size="lg"
                  disabled={!listo}
                  className="w-full gap-2 sm:w-auto"
                >
                  {envio.fase === "enviando" && (
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  )}
                  Pedir congelados
                </Button>
                <a
                  href={enlaceWhatsapp(mensajeWhatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground"
                >
                  O pregúntanos por WhatsApp
                </a>
              </div>
            </form>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

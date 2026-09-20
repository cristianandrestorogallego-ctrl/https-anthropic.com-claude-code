import { useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, CakeSlice, Camera, Check, Info, MapPin, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Reveal, stagger } from "@/components/site/reveal";
import { BotonWhatsapp } from "@/components/site/boton-whatsapp";
import {
  ENVIO_CONECTADO,
  codigoPorMunicipio,
  municipioPorCodigo,
  QUE_FALTA,
  comprobarCobertura,
  coberturaPermiteEnviar,
  galeria,
  municipiosServidos,
  raciones,
  RELLENO_OTROS,
  rellenos,
  sabores,
  tematicas,
} from "@/lib/tartas";

export const Route = createFileRoute("/tartas")({
  head: () => ({
    meta: [
      { title: "Tartas personalizadas | MARACUYA mercado latino" },
      {
        name: "description",
        content:
          "Tartas por encargo para cumpleaños, bautizos y celebraciones. Servicio solo en la provincia de Barcelona. Pide presupuesto sin compromiso.",
      },
    ],
  }),
  component: Tartas,
});

const CAMPO =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground transition-[border-color,box-shadow] duration-200 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25";

/** Mañana, en el formato que espera un input de fecha. */
function manana() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

function Tartas() {
  const [municipio, setMunicipio] = useState("");
  const [cp, setCp] = useState("");

  const [tocadoCp, setTocadoCp] = useState(false);
  const [imagen, setImagen] = useState<{ nombre: string; url: string } | null>(null);
  const [enviado, setEnviado] = useState(false);
  const archivoRef = useRef<HTMLInputElement>(null);

  // Campos controlados: el enlace de WhatsApp se arma del estado, no del DOM.
  const [campos, setCampos] = useState({
    raciones: "12",
    fecha: "",
    sabor: sabores[0],
    relleno: rellenos[0] as string,
    rellenoOtro: "",
    tematica: tematicas[0],
    mensaje: "",
    alergenos: "",
    nombre: "",
    telefono: "",
    correo: "",
    direccion: "",
  });
  const cambiar = (clave: keyof typeof campos) => (v: string) =>
    setCampos((c) => ({ ...c, [clave]: v }));

  /** Escribir el código elige el municipio, si ese código solo es de uno. */
  const escribirCp = (valor: string) => {
    const limpio = valor.replace(/\D/g, "");
    setCp(limpio);
    if (limpio.length === 5) {
      const encontrado = municipioPorCodigo(limpio);
      if (encontrado) setMunicipio(encontrado);
    }
  };

  /** Y elegir el municipio rellena el código, si el municipio solo tiene uno. */
  const elegirMunicipio = (valor: string) => {
    setMunicipio(valor);
    const unico = codigoPorMunicipio(valor);
    if (unico) setCp(unico);
  };

  const rellenoElegido =
    campos.relleno === RELLENO_OTROS
      ? campos.rellenoOtro.trim() || "otro, a concretar"
      : campos.relleno;

  /** El mensaje que llega a WhatsApp, con lo que el cliente haya rellenado. */
  const mensajeWhatsapp = [
    "Hola, quiero presupuesto para una tarta personalizada.",
    "",
    municipio && `Municipio: ${municipio}`,
    cp && `Código postal: ${cp}`,
    campos.direccion && `Dirección: ${campos.direccion}`,
    `Raciones: ${campos.raciones}`,
    campos.fecha && `Fecha deseada: ${campos.fecha}`,
    `Sabor: ${campos.sabor}`,
    `Relleno: ${rellenoElegido}`,
    `Temática: ${campos.tematica}`,
    campos.mensaje && `Mensaje sobre la tarta: ${campos.mensaje}`,
    campos.alergenos && `Alergias u observaciones: ${campos.alergenos}`,
    campos.nombre && `Soy ${campos.nombre}`,
    campos.telefono && `Teléfono: ${campos.telefono}`,
    campos.correo && `Correo: ${campos.correo}`,
    imagen && "(Te paso la foto de referencia por aquí.)",
  ]
    .filter(Boolean)
    .join("\n");

  const cobertura = useMemo(() => comprobarCobertura(cp, municipio), [cp, municipio]);
  // El aviso del código postal no espera al municipio: en cuanto sabemos que
  // la provincia no es la nuestra, hay que decirlo.
  const fueraDeProvincia = /^\d{5}$/.test(cp) && !cp.startsWith("08");
  const puedeEnviar = coberturaPermiteEnviar(cobertura);

  const elegirImagen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (imagen) URL.revokeObjectURL(imagen.url);
    setImagen({ nombre: f.name, url: URL.createObjectURL(f) });
  };

  const quitarImagen = () => {
    if (imagen) URL.revokeObjectURL(imagen.url);
    setImagen(null);
    if (archivoRef.current) archivoRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <section className="border-b bg-arena/50">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
            <h1 className="max-w-3xl font-display text-[clamp(2rem,5vw,3.4rem)] leading-[1.05] tracking-[-0.03em]">
              Tartas personalizadas
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Nos dices la celebración, las raciones y lo que te apetece; nosotros te pasamos
              presupuesto. Cada tarta se hace por encargo, así que ni el precio ni la fecha salen de
              una tabla: se confirman contigo.
            </p>

            <div className="mt-7 flex max-w-2xl items-start gap-3 rounded-2xl bg-card p-4 text-sm leading-relaxed shadow-[var(--shadow-e1)] ring-1 ring-[var(--ring-linea)]">
              <MapPin className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
              <p>
                <strong className="font-medium">
                  Servicio disponible únicamente en la provincia de Barcelona.
                </strong>{" "}
                Precio y fecha sujetos a confirmación.
              </p>
            </div>
          </div>
        </section>

        {/* Galería */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <h2 className="font-display text-3xl tracking-[-0.02em] sm:text-4xl">
            Algunas que hemos hecho
          </h2>
          <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">
            Tartas que han salido de aquí. Ninguna es un catálogo cerrado: si traes una foto tuya,
            partimos de ahí.
          </p>

          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6">
            {galeria.map((t, i) => (
              <li key={t.id}>
                <Reveal delay={stagger(i)}>
                  <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-e1)] ring-1 ring-[var(--ring-linea)]">
                    {t.imagen ? (
                      <img
                        src={t.imagen}
                        alt={t.nombre}
                        loading="lazy"
                        className="aspect-4/5 w-full object-cover"
                      />
                    ) : (
                      // Hueco a propósito. Una foto de otra cosa sería mentir
                      // sobre lo que se vende.
                      <div className="flex aspect-4/5 w-full flex-col items-center justify-center gap-2 bg-arena text-muted-foreground">
                        <CakeSlice className="size-8" aria-hidden="true" />
                        <span className="text-xs uppercase tracking-[0.1em]">Foto pendiente</span>
                      </div>
                    )}
                    <div className="flex flex-1 flex-col gap-1.5 p-5">
                      <h3 className="font-display text-lg leading-snug tracking-[-0.012em]">
                        {t.nombre}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {t.descripcion}
                      </p>
                      <p className="mt-auto pt-3 text-sm text-muted-foreground">
                        {t.sabor} · relleno de {t.relleno.toLowerCase()}
                      </p>
                    </div>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        </section>

        {/* Formulario */}
        <section id="presupuesto" className="scroll-mt-24 border-t bg-arena/40 py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="font-display text-3xl tracking-[-0.02em] sm:text-4xl">
              Pide presupuesto
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Cuantos más detalles nos des, más ajustado será. Nada de esto te compromete a nada.
            </p>

            {enviado ? (
              <div
                role="status"
                className="mt-8 rounded-2xl bg-card p-6 shadow-[var(--shadow-e2)] ring-1 ring-[var(--ring-linea)]"
              >
                <h3 className="flex items-center gap-2 font-display text-xl">
                  <Check className="size-5 text-primary" aria-hidden="true" />
                  {ENVIO_CONECTADO ? "Solicitud recibida" : "Así se vería al enviarla"}
                </h3>
                {ENVIO_CONECTADO ? (
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    Te escribimos con el presupuesto y una fecha posible. Ni el precio ni la fecha
                    están confirmados hasta que te respondamos.
                  </p>
                ) : (
                  <>
                    <p className="mt-3 leading-relaxed text-muted-foreground">
                      <strong className="font-medium text-foreground">
                        Esto es una demostración: la solicitud no se ha enviado a ninguna parte.
                      </strong>{" "}
                      El formulario está entero y valida la zona, pero le falta un destino.
                    </p>
                    <ul className="mt-4 grid gap-2 text-sm text-muted-foreground">
                      {QUE_FALTA.map((f) => (
                        <li key={f} className="flex gap-2">
                          <span aria-hidden="true">·</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                <Button variant="outline" className="mt-6" onClick={() => setEnviado(false)}>
                  Volver al formulario
                </Button>
              </div>
            ) : (
              <form
                className="mt-8 grid gap-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!puedeEnviar) return;
                  setEnviado(true);
                }}
              >
                {/* Zona primero: si no llegamos, mejor saberlo antes de
                    rellenar el resto. */}
                <fieldset className="grid gap-4 rounded-2xl bg-card p-5 shadow-[var(--shadow-e1)] ring-1 ring-[var(--ring-linea)]">
                  <legend className="float-left w-full font-display text-lg">
                    ¿Dónde la llevamos?
                  </legend>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-1.5">
                      <Label htmlFor="cp">
                        Código postal <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="cp"
                        required
                        inputMode="numeric"
                        maxLength={5}
                        placeholder="08001"
                        value={cp}
                        onChange={(e) => escribirCp(e.target.value)}
                        onBlur={() => setTocadoCp(true)}
                        aria-invalid={fueraDeProvincia || undefined}
                        aria-describedby={fueraDeProvincia ? "cp-aviso" : undefined}
                      />
                    </div>

                    <div className="grid gap-1.5">
                      <Label htmlFor="municipio">
                        Municipio <span className="text-destructive">*</span>
                      </Label>
                      <select
                        id="municipio"
                        required
                        className={CAMPO}
                        value={municipio}
                        onChange={(e) => elegirMunicipio(e.target.value)}
                      >
                        <option value="">Elige tu municipio</option>
                        {municipiosServidos.map((m) => (
                          <option key={m.nombre} value={m.nombre}>
                            {m.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {fueraDeProvincia && (
                    <p
                      id="cp-aviso"
                      role="alert"
                      className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm leading-relaxed text-destructive"
                    >
                      <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                      <span>
                        En esa zona no disponemos de servicio a domicilio. Las tartas personalizadas
                        solo llegan a la provincia de Barcelona.
                      </span>
                    </p>
                  )}

                  {cobertura.estado === "desajuste" && (
                    <p className="flex items-start gap-2 rounded-lg bg-secondary p-3 text-sm leading-relaxed text-secondary-foreground">
                      <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                      <span>
                        Ese código postal no nos consta en {cobertura.municipio}. Puedes seguir: lo
                        comprobamos al preparar el presupuesto.
                      </span>
                    </p>
                  )}

                  {tocadoCp && cp === "" && (
                    <p role="alert" className="text-sm text-destructive">
                      El código postal es obligatorio para continuar.
                    </p>
                  )}

                  <div className="grid gap-1.5">
                    <Label htmlFor="direccion">Dirección de entrega</Label>
                    <Input
                      id="direccion"
                      name="direccion"
                      autoComplete="street-address"
                      placeholder="Calle, número, piso"
                      value={campos.direccion}
                      onChange={(e) => cambiar("direccion")(e.target.value)}
                    />
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      Si aún no la sabes, déjala en blanco: la pedimos al confirmar el encargo.
                    </p>
                  </div>

                  <p className="text-xs leading-relaxed text-muted-foreground">
                    ¿Tu municipio no está en la lista? Escríbenos y lo miramos.
                  </p>
                </fieldset>

                <fieldset className="grid gap-4 rounded-2xl bg-card p-5 shadow-[var(--shadow-e1)] ring-1 ring-[var(--ring-linea)]">
                  <legend className="float-left w-full font-display text-lg">La tarta</legend>

                  {/* items-start: al desplegarse el campo de "Otros", la celda
                      crece y sin esto la de al lado estira su desplegable y lo
                      despega de su etiqueta. */}
                  <div className="grid items-start gap-4 sm:grid-cols-2">
                    <div className="grid gap-1.5">
                      <Label htmlFor="raciones">Raciones</Label>
                      <select
                        id="raciones"
                        name="raciones"
                        className={CAMPO}
                        value={campos.raciones}
                        onChange={(e) => cambiar("raciones")(e.target.value)}
                      >
                        {raciones.map((r) => (
                          <option key={r} value={r}>
                            {r} raciones
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="fecha">Fecha deseada</Label>
                      <Input
                        id="fecha"
                        name="fecha"
                        type="date"
                        min={manana()}
                        value={campos.fecha}
                        onChange={(e) => cambiar("fecha")(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="sabor">Sabor</Label>
                      <select
                        id="sabor"
                        name="sabor"
                        className={CAMPO}
                        value={campos.sabor}
                        onChange={(e) => cambiar("sabor")(e.target.value)}
                      >
                        {sabores.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="relleno">Relleno</Label>
                      <select
                        id="relleno"
                        name="relleno"
                        className={CAMPO}
                        value={campos.relleno}
                        onChange={(e) => cambiar("relleno")(e.target.value)}
                      >
                        {rellenos.map((r) => (
                          <option key={r}>{r}</option>
                        ))}
                      </select>
                      {campos.relleno === RELLENO_OTROS && (
                        <>
                          <Label htmlFor="relleno-otro" className="mt-1">
                            ¿Qué relleno? <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="relleno-otro"
                            name="relleno-otro"
                            required
                            maxLength={60}
                            placeholder="Por ejemplo, crema de café"
                            value={campos.rellenoOtro}
                            onChange={(e) => cambiar("rellenoOtro")(e.target.value)}
                          />
                        </>
                      )}
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="tematica">Temática</Label>
                      <select
                        id="tematica"
                        name="tematica"
                        className={CAMPO}
                        value={campos.tematica}
                        onChange={(e) => cambiar("tematica")(e.target.value)}
                      >
                        {tematicas.map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="mensaje">Mensaje sobre la tarta</Label>
                      <Input
                        id="mensaje"
                        name="mensaje"
                        maxLength={60}
                        placeholder="Felices 30, Marta"
                        value={campos.mensaje}
                        onChange={(e) => cambiar("mensaje")(e.target.value)}
                      />
                    </div>
                  </div>
                </fieldset>

                <fieldset className="grid gap-4 rounded-2xl bg-card p-5 shadow-[var(--shadow-e1)] ring-1 ring-[var(--ring-linea)]">
                  <legend className="float-left w-full font-display text-lg">
                    Referencia y alérgenos
                  </legend>

                  <div className="grid gap-1.5">
                    <Label htmlFor="foto">Imagen de referencia</Label>
                    {imagen ? (
                      <div className="flex items-center gap-3 rounded-lg bg-arena p-3">
                        <img
                          src={imagen.url}
                          alt=""
                          className="size-16 shrink-0 rounded-md object-cover"
                        />
                        <span className="min-w-0 flex-1 truncate text-sm">{imagen.nombre}</span>
                        <Button type="button" variant="ghost" size="icon" onClick={quitarImagen}>
                          <X className="size-4" />
                          <span className="sr-only">Quitar la imagen</span>
                        </Button>
                      </div>
                    ) : (
                      <label
                        htmlFor="foto"
                        className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-border bg-background px-4 py-6 text-sm text-muted-foreground transition-colors duration-200 hover:border-primary hover:text-primary"
                      >
                        <Camera className="size-5 shrink-0" aria-hidden="true" />
                        Sube una foto de la tarta que tienes en mente
                      </label>
                    )}
                    <input
                      ref={archivoRef}
                      id="foto"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={elegirImagen}
                    />
                    {!ENVIO_CONECTADO && (
                      <p className="text-xs text-muted-foreground">
                        Ahora mismo la imagen solo se previsualiza aquí; todavía no se sube a ningún
                        sitio.
                      </p>
                    )}
                  </div>

                  <div className="grid gap-1.5">
                    <Label htmlFor="alergenos">Alergias, intolerancias u observaciones</Label>
                    <Textarea
                      id="alergenos"
                      name="alergenos"
                      rows={3}
                      placeholder="Por ejemplo: sin frutos secos, un comensal celíaco…"
                      value={campos.alergenos}
                      onChange={(e) => cambiar("alergenos")(e.target.value)}
                    />
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      Lo tendremos en cuenta al responderte. No trabajamos en un obrador libre de
                      alérgenos, así que no podemos garantizar la ausencia de trazas: te diremos con
                      claridad qué es posible y qué no.
                    </p>
                  </div>
                </fieldset>

                <fieldset className="grid gap-4 rounded-2xl bg-card p-5 shadow-[var(--shadow-e1)] ring-1 ring-[var(--ring-linea)]">
                  <legend className="float-left w-full font-display text-lg">
                    Cómo te avisamos
                  </legend>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-1.5">
                      <Label htmlFor="nombre">
                        Nombre <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="nombre"
                        name="nombre"
                        required
                        autoComplete="name"
                        value={campos.nombre}
                        onChange={(e) => cambiar("nombre")(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="telefono">
                        Teléfono <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="telefono"
                        name="telefono"
                        type="tel"
                        required
                        inputMode="tel"
                        autoComplete="tel"
                        value={campos.telefono}
                        onChange={(e) => cambiar("telefono")(e.target.value)}
                        placeholder="600 000 000"
                      />
                    </div>
                    <div className="grid gap-1.5 sm:col-span-2">
                      <Label htmlFor="correo">Correo electrónico</Label>
                      <Input
                        id="correo"
                        name="correo"
                        type="email"
                        autoComplete="email"
                        placeholder="tunombre@correo.com"
                        value={campos.correo}
                        onChange={(e) => cambiar("correo")(e.target.value)}
                      />
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Te respondemos por WhatsApp o por correo, como prefieras.
                  </p>
                </fieldset>

                <div className="grid gap-3">
                  <div className="grid gap-3 sm:flex sm:flex-wrap">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={!puedeEnviar}
                      className="w-full sm:w-auto"
                    >
                      Solicitar presupuesto
                    </Button>
                    {/* La vía que sí funciona hoy, mientras el formulario no
                        tenga destino: abre WhatsApp con todo ya escrito. */}
                    <BotonWhatsapp mensaje={mensajeWhatsapp} className="w-full sm:w-auto" />
                  </div>
                  {!puedeEnviar && (
                    <p className="text-sm text-muted-foreground">
                      {fueraDeProvincia
                        ? "No podemos recoger la solicitud para esa zona."
                        : "Completa el código postal y el municipio para continuar."}
                    </p>
                  )}
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Enviar la solicitud no reserva nada ni te cobra nada. El precio y la fecha se
                    confirman por respuesta nuestra.
                  </p>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";

import { CADENCIA, FALTA_BOLETIN, type RespuestaBoletin } from "@/lib/boletin";
import { CORREO, enlaceCorreo } from "@/lib/contacto";
import { suscribir } from "@/lib/suscribir";

/**
 * El alta en el boletín, tal como se ve en el pie.
 *
 * Va sobre fondo oscuro, así que los campos se dibujan con transparencias
 * sobre el morado en vez de con las superficies claras del resto del
 * sitio. El botón es el amarillo de marca: es lo único que tiene que
 * llamar la atención ahí abajo.
 */
export function Boletin() {
  const [correo, setCorreo] = useState("");
  const [consiento, setConsiento] = useState(false);
  const [envio, setEnvio] = useState<
    { fase: "quieto" } | { fase: "enviando" } | { fase: "hecho"; r: RespuestaBoletin }
  >({ fase: "quieto" });

  const puede = correo.trim() !== "" && consiento && envio.fase !== "enviando";

  if (envio.fase === "hecho" && envio.r.estado === "apuntado") {
    return (
      <p className="flex items-start gap-2 text-sm opacity-85">
        <Check className="mt-0.5 size-4 shrink-0 text-maracuya" aria-hidden="true" />
        <span>
          Listo, te escribimos {CADENCIA}. En cada correo hay un enlace para darte de baja.
        </span>
      </p>
    );
  }

  return (
    <form
      className="grid gap-2.5"
      onSubmit={(e) => {
        e.preventDefault();
        if (!puede) return;
        void (async () => {
          setEnvio({ fase: "enviando" });
          try {
            const r = await suscribir({
              data: {
                correo: correo.trim(),
                consentimiento: true,
                ...(pidenDiagnostico() ? { diagnostico: true } : {}),
              },
            });
            setEnvio({ fase: "hecho", r });
          } catch (error) {
            console.error("Falló el alta en el boletín:", error);
            setEnvio({
              fase: "hecho",
              r: { estado: "error", motivo: "No hemos podido apuntarte. Inténtalo más tarde." },
            });
          }
        })();
      }}
    >
      <label htmlFor="boletin-correo" className="sr-only">
        Tu correo electrónico
      </label>
      <input
        id="boletin-correo"
        type="email"
        required
        maxLength={120}
        autoComplete="email"
        placeholder="tu@correo.com"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
        className="w-full rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-sm text-selva-foreground transition-[border-color,background-color] duration-200 placeholder:text-selva-foreground/45 focus-visible:border-maracuya focus-visible:bg-white/15 focus-visible:outline-none"
      />

      <label className="flex cursor-pointer items-start gap-2 text-xs leading-relaxed opacity-80">
        <input
          type="checkbox"
          required
          checked={consiento}
          onChange={(e) => setConsiento(e.target.checked)}
          className="mt-0.5 size-3.5 shrink-0 accent-maracuya"
        />
        {/* Su propio permiso, separado del de las tartas: pedir un
            presupuesto no es decir que sí a la publicidad. */}
        <span>Acepto recibir el boletín. Puedo darme de baja cuando quiera.</span>
      </label>

      <button
        type="submit"
        disabled={!puede}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-maracuya px-4 py-2 text-sm font-medium text-maracuya-foreground transition-[opacity,transform] duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maracuya/50 disabled:cursor-not-allowed disabled:bg-white/12 disabled:text-selva-foreground/55"
      >
        {envio.fase === "enviando" && (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        )}
        Apuntarme
      </button>

      {envio.fase === "hecho" && envio.r.estado !== "apuntado" && (
        <p role="status" className="text-xs leading-relaxed opacity-80">
          {envio.r.estado === "sin-configurar" ? (
            <>
              {FALTA_BOLETIN}{" "}
              <a
                href={enlaceCorreo("Quiero recibir las recetas")}
                className="underline underline-offset-2"
              >
                Escríbenos a {CORREO}
              </a>{" "}
              y te apuntamos a mano.
            </>
          ) : (
            envio.r.motivo
          )}
          {envio.r.estado === "error" && envio.r.pista && (
            <span className="mt-1.5 block font-mono text-[11px] opacity-70">{envio.r.pista}</span>
          )}
        </p>
      )}
    </form>
  );
}

/**
 * ¿Han abierto la página con ?diagnostico?
 *
 * Igual que en el formulario de tartas: es la forma de ver por qué falla
 * sin entrar en los registros del servidor, y quien pide recetas no ve
 * nada de esto.
 */
function pidenDiagnostico(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).has("diagnostico");
}

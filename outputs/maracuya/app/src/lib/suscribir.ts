import { createServerFn } from "@tanstack/react-start";

import { esquemaSuscripcion, type RespuestaBoletin } from "@/lib/boletin";

/**
 * El alta en el boletín.
 *
 * Corre en el servidor, en Vercel, y usa la misma clave de Brevo que el
 * formulario de tartas: ahí vive y ahí se queda, sin prefijo VITE_, que es
 * el que haría que Vite la incrustara en el JavaScript que descarga
 * cualquiera.
 *
 * Lo único nuevo es a qué lista va el contacto, que es un número que da
 * Brevo al crearla.
 */

/** La misma clave que manda los correos de las tartas. */
const CLAVE = () => process.env["BREVO_API_KEY"];

/**
 * La lista de Brevo donde caen los suscriptores, por su número.
 *
 * Sin ella no se da de alta a nadie: mandar el contacto sin lista lo
 * guardaría en Brevo sin pertenecer a nada, y entonces el boletín nunca
 * le llegaría. Más vale decir que no está conectado.
 */
function lista(): number | null {
  const n = Number(process.env["BREVO_LISTA_RECETAS"]);
  return Number.isInteger(n) && n > 0 ? n : null;
}

/** Por qué se quejó Brevo, dicho para quien lo tenga que arreglar. */
function queHacer(estado: number, code: string, message: string): string {
  const texto = `${code} ${message}`.toLowerCase();
  if (/\bip\b/.test(texto))
    return (
      "La IP del servidor no está autorizada en Brevo, y Vercel no tiene una fija. " +
      "Desactiva el bloqueo por IP para la API: Settings → Security → Authorized IPs."
    );
  if (texto.includes("list") || estado === 404)
    return "Revisa BREVO_LISTA_RECETAS en Vercel: ese número de lista no existe en Brevo.";
  if (estado === 401 || estado === 403)
    return "Revisa BREVO_API_KEY en Vercel: falta, está mal copiada o se ha revocado.";
  return "Fallo del proveedor de correo.";
}

export const suscribir = createServerFn({ method: "POST" })
  .validator(esquemaSuscripcion)
  .handler(async ({ data }): Promise<RespuestaBoletin> => {
    const clave = CLAVE();
    const id = lista();
    if (!clave || id === null) return { estado: "sin-configurar" };

    let respuesta: Response;
    try {
      respuesta = await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers: {
          "api-key": clave,
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          email: data.correo,
          listIds: [id],
          // Con esto, quien ya estaba no da error: Brevo actualiza el
          // contacto y responde 204 en vez de 201. Las dos son un sí.
          updateEnabled: true,
        }),
      });
    } catch (error) {
      console.error("No se pudo hablar con Brevo para el alta:", error);
      return { estado: "error", motivo: "No hemos podido apuntarte. Inténtalo más tarde." };
    }

    if (respuesta.ok) return { estado: "apuntado" };

    // Del cuerpo del error solo salen estos dos campos, y recortados: son
    // descripciones cortas del proveedor. Volcar la respuesta entera es lo
    // que acaba escupiendo una credencial en un registro.
    let code = "";
    let message = "";
    try {
      const cuerpo: unknown = await respuesta.json();
      if (cuerpo && typeof cuerpo === "object") {
        const o = cuerpo as Record<string, unknown>;
        if (typeof o["code"] === "string") code = o["code"].slice(0, 60);
        if (typeof o["message"] === "string") message = o["message"].slice(0, 200);
      }
    } catch {
      // Una respuesta que no es JSON no aporta nada: queda el código HTTP.
    }

    const pista = queHacer(respuesta.status, code, message);
    const detalle = [code, message].filter(Boolean).join(": ");
    console.error(
      `No salió el alta en el boletín: Brevo respondió ${respuesta.status}` +
        `${detalle ? ` (${detalle})` : ""}. ${pista}`,
    );

    return {
      estado: "error",
      motivo: "No hemos podido apuntarte. Inténtalo más tarde.",
      ...(data.diagnostico ? { pista: `Brevo respondió ${respuesta.status}. ${pista}` } : {}),
    };
  });

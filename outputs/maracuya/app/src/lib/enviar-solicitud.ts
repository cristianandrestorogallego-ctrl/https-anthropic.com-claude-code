import { createServerFn } from "@tanstack/react-start";

import { CORREO } from "@/lib/contacto";
import { correoParaElCliente, correoParaLaTienda } from "@/lib/correos";
import { esquemaSolicitud, type Respuesta, type Solicitud } from "@/lib/solicitud";

/**
 * El envío de una solicitud de tarta.
 *
 * Corre en el servidor, en Vercel. Ahí vive la clave del servicio de
 * correo, y ahí se queda: nunca llega al navegador ni al repositorio. Por
 * eso la variable NO lleva el prefijo VITE_, que es justo el que hace que
 * Vite incruste el valor en el JavaScript que descarga cualquiera.
 *
 * Manda dos correos: el aviso al obrador, con la foto adjunta, y el acuse
 * a quien la pidió. Si falla el segundo, la solicitud llegó igual y se
 * dice así en vez de dar el envío por fallido.
 */

/** Sin clave configurada no hay envío, y la pantalla lo cuenta tal cual. */
const CLAVE = () => process.env["BREVO_API_KEY"];

/** A dónde llegan las solicitudes. Por defecto, el correo de la tienda. */
const BUZON = () => process.env["CORREO_TIENDA"] || CORREO;

/**
 * El remitente.
 *
 * Tiene que ser una dirección de un dominio propio autenticado en Brevo.
 * NO vale una de Gmail: desde febrero de 2024 gmail.com publica una
 * política DMARC de cuarentena, así que un correo que sale por Brevo
 * diciendo venir de @gmail.com falla la comprobación y acaba en spam.
 *
 * El valor por defecto es justo ese caso malo. Está puesto para que la
 * función no reviente sin configurar, no porque sirva.
 */
const REMITENTE = () => ({
  name: "MARACUYA mercado latino",
  email: process.env["CORREO_REMITENTE"] || CORREO,
});

/**
 * Dominios de correo gratuito.
 *
 * Ninguno se puede autenticar: publican políticas DMARC que hacen que un
 * correo enviado por otro servidor en su nombre falle la comprobación. Se
 * usa para saber si el remitente da para mandarle algo a un desconocido,
 * o solo para avisarnos a nosotros.
 */
const CORREO_GRATUITO = [
  "gmail.com",
  "googlemail.com",
  "hotmail.com",
  "hotmail.es",
  "outlook.com",
  "outlook.es",
  "live.com",
  "msn.com",
  "yahoo.com",
  "yahoo.es",
  "icloud.com",
  "me.com",
  "aol.com",
  "gmx.com",
  "gmx.es",
  "proton.me",
  "protonmail.com",
  "terra.es",
  "telefonica.net",
];

/**
 * ¿El remitente aguanta un correo a un desconocido?
 *
 * Solo si sale de un dominio propio. Desde uno gratuito el correo llega,
 * pero al buzón de spam, y mandar algo que sabemos que acaba ahí no
 * ayuda a nadie: ni a quien no lo lee, ni a la reputación desde la que
 * mandaremos cuando el dominio esté listo.
 *
 * En cuanto CORREO_REMITENTE apunte al dominio de la tienda, esto pasa a
 * ser cierto solo y el acuse se enciende sin tocar nada más.
 */
function remitenteAutenticado(): boolean {
  const dominio = REMITENTE().email.split("@")[1]?.toLowerCase();
  return dominio !== undefined && !CORREO_GRATUITO.includes(dominio);
}

type Adjunto = { name: string; content: string };

type Envio = {
  para: { email: string; name?: string };
  asunto: string;
  texto: string;
  responderA?: { email: string; name?: string };
  adjuntos?: Adjunto[];
};

/**
 * Por qué se quejó el proveedor, dicho para quien lo tenga que arreglar.
 *
 * Brevo devuelve el mismo code —"unauthorized"— para dos averías que se
 * resuelven en sitios distintos: la clave mal puesta y el remitente sin
 * verificar. Sin esta traducción, el registro de Vercel dice 401 y hay
 * que adivinar cuál de las dos es.
 */
function queHacer(estado: number, code: string, message: string): string {
  const texto = `${code} ${message}`.toLowerCase();
  if (texto.includes("not verified") || texto.includes("sender"))
    return "Verifica el remitente en Brevo (Settings → Senders) o autentica el dominio.";
  if (estado === 401 || estado === 403)
    return "Revisa BREVO_API_KEY en Vercel: falta, está mal copiada o se ha revocado.";
  if (estado === 402 || estado === 429) return "Se ha agotado el cupo del plan de Brevo por hoy.";
  if (estado === 400) return "Brevo ha rechazado el contenido del correo.";
  return "Fallo del proveedor de correo.";
}

/**
 * Una llamada al proveedor de correo. Aislada a propósito: cambiar de
 * proveedor es reescribir esta función y nada más.
 */
async function mandarCorreo(clave: string, e: Envio): Promise<void> {
  const respuesta = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": clave,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: REMITENTE(),
      to: [e.para],
      ...(e.responderA ? { replyTo: e.responderA } : {}),
      subject: e.asunto,
      textContent: e.texto,
      ...(e.adjuntos?.length ? { attachment: e.adjuntos } : {}),
    }),
  });

  if (respuesta.ok) return;

  // Del cuerpo del error solo salen estos dos campos, y recortados. Son
  // descripciones cortas que escribe el proveedor; volcar la respuesta
  // entera es lo que acaba escupiendo una credencial en un registro.
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

  const detalle = [code, message].filter(Boolean).join(": ");
  throw new Error(
    `Brevo respondió ${respuesta.status}${detalle ? ` (${detalle})` : ""}. ` +
      queHacer(respuesta.status, code, message),
  );
}

function adjuntosDe(s: Solicitud): Adjunto[] {
  return s.foto ? [{ name: s.foto.nombre, content: s.foto.base64 }] : [];
}

export const enviarSolicitud = createServerFn({ method: "POST" })
  .validator(esquemaSolicitud)
  .handler(async ({ data }): Promise<Respuesta> => {
    // La trampa para robots: si trae algo, se responde que todo bien y no
    // se manda nada. Un robot que ve un error reintenta; uno que ve un
    // "ya está" se va.
    if (data.web) return { estado: "enviada", acuse: false };

    const clave = CLAVE();
    if (!clave) return { estado: "sin-configurar" };

    const tienda = correoParaLaTienda(data);
    try {
      await mandarCorreo(clave, {
        para: { email: BUZON(), name: "MARACUYA" },
        asunto: tienda.asunto,
        texto: tienda.texto,
        ...(data.correo ? { responderA: { email: data.correo, name: data.nombre } } : {}),
        adjuntos: adjuntosDe(data),
      });
    } catch (error) {
      console.error("No salió el aviso de la solicitud:", error);
      return {
        estado: "error",
        motivo: "No hemos podido enviar la solicitud. Prueba por WhatsApp o por correo.",
      };
    }

    // El acuse es un extra: si falla, la solicitud ya está en el obrador.
    if (!data.correo) return { estado: "enviada", acuse: false };

    // Desde un remitente gratuito el acuse acabaría en spam. Se calla en
    // vez de mandarlo: la pantalla, cuando no hay acuse, tampoco promete
    // ninguna copia. El aviso al obrador ya ha salido, que es lo que
    // hace falta para que la tarta se responda.
    if (!remitenteAutenticado()) {
      console.warn(
        `Acuse omitido: el remitente ${REMITENTE().email} es de un dominio gratuito y el ` +
          "correo acabaría en spam. Autentica tiendamaracuya.es en Brevo y pon " +
          "CORREO_REMITENTE a una dirección suya.",
      );
      return { estado: "enviada", acuse: false };
    }

    const cliente = correoParaElCliente(data);
    try {
      await mandarCorreo(clave, {
        para: { email: data.correo, name: data.nombre },
        asunto: cliente.asunto,
        texto: cliente.texto,
        // El acuse invita a responder, así que la respuesta tiene que
        // caer en un buzón que alguien lea. El remitente puede ser una
        // dirección del dominio sin nadie detrás; este no.
        responderA: { email: BUZON(), name: "MARACUYA mercado latino" },
      });
      return { estado: "enviada", acuse: true };
    } catch (error) {
      console.error("La solicitud llegó pero el acuse no:", error);
      return { estado: "enviada", acuse: false };
    }
  });

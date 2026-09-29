import { CORREO } from "@/lib/contacto";

/**
 * El correo que manda la tienda, por Brevo.
 *
 * Vive aparte porque lo usan varias solicitudes —tartas, congelados— y
 * todas tienen las mismas reglas: de dónde sale la clave, quién puede ser
 * el remitente, qué hacer cuando el proveedor se queja. Escribirlas una
 * sola vez es lo que evita que dos formularios se comporten distinto ante
 * el mismo fallo.
 *
 * Solo corre en el servidor, en Vercel. Ahí vive la clave y ahí se queda:
 * nunca llega al navegador ni al repositorio. Por eso la variable NO lleva
 * el prefijo VITE_, que es justo el que hace que Vite incruste el valor en
 * el JavaScript que descarga cualquiera.
 */

/** Sin clave configurada no hay envío, y la pantalla lo cuenta tal cual. */
export const CLAVE = () => process.env["BREVO_API_KEY"];

/**
 * ¿Lo que hay configurado es la clave de SMTP en vez de la de la API?
 *
 * Solo mira el prefijo, nunca el valor. Sirve para explicar un 401, no
 * para decidir si se manda: si Brevo cambiara de prefijos, esto deja de
 * acertar en el texto pero no impide ningún envío.
 */
function esClaveSmtp(): boolean {
  return CLAVE()?.startsWith("xsmtpsib-") ?? false;
}

/** A dónde llegan las solicitudes. Por defecto, el correo de la tienda. */
export const BUZON = () => process.env["CORREO_TIENDA"] || CORREO;

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
export const REMITENTE = () => ({
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
export function remitenteAutenticado(): boolean {
  const dominio = REMITENTE().email.split("@")[1]?.toLowerCase();
  return dominio !== undefined && !CORREO_GRATUITO.includes(dominio);
}

export type Adjunto = { name: string; content: string };

export type Envio = {
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
  // Primero la IP: Brevo bloquea las desconocidas por defecto en las
  // cuentas nuevas, y en Vercel no hay una IP fija que autorizar, así que
  // este caso no se arregla añadiendo direcciones a una lista. Con
  // frontera de palabra, o "recipient" daría un falso positivo.
  if (/\bip\b/.test(texto))
    return (
      "La IP del servidor no está autorizada en Brevo, y Vercel no tiene una fija. " +
      "Desactiva el bloqueo por IP para la API: Settings → Security → Authorized IPs."
    );
  if (texto.includes("not verified") || texto.includes("sender"))
    return "Verifica el remitente en Brevo (Settings → Senders) o autentica el dominio.";
  if (estado === 401 || estado === 403) {
    // Brevo reparte dos claves que se parecen y viven en la misma página.
    // La de SMTP no vale para la API y devuelve este mismo 401, así que
    // decirlo aquí ahorra buscar el fallo en el sitio equivocado.
    if (esClaveSmtp())
      return (
        "Esa es la clave SMTP (empieza por xsmtpsib-), y la API no la acepta. " +
        "En Brevo → Settings → SMTP & API, pestaña API keys, genera una que empiece por xkeysib-."
      );
    return "Revisa BREVO_API_KEY en Vercel: falta, está mal copiada o se ha revocado.";
  }
  if (estado === 402 || estado === 429) return "Se ha agotado el cupo del plan de Brevo por hoy.";
  if (estado === 400) return "Brevo ha rechazado el contenido del correo.";
  return "Fallo del proveedor de correo.";
}

/**
 * Una llamada al proveedor de correo. Aislada a propósito: cambiar de
 * proveedor es reescribir esta función y nada más.
 */
export async function mandarCorreo(clave: string, e: Envio): Promise<void> {
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
  const pista = queHacer(respuesta.status, code, message);
  throw new FalloDeCorreo(
    `Brevo respondió ${respuesta.status}${detalle ? ` (${detalle})` : ""}. ${pista}`,
    `Brevo respondió ${respuesta.status}. ${pista}`,
  );
}

/** Un fallo del proveedor que ya sabe explicarse. */
export class FalloDeCorreo extends Error {
  constructor(
    message: string,
    /** La versión corta y sin datos internos, para enseñar con ?diagnostico. */
    readonly pista: string,
  ) {
    super(message);
    this.name = "FalloDeCorreo";
  }
}

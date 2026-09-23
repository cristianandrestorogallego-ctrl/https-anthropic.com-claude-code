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
 * Tiene que ser una dirección verificada en el proveedor, o los correos
 * no salen. Mientras no haya dominio propio, es el mismo Gmail de la
 * tienda verificado como remitente único.
 */
const REMITENTE = () => ({
  name: "MARACUYA mercado latino",
  email: process.env["CORREO_REMITENTE"] || CORREO,
});

type Adjunto = { name: string; content: string };

type Envio = {
  para: { email: string; name?: string };
  asunto: string;
  texto: string;
  responderA?: { email: string; name?: string };
  adjuntos?: Adjunto[];
};

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

  if (!respuesta.ok) {
    // El cuerpo del error puede traer la clave de vuelta en algunos
    // proveedores, así que solo se registra el código.
    throw new Error(`El servicio de correo respondió ${respuesta.status}.`);
  }
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

    const cliente = correoParaElCliente(data);
    try {
      await mandarCorreo(clave, {
        para: { email: data.correo, name: data.nombre },
        asunto: cliente.asunto,
        texto: cliente.texto,
      });
      return { estado: "enviada", acuse: true };
    } catch (error) {
      console.error("La solicitud llegó pero el acuse no:", error);
      return { estado: "enviada", acuse: false };
    }
  });

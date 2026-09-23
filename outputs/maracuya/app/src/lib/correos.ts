import { CORREO } from "@/lib/contacto";
import { resumirSolicitud, type Solicitud } from "@/lib/solicitud";
import { WHATSAPP_VISIBLE } from "@/lib/whatsapp";

/**
 * Los dos correos que salen de una solicitud.
 *
 * TODO ESTE ARCHIVO ES TEXTO EDITABLE. Está aparte de la máquina de
 * enviar a propósito, para que cambiar lo que lee un cliente no obligue
 * a tocar nada que pueda romperse.
 *
 * Una regla que no se salta: el acuse dice que la solicitud ha llegado y
 * nada más. No confirma precio, ni fecha, ni disponibilidad, ni promete
 * ausencia de alérgenos. Eso lo responde una persona.
 */

/** El aviso que llega al obrador. */
export function correoParaLaTienda(s: Solicitud) {
  // Las raciones ya vienen redactadas —"30 (desde 99 €)" o "16 (precio a
  // consultar)"—, así que no se les añade la palabra detrás.
  const cuando = s.fecha ? ` · ${s.fecha}` : "";
  return {
    asunto: `Tarta · ${s.nombre} · ${s.raciones}${cuando}`,
    texto: [
      "Nueva solicitud de presupuesto desde la web.",
      "",
      resumirSolicitud(s),
      "",
      "—",
      // Solo si dejó correo: responder a un mensaje que no tiene a nadie
      // detrás es un callejón sin salida.
      s.correo
        ? "Responde a este correo y le llega directo a quien la pidió."
        : `No ha dejado correo. Contacta por teléfono: ${s.telefono}`,
    ].join("\n"),
  };
}

/** El acuse que recibe quien la pidió. */
export function correoParaElCliente(s: Solicitud) {
  return {
    asunto: "Hemos recibido tu solicitud · MARACUYA",
    texto: [
      `Hola ${s.nombre}:`,
      "",
      "Tu solicitud de presupuesto ha llegado. La miramos y te respondemos con",
      "el precio y una fecha posible.",
      "",
      "Ni el precio ni la fecha están confirmados hasta que te contestemos: cada",
      "tarta se hace por encargo y depende del diseño y de cómo esté la agenda.",
      "",
      "Esto es lo que nos has contado:",
      "",
      resumirSolicitud(s),
      "",
      "Si quieres añadir algo o mandarnos una foto de referencia, respóndenos a",
      `este correo o escríbenos por WhatsApp al ${WHATSAPP_VISIBLE}.`,
      "",
      "Un saludo,",
      "MARACUYA mercado latino",
      CORREO,
    ].join("\n"),
  };
}

import { createServerFn } from "@tanstack/react-start";

import { altaEnBoletin } from "@/lib/alta-brevo";
import {
  FalloDeCorreo,
  mandarCorreo,
  remitenteAutenticado,
  BUZON,
  CLAVE,
  REMITENTE,
  type Adjunto,
} from "@/lib/correo-brevo";
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

function adjuntosDe(s: Solicitud): Adjunto[] {
  return s.foto ? [{ name: s.foto.nombre, content: s.foto.base64 }] : [];
}

export const enviarSolicitud = createServerFn({ method: "POST" })
  .validator(esquemaSolicitud)
  .handler(async ({ data }): Promise<Respuesta> => {
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
        // La pista solo viaja si la han pedido. Ver `diagnostico` en el
        // esquema: sin la marca, la respuesta no menciona el proveedor.
        ...(data.diagnostico && error instanceof FalloDeCorreo ? { pista: error.pista } : {}),
      };
    }

    // El boletín, si lo ha marcado. Va después del aviso al obrador y
    // antes del acuse, y cualquier fallo suyo se queda en el registro: la
    // tarta ya está pedida, y no se le va a decir a nadie que su
    // solicitud falló porque no pudimos apuntarle a unas recetas.
    if (data.boletin && data.correo) {
      const r = await altaEnBoletin(data.correo);
      if (r.estado !== "alta") {
        console.warn(
          `La solicitud salió, pero el alta en el boletín de ${data.correo} no: ` +
            (r.estado === "sin-configurar" ? "falta BREVO_LISTA_RECETAS." : r.pista),
        );
      }
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

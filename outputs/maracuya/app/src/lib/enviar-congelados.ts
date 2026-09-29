import { createServerFn } from "@tanstack/react-start";

import { altaEnBoletin } from "@/lib/alta-brevo";
import {
  BUZON,
  CLAVE,
  FalloDeCorreo,
  mandarCorreo,
  remitenteAutenticado,
} from "@/lib/correo-brevo";
import {
  correoCongeladosParaElCliente,
  correoCongeladosParaLaTienda,
  esquemaCongelados,
} from "@/lib/congelados";
import type { Respuesta } from "@/lib/solicitud";

/**
 * El envío de una solicitud de congelados.
 *
 * Misma mecánica que la de tartas y a propósito: el aviso a la tienda
 * primero, porque es el que hace falta para responder, y el acuse después
 * como extra. Si falla el acuse, la solicitud ya está donde tiene que
 * estar y se dice así en vez de dar el envío por fallido.
 */
export const enviarCongelados = createServerFn({ method: "POST" })
  .validator(esquemaCongelados)
  .handler(async ({ data }): Promise<Respuesta> => {
    const clave = CLAVE();
    if (!clave) return { estado: "sin-configurar" };

    const tienda = correoCongeladosParaLaTienda(data);
    try {
      await mandarCorreo(clave, {
        para: { email: BUZON(), name: "MARACUYA" },
        asunto: tienda.asunto,
        texto: tienda.texto,
        ...(data.correo ? { responderA: { email: data.correo, name: data.nombre } } : {}),
      });
    } catch (error) {
      console.error("No salió el aviso de congelados:", error);
      return {
        estado: "error",
        motivo: "No hemos podido enviar la solicitud. Prueba por WhatsApp o por correo.",
        ...(data.diagnostico && error instanceof FalloDeCorreo ? { pista: error.pista } : {}),
      };
    }

    // El boletín, si lo ha marcado. Su fallo se queda en el registro: nadie
    // se va a enterar de que su pedido "falló" por unas recetas.
    if (data.boletin && data.correo) {
      const r = await altaEnBoletin(data.correo);
      if (r.estado !== "alta") {
        console.warn(
          `La solicitud de congelados salió, pero el alta de ${data.correo} no: ` +
            (r.estado === "sin-configurar" ? "falta BREVO_LISTA_RECETAS." : r.pista),
        );
      }
    }

    if (!data.correo) return { estado: "enviada", acuse: false };

    // Desde un remitente gratuito el acuse acabaría en spam, así que se
    // calla: la pantalla, cuando no hay acuse, tampoco promete copia.
    if (!remitenteAutenticado()) return { estado: "enviada", acuse: false };

    const cliente = correoCongeladosParaElCliente(data);
    try {
      await mandarCorreo(clave, {
        para: { email: data.correo, name: data.nombre },
        asunto: cliente.asunto,
        texto: cliente.texto,
        responderA: { email: BUZON(), name: "MARACUYA mercado latino" },
      });
      return { estado: "enviada", acuse: true };
    } catch (error) {
      console.error("La solicitud de congelados llegó pero el acuse no:", error);
      return { estado: "enviada", acuse: false };
    }
  });

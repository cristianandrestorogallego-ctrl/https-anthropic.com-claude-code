import { createServerFn } from "@tanstack/react-start";

import { altaEnBoletin } from "@/lib/alta-brevo";
import { esquemaSuscripcion, type RespuestaBoletin } from "@/lib/boletin";

/**
 * El alta en el boletín desde el formulario del pie.
 *
 * Aquí apuntarse es lo único que se hace, así que el resultado del alta es
 * el resultado de la página. En el formulario de tartas es al revés: allí
 * es un extra y no puede tumbar la solicitud.
 */
export const suscribir = createServerFn({ method: "POST" })
  .validator(esquemaSuscripcion)
  .handler(async ({ data }): Promise<RespuestaBoletin> => {
    const r = await altaEnBoletin(data.correo);

    if (r.estado === "alta") return { estado: "apuntado" };
    if (r.estado === "sin-configurar") return { estado: "sin-configurar" };

    return {
      estado: "error",
      motivo: "No hemos podido apuntarte. Inténtalo más tarde.",
      // La pista solo viaja si la han pedido con ?diagnostico. Sin la
      // marca, la respuesta no menciona al proveedor de correo.
      ...(data.diagnostico ? { pista: r.pista } : {}),
    };
  });

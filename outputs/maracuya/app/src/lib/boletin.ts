import { z } from "zod";

/**
 * El boletín de recetas.
 *
 * El pie lleva tiempo prometiendo "recibe recetas" sin ofrecer dónde
 * apuntarse. Esto es lo que faltaba: un alta de verdad, con su propio
 * consentimiento.
 *
 * Su propio consentimiento, literalmente. Que alguien pida presupuesto de
 * una tarta no es permiso para mandarle publicidad: son dos permisos
 * distintos y se piden por separado. Mezclarlos es ilegal en España y,
 * además, es la vía rápida a que marquen la tienda como spam y dejen de
 * llegar los correos que sí importan.
 */

/** Cada cuánto sale. Se dice aquí y se cumple: es una promesa, no un adorno. */
export const CADENCIA = "cada semana";

export const esquemaSuscripcion = z.object({
  correo: z.string().email("Ese correo no tiene buena pinta.").max(120),

  /** Sin esto no se da de alta a nadie. */
  consentimiento: z.literal(true, {
    errorMap: () => ({ message: "Hay que aceptar recibir el boletín." }),
  }),

  /**
   * Pide que, si falla, la respuesta explique por qué. Igual que en el
   * formulario de tartas: solo lo manda la página abierta con
   * ?diagnostico, y sin la marca la respuesta no menciona al proveedor.
   */
  diagnostico: z.boolean().optional(),
});

export type Suscripcion = z.infer<typeof esquemaSuscripcion>;

/**
 * Lo que responde el servidor.
 *
 * No distingue entre un alta nueva y alguien que ya estaba: decir "ya
 * estabas apuntado" le confirmaría a cualquiera que escriba una dirección
 * ajena que esa dirección está en la lista. Se responde lo mismo siempre.
 */
export type RespuestaBoletin =
  | { estado: "apuntado" }
  | { estado: "sin-configurar" }
  | { estado: "error"; motivo: string; pista?: string };

/** Lo que se dice mientras el alta no esté conectada. Se enseña, no se esconde. */
export const FALTA_BOLETIN = "Todavía no está conectado.";

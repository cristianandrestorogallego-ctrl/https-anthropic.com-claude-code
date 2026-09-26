import { z } from "zod";

/**
 * Una solicitud de presupuesto de tarta.
 *
 * El mismo esquema lo usan el formulario y la función de servidor, así que
 * lo que el navegador manda y lo que el servidor acepta no pueden
 * separarse sin que salte el compilador.
 *
 * Nada de aquí es un pedido ni un cobro: es una petición de presupuesto
 * que se responde a mano.
 */
export const esquemaSolicitud = z.object({
  // Zona. El código postal manda; el municipio acompaña.
  codigoPostal: z.string().regex(/^\d{5}$/, "El código postal debe tener 5 cifras."),
  municipio: z.string().min(1, "Falta el municipio."),
  direccion: z.string().max(200).optional(),

  // La tarta.
  raciones: z.string().min(1),
  fecha: z.string().max(20).optional(),
  sabor: z.string().min(1),
  relleno: z.string().min(1),
  tematica: z.string().min(1),
  mensaje: z.string().max(80).optional(),
  alergenos: z.string().max(600).optional(),

  // Quién la pide.
  nombre: z.string().min(1, "Falta el nombre.").max(80),
  telefono: z.string().min(6, "Falta el teléfono.").max(30),
  correo: z
    .string()
    .email("Ese correo no tiene buena pinta.")
    .max(120)
    .optional()
    .or(z.literal("")),

  /**
   * La foto de referencia, ya reducida por el navegador, en base64 y sin
   * la cabecera "data:". Va limitada porque un adjunto enorme tumba el
   * envío: el navegador la deja muy por debajo de este tope.
   */
  foto: z
    .object({
      nombre: z.string().max(120),
      tipo: z.string().max(40),
      base64: z.string().max(4_000_000),
    })
    .optional(),

  /** Sin esto no se guarda ni se manda nada. */
  consentimiento: z.literal(true, {
    errorMap: () => ({ message: "Hay que aceptar el aviso de privacidad." }),
  }),

  /**
   * Trampa para robots. El campo está escondido y una persona nunca lo
   * ve, así que si llega con algo dentro, lo ha rellenado un programa.
   * No frena a nadie decidido, pero se lleva por delante el spam tonto
   * sin pedirle un captcha a quien sí quiere una tarta.
   */
  web: z.string().max(0).optional(),

  /**
   * Pide que, si falla, la respuesta explique por qué.
   *
   * Solo lo manda la página abierta con ?diagnostico, que es como se
   * revisa la configuración sin entrar en los registros del servidor. Sin
   * esta marca la respuesta no lleva ni una palabra sobre el proveedor de
   * correo: a quien pide una tarta no le importa, y no tiene por qué
   * enterarse de con qué está montada la tienda.
   */
  diagnostico: z.boolean().optional(),
});

export type Solicitud = z.infer<typeof esquemaSolicitud>;

/**
 * Lo que responde el servidor.
 *
 * "sin-configurar" no es un error: es la tienda diciendo que todavía no
 * tiene el envío conectado. La pantalla lo cuenta tal cual en vez de
 * fingir que la solicitud llegó a alguna parte.
 */
export type Respuesta =
  | { estado: "enviada"; acuse: boolean }
  | { estado: "sin-configurar" }
  | { estado: "error"; motivo: string; pista?: string };

/**
 * La solicitud en texto plano, para el cuerpo del correo.
 *
 * Va por bloques —dónde, qué tarta, quién— y cada bloque descarta sus
 * líneas vacías antes de juntarse. El formulario manda cadenas vacías, no
 * ausencias, así que sin este filtro el correo salía lleno de huecos.
 */
export function resumirSolicitud(s: Solicitud): string {
  const bloques = [
    [
      `Municipio: ${s.municipio}`,
      `Código postal: ${s.codigoPostal}`,
      s.direccion && `Dirección: ${s.direccion}`,
    ],
    [
      `Raciones: ${s.raciones}`,
      s.fecha && `Fecha deseada: ${s.fecha}`,
      `Sabor: ${s.sabor}`,
      `Relleno: ${s.relleno}`,
      `Temática: ${s.tematica}`,
      s.mensaje && `Mensaje sobre la tarta: ${s.mensaje}`,
      s.alergenos && `Alergias u observaciones: ${s.alergenos}`,
    ],
    [
      `Nombre: ${s.nombre}`,
      `Teléfono: ${s.telefono}`,
      s.correo && `Correo: ${s.correo}`,
      s.foto ? `Foto de referencia adjunta: ${s.foto.nombre}` : "Sin foto de referencia.",
    ],
  ];

  return bloques
    .map((b) => b.filter((l): l is string => typeof l === "string" && l !== "").join("\n"))
    .filter((b) => b !== "")
    .join("\n\n");
}

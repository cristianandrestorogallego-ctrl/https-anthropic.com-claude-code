import { z } from "zod";

import { productos, type Producto } from "@/lib/catalogo";

/**
 * Los congelados, que no se venden como el resto.
 *
 * El motivo no es comercial, es físico: la paquetería normal no lleva
 * producto congelado. No tiene cadena de frío y la mayoría lo excluye
 * expresamente. Un carrito que acepta yuca congelada y la manda por
 * mensajería está prometiendo algo que nadie va a cumplir, y el paquete
 * llega descongelado o no llega.
 *
 * Así que van por el mismo camino que las tartas: se piden, no se compran.
 * Quien los quiere dice qué y dónde, y la tienda contesta cómo y cuándo
 * puede llevarlos. Eso no es un formulario peor que un carrito: es el
 * único que dice la verdad sobre este producto.
 */

/** Los productos que llevan este trato, sacados del catálogo. */
export const productosCongelados: Producto[] = productos.filter(
  (p) => p.categoria === "congelados",
);

export function esCongelado(p: Producto): boolean {
  return p.categoria === "congelados";
}

/**
 * Lo que falta para que esto sea un servicio y no una promesa.
 *
 * Se enseña en pantalla, no solo aquí. Quien pida congelados tiene que
 * saber en qué estado está el servicio antes de esperar nada.
 */
export const QUE_FALTA_CONGELADOS = [
  "Confirmar con qué transportista o reparto propio se entregan, y en qué días.",
  "Decidir si hay pedido mínimo y desde cuándo sale a cuenta llevarlos.",
  "El aviso de privacidad, obligatorio antes de guardar los datos de nadie.",
];

/**
 * Por qué no se puede comprar directamente, dicho para quien lo lee.
 *
 * Sin adornos y sin disculpas: es una limitación real del transporte, no
 * una pega de la tienda. Decirlo claro genera más confianza que esconderlo
 * detrás de un botón que falla al final.
 */
export const POR_QUE_SE_PIDE =
  "La paquetería normal no lleva producto congelado: no tiene cadena de frío y la " +
  "mayoría lo excluye en sus condiciones. Por eso los congelados no van al carrito. " +
  "Dinos qué quieres y dónde estás, y te decimos cómo y cuándo podemos llevártelo.";

export const esquemaCongelados = z.object({
  // Zona. Mismo sistema que las tartas: es el mismo reparto.
  codigoPostal: z.string().regex(/^\d{5}$/, "El código postal debe tener 5 cifras."),
  municipio: z.string().min(1, "Falta el municipio."),
  direccion: z.string().max(200).optional(),

  /** Qué quiere, por id de producto. Al menos uno. */
  productos: z.array(z.string().max(80)).min(1, "Elige al menos un producto.").max(40),

  /** Lo que no está en la lista, o las cantidades. */
  detalle: z.string().max(600).optional(),

  // Quién lo pide.
  nombre: z.string().min(1, "Falta el nombre.").max(80),
  telefono: z.string().min(6, "Falta el teléfono.").max(30),
  correo: z
    .string()
    .email("Ese correo no tiene buena pinta.")
    .max(120)
    .optional()
    .or(z.literal("")),

  /** Las recetas de cada semana, si las quiere. Permiso aparte. */
  boletin: z.boolean().optional(),

  /** Sin esto no se guarda ni se manda nada. */
  consentimiento: z.literal(true, {
    errorMap: () => ({ message: "Hay que aceptar el aviso de privacidad." }),
  }),

  /** Ver `diagnostico` en solicitud.ts: solo lo manda ?diagnostico. */
  diagnostico: z.boolean().optional(),
});

export type SolicitudCongelados = z.infer<typeof esquemaCongelados>;

/**
 * La solicitud en texto plano, para el cuerpo del correo.
 *
 * Por bloques, y cada bloque descarta sus líneas vacías: el formulario
 * manda cadenas vacías, no ausencias, y sin este filtro el correo sale
 * lleno de huecos.
 */
export function resumirCongelados(s: SolicitudCongelados): string {
  const pedidos = s.productos
    .map((id) => productosCongelados.find((p) => p.id === id))
    .filter((p): p is Producto => p !== undefined)
    .map((p) => `  · ${p.nombre} — ${p.formato}`);

  const bloques = [
    [
      `Municipio: ${s.municipio}`,
      `Código postal: ${s.codigoPostal}`,
      s.direccion && `Dirección: ${s.direccion}`,
    ],
    [
      "Quiere estos congelados:",
      ...pedidos,
      s.detalle && `\nCantidades o lo que falte: ${s.detalle}`,
    ],
    [
      `Nombre: ${s.nombre}`,
      `Teléfono: ${s.telefono}`,
      s.correo && `Correo: ${s.correo}`,
      s.boletin && s.correo ? "Ha pedido además el boletín de recetas." : "",
    ],
  ];

  return bloques
    .map((b) => b.filter((l): l is string => typeof l === "string" && l !== "").join("\n"))
    .filter((b) => b !== "")
    .join("\n\n");
}

/** El aviso que llega a la tienda. */
export function correoCongeladosParaLaTienda(s: SolicitudCongelados) {
  return {
    asunto: `Congelados · ${s.nombre} · ${s.municipio} · ${s.productos.length} producto${
      s.productos.length === 1 ? "" : "s"
    }`,
    texto: [
      "Nueva solicitud de congelados desde la web.",
      "",
      resumirCongelados(s),
      "",
      "—",
      s.correo
        ? "Responde a este correo y le llega directo a quien lo pidió."
        : `No ha dejado correo. Contacta por teléfono: ${s.telefono}`,
    ].join("\n"),
  };
}

/**
 * El acuse a quien lo pidió.
 *
 * No confirma disponibilidad, ni precio, ni fecha, ni forma de entrega:
 * nada de eso está decidido hasta que una persona lo mire. Dice que la
 * solicitud llegó, y ya.
 */
export function correoCongeladosParaElCliente(s: SolicitudCongelados) {
  return {
    asunto: "Hemos recibido tu solicitud de congelados · MARACUYA",
    texto: [
      `Hola ${s.nombre}:`,
      "",
      "Tu solicitud ha llegado. La miramos y te decimos qué podemos llevarte, cómo",
      "y cuándo.",
      "",
      "Nada de eso está confirmado hasta que te contestemos: los congelados no van",
      "por paquetería normal, así que la entrega depende de tu zona y del día.",
      "",
      "Esto es lo que nos has pedido:",
      "",
      resumirCongelados(s),
      "",
      "Si quieres cambiar algo, respóndenos a este correo.",
      "",
      "Un saludo,",
      "MARACUYA mercado latino",
    ].join("\n"),
  };
}

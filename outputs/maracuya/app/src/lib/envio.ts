import { formatoPrecio } from "@/lib/catalogo";

/**
 * Las condiciones de envío, en un solo sitio.
 *
 * Estaban escritas a mano en cinco —la portada dos veces, la ficha de
 * producto, la descripción para buscadores y el carrito— y se habían
 * desviado de lo que cobraba Shopify, porque uno de los cinco sitios era
 * un panel de administración aparte y nada avisaba. Así que ahora hay un
 * solo número por cosa, y son los que están puestos en Shopify. Si no
 * coinciden, es un error.
 *
 * Shopify: Configuración → Envíos → perfil "Perfil general" → zona
 * "España peninsular". Una sola tarifa plana, con una condición de importe
 * mínimo. La recogida en tienda va aparte, en la ficha de la ubicación, y
 * no pasa por las tarifas: por eso el mínimo no la bloquea.
 *
 * Por qué estos números y no otros:
 *
 * Los productos de este catálogo pesan mucho para lo que valen —unos
 * 5,60 € de mercancía por kilo— y la paquetería cuesta unos 0,85 €/kg. Eso
 * hace que el envío sea un 15 % del valor de cualquier cesta, grande o
 * pequeña. La consecuencia incómoda es que el envío gratis cuesta lo mismo
 * en porcentaje donde quiera que se ponga el umbral, y que la cesta cruza
 * los 5 kg de un bulto a los 28 €: a partir de ahí, dos bultos.
 *
 * De ahí las tres decisiones:
 *
 * - Hay mínimo ({@link MINIMO}) porque un pedido de un solo producto
 *   cuesta más en tiempo de preparar que lo que deja.
 * - No hay envío gratis. Regalarlo en una cesta de 50 € costaba más que lo
 *   que se ganaba de más por venderla, así que el premio es un regalo
 *   ({@link REGALO_DESDE}), que cuesta una cuarta parte y se recuerda más.
 * - La recogida en tienda es gratis y sin mínimo, porque es la única forma
 *   de "gratis" que no cuesta nada: ni caja, ni transportista.
 */

/** Lo que cobra Shopify por un envío a península. Plano, sin tramos. */
export const PRECIO = 6.99;

/**
 * Por debajo de este importe, Shopify no ofrece envío.
 *
 * Shopify no tiene una casilla de "pedido mínimo": se hace poniéndole esta
 * condición de importe a la tarifa, y por debajo el cliente llega al pago
 * y no ve ninguna forma de envío. Sin explicación. Por eso el mínimo se
 * dice antes —en la ficha, en la cesta y en la página de envíos— y no se
 * deja que lo descubra ahí.
 */
export const MINIMO = 24.99;

/**
 * Desde aquí va un regalo en la caja. Desde el doble, dos.
 *
 * Esto no lo hace Shopify: lo pone una persona al empaquetar. No hay
 * descuento configurado ni app, a propósito —el "compra X y llévate Y" de
 * Shopify exige que el cliente añada el regalo al carrito él mismo, que es
 * justo lo que no va a hacer—. Así que la web lo promete y la mano lo
 * cumple. Si un día deja de cumplirse, hay que quitarlo de la web el mismo
 * día.
 */
export const REGALO_DESDE = 39.99;
export const REGALO_DOBLE_DESDE = 59.99;

/**
 * El plazo que promete la web.
 *
 * No es un dato del transportista: es el margen que se anuncia. Sendcloud
 * da un día para la entrega a domicilio de InPost, así que 24-72 h se
 * cumple con holgura —pero solo si está activado un método de entrega a
 * domicilio. Con solo métodos de punto de recogida activados, el plazo
 * real son 3-4 días y esta frase deja de ser verdad.
 */
export const PLAZO = "24-72 h laborables";

/**
 * Hasta dónde llega el reparto por paquetería.
 *
 * Se escribe siempre tal cual, con la E mayúscula: es un nombre propio.
 * Quien lo meta en una frase que empieza por minúscula tiene que
 * reescribir la frase, no bajarle la mayúscula al país.
 */
export const ZONA = "España peninsular";

/**
 * Lo que queda fuera, dicho con nombres.
 *
 * Son las provincias que la zona de Shopify no incluye: están fuera del
 * territorio aduanero y del IVA peninsular, y cuestan bastante más de
 * enviar. Decirlo en la ficha evita que alguien llegue al pago y se
 * encuentre con que no hay forma de envío.
 */
export const FUERA = ["Baleares", "Canarias", "Ceuta", "Melilla"];

/** Donde se recoge, para quien lo tenga a mano. */
export const RECOGIDA = {
  calle: "Carrer del dr Fleming 22",
  municipio: "Sant Andreu de la Barca",
  cp: "08740",
  /** Lo que dice Shopify en el pago. Cambiarlo allí y aquí a la vez. */
  listoEn: "24 h",
};

/**
 * Un importe en euros redondos.
 *
 * `formatoPrecio` siempre pone los céntimos, que es lo correcto para un
 * precio —2,95 €— y chirría en un umbral: "desde 55,00 €" se lee como si
 * los céntimos importaran. Aquí se quitan si no hacen falta, y se quedan
 * si el umbral deja de ser redondo, que es el caso de 24,99 €.
 */
export const umbral = (valor: number) =>
  `${valor.toLocaleString("es-ES", { maximumFractionDigits: 2 })} €`;

/** "6,99 €, con un pedido mínimo de 24,99 €" */
export const precioYMinimo = () =>
  `${formatoPrecio(PRECIO)}, con un pedido mínimo de ${umbral(MINIMO)}`;

/** "Baleares, Canarias, Ceuta ni Melilla" */
export const listaFuera = () =>
  FUERA.length < 2
    ? FUERA.join("")
    : `${FUERA.slice(0, -1).join(", ")} ni ${FUERA[FUERA.length - 1]}`;

/**
 * Qué decirle a quien tiene la cesta a medias.
 *
 * Devuelve el estado además del texto para que la cesta pueda pintarlo
 * distinto: lo que falta para poder enviar no es una buena noticia y lo
 * del regalo sí, y con un solo string no se puede distinguir.
 */
export type AvisoCesta =
  | { estado: "vacia"; texto: string }
  | { estado: "falta-minimo"; falta: number; texto: string }
  | { estado: "falta-regalo"; falta: number; texto: string }
  | { estado: "regalo"; texto: string }
  | { estado: "regalo-doble"; texto: string };

export function avisoCesta(total: number): AvisoCesta {
  if (total <= 0) {
    return {
      estado: "vacia",
      texto: `Envío ${umbral(PRECIO)} desde ${umbral(MINIMO)}. Recogida en tienda gratis, sin mínimo.`,
    };
  }

  if (total < MINIMO) {
    return {
      estado: "falta-minimo",
      falta: MINIMO - total,
      texto:
        `Te faltan ${formatoPrecio(MINIMO - total)} para que podamos enviártelo. ` +
        `O recógelo en tienda, que no tiene mínimo.`,
    };
  }

  if (total < REGALO_DESDE) {
    return {
      estado: "falta-regalo",
      falta: REGALO_DESDE - total,
      texto: `Te faltan ${formatoPrecio(REGALO_DESDE - total)} y te metemos un regalo en la caja.`,
    };
  }

  if (total < REGALO_DOBLE_DESDE) {
    return {
      estado: "regalo",
      texto: `Llevas regalo. Desde ${umbral(REGALO_DOBLE_DESDE)}, van dos.`,
    };
  }

  return { estado: "regalo-doble", texto: "Llevas dos regalos en la caja." };
}

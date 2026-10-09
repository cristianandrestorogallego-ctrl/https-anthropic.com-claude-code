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

/**
 * Lo que cobra Shopify por un envío a península, por tramos de peso.
 *
 * Era una tarifa plana de 6,99 € hasta que se pudieron consultar los
 * precios reales de Correos: a domicilio cuesta ~5 € hasta 5 kg, pero 7,19 €
 * de 5 a 10 y 11,96 € de 20 a 30. Con 6,99 € fijos, cualquier cesta de más
 * de 5 kg se enviaba perdiendo dinero, y en un catálogo que pesa lo que
 * pesa este —harina, botellas, conservas— eso es media tienda.
 *
 * Cada tramo son unos dos euros por encima de lo que cuesta. No es el
 * margen del pedido: es lo que cuesta la caja, el papel y el rato de
 * prepararlo.
 *
 * El cliente nunca ve esta tabla al pagar: Shopify le enseña solo el tramo
 * que le toca, como un precio y ya. Por eso la web anuncia "desde 6,99 €"
 * y enseña la tabla entera en la página de envíos, que es donde quien
 * quiera cuadrarlo puede hacerlo.
 *
 * Si cambia el recargo de combustible de Correos (ahora 11,80 %, se revisa
 * cada mes) estos precios se quedan cortos. Hay que volver a mirarlos.
 */
export const TRAMOS = [
  { hasta: 5, precio: 6.99 },
  { hasta: 10, precio: 8.99 },
  { hasta: 15, precio: 9.99 },
  { hasta: 20, precio: 11.49 },
  { hasta: 30, precio: 13.99 },
] as const;

export type Tramo = (typeof TRAMOS)[number];

/**
 * El envío más barato, que es el que se anuncia.
 *
 * Siempre con un "desde" delante. Decir "Envío 6,99 €" a secas sería
 * mentira en cuanto la cesta pase de cinco kilos.
 */
export const PRECIO_DESDE = TRAMOS[0].precio;

/**
 * Lo que admite un bulto de Correos. Por encima no hay tarifa en Shopify, y
 * el cliente se queda sin forma de envío: harían falta dos bultos y eso aún
 * no está montado.
 */
export const PESO_MAXIMO = Math.max(...TRAMOS.map((t) => t.hasta));

/**
 * Por debajo de este importe no se envía.
 *
 * Ojo: esto es la política de la tienda, no una regla que aplique Shopify.
 * Lo era —una condición de importe en la tarifa— hasta que el envío pasó a
 * cobrarse por tramos de peso: una tarifa de Shopify admite condición de
 * importe o de peso, pero no las dos a la vez, y los tramos valen más,
 * porque sin ellos se perdía dinero en cada cesta grande.
 *
 * Bloquearlo en la cesta tampoco sirve: apagaría el botón también para
 * quien viene a recoger en tienda, y la recogida no tiene mínimo. Así que
 * hoy el mínimo lo sostiene lo que se dice —la cesta avisa de cuánto
 * falta—, no un candado. Si alguna vez hace falta el candado, se monta con
 * una función de validación de Shopify, que es una app aparte.
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

/** "Desde 6,99 € según el peso, con un pedido mínimo de 24,99 €" */
export const precioYMinimo = () =>
  `Desde ${formatoPrecio(PRECIO_DESDE)} según el peso, con un pedido mínimo de ${umbral(MINIMO)}`;

/**
 * "Hasta 5 kg", "De 5 a 10 kg". El rótulo de cada tramo de la tabla.
 *
 * Recibe el tramo anterior en vez de buscarlo por índice: el primero no
 * tiene anterior, y así eso se ve en el tipo en lugar de resolverse con un
 * caso especial dentro.
 */
export const etiquetaTramo = (tramo: Tramo, anterior?: Tramo) =>
  anterior ? `De ${anterior.hasta} a ${tramo.hasta} kg` : `Hasta ${tramo.hasta} kg`;

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
      texto: `Envío desde ${umbral(PRECIO_DESDE)} con un pedido de ${umbral(MINIMO)}. Recogida en tienda gratis, sin mínimo.`,
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

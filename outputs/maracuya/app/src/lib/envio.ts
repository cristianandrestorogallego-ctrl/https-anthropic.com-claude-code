import { formatoPrecio } from "@/lib/catalogo";

/**
 * Las condiciones de envío, en un solo sitio.
 *
 * Estaban escritas a mano en cinco: la portada (dos veces), la ficha de
 * producto, la descripción para buscadores y el carrito. Y se habían
 * desviado de lo que cobra Shopify de verdad: la web decía 4,95 € y gratis
 * desde 49 €, Shopify cobraba 6,99 € y gratis desde 55 €. Nadie mintió a
 * propósito; es lo que pasa cuando el mismo dato vive en cinco ficheros y
 * uno de ellos es un panel de administración aparte.
 *
 * Así que ahora hay un solo número por cosa, y estos números son los que
 * están puestos en Shopify. Si cambian allí, cambian aquí, y la web entera
 * cambia con ellos. Si no coinciden, es un error.
 *
 * Shopify: Configuración → Envíos → perfil "Perfil general" → zona
 * "España peninsular". La tarifa cobra {@link PRECIO} y pasa a cero a
 * partir de {@link GRATIS_DESDE}.
 */

/** Lo que cobra Shopify por un envío a península. */
export const PRECIO = 6.99;

/** A partir de este total, Shopify no cobra envío. */
export const GRATIS_DESDE = 55;

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

/**
 * El umbral, en euros redondos.
 *
 * `formatoPrecio` siempre pone los céntimos, que es lo correcto para un
 * precio —2,95 €— y chirría en un umbral: "gratis desde 55,00 €" se lee
 * como si los céntimos importaran. Aquí se quitan si no hacen falta, y se
 * quedan si el umbral deja de ser redondo.
 */
export const umbral = (valor: number) =>
  `${valor.toLocaleString("es-ES", { maximumFractionDigits: 2 })} €`;

/** "6,99 € y gratis a partir de 55 €" */
export const precioYGratis = () =>
  `${formatoPrecio(PRECIO)} y gratis a partir de ${umbral(GRATIS_DESDE)}`;

/** "gratis desde 55 €" */
export const gratisDesde = () => `gratis desde ${umbral(GRATIS_DESDE)}`;

/** "Baleares, Canarias, Ceuta ni Melilla" */
export const listaFuera = () =>
  FUERA.length < 2
    ? FUERA.join("")
    : `${FUERA.slice(0, -1).join(", ")} ni ${FUERA[FUERA.length - 1]}`;

/**
 * El peso de un pedido, y por qué el de cada producto es el que es.
 *
 * En Shopify cada producto lleva su contenido neto más un 15 % por el
 * envase, redondeado a 5 g. Es una regla única y declarada, no una
 * estimación por producto: se queda corta en los tarros de cristal y se
 * pasa en las bolsas de harina, y en una cesta mezclada se compensa. Sin
 * ella los 172 estaban a cero, y un pedido a cero kilos no da etiqueta.
 *
 * Lo que no declara masa en su formato —lo que se vende por unidades y las
 * tartas por centímetros— se quedó sin peso a propósito: inventarlo sería
 * inventarlo. Tampoco hace falta, porque eso no sale por paquetería.
 *
 * El peso de la caja en sí no está aquí ni en Shopify: va en Sendcloud,
 * que es donde se hace la etiqueta.
 */
export const MARGEN_ENVASE = 0.15;

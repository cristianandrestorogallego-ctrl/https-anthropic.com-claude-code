/**
 * WhatsApp.
 *
 * En el público latino de España es el canal por defecto: mucha gente
 * prefiere preguntar antes de comprar, y hacerlo por ahí. El enlace abre
 * la conversación con el mensaje ya escrito; no envía nada solo.
 */

/**
 * El número de atención de la tienda, en formato internacional y sin signos.
 *
 * Confirmado por Cristian. Es el único sitio donde vive: el carrito, las
 * tartas y el pie lo sacan de aquí, así que para cambiarlo basta con tocar
 * estas dos líneas.
 */
export const WHATSAPP_NUMERO = "34607636226";

/** Cómo se enseña, ya con separaciones. */
export const WHATSAPP_VISIBLE = "+34 607 63 62 26";

/** Un enlace de WhatsApp con el mensaje preparado. */
export function enlaceWhatsapp(mensaje: string): string {
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`;
}

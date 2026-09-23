/**
 * Por dónde se contacta con la tienda.
 *
 * El correo vive aquí y en ningún otro sitio, igual que el número de
 * WhatsApp: cuando cambie, se toca una línea. El que había antes en el
 * pie —hola@maracuya.es— me lo había inventado yo para rellenar, y un
 * correo que no existe en la página de una tienda es peor que ninguno.
 */

/** El correo de atención. Confirmado por Cristian. */
export const CORREO = "maracuyalatina@gmail.com";

/**
 * Un enlace para escribir, con el asunto y el cuerpo ya puestos.
 *
 * Abre el programa de correo del cliente; no envía nada por su cuenta. Si
 * no tiene ninguno configurado, no pasará nada, así que esto es una vía
 * secundaria y nunca la única.
 */
export function enlaceCorreo(asunto?: string, cuerpo?: string): string {
  const partes: string[] = [];
  if (asunto) partes.push(`subject=${encodeURIComponent(asunto)}`);
  if (cuerpo) partes.push(`body=${encodeURIComponent(cuerpo)}`);
  return partes.length ? `mailto:${CORREO}?${partes.join("&")}` : `mailto:${CORREO}`;
}

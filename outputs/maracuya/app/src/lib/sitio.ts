/**
 * En qué momento está el sitio.
 */

/**
 * ¿La tienda está lanzada?
 *
 * Mientras esté en false, cada página pide a los buscadores que no la
 * indexen. Lo que hay publicado son productos, marcas y precios de
 * demostración, y no interesa que Google los asocie a MARACUYA antes de
 * que la tienda exista de verdad: sacar de los resultados algo que ya se
 * indexó cuesta semanas.
 *
 * El día del lanzamiento hay que tocar dos sitios, no uno:
 *   1. esta línea, que es la que quita la etiqueta noindex
 *   2. public/robots.txt, que además pide que no rastreen
 *
 * Van separados porque hacen cosas distintas: robots.txt lo respeta quien
 * quiere, y la etiqueta es la que de verdad mantiene la página fuera del
 * índice de quien sí entra.
 */
export const TIENDA_PUBLICADA = false;

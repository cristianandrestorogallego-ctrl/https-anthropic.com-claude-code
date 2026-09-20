/**
 * La cuenta del cliente.
 *
 * La tienda va hacia un montaje donde el escaparate vive aquí, en React
 * sobre Vercel, y Shopify lleva productos, precios, existencias y cobros.
 * En ese montaje las cuentas las pone Shopify: el cliente entra con un
 * código de un solo uso que le llega al correo, y de ahí salen su
 * historial, sus envíos y sus direcciones.
 *
 * Hasta que eso esté conectado, esta pantalla enseña cómo será y lo dice
 * en voz alta. No guarda a nadie, no manda ningún código y —sobre todo—
 * no enseña pedidos inventados: una cuenta con pedidos falsos dentro es
 * peor que no tener cuenta.
 */

/** Interruptor único. Mientras sea false, aquí no se crea ninguna cuenta. */
export const CUENTAS_CONECTADAS = false;

/**
 * Qué falta para que la cuenta funcione de verdad. Se enseña en pantalla,
 * no solo en un comentario: quien lo pruebe tiene que saber dónde está.
 */
export const QUE_FALTA_CUENTA = [
  "Conectar el catálogo de Shopify, para que haya productos y precios reales de los que hacer pedidos.",
  "Activar las cuentas de cliente en Shopify y enlazarlas con esta web.",
  "La política de privacidad y el aviso de tratamiento de datos, obligatorios antes de guardar a nadie.",
];

export type Ventaja = {
  clave: string;
  titulo: string;
  descripcion: string;
};

/**
 * Lo que la cuenta traerá. Redactado en futuro a propósito: hoy no hace
 * ninguna de estas cosas y el texto no debe sugerir lo contrario.
 */
export const ventajas: Ventaja[] = [
  {
    clave: "pedidos",
    titulo: "Tus pedidos",
    descripcion:
      "Todo lo que hayas comprado, con su fecha y su importe, sin tener que buscar el correo de confirmación.",
  },
  {
    clave: "seguimiento",
    titulo: "Seguimiento del envío",
    descripcion:
      "Por dónde va el paquete y cuándo se espera, desde que sale hasta que llega a tu puerta.",
  },
  {
    clave: "direcciones",
    titulo: "Tus direcciones",
    descripcion:
      "Guardadas para la próxima vez. La de casa, la del trabajo o la de quien recibe el pedido por ti.",
  },
  {
    clave: "deseos",
    titulo: "Lista de deseos",
    descripcion:
      "Lo que te ha gustado y todavía no has comprado, guardado en tu cuenta y no en el navegador de un móvil concreto.",
  },
];

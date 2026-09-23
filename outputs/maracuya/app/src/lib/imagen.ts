/**
 * Reducir una foto antes de mandarla.
 *
 * Las fotos de móvil pesan tres o cuatro megas y van a viajar adjuntas a
 * un correo. Reducirlas en el navegador, antes de subir nada, evita
 * esperas largas con datos móviles y que el adjunto rebote por tamaño.
 *
 * Es el mismo recorte y compresión que usé para las fotos de la galería:
 * un lienzo, un redibujo y WebP. A 1400 px de lado largo, una foto de
 * referencia se ve de sobra para saber qué tarta quiere el cliente.
 */

const LADO_MAXIMO = 1400;
const CALIDAD = 0.82;

export type FotoReducida = {
  nombre: string;
  tipo: string;
  /** Sin la cabecera "data:...;base64,". */
  base64: string;
  /** Lo que ocupa ya reducida, en bytes. */
  peso: number;
};

/**
 * Devuelve la foto reducida, o null si el navegador no ha podido con
 * ella. Que falle no es grave: la solicitud sale igual, sin foto.
 */
export async function reducirFoto(archivo: File): Promise<FotoReducida | null> {
  try {
    const mapa = await crearImagen(archivo);
    const escala = Math.min(1, LADO_MAXIMO / Math.max(mapa.width, mapa.height));
    const lienzo = document.createElement("canvas");
    lienzo.width = Math.round(mapa.width * escala);
    lienzo.height = Math.round(mapa.height * escala);

    const ctx = lienzo.getContext("2d");
    if (!ctx) return null;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(mapa, 0, 0, lienzo.width, lienzo.height);
    if ("close" in mapa) mapa.close();

    const url = lienzo.toDataURL("image/webp", CALIDAD);
    const base64 = url.split(",")[1];
    if (!base64) return null;

    return {
      // El nombre original con la extensión que le toca ahora.
      nombre: `${archivo.name.replace(/\.[^.]+$/, "")}.webp`,
      tipo: "image/webp",
      base64,
      peso: Math.round((base64.length * 3) / 4),
    };
  } catch {
    return null;
  }
}

/** createImageBitmap donde lo haya; si no, un <img> de toda la vida. */
async function crearImagen(archivo: File): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === "function") return createImageBitmap(archivo);
  const url = URL.createObjectURL(archivo);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}

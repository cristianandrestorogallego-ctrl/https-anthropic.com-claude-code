import { productoPorId, type IngredienteReceta, type Producto, type Receta } from "@/lib/catalogo";

/**
 * Cálculo del paquete de ingredientes de una receta.
 *
 * La regla que hace útil esto: la receta pide una cantidad, pero el producto
 * se vende en envases cerrados. Si la receta necesita 250 g y el envase es de
 * 1 kg, compras un envase y te sobran 750 g — y eso hay que decirlo, no
 * esconderlo detrás de un precio.
 *
 * Tres grupos, que nunca se mezclan:
 *   paquete → lo que MARACUYA te vende
 *   aparte  → fresco que consigues tú (carne, cebolla)
 *   basico  → despensa que ya tienes (sal, aceite, agua)
 */

export type LineaPaquete = {
  ingrediente: IngredienteReceta;
  producto: Producto;
  /** Cantidad que pide la receta para las raciones elegidas. */
  necesario: number;
  /** Envases completos que hay que comprar. */
  envases: number;
  /** Lo que sobra tras cocinar, en la unidad del ingrediente. */
  sobra: number;
  precio: number;
  /** Marcado para comprar. El cliente puede desmarcar lo que ya tenga. */
  elegido: boolean;
  disponible: boolean;
};

export type Paquete = {
  lineas: LineaPaquete[];
  aparte: IngredienteReceta[];
  basicos: IngredienteReceta[];
  /** Total de lo marcado y disponible. */
  total: number;
  /** Líneas marcadas que están agotadas: no se pueden comprar. */
  agotadas: LineaPaquete[];
  /** Verdadero solo si TODO lo vendible está marcado y disponible. */
  completo: boolean;
};

export function calcularPaquete(
  receta: Receta,
  raciones: number,
  desmarcados: ReadonlySet<string>,
): Paquete {
  const factor = raciones / receta.racionesBase;
  const lineas: LineaPaquete[] = [];
  const aparte: IngredienteReceta[] = [];
  const basicos: IngredienteReceta[] = [];

  for (const ingrediente of receta.ingredientes) {
    if (ingrediente.tipo === "aparte") {
      aparte.push(ingrediente);
      continue;
    }
    if (ingrediente.tipo === "basico") {
      basicos.push(ingrediente);
      continue;
    }

    const producto = ingrediente.productoId ? productoPorId(ingrediente.productoId) : undefined;
    // Un ingrediente marcado como "paquete" cuyo producto no está en el
    // catálogo no se inventa: pasa a ser algo que consigues por tu cuenta.
    if (!producto) {
      aparte.push(ingrediente);
      continue;
    }

    const necesario = ingrediente.cantidadPorRacion * factor;
    const contenido = ingrediente.contenidoEnvase ?? 0;
    const envases = contenido > 0 ? Math.ceil(necesario / contenido) : 1;
    const sobra = contenido > 0 ? Math.max(0, envases * contenido - necesario) : 0;

    lineas.push({
      ingrediente,
      producto,
      necesario,
      envases,
      sobra,
      precio: producto.precio * envases,
      elegido: !desmarcados.has(ingrediente.productoId!),
      disponible: producto.disponible,
    });
  }

  const comprables = lineas.filter((l) => l.elegido && l.disponible);
  const agotadas = lineas.filter((l) => l.elegido && !l.disponible);

  return {
    lineas,
    aparte,
    basicos,
    total: comprables.reduce((suma, l) => suma + l.precio, 0),
    agotadas,
    // "Paquete completo" solo cuando de verdad lo es. Si falta una línea,
    // por desmarcada o por agotada, es una selección parcial y se dice así.
    completo: lineas.length > 0 && comprables.length === lineas.length,
  };
}

/** Redondea para mostrar: 250 g, no 250.00000000000003 g. */
export function cantidad(valor: number, unidad: string) {
  const redondeado = Math.round(valor * 100) / 100;
  return `${redondeado} ${unidad}`;
}

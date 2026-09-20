/**
 * Tartas personalizadas.
 *
 * TODO ESTE ARCHIVO ES CONFIGURACIÓN. Es lo que un día vivirá en la
 * administración: galería, opciones del formulario y zonas de servicio.
 * Está en un solo sitio y con una forma plana a propósito, para que
 * trasladarlo a metaobjetos de Shopify sea copiar campos, no reescribir.
 *
 * Nada de aquí es un precio ni una promesa. Las tartas van bajo
 * presupuesto: se pide, se estudia y se responde.
 */

/** Interruptor único. Mientras sea false, el formulario NO envía nada. */
export const ENVIO_CONECTADO = false;

/**
 * Qué falta para recibir solicitudes de verdad. Se enseña en pantalla, no
 * solo en un comentario: quien lo pruebe tiene que saber en qué estado está.
 */
export const QUE_FALTA = [
  "Un destino al que mandar la solicitud: un correo, un formulario de Shopify o un pedido en borrador.",
  "Un sitio donde guardar la imagen de referencia que adjunte el cliente.",
  "El aviso de recepción: el correo automático que confirma que la solicitud ha llegado.",
];

export type Tarta = {
  id: string;
  nombre: string;
  descripcion: string;
  /** Raciones orientativas de la tarta del ejemplo. */
  raciones: number;
  /** Foto real. Mientras no la haya, la baldosa enseña un hueco con su nombre. */
  imagen?: string;
};

/** Galería de ejemplo. Editable: añade, quita y reordena. */
export const galeria: Tarta[] = [
  {
    id: "tres-leches",
    nombre: "Tres leches",
    descripcion: "Bizcocho calado y nata montada. La de toda la vida.",
    raciones: 12,
  },
  {
    id: "chocolate-arequipe",
    nombre: "Chocolate y arequipe",
    descripcion: "Capas de chocolate con relleno de dulce de leche.",
    raciones: 16,
  },
  {
    id: "maracuya",
    nombre: "Maracuyá",
    descripcion: "Mousse ácida sobre base de galleta.",
    raciones: 10,
  },
  {
    id: "infantil-tematica",
    nombre: "Temática infantil",
    descripcion: "Figura o dibujo sobre la tarta, a elegir.",
    raciones: 20,
  },
  {
    id: "torta-negra",
    nombre: "Torta negra",
    descripcion: "Frutas maceradas y especias. Para fechas señaladas.",
    raciones: 24,
  },
  {
    id: "naked-frutas",
    nombre: "Con fruta fresca",
    descripcion: "Bizcocho a la vista y fruta de temporada por encima.",
    raciones: 14,
  },
];

/** Opciones del formulario. Editables. */
export const raciones = [6, 10, 12, 16, 20, 24, 30, 40] as const;

export const sabores = ["Vainilla", "Chocolate", "Tres leches"] as const;

export const rellenos = [
  "Arequipe (dulce de leche)",
  "Crema pastelera",
  "Nata",
  "Chocolate",
  "Maracuyá",
  "Limón",
  "Mermelada de mora",
  "Fruta fresca",
  "Sin relleno",
  "Otros",
] as const;

/**
 * El relleno que no está en la lista.
 *
 * Al elegirlo aparece un campo para escribir cuál, y es ese texto —no la
 * palabra "Otros"— el que viaja en la solicitud: a quien la lee le sirve
 * "crema de café", no "otros".
 */
export const RELLENO_OTROS = "Otros";

export const tematicas = [
  "Cumpleaños",
  "Infantil",
  "Bautizo o comunión",
  "Boda",
  "Aniversario",
  "Corporativa",
  "Sin temática",
] as const;

/**
 * Zonas de servicio.
 *
 * Solo provincia de Barcelona, que es todo el prefijo postal 08. Cada
 * municipio trae sus códigos como ayuda para detectar una errata; la
 * comprobación dura es la provincia, porque esta lista es un punto de
 * partida que hay que verificar, no un censo.
 */
export const PREFIJO_PROVINCIA = "08";

export type Municipio = { nombre: string; codigos: string[] };

export const municipiosServidos: Municipio[] = [
  // --- Barcelonès y área metropolitana ---
  {
    nombre: "Badalona",
    codigos: ["08911", "08912", "08913", "08914", "08915", "08916", "08917", "08918"],
  },
  {
    nombre: "Barcelona",
    codigos: Array.from({ length: 42 }, (_, i) => `080${String(i + 1).padStart(2, "0")}`),
  },
  {
    nombre: "L'Hospitalet de Llobregat",
    codigos: ["08901", "08902", "08903", "08904", "08905", "08906", "08907", "08908"],
  },
  { nombre: "Sant Adrià de Besòs", codigos: ["08930"] },
  { nombre: "Santa Coloma de Gramenet", codigos: ["08921", "08922", "08923", "08924"] },

  // --- Baix Llobregat, comarca entera ---
  { nombre: "Abrera", codigos: ["08630"] },
  { nombre: "Begues", codigos: ["08859"] },
  { nombre: "Castelldefels", codigos: ["08860"] },
  { nombre: "Castellví de Rosanes", codigos: ["08769"] },
  { nombre: "Cervelló", codigos: ["08758"] },
  { nombre: "Collbató", codigos: ["08293"] },
  { nombre: "Corbera de Llobregat", codigos: ["08757"] },
  { nombre: "Cornellà de Llobregat", codigos: ["08940"] },
  { nombre: "El Papiol", codigos: ["08754"] },
  { nombre: "El Prat de Llobregat", codigos: ["08820"] },
  { nombre: "Esparreguera", codigos: ["08292"] },
  { nombre: "Esplugues de Llobregat", codigos: ["08950"] },
  { nombre: "Gavà", codigos: ["08850"] },
  { nombre: "La Palma de Cervelló", codigos: ["08756"] },
  { nombre: "Martorell", codigos: ["08760"] },
  { nombre: "Molins de Rei", codigos: ["08750"] },
  { nombre: "Olesa de Montserrat", codigos: ["08640"] },
  { nombre: "Pallejà", codigos: ["08780"] },
  { nombre: "Sant Andreu de la Barca", codigos: ["08740"] },
  { nombre: "Sant Boi de Llobregat", codigos: ["08830"] },
  { nombre: "Sant Climent de Llobregat", codigos: ["08849"] },
  { nombre: "Sant Esteve Sesrovires", codigos: ["08635"] },
  { nombre: "Sant Feliu de Llobregat", codigos: ["08980"] },
  { nombre: "Sant Joan Despí", codigos: ["08970"] },
  { nombre: "Sant Just Desvern", codigos: ["08960"] },
  { nombre: "Sant Vicenç dels Horts", codigos: ["08620"] },
  { nombre: "Santa Coloma de Cervelló", codigos: ["08690"] },
  { nombre: "Torrelles de Llobregat", codigos: ["08629"] },
  { nombre: "Vallirana", codigos: ["08759"] },
  { nombre: "Viladecans", codigos: ["08840"] },

  // --- Anoia ---
  { nombre: "Calaf", codigos: ["08280"] },
  { nombre: "Capellades", codigos: ["08786"] },
  { nombre: "El Bruc", codigos: ["08294"] },
  { nombre: "Els Hostalets de Pierola", codigos: ["08781"] },
  { nombre: "Igualada", codigos: ["08700"] },
  { nombre: "La Llacuna", codigos: ["08779"] },
  { nombre: "La Pobla de Claramunt", codigos: ["08787"] },
  { nombre: "La Torre de Claramunt", codigos: ["08789"] },
  { nombre: "Masquefa", codigos: ["08783"] },
  { nombre: "Òdena", codigos: ["08711"] },
  { nombre: "Piera", codigos: ["08784"] },
  { nombre: "Sant Martí de Tous", codigos: ["08712"] },
  { nombre: "Santa Margarida de Montbui", codigos: ["08710"] },
  { nombre: "Vallbona d'Anoia", codigos: ["08785"] },
  { nombre: "Vilanova del Camí", codigos: ["08788"] },

  // --- Vallès y Maresme, el resto del área servida ---
  { nombre: "Barberà del Vallès", codigos: ["08210"] },
  { nombre: "Cerdanyola del Vallès", codigos: ["08290"] },
  { nombre: "Granollers", codigos: ["08400", "08401", "08402"] },
  { nombre: "Mataró", codigos: ["08301", "08302", "08303", "08304"] },
  { nombre: "Mollet del Vallès", codigos: ["08100"] },
  { nombre: "Montcada i Reixac", codigos: ["08110"] },
  { nombre: "Ripollet", codigos: ["08291"] },
  { nombre: "Rubí", codigos: ["08191"] },
  {
    nombre: "Sabadell",
    codigos: ["08201", "08202", "08203", "08204", "08205", "08206", "08207", "08208"],
  },
  { nombre: "Sant Cugat del Vallès", codigos: ["08172", "08173", "08174", "08195", "08197"] },
  {
    nombre: "Terrassa",
    codigos: ["08221", "08222", "08223", "08224", "08225", "08226", "08227", "08228"],
  },
];

/**
 * Del código postal al municipio, cuando no hay duda.
 *
 * Solo rellena si un único municipio tiene ese código exacto. Si el código
 * no está en la lista o lo comparten varios, no inventa: deja elegir. Un
 * autocompletado que acierta a medias molesta más que no existir.
 */
export function municipioPorCodigo(codigoPostal: string): string | null {
  const coincidencias = municipiosServidos.filter((m) => m.codigos.includes(codigoPostal));
  return coincidencias.length === 1 ? coincidencias[0]!.nombre : null;
}

/** Y al revés: solo si el municipio tiene un código y nada más. */
export function codigoPorMunicipio(municipio: string): string | null {
  const m = municipiosServidos.find((x) => x.nombre === municipio);
  return m && m.codigos.length === 1 ? m.codigos[0]! : null;
}

export type Cobertura =
  | { estado: "vacio" }
  | { estado: "formato" }
  | { estado: "fuera-provincia" }
  | { estado: "municipio-sin-servicio" }
  | { estado: "desajuste"; municipio: string }
  | { estado: "ok"; municipio: string };

/**
 * Decide si se puede entregar.
 *
 * El "no" tiene que llegar antes de que alguien rellene media página, y
 * tiene que decir por qué. Un formulario que acepta todo y falla al final
 * es peor que uno que dice que no a tiempo.
 */
export function comprobarCobertura(codigoPostal: string, municipio: string): Cobertura {
  const cp = codigoPostal.trim();
  if (!cp) return { estado: "vacio" };
  if (!/^\d{5}$/.test(cp)) return { estado: "formato" };
  if (!cp.startsWith(PREFIJO_PROVINCIA)) return { estado: "fuera-provincia" };

  if (!municipio) return { estado: "vacio" };
  const encontrado = municipiosServidos.find((m) => m.nombre === municipio);
  if (!encontrado) return { estado: "municipio-sin-servicio" };

  // El desajuste avisa pero no bloquea: la lista de códigos es orientativa
  // y prefiero una advertencia a perder un pedido por un dato mío incompleto.
  if (!encontrado.codigos.includes(cp)) {
    return { estado: "desajuste", municipio: encontrado.nombre };
  }
  return { estado: "ok", municipio: encontrado.nombre };
}

/** Si se puede seguir adelante con la solicitud. */
export function coberturaPermiteEnviar(c: Cobertura): boolean {
  return c.estado === "ok" || c.estado === "desajuste";
}

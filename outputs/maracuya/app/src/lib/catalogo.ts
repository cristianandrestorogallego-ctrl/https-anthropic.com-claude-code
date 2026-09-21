import despensa from "@/assets/cat-despensa.jpg";
import salsas from "@/assets/cat-salsas.webp";
import bebidas from "@/assets/cat-bebidas.webp";
import dulces from "@/assets/cat-dulces.jpg";
import snacks from "@/assets/cat-snacks.webp";
import harinas from "@/assets/cat-harinas.jpg";
import recetaArepas from "@/assets/receta-arepas.jpg";
import recetaCeviche from "@/assets/receta-ceviche.jpg";
import recetaEmpanadas from "@/assets/receta-empanadas.jpg";
import banderaCO from "@/assets/banderas/co.svg";
import banderaMX from "@/assets/banderas/mx.svg";
import banderaPE from "@/assets/banderas/pe.svg";
import banderaVE from "@/assets/banderas/ve.svg";
import banderaEC from "@/assets/banderas/ec.svg";
import banderaBR from "@/assets/banderas/br.svg";
import banderaAR from "@/assets/banderas/ar.svg";
import banderaPY from "@/assets/banderas/py.svg";

/**
 * Datos de DEMOSTRACIÓN.
 * En producción, productos, precios, inventario y pedidos vendrán de Shopify.
 */

export type Categoria =
  "bebidas" | "snacks" | "dulces" | "despensa" | "harinas" | "salsas" | "congelados";

export const categorias: {
  id: Categoria;
  nombre: string;
  claim: string;
  /** Se usa en los menús, donde el icono ayuda más que la etiqueta sola. */
  emoji: string;
  imagen: string;
  subcategorias: string[];
}[] = [
  {
    id: "bebidas",
    emoji: "🥤",
    nombre: "Bebidas",
    claim: "Jugos tropicales, panela y refrescos",
    imagen: bebidas,
    subcategorias: ["Jugos y néctares", "Refrescos", "Infusiones"],
  },
  {
    id: "snacks",
    emoji: "🍿",
    nombre: "Snacks",
    claim: "Picoteo crujiente con acento latino",
    imagen: snacks,
    subcategorias: ["Plátano y yuca", "Maíz", "Frutos secos"],
  },
  {
    id: "dulces",
    emoji: "🍬",
    nombre: "Dulces",
    claim: "Antojos de media tarde",
    imagen: dulces,
    subcategorias: ["Dulce de leche", "Galletas", "Golosinas"],
  },
  {
    id: "despensa",
    emoji: "🫘",
    nombre: "Despensa",
    claim: "Granos, conservas y la base de cada receta",
    imagen: despensa,
    subcategorias: ["Legumbres", "Conservas", "Condimentos"],
  },
  {
    id: "harinas",
    emoji: "🌽",
    nombre: "Harinas",
    claim: "Para arepas, tamales y masas",
    imagen: harinas,
    subcategorias: ["Maíz precocido", "Yuca y almidones", "Mezclas"],
  },
  {
    id: "salsas",
    emoji: "🌶️",
    nombre: "Salsas",
    claim: "El picante justo para despertar el plato",
    imagen: salsas,
    subcategorias: ["Ajíes", "Picantes", "Aderezos"],
  },
  {
    id: "congelados",
    emoji: "🧊",
    nombre: "Congelados",
    claim: "Yuca, pulpas y masas listas para el sartén",
    imagen: despensa,
    subcategorias: ["Tubérculos", "Pulpas de fruta", "Masas y rellenos"],
  },
];

export type PaisId =
  "colombia" | "mexico" | "peru" | "venezuela" | "ecuador" | "brasil" | "argentina" | "paraguay";

export const paises: { id: PaisId; nombre: string; codigo: string; nota: string }[] = [
  { id: "colombia", nombre: "Colombia", codigo: "co", nota: "Arepas, panela y guayaba" },
  { id: "mexico", nombre: "México", codigo: "mx", nota: "Chiles, maíz y salsas" },
  { id: "peru", nombre: "Perú", codigo: "pe", nota: "Ají amarillo y ceviche" },
  {
    id: "venezuela",
    nombre: "Venezuela",
    codigo: "ve",
    nota: "Harina de maíz precocida y hallacas",
  },
  { id: "ecuador", nombre: "Ecuador", codigo: "ec", nota: "Plátano, ají criollo y cacao" },
  { id: "brasil", nombre: "Brasil", codigo: "br", nota: "Tapioca, feijão y guaraná" },
  { id: "argentina", nombre: "Argentina", codigo: "ar", nota: "Dulce de leche y yerba mate" },
  { id: "paraguay", nombre: "Paraguay", codigo: "py", nota: "Yerba mate y tereré" },
];

/**
 * Las banderas se sirven desde el propio paquete: son ocho SVG planos.
 * Antes venían de flagcdn.com, y una tienda no debería pedirle a un tercero
 * un trozo de su propia portada.
 */
const banderas: Record<string, string> = {
  co: banderaCO,
  mx: banderaMX,
  pe: banderaPE,
  ve: banderaVE,
  ec: banderaEC,
  br: banderaBR,
  ar: banderaAR,
  py: banderaPY,
};

export const banderaUrl = (codigo: string) => banderas[codigo] ?? "";

/**
 * Marcas colaboradoras: las que trabajamos, no marcas propias de MARACUYA.
 *
 * Son NOMBRES INVENTADOS, igual que los productos. No corresponden a
 * empresas reales y no llevan logotipo: un logotipo dibujado sugiere que
 * la empresa existe. Cuando haya proveedores de verdad, cada marca trae su
 * logotipo y su permiso por escrito, y `logo` deja de estar vacío.
 */
export type Marca = {
  nombre: string;
  /** Lo que esa marca hace bien, en cuatro palabras. */
  especialidad: string;
  pais: PaisId;
  /** Ruta al logotipo real, cuando lo haya. */
  logo?: string;
};

export const marcas: Marca[] = [
  { nombre: "Casa Tinaja", especialidad: "Harinas y masas", pais: "venezuela" },
  { nombre: "Sol de Origen", especialidad: "Pulpas y jugos", pais: "colombia" },
  { nombre: "Cumbre Andina", especialidad: "Granos y maíz", pais: "peru" },
  { nombre: "Doña Rosario", especialidad: "Dulces de cuchara", pais: "argentina" },
  { nombre: "Fuego Lento", especialidad: "Ajíes y salsas", pais: "mexico" },
  { nombre: "Río Verde", especialidad: "Plátano y yuca", pais: "ecuador" },
  { nombre: "Tereré", especialidad: "Yerbas e infusiones", pais: "paraguay" },
  { nombre: "Amazonía", especialidad: "Refrescos y guaraná", pais: "brasil" },
];

export type Producto = {
  id: string;
  nombre: string;
  marca: string;
  formato: string;
  precio: number;
  precioAnterior?: number;
  /**
   * Hasta cuándo dura la oferta, en ISO. La cuenta atrás de la portada lee
   * esto: si no hay fecha, no hay reloj. Nunca un temporizador inventado.
   */
  ofertaHasta?: string;
  categoria: Categoria;
  subcategoria: string;
  pais: PaisId;
  /** País de fabricación cuando difiere del país asociado comercialmente. */
  fabricadoEn?: string;
  imagen: string;
  disponible: boolean;
  variantes?: string[];
  etiqueta?: string;
  descripcion: string;
  /** Campos de ficha pendientes de datos reales del proveedor. */
  ingredientes?: string;
  alergenos?: string;
  conservacion?: string;
  nutricional?: string;
};

export const productos: Producto[] = [
  {
    id: "harina-maiz-blanco",
    nombre: "Harina de maíz blanco precocida",
    marca: "Marca de demostración",
    formato: "1 kg",
    precio: 2.95,
    categoria: "harinas",
    subcategoria: "Maíz precocido",
    pais: "venezuela",
    imagen: harinas,
    disponible: true,
    etiqueta: "Más vendido",
    descripcion: "La base de las arepas de siempre: masa lista en minutos.",
  },
  {
    id: "harina-maiz-amarillo",
    nombre: "Harina de maíz amarillo precocida",
    marca: "Marca de demostración",
    formato: "1 kg",
    precio: 3.15,
    categoria: "harinas",
    subcategoria: "Maíz precocido",
    pais: "colombia",
    imagen: harinas,
    disponible: true,
    descripcion: "Para arepas de choclo, envueltos y bollos con sabor de casa.",
  },
  {
    id: "almidon-yuca",
    nombre: "Almidón de yuca agrio",
    marca: "Marca de demostración",
    formato: "500 g",
    precio: 3.4,
    categoria: "harinas",
    subcategoria: "Yuca y almidones",
    pais: "colombia",
    imagen: harinas,
    disponible: false,
    descripcion: "Para pandebono, pan de yuca y almojábanas.",
  },
  {
    id: "frijol-negro",
    nombre: "Frijol negro seleccionado",
    marca: "Marca de demostración",
    formato: "500 g",
    precio: 2.4,
    categoria: "despensa",
    subcategoria: "Legumbres",
    pais: "venezuela",
    imagen: despensa,
    disponible: true,
    descripcion: "Grano entero, ideal para caraotas y feijoada de domingo.",
  },
  {
    id: "maiz-mote",
    nombre: "Maíz mote pelado",
    marca: "Marca de demostración",
    formato: "400 g",
    precio: 2.9,
    categoria: "despensa",
    subcategoria: "Conservas",
    pais: "peru",
    imagen: despensa,
    disponible: true,
    descripcion: "El grano gordo que acompaña al ceviche y a los guisos andinos.",
  },
  {
    id: "aji-amarillo",
    nombre: "Pasta de ají amarillo",
    marca: "Marca de demostración",
    formato: "225 g",
    precio: 4.6,
    precioAnterior: 5.4,
    ofertaHasta: "2026-09-21T22:00:00+02:00",
    categoria: "salsas",
    subcategoria: "Ajíes",
    pais: "peru",
    imagen: salsas,
    disponible: true,
    etiqueta: "Oferta del día",
    descripcion: "Aroma frutal y picor medio: la firma de la cocina peruana.",
  },
  {
    id: "aji-criollo",
    nombre: "Ají criollo casero",
    marca: "Marca de demostración",
    formato: "250 ml",
    precio: 3.9,
    categoria: "salsas",
    subcategoria: "Ajíes",
    pais: "ecuador",
    imagen: salsas,
    disponible: true,
    variantes: ["Suave", "Picante"],
    descripcion: "Receta de mesa, con cilantro fresco y cebolla encurtida.",
  },
  {
    id: "salsa-chipotle",
    nombre: "Salsa de chipotle ahumado",
    marca: "Marca de demostración",
    formato: "150 ml",
    precio: 4.2,
    precioAnterior: 4.9,
    ofertaHasta: "2026-09-26T22:00:00+02:00",
    categoria: "salsas",
    subcategoria: "Picantes",
    pais: "mexico",
    imagen: salsas,
    disponible: true,
    etiqueta: "Oferta del mes",
    descripcion: "Ahumada y densa, perfecta para tacos y carnes a la brasa.",
  },
  {
    id: "jugo-maracuya",
    nombre: "Jugo de maracuyá",
    marca: "Marca de demostración",
    formato: "1 L",
    precio: 3.8,
    categoria: "bebidas",
    subcategoria: "Jugos y néctares",
    pais: "colombia",
    imagen: bebidas,
    disponible: true,
    etiqueta: "Nuestra fruta",
    descripcion: "Pulpa intensa y ácida, la que da nombre a la casa.",
  },
  {
    id: "jugo-guayaba",
    nombre: "Néctar de guayaba rosada",
    marca: "Marca de demostración",
    formato: "1 L",
    precio: 3.5,
    categoria: "bebidas",
    subcategoria: "Jugos y néctares",
    pais: "colombia",
    imagen: bebidas,
    disponible: true,
    descripcion: "Dulce, cremoso y con el color de las tardes del trópico.",
  },
  {
    id: "guarana",
    nombre: "Refresco de guaraná",
    marca: "Marca de demostración",
    formato: "1,5 L",
    precio: 2.75,
    precioAnterior: 3.25,
    ofertaHasta: "2026-09-20T22:00:00+02:00",
    categoria: "bebidas",
    subcategoria: "Refrescos",
    pais: "brasil",
    imagen: bebidas,
    disponible: true,
    etiqueta: "Oferta flash",
    descripcion: "Burbujas dulces con el amargor justo del fruto amazónico.",
  },
  {
    id: "yuca-congelada",
    nombre: "Yuca en trozos, congelada",
    marca: "Marca de demostración",
    formato: "1 kg",
    precio: 3.6,
    categoria: "congelados",
    subcategoria: "Tubérculos",
    pais: "colombia",
    imagen: despensa,
    disponible: true,
    descripcion: "Pelada y troceada. Del congelador a la olla sin pelar nada.",
  },
  {
    id: "pulpa-lulo",
    nombre: "Pulpa de lulo congelada",
    marca: "Marca de demostración",
    formato: "500 g",
    precio: 4.9,
    categoria: "congelados",
    subcategoria: "Pulpas de fruta",
    pais: "colombia",
    imagen: bebidas,
    disponible: true,
    descripcion: "Para jugo, sorbete o el postre que se te ocurra.",
  },
  {
    id: "tequenos",
    nombre: "Tequeños congelados",
    marca: "Marca de demostración",
    formato: "12 uds.",
    precio: 5.9,
    categoria: "congelados",
    subcategoria: "Masas y rellenos",
    pais: "venezuela",
    imagen: snacks,
    disponible: true,
    etiqueta: "Nuevo",
    descripcion: "Masa fina y queso salado. Al horno o a la freidora de aire.",
  },
  {
    id: "yerba-mate",
    nombre: "Yerba mate para tereré",
    marca: "Marca de demostración",
    formato: "500 g",
    precio: 6.4,
    categoria: "bebidas",
    subcategoria: "Infusiones",
    pais: "paraguay",
    imagen: bebidas,
    disponible: true,
    descripcion: "Hoja gruesa y poco polvo, la que aguanta el agua fría del tereré.",
  },
  {
    id: "panela",
    nombre: "Panela en bloque",
    marca: "Marca de demostración",
    formato: "500 g",
    precio: 2.8,
    categoria: "despensa",
    subcategoria: "Condimentos",
    pais: "colombia",
    imagen: dulces,
    disponible: true,
    descripcion: "Caña sin refinar para aguapanela, postres y limonadas.",
  },
  {
    id: "dulce-de-leche",
    nombre: "Dulce de leche tradicional",
    marca: "Marca de demostración",
    formato: "400 g",
    precio: 5.2,
    categoria: "dulces",
    subcategoria: "Dulce de leche",
    pais: "argentina",
    imagen: dulces,
    disponible: true,
    etiqueta: "Edición artesana",
    descripcion: "Cocción lenta, textura de cuchara. Peligroso para el tarro.",
  },
  {
    id: "alfajores",
    nombre: "Alfajores de maicena con coco",
    marca: "Marca de demostración",
    formato: "6 uds.",
    precio: 4.9,
    categoria: "dulces",
    subcategoria: "Galletas",
    pais: "argentina",
    imagen: dulces,
    disponible: true,
    descripcion: "Se deshacen en la boca, rellenos de dulce de leche.",
  },
  {
    id: "platanitos",
    nombre: "Chips de plátano maduro",
    marca: "Marca de demostración",
    formato: "180 g",
    precio: 2.6,
    categoria: "snacks",
    subcategoria: "Plátano y yuca",
    pais: "ecuador",
    imagen: snacks,
    disponible: true,
    descripcion: "Crujientes y dulces, el picoteo que nunca dura.",
  },
  {
    id: "tostones",
    nombre: "Tostones de plátano verde",
    marca: "Marca de demostración",
    formato: "150 g",
    precio: 2.45,
    categoria: "snacks",
    subcategoria: "Plátano y yuca",
    pais: "venezuela",
    imagen: snacks,
    disponible: true,
    descripcion: "Salados y firmes, para mojar en guacamole o ají.",
  },
  {
    id: "maiz-tostado",
    nombre: "Maíz tostado salado",
    marca: "Marca de demostración",
    formato: "200 g",
    precio: 2.2,
    categoria: "snacks",
    subcategoria: "Maíz",
    pais: "peru",
    imagen: snacks,
    disponible: true,
    descripcion: "El cancha serrana que acompaña cualquier ceviche.",
  },
  {
    id: "totopos",
    nombre: "Totopos de maíz nixtamalizado",
    marca: "Marca de demostración",
    formato: "200 g",
    precio: 2.95,
    categoria: "snacks",
    subcategoria: "Maíz",
    pais: "mexico",
    imagen: snacks,
    disponible: true,
    descripcion: "Gruesos y crujientes, aguantan cualquier salsa.",
  },
];

export const formatoPrecio = (valor: number) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(valor);

export const productoPorId = (id: string) => productos.find((p) => p.id === id);

/* ---------------------------------- Recetas --------------------------------- */

export type IngredienteReceta = {
  /** Referencia al catálogo; si falta, el cliente lo consigue por su cuenta. */
  productoId?: string;
  nombre: string;
  /** Cantidad por ración. */
  cantidadPorRacion: number;
  unidad: string;
  /** Contenido de un envase, en la misma unidad. */
  contenidoEnvase?: number;
  tipo: "paquete" | "aparte" | "basico";
};

/** Los tipos de plato. El menú y el filtro de /recetas leen de aquí. */
export const tiposReceta = ["Entrante", "Principal", "Postre"] as const;

export type Receta = {
  slug: string;
  nombre: string;
  pais: PaisId;
  tipo: (typeof tiposReceta)[number];
  minutos: number;
  dificultad: "Fácil" | "Media" | "Alta";
  racionesBase: number;
  imagen: string;
  resumen: string;
  ingredientes: IngredienteReceta[];
  pasos: string[];
  utensilios: string[];
  consejos: string[];
  alergenos: string;
};

export const recetas: Receta[] = [
  {
    slug: "arepas-rellenas",
    nombre: "Arepas rellenas de carne mechada",
    pais: "venezuela",
    tipo: "Principal",
    minutos: 45,
    dificultad: "Fácil",
    racionesBase: 2,
    imagen: recetaArepas,
    resumen:
      "La cena de entre semana que resuelve todo: masa suave por dentro, corteza dorada y un relleno que sabe a domingo.",
    ingredientes: [
      {
        productoId: "harina-maiz-blanco",
        nombre: "Harina de maíz blanco precocida",
        cantidadPorRacion: 125,
        unidad: "g",
        contenidoEnvase: 1000,
        tipo: "paquete",
      },
      {
        productoId: "aji-criollo",
        nombre: "Ají criollo casero",
        cantidadPorRacion: 25,
        unidad: "ml",
        contenidoEnvase: 250,
        tipo: "paquete",
      },
      {
        productoId: "jugo-maracuya",
        nombre: "Jugo de maracuyá",
        cantidadPorRacion: 250,
        unidad: "ml",
        contenidoEnvase: 1000,
        tipo: "paquete",
      },
      { nombre: "Carne de falda para mechar", cantidadPorRacion: 150, unidad: "g", tipo: "aparte" },
      { nombre: "Cebolla y pimiento", cantidadPorRacion: 1, unidad: "ud.", tipo: "aparte" },
      { nombre: "Agua templada", cantidadPorRacion: 160, unidad: "ml", tipo: "basico" },
      { nombre: "Sal y aceite", cantidadPorRacion: 1, unidad: "pizca", tipo: "basico" },
    ],
    pasos: [
      "Cuece la carne con cebolla y pimiento hasta que se deshilache con facilidad. Reserva un poco del caldo.",
      "Mezcla el agua templada con sal y añade la harina en lluvia. Amasa 3 minutos hasta una masa que no se agriete.",
      "Forma bolas y aplástalas con el grosor de un dedo.",
      "Dóralas en sartén con un hilo de aceite, 6 minutos por cada lado, hasta que suenen huecas.",
      "Ábrelas por un lateral, rellena con la carne mechada y añade una cucharada de ají criollo.",
      "Sirve enseguida con el jugo de maracuyá bien frío.",
    ],
    utensilios: ["Sartén o budare", "Bol amplio", "Olla para la carne"],
    consejos: [
      "Si la masa se agrieta al formarla, añade agua de cucharada en cucharada.",
      "La carne mechada mejora de un día para otro.",
    ],
    alergenos: "Pendiente de la ficha del proveedor. Revisa siempre la etiqueta de cada envase.",
  },
  {
    slug: "ceviche-clasico",
    nombre: "Ceviche clásico con ají amarillo",
    pais: "peru",
    tipo: "Entrante",
    minutos: 25,
    dificultad: "Media",
    racionesBase: 2,
    imagen: recetaCeviche,
    resumen: "Pescado firme, lima recién exprimida y el punto justo de ají amarillo.",
    ingredientes: [
      {
        productoId: "aji-amarillo",
        nombre: "Pasta de ají amarillo",
        cantidadPorRacion: 20,
        unidad: "g",
        contenidoEnvase: 225,
        tipo: "paquete",
      },
      {
        productoId: "maiz-tostado",
        nombre: "Maíz tostado salado",
        cantidadPorRacion: 40,
        unidad: "g",
        contenidoEnvase: 200,
        tipo: "paquete",
      },
      { nombre: "Pescado blanco muy fresco", cantidadPorRacion: 180, unidad: "g", tipo: "aparte" },
      { nombre: "Limas y cebolla roja", cantidadPorRacion: 3, unidad: "ud.", tipo: "aparte" },
      { nombre: "Sal", cantidadPorRacion: 1, unidad: "pizca", tipo: "basico" },
    ],
    pasos: [
      "Corta el pescado en dados regulares y mantenlo muy frío.",
      "Mezcla el zumo de lima con la pasta de ají amarillo y sal.",
      "Añade el pescado y la cebolla en pluma; deja reposar 3 minutos.",
      "Sirve con maíz tostado por encima.",
    ],
    utensilios: ["Cuchillo afilado", "Bol frío"],
    consejos: ["Congela el pescado 48 h antes por seguridad alimentaria."],
    alergenos:
      "Esta receta lleva pescado. El resto, pendiente de la ficha del proveedor: revisa la etiqueta de cada envase.",
  },
  {
    slug: "empanadas-colombianas",
    nombre: "Empanadas colombianas con ají",
    pais: "colombia",
    tipo: "Entrante",
    minutos: 60,
    dificultad: "Media",
    racionesBase: 4,
    imagen: recetaEmpanadas,
    resumen: "Masa de maíz amarillo crujiente y relleno de papa aliñada, con ají para mojar.",
    ingredientes: [
      {
        productoId: "harina-maiz-amarillo",
        nombre: "Harina de maíz amarillo precocida",
        cantidadPorRacion: 90,
        unidad: "g",
        contenidoEnvase: 1000,
        tipo: "paquete",
      },
      {
        productoId: "aji-criollo",
        nombre: "Ají criollo casero",
        cantidadPorRacion: 20,
        unidad: "ml",
        contenidoEnvase: 250,
        tipo: "paquete",
      },
      { nombre: "Patata y carne picada", cantidadPorRacion: 120, unidad: "g", tipo: "aparte" },
      { nombre: "Aceite para freír y sal", cantidadPorRacion: 1, unidad: "pizca", tipo: "basico" },
    ],
    pasos: [
      "Cuece y machaca la patata; sofríe la carne y mézclalo todo.",
      "Amasa la harina con agua templada y sal hasta una masa maleable.",
      "Forma discos, rellena, cierra y sella los bordes.",
      "Fríe en aceite bien caliente hasta que estén doradas y sirve con ají.",
    ],
    utensilios: ["Sartén honda", "Rodillo o prensa"],
    consejos: ["Sella bien los bordes para que no se abran al freír."],
    alergenos: "Pendiente de la ficha del proveedor. Revisa siempre la etiqueta de cada envase.",
  },
  {
    slug: "mousse-maracuya",
    nombre: "Mousse de maracuyá",
    pais: "colombia",
    tipo: "Postre",
    minutos: 20,
    dificultad: "Fácil",
    racionesBase: 6,
    imagen: dulces,
    resumen: "Ácida, fría y sin horno. Se hace en veinte minutos y reposa sola en la nevera.",
    ingredientes: [
      {
        productoId: "jugo-maracuya",
        nombre: "Jugo de maracuyá",
        cantidadPorRacion: 200,
        unidad: "ml",
        contenidoEnvase: 1000,
        tipo: "paquete",
      },
      { nombre: "Leche condensada", cantidadPorRacion: 370, unidad: "g", tipo: "aparte" },
      { nombre: "Nata para montar", cantidadPorRacion: 200, unidad: "ml", tipo: "aparte" },
      { nombre: "Galletas tipo María", cantidadPorRacion: 150, unidad: "g", tipo: "aparte" },
    ],
    pasos: [
      "Tritura las galletas y forra el fondo del molde apretando bien.",
      "Bate la leche condensada con el jugo de maracuyá hasta que espese un poco.",
      "Monta la nata aparte y mézclala con movimientos suaves, de abajo arriba.",
      "Vuelca sobre la base de galleta y alisa la superficie.",
      "Nevera, mínimo cuatro horas. Mejor de un día para otro.",
    ],
    utensilios: ["Molde desmontable", "Varillas o batidora", "Bol amplio"],
    consejos: [
      "Si la quieres más ácida, reserva un poco de jugo y viértelo por encima al servir.",
      "La nata monta mejor si el bol y las varillas están fríos.",
    ],
    alergenos:
      "Lleva lácteos y las galletas suelen llevar gluten. El resto, pendiente de la ficha del proveedor: revisa la etiqueta de cada envase.",
  },
];

export const recetaPorSlug = (slug: string) => recetas.find((r) => r.slug === slug);

export const paisPorId = (id: PaisId) => paises.find((p) => p.id === id)!;

/** Productos con oferta viva: precio rebajado y fecha de fin sin pasar. */
export function ofertasVivas(ahora = new Date()): Producto[] {
  return productos
    .filter((p) => p.precioAnterior && p.ofertaHasta && new Date(p.ofertaHasta) > ahora)
    .sort((a, b) => new Date(a.ofertaHasta!).getTime() - new Date(b.ofertaHasta!).getTime());
}

/** El descuento redondeado, tal como se enseña en la insignia. */
export function porcentajeDescuento(producto: Producto): number {
  if (!producto.precioAnterior) return 0;
  return Math.round((1 - producto.precio / producto.precioAnterior) * 100);
}

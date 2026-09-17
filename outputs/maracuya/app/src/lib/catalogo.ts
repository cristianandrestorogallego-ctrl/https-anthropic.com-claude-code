import despensa from "@/assets/cat-despensa.jpg";
import salsas from "@/assets/cat-salsas.jpg";
import bebidas from "@/assets/cat-bebidas.jpg";
import dulces from "@/assets/cat-dulces.jpg";

export type Categoria = "despensa" | "salsas" | "bebidas" | "dulces";

export const categorias: {
  id: Categoria;
  nombre: string;
  claim: string;
  imagen: string;
}[] = [
  {
    id: "despensa",
    nombre: "Despensa",
    claim: "Harinas, granos y la base de cada receta",
    imagen: despensa,
  },
  {
    id: "salsas",
    nombre: "Ajíes y salsas",
    claim: "El picante justo para despertar el plato",
    imagen: salsas,
  },
  {
    id: "bebidas",
    nombre: "Bebidas",
    claim: "Jugos tropicales, panela y refrescos",
    imagen: bebidas,
  },
  {
    id: "dulces",
    nombre: "Dulces y snacks",
    claim: "Antojos de media tarde con acento latino",
    imagen: dulces,
  },
];

export type Producto = {
  id: string;
  nombre: string;
  origen: string;
  formato: string;
  precio: number;
  categoria: Categoria;
  imagen: string;
  etiqueta?: string;
  descripcion: string;
};

export const productos: Producto[] = [
  {
    id: "harina-maiz-blanco",
    nombre: "Harina de maíz blanco precocida",
    origen: "Venezuela",
    formato: "1 kg",
    precio: 2.95,
    categoria: "despensa",
    imagen: despensa,
    etiqueta: "Más vendido",
    descripcion: "La base de las arepas de siempre. Sin gluten, lista en minutos.",
  },
  {
    id: "harina-maiz-amarillo",
    nombre: "Harina de maíz amarillo",
    origen: "Colombia",
    formato: "1 kg",
    precio: 3.15,
    categoria: "despensa",
    imagen: despensa,
    descripcion: "Para arepas de choclo, envueltos y bollos con sabor de casa.",
  },
  {
    id: "frijol-negro",
    nombre: "Frijol negro seleccionado",
    origen: "Perú",
    formato: "500 g",
    precio: 2.4,
    categoria: "despensa",
    imagen: despensa,
    descripcion: "Grano entero, ideal para caraotas y feijoada de domingo.",
  },
  {
    id: "aji-amarillo",
    nombre: "Pasta de ají amarillo",
    origen: "Perú",
    formato: "225 g",
    precio: 4.6,
    categoria: "salsas",
    imagen: salsas,
    etiqueta: "Favorito",
    descripcion: "Aroma frutal y picor medio: la firma de la cocina peruana.",
  },
  {
    id: "aji-criollo",
    nombre: "Ají criollo casero",
    origen: "Ecuador",
    formato: "250 ml",
    precio: 3.9,
    categoria: "salsas",
    imagen: salsas,
    descripcion: "Receta de mesa, con cilantro fresco y cebolla encurtida.",
  },
  {
    id: "salsa-chipotle",
    nombre: "Salsa de chipotle ahumado",
    origen: "México",
    formato: "150 ml",
    precio: 4.2,
    categoria: "salsas",
    imagen: salsas,
    descripcion: "Ahumada y densa, perfecta para tacos y carnes a la brasa.",
  },
  {
    id: "jugo-maracuya",
    nombre: "Jugo de maracuyá 100% natural",
    origen: "Colombia",
    formato: "1 L",
    precio: 3.8,
    categoria: "bebidas",
    imagen: bebidas,
    etiqueta: "Nuestra fruta",
    descripcion: "Pulpa intensa y ácida, la que da nombre a la casa.",
  },
  {
    id: "jugo-guayaba",
    nombre: "Néctar de guayaba rosada",
    origen: "Colombia",
    formato: "1 L",
    precio: 3.5,
    categoria: "bebidas",
    imagen: bebidas,
    descripcion: "Dulce, cremoso y con el color de las tardes del trópico.",
  },
  {
    id: "panela",
    nombre: "Panela en bloque",
    origen: "Colombia",
    formato: "500 g",
    precio: 2.8,
    categoria: "bebidas",
    imagen: dulces,
    descripcion: "Caña sin refinar para aguapanela, postres y limonadas.",
  },
  {
    id: "dulce-de-leche",
    nombre: "Dulce de leche tradicional",
    origen: "Argentina",
    formato: "400 g",
    precio: 5.2,
    categoria: "dulces",
    imagen: dulces,
    etiqueta: "Edición artesana",
    descripcion: "Cocción lenta, textura de cuchara. Peligroso para el tarro.",
  },
  {
    id: "alfajores",
    nombre: "Alfajores de maicena con coco",
    origen: "Argentina",
    formato: "6 uds.",
    precio: 4.9,
    categoria: "dulces",
    imagen: dulces,
    descripcion: "Se deshacen en la boca, rellenos de dulce de leche.",
  },
  {
    id: "platanitos",
    nombre: "Chips de plátano maduro",
    origen: "Ecuador",
    formato: "180 g",
    precio: 2.6,
    categoria: "dulces",
    imagen: dulces,
    descripcion: "Crujientes y dulces, el picoteo que nunca dura.",
  },
];

export const formatoPrecio = (valor: number) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(valor);

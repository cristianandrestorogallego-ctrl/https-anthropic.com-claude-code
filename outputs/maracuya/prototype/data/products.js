window.MARACUYA = window.MARACUYA || {};

// PENDING marks fields that must not be fabricated: they wait on a confirmed
// data sheet from the supplier before they can show real content.
const PENDING = 'PENDING';

MARACUYA.products = [
  {
    id: 'p01', name: 'Café colombiano molido', brand: 'Cosecha Latina',
    category: 'despensa', format: '500 g', netQty: 500, netUnit: 'g',
    originCountry: 'CO', assocCountry: 'CO',
    basePrice: 7.20, stock: 'in', stockQty: 30,
    glyph: 'bag', variants: null,
    description: 'Café tostado y molido, listo para preparar en cafetera o filtro. Origen Colombia.',
    ingredientsText: PENDING, allergens: PENDING, conservation: PENDING, nutrition: PENDING,
    usedInRecipes: []
  },
  {
    id: 'p02', name: 'Harina de maíz blanca precocida', brand: 'Andina',
    category: 'despensa', format: '1 kg', netQty: 1000, netUnit: 'g',
    originCountry: 'VE', assocCountry: 'VE',
    basePrice: 3.20, stock: 'in', stockQty: 40,
    glyph: 'bag', variants: null,
    description: 'Harina de maíz blanco precocida, ideal para arepas, empanadas y otras preparaciones tradicionales venezolanas.',
    ingredientsText: PENDING, allergens: PENDING, conservation: PENDING, nutrition: PENDING,
    usedInRecipes: ['r02']
  },
  {
    id: 'p03', name: 'Arepas precocidas congeladas', brand: 'Andina',
    category: 'despensa', format: 'Paquete de 10 uds (≈600 g)', netQty: 10, netUnit: 'ud',
    originCountry: 'CO', assocCountry: 'CO',
    basePrice: 4.80, stock: 'in', stockQty: 18,
    glyph: 'frozen-pack',
    variants: [
      { id: 'blancas', label: 'Arepas blancas', basePrice: 4.80, stock: 'in', netQty: 10, netUnit: 'ud' },
      { id: 'amarillas', label: 'Arepas amarillas', basePrice: 4.80, stock: 'in', netQty: 10, netUnit: 'ud' }
    ],
    description: 'Arepas precocidas y congeladas, listas para calentar en pocos minutos.',
    ingredientsText: PENDING, allergens: PENDING, conservation: PENDING, nutrition: PENDING,
    usedInRecipes: []
  },
  {
    id: 'p04', name: 'Salsa picante clásica', brand: 'Doña Estrella',
    category: 'salsas', format: '370 ml', netQty: 370, netUnit: 'ml',
    originCountry: 'MX', assocCountry: 'MX',
    basePrice: 3.10, stock: 'in', stockQty: 25,
    glyph: 'bottle', variants: null,
    description: 'Salsa picante de mesa para acompañar cualquier plato.',
    ingredientsText: PENDING, allergens: PENDING, conservation: PENDING, nutrition: PENDING,
    usedInRecipes: ['r01']
  },
  {
    id: 'p05', name: 'Mole poblano en pasta', brand: 'Doña Estrella',
    category: 'salsas', format: '235 g', netQty: 235, netUnit: 'g',
    originCountry: 'MX', assocCountry: 'MX',
    basePrice: 5.40, stock: 'low', stockQty: 4,
    glyph: 'jar', variants: null,
    description: 'Pasta de mole poblano para diluir con caldo y preparar un mole tradicional.',
    ingredientsText: PENDING, allergens: PENDING, conservation: PENDING, nutrition: PENDING,
    usedInRecipes: ['r04']
  },
  {
    id: 'p06', name: 'Frijoles negros cocidos', brand: 'Cosecha Latina',
    category: 'despensa', format: 'Lata 400 g', netQty: 400, netUnit: 'g',
    originCountry: 'MX', assocCountry: 'MX',
    basePrice: 1.90, stock: 'in', stockQty: 60,
    glyph: 'can', variants: null,
    description: 'Frijoles negros cocidos, listos para calentar y servir.',
    ingredientsText: PENDING, allergens: PENDING, conservation: PENDING, nutrition: PENDING,
    usedInRecipes: ['r01']
  },
  {
    id: 'p07', name: 'Leche condensada', brand: 'Dulce Abuela',
    category: 'despensa', format: 'Lata 397 g', netQty: 397, netUnit: 'g',
    originCountry: 'MX', assocCountry: 'MX',
    basePrice: 2.60, stock: 'in', stockQty: 33,
    glyph: 'can', variants: null,
    description: 'Leche condensada azucarada, ideal para postres y bebidas.',
    ingredientsText: PENDING, allergens: PENDING, conservation: PENDING, nutrition: PENDING,
    usedInRecipes: ['r03']
  },
  {
    id: 'p08', name: 'Dulce de leche', brand: 'Dulce Abuela',
    category: 'dulces', format: '450 g', netQty: 450, netUnit: 'g',
    originCountry: 'AR', assocCountry: 'AR',
    basePrice: 4.20, stock: 'in', stockQty: 20,
    glyph: 'jar', variants: null,
    description: 'Dulce de leche untable, tradición argentina.',
    ingredientsText: PENDING, allergens: PENDING, conservation: PENDING, nutrition: PENDING,
    usedInRecipes: []
  },
  {
    id: 'p09', name: 'Alfajores de dulce de leche', brand: 'Dulce Abuela',
    category: 'dulces', format: 'Estuche x6', netQty: 6, netUnit: 'ud',
    originCountry: 'AR', assocCountry: 'AR',
    basePrice: 9.50, stock: 'in', stockQty: 15,
    glyph: 'box', variants: null,
    description: 'Alfajores rellenos de dulce de leche, bañados en chocolate.',
    ingredientsText: PENDING, allergens: PENDING, conservation: PENDING, nutrition: PENDING,
    usedInRecipes: []
  },
  {
    id: 'p10', name: 'Chicha morada instantánea', brand: 'Río Dorado',
    category: 'bebidas', format: 'Ver formatos', netQty: null, netUnit: null,
    originCountry: 'PE', assocCountry: 'PE',
    basePrice: 5.10, stock: 'in', stockQty: 12,
    glyph: 'drink-glass',
    variants: [
      { id: 'v500', label: 'Bolsa 500 g', basePrice: 5.10, stock: 'in', netQty: 500, netUnit: 'g' },
      { id: 'v1kg', label: 'Bolsa 1 kg', basePrice: 8.50, stock: 'in', netQty: 1000, netUnit: 'g' }
    ],
    description: 'Preparado instantáneo de maíz morado para reconstituir con agua.',
    ingredientsText: PENDING, allergens: PENDING, conservation: PENDING, nutrition: PENDING,
    usedInRecipes: []
  },
  {
    id: 'p11', name: 'Gaseosa dorada andina', brand: 'Río Dorado',
    category: 'bebidas', format: 'Pack 6 x 355 ml', netQty: 6, netUnit: 'ud',
    originCountry: 'PE', assocCountry: 'PE',
    basePrice: 6.30, stock: 'in', stockQty: 22,
    glyph: 'can', variants: null,
    description: 'Refresco de cola de estilo andino, pack de 6 latas.',
    ingredientsText: PENDING, allergens: PENDING, conservation: PENDING, nutrition: PENDING,
    usedInRecipes: []
  },
  {
    id: 'p12', name: 'Chips de plátano macho', brand: 'Sabores del Sur',
    category: 'snacks', format: '150 g', netQty: 150, netUnit: 'g',
    originCountry: 'CO', assocCountry: 'CO',
    basePrice: 2.40, stock: 'in', stockQty: 28,
    glyph: 'chips', variants: null,
    description: 'Chips crujientes de plátano macho verde, fritos y salados.',
    ingredientsText: PENDING, allergens: PENDING, conservation: PENDING, nutrition: PENDING,
    usedInRecipes: []
  },
  {
    id: 'p13', name: 'Chicharrones de harina', brand: 'Sabores del Sur',
    category: 'snacks', format: '120 g', netQty: 120, netUnit: 'g',
    originCountry: 'CO', assocCountry: 'CO',
    basePrice: 2.10, stock: 'in', stockQty: 19,
    glyph: 'box', variants: null,
    description: 'Snack crujiente de harina de trigo, sabor tradicional.',
    ingredientsText: PENDING, allergens: PENDING, conservation: PENDING, nutrition: PENDING,
    usedInRecipes: []
  },
  {
    id: 'p14', name: 'Panela en bloque', brand: 'El Trapiche',
    category: 'despensa', format: 'Bloque 500 g', netQty: 500, netUnit: 'g',
    originCountry: 'CO', assocCountry: 'CO',
    basePrice: 2.80, stock: 'in', stockQty: 26,
    glyph: 'bag', variants: null,
    description: 'Panela sólida de caña de azúcar, sin refinar.',
    ingredientsText: PENDING, allergens: PENDING, conservation: PENDING, nutrition: PENDING,
    usedInRecipes: []
  },
  {
    id: 'p15', name: 'Pulpa de maracuyá congelada', brand: 'Cosecha Latina',
    category: 'despensa', format: '400 g', netQty: 400, netUnit: 'g',
    originCountry: 'CO', assocCountry: 'CO',
    basePrice: 3.90, stock: 'in', stockQty: 14,
    glyph: 'fruit', variants: null,
    description: 'Pulpa de maracuyá 100% fruta, congelada, sin azúcar añadida.',
    ingredientsText: PENDING, allergens: PENDING, conservation: PENDING, nutrition: PENDING,
    usedInRecipes: []
  },
  {
    id: 'p16', name: 'Arroz blanco grano largo', brand: 'Andina',
    category: 'despensa', format: '500 g', netQty: 500, netUnit: 'g',
    originCountry: 'CO', assocCountry: 'CO',
    basePrice: 2.10, stock: 'in', stockQty: 50,
    glyph: 'bag', variants: null,
    description: 'Arroz blanco de grano largo, uso diario.',
    ingredientsText: PENDING, allergens: PENDING, conservation: PENDING, nutrition: PENDING,
    usedInRecipes: ['r01', 'r03']
  },
  {
    id: 'p17', name: 'Coco rallado deshidratado', brand: 'Andina',
    category: 'despensa', format: '200 g', netQty: 200, netUnit: 'g',
    originCountry: 'DO', assocCountry: 'DO',
    basePrice: 3.30, stock: 'out', stockQty: 0,
    glyph: 'bag', variants: null,
    description: 'Coco deshidratado rallado, para postres y preparaciones dulces y saladas.',
    ingredientsText: PENDING, allergens: PENDING, conservation: PENDING, nutrition: PENDING,
    usedInRecipes: ['r03']
  },
  {
    id: 'p17b', name: 'Coco rallado deshidratado (otra marca)', brand: 'Cosecha Latina',
    category: 'despensa', format: '200 g', netQty: 200, netUnit: 'g',
    originCountry: 'DO', assocCountry: 'DO',
    basePrice: 3.60, stock: 'in', stockQty: 16,
    glyph: 'bag', variants: null,
    description: 'Coco deshidratado rallado, alternativa disponible mientras el formato habitual está agotado.',
    ingredientsText: PENDING, allergens: PENDING, conservation: PENDING, nutrition: PENDING,
    usedInRecipes: ['r03']
  },
  {
    id: 'p18', name: 'Canela en rama', brand: 'Andina',
    category: 'despensa', format: '30 g (≈5 ramas)', netQty: 1, netUnit: 'ud',
    originCountry: 'LK', assocCountry: 'PE',
    basePrice: 1.50, stock: 'in', stockQty: 40,
    glyph: 'stick', variants: null,
    description: 'Ramas de canela entera para infusiones y postres.',
    ingredientsText: PENDING, allergens: PENDING, conservation: PENDING, nutrition: PENDING,
    usedInRecipes: ['r03']
  },
  {
    id: 'p19', name: 'Ají amarillo en pasta', brand: 'Doña Estrella',
    category: 'salsas', format: '212 g', netQty: 212, netUnit: 'g',
    originCountry: 'PE', assocCountry: 'PE',
    basePrice: 4.60, stock: 'in', stockQty: 17,
    glyph: 'jar', variants: null,
    description: 'Pasta de ají amarillo peruano, base para múltiples preparaciones.',
    ingredientsText: PENDING, allergens: PENDING, conservation: PENDING, nutrition: PENDING,
    usedInRecipes: []
  }
];

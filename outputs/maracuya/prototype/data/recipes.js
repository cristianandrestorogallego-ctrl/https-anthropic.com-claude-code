window.MARACUYA = window.MARACUYA || {};

// include: 'included'  -> sold in the shop, part of the buyable package (can be deselected)
// include: 'fresh'     -> fresh / perishable, customer must source separately
// include: 'pantry'    -> basic pantry item (water, salt, oil...), never sold as part of a package
// qtyPerServing scales with the servings stepper; fixedQty does not (e.g. "to taste" items).

MARACUYA.recipes = [
  {
    id: 'r01',
    name: 'Frijoles negros con arroz y salsa criolla',
    countryText: 'Caribe (Cuba y República Dominicana)',
    countryCode: 'CU',
    dishType: 'principal',
    difficulty: 'Fácil',
    prepMinutes: 15,
    cookMinutes: 35,
    baseServings: 4, minServings: 2, maxServings: 10, servingStep: 1,
    heroIcon: 'beans-rice',
    summary: 'Un plato de cuchara reconfortante: frijoles negros bien sazonados sobre arroz blanco, con un toque de salsa criolla.',
    description: 'Receta de demostración original para MARACUYA mercado latino. El arroz y los frijoles se cocinan por separado y se sirven juntos con verduras sofritas y un toque de salsa al gusto. Un clásico cotidiano del Caribe hispano.',
    utensils: ['Olla mediana con tapa', 'Sartén', 'Cuchara de madera', 'Colador'],
    tips: [
      'Sofríe bien la cebolla, el ajo y el pimiento antes de añadir los frijoles: es la base del sabor.',
      'Si el arroz queda seco, añade un chorrito de agua caliente y tapa unos minutos más.'
    ],
    steps: [
      'Enjuaga el arroz hasta que el agua salga clara.',
      'Cocina el arroz con el doble de agua y sal al gusto hasta que esté tierno.',
      'En una sartén, sofríe la cebolla, el ajo y el pimiento picados con un poco de aceite.',
      'Añade los frijoles negros con su líquido y el comino, y cocina 10-12 minutos a fuego medio.',
      'Sirve el arroz con los frijoles por encima y la salsa picante al gusto en la mesa.'
    ],
    ingredients: [
      { id: 'ri01-arroz', name: 'Arroz blanco grano largo', include: 'included', optional: false, productId: 'p16', qtyPerServing: 75, unit: 'g' },
      { id: 'ri01-frijoles', name: 'Frijoles negros cocidos', include: 'included', optional: false, productId: 'p06', qtyPerServing: 200, unit: 'g' },
      { id: 'ri01-salsa', name: 'Salsa picante (al gusto)', include: 'included', optional: true, productId: 'p04', fixedQty: 1, unit: 'ud' },
      { id: 'ri01-cebolla', name: 'Cebolla', include: 'fresh', optional: false, qtyPerServing: 30, unit: 'g' },
      { id: 'ri01-ajo', name: 'Ajo', include: 'fresh', optional: false, qtyPerServing: 5, unit: 'g' },
      { id: 'ri01-pimiento', name: 'Pimiento verde', include: 'fresh', optional: false, qtyPerServing: 25, unit: 'g' },
      { id: 'ri01-basicos', name: 'Sal, comino y aceite', include: 'pantry', optional: false }
    ]
  },
  {
    id: 'r02',
    name: 'Arepas venezolanas de queso',
    countryText: 'Venezuela',
    countryCode: 'VE',
    dishType: 'entrante',
    difficulty: 'Fácil',
    prepMinutes: 10,
    cookMinutes: 20,
    baseServings: 4, minServings: 2, maxServings: 12, servingStep: 2,
    heroIcon: 'arepa',
    summary: 'Arepas doradas por fuera y suaves por dentro, rellenas de queso blanco fundido.',
    description: 'Receta de demostración original para MARACUYA mercado latino. Con harina de maíz precocida, agua y sal se forma una masa que se cocina en plancha o sartén y se abre para rellenar con queso blanco.',
    utensils: ['Bol para amasar', 'Plancha o sartén antiadherente', 'Horno (opcional, para terminar de cocinar por dentro)'],
    tips: [
      'Deja reposar la masa 5 minutos antes de formar las arepas: cuesta menos que no se agriete.',
      'Si el centro queda crudo, termina la cocción unos minutos en el horno.'
    ],
    steps: [
      'Mezcla la harina de maíz con sal y agua tibia hasta formar una masa suave y sin grumos.',
      'Deja reposar la masa 5 minutos.',
      'Forma bolas y aplánalas en discos de 1-2 cm de grosor.',
      'Cocina en plancha caliente con un poco de mantequilla, unos 8-10 minutos por cada lado.',
      'Abre cada arepa por la mitad y rellena con queso blanco rallado.'
    ],
    ingredients: [
      { id: 'ri02-harina', name: 'Harina de maíz blanca precocida', include: 'included', optional: false, productId: 'p02', qtyPerServing: 150, unit: 'g' },
      { id: 'ri02-queso', name: 'Queso blanco rallado', include: 'fresh', optional: false, qtyPerServing: 60, unit: 'g' },
      { id: 'ri02-basicos', name: 'Mantequilla, sal y agua', include: 'pantry', optional: false }
    ]
  },
  {
    id: 'r03',
    name: 'Arroz con leche tropical, coco y canela',
    countryText: 'Perú y México',
    countryCode: 'PE',
    dishType: 'postre',
    difficulty: 'Media',
    prepMinutes: 10,
    cookMinutes: 40,
    baseServings: 6, minServings: 2, maxServings: 12, servingStep: 2,
    heroIcon: 'rice-pudding',
    summary: 'Arroz con leche cremoso perfumado con canela en rama y un toque de coco rallado.',
    description: 'Receta de demostración original para MARACUYA mercado latino. El arroz se cuece a fuego lento con leche condensada, canela y cáscara de limón hasta lograr una textura cremosa, y se termina con coco rallado.',
    utensils: ['Olla de fondo grueso', 'Cuchara de madera', 'Rallador (para la cáscara de limón)'],
    tips: [
      'Remueve con frecuencia hacia el final de la cocción para que no se pegue al fondo.',
      'Sirve tibio o frío, según prefieras; espesa un poco más al enfriarse.'
    ],
    steps: [
      'Cocina el arroz en agua con la canela en rama y la cáscara de limón hasta que esté casi tierno.',
      'Retira la cáscara de limón y añade la leche condensada.',
      'Cocina a fuego bajo, removiendo con frecuencia, hasta obtener una textura cremosa.',
      'Retira la canela en rama antes de servir.',
      'Sirve y espolvorea coco rallado por encima al gusto.'
    ],
    ingredients: [
      { id: 'ri03-arroz', name: 'Arroz blanco grano largo', include: 'included', optional: false, productId: 'p16', qtyPerServing: 45, unit: 'g' },
      { id: 'ri03-leche', name: 'Leche condensada', include: 'included', optional: false, productId: 'p07', qtyPerServing: 65, unit: 'g' },
      { id: 'ri03-coco', name: 'Coco rallado deshidratado', include: 'included', optional: true, productId: 'p17', altProductId: 'p17b', qtyPerServing: 15, unit: 'g' },
      { id: 'ri03-canela', name: 'Canela en rama', include: 'included', optional: true, productId: 'p18', fixedQty: 1, unit: 'ud' },
      { id: 'ri03-limon', name: 'Cáscara de limón', include: 'fresh', optional: true, fixedQty: 1, unit: 'ud' },
      { id: 'ri03-basicos', name: 'Agua y azúcar', include: 'pantry', optional: false }
    ]
  },
  {
    id: 'r04',
    name: 'Pollo en mole poblano',
    countryText: 'México',
    countryCode: 'MX',
    dishType: 'principal',
    difficulty: 'Media',
    prepMinutes: 15,
    cookMinutes: 45,
    baseServings: 4, minServings: 2, maxServings: 8, servingStep: 2,
    heroIcon: 'mole-chicken',
    summary: 'Pechugas de pollo bañadas en una salsa de mole poblano espesa y aromática.',
    description: 'Receta de demostración original para MARACUYA mercado latino. La pasta de mole se diluye con caldo caliente hasta lograr una salsa untuosa en la que se termina de cocinar el pollo.',
    utensils: ['Cazuela amplia', 'Batidor de varillas', 'Cuchara de madera'],
    tips: [
      'Diluye la pasta de mole poco a poco con caldo caliente para que no queden grumos.',
      'Prueba de sal antes de servir: la pasta de mole ya suele llevar sazón.'
    ],
    steps: [
      'Cuece el pollo en caldo hasta que esté tierno y resérvalo.',
      'Diluye la pasta de mole con parte del caldo caliente, removiendo hasta que quede suave.',
      'Cocina la salsa a fuego bajo 10-15 minutos, removiendo con frecuencia.',
      'Incorpora el pollo a la salsa y cocina 5 minutos más para que se impregne.',
      'Sirve caliente con ajonjolí tostado por encima si lo deseas.'
    ],
    ingredients: [
      { id: 'ri04-mole', name: 'Mole poblano en pasta', include: 'included', optional: false, productId: 'p05', qtyPerServing: 50, unit: 'g' },
      { id: 'ri04-pollo', name: 'Pechuga de pollo', include: 'fresh', optional: false, qtyPerServing: 200, unit: 'g' },
      { id: 'ri04-caldo', name: 'Caldo de pollo', include: 'pantry', optional: false },
      { id: 'ri04-ajonjoli', name: 'Ajonjolí tostado (opcional, no vendido en tienda)', include: 'fresh', optional: true, fixedQty: 1, unit: 'ud' },
      { id: 'ri04-sal', name: 'Sal', include: 'pantry', optional: false }
    ]
  }
];

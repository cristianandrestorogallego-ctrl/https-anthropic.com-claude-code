window.MARACUYA = window.MARACUYA || {};

MARACUYA.offers = [
  {
    id: 'off-dia-alfajores',
    scope: 'day',
    label: 'Oferta del día',
    productId: 'p09',
    newPrice: 7.90,
    endISO: '2026-09-16T23:59:00+02:00',
    isDemoExample: true
  },
  {
    id: 'off-mes-cafe',
    scope: 'month',
    label: 'Oferta del mes',
    productId: 'p01',
    newPrice: 6.50,
    endISO: '2026-09-30T23:59:00+02:00',
    isDemoExample: true
  },
  {
    id: 'off-mes-aji',
    scope: 'month',
    label: 'Oferta del mes',
    productId: 'p19',
    newPrice: 4.10,
    endISO: '2026-09-30T23:59:00+02:00',
    isDemoExample: true
  },
  {
    id: 'off-finalizada-chicharrones',
    scope: 'day',
    label: 'Oferta del día',
    productId: 'p13',
    newPrice: 1.79,
    endISO: '2026-09-10T23:59:00+02:00',
    isDemoExample: true,
    note: 'Ejemplo de oferta ya finalizada, incluido a propósito para mostrar ese estado en el prototipo.'
  }
];

MARACUYA.packagePromos = [
  {
    id: 'promo-frijoles-completo',
    recipeId: 'r01',
    label: '10% al llevar el paquete completo',
    discountPct: 10,
    requiresIngredientIds: ['ri01-arroz', 'ri01-frijoles', 'ri01-salsa'],
    isDemoExample: true
  }
];

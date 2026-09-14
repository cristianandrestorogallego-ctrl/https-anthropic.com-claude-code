window.MARACUYA = window.MARACUYA || {};

MARACUYA.config = {
  brand: {
    name: 'MARACUYA',
    descriptor: 'mercado latino',
    tagline: 'Los sabores de Latinoamérica, a un pedido de distancia',
    isProvisionalIdentity: true
  },

  whatsapp: {
    numberE164: '',
    displayNote: 'Número de WhatsApp pendiente de configurar por el equipo de MARACUYA.'
  },

  contact: {
    email: 'hola@maracuya-mercado.example',
    phoneDisplay: 'Pendiente de configurar',
    addressNote: 'Reparto en España peninsular. Dirección de recogida pendiente de definir.'
  },

  categories: [
    { id: 'bebidas', label: 'Bebidas', icon: 'drink-glass', blurb: 'Refrescos, aguas de fruta e instantáneos' },
    { id: 'snacks', label: 'Snacks', icon: 'chips', blurb: 'Para picar entre horas' },
    { id: 'dulces', label: 'Dulces', icon: 'sweet', blurb: 'Postres y caprichos' },
    { id: 'despensa', label: 'Despensa', icon: 'pantry', blurb: 'Granos, harinas y básicos' },
    { id: 'salsas', label: 'Salsas', icon: 'bottle', blurb: 'Picantes, moles y aderezos' }
  ],

  countries: [
    { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
    { code: 'VE', name: 'Venezuela', flag: '🇻🇪' },
    { code: 'MX', name: 'México', flag: '🇲🇽' },
    { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
    { code: 'PE', name: 'Perú', flag: '🇵🇪' },
    { code: 'DO', name: 'República Dominicana', flag: '🇩🇴' },
    { code: 'CU', name: 'Cuba', flag: '🇨🇺' },
    { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰' }
  ],

  paymentMethods: [
    { id: 'card', label: 'Tarjeta', status: 'planned', note: 'Vía checkout seguro de Shopify' },
    { id: 'paypal', label: 'PayPal', status: 'planned', note: 'Sujeto a activación en la tienda' },
    { id: 'bizum', label: 'Bizum', status: 'planned', note: 'Sujeto a activación en la tienda' }
  ],

  delivery: {
    timezone: 'Europe/Madrid',
    prepDays: 1,
    cutoffHour: 14,
    saturdayCounts: false,
    holidaysISO: ['2026-10-12', '2026-11-01', '2026-12-06', '2026-12-08', '2026-12-25', '2027-01-01', '2027-01-06'],
    zones: [
      { id: 'z1', name: 'Madrid capital (ejemplo)', prefixes: ['28'], minDays: 1, maxDays: 1, available: true },
      { id: 'z2', name: 'Barcelona capital (ejemplo)', prefixes: ['08'], minDays: 1, maxDays: 2, available: true },
      { id: 'z3', name: 'Península — resto de zonas (ejemplo)', prefixes: ['default'], minDays: 1, maxDays: 2, available: true },
      { id: 'z4', name: 'Baleares (ejemplo, pendiente de confirmar)', prefixes: ['07'], minDays: null, maxDays: null, available: false },
      { id: 'z5', name: 'Canarias (ejemplo, pendiente de confirmar)', prefixes: ['35', '38'], minDays: null, maxDays: null, available: false },
      { id: 'z6', name: 'Ceuta y Melilla (ejemplo, pendiente de confirmar)', prefixes: ['51', '52'], minDays: null, maxDays: null, available: false }
    ]
  },

  demoNotice: 'Prototipo de demostración. Productos, precios, existencias, ofertas y plazos de entrega son ficticios y no representan una tienda operativa. No se procesan pedidos ni pagos reales.'
};

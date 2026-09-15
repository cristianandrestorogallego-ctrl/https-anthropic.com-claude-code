// ============ Home hero ============
function renderHeroBrand(){
  return '<section class="hero"><div class="hero-inner">' +
    '<div class="hero-copy">' +
    '<h1>' + esc(MARACUYA.config.brand.heroTitle) + '</h1>' +
    '<p>' + esc(MARACUYA.config.brand.heroBody) + '</p>' +
    '<div class="hero-ctas"><a class="btn btn-primary" href="#/catalogo">' + esc(MARACUYA.config.brand.heroCta) + '</a><a class="btn btn-secondary" href="#/ofertas">Ver ofertas</a></div>' +
    '</div><div class="hero-art">' + heroIllustrationImg() + '</div>' +
  '</div></section>';
}
function renderHeroOffers(slides){
  var len = slides.length;
  var i = ((state.heroSlide % len) + len) % len;
  var current = slides[i];
  var offer = current.offer, product = current.product;
  var pricing = getPricing(product);
  var country = getCountry(product.assocCountry);
  var scopeBadge = offer.scope === 'day' ? icon('zap', 14) : icon('tag', 14);
  var desc = product.description || (product.brand + ' · ' + product.format);
  var navHtml = len > 1 ? (
    '<div class="hero-carousel__controls">' +
    '<button class="hero-carousel__arrow is-prev" id="hero-arrow-prev" data-action="hero-prev" aria-label="Oferta anterior" aria-controls="hero-slide-panel" style="transform:scaleX(-1)">' + icon('chevron-right', 18) + '</button>' +
    '<div class="hero-carousel__dots">' + slides.map(function(s, idx){
      return '<button class="hero-carousel__dot' + (idx === i ? ' is-active' : '') + '" id="hero-dot-' + idx + '" aria-label="Ir a la oferta ' + (idx + 1) + ' de ' + len + '" aria-current="' + (idx === i) + '" data-action="hero-goto" data-index="' + idx + '"></button>';
    }).join('') + '</div>' +
    '<button class="hero-carousel__arrow is-next" id="hero-arrow-next" data-action="hero-next" aria-label="Oferta siguiente" aria-controls="hero-slide-panel">' + icon('chevron-right', 18) + '</button>' +
    '</div>'
  ) : '';
  return '<section class="hero-carousel" aria-roledescription="carrusel" aria-label="Ofertas destacadas">' +
    '<div class="hero-slide tile-' + product.category + '" id="hero-slide-panel">' +
    '<div class="hero-slide__bg" aria-hidden="true">' + glyphSvg(product.glyph) + '</div>' +
    '<div class="hero-slide__scrim" aria-hidden="true"></div>' +
    '<div class="hero-slide__content">' +
    '<div class="hero-slide__badges">' +
    '<span class="hero-badge">' + scopeBadge + ' ' + esc(offer.label) + '</span>' +
    (pricing.discountPct ? '<span class="hero-discount">-' + pricing.discountPct + '%</span>' : '') +
    '<span class="hero-countdown" data-countdown-end="' + offer.endISO + '">' + icon('clock', 14) + ' Termina en <span class="countdown-chip tabular">--:--:--</span></span>' +
    '</div>' +
    (country ? '<span class="hero-slide__country">' + flagFor(country.code) + ' ' + esc(country.name) + '</span>' : '') +
    '<h1 class="hero-slide__title">' + esc(product.name) + '</h1>' +
    '<p class="hero-slide__desc">' + esc(desc) + '</p>' +
    '<div class="hero-ctas"><a class="btn btn-primary" href="#/producto/' + product.id + '">Ver oferta ' + icon('arrow-right', 16) + '</a>' +
    '<a class="btn btn-secondary" href="#/ofertas">Ver todas las ofertas</a></div>' +
    '</div>' + navHtml +
    '</div></section>';
}

// ============ Home ============
function renderHome(){
  var activeOffers = MARACUYA.offers.filter(function(o){ return new Date(o.endISO).getTime() > Date.now(); });
  var activeOfferProducts = activeOffers.map(function(o){ return getProduct(o.productId); });
  var heroSlides = activeOffers.map(function(o){ return { offer:o, product:getProduct(o.productId) }; });
  var popularIds = ['p01', 'p02', 'p04', 'p06', 'p08', 'p09', 'p11', 'p12', 'p14', 'p16', 'p19'];
  var popular = MARACUYA.products
    .filter(function(p){ return popularIds.indexOf(p.id) !== -1 && !getActiveOffer(p.id); })
    .slice(0, 8);
  var featuredRecipes = MARACUYA.recipes.slice(0, 3);
  var countriesWithProducts = MARACUYA.config.countries.filter(function(c){ return MARACUYA.products.some(function(p){ return p.assocCountry === c.code; }); });

  return '' +
  (heroSlides.length ? renderHeroOffers(heroSlides) : renderHeroBrand()) +

  '<section class="section"><div class="container">' +
    '<div class="section-header"><div><h2>Categorías</h2><p class="section-subtitle">Todo lo que necesitas para cocinar y disfrutar.</p></div></div>' +
    '<div class="category-grid">' + MARACUYA.config.categories.map(renderCategoryCardHome).join('') + '</div>' +
  '</div></section>' +

  '<section class="section section-alt"><div class="container">' +
    '<div class="section-header"><div><h2>Ofertas destacadas</h2><p class="section-subtitle">Selección de ofertas de demostración.</p></div>' +
    '<div class="section-header__aside">' +
    '<a class="section-link" href="#/ofertas">Ver todas las ofertas ' + icon('arrow-right', 14) + '</a>' +
    '<div class="offers-rail-nav">' +
    '<button data-action="rail-prev" data-rail="offers-rail-home" aria-label="Ver ofertas anteriores" style="transform:scaleX(-1)">' + icon('chevron-right', 18) + '</button>' +
    '<button data-action="rail-next" data-rail="offers-rail-home" aria-label="Ver más ofertas">' + icon('chevron-right', 18) + '</button></div>' +
    '</div></div>' +
    '<div class="offers-rail-wrap">' +
    '<div class="offers-rail" id="offers-rail-home">' + activeOfferProducts.map(function(p){ return renderProductCard(p, { showCountdown:true }); }).join('') + '</div>' +
    '</div></div></section>' +

  '<section class="section"><div class="container">' +
    '<div class="section-header"><div><h2>Productos populares</h2><p class="section-subtitle">Una muestra de nuestro catálogo de demostración.</p></div>' +
    '<a class="section-link" href="#/catalogo">Ver todo el catálogo ' + icon('arrow-right', 14) + '</a></div>' +
    '<div class="card-grid cols-4">' + popular.map(function(p){ return renderProductCard(p); }).join('') + '</div>' +
  '</div></section>' +

  '<section class="section section-deep"><div class="container">' +
    '<div class="section-header"><div><h2>Cocina con MARACUYA</h2><p class="section-subtitle">Recetas latinas con los ingredientes listos para comprar.</p></div>' +
    '<a class="section-link" href="#/recetas">Ver todas las recetas ' + icon('arrow-right', 14) + '</a></div>' +
    '<div class="card-grid cols-4">' + featuredRecipes.map(renderRecipeCard).join('') + '</div>' +
  '</div></section>' +

  '<section class="section"><div class="container">' +
    '<div class="section-header"><div><h2>Comprar por país</h2><p class="section-subtitle">Descubre productos asociados a cada país de Latinoamérica.</p></div></div>' +
    '<div class="country-grid">' + countriesWithProducts.map(renderCountryTile).join('') + '</div>' +
  '</div></section>' +

  '<section class="section section-deep"><div class="container">' +
    '<div class="feature-grid">' +
    '<div class="feature-card"><span class="feature-card__icon">' + icon('truck', 22) + '</span><div><h3>Envío a toda España</h3><p>Reparto en España peninsular. Introduce tu código postal en cualquier producto para ver una entrega estimada.</p></div></div>' +
    '<div class="feature-card"><span class="feature-card__icon">' + icon('headset', 22) + '</span><div><h3>Atención cercana</h3><p>Escríbenos por WhatsApp para dudas sobre productos, recetas o pedidos.</p></div></div>' +
    '<div class="feature-card"><span class="feature-card__icon">' + icon('shield-check', 22) + '</span><div><h3>Pago seguro</h3><p>Los métodos de pago se habilitarán al conectar la tienda. Hoy la web funciona como demostración.</p></div></div>' +
    '</div>' +
    '<div class="payment-methods">' + MARACUYA.config.paymentMethods.map(function(m){ return '<span class="payment-chip">' + esc(m.label) + '<small>Demostración</small></span>'; }).join('') + '</div>' +
  '</div></section>';
}

// ============ Catalog ============
function renderCatalogPage(){
  var f = state.filters.catalog;
  var list = MARACUYA.products.slice();
  if(f.q){
    var q = f.q.toLowerCase();
    list = list.filter(function(p){ return p.name.toLowerCase().indexOf(q) !== -1 || p.brand.toLowerCase().indexOf(q) !== -1; });
  }
  if(f.category !== 'all') list = list.filter(function(p){ return p.category === f.category; });
  if(f.country !== 'all') list = list.filter(function(p){ return p.assocCountry === f.country; });
  if(f.availability === 'in') list = list.filter(function(p){ return p.stock !== 'out'; });
  if(f.availability === 'out') list = list.filter(function(p){ return p.stock === 'out'; });
  if(f.onSale) list = list.filter(function(p){ return getActiveOffer(p.id); });
  if(f.sort === 'price-asc') list = list.slice().sort(function(a, b){ return getPricing(a).current - getPricing(b).current; });
  if(f.sort === 'price-desc') list = list.slice().sort(function(a, b){ return getPricing(b).current - getPricing(a).current; });

  var active = !!f.q || f.category !== 'all' || f.country !== 'all' || f.availability !== 'all' || f.onSale;
  var countryOptions = MARACUYA.config.countries.filter(function(c){ return MARACUYA.products.some(function(p){ return p.assocCountry === c.code; }); });

  return '<div class="page-hero"><div class="container"><h1>Catálogo</h1><p>Todos los productos de MARACUYA mercado latino. Catálogo de demostración.</p></div></div>' +
  '<div class="container" style="padding-block:var(--sp-7)">' +
    '<div class="filter-bar">' +
    (f.q ? '<span class="filter-toggle is-active">Buscando: "' + esc(f.q) + '" <button data-action="clear-search-only" aria-label="Quitar búsqueda" style="margin-left:6px">' + icon('close', 12) + '</button></span>' : '') +
    '<div class="filter-field"><label for="f-cat-category">Categoría</label><select class="select" id="f-cat-category" data-action="filter-catalog" data-key="category">' +
    '<option value="all">Todas</option>' + MARACUYA.config.categories.map(function(c){ return '<option value="' + c.id + '" ' + (f.category === c.id ? 'selected' : '') + '>' + esc(c.label) + '</option>'; }).join('') + '</select></div>' +
    '<div class="filter-field"><label for="f-cat-country">País</label><select class="select" id="f-cat-country" data-action="filter-catalog" data-key="country">' +
    '<option value="all">Todos</option>' + countryOptions.map(function(c){ return '<option value="' + c.code + '" ' + (f.country === c.code ? 'selected' : '') + '>' + esc(c.name) + '</option>'; }).join('') + '</select></div>' +
    '<div class="filter-field"><label for="f-cat-avail">Disponibilidad</label><select class="select" id="f-cat-avail" data-action="filter-catalog" data-key="availability">' +
    '<option value="all">Todas</option><option value="in" ' + (f.availability === 'in' ? 'selected' : '') + '>Disponibles</option>' +
    '<option value="out" ' + (f.availability === 'out' ? 'selected' : '') + '>Agotados</option></select></div>' +
    '<button class="filter-toggle' + (f.onSale ? ' is-active' : '') + '" data-action="filter-toggle-sale" aria-pressed="' + f.onSale + '">' + icon('tag', 14) + ' Solo ofertas</button>' +
    '<div class="filter-field"><label for="f-cat-sort">Ordenar</label><select class="select" id="f-cat-sort" data-action="filter-catalog" data-key="sort">' +
    '<option value="relevance" ' + (f.sort === 'relevance' ? 'selected' : '') + '>Relevancia</option>' +
    '<option value="price-asc" ' + (f.sort === 'price-asc' ? 'selected' : '') + '>Precio: menor a mayor</option>' +
    '<option value="price-desc" ' + (f.sort === 'price-desc' ? 'selected' : '') + '>Precio: mayor a menor</option></select></div>' +
    (active ? '<button class="filter-clear" data-action="clear-catalog-filters">Limpiar filtros</button>' : '') +
    '</div>' +
    '<p class="filter-results-count">' + list.length + ' producto' + (list.length === 1 ? '' : 's') + ' encontrado' + (list.length === 1 ? '' : 's') + '</p>' +
    (list.length ? '<div class="card-grid cols-4">' + list.map(function(p){ return renderProductCard(p); }).join('') + '</div>' : renderEmptyState('No encontramos productos con esos filtros', 'clear-catalog-filters')) +
  '</div>';
}

// ============ Offers ============
function renderOffersPage(){
  var now = Date.now();
  var dayOffers = MARACUYA.offers.filter(function(o){ return o.scope === 'day' && new Date(o.endISO).getTime() > now; });
  var monthOffers = MARACUYA.offers.filter(function(o){ return o.scope === 'month' && new Date(o.endISO).getTime() > now; });
  var finished = MARACUYA.offers.filter(function(o){ return new Date(o.endISO).getTime() <= now; });

  function section(title, offers){
    if(!offers.length) return '';
    return '<div style="margin-bottom:var(--sp-8)"><h2 style="font-family:var(--font-display);font-size:1.3rem;margin-bottom:14px">' + esc(title) + '</h2>' +
      '<div class="card-grid cols-4">' + offers.map(function(o){ return renderProductCard(getProduct(o.productId), { showCountdown:true }); }).join('') + '</div></div>';
  }

  var finishedHtml = '';
  if(finished.length){
    finishedHtml = '<div><h2 style="font-family:var(--font-display);font-size:1.3rem;margin-bottom:6px">Ejemplo de oferta finalizada</h2>' +
      '<p class="offer-example-note" style="margin-bottom:14px">Incluida a propósito en el prototipo para mostrar cómo se ve una promoción que ya terminó.</p>' +
      '<div class="card-grid cols-4">' + finished.map(function(o){
        return '<div class="offer-finished-card" style="border-radius:var(--radius-md)">' + renderProductCard(getProduct(o.productId)) +
          '<p class="offer-example-note" style="padding:8px 4px">' + icon('clock', 12) + ' Oferta finalizada (ejemplo) — terminó el ' + fmtDateEs(new Date(o.endISO)) + '</p></div>';
      }).join('') + '</div></div>';
  }

  return '<div class="page-hero"><div class="container"><h1>Ofertas</h1><p>Selección de ofertas de demostración: ofertas del día y del mes, más un ejemplo de oferta ya finalizada.</p></div></div>' +
  '<div class="container" style="padding-block:var(--sp-7)">' +
    section('Ofertas del día', dayOffers) + section('Ofertas del mes', monthOffers) + finishedHtml +
    (!dayOffers.length && !monthOffers.length && !finished.length ? renderEmptyState('No hay ofertas activas ahora mismo', 'clear-catalog-filters') : '') +
  '</div>';
}

// ============ Country ============
function renderCountryPage(code){
  var country = getCountry(code);
  if(!country) return renderNotFound();
  var list = MARACUYA.products.filter(function(p){ return p.assocCountry === code; });
  return '<div class="page-hero"><div class="container"><h1 style="display:flex;align-items:center;gap:12px">' + flagSvg(code, 30) + ' Productos de ' + esc(country.name) + '</h1>' +
    '<p>Selección de productos asociados a ' + esc(country.name) + ' en nuestro catálogo de demostración.</p></div></div>' +
  '<div class="container" style="padding-block:var(--sp-7)">' +
    '<p class="filter-results-count">' + list.length + ' producto' + (list.length === 1 ? '' : 's') + '</p>' +
    (list.length ? '<div class="card-grid cols-4">' + list.map(function(p){ return renderProductCard(p); }).join('') + '</div>' : renderEmptyState('Aún no hay productos de este país en el catálogo de demostración', 'clear-catalog-filters')) +
  '</div>';
}

// ============ Contact ============
function renderContactPage(){
  var cfg = MARACUYA.config;
  var faqs = [
    { q:'¿Hacéis envíos a toda España?', a:'Por ahora mostramos zonas de ejemplo (ver tabla más abajo). Las zonas reales se confirmarán antes de operar la tienda.' },
    { q:'¿Puedo comprar solo parte de los ingredientes de una receta?', a:'Sí. En cada receta puedes desmarcar los ingredientes que ya tengas; el total se recalcula automáticamente.' },
    { q:'¿Qué pasa si un ingrediente está agotado?', a:'Te lo indicamos claramente y, si existe, te ofrecemos una alternativa compatible. Nunca sustituimos un producto sin que lo elijas tú.' },
    { q:'¿Los pedidos por WhatsApp son definitivos?', a:'No. El mensaje de WhatsApp es una solicitud; no confirma el pedido, no reserva stock ni acredita el pago.' }
  ];
  var faqHtml = faqs.map(function(f, i){
    var key = 'faq-' + i;
    var open = state.openAccordions.has(key);
    return '<div class="accordion-item"><button class="accordion-trigger" id="acc-trigger-' + key + '" aria-expanded="' + open + '" aria-controls="acc-panel-' + key + '" data-action="toggle-accordion" data-key="' + key + '">' +
      '<span>' + esc(f.q) + '</span>' + icon('chevron-down', 18) + '</button>' +
      '<div class="accordion-panel" id="acc-panel-' + key + '" ' + (open ? '' : 'hidden') + '>' + esc(f.a) + '</div></div>';
  }).join('');
  var zoneRows = cfg.delivery.zones.map(function(z){
    return '<tr><td>' + esc(z.name) + '</td><td>' + (z.available ? z.minDays + '–' + z.maxDays + ' días hábiles' : '—') + '</td><td>' + (z.available ? 'Sí' : 'Pendiente') + '</td></tr>';
  }).join('');

  return '<div class="page-hero"><div class="container"><h1>Contacto y ayuda</h1><p>Resolvemos dudas sobre productos, recetas, pedidos y envíos.</p></div></div>' +
  '<div class="container" style="padding-block:var(--sp-7);display:grid;gap:var(--sp-8)">' +
    '<div class="feature-grid">' +
    '<div class="feature-card feature-card--surface">' + icon('whatsapp', 22) + '<h3>WhatsApp</h3><p>' + esc(cfg.whatsapp.displayNote) + '</p>' +
    '<button class="btn btn-whatsapp btn-sm" data-action="whatsapp-cart" style="margin-top:6px">Escribir por WhatsApp</button></div>' +
    '<div class="feature-card feature-card--surface">' + icon('info', 22) + '<h3>Correo</h3><p>' + esc(cfg.contact.email) + '</p></div>' +
    '<div class="feature-card feature-card--surface">' + icon('map-pin', 22) + '<h3>Envíos</h3><p>' + esc(cfg.contact.addressNote) + '</p></div>' +
    '</div>' +
    '<div><h2 style="font-family:var(--font-display);font-size:1.4rem;margin-bottom:12px">Preguntas frecuentes</h2>' + faqHtml + '</div>' +
    '<div><h2 style="font-family:var(--font-display);font-size:1.4rem;margin-bottom:12px">Zonas de entrega (ejemplo)</h2>' +
    '<div class="table-scroll"><table class="zone-table"><thead><tr><th>Zona</th><th>Plazo de transporte</th><th>Disponible</th></tr></thead><tbody>' + zoneRows + '</tbody></table></div>' +
    '<p class="offer-example-note">Zona horaria Europe/Madrid. Corte de pedidos a las ' + cfg.delivery.cutoffHour + ':00. Reglas de ejemplo, pendientes de confirmación comercial.</p></div>' +
  '</div>';
}

// ============ Not found ============
function renderNotFound(){
  return '<div class="container" style="padding-block:var(--sp-10)"><div class="empty-state">' + icon('alert-circle', 40) +
    '<h3>Página no encontrada</h3><p>Vuelve al inicio para seguir explorando MARACUYA mercado latino.</p>' +
    '<a class="btn btn-primary" href="#/">Ir al inicio</a></div></div>';
}

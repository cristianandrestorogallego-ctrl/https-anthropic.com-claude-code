// ============ Small shared UI pieces ============
function pendingField(label){
  return '<span class="pending-note">' + icon('info', 14) + ' ' + esc(label) + ': pendiente de confirmar con el proveedor</span>';
}
function renderBreadcrumbs(items){
  return '<nav class="breadcrumbs" aria-label="Ruta de navegación">' + items.map(function(it, i){
    var sep = i > 0 ? '<span class="sep">/</span>' : '';
    var content = it.href ? ('<a href="' + it.href + '">' + esc(it.label) + '</a>') : ('<span aria-current="page">' + esc(it.label) + '</span>');
    return sep + content;
  }).join('') + '</nav>';
}
function renderEmptyState(message, clearAction){
  return '<div class="empty-state">' + icon('search', 40) +
    '<h3>' + esc(message) + '</h3>' +
    '<p>Prueba a cambiar o limpiar los filtros para ver más resultados.</p>' +
    '<button class="btn btn-outline" data-action="' + clearAction + '">Limpiar filtros</button></div>';
}
function renderDeliveryBox(instanceId){
  var cp = state.postalCode || '';
  var resultHtml = '';
  if(!cp){
    resultHtml = '<p class="delivery-caption">Introduce tu código postal para estimar la entrega.</p>';
  } else {
    var result = computeDeliveryEstimate(cp);
    if(result.status === 'invalid'){
      resultHtml = '<p class="delivery-caption" style="color:var(--danger)">Introduce un código postal válido de 5 dígitos.</p>';
    } else if(result.status === 'unavailable'){
      resultHtml = '<p class="delivery-caption" style="color:var(--danger)">Envíos no disponibles todavía en tu zona (ejemplo) — pendiente de confirmación comercial.</p>';
    } else {
      var sameDay = result.start.getTime() === result.end.getTime();
      var headline = sameDay ? ('Entrega estimada el ' + fmtDateEs(result.start)) : ('Entrega estimada entre el ' + fmtDateEs(result.start) + ' y el ' + fmtDateEs(result.end));
      resultHtml = '<div class="delivery-result"><strong>' + headline + '</strong><span class="delivery-caption">' + esc(result.zoneName) + ' · Estimación orientativa, no garantizada. Reglas de ejemplo pendientes de confirmación comercial.</span></div>';
    }
  }
  return '<div class="delivery-box">' +
    '<div class="delivery-box__title">' + icon('truck', 18) + ' Estimar entrega</div>' +
    '<form class="delivery-form" data-instance="' + instanceId + '">' +
    '<label class="visually-hidden" for="postal-' + instanceId + '">Código postal</label>' +
    '<input class="text-input" type="text" inputmode="numeric" maxlength="5" placeholder="Ej. 28001" id="postal-' + instanceId + '" value="' + esc(cp) + '"/>' +
    '<button class="btn btn-outline btn-sm" type="submit">Consultar</button>' +
    '</form>' + resultHtml + '</div>';
}
function renderCountdown(offer){
  var active = new Date(offer.endISO).getTime() > Date.now();
  if(!active) return '<span class="countdown is-finished">' + icon('clock', 12) + ' Oferta finalizada (ejemplo)</span>';
  return '<span class="countdown" data-countdown-end="' + offer.endISO + '">' + icon('clock', 12) + ' Termina en <span class="countdown-chip tabular">--:--:--</span></span>';
}
function tickCountdowns(){
  function pad(n){ return String(n).padStart(2, '0'); }
  document.querySelectorAll('[data-countdown-end]').forEach(function(elm){
    var end = new Date(elm.dataset.countdownEnd).getTime();
    var diff = end - Date.now();
    var chip = elm.querySelector('.countdown-chip') || elm;
    if(diff <= 0){ elm.classList.add('is-finished'); chip.textContent = 'Oferta finalizada'; return; }
    var d = Math.floor(diff / 86400000);
    var h = Math.floor((diff % 86400000) / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    var s = Math.floor((diff % 60000) / 1000);
    chip.textContent = d > 0 ? (d + 'd ' + pad(h) + 'h') : (pad(h) + ':' + pad(m) + ':' + pad(s));
  });
}

// ============ Product info accordion (detail page) ============
function productInfoAccordion(product){
  var items = [
    { key:'ing', label:'Ingredientes', value: product.ingredientsText },
    { key:'alg', label:'Alérgenos', value: product.allergens },
    { key:'cons', label:'Conservación', value: product.conservation },
    { key:'nut', label:'Información nutricional', value: product.nutrition }
  ];
  return items.map(function(it){
    var stateKey = 'prod-' + product.id + '-' + it.key;
    var open = state.openAccordions.has(stateKey);
    var body = it.value === 'PENDING' ? pendingField(it.label) : ('<p>' + esc(it.value) + '</p>');
    return '<div class="accordion-item">' +
      '<button class="accordion-trigger" id="acc-trigger-' + stateKey + '" aria-expanded="' + open + '" aria-controls="acc-panel-' + stateKey + '" data-action="toggle-accordion" data-key="' + stateKey + '">' +
      '<span>' + esc(it.label) + '</span>' + icon('chevron-down', 18) + '</button>' +
      '<div class="accordion-panel" id="acc-panel-' + stateKey + '" ' + (open ? '' : 'hidden') + '>' + body + '</div></div>';
  }).join('');
}

// ============ Cards ============
function renderProductCard(product, opts){
  opts = opts || {};
  var pricing = getPricing(product);
  var stockMeta = getStockMeta(product.stock);
  var country = getCountry(product.assocCountry);
  var hasVariants = Array.isArray(product.variants) && product.variants.length > 0;
  var ctaHtml;
  if(product.stock === 'out'){
    ctaHtml = '<button class="btn btn-ghost btn-block btn-sm" disabled>Agotado</button>';
  } else if(hasVariants){
    ctaHtml = '<a class="btn btn-outline btn-block btn-sm" href="#/producto/' + product.id + '">Elegir opciones</a>';
  } else {
    ctaHtml = '<button class="btn btn-primary btn-block btn-sm" id="add-cart-' + product.id + (opts.idSuffix || '') + '" data-action="add-to-cart" data-product-id="' + product.id + '">Añadir al carrito</button>';
  }
  var badges = '';
  if(pricing.offer) badges += '<span class="badge badge-offer">-' + pricing.discountPct + '%</span>';
  if(product.stock === 'low') badges += '<span class="badge badge-stock-low">' + stockMeta.label + '</span>';
  if(product.stock === 'out') badges += '<span class="badge badge-stock-out">' + stockMeta.label + '</span>';
  if(opts.showCountdown && pricing.offer) badges += renderCountdown(pricing.offer);
  return '<article class="product-card">' +
    '<a href="#/producto/' + product.id + '" class="product-card__media tile-' + product.category + '" aria-label="' + esc(product.name) + '">' +
    '<span class="product-card__badges">' + badges + '</span>' + glyphSvg(product.glyph) + '</a>' +
    '<div class="product-card__body">' +
    '<span class="product-card__country">' + (country ? country.flag + ' ' + esc(country.name) : '') + '</span>' +
    '<a href="#/producto/' + product.id + '"><h3 class="product-card__name">' + esc(product.name) + '</h3></a>' +
    '<span class="product-card__brand">' + esc(product.brand) + ' · ' + esc(product.format) + '</span>' +
    '<div class="product-card__price-row"><span class="price">' + formatMoney(pricing.current) + '</span>' +
    (pricing.old ? '<span class="price-old">' + formatMoney(pricing.old) + '</span>' : '') + '</div>' +
    '<div class="product-card__cta">' + ctaHtml + '</div></div></article>';
}
function renderRecipeCard(recipe){
  var ui = getRecipeUiState(recipe.id);
  var pkg = computePackage(recipe, ui);
  var available = isPackageAvailable(recipe);
  return '<article class="recipe-card">' +
    '<a href="#/receta/' + recipe.id + '" class="recipe-card__media tile-deep">' +
    '<span class="recipe-card__badges"><span class="badge badge-demo">Demostración</span>' +
    (available ? '' : '<span class="badge badge-stock-out">Paquete no disponible</span>') + '</span>' +
    heroGlyphSvg(recipe.heroIcon) + '</a>' +
    '<div class="recipe-card__body">' +
    '<span class="recipe-card__country">' + flagFor(recipe.countryCode) + ' ' + esc(recipe.countryText) + '</span>' +
    '<h3 class="recipe-card__name">' + esc(recipe.name) + '</h3>' +
    '<div class="recipe-card__meta">' +
    '<span>' + icon('clock', 14) + ' ' + (recipe.prepMinutes + recipe.cookMinutes) + ' min</span>' +
    '<span>' + icon('flame', 14) + ' ' + esc(recipe.difficulty) + '</span>' +
    '<span>' + icon('users', 14) + ' ' + recipe.baseServings + ' raciones</span></div>' +
    '<div class="recipe-card__price"><span style="font-size:.78rem;color:var(--ink-soft)">Paquete desde</span><span class="price">' + formatMoney(pkg.total) + '</span></div>' +
    '<div class="recipe-card__actions"><a class="btn btn-outline btn-sm" href="#/receta/' + recipe.id + '">Ver receta</a>' +
    '<a class="btn btn-primary btn-sm" href="#/receta/' + recipe.id + '">Ver paquete</a></div></div></article>';
}
function renderCategoryCardHome(cat){
  return '<a class="category-card" href="#/catalogo" data-action="goto-category" data-cat="' + cat.id + '">' +
    '<span class="category-card__media tile-' + cat.id + '">' + glyphSvg(cat.icon) + '</span>' +
    '<strong>' + esc(cat.label) + '</strong><span>' + esc(cat.blurb) + '</span></a>';
}
function renderCountryTile(c){
  var n = MARACUYA.products.filter(function(p){ return p.assocCountry === c.code; }).length;
  return '<a class="country-tile" href="#/pais/' + c.code + '"><span class="flag">' + c.flag + '</span>' +
    '<span><span style="display:block">' + esc(c.name) + '</span><small>' + n + ' productos</small></span></a>';
}

// ============ Header ============
function renderHeader(){
  var wrap = document.getElementById('header-wrap');
  var count = cartCount();
  var activeRoute = state.route.name;
  wrap.innerHTML =
    '<div class="site-header">' +
    '<div class="promo-strip"><span>' + esc(MARACUYA.config.brand.descriptor.toUpperCase()) + ' · Envíos a España peninsular · Prototipo de demostración</span></div>' +
    '<div class="header-row">' +
    '<a class="logo" href="#/" aria-label="MARACUYA mercado latino — inicio">' + logoMark() +
    '<span><span class="logo-text">' + esc(MARACUYA.config.brand.name) + '</span><span class="logo-descriptor">' + esc(MARACUYA.config.brand.descriptor) + '</span></span></a>' +
    '<form id="global-search-form" class="search-form" role="search">' +
    '<div class="search-box">' + icon('search', 18) +
    '<label class="visually-hidden" for="global-search-input">Buscar productos</label>' +
    '<input type="text" id="global-search-input" placeholder="Busca café, arepas, mole…" value="' + esc(state.headerSearchDraft) + '" autocomplete="off"/>' +
    '</div></form>' +
    '<div class="header-actions">' +
    '<a class="recetas-tab" href="#/recetas">' + icon('leaf', 16) + ' Recetas</a>' +
    '<button class="btn-icon icon-on-deep cart-btn" id="cart-toggle-btn" data-action="open-cart" aria-haspopup="dialog" aria-controls="cart-drawer" aria-expanded="false" aria-label="Abrir carrito' + (count ? ', ' + count + ' productos' : '') + '">' +
    icon('cart', 22) + (count ? '<span class="cart-count" aria-hidden="true">' + count + '</span>' : '') + '</button>' +
    '<button class="menu-btn" id="menu-toggle-btn" data-action="open-menu" aria-haspopup="dialog" aria-controls="mega-menu" aria-expanded="false">' +
    '<span class="bars"><span></span><span></span><span></span></span> Menú</button>' +
    '</div></div>' +
    '<nav class="quick-nav" aria-label="Accesos rápidos"><div class="quick-nav-inner">' +
    '<a class="quick-pill' + (activeRoute === 'catalogo' ? ' is-active' : '') + '" href="#/catalogo">' + icon('tag', 14) + ' Ver todo</a>' +
    '<a class="quick-pill' + (activeRoute === 'ofertas' ? ' is-active' : '') + '" href="#/ofertas">🔥 Ofertas del día</a>' +
    '<a class="quick-pill' + (activeRoute === 'recetas' ? ' is-active' : '') + '" href="#/recetas">' + icon('leaf', 14) + ' Recetas</a>' +
    '<a class="quick-pill" href="#/catalogo" data-action="goto-category" data-cat="despensa">Despensa</a>' +
    '<a class="quick-pill" href="#/contacto">' + icon('headset', 14) + ' Ayuda</a>' +
    '</div></nav></div>';
}

// ============ Mega menu (static content, built once) ============
function renderMegaMenuContent(){
  var el = document.getElementById('mega-menu');
  var cats = MARACUYA.config.categories.map(function(c){
    return '<li><a href="#/catalogo" data-action="goto-category-close" data-cat="' + c.id + '">' + esc(c.label) + '</a></li>';
  }).join('');
  var countries = MARACUYA.config.countries.filter(function(c){ return MARACUYA.products.some(function(p){ return p.assocCountry === c.code; }); }).map(function(c){
    return '<li><a href="#/pais/' + c.code + '" data-action="close-overlay">' + c.flag + ' ' + esc(c.name) + '</a></li>';
  }).join('');
  el.innerHTML =
    '<div class="mega-menu__head"><strong>Menú</strong><button class="btn-icon" data-action="close-overlay" aria-label="Cerrar menú">' + icon('close', 20) + '</button></div>' +
    '<div class="mega-menu__body">' +
    '<div class="mega-menu__section"><h3>Comprar</h3><ul>' +
    '<li><a href="#/catalogo" data-action="close-overlay">Ver todos los productos</a></li>' + cats + '</ul></div>' +
    '<div class="mega-menu__section"><h3>Ofertas y recetas</h3><ul>' +
    '<li><a href="#/ofertas" data-action="close-overlay">Ofertas del día</a></li>' +
    '<li><a href="#/ofertas" data-action="close-overlay">Ofertas del mes</a></li>' +
    '<li><a href="#/recetas" data-action="close-overlay">Recetas</a></li>' +
    '<li><a href="#/recetas" data-action="close-overlay">Paquetes para cocinar</a></li></ul></div>' +
    '<div class="mega-menu__section"><h3>Comprar por país</h3><ul>' + countries + '</ul></div>' +
    '</div>' +
    '<div class="mega-menu__cta"><a class="btn btn-ghost btn-block" href="#/contacto" data-action="close-overlay">' + icon('headset', 16) + ' Contacto y ayuda</a></div>';
}

// ============ Cart drawer ============
function renderCartLine(l){
  var p = getProduct(l.productId);
  var cat = p ? p.category : 'despensa';
  return '<div class="cart-line">' +
    '<div class="cart-line__media tile-' + cat + '">' + glyphSvg(l.glyph) + '</div>' +
    '<div><div class="cart-line__name">' + esc(l.name) + '</div>' +
    '<div class="cart-line__meta">' + esc(l.brand) + ' · ' + esc(l.format) + '</div>' +
    '<div class="cart-line__price tabular">' + formatMoney(l.unitPrice) + ' c/u</div></div>' +
    '<div class="cart-line__actions"><div class="qty-stepper">' +
    '<button id="qty-dec-' + l.lineId + '" data-action="cart-qty-dec" data-line-id="' + l.lineId + '" aria-label="Reducir cantidad">' + icon('minus', 12) + '</button>' +
    '<span class="tabular">' + l.qty + '</span>' +
    '<button id="qty-inc-' + l.lineId + '" data-action="cart-qty-inc" data-line-id="' + l.lineId + '" aria-label="Aumentar cantidad">' + icon('plus', 12) + '</button>' +
    '</div><button class="cart-line__remove" data-action="cart-remove" data-line-id="' + l.lineId + '">Eliminar</button></div></div>';
}
function renderCartDrawer(){
  var container = document.getElementById('cart-drawer');
  var grouped = groupCartLines(state.cart);
  var isEmpty = state.cart.length === 0;
  var bodyHtml;
  if(isEmpty){
    bodyHtml = '<div class="cart-empty">' + icon('cart', 48) +
      '<div><strong>Tu carrito está vacío</strong><p style="margin-top:6px;font-size:.85rem">Explora el catálogo o las recetas para empezar.</p></div>' +
      '<a class="btn btn-primary" href="#/catalogo" data-action="close-overlay">Explorar productos</a></div>';
  } else {
    bodyHtml = grouped.standalone.map(renderCartLine).join('') + grouped.groups.map(function(g){
      return '<div class="cart-recipe-group"><div class="cart-recipe-group__head">' +
        '<span>' + icon('leaf', 14) + ' De la receta: ' + esc(g.recipe.name) + ' (' + g.recipe.servings + ' raciones)</span>' +
        '<a href="#/receta/' + g.recipe.id + '" data-action="close-overlay">Ver receta</a></div>' +
        g.lines.map(renderCartLine).join('') + '</div>';
    }).join('');
  }
  var foot = isEmpty ? '' :
    '<div class="cart-drawer__foot">' + renderDeliveryBox('cart') +
    '<div class="cart-subtotal-row"><span>Subtotal</span><span class="tabular">' + formatMoney(cartSubtotal()) + '</span></div>' +
    '<p class="cart-shipping-note">' + icon('truck', 14) + ' Gastos de envío pendientes de calcular según tu código postal.</p>' +
    '<button class="btn btn-primary btn-block" data-action="checkout">Finalizar compra</button>' +
    '<button class="btn btn-whatsapp btn-block" data-action="whatsapp-cart">' + icon('whatsapp', 16) + ' Pedir por WhatsApp</button>' +
    '<a class="btn btn-ghost btn-block" href="#/catalogo" data-action="close-overlay">Seguir comprando</a>' +
    '<p class="cart-demo-note">Prototipo de demostración: no se procesan pedidos ni pagos reales.</p></div>';
  container.innerHTML =
    '<div class="cart-drawer__head"><strong>Tu carrito' + (isEmpty ? '' : ' (' + cartCount() + ')') + '</strong>' +
    '<button class="btn-icon" data-action="close-overlay" aria-label="Cerrar carrito">' + icon('close', 20) + '</button></div>' +
    '<div class="cart-drawer__body">' + bodyHtml + '</div>' + foot;
}

// ============ Info modal ============
function renderInfoModal(){
  var el = document.getElementById('info-modal');
  if(!pendingModalContent){ el.innerHTML = ''; return; }
  el.innerHTML = '<div class="info-modal__card" tabindex="-1">' +
    '<div class="info-modal__head"><strong>' + esc(pendingModalContent.title) + '</strong>' +
    '<button class="btn-icon" data-action="close-overlay" aria-label="Cerrar">' + icon('close', 20) + '</button></div>' +
    '<div>' + pendingModalContent.bodyHtml + '</div></div>';
}

// ============ Global state ============
function defaultCatalogFilters(){ return { q:'', category:'all', country:'all', availability:'all', onSale:false, sort:'relevance' }; }
function defaultRecipeFilters(){ return { country:'all', type:'all', time:'all', avail:'all' }; }

var state = {
  route: { name:'home', params:{} },
  cart: [],
  filters: { catalog: defaultCatalogFilters(), recipes: defaultRecipeFilters() },
  overlay: null,
  recipeUi: {},
  selectedVariant: {},
  detailQty: {},
  detailGalleryIndex: {},
  postalCode: '',
  headerSearchDraft: '',
  openAccordions: new Set(),
  addingLock: false
};
var cartLineSeq = 0;
var pendingModalContent = null;

// ============ Basic helpers ============
function esc(s){
  return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){
    return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c];
  });
}
function round2(n){ return Math.round(n * 100) / 100; }
function formatMoney(n){
  return round2(n).toLocaleString('es-ES', { minimumFractionDigits:2, maximumFractionDigits:2 }) + ' €';
}
function prefersReducedMotion(){
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
function flagFor(code){ return getCountry(code) ? flagSvg(code, 18) : ''; }

// ============ Data lookups ============
function getProduct(id){ return MARACUYA.products.find(function(p){ return p.id === id; }) || null; }
function getRecipe(id){ return MARACUYA.recipes.find(function(r){ return r.id === id; }) || null; }
function getCategory(id){ return MARACUYA.config.categories.find(function(c){ return c.id === id; }) || { id:id, label:id, icon:'bag' }; }
function getCountry(code){ return MARACUYA.config.countries.find(function(c){ return c.code === code; }) || null; }
function getStockMeta(stock){
  if(stock === 'out') return { label:'Agotado', cls:'badge-stock-out' };
  if(stock === 'low') return { label:'Últimas unidades', cls:'badge-stock-low' };
  return { label:'Disponible', cls:'badge-stock-in' };
}

// ============ Pricing / offers ============
function getActiveOffer(productId){
  var now = Date.now();
  var found = null;
  (MARACUYA.offers || []).forEach(function(o){
    if(o.productId === productId && new Date(o.endISO).getTime() > now) found = o;
  });
  return found;
}
function getPricing(product){
  var offer = getActiveOffer(product.id);
  if(offer){
    return { current: offer.newPrice, old: product.basePrice, discountPct: Math.round((1 - offer.newPrice / product.basePrice) * 100), offer: offer };
  }
  return { current: product.basePrice, old: null, discountPct: null, offer: null };
}
function getRecipePromo(recipeId){
  return (MARACUYA.packagePromos || []).find(function(p){ return p.recipeId === recipeId && p.isDemoExample; }) || null;
}

// ============ Recipe package calculator ============
function getRecipeUiState(recipeId){
  if(!state.recipeUi[recipeId]){
    var r = getRecipe(recipeId);
    state.recipeUi[recipeId] = { servings: r.baseServings, excluded: new Set(), altChoice: {} };
  }
  return state.recipeUi[recipeId];
}
function ingredientQtyNeeded(ing, servings){
  if(ing.fixedQty != null) return ing.fixedQty;
  return (ing.qtyPerServing || 0) * servings;
}
function unitsToBuy(ing, product, servings){
  if(ing.unit === 'ud') return ingredientQtyNeeded(ing, servings);
  var total = ingredientQtyNeeded(ing, servings);
  return Math.max(1, Math.ceil(total / product.netQty));
}
function leftoverNote(ing, product, servings){
  if(ing.unit === 'ud') return null;
  var needed = ingredientQtyNeeded(ing, servings);
  var units = unitsToBuy(ing, product, servings);
  var bought = units * product.netQty;
  var leftover = bought - needed;
  if(leftover <= 0) return null;
  return 'Esta receta usa ' + needed + ' ' + ing.unit + ' y el envase es de ' + product.netQty + ' ' + product.netUnit +
    ' → comprarás ' + units + ' envase' + (units > 1 ? 's' : '') + ' completo' + (units > 1 ? 's' : '') +
    ' (sobran ≈' + leftover + ' ' + ing.unit + ').';
}
function resolveIngredient(ing, ui){
  if(ing.include !== 'included') return { purchasable:false };
  var useAlt = ui.altChoice[ing.id] === true;
  var productId = (useAlt && ing.altProductId) ? ing.altProductId : ing.productId;
  var product = getProduct(productId);
  var outOfStock = product.stock === 'out';
  var userExcluded = ui.excluded.has(ing.id);
  var selected = !userExcluded && !outOfStock;
  return { purchasable:true, product:product, outOfStock:outOfStock, selected:selected, useAlt:useAlt, hasAlt: !!ing.altProductId };
}
function promoQualifies(recipe, ui){
  var promo = getRecipePromo(recipe.id);
  if(!promo) return null;
  var allSelected = promo.requiresIngredientIds.every(function(iid){
    var ing = recipe.ingredients.find(function(i){ return i.id === iid; });
    var r = resolveIngredient(ing, ui);
    return r.selected;
  });
  return { promo:promo, qualifies:allSelected };
}
function computePackage(recipe, ui){
  var rows = recipe.ingredients.filter(function(i){ return i.include === 'included'; }).map(function(ing){
    var r = resolveIngredient(ing, ui);
    var units = (r.purchasable && !r.outOfStock) ? unitsToBuy(ing, r.product, ui.servings) : 0;
    var unitPrice = r.product ? getPricing(r.product).current : 0;
    var lineTotal = r.selected ? round2(units * unitPrice) : 0;
    return {
      ing: ing, product: r.product, outOfStock: r.outOfStock, selected: r.selected, useAlt: r.useAlt, hasAlt: r.hasAlt,
      units: units, unitPrice: unitPrice, lineTotal: lineTotal,
      leftover: (r.product && r.selected) ? leftoverNote(ing, r.product, ui.servings) : null
    };
  });
  var freshRows = recipe.ingredients.filter(function(i){ return i.include === 'fresh'; });
  var pantryRows = recipe.ingredients.filter(function(i){ return i.include === 'pantry'; });
  var rawSubtotal = round2(rows.reduce(function(s, r){ return s + (r.selected ? r.lineTotal : 0); }, 0));
  var promoInfo = promoQualifies(recipe, ui);
  var discount = 0;
  if(promoInfo && promoInfo.qualifies) discount = round2(rawSubtotal * promoInfo.promo.discountPct / 100);
  var total = round2(rawSubtotal - discount);
  var isPersonalized = rows.some(function(r){ return !r.outOfStock && !r.selected; });
  var missing = rows.filter(function(r){ return r.outOfStock; }).map(function(r){ return r.ing.name; });
  return { rows:rows, freshRows:freshRows, pantryRows:pantryRows, rawSubtotal:rawSubtotal, promoInfo:promoInfo, discount:discount, total:total, isPersonalized:isPersonalized, missing:missing, servings: ui.servings };
}
function isPackageAvailable(recipe){
  return recipe.ingredients.filter(function(i){ return i.include === 'included' && !i.optional; }).every(function(ing){
    var productOk = getProduct(ing.productId).stock !== 'out';
    var altOk = ing.altProductId ? getProduct(ing.altProductId).stock !== 'out' : false;
    return productOk || altOk;
  });
}

// ============ Cart ============
function groupCartLines(cart){
  var groups = [], standalone = [], groupIndex = {};
  cart.forEach(function(line){
    if(line.fromRecipe){
      var key = line.fromRecipe.id + '::' + line.fromRecipe.servings;
      if(!groupIndex[key]){ groupIndex[key] = { key:key, recipe:line.fromRecipe, lines:[] }; groups.push(groupIndex[key]); }
      groupIndex[key].lines.push(line);
    } else standalone.push(line);
  });
  return { standalone:standalone, groups:groups };
}
function mergeCartLine(line){
  var match = state.cart.find(function(l){
    return l.productId === line.productId &&
      l.variantId === line.variantId &&
      ((!l.fromRecipe && !line.fromRecipe) || (l.fromRecipe && line.fromRecipe && l.fromRecipe.id === line.fromRecipe.id && l.fromRecipe.servings === line.fromRecipe.servings));
  });
  if(match){ match.qty += line.qty; }
  else {
    cartLineSeq++;
    var copy = {}; for(var k in line){ copy[k] = line[k]; }
    copy.lineId = 'cl-' + cartLineSeq + '-' + Date.now().toString(36);
    state.cart.push(copy);
  }
}
function cartSubtotal(){ return round2(state.cart.reduce(function(s, l){ return s + l.unitPrice * l.qty; }, 0)); }
function cartCount(){ return state.cart.reduce(function(s, l){ return s + l.qty; }, 0); }
function saveCart(){ try{ localStorage.setItem('maracuya_cart_v1', JSON.stringify(state.cart)); }catch(e){} }
function loadCart(){
  try{
    var raw = localStorage.getItem('maracuya_cart_v1');
    if(raw){ var parsed = JSON.parse(raw); if(Array.isArray(parsed)) state.cart = parsed; }
  }catch(e){}
}

function addPackageToCart(recipe, ui){
  var pkg = computePackage(recipe, ui);
  var toAdd = pkg.rows.filter(function(r){ return r.selected && r.units > 0; });
  if(toAdd.length === 0){
    showToast({ type:'error', title:'No se pudo añadir', body:'No hay productos disponibles para incluir en este paquete.' });
    return;
  }
  toAdd.forEach(function(r){
    mergeCartLine({
      productId: r.product.id, variantId: null,
      name: r.product.name, brand: r.product.brand, format: r.product.format,
      unitPrice: r.unitPrice, qty: r.units, glyph: r.product.glyph,
      fromRecipe: { id: recipe.id, name: recipe.name, servings: ui.servings }
    });
  });
  saveCart();
  var missingNames = pkg.rows.filter(function(r){ return r.outOfStock; }).map(function(r){ return r.ing.name; });
  var addedNames = toAdd.map(function(r){ return r.product.name + ' ×' + r.units; }).join(', ');
  state.overlay = null;
  openOverlay('cart');
  showToast({
    type: missingNames.length ? 'error' : 'success',
    title: missingNames.length ? 'Paquete añadido parcialmente' : 'Paquete añadido al carrito',
    body: missingNames.length ? ('Añadido: ' + addedNames + '. No incluido (agotado): ' + missingNames.join(', ') + '.') : ('Añadido: ' + addedNames + '.')
  });
}

// ============ Delivery estimator ============
function matchZone(cp){
  var prefix = cp.slice(0, 2);
  var zones = MARACUYA.config.delivery.zones;
  return zones.find(function(z){ return z.prefixes.indexOf(prefix) !== -1; }) || zones.find(function(z){ return z.prefixes.indexOf('default') !== -1; });
}
function isHolidayUtc(d){ return MARACUYA.config.delivery.holidaysISO.indexOf(d.toISOString().slice(0, 10)) !== -1; }
function isBusinessDayUtc(d){
  var day = d.getUTCDay();
  var cfg = MARACUYA.config.delivery;
  if(day === 0) return false;
  if(day === 6 && !cfg.saturdayCounts) return false;
  if(isHolidayUtc(d)) return false;
  return true;
}
function addBusinessDaysUtc(startUtc, days){
  var d = new Date(startUtc.getTime());
  var remaining = days;
  while(remaining > 0){
    d = new Date(d.getTime() + 86400000);
    if(isBusinessDayUtc(d)) remaining--;
  }
  return d;
}
function todayMadridYMDH(){
  var fmt = new Intl.DateTimeFormat('en-CA', { timeZone:'Europe/Madrid', year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', hour12:false });
  var parts = {};
  fmt.formatToParts(new Date()).forEach(function(p){ if(p.type !== 'literal') parts[p.type] = p.value; });
  var h = +parts.hour;
  if(h === 24) h = 0;
  return { y:+parts.year, m:+parts.month, d:+parts.day, h:h };
}
function computeDeliveryEstimate(cpRaw){
  var cp = (cpRaw || '').trim();
  if(!/^\d{5}$/.test(cp)) return { status:'invalid' };
  var zone = matchZone(cp);
  var cfg = MARACUYA.config.delivery;
  if(!zone || !zone.available) return { status:'unavailable', zoneName: zone ? zone.name : null };
  var now = todayMadridYMDH();
  var startUtc = new Date(Date.UTC(now.y, now.m - 1, now.d));
  var prepDays = cfg.prepDays + (now.h >= cfg.cutoffHour ? 1 : 0);
  var readyDate = addBusinessDaysUtc(startUtc, prepDays);
  var start = addBusinessDaysUtc(readyDate, zone.minDays);
  var end = addBusinessDaysUtc(readyDate, zone.maxDays);
  return { status:'ok', zoneName: zone.name, start:start, end:end };
}
function fmtDateEs(dateUtc){
  return new Intl.DateTimeFormat('es-ES', { weekday:'long', day:'numeric', month:'long', timeZone:'Europe/Madrid' }).format(dateUtc);
}

// ============ WhatsApp message builders ============
var WA_DISCLAIMER = 'Este mensaje es una solicitud de pedido de prueba generada desde el prototipo MARACUYA. No confirma la compra, no reserva stock ni acredita el pago.';

function buildWaLink(text){
  var num = (MARACUYA.config.whatsapp.numberE164 || '').replace(/\D/g, '');
  if(!num) return null;
  return 'https://wa.me/' + num + '?text=' + encodeURIComponent(text);
}
function buildProductMessage(product, variant, qty){
  var unitPrice = variant ? variant.basePrice : getPricing(product).current;
  var lines = [
    'Hola MARACUYA 👋, quiero pedir:',
    '• ' + product.name + (variant ? ' — ' + variant.label : '') + ' × ' + qty + ' — ' + formatMoney(unitPrice) + ' c/u',
    'Subtotal: ' + formatMoney(unitPrice * qty),
    '', WA_DISCLAIMER
  ];
  return lines.join('\n');
}
function buildPackageMessage(recipe, pkg){
  var lines = ['Hola MARACUYA 👋, quiero pedir el paquete de la receta "' + recipe.name + '" (' + pkg.servings + ' raciones):', ''];
  pkg.rows.filter(function(r){ return r.selected; }).forEach(function(r){
    lines.push('• ' + r.product.name + ' × ' + r.units + ' — ' + formatMoney(r.lineTotal));
  });
  if(pkg.discount > 0) lines.push('Descuento paquete completo: -' + formatMoney(pkg.discount));
  lines.push('Total paquete: ' + formatMoney(pkg.total));
  if(pkg.missing.length) lines.push('No incluido (agotado): ' + pkg.missing.join(', '));
  var freshNames = pkg.freshRows.map(function(r){ return r.name; });
  if(freshNames.length) lines.push('Consigue por tu cuenta: ' + freshNames.join(', '));
  lines.push('', WA_DISCLAIMER);
  return lines.join('\n');
}
function buildCartMessage(){
  var lines = ['Hola MARACUYA 👋, quiero pedir:', ''];
  var grouped = groupCartLines(state.cart);
  grouped.standalone.forEach(function(l){ lines.push('• ' + l.name + ' × ' + l.qty + ' — ' + formatMoney(l.unitPrice * l.qty)); });
  grouped.groups.forEach(function(g){
    lines.push('Receta: ' + g.recipe.name + ' (' + g.recipe.servings + ' raciones)');
    g.lines.forEach(function(l){ lines.push('  • ' + l.name + ' × ' + l.qty + ' — ' + formatMoney(l.unitPrice * l.qty)); });
  });
  lines.push('', 'Subtotal: ' + formatMoney(cartSubtotal()), 'Gastos de envío: pendientes de calcular según código postal.', '', WA_DISCLAIMER);
  return lines.join('\n');
}

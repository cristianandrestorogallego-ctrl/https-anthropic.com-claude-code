// ============ Product detail ============
function renderProductDetail(product){
  var hasVariants = Array.isArray(product.variants) && product.variants.length > 0;
  if(hasVariants && !state.selectedVariant[product.id]) state.selectedVariant[product.id] = product.variants[0].id;
  var variant = hasVariants ? product.variants.find(function(v){ return v.id === state.selectedVariant[product.id]; }) : null;
  var effectiveStock = variant ? variant.stock : product.stock;
  var effectivePricing = hasVariants ? { current: variant.basePrice, old:null, discountPct:null } : getPricing(product);
  if(!state.detailQty[product.id]) state.detailQty[product.id] = 1;
  var qty = state.detailQty[product.id];
  var country = getCountry(product.assocCountry);
  var originCountry = getCountry(product.originCountry);
  var showOriginDistinct = product.originCountry !== product.assocCountry;
  var category = getCategory(product.category);
  var stockMeta = getStockMeta(effectiveStock);
  var linkedRecipes = (product.usedInRecipes || []).map(getRecipe).filter(Boolean);
  var ctaDisabled = effectiveStock === 'out';
  var gIdx = state.detailGalleryIndex[product.id] || 0;
  var filters = ['none', 'hue-rotate(12deg) brightness(1.05)', 'hue-rotate(-10deg) brightness(.95)'];

  var thumbs = [0, 1, 2].map(function(i){
    return '<button class="' + (i === gIdx ? 'is-active ' : '') + 'tile-' + product.category + '" id="gallery-thumb-' + i + '" data-action="select-gallery" data-index="' + i + '" data-product-id="' + product.id + '" style="filter:' + filters[i] + '" aria-label="Vista ' + (i + 1) + '" aria-pressed="' + (i === gIdx) + '">' + glyphSvg(product.glyph) + '</button>';
  }).join('');

  var variantHtml = '';
  if(hasVariants){
    variantHtml = '<fieldset class="variant-group"><legend>Formato</legend><div class="variant-options">' +
      product.variants.map(function(v){
        return '<label class="variant-chip"><input type="radio" name="variant-' + product.id + '" value="' + v.id + '" data-action="select-variant" data-product-id="' + product.id + '" ' + (v.id === variant.id ? 'checked' : '') + '/> ' + esc(v.label) + ' — ' + formatMoney(v.basePrice) + '</label>';
      }).join('') + '</div></fieldset>';
  }

  return '<div class="container" style="padding-block:var(--sp-7)">' +
    renderBreadcrumbs([{ label:'Inicio', href:'#/' }, { label:category.label, href:'#/catalogo' }, { label:product.name }]) +
    '<div class="detail-layout"><div>' +
    '<div class="gallery-main tile-' + product.category + '" id="gallery-main" style="filter:' + filters[gIdx] + '">' + glyphSvg(product.glyph) + '</div>' +
    '<div class="gallery-thumbs" role="group" aria-label="Más imágenes (ilustrativas, sustituibles por fotografía real)">' + thumbs + '</div>' +
    '</div><div class="detail-info">' +
    '<div class="detail-badges"><span class="badge badge-country">' + flagFor(product.assocCountry) + ' ' + esc(country.name) + '</span>' +
    '<span class="badge ' + stockMeta.cls + '">' + stockMeta.label + '</span>' +
    '<span class="badge badge-demo">Producto de demostración</span></div>' +
    '<h1 class="detail-title">' + esc(product.name) + '</h1>' +
    '<p style="color:var(--ink-soft)">' + esc(product.brand) + ' · ' + esc(hasVariants ? (variant ? variant.label : '') : product.format) + '</p>' +
    (showOriginDistinct ? '<p style="font-size:.85rem;color:var(--ink-soft)">' + icon('map-pin', 14) + ' Fabricado en ' + esc(originCountry.name) + ' · Producto asociado a ' + esc(country.name) + ' en nuestra tienda</p>' : '') +
    '<div class="detail-price-row"><span class="price">' + formatMoney(effectivePricing.current) + '</span>' +
    (effectivePricing.old ? '<span class="price-old">' + formatMoney(effectivePricing.old) + '</span><span class="price-discount">-' + effectivePricing.discountPct + '%</span>' : '') + '</div>' +
    variantHtml +
    '<div class="qty-row"><span style="font-weight:700;font-size:.9rem">Cantidad</span><div class="qty-stepper">' +
    '<button id="detail-qty-dec" data-action="detail-qty-dec" data-product-id="' + product.id + '" aria-label="Reducir cantidad">' + icon('minus', 14) + '</button>' +
    '<span class="tabular">' + qty + '</span>' +
    '<button id="detail-qty-inc" data-action="detail-qty-inc" data-product-id="' + product.id + '" aria-label="Aumentar cantidad">' + icon('plus', 14) + '</button></div></div>' +
    '<div class="detail-ctas">' +
    '<button class="btn btn-primary" id="add-cart-detail-' + product.id + '" data-action="add-to-cart" data-source="detail" data-product-id="' + product.id + '" ' + (ctaDisabled ? 'disabled' : '') + '>' + (ctaDisabled ? 'Agotado' : 'Añadir al carrito') + '</button>' +
    '<button class="btn btn-whatsapp" data-action="whatsapp-product" data-product-id="' + product.id + '">' + icon('whatsapp', 16) + ' Pedir por WhatsApp</button></div>' +
    (linkedRecipes.length ? '<div class="recipe-link-banner">' + icon('info', 18) + ' <span>Este producto forma parte de: ' + linkedRecipes.map(function(r){ return '<a href="#/receta/' + r.id + '">' + esc(r.name) + '</a>'; }).join(', ') + '</span></div>' : '') +
    renderDeliveryBox('product-' + product.id) +
    '<div style="margin-top:var(--sp-6)"><p style="font-size:.95rem;color:var(--ink-soft);line-height:1.6;margin-bottom:10px">' + esc(product.description) + '</p>' + productInfoAccordion(product) + '</div>' +
    '</div></div></div>';
}

// ============ Recipes list ============
function uniqueRecipeCountries(){
  var seen = {}, out = [];
  MARACUYA.recipes.forEach(function(r){
    if(!seen[r.countryCode]){ seen[r.countryCode] = true; out.push({ code:r.countryCode, name:r.countryText }); }
  });
  return out;
}
function renderRecipesPage(){
  var f = state.filters.recipes;
  var list = MARACUYA.recipes.slice();
  if(f.country !== 'all') list = list.filter(function(r){ return r.countryCode === f.country; });
  if(f.type !== 'all') list = list.filter(function(r){ return r.dishType === f.type; });
  if(f.time !== 'all'){
    list = list.filter(function(r){
      var t = r.prepMinutes + r.cookMinutes;
      if(f.time === '30') return t <= 30;
      if(f.time === '60') return t <= 60;
      return true;
    });
  }
  if(f.avail !== 'all') list = list.filter(function(r){ return isPackageAvailable(r) === (f.avail === 'available'); });
  var active = f.country !== 'all' || f.type !== 'all' || f.time !== 'all' || f.avail !== 'all';

  return '<div class="page-hero"><div class="container"><h1>Recetas</h1>' +
    '<p>Inspírate y compra de una vez los ingredientes disponibles en tienda para cada plato. Recetas de demostración.</p></div></div>' +
  '<div class="container" style="padding-block:var(--sp-7)">' +
    '<div class="filter-bar">' +
    '<div class="filter-field"><label for="f-rec-country">País</label><select class="select" id="f-rec-country" data-action="filter-recipes" data-key="country">' +
    '<option value="all">Todos</option>' + uniqueRecipeCountries().map(function(c){ return '<option value="' + c.code + '" ' + (f.country === c.code ? 'selected' : '') + '>' + esc(c.name) + '</option>'; }).join('') + '</select></div>' +
    '<div class="filter-field"><label for="f-rec-type">Tipo de plato</label><select class="select" id="f-rec-type" data-action="filter-recipes" data-key="type">' +
    '<option value="all">Todos</option><option value="principal" ' + (f.type === 'principal' ? 'selected' : '') + '>Plato principal</option>' +
    '<option value="entrante" ' + (f.type === 'entrante' ? 'selected' : '') + '>Entrante</option>' +
    '<option value="postre" ' + (f.type === 'postre' ? 'selected' : '') + '>Postre</option></select></div>' +
    '<div class="filter-field"><label for="f-rec-time">Tiempo</label><select class="select" id="f-rec-time" data-action="filter-recipes" data-key="time">' +
    '<option value="all">Cualquiera</option><option value="30" ' + (f.time === '30' ? 'selected' : '') + '>Hasta 30 min</option>' +
    '<option value="60" ' + (f.time === '60' ? 'selected' : '') + '>Hasta 60 min</option></select></div>' +
    '<div class="filter-field"><label for="f-rec-avail">Paquete</label><select class="select" id="f-rec-avail" data-action="filter-recipes" data-key="avail">' +
    '<option value="all">Todos</option><option value="available" ' + (f.avail === 'available' ? 'selected' : '') + '>Disponible</option>' +
    '<option value="unavailable" ' + (f.avail === 'unavailable' ? 'selected' : '') + '>No disponible</option></select></div>' +
    (active ? '<button class="filter-clear" data-action="clear-recipe-filters">Limpiar filtros</button>' : '') +
    '</div>' +
    '<p class="filter-results-count">' + list.length + ' receta' + (list.length === 1 ? '' : 's') + ' encontrada' + (list.length === 1 ? '' : 's') + '</p>' +
    (list.length ? '<div class="card-grid cols-4">' + list.map(renderRecipeCard).join('') + '</div>' : renderEmptyState('No encontramos recetas con esos filtros', 'clear-recipe-filters')) +
  '</div>';
}

// ============ Recipe detail: ingredient rows + purchase panel ============
function renderIngredientRow(recipe, ing, ui, pkgRow){
  if(ing.include !== 'included'){
    var qtyText = ing.fixedQty != null ? (ing.fixedQty + ' ' + (ing.unit === 'ud' ? 'ud' : ing.unit)) : (Math.round(ing.qtyPerServing * ui.servings) + ' ' + ing.unit);
    var cls = ing.include === 'fresh' ? 'pkg-fresh-row' : 'pkg-pantry-row';
    return '<div class="' + cls + '"><span>' + esc(ing.name) + (ing.optional ? ' (opcional)' : '') + '</span><span class="qty">' + (ing.include === 'pantry' ? 'al gusto' : qtyText) + '</span></div>';
  }
  var r = pkgRow;
  var altAvailable = ing.altProductId && getProduct(ing.altProductId).stock !== 'out';
  var helpHtml = '';
  if(r.outOfStock){
    helpHtml = '<div class="pkg-row__help" style="color:var(--danger)">' + esc(r.product.name) + ' está agotado.' +
      (altAvailable ? ' <button class="pkg-row__altbtn" data-action="use-alt" data-recipe-id="' + recipe.id + '" data-ing-id="' + ing.id + '">Usar alternativa: ' + esc(getProduct(ing.altProductId).name) + ' (' + formatMoney(getPricing(getProduct(ing.altProductId)).current) + ')</button>' : ' Puedes continuar con una selección parcial.') + '</div>';
  } else if(r.leftover){
    helpHtml = '<div class="pkg-row__help">' + esc(r.leftover) + '</div>';
  }
  var needQty = ing.fixedQty != null ? ing.fixedQty : Math.round(ing.qtyPerServing * ui.servings);
  return '<div class="pkg-row' + (r.outOfStock ? ' is-disabled' : '') + '">' +
    '<input type="checkbox" class="pkg-row__check" id="ing-' + recipe.id + '-' + ing.id + '" data-action="toggle-ingredient" data-recipe-id="' + recipe.id + '" data-ing-id="' + ing.id + '" ' + (r.selected ? 'checked' : '') + ' ' + (r.outOfStock ? 'disabled' : '') + '/>' +
    '<div><label for="ing-' + recipe.id + '-' + ing.id + '" class="pkg-row__name">' + esc(r.product.name) + (ing.optional ? ' <span style="font-weight:500;color:var(--ink-faint)">(opcional)</span>' : '') + '</label>' +
    '<div class="pkg-row__help" style="color:var(--ink-soft)">Usa ' + needQty + ' ' + (ing.unit === 'ud' ? 'ud' : ing.unit) + ' · Comprarás ' + r.units + ' × ' + esc(r.product.format) + '</div>' +
    helpHtml +
    (r.useAlt ? '<button class="pkg-row__altbtn" data-action="use-alt" data-recipe-id="' + recipe.id + '" data-ing-id="' + ing.id + '" data-revert="1">Volver al producto habitual (' + esc(getProduct(ing.productId).name) + ')</button>' : '') +
    '</div><div class="pkg-row__price">' + (r.selected ? formatMoney(r.lineTotal) : '—') + '</div></div>';
}
function renderPurchasePanel(recipe){
  var ui = getRecipeUiState(recipe.id);
  var pkg = computePackage(recipe, ui);
  var includedIngs = recipe.ingredients.filter(function(i){ return i.include === 'included'; });
  var freshIngs = recipe.ingredients.filter(function(i){ return i.include === 'fresh'; });
  var pantryIngs = recipe.ingredients.filter(function(i){ return i.include === 'pantry'; });

  var rowsHtml = includedIngs.map(function(ing){
    var pkgRow = pkg.rows.find(function(r){ return r.ing.id === ing.id; });
    return renderIngredientRow(recipe, ing, ui, pkgRow);
  }).join('');
  var freshHtml = freshIngs.length ? '<div class="pkg-group-label">Consigue por tu cuenta</div>' + freshIngs.map(function(ing){ return renderIngredientRow(recipe, ing, ui, null); }).join('') : '';
  var pantryHtml = pantryIngs.length ? '<div class="pkg-group-label">Básicos de despensa (no incluidos)</div>' + pantryIngs.map(function(ing){ return renderIngredientRow(recipe, ing, ui, null); }).join('') : '';

  var promoHtml = '';
  if(pkg.promoInfo){
    var promo = pkg.promoInfo.promo;
    promoHtml = pkg.promoInfo.qualifies
      ? '<div class="promo-box">' + icon('check', 14) + ' ' + esc(promo.label) + ' aplicado (ejemplo de promoción configurada). Descuento: -' + formatMoney(pkg.discount) + '</div>'
      : '<div class="promo-box">Si incluyes todos los productos del paquete completo, se aplica "' + esc(promo.label) + '" (ejemplo). Al quitar productos, esta compra pasa a ser una selección personalizada sin ese descuento.</div>';
  }
  var personalizedHtml = pkg.isPersonalized ? '<div class="selection-note">' + icon('info', 14) + ' Selección personalizada: has quitado algún producto del paquete original.</div>' : '';
  var missingHtml = pkg.missing.length ? '<div class="stock-alert-box">' + icon('alert-triangle', 14) + ' Te faltará: ' + pkg.missing.map(esc).join(', ') + ' (agotado). Puedes usar una alternativa o completar tu compra por tu cuenta.</div>' : '';
  var canAdd = pkg.rows.some(function(r){ return r.selected; });

  return '<aside class="purchase-panel" aria-label="Compra los ingredientes para esta receta">' +
    '<h2 class="purchase-panel__title">Compra los ingredientes para esta receta</h2>' +
    '<div class="servings-control"><span><strong>Raciones</strong><br><span style="font-size:.78rem;color:var(--ink-soft)">Ajusta y recalculamos cantidades</span></span>' +
    '<div class="qty-stepper">' +
    '<button id="servings-dec-' + recipe.id + '" data-action="servings-dec" data-recipe-id="' + recipe.id + '" aria-label="Reducir raciones" ' + (ui.servings <= recipe.minServings ? 'disabled' : '') + '>' + icon('minus', 14) + '</button>' +
    '<span class="tabular" aria-live="polite">' + ui.servings + '</span>' +
    '<button id="servings-inc-' + recipe.id + '" data-action="servings-inc" data-recipe-id="' + recipe.id + '" aria-label="Aumentar raciones" ' + (ui.servings >= recipe.maxServings ? 'disabled' : '') + '>' + icon('plus', 14) + '</button>' +
    '</div></div>' +
    '<div>' + rowsHtml + freshHtml + pantryHtml + '</div>' +
    promoHtml + personalizedHtml + missingHtml +
    '<div class="purchase-total"><span>Total del paquete</span><span>' + formatMoney(pkg.total) + '</span></div>' +
    renderDeliveryBox('recipe-' + recipe.id) +
    '<button class="btn btn-primary btn-block" id="add-package-' + recipe.id + '" data-action="add-package" data-recipe-id="' + recipe.id + '" ' + (canAdd ? '' : 'disabled aria-disabled="true"') + '>Añadir paquete al carrito</button>' +
    '<button class="btn btn-whatsapp btn-block" data-action="whatsapp-package" data-recipe-id="' + recipe.id + '">' + icon('whatsapp', 16) + ' Pedir por WhatsApp</button>' +
    '<p class="cart-demo-note">Prototipo de demostración: no se procesan pedidos ni pagos reales.</p>' +
    '</aside>';
}
function renderRecipeDetail(recipe){
  var ui = getRecipeUiState(recipe.id);
  var ingredientsHtml = recipe.ingredients.map(function(ing){
    var qty = ing.fixedQty != null ? (ing.fixedQty + ' ' + (ing.unit === 'ud' ? 'ud' : ing.unit)) : (Math.round(ing.qtyPerServing * ui.servings) + ' ' + ing.unit);
    return '<li><span>' + esc(ing.name) + '</span><span class="qty tabular">' + (ing.include === 'pantry' ? 'al gusto' : qty) + '</span></li>';
  }).join('');

  return '<div class="container" style="padding-block:var(--sp-7)">' +
    renderBreadcrumbs([{ label:'Inicio', href:'#/' }, { label:'Recetas', href:'#/recetas' }, { label:recipe.name }]) +
    '<div class="recipe-hero tile-deep"><div class="recipe-hero__overlay">' +
    '<span class="badge badge-demo" style="margin-bottom:8px">Receta de demostración</span>' +
    '<h1 style="font-family:var(--font-display);font-size:clamp(1.6rem,4vw,2.4rem)">' + esc(recipe.name) + '</h1>' +
    '<p>' + flagFor(recipe.countryCode) + ' ' + esc(recipe.countryText) + '</p></div>' + heroGlyphSvg(recipe.heroIcon) + '</div>' +
    '<div class="recipe-meta-row">' +
    '<span class="recipe-meta-chip">' + icon('clock', 16) + ' Prep. ' + recipe.prepMinutes + ' min</span>' +
    '<span class="recipe-meta-chip">' + icon('clock', 16) + ' Cocción ' + recipe.cookMinutes + ' min</span>' +
    '<span class="recipe-meta-chip">' + icon('flame', 16) + ' ' + esc(recipe.difficulty) + '</span>' +
    '<span class="recipe-meta-chip">' + icon('users', 16) + ' ' + ui.servings + ' raciones</span></div>' +
    '<div class="recipe-layout"><div class="recipe-content">' +
    '<p style="font-size:1.02rem;color:var(--ink-soft);max-width:70ch">' + esc(recipe.description) + '</p>' +
    '<h2>Ingredientes</h2><ul class="ingredient-list">' + ingredientsHtml + '</ul>' +
    '<h2>Instrucciones</h2><ol class="step-list">' + recipe.steps.map(function(s){ return '<li>' + esc(s) + '</li>'; }).join('') + '</ol>' +
    '<h2>Utensilios</h2><ul class="utensil-list">' + recipe.utensils.map(function(u){ return '<li>' + icon('leaf', 16) + ' ' + esc(u) + '</li>'; }).join('') + '</ul>' +
    '<h2>Consejos</h2><ul class="tip-list">' + recipe.tips.map(function(t){ return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' +
    '<h2>Alérgenos</h2>' + pendingField('Alérgenos (basado en los productos vinculados)') +
    '</div>' + renderPurchasePanel(recipe) + '</div></div>';
}

// ============ Router ============
function parseHash(hash){
  var clean = (hash || '').replace(/^#/, '');
  var parts = clean.split('/').filter(Boolean);
  if(parts.length === 0) return { name:'home', params:{} };
  var first = parts[0], second = parts[1];
  switch(first){
    case 'catalogo': return { name:'catalogo', params:{} };
    case 'producto': return second ? { name:'producto', params:{ id:second } } : { name:'notfound', params:{} };
    case 'recetas': return { name:'recetas', params:{} };
    case 'receta': return second ? { name:'receta', params:{ id:second } } : { name:'notfound', params:{} };
    case 'ofertas': return { name:'ofertas', params:{} };
    case 'pais': return second ? { name:'pais', params:{ code:second } } : { name:'notfound', params:{} };
    case 'contacto': return { name:'contacto', params:{} };
    default: return { name:'notfound', params:{} };
  }
}
function renderRoute(){
  var r = state.route;
  switch(r.name){
    case 'home': return renderHome();
    case 'catalogo': return renderCatalogPage();
    case 'producto': { var p = getProduct(r.params.id); return p ? renderProductDetail(p) : renderNotFound(); }
    case 'recetas': return renderRecipesPage();
    case 'receta': { var rec = getRecipe(r.params.id); return rec ? renderRecipeDetail(rec) : renderNotFound(); }
    case 'ofertas': return renderOffersPage();
    case 'pais': return renderCountryPage(r.params.code);
    case 'contacto': return renderContactPage();
    default: return renderNotFound();
  }
}

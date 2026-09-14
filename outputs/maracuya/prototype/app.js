// ============ Toasts ============
function showToast(opts){
  var region = document.getElementById('toast-region');
  var t = document.createElement('div');
  t.className = 'toast' + (opts.type === 'error' ? ' toast-error' : '');
  t.setAttribute('role', 'status');
  t.innerHTML = '<span>' + icon(opts.type === 'error' ? 'alert-triangle' : 'check', 18) + '</span><span><strong>' + esc(opts.title) + '</strong>' + esc(opts.body) + '</span>';
  region.appendChild(t);
  setTimeout(function(){ if(t.parentNode) t.parentNode.removeChild(t); }, 5000);
}

// ============ Info modal / WhatsApp fallback ============
function openInfoModal(opts){
  pendingModalContent = { title: opts.title, bodyHtml: opts.bodyHtml };
  openOverlay('modal');
}
function openWhatsAppFlow(message){
  var link = buildWaLink(message);
  if(link){ window.open(link, '_blank', 'noopener'); return; }
  openInfoModal({
    title: 'WhatsApp pendiente de configurar',
    bodyHtml: '<p>' + esc(MARACUYA.config.whatsapp.displayNote) + '</p>' +
      '<p style="margin-top:10px;font-weight:700">Vista previa del mensaje:</p>' +
      '<pre class="wa-preview-text">' + esc(message) + '</pre>'
  });
}

// ============ Overlay management (menu / cart / modal) ============
var trapHandler = null;
var lastFocusedBeforeOverlay = null;

function getFocusable(container){
  var nodes = container.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])');
  return Array.prototype.filter.call(nodes, function(el){ return el.offsetParent !== null; });
}
function openOverlay(type){
  if(state.overlay) closeOverlay(false);
  var activeEl = document.activeElement;
  lastFocusedBeforeOverlay = (activeEl && activeEl.id) ? activeEl.id : null;
  state.overlay = type;
  document.body.classList.add('no-scroll');
  render();
  var containerId = type === 'cart' ? 'cart-drawer' : (type === 'menu' ? 'mega-menu' : 'info-modal');
  var container = document.getElementById(containerId);
  setTimeout(function(){
    var focusables = getFocusable(container);
    (focusables[0] || container).focus();
  }, 50);
  trapHandler = function(e){
    if(e.key === 'Escape'){ e.preventDefault(); closeOverlay(true); return; }
    if(e.key !== 'Tab') return;
    var focusables = getFocusable(container);
    if(focusables.length === 0) return;
    var first = focusables[0], last = focusables[focusables.length - 1];
    if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
    else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
  };
  document.addEventListener('keydown', trapHandler, true);
}
function closeOverlay(restoreFocus){
  if(!state.overlay) return;
  state.overlay = null;
  document.body.classList.remove('no-scroll');
  if(trapHandler){ document.removeEventListener('keydown', trapHandler, true); trapHandler = null; }
  render();
  var restoreEl = lastFocusedBeforeOverlay ? document.getElementById(lastFocusedBeforeOverlay) : null;
  if(restoreFocus && restoreEl){
    restoreEl.focus({ preventScroll:true });
  }
}
function syncOverlays(){
  document.getElementById('mega-menu').classList.toggle('is-open', state.overlay === 'menu');
  document.getElementById('cart-drawer').classList.toggle('is-open', state.overlay === 'cart');
  document.getElementById('info-modal').classList.toggle('is-open', state.overlay === 'modal');
  document.getElementById('backdrop').classList.toggle('is-visible', !!state.overlay);
  var menuBtn = document.getElementById('menu-toggle-btn');
  if(menuBtn) menuBtn.setAttribute('aria-expanded', state.overlay === 'menu');
  var cartBtn = document.getElementById('cart-toggle-btn');
  if(cartBtn) cartBtn.setAttribute('aria-expanded', state.overlay === 'cart');
}

// ============ Render orchestration ============
function withFocusPreserved(fn){
  var active = document.activeElement;
  var id = active && active.id;
  var selStart = null, selEnd = null;
  if(active && typeof active.selectionStart === 'number'){ selStart = active.selectionStart; selEnd = active.selectionEnd; }
  fn();
  if(id){
    var el = document.getElementById(id);
    if(el){
      el.focus({ preventScroll:true });
      if(selStart != null && el === document.activeElement){
        try{ el.setSelectionRange(selStart, selEnd); }catch(e){}
      }
    }
  }
}
function rerender(){ withFocusPreserved(render); }
function render(){
  renderHeader();
  document.getElementById('main-content').innerHTML = renderRoute();
  renderCartDrawer();
  renderInfoModal();
  syncOverlays();
  tickCountdowns();
}
function navigateTo(hash){
  if(location.hash === hash) onRouteChange(); else location.hash = hash;
}
function onRouteChange(){
  state.route = parseHash(location.hash);
  if(state.overlay) closeOverlay(false);
  render();
  var main = document.getElementById('main-content');
  if(main) main.focus({ preventScroll:true });
  window.scrollTo({ top:0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}

// ============ Actions (delegated click/change targets) ============
var actions = {
  'open-menu': function(){ openOverlay('menu'); },
  'open-cart': function(){ openOverlay('cart'); },
  'close-overlay': function(){ closeOverlay(true); },

  'goto-category': function(el){
    var f = defaultCatalogFilters(); f.category = el.dataset.cat;
    state.filters.catalog = f;
    navigateTo('#/catalogo');
  },
  'goto-category-close': function(el){
    var f = defaultCatalogFilters(); f.category = el.dataset.cat;
    state.filters.catalog = f;
    closeOverlay(false);
    navigateTo('#/catalogo');
  },

  'add-to-cart': function(el){
    var product = getProduct(el.dataset.productId);
    if(!product || product.stock === 'out'){
      showToast({ type:'error', title:'Producto agotado', body:'Este producto no está disponible actualmente.' });
      return;
    }
    var hasVariants = Array.isArray(product.variants) && product.variants.length > 0;
    var variant = hasVariants ? (product.variants.find(function(v){ return v.id === state.selectedVariant[product.id]; }) || product.variants[0]) : null;
    if(variant && variant.stock === 'out'){
      showToast({ type:'error', title:'Variante agotada', body:'Elige otra opción disponible.' });
      return;
    }
    var qty = el.dataset.source === 'detail' ? (state.detailQty[product.id] || 1) : 1;
    mergeCartLine({
      productId: product.id, variantId: variant ? variant.id : null,
      name: product.name, brand: product.brand, format: variant ? variant.label : product.format,
      unitPrice: variant ? variant.basePrice : getPricing(product).current, qty: qty, glyph: product.glyph,
      fromRecipe: null
    });
    saveCart();
    rerender();
    showToast({ type:'success', title:'Añadido al carrito', body: product.name + (variant ? ' — ' + variant.label : '') + ' × ' + qty });
  },

  'select-variant': function(el){ state.selectedVariant[el.dataset.productId] = el.value; rerender(); },
  'select-gallery': function(el){ state.detailGalleryIndex[el.dataset.productId] = +el.dataset.index; rerender(); },
  'detail-qty-inc': function(el){ var id = el.dataset.productId; state.detailQty[id] = (state.detailQty[id] || 1) + 1; rerender(); },
  'detail-qty-dec': function(el){ var id = el.dataset.productId; state.detailQty[id] = Math.max(1, (state.detailQty[id] || 1) - 1); rerender(); },

  'servings-inc': function(el){
    var ui = getRecipeUiState(el.dataset.recipeId), r = getRecipe(el.dataset.recipeId);
    ui.servings = Math.min(r.maxServings, ui.servings + r.servingStep); rerender();
  },
  'servings-dec': function(el){
    var ui = getRecipeUiState(el.dataset.recipeId), r = getRecipe(el.dataset.recipeId);
    ui.servings = Math.max(r.minServings, ui.servings - r.servingStep); rerender();
  },
  'toggle-ingredient': function(el){
    var ui = getRecipeUiState(el.dataset.recipeId), id = el.dataset.ingId;
    if(el.checked) ui.excluded.delete(id); else ui.excluded.add(id);
    rerender();
  },
  'use-alt': function(el){
    var ui = getRecipeUiState(el.dataset.recipeId);
    var revert = el.dataset.revert === '1';
    ui.altChoice[el.dataset.ingId] = !revert;
    rerender();
  },
  'add-package': function(el){
    if(state.addingLock) return;
    state.addingLock = true;
    setTimeout(function(){ state.addingLock = false; }, 700);
    var recipe = getRecipe(el.dataset.recipeId);
    addPackageToCart(recipe, getRecipeUiState(recipe.id));
  },

  'cart-qty-inc': function(el){
    var line = state.cart.find(function(l){ return l.lineId === el.dataset.lineId; });
    if(line){ line.qty++; saveCart(); rerender(); }
  },
  'cart-qty-dec': function(el){
    var line = state.cart.find(function(l){ return l.lineId === el.dataset.lineId; });
    if(line){
      line.qty--;
      if(line.qty <= 0) state.cart = state.cart.filter(function(l){ return l.lineId !== line.lineId; });
      saveCart(); rerender();
    }
  },
  'cart-remove': function(el){
    state.cart = state.cart.filter(function(l){ return l.lineId !== el.dataset.lineId; });
    saveCart(); rerender();
  },

  'checkout': function(){
    openInfoModal({
      title: 'Checkout de demostración',
      bodyHtml: '<p>En la tienda real, este botón llevaría al checkout seguro de Shopify (tarjeta, PayPal o Bizum, según lo que actives).</p><p style="margin-top:10px">Este prototipo no procesa pagos ni pedidos reales.</p>'
    });
  },
  'whatsapp-product': function(el){
    var product = getProduct(el.dataset.productId);
    var hasVariants = Array.isArray(product.variants) && product.variants.length > 0;
    var variant = hasVariants ? (product.variants.find(function(v){ return v.id === state.selectedVariant[product.id]; }) || product.variants[0]) : null;
    var qty = state.detailQty[product.id] || 1;
    openWhatsAppFlow(buildProductMessage(product, variant, qty));
  },
  'whatsapp-package': function(el){
    var recipe = getRecipe(el.dataset.recipeId);
    var pkg = computePackage(recipe, getRecipeUiState(recipe.id));
    openWhatsAppFlow(buildPackageMessage(recipe, pkg));
  },
  'whatsapp-cart': function(){ openWhatsAppFlow(buildCartMessage()); },

  'filter-catalog': function(el){ state.filters.catalog[el.dataset.key] = el.value; rerender(); },
  'filter-recipes': function(el){ state.filters.recipes[el.dataset.key] = el.value; rerender(); },
  'filter-toggle-sale': function(){ state.filters.catalog.onSale = !state.filters.catalog.onSale; rerender(); },
  'clear-catalog-filters': function(){ state.filters.catalog = defaultCatalogFilters(); state.headerSearchDraft = ''; rerender(); },
  'clear-recipe-filters': function(){ state.filters.recipes = defaultRecipeFilters(); rerender(); },
  'clear-search-only': function(){ state.filters.catalog.q = ''; state.headerSearchDraft = ''; rerender(); },

  'toggle-accordion': function(el){
    var key = el.dataset.key;
    if(state.openAccordions.has(key)) state.openAccordions.delete(key); else state.openAccordions.add(key);
    rerender();
  },
  'rail-prev': function(el){ var rail = document.getElementById(el.dataset.rail); if(rail) rail.scrollBy({ left:-240, behavior: prefersReducedMotion() ? 'auto' : 'smooth' }); },
  'rail-next': function(el){ var rail = document.getElementById(el.dataset.rail); if(rail) rail.scrollBy({ left:240, behavior: prefersReducedMotion() ? 'auto' : 'smooth' }); }
};

// ============ Event wiring ============
document.addEventListener('click', function(e){
  var el = e.target.closest('[data-action]');
  if(!el) return;
  var handler = actions[el.dataset.action];
  if(!handler) return;
  if(el.tagName !== 'A') e.preventDefault();
  handler(el, e);
});
document.addEventListener('change', function(e){
  var el = e.target;
  if(el && el.dataset && el.dataset.action){
    var handler = actions[el.dataset.action];
    if(handler) handler(el, e);
  }
});
document.addEventListener('input', function(e){
  var el = e.target;
  if(el.id === 'global-search-input'){
    state.headerSearchDraft = el.value;
    if(state.route.name === 'catalogo'){
      state.filters.catalog.q = el.value;
      withFocusPreserved(render);
    }
    return;
  }
  if(el.matches && el.matches('.delivery-form input[type="text"]')){
    el.value = el.value.replace(/[^0-9]/g, '').slice(0, 5);
  }
});
document.addEventListener('submit', function(e){
  var form = e.target;
  if(form.id === 'global-search-form'){
    e.preventDefault();
    state.filters.catalog.q = state.headerSearchDraft.trim();
    navigateTo('#/catalogo');
    return;
  }
  if(form.classList && form.classList.contains('delivery-form')){
    e.preventDefault();
    var input = form.querySelector('input[type="text"]');
    state.postalCode = input.value.trim();
    rerender();
  }
});
window.addEventListener('hashchange', onRouteChange);

// ============ Init ============
function init(){
  loadCart();
  state.route = parseHash(location.hash);
  renderMegaMenuContent();
  render();
  setInterval(tickCountdowns, 1000);
}
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

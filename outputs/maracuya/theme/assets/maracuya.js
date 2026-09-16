/* MARACUYA theme behaviour. No dependencies, no build step. */
(function () {
  'use strict';

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function focusables(container) {
    var sel = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
    return Array.prototype.filter.call(container.querySelectorAll(sel), function (el) {
      return el.offsetParent !== null;
    });
  }

  /* An element that is still visibility:hidden ignores .focus() silently, and
     how long it takes to become visible depends on stylesheet weight. Retry
     across frames until the focus lands, with a deadline so this cannot spin. */
  function focusWhenReady(container) {
    var deadline = Date.now() + 600;
    (function attempt() {
      var target = focusables(container)[0] || container;
      target.focus();
      if (document.activeElement === target || Date.now() > deadline) return;
      requestAnimationFrame(attempt);
    })();
  }

  /* ---------- Cart drawer ---------- */
  var drawer = document.getElementById('cart-drawer');
  var backdrop = document.getElementById('backdrop');
  var lastTrigger = null;
  var trap = null;

  function openCart(trigger) {
    if (!drawer) return;
    lastTrigger = trigger && trigger.id ? trigger.id : null;
    drawer.classList.add('is-open');
    if (backdrop) backdrop.classList.add('is-visible');
    document.body.classList.add('no-scroll');
    document.querySelectorAll('[data-open-cart]').forEach(function (b) {
      b.setAttribute('aria-expanded', 'true');
    });
    focusWhenReady(drawer);
    trap = function (e) {
      if (e.key === 'Escape') { e.preventDefault(); closeCart(); return; }
      if (e.key !== 'Tab') return;
      var f = focusables(drawer);
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', trap, true);
  }

  function closeCart() {
    if (!drawer) return;
    drawer.classList.remove('is-open');
    if (backdrop) backdrop.classList.remove('is-visible');
    document.body.classList.remove('no-scroll');
    document.querySelectorAll('[data-open-cart]').forEach(function (b) {
      b.setAttribute('aria-expanded', 'false');
    });
    if (trap) { document.removeEventListener('keydown', trap, true); trap = null; }
    var back = lastTrigger ? document.getElementById(lastTrigger) : null;
    if (back) back.focus({ preventScroll: true });
  }

  /* ---------- Mobile menu ---------- */
  function toggleMenu(force) {
    var nav = document.querySelector('[data-site-nav]');
    if (!nav) return;
    var open = force !== undefined ? force : !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', open);
    document.querySelectorAll('[data-toggle-menu]').forEach(function (b) {
      b.setAttribute('aria-expanded', String(open));
    });
  }

  /* ---------- Hero carousel ---------- */
  function setSlide(carousel, index) {
    var slides = carousel.querySelectorAll('[data-slide]');
    if (!slides.length) return;
    var i = ((index % slides.length) + slides.length) % slides.length;
    slides.forEach(function (s, n) {
      var active = n === i;
      s.hidden = !active;
      s.setAttribute('aria-hidden', String(!active));
    });
    carousel.querySelectorAll('[data-slide-dot]').forEach(function (d, n) {
      d.classList.toggle('is-active', n === i);
      d.setAttribute('aria-current', String(n === i));
    });
    carousel.dataset.current = String(i);
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-open-cart],[data-close-overlay],[data-toggle-menu],[data-slide-prev],[data-slide-next],[data-slide-dot],[data-qty]');
    if (!el) return;

    if (el.hasAttribute('data-open-cart')) { e.preventDefault(); openCart(el); return; }
    if (el.hasAttribute('data-close-overlay')) { e.preventDefault(); closeCart(); toggleMenu(false); return; }
    if (el.hasAttribute('data-toggle-menu')) { e.preventDefault(); toggleMenu(); return; }

    var carousel = el.closest('[data-carousel]');
    if (carousel) {
      var current = parseInt(carousel.dataset.current || '0', 10);
      if (el.hasAttribute('data-slide-prev')) { e.preventDefault(); setSlide(carousel, current - 1); return; }
      if (el.hasAttribute('data-slide-next')) { e.preventDefault(); setSlide(carousel, current + 1); return; }
      if (el.hasAttribute('data-slide-dot')) {
        e.preventDefault();
        setSlide(carousel, parseInt(el.getAttribute('data-slide-dot'), 10) || 0);
        return;
      }
    }

    /* Quantity stepper: adjusts the nearest number input and submits the
       cart form it belongs to, so it works without JavaScript-only state. */
    if (el.hasAttribute('data-qty')) {
      e.preventDefault();
      var wrap = el.closest('[data-qty-wrap]');
      var input = wrap && wrap.querySelector('input[type="number"]');
      if (!input) return;
      var step = el.getAttribute('data-qty') === 'up' ? 1 : -1;
      var next = Math.max(0, (parseInt(input.value, 10) || 0) + step);
      input.value = String(next);
      var form = input.closest('form');
      if (form) form.requestSubmit ? form.requestSubmit() : form.submit();
    }
  });

  /* ---------- Variant picker ---------- */
  document.addEventListener('change', function (e) {
    var picker = e.target.closest('[data-variant-select]');
    if (!picker) return;
    var form = picker.closest('form');
    if (!form) return;
    var selects = form.querySelectorAll('[data-variant-select]');
    var chosen = Array.prototype.map.call(selects, function (s) { return s.value; });
    var data = form.querySelector('[data-variant-data]');
    if (!data) return;
    var variants;
    try { variants = JSON.parse(data.textContent); } catch (err) { return; }
    var match = variants.find(function (v) {
      return v.options.every(function (o, n) { return o === chosen[n]; });
    });
    var idField = form.querySelector('[name="id"]');
    var submit = form.querySelector('[type="submit"]');
    var priceEl = document.querySelector('[data-variant-price]');
    if (match && idField) idField.value = match.id;
    if (submit) {
      var ok = match && match.available;
      submit.disabled = !ok;
      submit.textContent = ok ? submit.dataset.labelAvailable : submit.dataset.labelSoldOut;
    }
    if (match && priceEl && match.price_html) priceEl.innerHTML = match.price_html;
  });

  /* Initialise every carousel on the page. */
  document.querySelectorAll('[data-carousel]').forEach(function (c) { setSlide(c, 0); });

  /* Respect reduced motion for the smooth-scroll rails. */
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-rail-prev],[data-rail-next]');
    if (!el) return;
    e.preventDefault();
    var rail = document.getElementById(el.getAttribute('data-rail'));
    if (!rail) return;
    rail.scrollBy({
      left: el.hasAttribute('data-rail-prev') ? -260 : 260,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth'
    });
  });
})();

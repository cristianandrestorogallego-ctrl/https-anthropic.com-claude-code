/* ---------------------------------------------------------------------------
   El paquete de la receta.

   El servidor deja en cada línea la cantidad tal como está escrita la receta
   —para sus raciones base, no por persona—, cuánto trae el envase y el precio
   de la variante. Aquí solo se reescala por el factor raciones/base, se
   redondea hacia arriba —medio bote no se vende— y se suma.

   La regla dura: "paquete completo" solo cuando están todos los comprables y
   ninguno agotado. Ni se sustituye lo que falta ni se llama completo a lo que
   no lo es.
--------------------------------------------------------------------------- */
(function () {
  var raiz = document.querySelector('[data-receta]');
  if (!raiz) return;

  var base = parseInt(raiz.getAttribute('data-base'), 10) || 1;
  var raciones = base;
  var dinero = new Intl.NumberFormat(raiz.getAttribute('data-idioma') || 'es-ES', {
    style: 'currency',
    currency: raiz.getAttribute('data-moneda') || 'EUR'
  });

  var lineas = Array.prototype.slice.call(raiz.querySelectorAll('[data-linea]'));
  var apartes = Array.prototype.slice.call(raiz.querySelectorAll('[data-aparte]'));
  var salida = raiz.querySelector('[data-raciones-valor]');
  var aviso = raiz.querySelector('[data-aviso]');
  var boton = raiz.querySelector('[data-anadir-paquete]');
  var botonTexto = raiz.querySelector('[data-anadir-texto]');
  var totalCuenta = raiz.querySelector('[data-total-cuenta]');
  var totalPrecio = raiz.querySelector('[data-total-precio]');

  var textos = {};
  try {
    var blob = document.getElementById('recetas-i18n');
    if (blob) textos = JSON.parse(blob.textContent);
  } catch (e) { textos = {}; }

  function t(clave, sust) {
    var plantilla = textos[clave] || '';
    Object.keys(sust || {}).forEach(function (k) {
      plantilla = plantilla.replace('{{ ' + k + ' }}', sust[k]);
    });
    return plantilla;
  }

  /* Redondeo a un decimal sin arrastrar el ruido del coma flotante. */
  function cantidad(valor, unidad) {
    var n = Math.round(valor * 10) / 10;
    return (n % 1 === 0 ? n.toFixed(0) : n.toFixed(1).replace('.', ',')) + ' ' + unidad;
  }

  function recalcular() {
    var factor = raciones / base;
    var total = 0;
    var elegidos = 0;
    var comprables = 0;

    lineas.forEach(function (li) {
      var agotado = li.getAttribute('data-agotado') === 'true';
      var casilla = li.querySelector('[data-incluir]');
      var detalle = li.querySelector('[data-detalle]');
      var precioTexto = li.querySelector('[data-precio-texto]');

      if (agotado) {
        detalle.textContent = t('sold_out_line');
        return;
      }
      comprables += 1;

      var cantidadBase = parseFloat(li.getAttribute('data-cantidad')) || 0;
      var envase = parseFloat(li.getAttribute('data-envase')) || 0;
      var unidad = li.getAttribute('data-unidad') || '';
      var precio = parseInt(li.getAttribute('data-precio'), 10) || 0;

      var necesario = cantidadBase * factor;
      var envases = envase > 0 ? Math.ceil(necesario / envase) : 1;
      var sobra = envase > 0 ? Math.max(0, envases * envase - necesario) : 0;

      var partes = [t('uses', { amount: cantidad(necesario, unidad) })];
      if (envase > 0) {
        partes.push(t('buys', { packs: envases, size: cantidad(envase, unidad) }));
        if (sobra > 0) partes.push(t('leftover', { amount: cantidad(sobra, unidad) }));
      }
      detalle.textContent = partes.join(' · ');
      precioTexto.textContent = dinero.format((envases * precio) / 100);

      if (casilla && casilla.checked) {
        total += envases * precio;
        elegidos += 1;
      }
    });

    apartes.forEach(function (li) {
      var cantidadBase = parseFloat(li.getAttribute('data-cantidad')) || 0;
      var unidad = li.getAttribute('data-unidad') || '';
      li.querySelector('[data-aparte-cantidad]').textContent = cantidad(cantidadBase * factor, unidad);
    });

    var completo = lineas.length > 0 && elegidos === lineas.length;
    totalCuenta.textContent = t('count', { count: elegidos });
    totalPrecio.textContent = dinero.format(total / 100);
    botonTexto.textContent = completo ? t('add_full') : t('add_partial');
    boton.disabled = elegidos === 0;

    if (elegidos === 0) {
      aviso.textContent = t('nothing_selected');
      aviso.hidden = false;
    } else if (!completo) {
      aviso.textContent = t('partial_warning', {
        missing: lineas.length - elegidos,
        total: lineas.length
      });
      aviso.hidden = false;
    } else {
      aviso.hidden = true;
    }

    /* Si hay agotados, nunca es un paquete completo aunque estén todos marcados. */
    if (comprables < lineas.length && completo) botonTexto.textContent = t('add_partial');
  }

  raiz.addEventListener('click', function (e) {
    var paso = e.target.closest('[data-raciones]');
    if (!paso) return;
    raciones = Math.min(20, Math.max(1, raciones + parseInt(paso.getAttribute('data-raciones'), 10)));
    salida.textContent = raciones;
    recalcular();
  });

  raiz.addEventListener('change', function (e) {
    if (e.target.matches('[data-incluir]')) recalcular();
  });

  boton.addEventListener('click', function () {
    var factor = raciones / base;
    var items = [];
    lineas.forEach(function (li) {
      if (li.getAttribute('data-agotado') === 'true') return;
      var casilla = li.querySelector('[data-incluir]');
      if (!casilla || !casilla.checked) return;
      var id = li.getAttribute('data-variante');
      if (!id) return;
      var cantidadBase = parseFloat(li.getAttribute('data-cantidad')) || 0;
      var envase = parseFloat(li.getAttribute('data-envase')) || 0;
      var envases = envase > 0 ? Math.ceil((cantidadBase * factor) / envase) : 1;
      items.push({ id: Number(id), quantity: envases });
    });
    if (!items.length) return;

    boton.disabled = true;
    fetch(window.Shopify.routes.root + 'cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ items: items })
    })
      .then(function (r) { if (!r.ok) throw new Error('add'); return r.json(); })
      .then(function () {
        window.dispatchEvent(new CustomEvent('maracuya:carrito-cambiado'));
        anunciar(t('added'), false);
      })
      .catch(function () { anunciar(t('add_failed'), true); })
      .finally(function () { boton.disabled = false; });
  });

  function anunciar(texto, esError) {
    var region = document.getElementById('toast-region');
    if (!region) return;
    var nodo = document.createElement('div');
    nodo.className = 'toast' + (esError ? ' toast-error' : '');
    nodo.textContent = texto;
    region.appendChild(nodo);
    setTimeout(function () { nodo.remove(); }, 4000);
  }

  recalcular();
})();

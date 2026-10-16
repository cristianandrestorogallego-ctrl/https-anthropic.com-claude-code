# Pendientes — la lista que hay que verificar y marcar

Load when asked what is pending, what is still fake or provisional, what
blocks launch, or when the user says "hagamos check". This file replaces the
old launch checklist in `admin-and-launch.md`. Written in Spanish on purpose:
the user walks this list with you and the labels are the ones in his panels.

**No marques nada por memoria.** Cada punto trae su comprobación. Se marca
cuando la comprobación da el resultado esperado en ese momento, no cuando
alguien dice que ya está. Esta regla nació de InPost: soporte confirmó por
correo que estaba activado y la API seguía diciendo que no.

Última verificación completa: **16 oct 2026**.
Al revisar, anota la fecha nueva y qué comprobaste.

---

## 🔴 LA TRAMPA — stock de 1 unidad

Es el punto que el usuario pidió guardar primero, y el que muerde en la
primera compra de prueba.

- [ ] **Los 172 productos tienen 1 sola unidad de stock**, con
      `tracksInventory: true` e `inventoryPolicy: DENY`.

**Por qué muerde:** cualquier compra de prueba se come la única unidad y
ese producto queda *agotado* y deja de poder comprarse. Con `DENY` Shopify
no vende sin existencias, así que no es un número decorativo: bloquea.

**Comprobación:**
```graphql
query { productVariants(first: 5) {
  nodes { price inventoryQuantity inventoryPolicy inventoryItem { tracked } } } }
```
Marcar cuando las cantidades sean las reales del almacén, o cuando el
seguimiento de inventario esté desactivado a propósito.

**Mientras siga así**, toda compra de prueba acaba con *cancelar el pedido
marcando la casilla de reponer existencias* («Reabastecer inventario»).
Sin eso, cada prueba destruye una unidad del catálogo.

**Dos salidas, a elección del usuario:**
1. Desactivar el seguimiento de inventario (`tracked: false`) hasta tener
   existencias reales — se puede comprar sin límite y no hay que reponer.
2. Cargar las cantidades reales. Requiere que las sepa.

---

## Datos provisionales en Shopify

- [ ] **172 precios a 1,99 €**, todos con la etiqueta `precio-provisional`.
      Verificado 16 oct 2026. Comprobación: la consulta de arriba, o
      `search_products` filtrando por esa etiqueta — debe devolver 0.
      El precio provisional es también lo que invalida cualquier cálculo de
      margen: con 1,99 € de media el envío se come el pedido.
- [ ] **15 variantes con peso 0** de 172 (media 491 g, mediana 460 g, total
      77,13 kg). El peso decide la tarifa, así que un 0 cobra la banda más
      baja. Comprobación: contar variantes con
      `inventoryItem.measurement.weight.value == 0`.
- [ ] **`taxShipping: false`** y `taxesIncluded: true`. Verificado 16 oct
      2026 por API. Si en España el envío lleva 21 %, los tramos actuales
      se quedan cortos unos 1,2 € en la banda baja. **Esto lo confirma un
      gestor, no nosotros** — no es una decisión que podamos tomar por él.
- [ ] **Dos metaobjetos de demostración**: `receta` y `ingrediente_receta`
      tienen 1 entrada cada uno, de ejemplo. Comprobación:
      `metaobjectDefinitions { nodes { type metaobjectsCount } }`.
- [ ] **Falta la colección `cat:congelados`**, aunque el catálogo la usa.

## Sendcloud

- [ ] **NIF/CIF ausente** en la dirección de remitente 930222
      (`tax_numbers: []`). Verificado 16 oct 2026. Hace falta para
      facturar y para aduanas fuera de la UE. Comprobación:
      `sender-addresses_addresses_get_all_sender_addresses`.
- [ ] **InPost Home Delivery sin activar.** Ticket 3591819 abierto.
      Contratos 76283 (`inpost_es-trx`, el predeterminado) y 230881
      (`inpost_es-trx-home`) siguen en `state: validating` a 16 oct 2026.
      **La comprobación que vale** es `shipping-options` con
      `calculate_quotes: false`: hoy solo devuelve
      `inpost_es:service_point`, `national_c2c` y `…_qr`. El código
      `inpost_es:domestic_home` devuelve `{"data": []}`.
      La lista de métodos del panel es un catálogo más amplio que lo
      realmente contratado — por eso parece activo ahí y no lo está.
      Se marca cuando `domestic_home` devuelva una opción.
- [ ] **Revocar el acceso de soporte a la cuenta** cuando se cierre el
      ticket. Es un acceso concedido para depurar, no permanente.
- [ ] Plan gratuito: **0 reglas de envío activas permitidas**. Lo que hoy
      encamina los envíos es `shipping_defaults_update` (`ship_with`,
      método 2193), no una regla. Si alguien espera reglas, no las habrá
      sin cambiar de plan.

## Tienda y checkout

- [ ] **Ninguna forma de pago operativa.** PayPal aparece como
      «Configuración incompleta» (visto por el usuario en su panel; la
      Admin API no expone bien este estado, así que se comprueba en
      Configuración → Pagos). Sin esto no hay venta real y la compra de
      prueba necesita un método manual (Depósito bancario).
- [ ] **El selector de punto de recogida nunca se ha probado.** Las dos
      tarifas existen y están activas (verificado 16 oct 2026), pero no se
      ha visto que el cliente pueda *elegir* un punto concreto en el
      checkout. Shopify por sí solo no da selector de puntos InPost: suele
      hacer falta una app o un paso en Sendcloud. Esto es lo primero que
      hay que mirar en la compra de prueba.
- [ ] **El tema publicado es Horizon**, no el de MARACUYA. Verificado 16
      oct 2026: `themes` solo devuelve Horizon con rol `MAIN` — el tema
      Liquid de MARACUYA **ya no está en la tienda**; el zip está en
      `outputs/maracuya/maracuya-theme.zip` y habría que volver a subirlo
      si se decide usarlo. No se publica nada sin que el usuario lo diga.
- [ ] **Logo del checkout a 180 px** — revisar el tamaño en un pago real,
      no solo en el editor. La marca del checkout ya está puesta (logo
      PNG, paleta morada, fondos `#FEF9ED`, Fraunces + Outfit) y la página
      de agradecimiento se ve bien.
- [ ] **Sin dominio propio.** `primaryDomain` sigue siendo
      `yw4vyu-vf.myshopify.com`. Verificado 16 oct 2026.

### Tarifas de envío — hechas, aquí por si hay que rehacerlas

Zona «España peninsular», 7 tarifas activas, condicionadas por peso
(verificado 16 oct 2026):

| Peso | A domicilio | Punto de recogida |
|---|---|---|
| 0–5 kg | 6,99 € | 4,99 € |
| 5–10 kg | 8,99 € | 7,49 € |
| 10–15 kg | 9,99 € | — |
| 15–20 kg | 11,49 € | — |
| 20–30 kg | 13,99 € | — |

Shopify **no admite condiciones mixtas** en una misma tarifa: «La
definición del método no puede guardar condiciones con campos diferentes
(total_weight y total_price)». Por eso el mínimo de 24,99 € es política de
tienda escrita en la web (`app/src/lib/envio.ts`), no una regla de Shopify.
Bloquear el carrito tampoco serviría: bloquearía también la recogida en
tienda, que no tiene mínimo.

Coste medido de los transportistas (península, 08740 → 28001): InPost punto
3,09 € hasta 1 kg, 3,75 € hasta 5 kg, 6,09 € hasta 10 kg. Correos domicilio
4,54 € / 5,01 € / 7,19 €, y hasta 11,96 € a 30 kg. Correos añade un
recargo de combustible del 11,80 % que revisa cada mes; InPost no.

## Web (`outputs/maracuya/app`)

- [ ] **No es headless todavía.** Tres cosas lo demuestran, y las tres hay
      que cambiar juntas: `src/lib/catalogo-productos.ts` es una copia
      generada por `scripts/catalogo-desde-shopify.mjs`;
      `src/lib/shopify.ts` (cliente Storefront) existe pero **nadie lo
      importa**; el carrito es estado local y «Finalizar compra» no tiene
      handler. Comprobación: `grep -rn "lib/shopify" app/src` debe
      devolver algo distinto del propio archivo.
- [ ] **Dominio: apunta a Vercel, nunca a Shopify.** El checkout es
      siempre el de Shopify, en un subdominio tipo `pago.tiendamaracuya.es`.
      Headless sustituye todo lo *anterior* al checkout, no el checkout.
- [ ] **Aviso de privacidad pendiente.** Bloquea cualquier formulario que
      recoja datos reales. El pie lo marca «pendiente» a propósito.
- [ ] **Brevo**: autenticar `tiendamaracuya.es`, crear la lista y poner
      `BREVO_LISTA_RECETAS` en las variables de Vercel.
- [ ] **Datos reales de congelados** — ver el sentinel
      `QUE_FALTA_CONGELADOS` en el código.
- [ ] **«Devoluciones en 14 días» en el pie, sin respaldo.** O hay una
      política escrita que lo sostenga, o la frase se cae. Es una
      afirmación comercial, de las que no se inventan.
- [ ] Un número de WhatsApp de empresa real (`whatsapp.numberE164` vacío).

## Aparcado por decisión del usuario

- **Secciones de ofertas / «my box».** Dijo «dejalo lo pienso» porque las
  dos se parecen: ambas son descuentos. La duda que planteó y sigue
  abierta: ¿una sección o dos? Los archivos a medias están **fuera del
  repo**, en el scratchpad de aquella sesión
  (`lotes-a-medias/lotes.ts` y `tarjeta-lote.tsx`) — el scratchpad no
  sobrevive al contenedor, así que si vuelve el tema, se rehacen.
  Lo que ya estaba resuelto: `armarLote()` calcula el precio desde el
  catálogo vivo y se niega a montar un lote con productos congelados,
  agotados o inexistentes. Ids verificados que existen y están
  disponibles: `almidon-de-mandioca-500-g`,
  `chocolate-corona-de-mesa-250-g`, `queso-costeno-250-g`,
  `harina-p-a-n-blanca-1-kg`, `cafe-sello-rojo-molido-250-g`,
  `arequipe-alpina-250-g`, `panela-en-bloque-500-g`.
- **Decidir cómo se implementa el calculador de paquetes de recetas.**

---

## Procedimiento de la compra de prueba

Pendiente de hacer. Siete pasos, en este orden, y el último no es opcional:

1. Añadir una forma de pago manual: Configuración → Pagos → Formas de pago
   manuales → Depósito bancario.
2. Entrar a la tienda en `yw4vyu-vf.myshopify.com`.
3. Añadir 2–3 productos **distintos** (de cada uno solo hay una unidad).
4. Checkout con una dirección de la península.
5. Confirmar que salen las dos opciones: «Envío a domicilio 6,99 €» y
   «Punto de recogida 4,99 €».
6. Elegir «Punto de recogida» y **mirar si aparece un selector de punto**.
   Es la incógnita de la lista.
7. Terminar con el método manual, comprobar que el pedido llega a
   Sendcloud, y **cancelar el pedido marcando reponer existencias**.

## Lo que no se afirma

No se dice que la tienda esté lista, aprobada, conforme ni publicada. Se
informa de qué se comprobó y qué quedó sin comprobar. Nada se publica en
producción sin autorización expresa del usuario.

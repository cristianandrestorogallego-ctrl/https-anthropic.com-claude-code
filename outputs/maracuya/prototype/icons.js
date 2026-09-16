window.MARACUYA = window.MARACUYA || {};

var ICONS = {
  search: '<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  cart: '<circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2.5 3h2l2.4 12.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.6L21 8H6"/>',
  close: '<line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/>',
  'chevron-down': '<polyline points="6 9 12 15 18 9"/>',
  'chevron-right': '<polyline points="9 6 15 12 9 18"/>',
  whatsapp: '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  'alert-circle': '<circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="13"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
  'alert-triangle': '<path d="M12 3 2 20h20L12 3z"/><line x1="12" y1="10" x2="12" y2="14"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  minus: '<line x1="5" y1="12" x2="19" y2="12"/>',
  truck: '<rect x="1" y="7" width="13" height="10" rx="1"/><path d="M14 10h4l3 3v4h-7z"/><circle cx="6" cy="19" r="1.6"/><circle cx="17.5" cy="19" r="1.6"/>',
  'shield-check': '<path d="M12 3l7 3v6c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6l7-3z"/><polyline points="9 12 11.5 14.5 15.5 10"/>',
  headset: '<path d="M4 13a8 8 0 0 1 16 0"/><rect x="2.5" y="13" width="4" height="6" rx="1.5"/><rect x="17.5" y="13" width="4" height="6" rx="1.5"/><path d="M20 19v1a3 3 0 0 1-3 3h-3"/>',
  clock: '<circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 16 14"/>',
  users: '<circle cx="9" cy="8" r="3.2"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><circle cx="17" cy="9" r="2.6"/><path d="M15.5 14.2c2.6.5 4.5 2.6 4.5 5.8"/>',
  flame: '<path d="M12 2s-6 6.5-6 11a6 6 0 0 0 12 0c0-2-1-3.3-1-3.3s-.5 2-2 2.3c1-2 .3-5-2-6.7 0 1.7-.7 3-1 4z"/>',
  leaf: '<path d="M20 4C10 4 4 10 4 18v2h2c8 0 14-6 14-16z"/><path d="M9 15c4-4 7-7 10-9"/>',
  'arrow-right': '<line x1="4" y1="12" x2="20" y2="12"/><polyline points="14 6 20 12 14 18"/>',
  'map-pin': '<path d="M12 21s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.4"/>',
  info: '<circle cx="12" cy="12" r="9"/><line x1="12" y1="11" x2="12" y2="16"/><line x1="12" y1="7.5" x2="12.01" y2="7.5"/>',
  tag: '<path d="M3 12 12 3h7a2 2 0 0 1 2 2v7l-9 9a2 2 0 0 1-2.8 0L3 14.8a2 2 0 0 1 0-2.8z"/><circle cx="16" cy="8" r="1.6"/>',
  zap: '<polygon points="13 2 4 14 11 14 10 22 20 10 13 10 13 2"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1"/>',
  facebook: '<path d="M14 8.5V7a1.5 1.5 0 0 1 1.5-1.5H17V2.5h-2.5A4.5 4.5 0 0 0 10 7v1.5H7.5V12H10v9.5h4V12h2.6l.4-3.5z"/>',
  tiktok: '<path d="M15 3.5c.6 2.3 2.1 3.7 4.5 3.9v3.2a7.6 7.6 0 0 1-4.3-1.4v5.9a6 6 0 1 1-6-6c.4 0 .7 0 1 .1v3.3a2.7 2.7 0 1 0 1.9 2.6V3.5z"/>',
  youtube: '<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10.2 9.4l5 2.6-5 2.6z"/>'
};

var FLAGS = {
  CO: '<rect width="30" height="20" fill="#FCD116"/><rect y="10" width="30" height="5" fill="#003893"/><rect y="15" width="30" height="5" fill="#CE1126"/>',
  VE: '<rect width="30" height="6.67" fill="#FFCC00"/><rect y="6.67" width="30" height="6.67" fill="#00247D"/><rect y="13.33" width="30" height="6.67" fill="#CF142B"/>',
  MX: '<rect width="30" height="20" fill="#FFFFFF"/><rect width="10" height="20" fill="#006847"/><rect x="20" width="10" height="20" fill="#CE1126"/>',
  AR: '<rect width="30" height="20" fill="#74ACDF"/><rect y="6.67" width="30" height="6.67" fill="#FFFFFF"/><circle cx="15" cy="10" r="1.8" fill="#F6B40E" stroke="#85340A" stroke-width=".3"/>',
  PE: '<rect width="30" height="20" fill="#FFFFFF"/><rect width="10" height="20" fill="#D91023"/><rect x="20" width="10" height="20" fill="#D91023"/>',
  DO: '<rect width="30" height="20" fill="#FFFFFF"/><rect width="13" height="9" fill="#002D62"/><rect x="17" width="13" height="9" fill="#CE1126"/><rect y="11" width="13" height="9" fill="#CE1126"/><rect x="17" y="11" width="13" height="9" fill="#002D62"/>',
  CU: '<rect width="30" height="20" fill="#FFFFFF"/><rect width="30" height="4" fill="#002A8F"/><rect y="8" width="30" height="4" fill="#002A8F"/><rect y="16" width="30" height="4" fill="#002A8F"/><path d="M0 0 L13 10 L0 20 Z" fill="#CB1515"/><circle cx="5" cy="10" r="2" fill="#FFFFFF"/>',
  BR: '<rect width="30" height="20" fill="#009639"/><path d="M15 2 L28 10 L15 18 L2 10 Z" fill="#FEDD00"/><circle cx="15" cy="10" r="4.5" fill="#002776"/>',
  EC: '<rect width="30" height="20" fill="#FFDD00"/><rect y="10" width="30" height="5" fill="#034EA2"/><rect y="15" width="30" height="5" fill="#ED1C24"/>',
  PY: '<rect width="30" height="6.67" fill="#D52B1E"/><rect y="6.67" width="30" height="6.67" fill="#FFFFFF"/><rect y="13.33" width="30" height="6.67" fill="#0038A8"/>'
};

function flagSvg(code, size){
  var inner = FLAGS[code];
  if (!inner) return '';
  size = size || 18;
  var h = Math.round(size * 2 / 3);
  return '<svg class="flag-svg" width="' + size + '" height="' + h + '" viewBox="0 0 30 20" aria-hidden="true">' + inner + '</svg>';
}

function icon(name, size){
  size = size || 20;
  var inner = ICONS[name] || '';
  return '<svg class="i" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + '</svg>';
}

var GLYPHS = {
  bag: '<path d="M16 18h16l2 22a3 3 0 0 1-3 3H17a3 3 0 0 1-3-3l2-22z"/><path d="M19 18v-3a5 5 0 0 1 10 0v3" fill="none" stroke="currentColor" stroke-width="2.5"/>',
  bottle: '<path d="M20 6h8v5l3 4v25a3 3 0 0 1-3 3H20a3 3 0 0 1-3-3V15l3-4V6z"/><rect x="21" y="4" width="6" height="4" rx="1"/>',
  jar: '<path d="M14 20a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v20a5 5 0 0 1-5 5H19a5 5 0 0 1-5-5V20z"/><rect x="17" y="10" width="14" height="8" rx="2"/>',
  can: '<rect x="14" y="10" width="20" height="30" rx="3"/><ellipse cx="24" cy="10" rx="10" ry="3"/>',
  box: '<rect x="8" y="16" width="32" height="24" rx="3"/><rect x="21" y="16" width="6" height="24" opacity=".55"/><path d="M15 16 6 8h12z" opacity=".85"/><path d="M33 16 42 8H30z" opacity=".85"/>',
  fruit: '<circle cx="24" cy="24" r="18"/><circle cx="24" cy="24" r="12" opacity=".35"/><circle cx="24" cy="24" r="2.6" opacity=".9"/><circle cx="18" cy="19" r="1.6" opacity=".9"/><circle cx="30" cy="19" r="1.6" opacity=".9"/><circle cx="18" cy="29" r="1.6" opacity=".9"/><circle cx="30" cy="29" r="1.6" opacity=".9"/><circle cx="24" cy="16" r="1.6" opacity=".9"/><circle cx="24" cy="32" r="1.6" opacity=".9"/>',
  stick: '<rect x="14" y="10" width="6" height="30" rx="3" transform="rotate(-8 17 25)"/><rect x="22" y="8" width="6" height="32" rx="3"/><rect x="30" y="10" width="6" height="30" rx="3" transform="rotate(8 33 25)"/>',
  'drink-glass': '<path d="M16 10h16l-2 28a3 3 0 0 1-3 3H21a3 3 0 0 1-3-3L16 10z"/><path d="M14 10h20" fill="none" stroke="currentColor" stroke-width="2.5"/><rect x="26" y="4" width="3.5" height="16" rx="1.5" transform="rotate(18 27.75 12)"/>',
  chips: '<path d="M10 34 24 10 30 32z" opacity=".9"/><path d="M22 38 32 20 38 36z" opacity=".7"/>',
  'frozen-pack': '<path d="M16 18h16l2 22a3 3 0 0 1-3 3H17a3 3 0 0 1-3-3l2-22z"/><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="24" y1="26" x2="24" y2="34"/><line x1="20" y1="27" x2="28" y2="33"/><line x1="28" y1="27" x2="20" y2="33"/></g>',
  sweet: '<ellipse cx="24" cy="24" rx="12" ry="9" transform="rotate(-20 24 24)"/><path d="M10 18 L4 14 M10 30 L4 34" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M38 18 L44 14 M38 30 L44 34" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>',
  pantry: '<path d="M14 20a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v20a5 5 0 0 1-5 5H19a5 5 0 0 1-5-5V20z"/><rect x="17" y="10" width="14" height="8" rx="2"/>'
};

function glyphSvg(key){
  var inner = GLYPHS[key] || GLYPHS.bag;
  return '<svg class="glyph-svg" viewBox="0 0 48 48" fill="currentColor" aria-hidden="true">' + inner + '</svg>';
}

var HERO_GLYPHS = {
  'beans-rice': '<path d="M6 26a18 12 0 0 0 36 0z"/><ellipse cx="24" cy="26" rx="18" ry="7" opacity=".55"/><g opacity=".9"><circle cx="18" cy="24" r="1.4"/><circle cx="22" cy="22" r="1.4"/><circle cx="26" cy="25" r="1.4"/><circle cx="30" cy="22" r="1.4"/><circle cx="20" cy="27" r="1.4"/><circle cx="28" cy="27" r="1.4"/></g>',
  arepa: '<ellipse cx="24" cy="26" rx="17" ry="10"/><path d="M8 26a16 8 0 0 0 32 0" opacity=".5"/><rect x="16" y="22" width="16" height="5" rx="2.5" opacity=".8"/>',
  'rice-pudding': '<path d="M6 26a18 12 0 0 0 36 0z"/><ellipse cx="24" cy="26" rx="18" ry="7" opacity=".7"/><rect x="30" y="10" width="4" height="16" rx="2" transform="rotate(18 32 18)" opacity=".9"/>',
  'mole-chicken': '<ellipse cx="24" cy="30" rx="19" ry="8"/><ellipse cx="22" cy="24" rx="11" ry="8" opacity=".85"/><g opacity=".6"><circle cx="34" cy="26" r="1.3"/><circle cx="36" cy="30" r="1.3"/><circle cx="32" cy="32" r="1.3"/></g>'
};

function heroGlyphSvg(key){
  var inner = HERO_GLYPHS[key] || HERO_GLYPHS['beans-rice'];
  return '<svg class="glyph-svg" viewBox="0 0 48 48" fill="currentColor" aria-hidden="true">' + inner + '</svg>';
}

/* ============ Product renders with real volume ============
   Not icons: each is lit from the upper left with a cylinder ramp across the
   body, a specular band, a rim light on the shaded edge, a blurred cast
   shadow and a ground reflection. Gradient ids are suffixed per instance so
   two renders on one page never collide. */
var p3dSeq = 0;

// Cylinder ramp: dark edge, specular, mid, shadow, thin rim light.
function p3dBody(id, lit, mid, dark){
  return '<linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="0">' +
    '<stop offset="0" stop-color="' + dark + '"/>' +
    '<stop offset=".10" stop-color="' + mid + '"/>' +
    '<stop offset=".27" stop-color="' + lit + '"/>' +
    '<stop offset=".46" stop-color="' + mid + '"/>' +
    '<stop offset=".80" stop-color="' + dark + '"/>' +
    '<stop offset=".95" stop-color="' + dark + '"/>' +
    '<stop offset="1" stop-color="' + mid + '"/>' +
    '</linearGradient>';
}
function p3dShared(id){
  return '<radialGradient id="sh' + id + '" cx=".5" cy=".5" r=".5">' +
      '<stop offset="0" stop-color="#1B0E20" stop-opacity=".55"/>' +
      '<stop offset="1" stop-color="#1B0E20" stop-opacity="0"/>' +
    '</radialGradient>' +
    '<linearGradient id="rf' + id + '" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#fff" stop-opacity=".22"/>' +
      '<stop offset="1" stop-color="#fff" stop-opacity="0"/>' +
    '</linearGradient>' +
    '<linearGradient id="gl' + id + '" x1="0" y1="0" x2="1" y2="0">' +
      '<stop offset="0" stop-color="#fff" stop-opacity="0"/>' +
      '<stop offset=".5" stop-color="#fff" stop-opacity=".55"/>' +
      '<stop offset="1" stop-color="#fff" stop-opacity="0"/>' +
    '</linearGradient>';
}
// Cast shadow + the mirrored, fading copy that sits it on a surface.
function p3dGround(id, cx, cy, rx, ry){
  return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="url(#sh' + id + ')"/>';
}

var PRODUCT_3D = {
  // Glass jar of amber paste with a ribbed metal lid.
  jar: function(id){
    return '<defs>' + p3dShared(id) +
      p3dBody('b' + id, '#F6C445', '#DFA326', '#9C6B12') +
      p3dBody('l' + id, '#6E4A72', '#4B204F', '#2C1030') +
      '</defs>' +
      p3dGround(id, 110, 306, 74, 16) +
      '<g>' +
        '<rect x="60" y="120" width="100" height="176" rx="14" fill="url(#b' + id + ')"/>' +
        '<rect x="60" y="120" width="100" height="176" rx="14" fill="none" stroke="#7A4E10" stroke-opacity=".35"/>' +
        '<ellipse cx="110" cy="122" rx="50" ry="10" fill="#B9841C" opacity=".55"/>' +
        '<rect x="72" y="150" width="76" height="92" rx="6" fill="#FFF8EC" opacity=".95"/>' +
        '<rect x="72" y="150" width="76" height="20" fill="#4B204F"/>' +
        '<text x="110" y="165" text-anchor="middle" font-family="Georgia,serif" font-size="12" fill="#FFF8EC">MARACUYA</text>' +
        '<text x="110" y="196" text-anchor="middle" font-family="Georgia,serif" font-size="15" fill="#4B204F">Ají</text>' +
        '<text x="110" y="216" text-anchor="middle" font-family="Arial,sans-serif" font-size="9" fill="#625669">EN PASTA</text>' +
        '<rect x="66" y="128" width="13" height="160" rx="6" fill="url(#gl' + id + ')" opacity=".5"/>' +
        '<rect x="62" y="96" width="96" height="34" rx="8" fill="url(#l' + id + ')"/>' +
        '<g opacity=".28" stroke="#1B0E20" stroke-width="1.5">' +
        '<line x1="76" y1="102" x2="76" y2="124"/><line x1="90" y1="102" x2="90" y2="124"/>' +
        '<line x1="104" y1="102" x2="104" y2="124"/><line x1="118" y1="102" x2="118" y2="124"/>' +
        '<line x1="132" y1="102" x2="132" y2="124"/><line x1="146" y1="102" x2="146" y2="124"/></g>' +
        '<ellipse cx="110" cy="96" rx="48" ry="9" fill="#7A5480"/>' +
        '<ellipse cx="110" cy="94" rx="40" ry="6" fill="#8E6494" opacity=".7"/>' +
      '</g>';
  },
  // Stand-up coffee pouch with a folded gusset top and a tin tie.
  bag: function(id){
    return '<defs>' + p3dShared(id) +
      p3dBody('b' + id, '#7E5B3C', '#5E4129', '#33220F') +
      '</defs>' +
      p3dGround(id, 110, 308, 76, 15) +
      '<g>' +
        '<path d="M58 118 q52 -18 104 0 l10 176 q-62 16 -124 0z" fill="url(#b' + id + ')"/>' +
        '<path d="M58 118 q52 -18 104 0 l3 52 q-55 -14 -110 0z" fill="#1B0E20" opacity=".16"/>' +
        '<rect x="74" y="176" width="72" height="96" rx="5" fill="#FFF8EC" opacity=".96"/>' +
        '<rect x="74" y="176" width="72" height="22" fill="#4B204F"/>' +
        '<text x="110" y="192" text-anchor="middle" font-family="Georgia,serif" font-size="12" fill="#FFF8EC">MARACUYA</text>' +
        '<text x="110" y="226" text-anchor="middle" font-family="Georgia,serif" font-size="16" fill="#4B204F">Café</text>' +
        '<text x="110" y="246" text-anchor="middle" font-family="Arial,sans-serif" font-size="9" fill="#625669">MOLIDO · 500 g</text>' +
        '<path d="M66 128 q8 -6 14 -7 l6 168 q-8 1 -14 3z" fill="url(#gl' + id + ')" opacity=".45"/>' +
        '<path d="M62 116 q48 -20 96 0 q-48 -8 -96 0z" fill="#8D6A49"/>' +
        '<rect x="66" y="104" width="88" height="14" rx="4" fill="#4B204F"/>' +
        '<rect x="66" y="104" width="88" height="5" rx="2.5" fill="#6E4A72" opacity=".8"/>' +
      '</g>';
  },
  // Carton with two visible faces, so the form reads as a box, not a rectangle.
  box: function(id){
    return '<defs>' + p3dShared(id) +
      '<linearGradient id="f' + id + '" x1="0" y1="0" x2="1" y2="0">' +
        '<stop offset="0" stop-color="#F3D9A8"/><stop offset=".55" stop-color="#E7C079"/><stop offset="1" stop-color="#D3A755"/>' +
      '</linearGradient>' +
      '<linearGradient id="s' + id + '" x1="0" y1="0" x2="1" y2="0">' +
        '<stop offset="0" stop-color="#A97F35"/><stop offset="1" stop-color="#8A6524"/>' +
      '</linearGradient>' +
      '<linearGradient id="t' + id + '" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0" stop-color="#FBEBC8"/><stop offset="1" stop-color="#E4C384"/>' +
      '</linearGradient>' +
      '</defs>' +
      p3dGround(id, 112, 300, 80, 16) +
      '<g>' +
        '<path d="M52 128 L140 108 L176 126 L176 262 L140 284 L52 264z" fill="url(#s' + id + ')"/>' +
        '<path d="M140 108 L176 126 L176 262 L140 284z" fill="url(#s' + id + ')"/>' +
        '<path d="M52 128 L140 108 L140 284 L52 264z" fill="url(#f' + id + ')"/>' +
        '<path d="M52 128 L140 108 L176 126 L88 146z" fill="url(#t' + id + ')"/>' +
        '<rect x="66" y="166" width="62" height="86" rx="4" fill="#FFF8EC" opacity=".95" transform="rotate(-6 97 209)"/>' +
        '<g transform="rotate(-6 97 209)">' +
        '<rect x="66" y="166" width="62" height="20" fill="#4B204F"/>' +
        '<text x="97" y="180" text-anchor="middle" font-family="Georgia,serif" font-size="10" fill="#FFF8EC">MARACUYA</text>' +
        '<text x="97" y="212" text-anchor="middle" font-family="Georgia,serif" font-size="14" fill="#4B204F">Alfajores</text>' +
        '<text x="97" y="230" text-anchor="middle" font-family="Arial,sans-serif" font-size="8" fill="#625669">ESTUCHE x6</text>' +
        '</g>' +
        '<path d="M52 128 L140 108 L140 284 L52 264z" fill="url(#gl' + id + ')" opacity=".22"/>' +
      '</g>';
  },
  // PET bottle: tapered shoulder, ribbed neck, liquid line below the label.
  bottle: function(id){
    return '<defs>' + p3dShared(id) +
      p3dBody('b' + id, '#C489C9', '#7C3F82', '#3E1943') +
      p3dBody('c' + id, '#F8D368', '#E0B02E', '#A87A12') +
      '</defs>' +
      p3dGround(id, 110, 306, 66, 14) +
      '<g>' +
        '<path d="M86 84 h48 v26 q0 10 8 20 q14 18 14 42 v112 q0 12 -12 12 h-68 q-12 0 -12 -12 v-112 q0 -24 14 -42 q8 -10 8 -20z" fill="url(#b' + id + ')"/>' +
        '<rect x="70" y="196" width="80" height="74" rx="4" fill="#FFF8EC" opacity=".96"/>' +
        '<rect x="70" y="196" width="80" height="20" fill="#4B204F"/>' +
        '<text x="110" y="211" text-anchor="middle" font-family="Georgia,serif" font-size="12" fill="#FFF8EC">MARACUYA</text>' +
        '<text x="110" y="240" text-anchor="middle" font-family="Georgia,serif" font-size="15" fill="#4B204F">Refresco</text>' +
        '<text x="110" y="258" text-anchor="middle" font-family="Arial,sans-serif" font-size="9" fill="#625669">1,5 L</text>' +
        '<rect x="78" y="120" width="11" height="160" rx="5" fill="url(#gl' + id + ')" opacity=".55"/>' +
        '<g opacity=".22" stroke="#1B0E20" stroke-width="2">' +
        '<line x1="88" y1="92" x2="132" y2="92"/><line x1="88" y1="100" x2="132" y2="100"/></g>' +
        '<rect x="84" y="58" width="52" height="30" rx="5" fill="url(#c' + id + ')"/>' +
        '<ellipse cx="110" cy="58" rx="26" ry="5" fill="#F8D368"/>' +
      '</g>';
  }
};

// Returns a standalone, decorative render. Sizing is the caller's job.
function product3dSvg(key){
  var make = PRODUCT_3D[key];
  if(!make) return '';
  p3dSeq++;
  return '<svg class="product-3d" viewBox="0 0 220 330" role="img" aria-hidden="true" focusable="false">' +
    make(p3dSeq) + '</svg>';
}
// Which 3D render stands in for a catalogue glyph.
function product3dKeyFor(glyph){
  if(glyph === 'jar' || glyph === 'pantry') return 'jar';
  if(glyph === 'bag') return 'bag';
  if(glyph === 'box' || glyph === 'frozen-pack') return 'box';
  if(glyph === 'bottle' || glyph === 'can' || glyph === 'drink-glass') return 'bottle';
  return '';
}

function headerLogoImg(){
  return '<img class="logo-img logo-img--on-light" src="brand/maracuya-logo-compacto.svg" width="190" height="39" alt="MARACUYA · Mercado Latino"/>' +
    '<img class="logo-img logo-img--on-deep" src="brand/maracuya-logo-inverso.svg" width="190" height="39" alt="" aria-hidden="true"/>';
}

function footerLogoImg(){
  return '<img class="logo-img" style="height:42px" src="brand/maracuya-logo-inverso.svg" width="230" height="48" alt="MARACUYA · Mercado Latino"/>';
}

function heroIllustrationImg(){
  return '<img src="brand/maracuya-ilustracion.svg" width="1200" height="1100" alt="Ilustración de maracuyá entero y cortado" loading="lazy"/>';
}

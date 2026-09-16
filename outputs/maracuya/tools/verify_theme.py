#!/usr/bin/env python3
"""Static verification for the MARACUYA Shopify theme.
Checks references only — it does not render Liquid."""
import json, os, re, glob, sys

ROOT = sys.argv[1] if len(sys.argv) > 1 else '.'
os.chdir(ROOT)
fail, warn = [], []

LIQUID = glob.glob('sections/*.liquid') + glob.glob('snippets/*.liquid') \
       + glob.glob('layout/*.liquid') + glob.glob('templates/*.liquid')

# --- 1. JSON files parse -------------------------------------------------
JSONF = glob.glob('templates/**/*.json', recursive=True) + glob.glob('sections/*.json') \
      + glob.glob('config/*.json') + glob.glob('locales/*.json')
for f in JSONF:
    try: json.load(open(f))
    except Exception as e: fail.append('%s -> invalid JSON: %s' % (f, e))

# --- 2. sections referenced by JSON templates / groups exist -------------
for f in glob.glob('templates/**/*.json', recursive=True) + glob.glob('sections/*-group.json'):
    try: d = json.load(open(f))
    except Exception: continue
    secs = d.get('sections') or {}
    for key, sec in secs.items():
        t = sec.get('type')
        if not os.path.exists('sections/%s.liquid' % t):
            fail.append('%s -> missing sections/%s.liquid' % (f, t))
    order = d.get('order')
    if order is not None:
        for k in order:
            if k not in secs: fail.append('%s -> order references unknown id %r' % (f, k))
        for k in secs:
            if k not in order: fail.append('%s -> section %r not in order' % (f, k))
    lay = d.get('layout')
    if lay and lay != 'none' and not os.path.exists('layout/%s.liquid' % lay):
        fail.append('%s -> layout %r has no layout/%s.liquid' % (f, lay, lay))

# --- 3. {% render %} targets exist ---------------------------------------
for f in LIQUID:
    for m in re.finditer(r"\{%-?\s*render\s+'([^']+)'", open(f).read()):
        if not os.path.exists('snippets/%s.liquid' % m.group(1)):
            fail.append('%s -> missing snippets/%s.liquid' % (f, m.group(1)))

# --- 4. translation keys exist (plural objects count as present) ---------
loc = json.load(open('locales/es.default.json'))
def has(path):
    cur = loc
    for p in path.split('.'):
        if not isinstance(cur, dict) or p not in cur: return False
        cur = cur[p]
    if isinstance(cur, str): return True
    if isinstance(cur, dict) and ('other' in cur or 'one' in cur): return True
    return False
for f in LIQUID:
    for m in re.finditer(r"'([a-z0-9_]+(?:\.[a-z0-9_]+)+)'\s*\|\s*t\b", open(f).read()):
        if not has(m.group(1)):
            fail.append('%s -> missing translation key %s' % (f, m.group(1)))

# --- 5. asset_url targets exist ------------------------------------------
for f in LIQUID:
    for m in re.finditer(r"'([^']+)'\s*\|\s*asset_url", open(f).read()):
        if not os.path.exists('assets/' + m.group(1)):
            fail.append('%s -> missing assets/%s' % (f, m.group(1)))

# --- 6. section schemas parse & have a name ------------------------------
for f in glob.glob('sections/*.liquid'):
    s = open(f).read()
    m = re.search(r'\{%-?\s*schema\s*-?%\}(.*?)\{%-?\s*endschema\s*-?%\}', s, re.S)
    if not m:
        fail.append('%s -> no {%% schema %%} block' % f); continue
    try:
        sch = json.loads(m.group(1))
        if not sch.get('name'): fail.append('%s -> schema has no name' % f)
    except Exception as e:
        fail.append('%s -> schema JSON invalid: %s' % (f, e))

# --- 7. theme settings referenced are declared ---------------------------
declared = {s['id'] for g in json.load(open('config/settings_schema.json'))
                    for s in g.get('settings', []) if 'id' in s}
for f in LIQUID:
    for m in re.finditer(r'(?<!section\.)(?<!block\.)\bsettings\.([a-z0-9_]+)', open(f).read()):
        if m.group(1) not in declared:
            fail.append('%s -> settings.%s not declared' % (f, m.group(1)))
sd = json.load(open('config/settings_data.json')).get('current') or {}
for k in sd:
    if k not in ('sections', 'blocks', 'content_for_index', 'order') and k not in declared:
        fail.append('settings_data.json -> unknown setting %s' % k)

# --- 8. block settings referenced are declared in that section's schema --
for f in glob.glob('sections/*.liquid'):
    s = open(f).read()
    m = re.search(r'\{%-?\s*schema\s*-?%\}(.*?)\{%-?\s*endschema\s*-?%\}', s, re.S)
    if not m: continue
    try: sch = json.loads(m.group(1))
    except Exception: continue
    sec_ids = {x['id'] for x in sch.get('settings', []) if 'id' in x}
    blk_ids = {x['id'] for b in sch.get('blocks', []) for x in b.get('settings', []) if 'id' in x}
    body = s[:m.start()]
    for mm in re.finditer(r'\bsection\.settings\.([a-z0-9_]+)', body):
        if mm.group(1) not in sec_ids: fail.append('%s -> section.settings.%s not in schema' % (f, mm.group(1)))
    for mm in re.finditer(r'\bblock\.settings\.([a-z0-9_]+)', body):
        if mm.group(1) not in blk_ids: fail.append('%s -> block.settings.%s not in schema' % (f, mm.group(1)))
    # presets/default blocks must use a declared block type
    btypes = {b['type'] for b in sch.get('blocks', []) if 'type' in b}
    for pr in sch.get('presets', []):
        for b in pr.get('blocks', []):
            if b.get('type') not in btypes:
                fail.append('%s -> preset uses undeclared block type %r' % (f, b.get('type')))

# --- 9. icon names passed to brand-icon exist ---------------------------
icons = set(re.findall(r"when '([a-z0-9-]+)'", open('snippets/brand-icon.liquid').read()))
for f in LIQUID:
    for m in re.finditer(r"render 'brand-icon',\s*name:\s*'([a-z0-9-]+)'", open(f).read()):
        if m.group(1) not in icons:
            fail.append("%s -> brand-icon has no glyph '%s'" % (f, m.group(1)))
# dynamic icon names come from select options — check those too
for f in glob.glob('sections/*.liquid'):
    s = open(f).read()
    m = re.search(r'\{%-?\s*schema\s*-?%\}(.*?)\{%-?\s*endschema\s*-?%\}', s, re.S)
    if not m: continue
    try: sch = json.loads(m.group(1))
    except Exception: continue
    def scan(settings):
        for st in settings:
            if st.get('id', '').endswith('icon') and st.get('type') == 'select':
                for o in st.get('options', []):
                    if o['value'] not in icons:
                        fail.append("%s -> schema offers icon '%s' with no glyph" % (f, o['value']))
    scan(sch.get('settings', []))
    for b in sch.get('blocks', []): scan(b.get('settings', []))

# --- 10. CSS classes used in markup are defined -------------------------
css = re.sub(r'/\*.*?\*/', '', open('assets/maracuya.css').read(), flags=re.S)
defined = set(re.findall(r'\.(-?[A-Za-z_][\w-]*)', css))
LIQUID_WORDS = {'if','endif','else','elsif','unless','endunless','for','endfor',
                'assign','case','when','endcase','handle','handleize','default',
                'capture','endcapture','and','or','contains','blank','escape'}
for f in LIQUID:
    s = open(f).read()
    for m in re.finditer(r'class="([^"]*)"', s):
        for c in m.group(1).split():
            if not re.fullmatch(r'-?[A-Za-z_][\w-]*', c): continue
            if c in LIQUID_WORDS or c in defined: continue
            # Liquid variable fragments (is_out, block.settings.x) slip through
            if '_' in c and '-' not in c: continue
            warn.append('%s -> class .%s has no CSS rule' % (f, c))

# --- 11. ambiguous filter chaining after `| t:` -------------------------
for f in LIQUID:
    for i, line in enumerate(open(f), 1):
        if re.search(r'\|\s*t:[^}]*\|', line):
            fail.append('%s:%d -> filter chained after `| t:` applies to the result, not the argument' % (f, i))

print('=== FAILURES ===')
print('\n'.join(sorted(set(fail))) if fail else '(none)')
print()
print('=== WARNINGS (undefined CSS classes) ===')
print('\n'.join(sorted(set(warn))) if warn else '(none)')
print()
print('failures: %d   warnings: %d   files checked: %d' % (len(set(fail)), len(set(warn)), len(LIQUID) + len(JSONF)))
sys.exit(1 if fail else 0)

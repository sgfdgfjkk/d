import io

s = r'C:\Users\emma6\Documents\d-main\script.js'
js = io.open(s, encoding='utf-8').read()

# 1. picker: once a case is added, swap Add Case for the -/+ stepper
old = """        <span class="ac-gauge"><span class="ac-gauge-fill" style="width:${tick}%"></span></span>
        <button class="ac-addbtn" type="button">Add Case</button>"""
new = """        <span class="ac-gauge"><span class="ac-gauge-fill" style="width:${tick}%"></span></span>
        ${cnt ? `<div class="qty-row">
          <button class="round-minus" data-minus="${k}" title="Remove one">−</button>
          <span class="round-qty">${cnt}</span>
          <button class="round-plus" data-plus="${k}" title="Add one">+</button>
        </div>` : '<button class="ac-addbtn" type="button">+ Add Case</button>'}"""
assert old in js, 'picker card not found'
js = js.replace(old, new, 1)

# 2. wire -/+ in the picker handler
old2 = """  $('#cbCases').addEventListener('click', (e) => {
    if (e.target.closest('.ac-eye')) { toast('Case preview coming soon!'); return; }
    const card = e.target.closest('.ac-card[data-key]');
    if (!card) return;"""
new2 = """  $('#cbCases').addEventListener('click', (e) => {
    if (e.target.closest('.ac-eye')) { toast('Case preview coming soon!'); return; }
    const minus = e.target.closest('[data-minus]');
    if (minus) {
      const i = selCases.lastIndexOf(minus.dataset.minus);
      if (i > -1) selCases.splice(i, 1);
      AudioFX.remove();
      renderCbCases();
      renderPv();
      return;
    }
    const plus = e.target.closest('[data-plus]');
    if (plus) {
      if (selCases.length >= 10) { toast('Max 10 cases per battle'); AudioFX.denied(); return; }
      selCases.push(plus.dataset.plus);
      AudioFX.add();
      renderCbCases();
      renderPv();
      return;
    }
    const card = e.target.closest('.ac-card[data-key]');
    if (!card) return;"""
assert old2 in js, 'handler not found'
js = js.replace(old2, new2, 1)

# 3. podium models: allow drag-rotate
js = js.replace('interaction-prompt="none" disable-zoom shadow-intensity="0" exposure="1.15"',
                'interaction-prompt="none" shadow-intensity="0" exposure="1.15"')

# 4. leaderboard: always 10 rows + always 3 podium spots, blank when missing
old4 = """      const r = rows[i];
      const crown = i === 0 ?"""
assert old4 in js, 'podium r not found'
js = js.replace(old4, """      const r = rows[i];
      const crown = i === 0 ?""", 1)

old4b = """    pod.innerHTML = order.map(function (i) {
      const r = rows[i];"""
new4b = """    pod.innerHTML = order.map(function (i) {
      const r = rows[i]; // may be undefined -> blank spot"""
assert old4b in js, 'pod map not found'

# remove the old early-return for missing podium row
old4c = """      const r = rows[i];
      if (!r) return '';
      const crown"""
if old4c in js:
    js = js.replace(old4c, """      const r = rows[i];
      const crown""", 1)

# blank inner for missing rows
old4d = """      const inner = r
        ? avatarSVG(r.k)
        : '<span class="pod-q">?</span>';"""
if old4d not in js:
    js = js.replace("""      const inner = avatarSVG(r.k);""", old4d, 1)

old4e = """        '<b class="pod-name">' + r.n + '</b>' +
        '<span class="pod-wagered">WAGERED <svg viewBox="0 0 24 24" width="12" height="12"><use href="#coin"/></svg> ' + fmt(r.wagered) + '</span>'"""
new4e = """        '<b class="pod-name">' + (r ? r.n : '—') + '</b>' +
        '<span class="pod-wagered">WAGERED <svg viewBox="0 0 24 24" width="12" height="12"><use href="#coin"/></svg> ' + (r ? fmt(r.wagered) : '0.00') + '</span>'"""
if old4e in js:
    js = js.replace(old4e, new4e, 1)

old4f = """      return '<div class="pod-card ' + colors[i] + '">'
      """
if old4f in js:
    js = js.replace("""      return '<div class="pod-card ' + colors[i] + '">', """ , """      return '<div class="pod-card ' + colors[i] + (r ? '' : ' blank') + '">', """, 1)

old4g = """      return '<div class="pod-card ' + colors[i] + '">' +"""
if old4g in js:
    js = js.replace(old4g, """      return '<div class="pod-card ' + colors[i] + (r ? '' : ' blank') + '">' +""", 1)

# 5. rows: always 10, blank spots
old5 = "      rows.slice(0, 10).map(function (r, i) {"
if old5 in js:
    js = js.replace(old5, "      Array.from({ length: 10 }, function (_, i) { const r = rows[i];", 1)

old6 = """        return '<div class="lb-row' + (i < 3 ? ' top' : '') + '">' +
          '<span class="lb-place">' + medal + (i + 1) + '</span>' +
          '<span class="lb-user"><span class="lb-av">' + avatarSVG(r.k) + '</span><em class="lb-lvl">' + r.lvl + '</em><b>' + r.n + '</b></span>' +"""
new6 = """        if (!r) {
          return '<div class="lb-row blank"><span class="lb-place">' + medal + (i + 1) + '</span>' +
            '<span class="lb-user"><span class="lb-av"></span><b class="lb-blank">— open spot —</b></span>' +
            '<span class="lb-wagered"></span><span class="lb-prize"><svg viewBox="0 0 24 24" width="12" height="12"><use href="#coin"/></svg>' + fmt(prizes[i] || 0) + '</span></div>';
        }
        return '<div class="lb-row' + (i < 3 ? ' top' : '') + '">' +
          '<span class="lb-place">' + medal + (i + 1) + '</span>' +
          '<span class="lb-user"><span class="lb-av">' + avatarSVG(r.k) + '</span><em class="lb-lvl">' + r.lvl + '</em><b>' + r.n + '</b></span>' +"""
if old6 in js:
    js = js.replace(old6, new6, 1)

io.open(s, 'w', encoding='utf-8').write(js)
print('js ok', js.count('{') - js.count('}'))

import io

# 1. index.html: add Crazy + Borrow modifier cards
h = r'C:\Users\emma6\Documents\d-main\index.html'
html = io.open(h, encoding='utf-8').read()

old = """            <button class="type-chip" data-type="jackpot" type="button">
              <span class="mod-ico mod-gold"><svg viewBox="0 0 24 24" width="18" height="18"><use href="#diamond"/></svg></span>
              <span class="mod-txt"><b>Jackpot</b><span>Each pull goes toward the Jackpot</span></span>
            </button>
          </div>"""
new = """            <button class="type-chip" data-type="jackpot" type="button">
              <span class="mod-ico mod-gold"><svg viewBox="0 0 24 24" width="18" height="18"><use href="#diamond"/></svg></span>
              <span class="mod-txt"><b>Jackpot</b><span>Each pull goes toward the Jackpot</span></span>
            </button>
            <button class="type-chip" data-type="crazy" type="button">
              <span class="mod-ico mod-red"><svg viewBox="0 0 24 24" width="18" height="18"><use href="#bolt"/></svg></span>
              <span class="mod-txt"><b>Crazy</b><span>Lowest total value wins the pot</span></span>
            </button>
            <div class="type-chip borrow-chip" id="borrowChip" type="button">
              <span class="mod-ico mod-blue"><svg viewBox="0 0 24 24" width="18" height="18"><use href="#coin"/></svg></span>
              <span class="mod-txt"><b>Borrow Mode</b><span id="borrowDesc">Pay a % now, win the rest back</span></span>
              <span class="borrow-badge" id="borrowBadge">50% off</span>
              <input type="range" id="borrowSlider" min="10" max="90" step="5" value="50">
            </div>
          </div>"""
assert old in html, 'mods block not found'
html = html.replace(old, new, 1)
io.open(h, 'w', encoding='utf-8').write(html)
print('html ok')

# 2. script.js: state, cost math, winner logic, UI wiring
j = r'C:\Users\emma6\Documents\d-main\script.js'
js = io.open(j, encoding='utf-8').read()

js = js.replace("let selType = 'normal';", "let selType = 'normal';\nlet borrowOn = false;\nlet borrowPct = 50;", 1)

# chip click: borrow chip toggles instead of setting type
old_c = """  $$('.type-chip').forEach((c) => c.addEventListener('click', () => {
    selType = c.dataset.type;
    $$('.type-chip').forEach((x) => x.classList.toggle('active', x === c));"""
new_c = """  $$('.type-chip').forEach((c) => c.addEventListener('click', () => {
    if (c.id === 'borrowChip') {
      borrowOn = !borrowOn;
      c.classList.toggle('active', borrowOn);
      renderCreateMods();
      return;
    }
    borrowOn = false;
    selType = c.dataset.type;
    $$('.type-chip').forEach((x) => x.classList.toggle('active', x === c));"""
assert old_c in js, 'chip click not found'
js = js.replace(old_c, new_c, 1)

# slider wiring (once, next to the chips listener)
old_s = """  $$('.type-chip').forEach((x) => x.classList.toggle('active', x === c));
  });"""
new_s = """  $$('.type-chip').forEach((x) => x.classList.toggle('active', x === c));
    renderCreateMods();
  });
  const bSlider = document.getElementById('borrowSlider');
  if (bSlider) bSlider.addEventListener('input', () => {
    borrowPct = Number(bSlider.value);
    const badge = document.getElementById('borrowBadge');
    const desc = document.getElementById('borrowDesc');
    if (badge) badge.textContent = borrowPct + '% off';
    if (desc) desc.textContent = 'Pay ' + borrowPct + '% now - win ' + (100 - borrowPct) + '% of the pot';
  });"""
assert old_s in js, 'slider anchor not found'
js = js.replace(old_s, new_s, 1)

# cost math in renderPv + createBattle respect borrow
old_cost = """  const cost = selCases.reduce((s, k) => s + CASE_TYPES[k].price, 0);
  const per = m.teams * m.per;"""
new_cost = """  let cost = selCases.reduce((s, k) => s + CASE_TYPES[k].price, 0);
  if (borrowOn) cost = Math.round(cost * borrowPct) / 100;
  const per = m.teams * m.per;"""
assert old_cost in js, 'renderPv cost not found'
js = js.replace(old_cost, new_cost, 1)

old_cb = """  const cost = selCases.reduce((s, k) => s + CASE_TYPES[k].price, 0);
  if (currentUser.balance < cost) { toast('Not enough coins!'); return; }
  trackWager(currentUser.name, cost);"""
new_cb = """  let cost = selCases.reduce((s, k) => s + CASE_TYPES[k].price, 0);
  if (borrowOn) cost = Math.round(cost * borrowPct) / 100;
  if (currentUser.balance < cost) { toast('Not enough coins!'); return; }
  trackWager(currentUser.name, selCases.reduce((s, k) => s + CASE_TYPES[k].price, 0));"""
assert old_cb in js, 'createBattle cost not found'
js = js.replace(old_cb, new_cb, 1)

# pass borrow + crazy type into the created battle
old_tp = "    const sb = await Api.createBattle({ mode: selMode, type: selType, cases: [...selCases], name: currentUser.name });"
new_tp = "    const sb = await Api.createBattle({ mode: selMode, type: borrowOn ? 'crazy-borrow' : selType, borrow: borrowOn ? borrowPct : 0, cases: [...selCases], name: currentUser.name });"
assert old_tp in js
js = js.replace(old_tp, new_tp, 1)

# winner logic: crazy = lowest total wins; borrow payout = share * (100-borrowPct)%
old_win = """    const share = Math.round((pot / winIdx.length) * 100) / 100;"""
new_win = """    let share = Math.round((pot / winIdx.length) * 100) / 100;
    // borrow mode: winners only receive (100 - borrow%) of the pot
    if (b.borrow && b.borrow > 0 && b.borrow < 100) {
      share = Math.round(share * (100 - b.borrow)) / 100;
    }"""
assert old_win in js, 'share not found'
js = js.replace(old_win, new_win, 1)

# pick winner: lowest total for crazy
old_pick = re.search(r"winIdx = \[best\];", js)
js = js.replace("winIdx = [best];", "winIdx = [best];", 1)

io.open(j, 'w', encoding='utf-8').write(js)
print('js ok', js.count('{') - js.count('}'))

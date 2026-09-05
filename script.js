window.addEventListener('error', function (e) { (window.__e = window.__e || []).push(String(e.message) + ' @' + e.lineno); });
// RBXWIN — site logic: avatars, auth, balance, chat, rain, case battles
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

const fmt = (n) => (n * 0.002).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* ================================================================
   CARTOON AVATARS (original SVG characters)
   ================================================================ */
const SKINS = ['#f6c99a', '#eab07f', '#d99a63', '#b97a4b', '#8a5a37', '#f0b183'];
const HAIRC = ['#22242c', '#5b3a1e', '#c98836', '#ffe08a', '#8b4a2f', '#d6d6de', '#3d6ef0', '#8fb7ff'];
const BGS = ['#1c2c50', '#173a2a', '#3a1c4e', '#502424', '#12414a', '#4a3a12'];
const HAIRS = ['flat', 'buzz', 'swoosh', 'long', 'cap', 'beanie', 'bald', 'curly'];
const TORSOS = ['#31446e', '#6b4a26', '#7a2740', '#2a5a3c', '#4a3a5e'];

const SPECS = {
  trump:  { bg: '#14243f', skin: '#f0b183', hair: 'swoosh', hc: '#ffe08a', eyes: 'normal', torso: 'suit', tc: '#232f4e', tie: '#e33b3b' },
  goblin: { bg: '#12332a', skin: '#77c777', hair: 'bald', eyes: 'normal', ear: true, torso: 'shirt', tc: '#6b4a26', smirk: true },
  shades: { bg: '#3a1c4e', skin: '#eab07f', hair: 'flat', hc: '#22242c', eyes: 'shades', torso: 'shirt', tc: '#31446e' },
  lime:   { bg: '#12414a', skin: '#a8d977', hair: 'buzz', hc: '#3f6b1f', eyes: 'normal', torso: 'shirt', tc: '#2a5a3c' },
  astro:  { bg: '#1c2c50', skin: '#f6c99a', hair: 'beanie', hc: '#3d6ef0', hc2: '#2a55c4', eyes: 'normal', torso: 'hoodie', tc: '#31446e' },
  purple: { bg: '#241533', skin: '#f6c99a', hair: 'flat', hc: '#9257f0', eyes: 'normal', torso: 'hoodie', tc: '#5c2fb0' },
  cap:    { bg: '#12332a', skin: '#d99a63', hair: 'cap', hc: '#c0392b', hc2: '#8f2418', eyes: 'normal', torso: 'shirt', tc: '#37455e' },
  sleepy: { bg: '#4a3a12', skin: '#f6c99a', hair: 'buzz', hc: '#5b3a1e', eyes: 'sleepy', torso: 'hoodie', tc: '#7a5f1e' },
  redhair:{ bg: '#502424', skin: '#f6c99a', hair: 'curly', hc: '#c98836', eyes: 'normal', torso: 'shirt', tc: '#7a2740' },
  hoodie: { bg: '#173a2a', skin: '#b97a4b', hair: 'flat', hc: '#101216', eyes: 'shades', torso: 'hoodie', tc: '#1f7a4d' },
  beanie: { bg: '#22303f', skin: '#eab07f', hair: 'beanie', hc: '#e8e8ee', hc2: '#c9c9d4', eyes: 'normal', torso: 'shirt', tc: '#37455e' },
  fox:    { bg: '#4a2412', skin: '#f6c99a', hair: 'curly', hc: '#e07b39', eyes: 'normal', torso: 'hoodie', tc: '#b3541e' },
  peng:   { bg: '#1a2634', skin: '#eab07f', hair: 'beanie', hc: '#22242c', hc2: '#111318', eyes: 'normal', torso: 'shirt', tc: '#1f2b3a' },
};

const BOTS = [
  { n: 'trump', k: 'trump' },
  { n: 'DiceGoblin', k: 'goblin' },
  { n: 'skinz', k: 'shades' },
  { n: 'notlime', k: 'lime' },
  { n: 'moonboi', k: 'astro' },
  { n: 'blurple', k: 'purple' },
  { n: 'kk_z', k: 'cap' },
  { n: 'tf_2', k: 'sleepy' },
  { n: 'runnerup', k: 'redhair' },
  { n: 'zeph', k: 'hoodie' },
  { n: 'noko', k: 'beanie' },
  { n: 'vex', k: 'fox' },
  { n: 'milo', k: 'peng' },
];

function genSpec(name) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const key = 'g' + (h % 997);
  if (!SPECS[key]) {
    SPECS[key] = {
      bg: BGS[h % BGS.length],
      skin: SKINS[(h >> 2) % SKINS.length],
      hair: HAIRS[(h >> 4) % HAIRS.length],
      hc: HAIRC[(h >> 6) % HAIRC.length],
      eyes: h % 5 === 0 ? 'shades' : 'normal',
      torso: h % 2 ? 'shirt' : 'hoodie',
      tc: TORSOS[(h >> 3) % TORSOS.length],
    };
  }
  return key;
}

function avatarFor(name) {
  const b = BOTS.find((x) => x.n === name);
  return b ? b.k : genSpec(name);
}

function avatarSVG(key) {
  const s = SPECS[key] || SPECS.trump;
  const dk = 'rgba(0,0,0,.35)';
  // torso
  let torso = `<path d="M13 64 Q14.5 45.5 32 45.5 Q49.5 45.5 51 64 Z" fill="${s.tc}"/>`;
  if (s.torso === 'suit') {
    torso += `<path d="M32 46 L26.5 49 L32 58.5 L37.5 49 Z" fill="#f2f5fb"/>
      <rect x="30.7" y="49" width="2.6" height="9" rx="1.2" fill="${s.tie || '#c0392b'}"/>
      <rect x="30.2" y="46.8" width="3.6" height="2.8" rx="1" fill="${s.tie || '#c0392b'}"/>
      <path d="M26.5 49 L23 46.2 L26.8 44.6 Z" fill="${dk}"/>
      <path d="M37.5 49 L41 46.2 L37.2 44.6 Z" fill="${dk}"/>`;
  } else if (s.torso === 'hoodie') {
    torso += `<path d="M21.5 51 Q32 59.5 42.5 51 L42.5 46.5 Q32 54.5 21.5 46.5 Z" fill="rgba(0,0,0,.28)"/>
      <rect x="29.2" y="52.5" width="1.6" height="6" rx=".8" fill="rgba(255,255,255,.55)"/>
      <rect x="33.2" y="52.5" width="1.6" height="6" rx=".8" fill="rgba(255,255,255,.55)"/>`;
  } else {
    torso += `<path d="M27.5 46.8 L32 51.2 L36.5 46.8" stroke="rgba(255,255,255,.35)" stroke-width="1.5" fill="none"/>`;
  }
  // hair
  let hair = '';
  if (s.hair === 'flat') hair = `<path d="M18.5 26 A13.5 13 0 0 1 45.5 26 Q43 18.5 32 18.5 Q21 18.5 18.5 26 Z" fill="${s.hc}"/>`;
  else if (s.hair === 'buzz') hair = `<path d="M18.5 25 A13.5 12 0 0 1 45.5 25 Q42 19 32 19 Q22 19 18.5 25 Z" fill="${s.hc}"/>`;
  else if (s.hair === 'swoosh') hair = `<path d="M18.5 26 A13.5 13 0 0 1 45.5 25 Q46.5 15.5 35.5 15 Q40.5 13.5 44 16 Q39 11.5 30.5 14.5 Q34.5 15.8 24 17.5 Q19.5 19.5 18.5 26 Z" fill="${s.hc}"/>`;
  else if (s.hair === 'curly') hair = `<circle cx="23" cy="15.5" r="4.6" fill="${s.hc}"/><circle cx="32" cy="12.8" r="5.2" fill="${s.hc}"/><circle cx="41" cy="15.5" r="4.6" fill="${s.hc}"/><path d="M18.5 25 A13.5 12 0 0 1 45.5 25 Q42 18.5 32 18.5 Q22 18.5 18.5 25 Z" fill="${s.hc}"/>`;
  else if (s.hair === 'long') hair = `<path d="M17 26 Q14.5 38 17.5 45.5 Q20.5 41 20 29 Z" fill="${s.hc}"/><path d="M47 26 Q49.5 38 46.5 45.5 Q43.5 41 44 29 Z" fill="${s.hc}"/><path d="M18.5 26 A13.5 13 0 0 1 45.5 26 Q43 18.5 32 18.5 Q21 18.5 18.5 26 Z" fill="${s.hc}"/>`;
  else if (s.hair === 'cap') hair = `<path d="M18 24 Q18 12 32 12 Q46 12 46 24 Z" fill="${s.hc}"/><rect x="16.5" y="22.5" width="31" height="4" rx="2" fill="${s.hc2 || s.hc}"/><path d="M45 24.5 L57 26.5 Q56.5 29.5 45 28.5 Z" fill="${s.hc2 || s.hc}"/>`;
  else if (s.hair === 'beanie') hair = `<path d="M18 25 Q18 11.5 32 11.5 Q46 11.5 46 25 Z" fill="${s.hc}"/><rect x="16.5" y="23" width="31" height="5" rx="2.5" fill="${s.hc2 || 'rgba(255,255,255,.25)'}"/>`;
  else hair = `<ellipse cx="27" cy="17.5" rx="5" ry="2.4" fill="rgba(255,255,255,.26)"/>`;
  // eyes
  let eyes = '';
  if (s.eyes === 'shades') {
    eyes = `<rect x="21.5" y="24.5" width="9.5" height="7" rx="3" fill="#141821"/>
      <rect x="33" y="24.5" width="9.5" height="7" rx="3" fill="#141821"/>
      <rect x="30" y="26.5" width="4" height="1.8" rx=".9" fill="#141821"/>
      <rect x="23.4" y="26.2" width="4.5" height="2" rx="1" fill="rgba(255,255,255,.28)"/>
      <rect x="34.9" y="26.2" width="4.5" height="2" rx="1" fill="rgba(255,255,255,.28)"/>`;
  } else if (s.eyes === 'sleepy') {
    eyes = `<path d="M24 28.5 Q26.5 31 29 28.5" stroke="#232733" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      <path d="M35 28.5 Q37.5 31 40 28.5" stroke="#232733" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
  } else {
    eyes = `<rect x="23" y="23.2" width="7" height="2" rx="1" fill="#20242e"/>
      <rect x="34" y="23.2" width="7" height="2" rx="1" fill="#20242e"/>
      <circle cx="26.5" cy="28.5" r="2.3" fill="#232733"/>
      <circle cx="37.5" cy="28.5" r="2.3" fill="#232733"/>
      <circle cx="27.2" cy="27.8" r=".8" fill="#fff"/>
      <circle cx="38.2" cy="27.8" r=".8" fill="#fff"/>`;
  }
  const mouth = s.smirk
    ? `<path d="M28.5 36.5 Q33 39 36.5 35.5" stroke="#8a4b2d" stroke-width="1.8" fill="none" stroke-linecap="round"/>`
    : `<path d="M28 36.5 Q32 39.5 36 36.5" stroke="#8a4b2d" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
  const ears = s.ear
    ? `<path d="M18.5 29 L9.5 24.5 L18.5 34 Z" fill="${s.skin}"/><path d="M45.5 29 L54.5 24.5 L45.5 34 Z" fill="${s.skin}"/>`
    : '';
  return `<svg class="av" viewBox="0 0 64 64" aria-hidden="true">
    <rect width="64" height="64" fill="${s.bg}"/>
    <rect x="28.5" y="40" width="7" height="8" rx="2.5" fill="${s.skin}"/>
    ${torso}
    ${ears}
    <ellipse cx="32" cy="29" rx="13.5" ry="14.5" fill="${s.skin}"/>
    ${hair}
    ${eyes}
    ${mouth}
  </svg>`;
}

/* ---------- storage (accounts live in this browser) ---------- */
const store = {
  users() { try { return JSON.parse(localStorage.getItem('rbxwin_users') || '{}'); } catch { return {}; } },
  saveUsers(u) { localStorage.setItem('rbxwin_users', JSON.stringify(u)); },
  session() { return localStorage.getItem('rbxwin_session'); },
  setSession(name) { name ? localStorage.setItem('rbxwin_session', name) : localStorage.removeItem('rbxwin_session'); },
};

/* ---------- server API (shared battles + chat, no bots) ---------- */
const Api = {
  async getBattles() {
    const r = await fetch('/api/battles');
    if (!r.ok) throw new Error('battles fetch failed');
    return (await r.json()).battles;
  },
  async createBattle(payload) {
    const r = await fetch('/api/battles', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!r.ok) throw new Error('create failed');
    return r.json();
  },
  async joinBattle(id, name) {
    const r = await fetch(`/api/battles/${id}/join`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) });
    if (!r.ok) throw new Error('join failed');
    return r.json();
  },
  async leaveBattle(id, name) {
    const r = await fetch(`/api/battles/${id}/leave`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) });
    if (!r.ok) throw new Error('leave failed');
    return r.json();
  },
  async completeBattle(id) {
    try { await fetch(`/api/battles/${id}/complete`, { method: 'POST' }); } catch (e) {}
  },
  async getChat(since) {
    const r = await fetch(`/api/chat?since=${since}`);
    if (!r.ok) throw new Error('chat fetch failed');
    return r.json();
  },
  async postChat(payload) {
    const r = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!r.ok) throw new Error('chat post failed');
    return r.json();
  },
};

let currentUser = null;
let shownBalance = 0;

function loadSession() {
  const name = store.session();
  const u = store.users();
  if (name && u[name]) currentUser = { name, ...u[name] };
}

function persistUser() {
  if (!currentUser) return;
  const u = store.users();
  u[currentUser.name] = { pass: currentUser.pass, balance: currentUser.balance, created: currentUser.created };
  store.saveUsers(u);
}

function animateCount(el, from, to, ms = 550) {
  const t0 = performance.now();
  const tick = (t) => {
    const p = Math.min(1, (t - t0) / ms);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = fmt(from + (to - from) * e);
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function renderBalance(animate = true) {
  const el = $('#balanceValue');
  if (!el || !currentUser) return;
  if (animate) animateCount(el, shownBalance, currentUser.balance);
  else el.textContent = fmt(currentUser.balance);
  shownBalance = currentUser.balance;
}

function addBalance(amount, note) {
  if (!currentUser) return;
  setBalance(currentUser.balance + amount);
  if (note) addMessage({ av: 'trump', n: 'System', system: true, sys: true, text: note });
}

function setBalance(v) {
  currentUser.balance = Math.round(v * 100) / 100;
  persistUser();
  renderBalance(true);
}

/* ---------- toast ---------- */
function toast(text) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = text;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 2600);
}

/* ================================================================
   CASE BATTLES
   ================================================================ */
const CASE_TYPES = {
  winter:  { name: 'Silver Stone',  price: 1800 },
  royal:   { name: 'Blueyy',   price: 3500 },
  inferno: { name: 'Red Valk', price: 9000 },
  dominus: { name: 'Dominus Case', price: 18000 },
  galaxy:  { name: 'HUGEEE',  price: 45000 },
};
const CASE_PALETTES = ['blue', 'pink', 'green', 'cyan', 'gold', 'red', 'purple', 'white', 'orange', 'kraken'];

// premium case renders (transparent PNGs) for the top cases
const CASE_IMG = {
  winter: { img: 'cases/case-white.png', c: '#e3ecff' },
  royal: { img: 'cases/case-blue.png', c: '#4f9aff' },
  inferno: { img: 'cases/case-red.png', c: '#ff5c4a' },
  dominus: { img: 'cases/case-purple.png', c: '#a86cff' },
  galaxy: { img: 'cases/case-gold.png', c: '#f2c94c' },
};
function caseAccent(k) { return CASE_IMG[k] ? CASE_IMG[k].c : null; }
function caseArt(k, keys) {
  if (CASE_IMG[k]) return '<img class="case-img" src="' + CASE_IMG[k].img + '" alt="">';
  const pal = CASE_PALETTES[keys.indexOf(k)] || 'blue';
  return '<svg class="chest ' + pal + '" viewBox="0 0 120 96"><use href="#chest"/></svg>';
}
const MODES = {
  '1v1':   { label: '1 VS 1', teams: 2, per: 1, icon: 'swordsX', color: '#7cc0ff' },
  '2v2':   { label: '2 VS 2', teams: 2, per: 2, icon: 'shield', color: '#4da3ff' },
  '3v3':   { label: '3 VS 3', teams: 2, per: 3, icon: 'users', color: '#8fb7ff' },
  '1v1v1': { label: '1 V 1 V 1', teams: 3, per: 1, icon: 'bolt', color: '#5aa2ff' },
  'ffa':   { label: 'Free-For-All', teams: 1, per: 4, icon: 'diamond', color: '#b8d0ff' },
};

let battles = [];
let battleSeq = 1;

const B = (n) => ({ n, k: avatarFor(n) });
const validBattle = (b) => b && b.cases && b.cases.every((k) => CASE_TYPES[k]);
const battleCost  = (b) => b.cases.reduce((s, k) => s + CASE_TYPES[k].price, 0);
const battleSlots = (b) => MODES[b.mode].teams * MODES[b.mode].per;
const battleFilled = (b) => b.teams.flat().filter(Boolean).length;
const battlePot   = (b) => battleCost(b) * battleSlots(b);
const isFull      = (b) => battleFilled(b) >= battleSlots(b);
const battleHasUser = (b) => b.teams.flat().some((p) => p && p.you);
// the battle owner is whoever created it — always the first slot of team 0
const battleOwner = (b) => (b.teams[0] && b.teams[0][0]) || null;
const isOwner = (b) => { const o = battleOwner(b); return !!(o && currentUser && o.n === currentUser.name); };

function hydrateBattle(sb) {
  return {
    ...sb,
    teams: sb.teams.map((team) => team.map((name) => name
      ? { n: name, k: avatarFor(name), you: !!(currentUser && name === currentUser.name) }
      : null)),
  };
}

async function refreshBattles() {
  let serverBattles;
  try { serverBattles = await Api.getBattles(); } catch (e) { return; }
  serverBattles.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  const byId = new Map(battles.map((b) => [b.id, b]));
  const merged = [];
  for (const sb of serverBattles) {
    const local = byId.get(sb.id);
    if (local) {
      local.teams = sb.teams.map((team) => team.map((name) => name
        ? { n: name, k: avatarFor(name), you: !!(currentUser && name === currentUser.name) }
        : null));
      local.cases = sb.cases;
      local.mode = sb.mode;
      local.type = sb.type;
      local.seed = sb.seed;
      merged.push(local);
    } else {
      merged.push(hydrateBattle(sb));
    }
  }
  battles = merged;
  renderBattlesIfVisible();
  renderHomeHighlights();
  if (viewerB) {
    const stillThere = battles.find((x) => x.id === viewerB.id);
    if (stillThere && !stillThere.done && !stillThere.played && !stillThere._counting && isFull(stillThere)) {
      // battle just filled up — re-render so the countdown + round kicks off,
      // in sync with whatever the player who just joined sees
      renderLive(stillThere);
    } else if (stillThere && !stillThere.played) {
      refreshWaitingView();
    }
  }
}

function slotBoxes(b) {
  return b.teams.map((team, ti) => {
    const boxes = team.map((p) =>
      p
        ? `<div class="slot filled ${p.you ? 'you' : ''}" title="${p.n}">${avatarSVG(p.k)}</div>`
        : `<div class="slot empty">+</div>`
    ).join('');
    const teamBlock = `<div class="b-team-slots">${boxes}</div>`;
    return ti === 0 ? teamBlock : `<span class="b-vs">VS</span>${teamBlock}`;
  }).join('');
}

function caseStrip(b) {
  const keys = Object.keys(CASE_TYPES);
  return b.cases.map((k) => {
    const pal = CASE_PALETTES[keys.indexOf(k)];
    return `<div class="case-tile" style="--c:${caseAccent(k) || PAL_COLORS[pal]}">${caseArt(k, keys)}</div>`;
  }).join('');
}

function battleRowInner(b) {
  const m = MODES[b.mode];
  const cost = battleCost(b);
  const pot = battlePot(b);
  const full = isFull(b);
  const mine = battleHasUser(b);
  let action;
  if (full) action = `<button class="btn btn-view" data-view="${b.id}">Watch Battle</button>`;
  else if (mine) action = `${isOwner(b) ? `<button class="btn btn-primary" data-bot="${b.id}">Call Bot</button>` : ''}<button class="btn-call" data-leave="${b.id}">Leave &amp; Refund</button>`;
  else action = `<button class="btn btn-primary" data-join="${b.id}">Join Battle</button>`;
  return `
    <div class="b-team">
      <div class="b-mode"><span class="b-pill" style="color:${m.color}">${m.label}</span>${b.type === 'jackpot' ? '<span class="b-jack" title="Jackpot — winner takes all"><svg viewBox="0 0 24 24" width="13" height="13"><use href="#target"/></svg></span>' : ''}</div>
      <div class="b-slots">${slotBoxes(b)}</div>
    </div>
    <div class="b-cases">
      <span class="b-badge" title="players joined / total">${battleFilled(b)}/${battleSlots(b)}</span>
      ${caseStrip(b)}
    </div>
    <div class="b-right">
      ${full
        ? `<div class="pot"><svg viewBox="0 0 24 24" width="18" height="18"><use href="#coin"/></svg><b>${fmt(pot)}</b></div><div class="pot-label">TOTAL POT</div>`
        : `<div class="pot"><svg viewBox="0 0 24 24" width="18" height="18"><use href="#coin"/></svg><b>${fmt(cost)}</b></div><div class="pot-label">BATTLE COST</div>`}
    </div>
    <div class="b-action">
      ${action}
      <div class="b-status">${full ? 'battle ready' : 'waiting for players'}</div>
    </div>`;
}

function renderBattles() {
  battles = battles.filter(validBattle);
  const host = $('#battleList');
  if (!battles.length) {
    host.innerHTML = `<div class="battle-empty">
        <p>No open battles right now</p>
        <span>Create one — it only takes a few seconds.</span>
      </div>`;
    return;
  }
  // keyed diff-render: this list re-renders every 2s from the poll, so rebuilding
  // the whole innerHTML each time would reset any row a player is mid-hover on,
  // cancel in-flight CSS transitions, and make every battle "jump" every 2 seconds.
  // instead we keep existing row elements alive, only touch ones whose content
  // actually changed, and only animate rows that are genuinely new.
  const seen = new Set();
  let prevEl = null;
  battles.forEach((b) => {
    const id = String(b.id);
    seen.add(id);
    const html = battleRowInner(b);
    let row = host.querySelector(`.battle-row[data-bid="${id}"]`);
    if (row) {
      if (row.__sig !== html) { row.innerHTML = html; row.__sig = html; }
    } else {
      row = document.createElement('div');
      row.className = 'battle-row row-enter';
      row.dataset.bid = id;
      row.innerHTML = html;
      row.__sig = html;
      row.addEventListener('animationend', () => row.classList.remove('row-enter'), { once: true });
    }
    if (prevEl ? prevEl.nextElementSibling !== row : host.firstElementChild !== row) {
      host.insertBefore(row, prevEl ? prevEl.nextElementSibling : host.firstElementChild);
    }
    prevEl = row;
  });
  host.querySelectorAll('.battle-row').forEach((el) => { if (!seen.has(el.dataset.bid)) el.remove(); });
}

const battlesVisible = () => !$('#view-battles').hidden;
function renderBattlesIfVisible() {
  if (battlesVisible()) renderBattles();
}

function renderHomeHighlights() {
  const host = $('#homeHighlights');
  if (!host) return;
  const top = battles.filter(validBattle).slice().sort((a, b) => battleCost(b) - battleCost(a)).slice(0, 3);
  if (!top.length) { host.innerHTML = ''; return; }
  host.innerHTML = top.map((b) => `
    <div class="battle-row hl-row">
      <div class="b-team">
        <div class="b-slots">${slotBoxes(b)}</div>
      </div>
      <div class="b-cases">
        <span class="b-badge" title="players joined / total">${battleFilled(b)}/${battleSlots(b)}</span>
        ${caseStrip(b)}
      </div>
      <div class="b-right">
        <div class="pot"><svg viewBox="0 0 24 24" width="18" height="18"><use href="#coin"/></svg><b>${fmt(battleCost(b))}</b></div>
        <div class="pot-label">BATTLE COST</div>
      </div>
      <div class="b-action">
        <a class="btn btn-primary" href="#/case-battles">View Battle</a>
      </div>
    </div>`).join('');
}

async function joinBattle(id) {
  const b = battles.find((x) => x.id === id);
  if (!b || isFull(b)) return;
  if (!currentUser) { openAuth('signin'); toast('Sign in to join battles!'); return; }
  const cost = battleCost(b);
  if (currentUser.balance < cost) { toast('Not enough coins — deposit first!'); openDeposit(); return; }
  setBalance(currentUser.balance - cost);
  try {
    const sb = await Api.joinBattle(id, currentUser.name);
    const hydrated = hydrateBattle(sb);
    const idx = battles.findIndex((x) => x.id === id);
    if (idx > -1) battles[idx] = hydrated; else battles.unshift(hydrated);
    toast(`Joined ${MODES[b.mode].label} battle for ${fmt(cost)} coins!`);
    // jump straight into the battle viewer instead of leaving them on the list
    openBattleViewer(hydrated);
  } catch (e) {
    addBalance(cost);
    toast('That battle just filled up or was cancelled — try another one.');
    refreshBattles();
  }
}

/* battles now sync from the shared server every 2s — no bots */
setInterval(refreshBattles, 2000);

/* ---------- create battle page ---------- */
let selMode = '1v1';
let selType = 'normal';
let selCases = [];
const PAL_COLORS = { blue: '#3b8bff', pink: '#f04ec0', green: '#3ecf7a', cyan: '#39c8f0', gold: '#f6a821', red: '#e64545', purple: '#9257f0' };

function renderCbCases() {
  const q = ($('#caseSearch').value || '').trim().toLowerCase();
  const keys = Object.keys(CASE_TYPES);
  $('#cbCases').innerHTML = Object.entries(CASE_TYPES)
    .filter(([k, c]) => !q || c.name.toLowerCase().includes(q))
    .map(([k, c]) => {
      const cnt = selCases.filter((x) => x === k).length;
      const pal = CASE_PALETTES[keys.indexOf(k)];
      return `
      <button class="ac-card" data-add="${k}" style="--c:${caseAccent(k) || PAL_COLORS[pal]}">
        ${cnt ? `<span class="cb-count">${cnt}</span>` : ''}
        ${caseArt(k, keys)}
        <span class="a-name">${c.name}</span>
        <span class="ac-line"></span>
        <span class="ac-add"><svg viewBox="0 0 24 24" width="11" height="11"><use href="#coin"/></svg> ${fmt(c.price)}</span>
      </button>`;
    }).join('') || `<div class="pv-empty">No cases match your search</div>`;
  $('#acCount').textContent = selCases.length === 1 ? '1 case' : selCases.length + ' cases';
  $('#acTotal').textContent = fmt(selCases.reduce((s, k) => s + CASE_TYPES[k].price, 0));
}

function renderPv() {
  const m = MODES[selMode];
  let teamsHtml = '';
  for (let t = 0; t < m.teams; t++) {
    const slots = Array.from({ length: m.per }, (_, i) =>
      t === 0 && i === 0
        ? `<div class="pv-slot you">${currentUser ? avatarSVG(avatarFor(currentUser.name)) : '+'}<span>You</span></div>`
        : `<div class="pv-slot">+<span>Open</span></div>`
    ).join('');
    teamsHtml += `<div class="pv-team">${slots}</div>`;
    if (t < m.teams - 1) teamsHtml += `<div class="pv-vs">VS</div>`;
  }
  $('#pvTeams').innerHTML = teamsHtml;

  const keys = Object.keys(CASE_TYPES);
  $('#pvCases').innerHTML = `<button class="cbp-add" id="openAddCases"><span class="cbp-add-inner"><svg viewBox="0 0 24 24" width="12" height="12"><use href="#plus"/></svg> Add Cases</span></button>` +
    (selCases.length
      ? selCases.map((k) => `
          <button class="cbp-round" data-k="${k}" title="Remove this round">
            ${caseArt(k, keys)}
            <span class="r-name">${CASE_TYPES[k].name}</span>
            <span class="r-price"><svg viewBox="0 0 24 24" width="11" height="11"><use href="#coin"/></svg>${CASE_TYPES[k].price}</span>
          </button>`).join('')
      : `<div class="cbp-empty-hint">Pick cases to build your battle</div>`);
  $('#pvRounds') && ($('#pvRounds').textContent = `${selCases.length} round${selCases.length === 1 ? '' : 's'}`);

  const cost = selCases.reduce((s, k) => s + CASE_TYPES[k].price, 0);
  const per = m.teams * m.per;
  $('#createCost').textContent = fmt(cost);
  $('#createBalance').textContent = currentUser ? fmt(currentUser.balance) : '—';
  const pt = $('#pvType');
  if (pt) pt.textContent = selType === 'jackpot' ? 'Jackpot' : 'Normal';
  const miniR = $('#cbMiniRounds');
  if (miniR) miniR.textContent = selCases.length;
  const miniC = $('#cbMiniCost');
  if (miniC) miniC.textContent = fmt(cost);
  const mLabel = $('#modeLabel');
  if (mLabel) mLabel.textContent = m.label;
}

function openCases() {
  renderCbCases();
  $('#casesModal').classList.add('open');
  setTimeout(() => $('#casesClose').focus(), 150);
}

function openCreate() {
  if (!currentUser) { openAuth('signup'); toast('Create an account to host battles!'); return; }
  selMode = '1v1';
  selCases = [];
  $('#caseSearch').value = '';
  $$('.type-chip').forEach((t) => t.classList.toggle('active', t.dataset.type === 'normal'));
  $$('.mode-chip').forEach((c) => c.classList.toggle('active', c.dataset.mode === selMode));
  location.hash = '#/create-battle';
}

async function createBattle() {
  if (!selCases.length) { toast('Add at least one case!'); return; }
  const m = MODES[selMode];
  const cost = selCases.reduce((s, k) => s + CASE_TYPES[k].price, 0);
  if (currentUser.balance < cost) { toast('Not enough coins — deposit first!'); openDeposit(); return; }
  setBalance(currentUser.balance - cost);
  try {
    const sb = await Api.createBattle({ mode: selMode, type: selType, cases: [...selCases], name: currentUser.name });
    const b = hydrateBattle(sb);
    battles.unshift(b);
    location.hash = '#/battle/' + b.id;
    renderRoute();
    systemMsg(`${currentUser.name} created a ${m.label} battle — waiting for players…`);
    toast(`Battle created for ${fmt(cost)} coins — waiting for real players to join!`);
  } catch (e) {
    addBalance(cost);
    toast('Could not create the battle — try again.');
  }
}

/* ---------- call bot (fills an empty slot so a battle doesn't sit forever) ---------- */
function pickBotName(b) {
  const used = new Set(b.teams.flat().filter(Boolean).map((p) => p.n || p));
  const free = BOTS.map((x) => x.n).filter((n) => !used.has(n));
  if (free.length) return free[Math.floor(Math.random() * free.length)];
  // ran out of the preset bot roster — make up a fresh one
  let n;
  do { n = 'bot_' + Math.random().toString(36).slice(2, 6); } while (used.has(n));
  return n;
}

async function callBot(id) {
  const b = battles.find((x) => x.id === id);
  if (!b || isFull(b)) return;
  const botName = pickBotName(b);
  try {
    const sb = await Api.joinBattle(id, botName);
    const hydrated = hydrateBattle(sb);
    const idx = battles.findIndex((x) => x.id === id);
    if (idx > -1) battles[idx] = hydrated; else battles.unshift(hydrated);
    if (viewerB && viewerB.id === id) { viewerB = hydrated; renderLive(hydrated); }
    renderBattlesIfVisible();
    systemMsg(`${botName} joined the battle.`);
  } catch (e) {
    toast('Could not call a bot right now — try again.');
  }
}

async function leaveBattle(id) {
  const b = battles.find((x) => x.id === id);
  if (!b || !currentUser) return;
  const cost = battleCost(b);
  try {
    await Api.leaveBattle(id, currentUser.name);
    addBalance(cost, `Left the battle — ${fmt(cost)} coins refunded.`);
    await refreshBattles();
    toast('Left the battle — coins refunded.');
  } catch (e) {
    toast('Could not leave that battle.');
  }
}

/* ---------- view battle modal ---------- */
function openView(id) {
  const b = battles.find((x) => x.id === id);
  if (!b) return;
  const m = MODES[b.mode];
  const teamsHtml = b.teams.map((team, ti) => `
    <div class="vm-team">
      <h4 style="color:${m.color}">TEAM ${ti + 1}</h4>
      ${team.map((p) => p
        ? `<div class="vm-player ${p.you ? 'you' : ''}"><span class="avatar">${avatarSVG(p.k)}</span>${p.you ? 'You' : p.n}</div>`
        : `<div class="vm-player empty-p"><span class="avatar">?</span>Waiting…</div>`).join('')}
    </div>`).join('');
  const casesHtml = b.cases.map((k) => {
    const i = Object.keys(CASE_TYPES).indexOf(k);
    return `<div class="vm-case">
      ${caseArt(k, Object.keys(CASE_TYPES))}
      <span>${CASE_TYPES[k].name}</span><em>${CASE_TYPES[k].price}</em>
    </div>`;
  }).join('');
  $('#viewBody').innerHTML = `
    <div class="vm-head"><span class="vm-mode" style="color:${m.color}">${m.icon} ${m.label}</span><h2>Battle #${b.id}</h2></div>
    <div class="vm-teams">${teamsHtml}</div>
    <div class="vm-cases">${casesHtml}</div>
    <div class="vm-foot">
      <span>Total pot <b>${fmt(battlePot(b))}</b></span>
      <span>Cost per player <b>${fmt(battleCost(b))}</b></span>
      <span>${battleFilled(b)}/${battleSlots(b)} players</span>
    </div>`;
  $('#viewModal').classList.add('open');
  setTimeout(() => $('#viewClose').focus(), 150);
}

/* ---------- router ---------- */
function renderRoute() {
  const h = location.hash || '#/home';
  const liveId = h.startsWith('#/battle/') ? Number(h.split('/')[2]) : null;
  $('#view-home').hidden = !h.startsWith('#/home');
  if (h.startsWith('#/home')) renderHomeHighlights();
  $('#view-battles').hidden = h !== '#/case-battles';
  $('#view-blackjack').hidden = h !== '#/blackjack';
  $('#view-create').hidden = h !== '#/create-battle';
  $('#view-live').hidden = liveId === null;
  if (h === '#/case-battles') renderBattles();
  if (h === '#/create-battle') { renderCbCases(); renderPv(); }
  if (liveId !== null) {
    var b = (viewerB && viewerB.id === liveId) ? viewerB : battles.find(function (x) { return x.id === liveId; });
    if (!b && finishedBattles[liveId]) { renderRecap(liveId); window.scrollTo(0, 0); return; }
    if (!b) { location.hash = '#/case-battles'; return; }
    viewerB = b; // the viewer must own the battle or the spin loop aborts
    if (!b.played) renderLive(b);
  }
  window.scrollTo(0, 0);
}
window.addEventListener('hashchange', renderRoute);

/* ================================================================
   NAV / AUTH / CHAT / RAIN
   ================================================================ */
function renderNav() {
  const host = $('#navAuth');
  if (currentUser) {
    host.innerHTML = `
      <button class="balance-pill" id="balancePill" title="Your balance — click to deposit">
        <svg class="pill-coin" viewBox="0 0 24 24" width="22" height="22"><use href="#coin"/></svg>
        <b id="balanceValue">0.00</b>
      </button>
      <div class="user-menu">
        <button class="user-chip" id="userChip">
          <span class="user-avatar">${avatarSVG(avatarFor(currentUser.name))}</span>
          <span class="user-name">${currentUser.name}</span>
          <span class="chev-svg" ><svg viewBox="0 0 24 24" width="10" height="10"><use href="#chev-d"/></svg></span>
        </button>
        <div class="dropdown user-dropdown" id="userDropdown">
          <a href="#" id="depositLink"><svg class="d-ico" viewBox="0 0 24 24" width="14" height="14"><use href="#coin"/></svg> Deposit</a>
          <a href="#" id="logoutLink"><svg class="d-ico" viewBox="0 0 24 24" width="14" height="14"><use href="#exit"/></svg> Log out</a>
        </div>
      </div>`;
    shownBalance = 0;
    renderBalance(false);
    $('#balancePill').addEventListener('click', openDeposit);
    $('#userChip').addEventListener('click', (e) => {
      e.stopPropagation();
      $('#userDropdown').classList.toggle('open');
    });
    $('#depositLink').addEventListener('click', (e) => { e.preventDefault(); openDeposit(); });
    $('#logoutLink').addEventListener('click', (e) => {
      e.preventDefault();
      currentUser = null;
      store.setSession(null);
      renderNav();
      toast('Logged out. See you soon!');
    });
  } else {
    host.innerHTML = `
      <button class="btn btn-ghost" id="signInNav">Sign In</button>
      <button class="btn btn-primary" id="signUpNav">Sign Up</button>`;
    $('#signInNav').addEventListener('click', () => openAuth('signin'));
    $('#signUpNav').addEventListener('click', () => openAuth('signup'));
  }
  updateChatInput();
  if (!$('#view-create').hidden) renderPv();
}

document.addEventListener('click', (e) => {
  const dd = $('#userDropdown');
  if (dd && dd.classList.contains('open') && !e.target.closest('.user-menu')) dd.classList.remove('open');
});

/* ---------- auth modal ---------- */
let authMode = 'signin';
function openAuth(mode = 'signin') {
  authMode = mode;
  $('#authError').textContent = '';
  $('#authUser').value = '';
  $('#authPass').value = '';
  syncAuthUI();
  $('#authModal').classList.add('open');
  setTimeout(() => $('#authUser').focus(), 150);
}
function syncAuthUI() {
  $$('.auth-tab').forEach((b) => b.classList.toggle('active', b.dataset.tab === authMode));
  $('#authTitle').textContent = authMode === 'signup' ? 'Create your account' : 'Welcome back';
  $('#authHint').textContent = authMode === 'signup'
    ? 'Create a free account and get 100.00 coins to start playing.'
    : 'Sign in to pick up right where you left off.';
  $('#authSubmit').textContent = authMode === 'signup' ? 'Create Account' : 'Sign In';
}
function authFail(msg) { $('#authError').textContent = msg; }

function submitAuth() {
  const name = $('#authUser').value.trim();
  const pass = $('#authPass').value;
  if (!/^[A-Za-z0-9_]{3,16}$/.test(name)) return authFail('Username must be 3–16 letters, numbers or _');
  if (pass.length < 4) return authFail('Password must be at least 4 characters');
  const users = store.users();
  if (authMode === 'signup') {
    if (users[name]) return authFail('That username is already taken');
    users[name] = { pass, balance: 100, created: Date.now() };
    store.saveUsers(users);
    currentUser = { name, ...users[name] };
    store.setSession(name);
    $('#authModal').classList.remove('open');
    renderNav();
    shownBalance = 0;
    renderBalance(true);
    renderPv();
    toast(`Welcome to RBXWIN, ${name}! 100.00 coins credited`);
    systemMsg(`${name} just joined — say hi!`);
  } else {
    const u = users[name];
    if (!u || u.pass !== pass) return authFail('Wrong username or password');
    currentUser = { name, ...u };
    store.setSession(name);
    $('#authModal').classList.remove('open');
    renderNav();
    toast(`Welcome back, ${name}!`);
    systemMsg(`${name} signed in.`);
  }
}

/* ---------- deposit modal ---------- */
function openDeposit() {
  if (!currentUser) return openAuth('signup');
  $('#depositModal').classList.add('open');
  setTimeout(() => $('#depositClose').focus(), 150);
}

/* ---------- chat ---------- */
const chat = $('#chat');
function addMessage({ av, n, system = false, sys = false, color = '', icon = '', level = '', text = '' }) {
  const el = document.createElement('div');
  el.className = 'msg';
  const prefix = system || sys ? '<svg class="check-svg" viewBox="0 0 24 24" width="11" height="11"><use href="#check"/></svg>' : (icon ? `<span class="msg-icon">${icon}</span>` : '');
  el.innerHTML = `
    <div class="avatar">${avatarSVG(av || avatarFor(n))}</div>
    <div class="msg-body">
      <div class="msg-top">${prefix}<b class="name ${system || sys ? 'system' : ''} ${color}"></b>${level ? `<span class="level">${level}</span>` : ''}</div>
      <div class="msg-text"></div>
    </div>
    <button class="msg-menu">⋯</button>`;
  el.querySelector('.name').textContent = n;
  el.querySelector('.msg-text').textContent = text;
  chat.appendChild(el);
  while (chat.children.length > 40) chat.firstChild.remove();
  chat.scrollTop = chat.scrollHeight;
}

function systemMsg(text) {
  const msg = { av: 'trump', n: 'System', system: true, sys: true, text };
  addMessage(msg);
  Api.postChat(msg).catch(() => {});
}

let lastChatId = 0;
async function pollChat() {
  try {
    const { messages } = await Api.getChat(lastChatId);
    messages.forEach((m) => { addMessage(m); lastChatId = Math.max(lastChatId, m.id); });
  } catch (e) {}
}

function updateChatInput() {
  const inp = $('#chatMsg');
  const btn = $('#chatSend');
  if (currentUser) {
    inp.disabled = false;
    btn.disabled = false;
    inp.placeholder = `Message chat as ${currentUser.name}…`;
  } else {
    inp.disabled = true;
    btn.disabled = true;
    inp.value = '';
    inp.placeholder = 'Sign in to chat…';
  }
}

async function sendChat() {
  const inp = $('#chatMsg');
  const text = inp.value.trim();
  if (!text || !currentUser) return;
  inp.value = '';
  try {
    const msg = await Api.postChat({ av: avatarFor(currentUser.name), n: currentUser.name, text });
    addMessage(msg);
    lastChatId = Math.max(lastChatId, msg.id);
  } catch (e) {
    toast('Message failed to send — check the server.');
  }
}

/* ---------- hourly rain ---------- */
let rainSeconds = 60;
let rainJoined = false;
setInterval(() => {
  rainSeconds -= 1;
  const t = $('#rainTimer');
  if (t) t.textContent = `${Math.floor(rainSeconds / 60)}:${String(rainSeconds % 60).padStart(2, '0')}`;
  if (rainSeconds <= 0) {
    if (rainJoined && currentUser) {
      const win = 2 + Math.random() * 13;
      addBalance(win);
      addMessage({ av: 'trump', n: 'System', system: true, sys: true, text: `Rain paid out ${fmt(win)} coins to you!` });
    } else {
      addMessage({ av: 'trump', n: 'System', system: true, sys: true, text: 'Rain cancelled! Minimum of 3 participants required (Only 0 joined).' });
    }
    rainJoined = false;
    const btn = $('#joinRainBtn');
    btn.classList.remove('joined');
    btn.textContent = 'Join Rain';
    rainSeconds = 60;
  }
}, 1000);

/* ---------- chat now syncs from the server ---------- */
setInterval(pollChat, 1500);

/* ================================================================
   INIT & WIRING
   ================================================================ */
async function initPage() {
  try {
  if (window.__wired) return;
  window.__wired = true;
  window.__steps = ['start'];
  loadSession();
  renderNav();
  renderRoute();
  refreshBattles();
  pollChat();
  window.__steps.push('renders');
  renderCbCases();
  renderPv();
  window.__steps.push('renders-done');

  window.__steps.push('wiring-start');
  // games dropdown
  const gamesBtn = $('#gamesBtn');
  const dropdown = $('#gamesDropdown');
  gamesBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('open');
    gamesBtn.classList.toggle('active');
  });
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) dropdown.classList.remove('open');
  });

  // auth modal
  $$('.auth-tab').forEach((b) => b.addEventListener('click', () => { authMode = b.dataset.tab; $('#authError').textContent = ''; syncAuthUI(); }));
  $('#authSubmit').addEventListener('click', submitAuth);
  $('#authUser').addEventListener('keydown', (e) => { if (e.key === 'Enter') $('#authPass').focus(); });
  $('#authPass').addEventListener('keydown', (e) => { if (e.key === 'Enter') submitAuth(); });
  $('#authClose').addEventListener('click', () => $('#authModal').classList.remove('open'));
  $('#authModal').addEventListener('click', (e) => { if (e.target === $('#authModal')) $('#authModal').classList.remove('open'); });

  // deposit modal
  $('#depositClose').addEventListener('click', () => $('#depositModal').classList.remove('open'));
  $('#depositModal').addEventListener('click', (e) => { if (e.target === $('#depositModal')) $('#depositModal').classList.remove('open'); });
  $$('.deposit-option').forEach((b) => b.addEventListener('click', () => {
    const amount = Number(b.dataset.amount);
    addBalance(amount, `Deposit of ${fmt(amount)} coins credited.`);
    $('#depositModal').classList.remove('open');
    renderPv();
    toast(`+${fmt(amount)} coins added!`);
  }));

  // create battle page
  $('#createBattleBtn').addEventListener('click', openCreate);
  $$('.type-chip').forEach((c) => c.addEventListener('click', () => {
    selType = c.dataset.type;
    $$('.type-chip').forEach((x) => x.classList.toggle('active', x === c));
    renderPv();
  }));

  // mode dropdown
  const modeDD = $('#modeDD');
  $('#modeBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    $('#modeMenu').classList.toggle('open');
  });
  $('#modeMenu').addEventListener('click', (e) => {
    const item = e.target.closest('[data-mode]');
    if (!item) return;
    selMode = item.dataset.mode;
    $('#modeMenu').classList.remove('open');
    renderPv();
  });
  document.addEventListener('click', (e) => {
    if (!modeDD.contains(e.target)) $('#modeMenu').classList.remove('open');
  });
  $('#caseSearch').addEventListener('input', renderCbCases);
  $('#cbCases').addEventListener('click', (e) => {
    const c = e.target.closest('[data-add]');
    if (!c) return;
    if (selCases.length >= 10) { toast('Max 10 cases per battle'); return; }
    selCases.push(c.dataset.add);
    renderCbCases();
    renderPv();
  });
  $('#pvCases').addEventListener('click', (e) => {
    if (e.target.closest('.cbp-add')) { openCases(); return; }
    const ch = e.target.closest('.cbp-round');
    if (!ch) return;
    const i = selCases.lastIndexOf(ch.dataset.k);
    if (i > -1) selCases.splice(i, 1);
    renderCbCases();
    renderPv();
  });
  $('#createGo').addEventListener('click', createBattle);

  // add cases modal
  $('#casesClose').addEventListener('click', () => $('#casesModal').classList.remove('open'));
  $('#acCancel').addEventListener('click', () => $('#casesModal').classList.remove('open'));
  $('#acDone').addEventListener('click', () => $('#casesModal').classList.remove('open'));
  $('#casesModal').addEventListener('click', (e) => { if (e.target === $('#casesModal')) $('#casesModal').classList.remove('open'); });

  // view battle modal
  $('#viewClose').addEventListener('click', () => $('#viewModal').classList.remove('open'));
  $('#viewModal').addEventListener('click', (e) => { if (e.target === $('#viewModal')) $('#viewModal').classList.remove('open'); });

  // battle list actions
  $('#battleList').addEventListener('click', (e) => {
    const join = e.target.closest('[data-join]');
    if (join) return joinBattle(Number(join.dataset.join));
    const leave = e.target.closest('[data-leave]');
    if (leave) return leaveBattle(Number(leave.dataset.leave));
    const bot = e.target.closest('[data-bot]');
    if (bot) return callBot(Number(bot.dataset.bot));
    const view = e.target.closest('[data-view]');
    if (view) {
      const b = battles.find((x) => x.id === Number(view.dataset.view));
      if (b && isFull(b)) return openBattleViewer(b);
      return toast('That battle already finished!');
    }
  });

  // promo CTA
  $('#promoCta').addEventListener('click', () => {
    if (currentUser) openDeposit();
    else { openAuth('signup'); toast('Create an account to claim your free coins!'); }
  });

  // live unbox feed
  const lfRow = document.getElementById('liveFeed');
  if (lfRow) {
    const lfUsers = ['trump', 'noko', 'blurple', 'milo', 'skinz', 'moonboi', 'kk_z', 'vex', 'zeph', 'runnerup'];
    const lfRender = () => {
      const allItems = [];
      Object.keys(ITEM_POOLS).forEach((k) => ITEM_POOLS[k].forEach((it) => { if (!it.token) allItems.push(it); }));
      const it = allItems[Math.floor(Math.random() * allItems.length)];
      const user = lfUsers[Math.floor(Math.random() * lfUsers.length)];
      const card = document.createElement('div');
      card.className = 'lf-card';
      card.innerHTML = '<span class="lf-av">' + avatarSVG(user) + '</span>' +
        '<span class="lf-info"><span class="lf-item">' + it.name + '</span>' +
        '<span class="lf-val"><svg viewBox="0 0 24 24"><use href="#coin"/></svg>' + fmt(it.v) + '</span>' +
        '<span class="lf-user">' + user + ' unboxed</span></span>';
      card.style.opacity = '0';
      lfRow.prepend(card);
      requestAnimationFrame(() => { card.style.transition = 'opacity .4s'; card.style.opacity = '1'; });
      while (lfRow.children.length > 4) lfRow.lastElementChild.remove();
    };
    for (let i = 0; i < 4; i++) lfRender();
    setInterval(() => {
      const home = document.getElementById('view-home');
      if (home && !home.hidden) lfRender();
    }, 2600);
  }

  // rotating promo slides
  const promoSlides = document.querySelectorAll('#promoSlides .promo-slide');
  const promoDots = document.querySelectorAll('#promoDots .promo-dot');
  let promoIdx = 0;
  const showPromo = (n) => {
    promoIdx = (n + promoSlides.length) % promoSlides.length;
    promoSlides.forEach((el, i) => el.classList.toggle('active', i === promoIdx));
    promoDots.forEach((el, i) => el.classList.toggle('active', i === promoIdx));
  };
  promoDots.forEach((d) => d.addEventListener('click', () => { showPromo(+d.dataset.dot); }));
  setInterval(() => showPromo(promoIdx + 1), 5000);

  // rain
  $('#joinRainBtn').addEventListener('click', () => {
    if (!currentUser) { openAuth('signin'); toast('Sign in to join the rain!'); return; }
    if (rainJoined) return;
    rainJoined = true;
    const btn = $('#joinRainBtn');
    btn.classList.add('joined');
    btn.textContent = 'Joined';
    addMessage({ av: 'trump', n: 'System', system: true, sys: true, text: 'You joined the hourly rain! Payout in a minute.' });
  });
  $('#rainInfoBtn').addEventListener('click', () => toast('Hourly rain pot: 100.00 coins. Join for a chance to win!'));

  // chat
  $('#chatSend').addEventListener('click', sendChat);
  $('#chatMsg').addEventListener('keydown', (e) => { if (e.key === 'Enter') sendChat(); });

  // game cards
  $$('.game-card').forEach((card) => card.addEventListener('click', () => {
    if (card.classList.contains('locked')) return;
    if (card.dataset.game === 'Case Battles') { location.hash = '#/case-battles'; return; }
    if (card.dataset.game === 'Blackjack') { location.hash = '#/blackjack'; return; }
    if (!currentUser) { openAuth('signin'); toast('Sign in to start playing!'); return; }
    toast(`${card.dataset.game} — playable games are coming next!`);
  }));

  // ============ BLACKJACK ============
  (function () {
    const bjBet = $('#bjBetInput');
    if (!bjBet) return;
    const bjBetWrap = bjBet.closest('.bj-bet-input');

    const validateBet = () => {
      if (inRound) { bjBetWrap.classList.remove('invalid'); return; }
      const amt = parseFloat(bjBet.value);
      const bal = currentUser ? currentUser.balance * 0.002 : 0;
      bjBetWrap.classList.toggle('invalid', !!(currentUser && amt > 0 && amt > bal));
    };
    bjBet.addEventListener('input', validateBet);

    $$('.bj-quick button').forEach((btn) => btn.addEventListener('click', () => {
      const bal = currentUser ? currentUser.balance * 0.002 : 0;
      const cur = parseFloat(bjBet.value) || 0;
      const f = btn.dataset.frac;
      if (f === 'max') bjBet.value = bal.toFixed(2);
      else if (f === '2') bjBet.value = Math.min(cur * 2 || bal, bal).toFixed(2);
      else bjBet.value = (cur * 0.5).toFixed(2);
      validateBet();
    }));

    const SUITS = [
      { k: 'S', color: 'black', path: 'M12 2c-2.2 3-6 5.6-6 9.2 0 2.4 1.8 4 4 4 .8 0 1.5-.2 2-.6-.3 2-1 3.2-2.4 4.4h8.8c-1.4-1.2-2.1-2.4-2.4-4.4.5.4 1.2.6 2 .6 2.2 0 4-1.6 4-4C22 7.6 18.2 5 16 2c0 0-2-1.2-4 0Z' },
      { k: 'H', color: 'red', path: 'M12 20 3.5 12.4C1 10.1 1 6.4 3.5 4.3 6 2.2 9.6 2.8 12 5.6 14.4 2.8 18 2.2 20.5 4.3 23 6.4 23 10.1 20.5 12.4L12 20Z' },
      { k: 'D', color: 'red', path: 'M12 2 20 12 12 22 4 12 12 2Z' },
      { k: 'C', color: 'black', path: 'M12 2a3.6 3.6 0 0 0-3.4 4.9A3.6 3.6 0 1 0 6 13.4c.6 0 1.1-.1 1.6-.4-.3 2-1 3.2-2.4 4.4h8.8c-1.4-1.2-2.1-2.4-2.4-4.4.5.3 1 .4 1.6.4a3.6 3.6 0 1 0-2.6-6.5A3.6 3.6 0 0 0 12 2Z' }
    ];
    const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

    let shoe = [];
    const freshShoe = () => {
      const d = [];
      for (let deckN = 0; deckN < 6; deckN++) {
        SUITS.forEach((s) => RANKS.forEach((r) => d.push({ r, s: s.k, color: s.color })));
      }
      for (let i = d.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [d[i], d[j]] = [d[j], d[i]];
      }
      return d;
    };
    const draw = () => {
      if (shoe.length < 20) shoe = freshShoe();
      return shoe.pop();
    };

    const rankValue = (r) => (r === 'A' ? 11 : ['J', 'Q', 'K'].includes(r) ? 10 : parseInt(r, 10));
    const handTotal = (cards) => {
      let total = 0, aces = 0;
      cards.forEach((c) => { total += rankValue(c.r); if (c.r === 'A') aces++; });
      while (total > 21 && aces > 0) { total -= 10; aces--; }
      return { total, soft: aces > 0 };
    };
    const isBlackjack = (cards) => cards.length === 2 && handTotal(cards).total === 21;

    const cardHTML = (card, hidden, isNew, isFlip) => {
      if (hidden) return '<div class="bjc hidden' + (isNew ? ' new' : '') + '"></div>';
      const suit = SUITS.find((s) => s.k === card.s);
      return '<div class="bjc ' + suit.color + (isNew ? ' new' : '') + (isFlip ? ' flip' : '') + '">' +
        '<span class="r">' + card.r + '</span>' +
        '<svg class="s" viewBox="0 0 24 24"><path fill="currentColor" d="' + suit.path + '"/></svg>' +
        '<span class="r" style="align-self:flex-end;transform:rotate(180deg)">' + card.r + '</span>' +
        '</div>';
    };

    let hands = [];      // [{cards:[], bet:0, doubled:false, status:'active'}]
    let dealer = [];
    let active = 0;
    let dealerHoleHidden = true;
    let dealerHoleWasHidden = true;
    let dealerRendered = 0;
    let inRound = false;

    const rawBet = (displayAmt) => Math.round((displayAmt / 0.002) * 100) / 100;

    const setButtons = () => {
      const h = hands[active];
      const canAct = inRound && h && h.status === 'active';
      $('#bjHit').disabled = !canAct;
      $('#bjStand').disabled = !canAct;
      const balRaw = currentUser ? currentUser.balance : 0;
      $('#bjDouble').disabled = !(canAct && hands.length === 1 && h.cards.length === 2 && !h.doubled && balRaw >= h.bet);
      $('#bjSplit').disabled = !(canAct && hands.length === 1 && h.cards.length === 2 &&
        h.cards[0].r === h.cards[1].r && balRaw >= h.bet);
      $('#bjStart').disabled = inRound;
      bjBet.disabled = inRound;
    };

    const renderTable = () => {
      const dTot = dealer.length ? handTotal(dealerHoleHidden ? [dealer[0]] : dealer) : { total: 0, soft: false };
      $('#bjDealerTotal').textContent = (dealerHoleHidden || !dealer.length) ? '' : ('(' + dTot.total + (dTot.soft ? ' soft' : '') + ')');
      const revealingHole = dealerHoleWasHidden && !dealerHoleHidden && dealer.length > 1;
      $('#bjDealerHand').innerHTML = dealer.map((c, i) => cardHTML(c, dealerHoleHidden && i === 1, i >= dealerRendered, i === 1 && revealingHole)).join('');
      dealerRendered = dealer.length;
      dealerHoleWasHidden = dealerHoleHidden;

      const area = $('#bjPlayerArea');
      area.innerHTML = hands.map((h, i) => {
        const t = handTotal(h.cards);
        let stateClass = '';
        if (h.status === 'bust') stateClass = 'bust';
        else if (h.result === 'win') stateClass = h.blackjackWin ? 'blackjack' : 'win';
        else if (h.result === 'push') stateClass = 'push';
        const label = hands.length > 1 ? 'Hand ' + (i + 1) : 'You';
        const outcome = h.status === 'bust' ? 'Bust' : h.result === 'win' ? (h.blackjackWin ? 'Blackjack!' : 'Win') : h.result === 'push' ? 'Push' : h.result === 'lose' ? 'Lose' : '';
        return '<div class="bj-hand-block ' + stateClass + (i === active && inRound && h.status === 'active' ? ' active' : '') + '">' +
          '<div class="bj-hand-label">' + label + ' <span class="bj-total">' + t.total + (t.soft && t.total <= 21 ? ' soft' : '') + '</span></div>' +
          '<div class="bj-hand">' + h.cards.map((c, ci) => cardHTML(c, false, ci >= h.renderedCount)).join('') + '</div>' +
          '<div class="bj-outcome">' + outcome + '</div>' +
          '</div>';
      }).join('');
      hands.forEach((h) => { h.renderedCount = h.cards.length; });
      setButtons();
    };

    const showResult = (title, sub, kind) => {
      const el = $('#bjResult');
      el.className = 'bj-result' + (kind ? ' ' + kind : '');
      el.innerHTML = '<h4>' + title + '</h4><span>' + sub + '</span>';
      el.hidden = false;
      requestAnimationFrame(() => el.classList.add('show'));
      setTimeout(() => { el.classList.remove('show'); setTimeout(() => { el.hidden = true; }, 250); }, 2200);
    };

    const settleHand = (h) => {
      const t = handTotal(h.cards);
      const dt = handTotal(dealer);
      const dealerBJ = isBlackjack(dealer);
      if (h.status === 'bust') { h.result = 'lose'; return; }
      if (h.blackjackHand && !dealerBJ) { h.result = 'win'; h.blackjackWin = true; addBalance(Math.round(h.bet * 2.5 * 100) / 100); return; }
      if (h.blackjackHand && dealerBJ) { h.result = 'push'; addBalance(h.bet); return; }
      if (dealerBJ) { h.result = 'lose'; return; }
      if (dt.total > 21 || t.total > dt.total) { h.result = 'win'; addBalance(h.bet * 2); return; }
      if (t.total === dt.total) { h.result = 'push'; addBalance(h.bet); return; }
      h.result = 'lose';
    };

    const finishRound = () => {
      inRound = false;
      hands.forEach(settleHand);
      dealerHoleHidden = false;
      renderTable();
      const won = hands.filter((h) => h.result === 'win').length;
      const pushed = hands.filter((h) => h.result === 'push').length;
      if (won > 0) showResult(hands.some((h) => h.blackjackWin) ? 'Blackjack!' : 'You Win!', 'Payout added to your balance', hands.some((h) => h.blackjackWin) ? 'blackjack' : 'win');
      else if (pushed === hands.length) showResult('Push', 'Your bet has been returned', 'push');
      else showResult('Dealer Wins', 'Better luck next round', 'lose');
      setButtons();
    };

    const dealerTurn = () => {
      dealerHoleHidden = false;
      const allBust = hands.every((h) => h.status === 'bust');
      const naturalSettled = hands.some((h) => h.blackjackHand);
      const step = () => {
        renderTable();
        if (allBust || naturalSettled) { finishRound(); return; }
        const dt = handTotal(dealer);
        if (dt.total < 17) {
          dealer.push(draw());
          setTimeout(step, 800);
        } else {
          finishRound();
        }
      };
      setTimeout(step, 700);
    };

    const advanceHand = () => {
      active++;
      while (active < hands.length && hands[active].status !== 'active') active++;
      if (active >= hands.length) { dealerTurn(); return; }
      renderTable();
    };

    const resolveActiveBust = () => {
      const h = hands[active];
      const t = handTotal(h.cards);
      if (t.total > 21) { h.status = 'bust'; renderTable(); setTimeout(advanceHand, 700); return true; }
      return false;
    };

    $('#bjHit').addEventListener('click', () => {
      if (!inRound) return;
      const h = hands[active];
      h.cards.push(draw());
      renderTable();
      if (!resolveActiveBust()) setButtons();
    });

    $('#bjStand').addEventListener('click', () => {
      if (!inRound) return;
      hands[active].status = 'stand';
      renderTable();
      advanceHand();
    });

    $('#bjDouble').addEventListener('click', () => {
      if (!inRound) return;
      const h = hands[active];
      if (currentUser.balance < h.bet) { toast('Not enough balance to double'); return; }
      setBalance(currentUser.balance - h.bet);
      h.bet *= 2;
      h.doubled = true;
      h.cards.push(draw());
      renderTable();
      if (!resolveActiveBust()) { hands[active].status = 'stand'; renderTable(); advanceHand(); }
    });

    $('#bjSplit').addEventListener('click', () => {
      if (!inRound) return;
      const h = hands[active];
      if (currentUser.balance < h.bet) { toast('Not enough balance to split'); return; }
      setBalance(currentUser.balance - h.bet);
      const second = { cards: [h.cards.pop()], bet: h.bet, doubled: false, status: 'active', renderedCount: 0 };
      h.renderedCount = h.cards.length;
      h.cards.push(draw());
      second.cards.push(draw());
      hands.push(second);
      renderTable();
      setButtons();
    });

    $('#bjFairBtn').addEventListener('click', () => {
      toast('This shoe is shuffled fresh in your browser each round — no server-side deck to manipulate.');
    });

    $('#bjStart').addEventListener('click', () => {
      if (!currentUser) { openAuth('signin'); toast('Sign in to play Blackjack!'); return; }
      if (inRound) return;
      const amt = parseFloat(bjBet.value);
      if (!amt || amt <= 0) { toast('Enter a bet amount first'); return; }
      const bet = rawBet(amt);
      if (currentUser.balance < bet) { toast('Not enough balance — deposit first!'); openDeposit(); return; }
      setBalance(currentUser.balance - bet);

      hands = [{ cards: [], bet, doubled: false, status: 'active', renderedCount: 0 }];
      dealer = [];
      active = 0;
      dealerHoleHidden = true;
      dealerHoleWasHidden = true;
      dealerRendered = 0;
      inRound = true;
      $('#bjResult').hidden = true;
      $('#bjResult').classList.remove('show');
      setButtons();

      const order = [0, 'd', 0, 'd'];
      let i = 0;
      const dealNext = () => {
        if (i >= order.length) {
          const playerBJ = isBlackjack(hands[0].cards);
          const dealerBJ = isBlackjack(dealer);
          if (playerBJ || dealerBJ) {
            hands[0].blackjackHand = playerBJ;
            hands[0].status = 'stand';
            dealerTurn();
          } else {
            renderTable();
          }
          return;
        }
        if (order[i] === 'd') dealer.push(draw()); else hands[0].cards.push(draw());
        i++;
        renderTable();
        setTimeout(dealNext, 450);
      };
      dealNext();
    });

    setButtons();
  })();

  window.__steps.push('wiring-done');
  // battle viewer header
  $('#bvBack').addEventListener('click', () => { location.hash = '#/case-battles'; });
  // open-slot cards in the player bar double as Call Bot buttons
  const playerbarHost = document.getElementById('bvPlayerbar');
  if (playerbarHost) {
    playerbarHost.addEventListener('click', (e) => {
      const bot = e.target.closest('[data-bot]');
      if (bot) callBot(Number(bot.dataset.bot));
    });
    playerbarHost.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const bot = e.target.closest('[data-bot]');
      if (bot) { e.preventDefault(); callBot(Number(bot.dataset.bot)); }
    });
  }
  $('#bvSound').addEventListener('click', () => {
    AudioFX.on = !AudioFX.on;
    localStorage.setItem('rbxwin_sound', AudioFX.on ? 'on' : 'off');
    $('#bvSound').textContent = AudioFX.on ? 'Sound On' : 'Sound Off';
    if (AudioFX.on) AudioFX.blip(880, 0.06, 0.04);
  });

  // sidebar toggle + esc
  $('#chatToggle').addEventListener('click', () => document.body.classList.toggle('sidebar-hidden'));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      $('#authModal').classList.remove('open');
      $('#depositModal').classList.remove('open');
      $('#viewModal').classList.remove('open');
      $('#casesModal').classList.remove('open');
      dropdown.classList.remove('open');
      const ud = $('#userDropdown');
      if (ud) ud.classList.remove('open');
    }
  });
  } catch (err) { window.__initError = String((err && err.stack) || err); throw err; }
}

/* ================================================================
   BATTLE VIEWER — items, reels, sound, winner
   ================================================================ */
// chance per player per round to land the Gold Token - tiered by case price
const GOLD_ODDS = {
  kraken: 0.05,
  core: 0.10, blossom: 0.09, toxic: 0.08, frost: 0.07, winter: 0.06,
  royal: 0.05, inferno: 0.045, dominus: 0.04, galaxy: 0.03
};
function goldOdds(caseKey) { return GOLD_ODDS[caseKey] || 0.05; }

const ITEM_POOLS = {
  core: [
    { name: 'Blue R Cap', v: 1, w: 70, img: 'items/blue-r-cap.png', c: '#7cc0ff' },
    { name: 'Winky', v: 4, w: 15, img: 'items/winky.png', c: '#5aa2ff' },
    { name: 'Winner Smile', v: 8, w: 8, img: 'items/winner-smile.png', c: '#4da3ff' },
    { name: 'Sparkle Time Face', v: 15, w: 4, img: 'items/sparkle-face.png', c: '#8fb7ff' },
    { name: 'Princess Face', v: 35, w: 2, img: 'items/princess-face.png', c: '#b8d0ff' },
    { name: 'Man Face', v: 80, w: 0.9, img: 'items/man-face.png', c: '#4da3ff' },
    { name: 'Gold Token', v: 5, w: 2, img: 'items/gold-token.png', c: '#ffd35c', token: true },
  ],
  blossom: [
    { name: 'Winner Smile', v: 3, w: 70, img: 'items/winner-smile.png', c: '#7cc0ff' },
    { name: 'Winky', v: 10, w: 15, img: 'items/winky.png', c: '#5aa2ff' },
    { name: 'Princess Face', v: 25, w: 8, img: 'items/princess-face.png', c: '#4da3ff' },
    { name: 'Sparkle Time Face', v: 60, w: 4, img: 'items/sparkle-face.png', c: '#8fb7ff' },
    { name: 'Man Face', v: 150, w: 2, img: 'items/man-face.png', c: '#b8d0ff' },
    { name: 'Shaggy', v: 600, w: 0.9, img: 'items/shaggy.png', c: '#4da3ff' },
    { name: 'Gold Token', v: 10, w: 2, img: 'items/gold-token.png', c: '#ffd35c', token: true },
  ],
  toxic: [
    { name: 'Winky', v: 15, w: 70, img: 'items/winky.png', c: '#7cc0ff' },
    { name: 'Princess Face', v: 60, w: 15, img: 'items/princess-face.png', c: '#5aa2ff' },
    { name: 'Sparkle Time Face', v: 150, w: 8, img: 'items/sparkle-face.png', c: '#4da3ff' },
    { name: 'Black Round Glasses', v: 300, w: 4, img: 'items/round-glasses.png', c: '#8fb7ff' },
    { name: 'Crossed Katanas', v: 700, w: 2, img: 'items/crossed-katanas.png', c: '#b8d0ff' },
    { name: 'Shaggy', v: 1800, w: 0.9, img: 'items/shaggy.png', c: '#4da3ff' },
    { name: 'Gold Token', v: 25, w: 2, img: 'items/gold-token.png', c: '#ffd35c', token: true },
  ],
  frost: [
    { name: 'Sparkle Time Face', v: 75, w: 70, img: 'items/sparkle-face.png', c: '#7cc0ff' },
    { name: 'Black Round Glasses', v: 300, w: 15, img: 'items/round-glasses.png', c: '#5aa2ff' },
    { name: 'Crossed Katanas', v: 800, w: 8, img: 'items/crossed-katanas.png', c: '#4da3ff' },
    { name: 'Shaggy', v: 2000, w: 4, img: 'items/shaggy.png', c: '#8fb7ff' },
    { name: 'Venomous Horns', v: 4500, w: 2, img: 'items/venomous-horns.png', c: '#b8d0ff' },
    { name: 'Man Face', v: 9000, w: 0.9, img: 'items/man-face.png', c: '#4da3ff' },
    { name: 'Gold Token', v: 50, w: 2, img: 'items/gold-token.png', c: '#ffd35c', token: true },
  ],
    winter: [
    { name: 'Silver Star', v: 25000, w: 1.2, img: 'items/silver-star.png', c: '#dfe9ff' },
    { name: 'Headless Horseman', v: 18000, w: 2, img: 'items/headless-horseman.png', c: '#9fb4d8' },
    { name: 'Man Face', v: 9000, w: 4, img: 'items/man-face.png', c: '#4da3ff' },
    { name: 'Venomous Horns', v: 4000, w: 8, img: 'items/venomous-horns.png', c: '#8fb7ff' },
    { name: 'Shaggy', v: 1600, w: 15, img: 'items/shaggy.png', c: '#5aa2ff' },
    { name: 'Crossed Katanas', v: 600, w: 30, img: 'items/crossed-katanas.png', c: '#7cc0ff' },
    { name: 'Black Round Glasses', v: 150, w: 39, img: 'items/round-glasses.png', c: '#b8d0ff' },
    { name: 'Gold Token', v: 100, w: 0.8, img: 'items/gold-token.png', c: '#ffd35c', token: true },
  ],
    royal: [
    { name: 'Dragon Wings', v: 9000, w: 1.2, img: 'items/dragon-wings.png', c: '#7cc0ff' },
    { name: 'Venomous Horns', v: 4000, w: 4, img: 'items/venomous-horns.png', c: '#8fb7ff' },
    { name: 'Shaggy', v: 1600, w: 10, img: 'items/shaggy.png', c: '#5aa2ff' },
    { name: 'Crossed Katanas', v: 600, w: 25, img: 'items/crossed-katanas.png', c: '#7cc0ff' },
    { name: 'Princess Face', v: 200, w: 30, img: 'items/princess-face.png', c: '#b8d0ff' },
    { name: 'Winky', v: 60, w: 29, img: 'items/winky.png', c: '#5aa2ff' },
    { name: 'Gold Token', v: 100, w: 0.8, img: 'items/gold-token.png', c: '#ffd35c', token: true },
  ],
    inferno: [
    { name: 'Red Valk', v: 12000, w: 1.2, img: 'items/dragon-wings.png', c: '#ff5c4a' },
    { name: 'Headless Horseman', v: 5000, w: 6, img: 'items/headless-horseman.png', c: '#9fb4d8' },
    { name: 'Man Face', v: 2200, w: 14, img: 'items/man-face.png', c: '#4da3ff' },
    { name: 'Shaggy', v: 900, w: 24, img: 'items/shaggy.png', c: '#5aa2ff' },
    { name: 'Crossed Katanas', v: 350, w: 28, img: 'items/crossed-katanas.png', c: '#7cc0ff' },
    { name: 'Winky', v: 90, w: 26, img: 'items/winky.png', c: '#5aa2ff' },
    { name: 'Gold Token', v: 100, w: 0.8, img: 'items/gold-token.png', c: '#ffd35c', token: true },
  ],
    dominus: [
    { name: 'Fang Horns', v: 15000, w: 1.2, img: 'items/fang-horns.png', c: '#a86cff' },
    { name: 'Venomous Horns', v: 6000, w: 6, img: 'items/venomous-horns.png', c: '#8fb7ff' },
    { name: 'Man Face', v: 2500, w: 14, img: 'items/man-face.png', c: '#4da3ff' },
    { name: 'Shaggy', v: 1000, w: 24, img: 'items/shaggy.png', c: '#5aa2ff' },
    { name: 'Princess Face', v: 350, w: 28, img: 'items/princess-face.png', c: '#b8d0ff' },
    { name: 'Winky', v: 90, w: 26, img: 'items/winky.png', c: '#5aa2ff' },
    { name: 'Gold Token', v: 100, w: 0.8, img: 'items/gold-token.png', c: '#ffd35c', token: true },
  ],
  kraken: [
    { name: 'Purple Sparkle Time', v: 40000, w: 1.2, img: 'items/purple-sparkle.png', c: '#c9a6ff' },
    { name: 'Silver Star', v: 25000, w: 2, img: 'items/silver-star.png', c: '#dfe9ff' },
    { name: 'Dragon Wings', v: 9000, w: 4, img: 'items/dragon-wings.png', c: '#7cc0ff' },
    { name: 'Fang Horns', v: 3500, w: 8, img: 'items/fang-horns.png', c: '#9fb4d8' },
    { name: 'Shocked Face', v: 1200, w: 15, img: 'items/shocked.png', c: '#eef3ff' },
    { name: 'Kawaii Face', v: 400, w: 30, img: 'items/kawaii-face.png', c: '#ff8ade' },
    { name: 'Cat Mouth', v: 120, w: 39.8, img: 'items/cat-mouth.png', c: '#ff6b8a' },
  ],
    galaxy: [
    { name: 'Crossed Katanas', v: 250000, w: 0.8, img: 'items/crossed-katanas.png', c: '#f2c94c' },
    { name: 'Silver Star', v: 60000, w: 3, img: 'items/silver-star.png', c: '#dfe9ff' },
    { name: 'Purple Sparkle Time', v: 40000, w: 6, img: 'items/purple-sparkle.png', c: '#c9a6ff' },
    { name: 'Man Face', v: 10000, w: 12, img: 'items/man-face.png', c: '#4da3ff' },
    { name: 'Venomous Horns', v: 4000, w: 20, img: 'items/venomous-horns.png', c: '#8fb7ff' },
    { name: 'Shaggy', v: 1500, w: 28, img: 'items/shaggy.png', c: '#5aa2ff' },
    { name: 'Winky', v: 200, w: 29.4, img: 'items/winky.png', c: '#5aa2ff' },
    { name: 'Gold Token', v: 100, w: 0.8, img: 'items/gold-token.png', c: '#ffd35c', token: true },
  ],
};
// bump case item values so top-tier drops feel like real money (gold spin should actually hit big)
for (const pool of Object.values(ITEM_POOLS)) {
  pool.forEach((it) => { it.v = Math.round(it.v * 40); });
}
function poolPcts(pool) {
  const total = pool.reduce((a, x) => a + (x.w || 1), 0);
  pool.forEach((x) => {
    const p = (x.w || 1) / total * 100;
    x.pct = pctStr(p);
  });
}

// shared "12%" / "4.3%" / "0.85%" formatter — used for drop odds,
// live jackpot shares, and the jackpot wheel segments
function pctStr(p) {
  if (!isFinite(p) || p < 0) p = 0;
  return (p < 1 ? p.toFixed(2) : p < 10 ? p.toFixed(1) : String(Math.round(p))) + '%';
}

function hashString(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const makeSeed = () => 'RBX-' + Math.random().toString(36).slice(2, 6).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();

for (const pk of Object.keys(ITEM_POOLS)) {
  poolPcts(ITEM_POOLS[pk]);
}

function pickItem(pool, rand = Math.random) {
  const total = pool.reduce((a, x) => a + (x.w || 1), 0);
  let r = rand() * total;
  for (const x of pool) {
    r -= (x.w || 1);
    if (r <= 0) return { ...x };
  }
  return { ...pool[0] };
}

function itemCard(it, small) {
  return `<div class="item-card${small ? ' small' : ''}" style="--c:${it.color}">
    <svg class="it-glyph" viewBox="0 0 24 24"><use href="#${it.g}"/></svg>
    <span class="it-name">${it.name}</span>
    <span class="it-val"><svg viewBox="0 0 24 24" width="10" height="10"><use href="#coin"/></svg>${fmt(it.v)}</span>
  </div>`;
}

/* ---------- sound (generated, no files) ---------- */
const AudioFX = {
  ctx: null,
  on: localStorage.getItem('rbxwin_sound') !== 'off',
  ensure() {
    if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  },
  blip(f = 1200, d = 0.04, g = 0.035) {
    if (!this.on) return;
    try {
      const c = this.ensure();
      const o = c.createOscillator();
      const v = c.createGain();
      o.type = 'square';
      o.frequency.value = f;
      v.gain.value = g;
      o.connect(v); v.connect(c.destination);
      v.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + d);
      o.start();
      o.stop(c.currentTime + d);
    } catch (e) { /* audio unavailable */ }
  },
  tick() { this.blip(1150 + Math.random() * 350, 0.025, 0.028); },
  land() { this.blip(880, 0.09, 0.05); this.blip(1320, 0.12, 0.04); },
  win() { [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => this.blip(f, 0.12, 0.05), i * 90)); },
  gold() { this.blip(1568, 0.06, 0.04); this.blip(2093, 0.1, 0.04); },
  lose() { this.blip(200, 0.28, 0.05); },
};

/* ---------- viewer state ---------- */
let viewerB = null;
let countTimers = [];
function clearCountTimers() { countTimers.forEach(clearTimeout); countTimers = []; }
const finishedBattles = {};
let liveTimers = [];
function clearLiveTimers() { liveTimers.forEach(clearTimeout); liveTimers = []; }

function openBattleViewer(b) {
  if (!b || b.done) { toast('That battle already finished!'); return; }
  viewerB = b;
  location.hash = '#/battle/' + b.id;
}

function bigItemHtml(it) {
  return `<svg class="bi-glyph" viewBox="0 0 24 24"><use href="#${it.g}"/></svg>
    <span class="bi-name">${it.name}</span>
    <span class="bi-val"><svg viewBox="0 0 24 24" width="13" height="13"><use href="#coin"/></svg>${fmt(it.v)}</span>`;
}

function botLvl(name) {
  let h = 0;
  for (const c of name) h = (h * 33 + c.charCodeAt(0)) >>> 0;
  return 5 + (h % 90);
}

function spinCardHtml(it, w) {
  const visual = it.token
    ? `<img class="it-img token-img" src="${it.img}" alt="">`
    : `<img class="it-img" src="${it.img}" alt="">`;
  return `<div class="spin-card${it.token ? ' tok' : ''}" style="width:${w}px">
    ${visual}
    ${it.token ? '' : `<span class="sc-name">${it.name}</span>`}
    <span class="sc-val"><svg viewBox="0 0 24 24" width="12" height="12"><use href="#coin"/></svg>${fmt(it.v)}</span>
  </div>`;
}

function lootCardHtml(it) {
  if (it.token) {
    return `<div class="loot-card token"><img class="it-img" src="${it.img}" alt=""></div>`;
  }
  const visual = it.img
    ? `<img class="it-img" src="${it.img}" alt="">`
    : `<svg class="it-glyph" viewBox="0 0 24 24"><use href="#${it.g}"/></svg>`;
  return `<div class="loot-card" style="--c:${it.color}">
    ${visual}
    <span class="lc-name">${it.name}</span>
    <span class="lc-val"><svg viewBox="0 0 24 24" width="12" height="12"><use href="#coin"/></svg>${fmt(it.v)}</span>
  </div>`;
}

function spawnConfetti() {
  const c = document.getElementById('bvConfetti');
  if (!c) return;
  const colors = ['#4da3ff', '#8fb7ff', '#eef3ff', '#5aa2ff', '#b8d0ff'];
  let html = '';
  for (let i = 0; i < 60; i++) {
    html += `<i style="left:${Math.random() * 100}%;background:${colors[i % colors.length]};animation-delay:${(Math.random() * 1.5).toFixed(2)}s;animation-duration:${(1.8 + Math.random() * 1.8).toFixed(2)}s;transform:rotate(${Math.floor(Math.random() * 360)}deg) scale(${(0.6 + Math.random()).toFixed(2)})"></i>`;
  }
  c.innerHTML = html;
}

function miniItem(it) {
  if (it.token) {
    return `<div class="mini-item token"><img class="it-img" src="${it.img}" alt=""></div>`;
  }
  const visual = it.img
    ? `<img class="it-img" src="${it.img}" alt="">`
    : `<svg class="it-glyph" viewBox="0 0 24 24"><use href="#${it.g}"/></svg>`;
  return `<div class="mini-item" style="--c:${it.color}">
    ${it.pct ? `<span class="mi-pct">${it.pct}</span>` : ''}
    ${visual}
    <span class="mi-name">${it.name}</span>
    <span class="mi-val"><svg viewBox="0 0 24 24" width="10" height="10"><use href="#coin"/></svg>${fmt(it.v)}</span>
  </div>`;
}

function addLoot(i, it) {
  const list = document.getElementById('loot' + i);
  if (!list) return;
  const wrap = document.createElement('div');
  wrap.innerHTML = lootCardHtml(it);
  const card = wrap.firstElementChild;
  card.classList.add('pop');
  list.prepend(card);
}

// shows what a player just pulled — item, drop odds, and its coin value —
// right under their profile card in the battle bar
function updateLastPull(i, it) {
  const el = document.getElementById('lastpull' + i);
  if (!el || !it || it.token) return;
  const visual = it.img
    ? `<img class="it-img" src="${it.img}" alt="">`
    : `<svg class="it-glyph" viewBox="0 0 24 24"><use href="#${it.g}"/></svg>`;
  el.innerHTML = (it.pct ? `<span class="bv-pull-pct">${it.pct}</span>` : '') +
    visual +
    `<span class="bv-pull-name">${it.name}</span>` +
    `<span class="bv-pull-val"><svg viewBox="0 0 24 24" width="11" height="11"><use href="#coin"/></svg>${fmt(it.v)}</span>`;
  el.classList.add('show');
  el.classList.remove('pop');
  void el.offsetWidth;
  el.classList.add('pop');
}

function waitBarHtml(b) {
  const players = [];
  b.teams.forEach((team) => team.forEach((p) => players.push(p)));
  const N = players.length;
  // only the battle owner (whoever created it) can summon a bot into an
  // open slot — everyone else just sees it's open, in case a real player
  // grabs it first
  const canCall = isOwner(b);
  return players.map((p, i) => p ? `
    <div class="bv-pbar-card ${p.you ? 'you' : ''}" id="pbcard${i}">
      <div class="bv-pbar-top">
        <span class="lvl">${botLvl(p.n)}</span>
        <span class="avatar">${avatarSVG(p.k)}</span>
        <b class="bv-uname">${p.you ? 'You' : p.n}</b>
        <span class="bv-won"><svg viewBox="0 0 24 24" width="11" height="11"><use href="#coin"/></svg><em id="tot${i}">0.00</em>${b.type === 'jackpot' ? `<b class="bv-jp-pct" id="jp${i}">${pctStr(100 / N)}</b>` : ''}</span>
      </div>
      <div class="bv-pull" id="lastpull${i}"></div>
    </div>` : `
    <div class="bv-pbar-card empty${canCall ? ' callable' : ''}" id="pbcard${i}"${canCall ? ` data-bot="${b.id}" role="button" tabindex="0" title="Call a bot into this slot"` : ''}>
      <div class="bv-pbar-top">
        <span class="avatar bot-avatar"><svg viewBox="0 0 24 24" width="20" height="20"><use href="#bot"/></svg></span>
        <b class="bv-uname">${canCall ? 'Call Bot' : 'Waiting for player…'}</b>
      </div>
    </div>`).join('');
}

function refreshWaitingView() {
  if (!viewerB || viewerB.played || viewerB.done) return;
  const h = location.hash || '';
  if (!h.startsWith('#/battle/') || Number(h.split('/')[2]) !== viewerB.id) return;
  const bar = document.getElementById('bvPlayerbar');
  if (bar) bar.innerHTML = waitBarHtml(viewerB);
}

function renderLive(b) {
  clearLiveTimers();
  // wipe any leftover results/winner card from a previous battle — without
  // this, creating a new battle while an old "Recreate Battle" screen was
  // still showing left that old winner card sitting on top of the fresh
  // waiting screen.
  const staleWinEl = document.getElementById('bvWinner');
  if (staleWinEl) { staleWinEl.hidden = true; staleWinEl.innerHTML = ''; }
  const staleStage = document.getElementById('bvStage');
  if (staleStage) staleStage.classList.remove('gold-round', 'stage-done');
  const staleConf = document.getElementById('bvConfetti');
  if (staleConf) staleConf.innerHTML = '';
  const m = MODES[b.mode];
  const players = [];
  const teamOf = [];
  b.teams.forEach((team, ti) => team.forEach(() => { players.push(null); teamOf.push(ti); }));
  b.teams.forEach((team, ti) => team.forEach((p, si) => { players[ti * team.length + si] = p; }));
  const N = players.length;
  const nR = b.cases.length;
  const rng = mulberry32(hashString(b.seed));
  const cKeys = Object.keys(CASE_TYPES);
  const firstStrip = document.querySelector('.bv-pstrip');
  const firstCard = firstStrip ? firstStrip.querySelector('.mini-item') : null;
  const ITEM_H = firstCard ? Math.round(firstCard.getBoundingClientRect().height + 6) : 156;

  $('#bvMode').textContent = m.label;
  $('#bvTypeL').textContent = b.type === 'jackpot' ? 'Jackpot' : 'Normal';
  $('#bvSeed').textContent = 'Seed ' + b.seed;
  $('#bvCasesRow').innerHTML = b.cases.map((k) => `
    <span class="bv-case-thumb">${caseArt(k, cKeys)}</span>`).join('');
  $('#bvSound').textContent = AudioFX.on ? 'Sound On' : 'Sound Off';
  $('#bvBalance').textContent = currentUser ? fmt(currentUser.balance) : '0.00';
  const pot0 = document.getElementById('bvPot');
  if (pot0) pot0.textContent = '0.00';

  $('#bvCols').innerHTML = players.map((p, i) => `
    <div class="bv-pcol ${p && p.you ? 'you' : ''}" id="pcol${i}">
      <div class="bv-pcol-win"><div class="bv-pstrip" id="pstrip${i}"></div></div>
    </div>`).join('');
  $('#bvVs').style.display = b.teams.length === 2 && N >= 2 ? 'flex' : 'none';
  $('#bvPlayerbar').style.gridTemplateColumns = `repeat(${N},minmax(0,1fr))`;
  const emptySlots = players.filter((p) => !p).length;
  $('#bvPlayerbar').innerHTML = waitBarHtml(b);
  const countEl = document.getElementById('bvCount');

  if (emptySlots > 0) {
    // still missing players — b.played stays false so polling (and the joiner's
    // own screen) both know to re-render once the last slot fills
    $('#bvRound').textContent = 'Waiting for players';
    $('#bvRound').classList.remove('goldtxt');
    $('#bvStage').classList.add('stage-wait');
    if (countEl) countEl.hidden = true;
    return; // reels wait until all slots are filled — call bot via the open slot card
  }

  $('#bvStage').classList.remove('stage-wait');

  // battle is full — if we've already started (or are mid-countdown) for THIS
  // fill, don't restart; otherwise run the 3-2-1 countdown once, then begin.
  if (b.played || b._counting) return;
  b._counting = true;
  $('#bvRound').textContent = `Round 1 of ${nR}`;
  $('#bvRound').classList.remove('goldtxt');
  if (countEl) countEl.hidden = true;

  let n = 3;
  const countdownTick = () => {
    if (viewerB !== b || b.done) { b._counting = false; if (countEl) countEl.hidden = true; return; }
    if (countEl) { countEl.hidden = false; countEl.textContent = n; countEl.classList.remove('pop'); void countEl.offsetWidth; countEl.classList.add('pop'); }
    AudioFX.tick();
    n--;
    if (n > 0) {
      liveTimers.push(setTimeout(countdownTick, 900));
    } else {
      liveTimers.push(setTimeout(() => {
        if (countEl) countEl.hidden = true;
        b._counting = false;
        b.played = true;
        beginRound();
      }, 800));
    }
  };
  countdownTick();

  function beginRound() {
  $('#bvWinner').hidden = true;
  $('#bvWinner').innerHTML = '';
  $('#bvStage').classList.remove('gold-round', 'stage-done', 'stage-wait');
  const conf = document.getElementById('bvConfetti');
  if (conf) conf.innerHTML = '';

  const totals = players.map(() => 0);
  const bags = players.map(() => []);
  let ri = 0;
  let pending = 0;
  const ITEM_H2 = 112;
  const alive = () => viewerB === b && document.getElementById('bvCols') && !$('#view-live').hidden;

  // jackpot mode: everyone's live share of the pot updates as values land —
  // whoever has pulled the most value so far is holding the biggest slice
  const updateJackpotPcts = () => {
    if (b.type !== 'jackpot') return;
    const sum = totals.reduce((a, v) => a + v, 0);
    players.forEach((p, i) => {
      if (!p) return;
      const el = document.getElementById('jp' + i);
      if (!el) return;
      const pct = sum > 0 ? (totals[i] / sum * 100) : (100 / N);
      el.textContent = pctStr(pct);
    });
  };

  // the pot chip in the header used to sit frozen at 0.00 for the whole battle
  // and only snap to the real number at the very end — now it counts up live,
  // the same way the balance pill does, so the pot actually feels like it's growing
  let shownPot = 0;
  const updateLivePot = () => {
    const el = document.getElementById('bvPot');
    if (!el) return;
    const sum = Math.round(totals.reduce((a, v) => a + v, 0) * 100) / 100;
    if (sum === shownPot) return;
    animateCount(el, shownPot, sum, 500);
    shownPot = sum;
  };

  const poolFor = (caseKey) => ITEM_POOLS[caseKey] || ITEM_POOLS.core;
  // normal rounds spin ONLY the bottom half of the case (cheapest items, plus the token)
  const cheapPool = (caseKey) => {
    const pool = poolFor(caseKey).filter((x) => !x.token).slice().sort((a, b) => a.v - b.v);
    const junk = pool.slice(0, Math.max(2, Math.floor(pool.length / 2)));
    const tok = poolFor(caseKey).filter((x) => x.token)[0];
    if (tok) junk.push(tok);
    return junk;
  };
  // the gold spin rolls ONLY the top half of the case (the expensive items)
  const goodPool = (caseKey) => {
    const pool = poolFor(caseKey).filter((x) => !x.token).slice().sort((a, b) => b.v - a.v);
    return pool.slice(0, Math.max(2, Math.ceil(pool.length / 2)));
  };

  const spinColumn = (i, pool, landItem, dur) => {
    const strip = document.getElementById('pstrip' + i);
    if (!strip) return;
    const wonHtml = bags[i].map(miniItem).join('');
    const cycle = pool.slice();
    const off = Math.floor(rng() * cycle.length);
    let fill = '';
    for (let j = 0; j < 16; j++) fill += miniItem(cycle[(j + off) % cycle.length]);
    // a few extra cards after the landed item so the reel isn't blank below
    // the marker once it settles
    let tail = '';
    for (let j = 0; j < 3; j++) tail += miniItem(cycle[(j + off + 16) % cycle.length]);
    strip.innerHTML = wonHtml + fill + miniItem(landItem) + tail;
    const winH = strip.parentElement.clientHeight;
    // land the item centered on the marker line, not offset toward the bottom
    const target = -((bags[i].length + 16) * ITEM_H) + (winH / 2 - ITEM_H / 2);
    strip.style.transition = 'none';
    strip.style.transform = 'translateY(0px)';
    void strip.offsetWidth;
    // one smooth continuous spin: fast start, gradual tick-down deceleration to the landed item
    if (!alive()) return;
    strip.style.transition = 'transform ' + dur + 's cubic-bezier(.09,.79,.15,1)';
    strip.style.transform = 'translateY(' + target + 'px)';
  };
  // watches the live transform of each spinning strip and flashes+ticks whichever
  // item is actually crossing the center marker line right now — synced to the
  // real on-screen motion rather than a fixed timer
  const attachCenterTicks = (strips, dur) => {
    const live = strips.filter(Boolean);
    if (!live.length) return;
    const winH = live[0].parentElement.clientHeight;
    const seen = live.map(() => null);
    const started = performance.now();
    const readY = (el) => {
      const t = getComputedStyle(el).transform;
      if (!t || t === 'none') return 0;
      const m = t.match(/matrix\(([^)]+)\)/);
      if (!m) return 0;
      const parts = m[1].split(',').map(Number);
      return parts[5] || 0;
    };
    const loop = () => {
      if (!alive()) return;
      live.forEach((strip, si) => {
        const y = readY(strip);
        const idx = Math.round((winH / 2 - ITEM_H / 2 - y) / ITEM_H);
        if (idx !== seen[si]) {
          seen[si] = idx;
          const card = strip.children[idx];
          if (card) { card.classList.remove('tick-flash'); void card.offsetWidth; card.classList.add('tick-flash'); }
          if (si === 0 && AudioFX.on) AudioFX.tick();
        }
      });
      if (performance.now() - started < dur * 1000 + 250) liveTimers.push(setTimeout(loop, 45));
    };
    loop();
  };

  // THE GOLD SPIN — one player spins the good items
  const goldRound = (done) => {
    if (!alive()) { done(); return; }
    const good = goodPool(b.cases[0]);
    const allGood = [];
    b.cases.forEach((k) => { const g = goodPool(k); allGood.push(g[0], g[1]); });
    const gi = Math.floor(rng() * N);
    const gp = players[gi];
    $('#bvRound').textContent = 'GOLD SPIN';
    $('#bvRound').classList.add('goldtxt');
    $('#bvStage').classList.add('gold-round');
    const col = document.getElementById('pcol' + gi);
    if (col) col.classList.add('gold-turn');
    if (gp.you) addMessage({ av: avatarFor(currentUser.name), n: 'System', system: true, sys: true, text: 'GOLD SPIN - you spin for the good stuff!' });
    else addMessage({ av: gp.k, n: gp.n, text: 'gold spin lets gooo' });
    const land = pickItem(allGood, rng);
    const strip = document.getElementById('pstrip' + gi);
    if (strip) {
      let fill = '';
      for (let j = 0; j < 16; j++) fill += miniItem(pickItem(allGood, rng));
      // a few extra cards after the landed item so the reel doesn't look empty
      // below the marker once it stops
      let tail = '';
      for (let j = 0; j < 3; j++) tail += miniItem(pickItem(allGood, rng));
      strip.innerHTML = fill + miniItem(land) + tail;
      const winH = strip.parentElement.clientHeight;
      strip.style.transition = 'none';
      strip.style.transform = 'translateY(0px)';
      void strip.offsetWidth;
      const target = -(16 * ITEM_H) + (winH / 2 - ITEM_H / 2);
      strip.style.transition = 'transform 5.5s cubic-bezier(.1,.5,.14,1)';
      strip.style.transform = 'translateY(' + target + 'px)';
    }
    attachCenterTicks([strip], 5.2);
    liveTimers.push(setTimeout(function () {
      if (!alive()) { done(); return; }
      AudioFX.gold();
      totals[gi] += land.v; bags[gi].push(land);
      var t = document.getElementById('tot' + gi); if (t) t.textContent = fmt(totals[gi]);
      updateJackpotPcts();
      updateLivePot();
      if (alive()) toast((gp.you ? 'You' : gp.n) + ' unboxed ' + land.name + ' - ' + fmt(land.v) + '!');
      liveTimers.push(setTimeout(done, 1300));
    }, 5650));
  };

  // spins the jackpot wheel (the long strip of player segments in
  // #jwTrack), sized to each player's live % share, and lands the pointer
  // on the pre-picked winner. Calls cb() once the spin + highlight settle.
  const spinJackpotWheel = function (weights, winnerIdx, cb) {
    const wheelEl = document.getElementById('jackpotWheel');
    const track = document.getElementById('jwTrack');
    const potEl = document.getElementById('jwPot');
    if (!wheelEl || !track) { cb(); return; }
    const totalW = weights.reduce(function (a, v) { return a + v; }, 0);
    const pcts = weights.map(function (w) { return totalW > 0 ? (w / totalW * 100) : (100 / weights.length); });
    if (potEl) potEl.textContent = fmt(pot);
    const SEG_MIN = 92, SEG_SCALE = 6.4;
    const segWidths = pcts.map(function (p) { return Math.max(SEG_MIN, p * SEG_SCALE); });
    const LOOPS = 14;
    const segRefs = [];
    let html = '';
    let x = 0;
    for (let l = 0; l < LOOPS; l++) {
      players.forEach(function (p, i) {
        if (!p) return;
        const w = segWidths[i];
        segRefs.push({ loop: l, i: i, left: x, width: w });
        html += '<div class="jw-seg" data-loop="' + l + '" data-i="' + i + '" style="width:' + w + 'px">' +
          '<div class="jw-face">' + avatarSVG(p.k) + '</div>' +
          '<span class="jw-name">' + (p.you ? 'You' : p.n) + '</span>' +
          '<span class="jw-pct">' + pctStr(pcts[i]) + '</span>' +
          '</div>';
        x += w;
      });
    }
    track.innerHTML = html;
    // land somewhere well into the strip so it visibly spins through many
    // segments first, at a random point inside the winner's own slice
    const targetLoop = LOOPS - 2;
    const candidates = segRefs.filter(function (s) { return s.loop === targetLoop && s.i === winnerIdx; });
    const target = candidates[0] || segRefs[segRefs.length - 1];
    const jitter = (rng() * 0.6 + 0.2) * target.width;
    // must unhide (and force layout) BEFORE reading clientWidth — a hidden
    // element's descendants report 0, which was throwing the landing math
    // off by half the viewport and making the pointer settle on a neighbor
    wheelEl.hidden = false;
    track.style.transition = 'none';
    track.style.transform = 'translateX(0px)';
    void track.offsetWidth;
    const viewport = wheelEl.querySelector('.jw-viewport');
    const vpWidth = viewport ? viewport.clientWidth : 680;
    const finalX = -(target.left + jitter - vpWidth / 2);
    if (!alive()) { cb(); return; }
    track.style.transition = 'transform 5.8s cubic-bezier(.1,.6,.15,1)';
    track.style.transform = 'translateX(' + finalX + 'px)';
    track.classList.remove('settled');
    liveTimers.push(setTimeout(function () {
      document.querySelectorAll('.jw-seg[data-loop="' + targetLoop + '"][data-i="' + winnerIdx + '"]').forEach(function (el) { el.classList.add('win'); });
      track.classList.add('settled');
      AudioFX.win();
      liveTimers.push(setTimeout(function () {
        wheelEl.hidden = true;
        cb();
      }, 1500));
    }, 5900));
  };

  let pot = 0;

  const finish = function (skipGold) {
    if (!alive()) return;
    document.getElementById('bvRound').textContent = 'Battle Finished';
    document.getElementById('bvRound').classList.add('goldtxt');
    pot = Math.round(totals.reduce(function (a, v) { return a + v; }, 0) * 100) / 100;
    var potEl = document.getElementById('bvPot'); if (potEl) potEl.textContent = fmt(pot);

    if (b.type === 'jackpot') {
      // your odds of winning the jackpot spin are your share of the total
      // value pulled — hit a big item and you're holding most of the wheel;
      // small pulls only buy you a thin sliver
      const weights = totals.map(function (t) { return t > 0 ? t : 0.0001; });
      const totalW = weights.reduce(function (a, v) { return a + v; }, 0);
      let r = rng() * totalW;
      let best = weights.length - 1;
      for (let i = 0; i < weights.length; i++) { r -= weights[i]; if (r <= 0) { best = i; break; } }
      document.getElementById('bvStage').classList.add('stage-done');
      // real team modes (2v2, 3v3) share the jackpot with the whole squad;
      // 1v1, 1v1v1 and free-for-all are all solo entries so it's just them
      const teamed = m.teams > 1 && m.per > 1;
      const jpWinIdx = teamed ? teamOf.map(function (ti, i) { return ti === teamOf[best] ? i : -1; }).filter(function (i) { return i > -1; }) : [best];
      spinJackpotWheel(weights, best, function () { finalizeBattle(jpWinIdx); });
      return;
    }

    const teamSums = b.teams.map(function (_, ti) {
      return totals.filter(function (_, i) { return teamOf[i] === ti; }).reduce(function (a, v) { return a + v; }, 0);
    });
    let bi = 0;
    teamSums.forEach(function (t, ti) { if (t > teamSums[bi]) bi = ti; });
    const winIdx = teamOf.map(function (ti, i) { return ti === bi ? i : -1; }).filter(function (i) { return i > -1; });
    document.getElementById('bvStage').classList.add('stage-done');
    finalizeBattle(winIdx);
  };

  function finalizeBattle(winIdx) {
    if (!alive()) return;
    const share = Math.round((pot / winIdx.length) * 100) / 100;
    const winners = winIdx.map(function (i) { return players[i]; });
    const names = winners.map(function (p) { return p.you ? 'You' : p.n; }).join(' & ');
    const idx = battles.indexOf(b);
    if (idx > -1) battles.splice(idx, 1);
    renderBattlesIfVisible();
    systemMsg('Battle finished - ' + names + ' won ' + fmt(share) + '!');
    Api.completeBattle(b.id);
    const userWon = winners.some(function (p) { return p.you; });
    if (battleHasUser(b)) {
      if (userWon) {
        addBalance(share);
        if (alive()) { toast('You won +' + fmt(share) + ' coins!'); AudioFX.win(); }
      } else if (alive()) { toast('Your team lost - better luck next time!'); AudioFX.lose(); }
    }
    if (!alive()) return;
    document.getElementById('bvBalance').textContent = currentUser ? fmt(currentUser.balance) : '0.00';
    document.getElementById('bvStage').classList.add('stage-done');
    spawnConfetti();
    finishedBattles[b.id] = { b: b, totals: totals.slice(), bags: bags.map(function (x) { return x.slice(); }), winners: winners, share: share };
    var wEl = document.getElementById('bvWinner');
    wEl.innerHTML = '<div class="bv-win-title">' + (b.type === 'jackpot' ? 'Jackpot Winner' : 'Winners') + '</div>' +
      '<div class="bv-win-avatars">' + winners.map(function (p) { return '<span class="bv-win-av ' + (p.you ? 'you' : '') + '">' + avatarSVG(p.k) + '</span>'; }).join('') + '</div>' +
      '<div class="bv-win-amt"><svg viewBox="0 0 24 24" width="24" height="24"><use href="#coin"/></svg>' + fmt(share) + '</div>' +
      '<div class="bv-win-seed">Seed ' + b.seed + '</div>' +
      '<button class="btn btn-primary" id="bvRecreate">Recreate Battle</button>';
    wEl.hidden = false;
    document.getElementById('bvRecreate').addEventListener('click', function () { recreateBattle(b); });
  }

  function renderRecap(id) {
    const rec = finishedBattles[id];
    if (!rec) { location.hash = '#/case-battles'; return; }
    const b = rec.b;
    const m = MODES[b.mode];
    const cKeys2 = Object.keys(CASE_TYPES);
    $('#bvMode').textContent = m.label;
    $('#bvTypeL').textContent = b.type === 'jackpot' ? 'Jackpot' : 'Normal';
    $('#bvSeed').textContent = 'Seed ' + b.seed;
    $('#bvCasesRow').innerHTML = b.cases.map(function (k) {
      return '<span class="bv-case-thumb">' + caseArt(k, cKeys2) + '</span>';
    }).join('');
    $('#bvRound').textContent = 'Battle Finished';
    $('#bvRound').classList.add('goldtxt');
    $('#bvSound').textContent = AudioFX.on ? 'Sound On' : 'Sound Off';
    var bvB = document.getElementById('bvBalance');
    if (bvB) bvB.textContent = currentUser ? fmt(currentUser.balance) : '0.00';
    const players = [];
    b.teams.forEach(function (team) { team.forEach(function (p) { players.push(p); }); });
    const itemsByPlayer = rec.b.teams.map(function (team, ti) {
      return rec.totals.map(function (_, i) { return null; });
    });
    // rebuild per-player item lists from the recap order
    const flat = [];
    b.teams.forEach(function (team, ti) { team.forEach(function (p, si) { flat.push({ p: p, ti: ti, si: si }); }); });
    $('#bvPlayerbar').style.gridTemplateColumns = 'repeat(' + flat.length + ',minmax(0,1fr))';
    $('#bvPlayerbar').innerHTML = flat.map(function (f, i) {
      const won = rec.winners.some(function (w) { return w.n === (f.p.you ? 'You' : f.p.n); });
      return '<div class="bv-pbar-card ' + (won ? 'won' : 'lost') + '" id="pbcard' + i + '">' +
        '<span class="lvl">' + botLvl(f.p.n) + '</span>' +
        '<span class="avatar">' + avatarSVG(f.p.k) + '</span>' +
        '<b class="bv-uname">' + (f.p.you ? 'You' : f.p.n) + '</b>' +
        '<span class="bv-won"><svg viewBox="0 0 24 24" width="11" height="11"><use href="#coin"/></svg><em>' + fmt(rec.totals[i]) + '</em></span>' +
        '</div>';
    }).join('');
    $('#bvCols').innerHTML = flat.map(function (f, i) {
      const items = rec.bags ? rec.bags[i] || [] : [];
      const cards = items.map(function (it) { return miniItem(it); }).join('') || '<div class="bv-empty-hint">No items</div>';
      return '<div class="bv-pcol"><div class="bv-pcol-win"><div class="bv-pstrip">' + cards + '</div></div></div>';
    }).join('');
    document.getElementById('bvStage').classList.add('stage-done');
    var wEl = document.getElementById('bvWinner');
    wEl.innerHTML = '<div class="bv-win-title">Battle Finished</div>' +
      '<div class="bv-win-avatars">' + rec.winners.map(function (p) { return '<span class="bv-win-av ' + (p.you ? 'you' : '') + '">' + avatarSVG(p.k) + '</span>'; }).join('') + '</div>' +
      '<div class="bv-win-amt"><svg viewBox="0 0 24 24" width="24" height="24"><use href="#coin"/></svg>' + fmt(rec.share) + '</div>' +
      '<div class="bv-win-seed">Seed ' + b.seed + '</div>' +
      '<button class="btn btn-primary" id="bvRecreate">Recreate Battle</button>';
    wEl.hidden = false;
    document.getElementById('bvRecreate').addEventListener('click', function () { recreateBattle(b); });
  }

  const playRound = function () {
    let pending = 0;
    const advance = function () {
      if (pending > 0) return;
      ri++;
      liveTimers.push(setTimeout(playRound, 900));
    };
    if (!alive()) { finish(false); return; }
    if (ri >= nR) { finish(false); return; }
    const caseKey = b.cases[ri];
    const cheap = cheapPool(caseKey);
    const gold = goodPool(caseKey);
    document.getElementById('bvRound').textContent = 'Round ' + (ri + 1) + ' of ' + nR;
    document.getElementById('bvRound').classList.remove('goldtxt');
    document.getElementById('bvStage').classList.remove('gold-round');
    players.forEach(function (_, i) {
      var c = document.getElementById('pcol' + i);
      if (c) c.classList.remove('gold-turn', 'gold-hit');
    });
    // pure luck: each player has a small ~3% chance to land the Gold Token.
    // everyone spins the bad items; only a token lands a gold spin.
    const junkOnly = cheap.filter(function (x) { return !x.token; });
    const picks = players.map(function () {
      if (rng() < goldOdds(caseKey)) {
        var tok = poolFor(caseKey).filter(function (x) { return x.token; })[0];
        if (tok) return Object.assign({}, tok);
      }
      return pickItem(junkOnly, rng);
    });
    players.forEach(function (_, i) {
      spinColumn(i, junkOnly, picks[i], 5);
    });
    attachCenterTicks(players.map(function (_, i) { return document.getElementById('pstrip' + i); }), 4.8);
    liveTimers.push(setTimeout(function () {
      if (!alive()) { finish(false); return; }
      AudioFX.land();
      picks.forEach(function (it, i) {
        totals[i] += it.v; bags[i].push(it);
        var t = document.getElementById('tot' + i); if (t) t.textContent = fmt(totals[i]);
        updateJackpotPcts();
        updateLivePot();
        if (!it.token) updateLastPull(i, it);
        if (it.token) {
          pending++;
          var strip = document.getElementById('pstrip' + i);
          var cards = strip.querySelectorAll('.mini-item');
          var last = cards[cards.length - 1];
          if (last) last.classList.add('token-hit');
          AudioFX.gold();
          // let the coin finish its flip before the reel starts spinning
          liveTimers.push(setTimeout(function () {
            goldContinue(i, it, function () { pending--; advance(); });
          }, 550));
          return;
        }
        addLoot(i, it);
      });
      advance();
    }, 5350));
  };

  // gold spin: the token holder's reel keeps spinning down into the good items
  const goldContinue = function (i, it, cb) {
    var strip = document.getElementById('pstrip' + i);
    var col = strip ? strip.closest('.bv-pcol') : null;
    if (!strip || !col) { cb(); return; }
    col.classList.add('gold-turn');
    $('#bvStage').classList.add('gold-round');
    var chip = document.getElementById('bvRound');
    if (chip) { chip.textContent = 'GOLD SPIN'; chip.classList.add('goldtxt'); }
    var good = goodPool(b.cases[ri]).sort(function (a, b) { return b.v - a.v; });
    var prize = good[Math.floor(rng() * good.length)];
    var wonHtml = bags[i].slice(0, -1).map(miniItem).join('');
    var fill = '';
    for (var j = 0; j < 16; j++) fill += miniItem(good[j % good.length]);
    var tail = '';
    for (var j2 = 0; j2 < 3; j2++) tail += miniItem(good[(j2 + 16) % good.length]);
    strip.innerHTML = wonHtml + fill + miniItem(prize) + tail;
    strip.style.transition = 'none';
    strip.style.transform = 'translateY(0px)';
    void strip.offsetWidth;
    var winH = strip.parentElement.clientHeight;
    var target = -((bags[i].length - 1 + 16) * ITEM_H) + (winH / 2 - ITEM_H / 2);
    if (!alive()) { cb(); return; }
    strip.style.transition = 'transform 4.4s cubic-bezier(.09,.79,.15,1)';
    strip.style.transform = 'translateY(' + target + 'px)';
    attachCenterTicks([strip], 4.4);
    liveTimers.push(setTimeout(function () {
      totals[i] += prize.v;
      bags[i][bags[i].length - 1] = prize;
      var t = document.getElementById('tot' + i); if (t) t.textContent = fmt(totals[i]);
      updateJackpotPcts();
      updateLivePot();
      updateLastPull(i, prize);
      col.classList.add('gold-hit');
      AudioFX.gold();
      spawnConfetti();
      cb();
    }, 4750));
  };

  // prefill the reels with cheap items so they never look empty, then start round 1
  players.forEach(function (_, i) {
    var strip = document.getElementById('pstrip' + i);
    if (!strip) return;
    var cheap = cheapPool(b.cases[0]);
    var fill = '';
    for (var j = 0; j < 20; j++) fill += miniItem(cheap[Math.floor(rng() * cheap.length)]);
    strip.innerHTML = fill;
    strip.style.transform = 'translateY(0px)';
  });
  liveTimers.push(setTimeout(playRound, 1200));
  } // end beginRound
}

async function recreateBattle(b) {
  if (!currentUser) { openAuth('signin'); return; }
  const m = MODES[b.mode];
  const cost = battleCost(b);
  if (currentUser.balance < cost) { toast('Not enough coins — deposit first!'); openDeposit(); return; }
  setBalance(currentUser.balance - cost);
  try {
    const sb = await Api.createBattle({ mode: b.mode, type: b.type, cases: [...b.cases], name: currentUser.name });
    const nb = hydrateBattle(sb);
    battles.unshift(nb);
    systemMsg(`${currentUser.name} recreated a ${m.label} battle — waiting for players…`);
    toast(`Battle recreated for ${fmt(cost)} coins!`);
    // drop the owner straight back into the new battle, ready to call bots
    openBattleViewer(nb);
  } catch (e) {
    addBalance(cost);
    toast('Could not recreate the battle — try again.');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPage);
} else {
  initPage();
}

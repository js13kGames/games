'use strict';
const C = document.getElementById('c');
const X = C.getContext('2d');
const W = 960, H = 600;
const BANDS = [
{ n: 'UNMAKE', h: 354, say: 'dissolves the made',
bloom: (e, p) => { e.hp -= p * 1.3; },
blight: (e, p) => { e.hp -= p * 1.7 * (e.mark > 0 ? 2 : 1) * (1 - e.armour); },
cairn: (e, p) => { e.hp -= p * 1.1; },
geode: (e, p) => { e.hp -= p * 1.4; } },
{ n: 'FORGE', h: 26, say: 'hardens into matter',
bloom: (e, p) => { e.hp -= p * .5; },
blight: (e, p) => { e.armour = Math.min(.7, e.armour + p * .10); },
cairn: (e, p) => { e.hard = Math.min(3, e.hard + p * .12); e.hp = Math.min(e.mx, e.hp + p * .4); },
geode: (e, p) => { if (e.seen >= 1) e.forge += p * .10; } },
{ n: 'WAKE', h: 50, say: 'animates the dormant',
bloom: (e, p) => { e.grow += p * .1; },
blight: (e, p) => { e.frenzy = Math.min(2, e.frenzy + p * .06); },
cairn: (e, p) => { e.wake = Math.min(1, e.wake + p * .30); },
geode: () => {} },
{ n: 'GROW', h: 108, say: 'accelerates living things',
bloom: (e, p) => { if (e.chill <= 0) e.grow += p * .26; },
blight: (e, p) => { e.r = Math.min(26, e.r + p * .07); e.hp += p * .5; e.sp += p * .0016; },
cairn: () => {},
geode: () => {} },
{ n: 'CHILL', h: 196, say: 'slows and stills',
bloom: (e, p) => { e.chill = Math.max(e.chill, p * .35); },
blight: (e, p) => { e.chill = Math.max(e.chill, p * 1.1); },
cairn: () => {},
geode: () => {} },
{ n: 'SCRY', h: 242, say: 'reveals what is hidden',
bloom: (e, p) => { e.scry = Math.min(1.5, e.scry + p * .05); },
blight: (e, p) => { e.mark = Math.max(e.mark, p * 1.4); },
cairn: () => {},
geode: (e, p) => { e.seen = Math.min(1, e.seen + p * .05); } },
{ n: 'MEND', h: 292, say: 'restores what it touches',
bloom: (e, p) => { e.hp = Math.min(e.mx, e.hp + p * .9); },
blight: (e, p) => { e.hp += p * .8; },
cairn: (e, p) => { e.hp = Math.min(e.mx, e.hp + p * .9); },
geode: () => {} },
];
const START_BANDS = [0, 3, 4];
const UPS = [
{ k: 'reach', n: 'REACH', max: 5, cost: (l) => 26 + l * 22, say: 'the bands carry further' },
{ k: 'pot', n: 'POTENCY', max: 5, cost: (l) => 30 + l * 26, say: 'every verb acts harder' },
{ k: 'rad', n: 'RADIANCE', max: 5, cost: (l) => 24 + l * 20, say: 'a ripe bloom yields more light' },
{ k: 'vig', n: 'VIGOUR', max: 5, cost: (l) => 22 + l * 18, say: 'you endure more bites' },
{ k: 'flare', n: 'FLARE', max: 3, cost: (l) => 40 + l * 40, say: 'the burst is brighter and cheaper' },
];
const UNLOCK_ORDER = [5, 1, 2, 6];
const UNLOCK_COST = [55, 80, 115, 160];
const KEY = 'ph.save';
const fresh = () => ({ wave: 1, light: 0, best: 0, bands: START_BANDS.slice(), up: { reach: 0, pot: 0, rad: 0, vig: 0, flare: 0 } });
let S = fresh();
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
function load() {
try {
const r = JSON.parse(localStorage.getItem(KEY));
if (r && r.up && Array.isArray(r.bands)) S = Object.assign(fresh(), r);
} catch (e) {}
}
load();
let seed = 1;
function srnd() { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }
function rr(a, b) { return a + srnd() * (b - a); }
let ac = null, mgain = null;
function audio() {
if (ac) return;
try {
ac = new (window.AudioContext || window.webkitAudioContext)();
mgain = ac.createGain(); mgain.gain.value = .5; mgain.connect(ac.destination);
} catch (e) { ac = null; }
}
function tone(f, dur, type, vol, bend) {
if (!ac) return;
const t = ac.currentTime, o = ac.createOscillator(), g = ac.createGain();
o.type = type; o.frequency.setValueAtTime(f, t);
if (bend) o.frequency.exponentialRampToValueAtTime(Math.max(24, f * bend), t + dur);
g.gain.setValueAtTime(0, t);
g.gain.linearRampToValueAtTime(vol, t + .012);
g.gain.exponentialRampToValueAtTime(.0001, t + dur);
o.connect(g); g.connect(mgain); o.start(t); o.stop(t + dur + .02);
}
const SFX = {
pop: () => { tone(520, .28, 'triangle', .30, 2.6); tone(1040, .18, 'sine', .14, 2.2); },
kill: () => { tone(150, .26, 'sawtooth', .20, .34); tone(70, .32, 'square', .12, .5); },
bite: () => { tone(96, .22, 'square', .22, .55); },
buy: () => { tone(392, .16, 'triangle', .24, 1.5); tone(588, .22, 'sine', .16, 1.34); },
unlock: () => { [392, 494, 588, 784].forEach((f, i) => setTimeout(() => tone(f, .5, 'triangle', .22, 1.01), i * 90)); },
flare: () => { tone(220, .5, 'sawtooth', .12, 3.4); },
fall: () => { [330, 262, 196, 131].forEach((f, i) => setTimeout(() => tone(f, .7, 'triangle', .22, .96), i * 150)); },
wave: () => { [523, 659, 784].forEach((f, i) => setTimeout(() => tone(f, .6, 'sine', .2, 1.01), i * 110)); },
};
const SCALE = [196, 220, 262, 294, 330, 392, 440, 523, 587, 659];
let mstep = 0, mnext = 0;
function music(now) {
if (!ac || now < mnext) return;
const busy = screen === 'play';
mnext = now + (busy ? 620 : 980);
const n = SCALE[(mstep * 3 + (mstep % 4)) % SCALE.length];
tone(n, busy ? 1.5 : 2.4, 'triangle', .05, 1.005);
if (mstep % 4 === 0) tone(98, 3.2, 'sine', .06, 1.002);
if (busy && mstep % 8 === 4) tone(n * 1.5, 1.1, 'sine', .035, 1.004);
mstep++;
}
const K = {};
addEventListener('keydown', (e) => {
const k = e.key.toLowerCase();
K[k] = 1;
audio();
if (ac && ac.state === 'suspended') ac.resume();
if (' arrowup arrowdown arrowleft arrowright'.includes(k)) e.preventDefault();
press(k);
}, { passive: false });
addEventListener('keyup', (e) => { K[e.key.toLowerCase()] = 0; }, { passive: true });
addEventListener('pointerdown', () => { audio(); if (ac && ac.state === 'suspended') ac.resume(); if (screen !== 'play') press('enter'); });
let screen = 'title';
let ents = [], motes = [], horn = { x: 250, y: H / 2, bob: 0, gait: 0 },
sun, spread = .16, flareOn = 0;
let vig = 1, waveT = 0, waveLen = 0, gained = 0, killed = 0, popped = 0, msg = '', msgT = 0;
let backdrop = null, t = 0;
const up = (k) => S.up[k] || 0;
const reach = () => 300 + up('reach') * 78 + (flareOn ? 130 : 0);
const potency = () => (1 + up('pot') * .34) * (flareOn ? 3 : 1);
const vigMax = () => 1 + up('vig') * .38;
const flareCost = () => .34 - up('flare') * .07;
function say(s) { msg = s; msgT = 150; }
function far() { return 600 + Math.min(300, S.wave * 26 + up('reach') * 60); }
function seedPos() { return [rr(330, far()), rr(70, 530)]; }
function buildWave() {
seed = 20260913 + S.wave * 7717;
ents = []; motes = [];
const n = 5 + Math.min(9, Math.floor(S.wave * .9));
for (let i = 0; i < n; i++) ents.push(bloom(...seedPos()));
const cn = Math.min(3, Math.floor((S.wave + 1) / 3));
for (let i = 0; i < cn; i++) ents.push(cairn(...seedPos()));
const gn = S.wave >= 2 ? Math.min(3, Math.floor(S.wave / 2)) : 0;
for (let i = 0; i < gn; i++) ents.push(geode(...seedPos()));
horn = { x: 250, y: H / 2, bob: 0, gait: 0 };
sun = { x: -10, y: H / 2 };
vig = vigMax();
waveLen = 32 + Math.min(28, S.wave * 3);
waveT = waveLen; gained = 0; killed = 0; popped = 0;
spread = .16; flareOn = 0;
backdrop = paintValley();
}
function bloom(x, y) {
return { t: 'bloom', x, y, r: 15, grow: 0, hp: 3, mx: 3, hue: rr(0, 360) | 0,
pet: 5 + (srnd() * 3 | 0), ph: rr(0, 7), chill: 0, scry: 0, lit: 0 };
}
function blightAt(x, y) {
return { t: 'blight', x, y, r: 11, hp: 3 + S.wave * .6, mx: 3 + S.wave * .6,
sp: .30 + S.wave * .012, mark: 0, chill: 0, frenzy: 0, armour: 0, lit: 0,
wob: rr(0, 7), latch: null };
}
function cairn(x, y) { return { t: 'cairn', x, y, r: 17, hp: 6, mx: 6, wake: 0, hard: 0, lit: 0, zap: 0 }; }
function geode(x, y) { return { t: 'geode', x, y, r: 14, hp: 4, seen: 0, forge: 0, lit: 0, sp: rr(0, 7) }; }
function inAngle() { return Math.atan2(horn.y - sun.y, horn.x - sun.x); }
function bandAngle(i) { return inAngle() + (i - 3) * spread; }
function lit(i, e) {
const a = bandAngle(i), dx = e.x - horn.x, dy = e.y - horn.y;
const proj = dx * Math.cos(a) + dy * Math.sin(a);
const R = reach();
if (proj < 8 || proj > R) return 0;
const perp = Math.abs(-dx * Math.sin(a) + dy * Math.cos(a));
const halfW = 6 + proj * .012;
const edge = e.r + halfW;
if (perp > edge) return 0;
return (1 - perp / edge) * (1 - .45 * (proj / R));
}
function step(dt) {
t += dt;
const sp = 232 * dt;
let mv = 0;
if (K.arrowup || K.w) { horn.y -= sp; mv = 1; }
if (K.arrowdown || K.s) { horn.y += sp; mv = 1; }
if (K.arrowleft || K.a) { horn.x -= sp; mv = 1; }
if (K.arrowright || K.d) { horn.x += sp; mv = 1; }
horn.x = Math.max(150, Math.min(560, horn.x));
horn.y = Math.max(64, Math.min(H - 64, horn.y));
horn.bob += dt * (mv ? 7 : 3);
horn.gait += dt * (mv ? 12 : 5);
if (K.q) spread = Math.max(.045, spread - dt * .30);
if (K.e) spread = Math.min(.34, spread + dt * .30);
flareOn = 0;
if (K[' '] && vig > .06) { flareOn = 1; vig -= flareCost() * dt; if (Math.random() < dt * 6) SFX.flare(); }
sun.y = H / 2 + Math.sin(t * .28) * 150;
const P = potency();
for (const e of ents) e.lit = 0;
for (const i of S.bands) {
const b = BANDS[i];
for (const e of ents) {
const L = lit(i, e);
if (L <= 0) continue;
e.lit = Math.max(e.lit, L);
b[e.t](e, L * P * dt * 3.2);
}
}
for (const e of ents) {
if (e.t !== 'bloom') continue;
e.chill = Math.max(0, e.chill - dt);
e.scry = Math.max(0, e.scry - dt * .25);
e.grow = Math.min(1.0001, e.grow);
if (e.grow >= 1) {
const pay = Math.round((7 + up('rad') * 4) * (1 + e.scry));
S.light += pay; gained += pay; popped++;
for (let i = 0; i < 12; i++) mote(e.x, e.y, e.hue);
SFX.pop();
Object.assign(e, bloom(...seedPos()));
}
if (e.hp <= 0) { for (let i = 0; i < 6; i++) mote(e.x, e.y, 0); Object.assign(e, bloom(...seedPos())); }
}
for (const e of ents) {
if (e.t !== 'geode') continue;
if (e.forge >= 1) {
const pay = 30 + up('rad') * 10;
S.light += pay; gained += pay;
for (let i = 0; i < 20; i++) mote(e.x, e.y, 250);
say('SHARD FORGED  +' + pay);
SFX.unlock();
e.dead = 1;
}
if (e.hp <= 0) e.dead = 1;
}
for (const e of ents) {
if (e.t !== 'cairn') continue;
e.wake = Math.max(0, e.wake - dt * .12);
e.zap = Math.max(0, e.zap - dt);
if (e.wake > .35) {
for (const g of ents) {
if (g.t !== 'blight') continue;
const d = Math.hypot(g.x - e.x, g.y - e.y);
if (d < 120 + e.hard * 30) { g.hp -= dt * (2.4 + e.hard * 1.6) * (1 - g.armour); e.zap = .12; g.zx = e.x; g.zy = e.y; }
}
}
if (e.hp <= 0) e.dead = 1;
}
let alive = 0;
for (const e of ents) {
if (e.t !== 'blight') continue;
alive++;
e.mark = Math.max(0, e.mark - dt);
e.chill = Math.max(0, e.chill - dt);
e.frenzy = Math.max(0, e.frenzy - dt * .1);
e.wob += dt * 3;
if (e.hp <= 0) {
const pay = 3 + Math.round(e.r * .25);
S.light += pay; gained += pay; killed++;
for (let i = 0; i < 9; i++) mote(e.x, e.y, 348);
SFX.kill(); e.dead = 1; continue;
}
if (e.chill > 0) continue;
let tgt = null, bd = 1e9;
for (const b of ents) {
if (b.t !== 'bloom' || b.dead) continue;
const d = Math.hypot(b.x - e.x, b.y - e.y);
if (d < bd) { bd = d; tgt = b; }
}
const to = tgt || horn;
const dx = to.x - e.x, dy = to.y - e.y, d = Math.hypot(dx, dy) || 1;
const v = e.sp * (1 + e.frenzy) * 60 * dt;
if (d > (tgt ? e.r + tgt.r - 4 : 46)) { e.x += dx / d * v; e.y += dy / d * v; }
else if (tgt) { tgt.grow = Math.max(0, tgt.grow - dt * .34); tgt.hp -= dt * .9; }
else { vig -= dt * .26; SFX.bite(); shake = 6; }
}
ents = ents.filter((e) => !e.dead);
spawnT -= dt;
if (spawnT <= 0 && waveT > 3) {
spawnT = Math.max(.55, 2.6 - S.wave * .12);
const cnt = 1 + (S.wave > 6 ? 1 : 0);
for (let i = 0; i < cnt; i++) ents.push(blightAt(W + 20 + i * 26, rr(60, H - 60)));
}
for (const m of motes) { m.x += m.vx * dt; m.y += m.vy * dt; m.vy += 24 * dt; m.l -= dt; }
motes = motes.filter((m) => m.l > 0);
if (shake > 0) shake -= dt * 22;
if (msgT > 0) msgT -= dt * 60;
waveT -= dt;
if (vig <= 0) fall();
else if (waveT <= 0) clearWave();
}
let spawnT = 2, shake = 0;
function mote(x, y, hue) {
motes.push({ x, y, vx: rr(-70, 70), vy: rr(-140, -30), l: rr(.5, 1.4), hue, r: rr(1.5, 3.4) });
}
function clearWave() {
const bonus = 12 + S.wave * 6;
S.light += bonus; gained += bonus;
if (S.wave > S.best) S.best = S.wave;
S.wave++;
save(); SFX.wave();
screen = 'prism';
}
function fall() {
save(); SFX.fall();
screen = 'fallen';
}
function press(k) {
if (screen === 'title') { if (k === 'enter' || k === ' ') { buildWave(); screen = 'play'; } return; }
if (screen === 'fallen') { if (k === 'enter' || k === ' ') screen = 'prism'; return; }
if (screen === 'prism') {
if (k === 'enter' || k === ' ') { buildWave(); screen = 'play'; return; }
const i = '12345'.indexOf(k);
if (i >= 0) {
const u = UPS[i], l = up(u.k);
if (l < u.max && S.light >= u.cost(l)) { S.light -= u.cost(l); S.up[u.k] = l + 1; save(); SFX.buy(); }
else SFX.bite();
return;
}
if (k === '6') {
const nx = UNLOCK_ORDER.filter((b) => S.bands.indexOf(b) < 0)[0];
const cost = UNLOCK_COST[4 - UNLOCK_ORDER.filter((b) => S.bands.indexOf(b) < 0).length];
if (nx !== undefined && S.light >= cost) {
S.light -= cost; S.bands.push(nx); S.bands.sort((a, b) => a - b); save(); SFX.unlock();
} else SFX.bite();
}
if (k === 'r' && K.shift) { S = fresh(); save(); }
return;
}
}
function paintValley() {
const b = document.createElement('canvas'); b.width = W; b.height = H;
const g = b.getContext('2d');
const base = (S.wave * 37) % 360;
const sky = g.createLinearGradient(0, 0, 0, H);
sky.addColorStop(0, `hsl(${(base + 250) % 360},46%,7%)`);
sky.addColorStop(.55, `hsl(${(base + 275) % 360},40%,11%)`);
sky.addColorStop(1, `hsl(${(base + 20) % 360},34%,15%)`);
g.fillStyle = sky; g.fillRect(0, 0, W, H);
for (let i = 0; i < 220; i++) {
const x = srnd() * W, y = Math.pow(srnd(), 1.7) * H * .8, a = srnd() * .7 + .12;
g.fillStyle = `hsla(${(base + srnd() * 90) % 360},70%,88%,${a})`;
g.fillRect(x, y, srnd() < .12 ? 2 : 1, srnd() < .12 ? 2 : 1);
}
g.globalCompositeOperation = 'lighter';
for (let a = 0; a < 3; a++) {
const y0 = 90 + a * 66, amp = 34 + a * 16;
const grad = g.createLinearGradient(0, y0 - 70, 0, y0 + 90);
grad.addColorStop(0, `hsla(${(base + a * 46) % 360},88%,62%,0)`);
grad.addColorStop(.45, `hsla(${(base + a * 46) % 360},88%,62%,.15)`);
grad.addColorStop(1, `hsla(${(base + 120 + a * 46) % 360},88%,60%,0)`);
g.fillStyle = grad;
g.beginPath(); g.moveTo(0, y0);
for (let x = 0; x <= W; x += 24) g.lineTo(x, y0 + Math.sin(x / 180 + a * 2.1) * amp);
g.lineTo(W, y0 + 150); g.lineTo(0, y0 + 150); g.closePath(); g.fill();
}
g.globalCompositeOperation = 'source-over';
for (let L = 0; L < 4; L++) {
const yb = 300 + L * 74, rough = 16 + L * 16;
g.fillStyle = `hsl(${(base + 258 + L * 8) % 360},${30 - L * 5}%,${13 - L * 2.6}%)`;
g.beginPath(); g.moveTo(0, H);
let y = yb;
for (let x = 0; x <= W; x += 30) {
y += (srnd() - .5) * rough;
y = Math.max(yb - 64, Math.min(yb + 52, y));
g.lineTo(x, y);
}
g.lineTo(W, H); g.closePath(); g.fill();
g.strokeStyle = `hsla(${(base + 40) % 360},80%,${58 - L * 8}%,${.20 - L * .04})`;
g.lineWidth = 1.6; g.stroke();
}
const hz = g.createLinearGradient(0, 280, 0, H);
hz.addColorStop(0, 'rgba(120,90,190,0)');
hz.addColorStop(1, 'rgba(120,90,190,.13)');
g.fillStyle = hz; g.fillRect(0, 280, W, H - 280);
return b;
}
function drawUnicorn(tx, ty, ang, sc) {
const bob = Math.sin(horn.bob) * 4;
X.save();
X.translate(tx, ty + bob);
X.rotate(ang * .16);
if (sc) X.scale(sc, sc);
const body = '#f6f1ff', shade = '#c9bce4', dark = '#a294c9';
X.lineCap = 'round';
for (let i = 0; i < 4; i++) {
const front = i < 2, far = i % 2 === 1;
const hx = front ? -100 : -166, hy = front ? 118 : 114;
const ph = horn.gait + (front ? 0 : 2.6) + (far ? 1.5 : 0);
const sw = Math.sin(ph), co = Math.cos(ph);
X.strokeStyle = far ? dark : shade;
X.lineWidth = far ? 9 : 11;
const kx = hx + sw * 30 - Math.max(0, co) * 12, ky = hy + 54;
X.beginPath();
X.moveTo(hx, hy);
X.quadraticCurveTo(hx + sw * 16, hy + 28, kx, ky);
X.stroke();
X.lineWidth = far ? 5 : 6.2;
const fx = hx + sw * 30 + co * 10, fy = hy + 78 - Math.max(0, sw) * 10;
X.beginPath();
X.moveTo(kx, ky);
X.quadraticCurveTo(hx + sw * 34, hy + 68, fx, fy);
X.stroke();
X.fillStyle = far ? '#8f7fb8' : '#b9a9dc';
X.beginPath(); X.ellipse(fx, fy + 2, far ? 3.6 : 4.4, far ? 2.8 : 3.4, .2, 0, 7); X.fill();
}
for (let i = 0; i < 7; i++) {
X.strokeStyle = `hsla(${BANDS[i].h},92%,70%,.8)`;
X.lineWidth = 3.2;
const w = Math.sin(t * 2.2 + i * .7) * 13;
X.beginPath(); X.moveTo(-182, 92 + i * 2);
X.bezierCurveTo(-214, 92 + i * 4 + w, -238, 112 + i * 5 + w, -256 - i * 4, 96 + i * 9 + w * 1.4);
X.stroke();
}
X.fillStyle = body;
X.beginPath();
X.moveTo(-34, 36);
X.bezierCurveTo(-23, 43, -13, 52, -7, 62);
X.bezierCurveTo(-13, 71, -25, 72, -35, 67);
X.bezierCurveTo(-33, 79, -45, 85, -57, 93);
X.bezierCurveTo(-72, 102, -85, 114, -93, 129);
X.bezierCurveTo(-107, 133, -119, 135, -128, 139);
X.bezierCurveTo(-150, 145, -170, 140, -181, 127);
X.bezierCurveTo(-192, 116, -191, 99, -182, 90);
X.bezierCurveTo(-161, 79, -128, 82, -105, 91);
X.bezierCurveTo(-84, 73, -63, 55, -49, 40);
X.bezierCurveTo(-45, 33, -38, 31, -34, 36);
X.closePath(); X.fill();
const sg = X.createLinearGradient(0, 80, 0, 145);
sg.addColorStop(0, 'rgba(140,120,190,0)');
sg.addColorStop(1, 'rgba(120,100,175,.35)');
X.fillStyle = sg; X.fill();
X.fillStyle = shade;
X.beginPath(); X.moveTo(-44, 34); X.lineTo(-52, 14); X.lineTo(-36, 28); X.closePath(); X.fill();
X.fillStyle = '#2a1f3d';
X.beginPath(); X.ellipse(-27, 47, 3.1, 2.6, .3, 0, 7); X.fill();
X.fillStyle = 'rgba(80,60,120,.6)';
X.beginPath(); X.ellipse(-12, 60, 2, 1.4, .5, 0, 7); X.fill();
X.strokeStyle = 'rgba(150,132,200,.45)'; X.lineWidth = 1.4;
X.beginPath(); X.moveTo(-40, 44); X.quadraticCurveTo(-36, 56, -30, 63); X.stroke();
for (let i = 0; i < 7; i++) {
const on = S.bands.indexOf(i) >= 0;
X.strokeStyle = `hsla(${BANDS[i].h},92%,${on ? 72 : 32}%,${on ? .95 : .3})`;
X.lineWidth = 3.6;
const w = Math.sin(t * 2.6 + i * .55) * 10;
X.beginPath(); X.moveTo(-46 - i * 2, 38 + i * 2.5);
X.bezierCurveTo(-72 - i * 5, 44 + i * 5 + w, -96 - i * 6, 66 + i * 5 + w,
-124 - i * 7, 78 + i * 6 + w * 1.5);
X.stroke();
}
const hg = X.createLinearGradient(-34, 34, 0, 0);
hg.addColorStop(0, '#cbb8ff'); hg.addColorStop(1, '#ffffff');
X.strokeStyle = hg; X.lineJoin = 'round'; X.lineCap = 'round';
for (let pass = 0; pass < 2; pass++) {
X.lineWidth = pass ? 3 : 6.5;
X.strokeStyle = pass ? '#fff' : hg;
X.beginPath();
for (let i = 0; i <= 28; i++) {
const p = i / 28;
const px = -36 * (1 - p) + 2, py = 38 * (1 - p) - 2 + Math.sin(p * 16) * 3.4 * (1 - p);
i ? X.lineTo(px, py) : X.moveTo(px, py);
}
X.stroke();
}
X.globalCompositeOperation = 'lighter';
const fg = X.createRadialGradient(0, 0, 0, 0, 0, 26 + (flareOn ? 22 : 0));
fg.addColorStop(0, 'rgba(255,255,255,.95)');
fg.addColorStop(1, 'rgba(255,255,255,0)');
X.fillStyle = fg; X.beginPath(); X.arc(0, 0, 26 + (flareOn ? 22 : 0), 0, 7); X.fill();
X.globalCompositeOperation = 'source-over';
X.restore();
}
function drawBloom(e) {
const open = Math.min(1, e.grow), sway = Math.sin(t * 1.6 + e.ph) * .07;
X.save(); X.translate(e.x, e.y); X.rotate(sway);
X.strokeStyle = `hsla(120,40%,${28 + e.grow * 16}%,.85)`; X.lineWidth = 2.6;
X.beginPath(); X.moveTo(0, 4); X.quadraticCurveTo(3, 22, -1, 38); X.stroke();
const R = 6 + open * 13;
for (let i = 0; i < e.pet; i++) {
const a = (i / e.pet) * 6.283 + t * .12;
const tip = R * (1 + open * .5);
const g = X.createLinearGradient(0, 0, Math.cos(a) * tip, Math.sin(a) * tip);
g.addColorStop(0, `hsla(${e.hue},80%,${44 + e.lit * 30}%,.95)`);
g.addColorStop(1, `hsla(${(e.hue + 46) % 360},92%,${62 + e.lit * 26}%,.85)`);
X.fillStyle = g;
X.beginPath();
X.moveTo(0, 0);
X.quadraticCurveTo(Math.cos(a - .5) * tip * .7, Math.sin(a - .5) * tip * .7, Math.cos(a) * tip, Math.sin(a) * tip);
X.quadraticCurveTo(Math.cos(a + .5) * tip * .7, Math.sin(a + .5) * tip * .7, 0, 0);
X.fill();
}
X.fillStyle = `hsla(${(e.hue + 180) % 360},95%,${72 + e.lit * 20}%,1)`;
X.beginPath(); X.arc(0, 0, 3 + open * 3, 0, 7); X.fill();
if (e.chill > 0) { X.strokeStyle = 'rgba(150,220,255,.7)'; X.lineWidth = 1.6; X.beginPath(); X.arc(0, 0, R + 7, 0, 7); X.stroke(); }
if (e.scry > .05) { X.strokeStyle = `hsla(242,90%,74%,${Math.min(.8, e.scry)})`; X.lineWidth = 1.2; X.beginPath(); X.arc(0, 0, R + 12, 0, 7); X.stroke(); }
X.restore();
bar(e.x, e.y - 30, e.grow, `hsl(${e.hue},80%,62%)`);
if (e.hp < e.mx) bar(e.x, e.y - 35, e.hp / e.mx, '#ff6a8a');
}
function drawBlight(e) {
X.save(); X.translate(e.x, e.y);
const R = e.r * (1 + Math.sin(t * 4 + e.wob) * .05);
X.fillStyle = e.chill > 0 ? 'rgba(120,170,220,.9)' : `rgba(${18 + e.armour * 90},${8 + e.frenzy * 40},${30},.94)`;
X.beginPath();
for (let i = 0; i <= 14; i++) {
const a = (i / 14) * 6.283;
const rr2 = R * (1 + Math.sin(a * 3 + e.wob) * .22 + Math.sin(a * 5 - e.wob * 1.7) * .12);
i ? X.lineTo(Math.cos(a) * rr2, Math.sin(a) * rr2) : X.moveTo(Math.cos(a) * rr2, Math.sin(a) * rr2);
}
X.closePath(); X.fill();
X.fillStyle = e.mark > 0 ? '#9fe6ff' : (e.frenzy > .2 ? '#ffd34a' : '#ff5a3c');
X.beginPath(); X.arc(-R * .3, -R * .15, 2.3, 0, 7); X.arc(R * .22, -R * .2, 2.3, 0, 7); X.fill();
if (e.armour > .05) { X.strokeStyle = `rgba(210,170,110,${e.armour})`; X.lineWidth = 2; X.beginPath(); X.arc(0, 0, R + 3, 0, 7); X.stroke(); }
X.restore();
if (e.zx !== undefined && e.hp > 0) {
X.strokeStyle = 'rgba(180,240,255,.5)'; X.lineWidth = 1.4;
X.beginPath(); X.moveTo(e.zx, e.zy); X.lineTo(e.x, e.y); X.stroke();
e.zx = undefined;
}
bar(e.x, e.y - e.r - 9, e.hp / e.mx, e.mark > 0 ? '#9fe6ff' : '#c8455f');
}
function drawCairn(e) {
X.save(); X.translate(e.x, e.y);
const glow = e.wake;
for (let i = 0; i < 4; i++) {
const w = 22 - i * 4, h = 8;
X.fillStyle = `hsl(268,${10 + glow * 40}%,${20 + i * 4 + glow * 30}%)`;
X.beginPath();
X.ellipse(Math.sin(i * 2.1) * 3, 16 - i * 10, w / 2, h / 2, 0, 0, 7);
X.fill();
}
if (glow > .05) {
X.globalCompositeOperation = 'lighter';
const g = X.createRadialGradient(0, 0, 0, 0, 0, 40 + glow * 60);
g.addColorStop(0, `hsla(50,100%,72%,${glow * .6})`); g.addColorStop(1, 'hsla(50,100%,72%,0)');
X.fillStyle = g; X.beginPath(); X.arc(0, 0, 40 + glow * 60, 0, 7); X.fill();
X.globalCompositeOperation = 'source-over';
if (e.wake > .35) {
X.strokeStyle = `hsla(50,100%,80%,${.3 + Math.sin(t * 9) * .2})`; X.lineWidth = 1.4;
X.beginPath(); X.arc(0, 0, 120 + e.hard * 30, 0, 7); X.stroke();
}
}
X.restore();
bar(e.x, e.y - 34, e.wake, '#ffd66a');
}
function drawGeode(e) {
if (e.seen <= .02) {
X.strokeStyle = `rgba(150,140,200,${.10 + Math.sin(t * 2 + e.sp) * .05})`;
X.lineWidth = 1; X.beginPath(); X.arc(e.x, e.y, e.r + 4, 0, 7); X.stroke();
return;
}
X.save(); X.translate(e.x, e.y); X.rotate(t * .2 + e.sp);
X.globalAlpha = Math.min(1, e.seen);
for (let i = 0; i < 6; i++) {
const a = i / 6 * 6.283, a2 = (i + 1) / 6 * 6.283;
X.fillStyle = `hsla(${242 + i * 14},86%,${44 + (i % 2) * 18 + e.forge * 26}%,.95)`;
X.beginPath(); X.moveTo(0, 0);
X.lineTo(Math.cos(a) * e.r, Math.sin(a) * e.r);
X.lineTo(Math.cos(a2) * e.r, Math.sin(a2) * e.r);
X.closePath(); X.fill();
}
X.globalAlpha = 1; X.restore();
if (e.forge > 0) bar(e.x, e.y - 26, e.forge, '#ffb347');
}
function bar(x, y, v, col) {
if (v <= .02) return;
v = Math.min(1, v);
X.fillStyle = 'rgba(0,0,0,.4)'; X.fillRect(x - 13, y, 26, 3);
X.fillStyle = col; X.fillRect(x - 13, y, 26 * v, 3);
}
function drawBands() {
const R = reach();
X.globalCompositeOperation = 'lighter';
for (const i of S.bands) {
const b = BANDS[i], a = bandAngle(i);
const ex = horn.x + Math.cos(a) * R, ey = horn.y + Math.sin(a) * R;
const g = X.createLinearGradient(horn.x, horn.y, ex, ey);
g.addColorStop(0, `hsla(${b.h},96%,66%,${flareOn ? .95 : .8})`);
g.addColorStop(.55, `hsla(${b.h},96%,60%,${flareOn ? .55 : .38})`);
g.addColorStop(1, `hsla(${b.h},96%,58%,0)`);
X.strokeStyle = g; X.lineCap = 'round';
X.lineWidth = 15 + (flareOn ? 8 : 0); X.globalAlpha = .30;
X.beginPath(); X.moveTo(horn.x, horn.y); X.lineTo(ex, ey); X.stroke();
X.globalAlpha = 1; X.lineWidth = 4.6 + (flareOn ? 2 : 0);
X.beginPath(); X.moveTo(horn.x, horn.y); X.lineTo(ex, ey); X.stroke();
X.save();
X.translate(horn.x + Math.cos(a) * (R * .62), horn.y + Math.sin(a) * (R * .62));
X.rotate(a);
X.fillStyle = `hsla(${b.h},96%,80%,.85)`;
X.font = '10px ui-monospace,monospace'; X.textAlign = 'center';
X.fillText(b.n, 0, -8); X.textAlign = 'left';
X.restore();
}
X.globalCompositeOperation = 'source-over';
for (let i = 0; i < 7; i++) {
if (S.bands.indexOf(i) >= 0) continue;
const a = bandAngle(i);
X.strokeStyle = `hsla(${BANDS[i].h},50%,60%,.13)`;
X.setLineDash([4, 12]); X.lineWidth = 2;
X.beginPath(); X.moveTo(horn.x, horn.y);
X.lineTo(horn.x + Math.cos(a) * R * .5, horn.y + Math.sin(a) * R * .5); X.stroke();
X.setLineDash([]);
}
}
function drawShaft() {
const g = X.createLinearGradient(sun.x, sun.y, horn.x, horn.y);
g.addColorStop(0, 'rgba(255,246,214,.10)');
g.addColorStop(1, 'rgba(255,255,255,.85)');
X.globalCompositeOperation = 'lighter';
X.strokeStyle = g; X.lineWidth = 9; X.globalAlpha = .35;
X.beginPath(); X.moveTo(sun.x, sun.y); X.lineTo(horn.x, horn.y); X.stroke();
X.globalAlpha = 1; X.lineWidth = 3;
X.beginPath(); X.moveTo(sun.x, sun.y); X.lineTo(horn.x, horn.y); X.stroke();
const sg = X.createRadialGradient(sun.x, sun.y, 0, sun.x, sun.y, 90);
sg.addColorStop(0, 'rgba(255,250,230,.55)'); sg.addColorStop(1, 'rgba(255,220,150,0)');
X.fillStyle = sg; X.beginPath(); X.arc(sun.x, sun.y, 90, 0, 7); X.fill();
X.globalCompositeOperation = 'source-over';
}
function txt(s, x, y, size, col, align, weight) {
X.fillStyle = col; X.font = (weight || '') + size + 'px ui-monospace,Menlo,Consolas,monospace';
X.textAlign = align || 'left'; X.fillText(s, x, y); X.textAlign = 'left';
}
function drawHUD() {
X.fillStyle = 'rgba(8,6,16,.55)'; X.fillRect(0, 0, W, 30);
txt('WAVE ' + S.wave, 14, 20, 13, '#e8e2f2', 'left', 'bold ');
txt('LIGHT ' + S.light, 108, 20, 13, '#ffe89a');
txt('BLOOMS POPPED ' + popped, 226, 20, 12, 'rgba(232,226,242,.6)');
txt('BLIGHT UNMADE ' + killed, 392, 20, 12, 'rgba(232,226,242,.6)');
txt(Math.max(0, waveT).toFixed(0) + 's', W - 14, 20, 13, '#e8e2f2', 'right', 'bold ');
const vw = 150, vx = W - 190;
X.fillStyle = 'rgba(0,0,0,.5)'; X.fillRect(vx, 10, vw, 9);
const vg = X.createLinearGradient(vx, 0, vx + vw, 0);
vg.addColorStop(0, '#ff6a8a'); vg.addColorStop(1, '#ffd6a0');
X.fillStyle = vg; X.fillRect(vx, 10, vw * Math.max(0, vig / vigMax()), 9);
txt('VIGOUR', vx - 8, 19, 11, 'rgba(232,226,242,.7)', 'right');
const cx = 60, cy = H - 26;
txt('SPREAD  Q ‹ › E', 14, H - 40, 10, 'rgba(232,226,242,.45)');
for (let i = 0; i < 7; i++) {
const on = S.bands.indexOf(i) >= 0;
const a = (i - 3) * spread * 2.4;
X.strokeStyle = on ? `hsla(${BANDS[i].h},92%,66%,.9)` : `hsla(${BANDS[i].h},40%,50%,.16)`;
X.lineWidth = on ? 2.4 : 1.4;
X.beginPath(); X.moveTo(cx, cy); X.lineTo(cx + Math.cos(a) * 46, cy + Math.sin(a) * 46); X.stroke();
}
txt(K[' '] ? 'FLARE' : 'SPACE — FLARE', 128, H - 22, 10,
K[' '] ? '#fff3b0' : 'rgba(232,226,242,.45)');
if (msgT > 0) txt(msg, W / 2, 62, 15, `rgba(255,240,190,${Math.min(1, msgT / 60)})`, 'center', 'bold ');
}
function titleArt(cx, cy, len, a0, spr, al, lw) {
X.globalCompositeOperation = 'lighter';
for (let i = 0; i < 7; i++) {
const a = a0 + i * spr + Math.sin(t * .6 + i) * .012;
const g = X.createLinearGradient(cx, cy, cx + Math.cos(a) * len, cy + Math.sin(a) * len);
g.addColorStop(0, `hsla(${BANDS[i].h},96%,68%,${al})`);
g.addColorStop(1, `hsla(${BANDS[i].h},96%,60%,0)`);
X.strokeStyle = g; X.lineWidth = lw; X.lineCap = 'round';
X.beginPath(); X.moveTo(cx, cy); X.lineTo(cx + Math.cos(a) * len, cy + Math.sin(a) * len); X.stroke();
}
X.globalCompositeOperation = 'source-over';
}
function upMark(x, y, k, l) {
X.save(); X.translate(x, y);
X.globalCompositeOperation = 'lighter';
const glow = k === 'rad' ? 9 + l * 4 : k === 'flare' ? 9 + l * 6 : 0;
if (glow > 0 && l > 0) {
const g = X.createRadialGradient(0, 0, 0, 0, 0, glow);
g.addColorStop(0, `rgba(255,246,206,${.2 + l * .14})`);
g.addColorStop(1, 'rgba(255,246,206,0)');
X.fillStyle = g; X.beginPath(); X.arc(0, 0, glow, 0, 7); X.fill();
}
const spr = k === 'vig' ? .075 + l * .045 : .125;
const len = 20 + (k === 'reach' ? l * 6.8 : 0);
X.lineWidth = 2.2 + (k === 'pot' ? l * .9 : 0);
X.lineCap = 'round';
for (let i = 0; i < 7; i++) {
const on = S.bands.indexOf(i) >= 0, a = (i - 3) * spr;
X.strokeStyle = `hsla(${BANDS[i].h},94%,${on ? 68 : 36}%,${on ? .95 : .26})`;
X.beginPath(); X.moveTo(0, 0); X.lineTo(Math.cos(a) * len, Math.sin(a) * len); X.stroke();
}
X.fillStyle = 'rgba(255,255,255,.9)';
X.beginPath(); X.arc(0, 0, 2.2, 0, 7); X.fill();
X.globalCompositeOperation = 'source-over';
X.restore();
}
function drawTitle() {
X.drawImage(backdrop || paintValley(), 0, 0);
horn.bob = t * 2.6; horn.gait = t * 4.4;
titleArt(246, 296, 900, -1.3, .152, .88, 15);
drawUnicorn(246, 296, 0, .78);
txt('PRISMHORN', 586, 272, 54, '#ffffff', 'center', 'bold ');
txt('you never cast a spell — you cast a RAINBOW', 586, 302, 14, 'rgba(232,226,242,.82)', 'center');
const lines = [
'One shaft of dawn strikes your horn and leaves as seven bands.',
'Each band is a verb. They fire together, always, in a rigid fan.',
'GROW feeds your blooms. It also feeds the blight beside them.',
];
lines.forEach((l, i) => txt(l, 586, 352 + i * 22, 13, 'rgba(232,226,242,.62)', 'center'));
txt('WASD / ARROWS  move    Q / E  narrow ‹ › widen    SPACE  flare',
586, 444, 13, 'rgba(232,226,242,.62)', 'center');
txt(S.best > 0 ? 'DEEPEST WAVE REACHED  ' + S.best + '   —   press ENTER to walk back in'
: 'press ENTER to walk in', 586, 496, 14, '#ffe89a', 'center', 'bold ');
txt('js13kGames 2026  ·  "Unicorns and Rainbows"  ·  Core Systems Asset Factory',
W / 2, 574, 11, 'rgba(232,226,242,.35)', 'center');
}
function drawPrism() {
X.drawImage(backdrop || paintValley(), 0, 0);
titleArt(W / 2, H + 160, 900, -2.05, .16, .8, 40);
X.fillStyle = 'rgba(8,6,16,.74)'; X.fillRect(0, 0, W, H);
txt('THE PRISM', W / 2, 78, 34, '#fff', 'center', 'bold ');
txt('LIGHT  ' + S.light, W / 2, 106, 16, '#ffe89a', 'center', 'bold ');
txt('next: WAVE ' + S.wave, W / 2, 128, 12, 'rgba(232,226,242,.6)', 'center');
UPS.forEach((u, i) => {
const y = 178 + i * 46, l = up(u.k), maxed = l >= u.max, cost = u.cost(l);
const can = !maxed && S.light >= cost;
txt('[' + (i + 1) + ']', 120, y, 15, can ? '#ffe89a' : 'rgba(232,226,242,.3)', 'left', 'bold ');
txt(u.n, 168, y, 15, maxed ? '#8ef0b0' : (can ? '#fff' : 'rgba(232,226,242,.45)'), 'left', 'bold ');
txt(u.say, 300, y, 12, 'rgba(232,226,242,.45)');
upMark(604, y - 4, u.k, l);
txt(l + '/' + u.max, 782, y, 12, maxed ? '#8ef0b0' : 'rgba(232,226,242,.5)', 'right');
txt(maxed ? 'MAX' : cost + '', 880, y, 14, maxed ? '#8ef0b0' : (can ? '#ffe89a' : 'rgba(232,226,242,.3)'), 'right', 'bold ');
});
const y = 420;
const missing = UNLOCK_ORDER.filter((b) => S.bands.indexOf(b) < 0);
const cost = UNLOCK_COST[4 - missing.length];
const can = missing.length > 0 && S.light >= cost;
txt('[6]', 120, y, 15, can ? '#ffe89a' : 'rgba(232,226,242,.3)', 'left', 'bold ');
txt(missing.length ? 'UNSEAL ' + BANDS[missing[0]].n : 'SPECTRUM COMPLETE', 168, y, 15,
missing.length ? (can ? '#fff' : 'rgba(232,226,242,.45)') : '#8ef0b0', 'left', 'bold ');
txt(missing.length ? BANDS[missing[0]].say + '  —  and everything else it touches' : 'all seven bands leave your horn',
300, y + 18, 12, 'rgba(232,226,242,.45)');
upMark(604, y - 4, 'band', 0);
txt(7 - missing.length + '/7', 782, y, 12,
missing.length ? 'rgba(232,226,242,.5)' : '#8ef0b0', 'right');
txt(missing.length ? cost + '' : '—', 880, y, 14,
missing.length ? (can ? '#ffe89a' : 'rgba(232,226,242,.3)') : '#8ef0b0', 'right', 'bold ');
txt('press ENTER to walk into WAVE ' + S.wave, W / 2, 500, 16, '#fff', 'center', 'bold ');
txt('every purchase is kept forever — falling never costs you progress',
W / 2, 526, 12, 'rgba(232,226,242,.5)', 'center');
txt('SHIFT+R  begin again from wave 1', W / 2, 552, 10, 'rgba(232,226,242,.25)', 'center');
}
function drawFallen() {
drawWorld();
X.fillStyle = 'rgba(10,4,14,.72)'; X.fillRect(0, 0, W, H);
txt('THE LIGHT WENT OUT', W / 2, 250, 40, '#fff', 'center', 'bold ');
txt('wave ' + S.wave + '  ·  ' + gained + ' light gathered and KEPT', W / 2, 288, 16, '#ffe89a', 'center');
txt('you kept every upgrade, every band, and every mote you carried.',
W / 2, 322, 14, 'rgba(232,226,242,.65)', 'center');
txt('the same valley is waiting. walk back in.', W / 2, 344, 14, 'rgba(232,226,242,.65)', 'center');
txt('press ENTER', W / 2, 400, 16, '#fff', 'center', 'bold ');
}
function drawWorld() {
X.save();
if (shake > 0) X.translate((Math.random() - .5) * shake, (Math.random() - .5) * shake);
X.drawImage(backdrop, 0, 0);
drawShaft();
for (const e of ents) if (e.t === 'geode') drawGeode(e);
for (const e of ents) if (e.t === 'cairn') drawCairn(e);
for (const e of ents) if (e.t === 'bloom') drawBloom(e);
drawBands();
for (const e of ents) if (e.t === 'blight') drawBlight(e);
drawUnicorn(horn.x, horn.y, inAngle());
X.globalCompositeOperation = 'lighter';
for (const m of motes) {
X.fillStyle = `hsla(${m.hue},92%,72%,${Math.min(1, m.l)})`;
X.beginPath(); X.arc(m.x, m.y, m.r, 0, 7); X.fill();
}
X.globalCompositeOperation = 'source-over';
X.restore();
}
let last = 0;
function frame(now) {
const dt = Math.min(.05, (now - last) / 1000 || .016);
last = now;
music(now);
X.clearRect(0, 0, W, H);
if (screen === 'play') { step(dt); drawWorld(); drawHUD(); }
else if (screen === 'title') { t += dt; drawTitle(); }
else if (screen === 'prism') { t += dt; drawPrism(); }
else drawFallen();
requestAnimationFrame(frame);
}
seed = 20260913;
backdrop = paintValley();
requestAnimationFrame(frame);
self.PH = {
state: () => ({ screen, wave: S.wave, light: S.light, vig, waveT, ents: ents.length, bands: S.bands.slice(), popped, killed, spread }),
press, step, drawWorld, drawHUD, bandAngle, reach, lit, BANDS,
set: (o) => { Object.assign(S, o); },
go: () => { buildWave(); screen = 'play'; },
screen: (s) => { screen = s; },
ents: () => ents,
add: (e) => { ents.push(e); return e; },
clear: () => { ents.length = 0; },
horn: () => horn,
setSpread: (v) => { spread = v; },
make: { bloom, blight: blightAt, cairn, geode },
};

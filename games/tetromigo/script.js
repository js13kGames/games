const $ = document.querySelector.bind(document);
const _ = document.querySelectorAll.bind(document);
let _AC = new window.AudioContext;

class Wave {
  AC; #type;
  constructor(AC, type) {
    this.AC = AC;
    this.#type = type;
  }
  static noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  static calcFreq(spn) {
    let noteName = spn.slice(0, -1);
    let aFreq = (2 ** Number(spn.slice(-1))) * 27.5;
    let noteIdx = Wave.noteNames.indexOf(noteName);
    let freqRatio = 2 ** (1 / 12);
    return aFreq * (freqRatio ** (noteIdx - 9));
  }
  get volScale() {return .25}
  getSrc(pitch, sTime) {
    let freq = Wave.calcFreq(pitch);
    let src = this.AC.createOscillator();
    src.type = this.#type;
    src.frequency.setValueAtTime(freq, sTime);
    return src;
  }
}

class CustomWave extends Wave {
  #wf = [];
  constructor(AC, waveforms = ['F0']) {
    super(AC);
    this.#wf = this.#genPWave(waveforms);
  }
  static dft(wfd, len) {
    let real = new Float32Array(len);
    let imag = new Float32Array(len);
    for (let k = 1; k <= len; k++) {
      for (let n = 0; n < len; n++) {
        let idx = Math.floor(n / len * wfd.length);
        let th = (2 * Math.PI * k * n) / len;
        real[k] += wfd[idx] * Math.cos(th);
        imag[k] += wfd[idx] * Math.sin(th);
      }
    }
    return [real, imag];
  }
  #genPWave(wf) {
    let pw = [];
    wf.forEach((w, wid) => {
      let wfd = [];
      for (let i = 0; i < w.length; i++)
        wfd[i] = parseInt(w.charAt(i), 16);
      let data = CustomWave.dft(wfd, 512);
      pw[wid] = this.AC.createPeriodicWave(...data);
    });
    return pw;
  }
  get volScale() {return 1}
  getSrc(pitch, sTime, opt) {
    let freq = Wave.calcFreq(pitch);
    let src = this.AC.createOscillator();
    src.setPeriodicWave(this.#wf[opt]);
    src.frequency.setValueAtTime(freq, sTime);
    return src;
  }
}

class Noise {
  AC; #wf = [];
  constructor(AC, funcs = [Math.random], periods = [...Array(8)].map((_, i) => 2 ** i)) {
    this.AC = AC;
    this.#wf = this.genNoise(funcs, periods);
  }
  genNoise(funcs, periods) {
    let AC = this.AC, sr = AC.sampleRate, ab = [];
    funcs.forEach((fn, fnid) => {
      ab[fnid] = [];
      periods.forEach((pr, prid) => {
        ab[fnid][prid] = AC.createBuffer(1, sr, sr);
        let data = ab[fnid][prid].getChannelData(0);
        let amplitude;
        for (let i = 0; i < sr; i++) {
          if (i % pr == 0) amplitude = fn() * 2 - 1;
          data[i] = amplitude;
        }
      });
    });
    return ab;
  }
  get volScale() {return .25}
  getSrc(pitch, sTime, opt) {
    let src = this.AC.createBufferSource();
    src.buffer = this.#wf[opt][pitch];
    src.loop = true;
    return src;
  }
}

class Synth {
  #AC; #wave; #analyser; #tasks = {};
  constructor(AC, wave, analyser) {
    this.#AC = AC;
    this.#wave = wave;
    this.#analyser = analyser;
  }
  get now() {return this.#AC.currentTime}
  #vibrato(target, depth, rate = 5, wave = '') {
    let lfo = this.#AC.createOscillator();
    lfo.frequency.value = rate;
    lfo.type = wave;
    lfo.start(); //sTime?
    let dp = this.#AC.createGain();
    dp.gain.value = depth;
    lfo.connect(dp).connect(target);
  }
  play(pitch, {opt = 0, sTime = this.#AC.currentTime, dur = .03, vol = 1, det = 0, swp = 0, swg = 0, env = '.01-.01-.5-.01', vib = [], trem = []} = {}) {
    let src, AC = this.#AC, eTime = sTime + dur;
    let UUID = crypto.randomUUID();
    if (pitch == '_') return {UUID, sTime, eTime};
    if (swg) sTime += dur / 3;
    src = this.#wave.getSrc(pitch, sTime, opt);
    if (typeof vib[0] !== 'undefined')
        this.#vibrato(src.frequency, ...vib);
    let gainNode = AC.createGain();
    let gain = gainNode.gain;
    gain.setValueAtTime(0, sTime);
    if (typeof trem[0] !== 'undefined')
      this.#vibrato(gain, ...trem);
    src.connect(gainNode).connect(AC.destination);
    if (typeof this.#analyser == 'object')
      gainNode.connect(this.#analyser);
    src.start(sTime);
    src.detune.setValueAtTime(det, sTime);
    src.detune.linearRampToValueAtTime(det + swp, eTime);
    let _vol = vol * this.#wave.volScale;
    let a, d, s, r;
    [a, d, s, r] = env.split('-').map(Number);
    gain.linearRampToValueAtTime(_vol, sTime + a);
    gain.linearRampToValueAtTime(_vol * s, sTime + a + d);
    gain.setValueAtTime(_vol * s, eTime - r);
    gain.linearRampToValueAtTime(0, eTime);
    src.stop(eTime);
    this.#tasks[UUID] = src;
    src.onended = () => delete this.#tasks[UUID];
    return {UUID, sTime, eTime};
  }
  cancelTasks() {
    Object.keys(this.#tasks).forEach(key => this.#tasks[key].stop());
  }
}

class Lfsr {
  #reg = 1; #tap;
  //tap 1: long, 6, short
  constructor(tap = 1) {
    this.#tap = tap;
  }
  static get1Bit = (b, n) => (b & (1 << n)) >> n;
  getPrn() {
    let prn = Lfsr.get1Bit(this.#reg, 0) ^
      Lfsr.get1Bit(this.#reg, this.#tap);
    this.#reg >>>= 1;
    this.#reg |= prn << 14;
    return prn;
  }
}

function opSE() {
  let triangle = new Synth(_AC, new CustomWave(_AC, ['F0', 'F000', 'F0000000']));
  let rtn = triangle.play('C3', {opt: 0, dur: .1});
  // noise.play(6, {opt: 1, dur: .1, sTime: rtn.eTime});
}

function skipSE() {
  let triangle = new Synth(_AC, new Wave(_AC, 'square'));
  let rtn = triangle.play('C7', {opt: 0, dur: .1});
  triangle.play('C6', {opt: 1, dur: .1, sTime: rtn.eTime});
}

function errSE() {
  let s = new Lfsr(1), l = new Lfsr(6);
  let fcPeriods = [4, 8, 16, 32, 64, 96, 128, 160, 202, 254, 380, 508, 762, 1016, 2034, 4068];
  let periods = fcPeriods.map(fcp => Math.ceil((_AC.sampleRate / 1789772.5) * fcp));
  //_debug(periods);
  let noise = new Synth(_AC, new Noise(_AC, [() => s.getPrn(), () => l.getPrn()], periods));
  let rtn = noise.play(6, {opt: 1, dur: .1});
  noise.play(6, {opt: 1, dur: .1, sTime: rtn.eTime});
}

function okSE() {
  let s = new Lfsr(1), l = new Lfsr(6);
  let fcPeriods = [4, 8, 16, 32, 64, 96, 128, 160, 202, 254, 380, 508, 762, 1016, 2034, 4068];
  let periods = fcPeriods.map(fcp => Math.ceil((_AC.sampleRate / 1789772.5) * fcp));
  //_debug(periods);
  let noise = new Synth(_AC, new Noise(_AC, [() => s.getPrn(), () => l.getPrn()], periods));
  let rtn = noise.play(7, {opt: 0, dur: .1});
  rtn = noise.play('_', {opt: 0, dur: .2, sTime: rtn.eTime});
  rtn = noise.play(7, {opt: 0, dur: .1, sTime: rtn.eTime});
  rtn = noise.play('_', {opt: 0, dur: .2, sTime: rtn.eTime});
  rtn = noise.play(7, {opt: 0, dur: .1, sTime: rtn.eTime});
  rtn = noise.play('_', {opt: 0, dur: .2, sTime: rtn.eTime});
  rtn = noise.play(7, {opt: 0, dur: .1, sTime: rtn.eTime});
}

function bgm() {
  let pulse = new Synth(_AC, new CustomWave(_AC, ['F0', 'F000', 'F0000000']));
  let triangle = new Synth(_AC, new CustomWave(_AC, ['0123456789ABCDEFFEDCBA9876543210']));
  // let opt = $('#option').value == '' ? undefined : $('#option').value;
  let base = .4;
  let pitch = [
    ['A#4', 'A#4', 'A#4', 'A#4', 'C#5', 'C5', 'C#5', 'C5', 'A#4', 'A#4', 'A#4', 'A#4'],
    ['F4', 'F#4', 'F4', 'F#4', 'F4', 'F#4', 'F4', 'F#4'],
    ['A#3', 'C#4', 'A#3', 'C#4', 'A#3', 'C#4', 'A#3', 'C#4'],
  ];
  let dur = [
    [base, base/3*2, base/3, base, base/3*2, base/3, base/10, base/3*2-base/10, base/3, base/3*2, base/3, base*2],
    [base, base, base, base, base, base, base, base],
    [base, base, base, base, base, base, base, base],
  ];
  let rtn = [];
  rtn[0] = triangle.play(pitch[0][0], {opt: 0, dur: dur[0][0], vol:1});
  rtn[1] = pulse.play(pitch[1][0], {opt: 0, dur: dur[1][0], vol:.75});
  rtn[2] = pulse.play(pitch[2][0], {opt: 0, dur: dur[2][0], vol:.75});
  for (let i = 1; i < pitch[0].length; i++) {
    rtn[0] = triangle.play(pitch[0][i], {opt: 0, sTime: rtn[0].eTime, dur: dur[0][i], vol:1});
  }
  for (let i = 1; i < pitch[1].length; i++) {
    rtn[1] = pulse.play(pitch[1][i], {opt: 0, sTime: rtn[1].eTime, dur: dur[1][i], vol:.75});
    rtn[2] = pulse.play(pitch[2][i], {opt: 0, sTime: rtn[2].eTime, dur: dur[2][i], vol:.75});
  }
}

class Field {
  static W = 21;//21
  static H = 21;
  #bmp = new Array(Field.H);
  constructor() {
    this.init();
  }
  init() {
    for (let i = 1; i < this.#bmp.length - 1; i++) {
      this.#bmp[i] = new Array(Field.W).fill(0);
      this.#bmp[i][0] = 9;
      this.#bmp[i][Field.W - 1] = 9;
    }
    this.#bmp[0] = new Array(Field.W).fill(9);
    this.#bmp[Field.H - 1] = new Array(Field.W).fill(9);
  }
  setcell(r, c, v) {
    this.#bmp[r][c] = v;
  }
  nearby(bin) {
    let n = [...bin.slice(1), 0];
    let s = [0, ...bin].slice(0, Field.H);
    let e = bin.slice().map(E => E >>> 1);
    let w = bin.slice().map(W => W << 1);
    let filter = this.bin().map(b => b ^ (2 ** Field.W - 1));
    return bin.map((b, i) => ((n[i] | s[i] | e[i] | w[i]) & filter[i]));
  }
  bin(clr = 0) {
    let fn = clr == 0 ? c => (c == 0 ? 0 : 1) : c => (c == clr ? 1 : 0);
    let bin = new Uint32Array(Field.H);
    bin.set(this.#bmp.map(r => parseInt(r.map(c => fn(c)).join(''), 2)));
    return bin;
  }
  get bmp() {return this.#bmp}
}

class Block {
  static get shp() {
    return [['066'],['00F','4444'],['06C','8C4'],['0C6','4C8'],['0E8','C44','2E0','446'],['0E2','44C','8E0','644'],['0E4','4C4','4E0','464']];
  }
  #typ = 0; #dir = 0; #clr; #y; #x;
  constructor(typ, clr, y, x) {
    this.#typ = typ;
    this.#clr = clr;
    this.#y = y;
    this.#x = x;
  }
  #d() {
    let len = Block.shp[this.#typ].length;
    return (this.#dir % len + len) % len;
  }
  tl() {this.#dir--}
  tr() {this.#dir++}
  ml() {this.#x--}
  mr() {this.#x++}
  mu() {this.#y--}
  md() {this.#y++}
  get bin() {
    let bin = new Uint32Array(Field.H);
    let tmp = Block.shp[this.#typ][this.#d()].split('').map(b => (parseInt(b, 16) << (Field.W - 4 + 1)) >>> this.#x);
    tmp.forEach((t, i) => bin[i + this.#y - 2] = t);
    return bin;
  }
  get bmp() {
    return Array.from(this.bin).map(r => r.toString(2).padStart(Field.W, '0').split('').map(c => c == '1' ? this.#clr: 0));
  }
  get info() {return {typ: this.#typ, dir: this.#dir, x: this.#x, y: this.#y}}
}

class Core {
  #fld = new Field(); #blk; #turn; #clr; #que = [[], []]; #cnt = [1, 1]; #scr = [1, 1]; #com;
  #enque(turn, typ = Math.round(Math.random() * 6)) {
    let que = this.#que[turn];
    let x = Math.ceil((Field.W - 4) / 2) + 1;
    let y = turn ? 3 : Field.H - 3;
    que.push(new Block(typ, this.#clr * 10 + turn, y, x));
  }
  #deque(turn) {
    return this.#que[turn].shift();
  }
  #newBlk(turn) {
    this.#blk = this.#deque(turn);
    this.#enque(turn);
  }
  #isStacked(fld) {
    let blk = this.#blk.bin;
    for (let i = 0; i < fld.length; i++) {
      if ((fld[i] & blk[i]) !== 0) return true;
    }
    return false;
  }
  #score(turn = this.#turn) {
    this.#scr[turn] = this.#fld.bmp.reduce((sum, r) => {
      return sum + r.filter(c => c == this.#clr * 10 + turn).length
    }, 0);
    if (this.#scr[turn] == 13) {
      this.#blk.bmp.forEach((row, r) => {
        row.forEach((col, c) => {
          if (col != 0) this.#fld.setcell(r, c, 6);
        });
      });
      this.#scr[turn] = 9;
      if (!this.#com || !this.#turn) bgm();
      return true;
    }
    return false;
  }
  #occupy() {
    let nearby = this.#fld.nearby(this.#blk.bin);
    let bmp = Array.from(nearby).map(r => r.toString(2).padStart(Field.W, '0').split(''));
    let startCoords = [];
    bmp.map((row, r) => {
      row.map((col, c) => {
        if (col == '1') startCoords.push(r + ',' + c);
      })
    });
    startCoords.forEach(startCoord => {
      let spaceCoords = this.#getSpaces(startCoord);
      spaceCoords.forEach(spaceCoord => {
        let c = spaceCoord.split(',');
        this.#fld.setcell(c[0], c[1], this.#clr * 10 + this.#turn);
      });
    });
  }
  #isRun() {
    return this.#que[0].length > 0 ? true : false;
  }
  #getSpaces(startCoord) {
    let spaces = {};
    spaces[startCoord] = false;
    let disabled = false;
    while (1) {
      let key = Object.keys(spaces).find(k => !spaces[k]);
      if (!key) break;
      let coord = key.split(',').map(k => k * 1);
      let n = [coord[0] - 1, coord[1]];
      let e = [coord[0], coord[1] + 1];
      let s = [coord[0] + 1, coord[1]];
      let w = [coord[0], coord[1] - 1];
      [n, e, s, w].forEach(d => {
        let k = `${d[0]},${d[1]}`;
        if (!(k in spaces)) {
          if (this.#fld.bmp[d[0]][d[1]] == 0) spaces[k] = false;
          if (this.#fld.bmp[d[0]][d[1]] == this.#clr * 10 + (this.#turn ^ 1)) disabled = true;
        }
      });
      spaces[key] = true;
    }
    if (disabled) spaces = {};
    return Object.keys(spaces);
  }
  #genTerrain(num, type) {
    for (let i = 0; i < num; i++) {
      this.#fld.setcell(Math.round(Math.random() * (Field.W - 5)) + 2, Math.round(Math.random() * (Field.H - 5)) + 2, type);
    }
  }
  newGame(com = false) {
    this.#com = com;
    this.#turn = 0;
    //this.#clr = Math.round(Math.random() * 2) + 1;
    this.#clr = 2;
    this.#fld.init();
    this.#que = [[], []];
    this.#cnt = [1, 1];
    this.#scr = [1, 1];
    this.#enque(0);
    this.#enque(1);
    this.#newBlk(0);
    this.#genTerrain(5, 7);
    this.#genTerrain(7, 8);
    let x = Math.ceil(Field.W / 2) - 1;
    this.#fld.setcell(1, x, this.#clr * 10 + 1);
    this.#fld.setcell(Field.H - 2, x, this.#clr * 10);
    mapInit();
    drawMap();
    drawInfo();
  }
  op(typ) {
    if (!this.#isRun()) return;
    let reversal = {l: 'r', r: 'l', u: 'd', d: 'u'};
    let reverse = typ[0] + reversal[typ[1]];
    this.#blk[typ]();
    if (this.#isStacked(this.#fld.bin(9))) {
      this.#blk[reverse]();
      if (!this.#turn || !this.#com) errSE();
      return false;
    }
    drawMap();
    if (!this.#turn || !this.#com) opSE();
    return true;
  }
  pass() {
    if (!this.#isRun()) return;
    this.#cnt[this.#turn]++;
    if (this.#cnt[1] >= 13) {
    //if (this.#cnt[1] >= 3) {
      result(this.#scr[0], this.#scr[1]);
      this.#que[0] = [];
    } else {
      this.#turn ^= 1;
      this.#newBlk(this.#turn);
    }
    drawInfo();
    drawMap();
    if (this.#com && this.#turn) {
      $('#thinking').style.display = 'flex';
      setTimeout(() => this.com(), 100);
    }
  }
  place() {
    if (!this.#isRun()) return;
    let clr = this.#clr * 10 + this.#turn;
    let nearby = this.#fld.nearby(this.#fld.bin(clr));
    if (this.#isStacked(this.#fld.bin())
        || !this.#isStacked(nearby)) {
      if (!this.#turn || !this.#com) errSE();
      return false;
    }
    this.#blk.bmp.forEach((row, r) => {
      row.forEach((col, c) => {
        if (col != 0) this.#fld.setcell(r, c, clr);
      });
    });
    this.#occupy();
    this.#score();
    this.pass();
    okSE();
    return true;
  }
  com() {
    let mh = ['ml', 'mr'], mv = ['md', 'mu'],
        h = Math.round(Math.random()), v;
    if (Math.round(Math.random() * 3)) this.op('tr');
    if (this.#scr[1] < 10) {
      v = 0;
    } else {
      for (let i = 0; i < 16; i++) this.op('md');
      v = 1;
    }
    for (let i = 0; i < 9; i++) this.op(mh[h]);
    h ^= 1;
    if (this.place()) return;
    for (let y = 0; y < 18; y++) {
      for (let x = 0; x < 18; x++) {
        this.op(mh[h]);
        if (this.place()) {
          $('#thinking').style.display = 'none';
          return;
        }
      }
      this.op(mv[v]);
      h ^= 1;
    }
    this.pass();
    skipSE();
    $('#thinking').style.display = 'none';
  }
  get bmp() {
    let bmp = [];
    bmp[0] = JSON.parse(JSON.stringify(this.#fld.bmp));
    bmp[1] = this.#isRun() ? this.#blk.bmp : [[]];
    return bmp;
  }
  get next() {
    if (!this.#isRun()) return [];
    let top = [Field.H - 5, 1];
    let left = Math.ceil(Field.W - 4) / 2 + 1;
    let n = [this.#que[0], this.#que[1]].map((q, i) => q[0].bmp.filter((b, j) => j >= top[i] && j <= top[i] + 3).map(b => b.slice(left, left + 4)));
    return n;
  }
  get info() {return {cnt: this.#cnt, scr: this.#scr}}
}
let core = new Core();

$('#mode0').onclick = () => newGame();
$('#mode1').onclick = () => newGame(true);
$('#tr').onclick = () => core.op('tr');
['ml', 'mr', 'mu', 'md'].forEach(id => {
  $('#' + id).addEventListener('pointerdown', ()=> {
    let iId = setInterval(() => {core.op(id)}, 100);
    document.addEventListener('pointerup', () => {
      clearInterval(iId)
    }, {once: true});
  });
});
$('#ok').onclick = () => core.place();
$('#pass').onclick = () => {
  skipSE();
  core.pass();
}

document.addEventListener('keydown', e => {
  switch (e.key) {
    case 'ArrowLeft':
      core.op('ml');
      break;
    case 'ArrowRight':
      core.op('mr');
      break;
    case 'ArrowUp':
      core.op('mu');
      break;
    case 'ArrowDown':
      core.op('md');
      break;
    case 'Enter':
      core.place()
      break;
    case 'Shift':
      core.op('tr');
      break;
    case 'Escape':
      core.pass();
      skipSE();
      break;
  }
})

function start() {
  $('#top').style.display = 'block';
  $('#result').style.display = 'none';
  $('#container').style.display = 'none';
}

function newGame(com = false) {
  $('#top').style.display = 'none';
  $('#container').style.display = 'block';
  core.newGame(com);
}

function result(scr0, scr1) {
  $('#result .scr0').innerText = scr0;
  $('#result .scr1').innerText = scr1;
  _('#result div').forEach(e => e.classList.remove('winner'));
  if (scr0 == scr1) {
    $('#result h2').innerText = 'Draw..!';
    $('#result .human').innerText = '😠';
    $('#result .demon').innerText = '👿';
  } else if (scr0 > scr1) {
    $('#result h2').innerText = 'Victory!';
    $('#result .human').innerText = '😉';
    $('#result .demon').innerText = '👿';
    $('#result .human').classList.add('winner');
  } else {
    $('#result h2').innerText = 'Defeat...';
    $('#result .human').innerText = '🤕';
    $('#result .demon').innerText = '😈';
    $('#result .demon').classList.add('winner');
  }
  $('#result').style.display = 'block';
  bgm();
}

function drawInfo() {
  $('#info .turn').innerText = core.info.cnt[1];
  [0, 1].forEach(i => {
    if (core.info.scr[i] == 13) {
      //debug('13!!!');
      /*$('#area .p' + i).classList.add('tris');
      setTimeout(() => {
        core.rescore(i);
        $('#area .p' + i).innerText = 9;
        $('#area .p' + i).classList.remove('tris');
      }, 1000);*/
    }
  });
  core.next.forEach((next, n) => {
    $('#info .p' + n).innerHTML = '';
    next.forEach((row, r) => {
      let tr = document.createElement('tr');
      row.forEach((col, c) => {
        let td = document.createElement('td');
        td.classList.add('c2' + n);
        if (col != 0) {
          td.innerText = col % 10 ? '👿' : '😠';
        }
        tr.appendChild(td);
      });
      $('#info .p' + n).append(tr);
    });
  });
}

function drawMap() {
  mapInit();
  core.bmp[0].forEach((row, r) => {
    if (r == 0 || r == Field.H - 1) return;
    row.forEach((col, c) => {
      if (c == 0 || c == Field.W - 1) return;
      let cell = $('#map tr:nth-of-type(' + r + ') td:nth-of-type(' + c + ')');
      cell.classList.add('c' + col);
      if (col == 6) cell.innerText = '💀';
      if (col == 8) cell.innerText = '⛰️';
      let b = core.bmp[1][0].length > 0 ? core.bmp[1][r][c] : 0;
      if (b != 0) {
        cell.innerText = b % 10 ? '👿' : '😠';
      }
    });
  });
}

function mapInit() {
  $('#map').innerHTML = '';
  let tr = document.createElement('tr');
  for (let i = 0; i < Field.W - 2; i++) {
    tr.appendChild(document.createElement('td'));
  }
  for (let i = 0; i < Field.H - 2; i++) {
    $('#map').append(tr.cloneNode(true));
  }
}

function debug(log, stack = false) {
  $('#debug').innerText = stack ?
    $('#debug').innerText + log + '\n' : log;
}

function adjustContainer() {
  let base = window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth;
  $('body').style.fontSize = base / 21 + 'px';
}

window.onload = () => {
  adjustContainer();
};
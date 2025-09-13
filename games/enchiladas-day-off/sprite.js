class Frame {
  static map = new Map();
  static byIds = i => i.map(x => Frame.map.get(x.includes(".")?x:x+".base"));
  static import(f = window.f) {
    for (let i = 0; i < f.length; i += 9) {
      const n = new Frame(...f.slice(i, i + 9));
      const frames = Frame.map.get(n.sid) || [];
      frames[n.frame] = n;
      Frame.map.set(n.sid, frames);
    }
  }

  constructor(t, n, f, ax, ay, w, h, spx, spy) {
    this.sid = `${n}.${t}`;
    this.name = n;
    this.tag = t;
    this.frame = f;
    this.u = ax;
    this.v = ay;
    this.w = w;
    this.h = h;
    this.x = spx;
    this.y = spy;
  }

  get quad() {
    const f = this;
    return [f.x, f.y, f.w, f.h, f.u, f.v, f.w, f.h];
  }
}

Frame.import();
console.log(Frame.map);


const lerp=(a,b,t=0.5,e=1,d=abs(b-a))=>(d<e)?b:a+t*(b-a);
const randi=(b,a=0)=>floor(random()*(floor(b)-ceil(a))-ceil(a)); // NON INCLUSIVE
const shuf=(a,i=a.length-1)=>{
  for(;i>0;i--){
    var j = floor(random() * i+1),
    temp = a[i];
    a[i] = a[j];
    a[j] = temp;
  }
  return a;
}

class Go {
  static root = [];
  x = 0;
  y = 0;
  sx = 1;
  sy = 1;
  r = 0;
  index = 0;
  v = 1;
  l = 0; // lerping
  ld = 0;
  le = 0;
  lms = 0;
  lx = 0;
  ly = 0;
  tx = 0;
  ty = 0;
  e = 0;
  lcb = null;

  lerp(ms, e, tx = this.x, ty = this.y, cb) {
    this.l = true;
    this.tx = tx;
    this.ty = ty;
    this.e = e;
    this.lms = ms;
    this.lcb = cb;
  }

  /** @type {Frame[]} */
  frames = [];
  /** @type {Go[]} */
  children = [];

  constructor(frameIds = [], position = [0, 0]) {
    this.set(frameIds);
    this.children = [];
    this.x = position[0];
    this.y = position[1];
    this.w = this.frames[0]?.[0].w;
    this.h = this.frames[0]?.[0].h;
  }

  set(fs) {
    this.frames = Frame.byIds(fs)
    return this;
  }

  aabb(px, py) {
    const {x,y,w,h}=this;
    return (px>=x&&px<=x+w&&py>=y&&py<=y+h);
  }

  render(fc, ts) {
    const { x, y, r, sx, sy, v, frames, index, children, target, l, lms, tx, ty, e } = this;
    if (l) {
      if (lms) {
        this.ld = lms;
        this.le = ts + lms;
        this.lms = 0;
        this.lx = x;
        this.ly = y;
      }
      const ld = 1 - clamp(this.le - ts, 0, this.ld) / this.ld;

      if (x != tx) {
        this.x = lerp(this.lx, tx, ld, e);
      }

      if (y != ty) {
        this.y = lerp(this.ly, ty, ld, e);
      }

      if (y == ty && x == tx) {
        this.l = 0;
        this.ld = 0;
        this.lms = 0;
        this.le = 0;
        this.lx = x;
        this.ly = y;
        this.lcb?.();
        this.lcb = null;
      }
    }

    render.push();
    render.translate(Math.round(x), Math.round(y));
    render.rotate(r);
    render.scale(sx, sy);

    if (v) {
      for (const frame of frames) {
        render.quad(...frame[index].quad);
      }

      for (const go of children) {
        go.render(fc, ts);
      }
    }

    render.pop();
  }
}


class Ago extends Go {
  constructor(layers = [], anims = []) {
    super([]);
    this.frameSets = Object.fromEntries(
      anims.map((anim) => [anim, Frame.byIds(layers.map((layer) => `${layer}.${anim}`))])
    );
    this.frames = this.frameSets.base;
    this.length = 1;
    this.animate = this.animate.bind(this);
  }

  frameTime = 100;
  timestamp = 0;
  playing = false;
  timeoutId = 0;

  play(anim, time = 100) {
    const animFrameSet = this.frameSets[anim];
    if (!animFrameSet) return;
    this.frames = animFrameSet;
    this.length = animFrameSet.length;
    if (this.playing) return;
    this.playing = true;
    this.animate();
  }

  animate() {
    if (this.playing) {
      this.index = (this.index + 1) % this.length; // Nora's kickflip
      this.timeoutId = setTimeout(this.animate, this.frameTime);
    } else {
      this.index = 0;
    }
  }

  stop() {
    this.playing = false;
    this.index = 0;
    this.frame = this.frameSets.base;
    this.length = 0;
    clearTimeout(this.timeoutId);
  }
}

const world = new Go();
Go.root = [world];

const att = {
  lil_guy: new Go(["lil_guy"]),
  earring: new Go(["earring"]),
  bowtie_tail: new Go(["bowtie_tail"]),
  collar: new Go(["collar"]),
  beeg_headphones: new Go(["beeg_headphones"]),
  bowtie_head: new Go(["bowtie_head"]),
  handle_stache: new Go(["handle_stache"]),
  pencil_stache: new Go(["pencil_stache"]),
  fork: new Go(["fork"]),
  spatula: new Go(["spatula"]),
  visor: new Go(["visor"]),
  sunglasses: new Go(["sunglasses"]),
  business_tie: new Go(["business_tie"]),
  bowtie_neck: new Go(["bowtie_neck"]),
  eepy: new Go(["eepy"]),
  angy: new Go(["angy"]),
  hapy: new Go(["happy"]),
}

const emotes = [att.eepy, att.angy, att.hapy];
const cat = new Ago(["base", "eyes", "feet"], ["base", "walk", "blink"]);
cat.children = [...Object.values(att)];
cat.emote = (k, t=100) => {
  emotes.map(a => a.v=0);
  att[k].v = 1;
  setTimeout(() => att[k].v = 0, t);
}
cat.attc = () => cat.children.reduce((c, a) => c+a.v, 0)
cat.children.map((g) => (g.v = 0));
// angy.visible = 1;
cat.v = 1;

const rooms = new Go();
rooms.change = (tr, cb) => {
  if (r == tr) return;
  d = 1;
  cat.play('walk');
  if (tr>r)(cat.sx=-1,cat.x=65);
  rooms.lerp(1000,1,65-65*tr,δ,() => {// Nora's kickflip 2
    r=tr;
    d=0;
    cat.stop();
    cat.sx = 1;
    cat.x = 0;
    cb?.();
  });
}
world.children = [rooms, cat];

const bathroom = new Go(["room", "box"], [-65, 0]);
const poop_1 = new Go(["poop_1"]);
const poop_2 = new Go(["poop_2"]);
const poop_3 = new Go(["poop_3"]);
bathroom.children = [poop_1, poop_2, poop_3];

const pic = new Go(["pic"]);
const center = new Go(["room", "carpet"]);
const bowl = new Go(["bowl"]);

const food_1 = new Go(["food_1"]);
const food_2 = new Go(["food_2"]);
const food_3 = new Go(["food_3"]);

bowl.children = [food_1, food_2, food_3];
center.children = [pic, bowl];

const cr = {
  f: ['ba','bk','bq','bj','ra','rk','rq','rj'],
  b: ["back"],
  ba: ['front', 'cat', 'a_blk'],
  bk: ['front', 'cat', 'k_blk'],
  bq: ['front', 'cat', 'q_blk'],
  bj: ['front', 'cat', 'j_blk'],
  ra: ['front', 'heart', 'a_red'],
  rk: ['front', 'heart', 'k_red'],
  rq: ['front', 'heart', 'q_red'],
  rj: ['front', 'heart', 'j_red'],
}

const card_0 = new Go(cr.b, [0, 7]);
const card_1 = new Go(cr.b, [22, 7]);
const card_2 = new Go(cr.b, [44, 7]);
const card_3 = new Go(cr.b, [0, 40]);
const card_4 = new Go(cr.b, [22, 40]);
const card_5 = new Go(cr.b, [44, 40]);

const b = new Go(["room"], [65, 0]);
b.shuf = (o=[...cr.f],p=[0,0,0].map(x=>o.splice(randi(o.length),1)[0])) => b.p=shuf([...p, ...p]);
b.flip = (i, r=0) => (b.children[i].set(r?cr.b:cr[b.p[i]]), b.children[i].f=1-r, i);
b.flipped = (i) => b.children[i].f;
b.done = () => {
  for (const c of b.children) {
    console.log(c);
    if (!c.f) return false;
  }
  return true;
};
b.reset = () => b.children.map((c, i) => (c.set(cr.b),c.f=0));
b.click = ((px, py, i = -1) => {
  for(var c of b.children) { i++; if (c.aabb(px, py)) return i; }
});
b.children = [card_0,card_1,card_2,card_3,card_4,card_5,];
rooms.children = [bathroom, center, b];

window["world"] = world;

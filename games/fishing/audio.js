// zzfx() - the universal entry point -- returns a AudioBufferSourceNode
zzfx = (...t) => zzfxP(zzfxG(...t));

// zzfxG() - the sound generator -- returns an array of sample data
zzfxG = (
  q = 1,
  k = 0.05,
  c = 220,
  e = 0,
  t = 0,
  u = 0.1,
  r = 0,
  F = 1,
  v = 0,
  z = 0,
  w = 0,
  A = 0,
  l = 0,
  B = 0,
  x = 0,
  G = 0,
  d = 0,
  y = 1,
  m = 0,
  C = 0
) => {
  let b = 2 * Math.PI,
    H = (v *= (500 * b) / zzfxR ** 2),
    I = ((0 < x ? 1 : -1) * b) / 4,
    D = (c *= ((1 + 2 * k * Math.random() - k) * b) / zzfxR),
    Z = [],
    g = 0,
    E = 0,
    a = 0,
    n = 1,
    J = 0,
    K = 0,
    f = 0,
    p,
    h;
  e = 99 + zzfxR * e;
  m *= zzfxR;
  t *= zzfxR;
  u *= zzfxR;
  d *= zzfxR;
  z *= (500 * b) / zzfxR ** 3;
  x *= b / zzfxR;
  w *= b / zzfxR;
  A *= zzfxR;
  l = (zzfxR * l) | 0;
  for (h = (e + m + t + u + d) | 0; a < h; Z[a++] = f)
    ++K % ((100 * G) | 0) ||
      ((f = r
        ? 1 < r
          ? 2 < r
            ? 3 < r
              ? Math.sin((g % b) ** 3)
              : Math.max(Math.min(Math.tan(g), 1), -1)
            : 1 - (((((2 * g) / b) % 2) + 2) % 2)
          : 1 - 4 * Math.abs(Math.round(g / b) - g / b)
        : Math.sin(g)),
      (f =
        (l ? 1 - C + C * Math.sin((2 * Math.PI * a) / l) : 1) *
        (0 < f ? 1 : -1) *
        Math.abs(f) ** F *
        q *
        zzfxV *
        (a < e
          ? a / e
          : a < e + m
          ? 1 - ((a - e) / m) * (1 - y)
          : a < e + m + t
          ? y
          : a < h - d
          ? ((h - a - d) / u) * y
          : 0)),
      (f = d
        ? f / 2 +
          (d > a ? 0 : ((a < h - d ? 1 : (h - a) / d) * Z[(a - d) | 0]) / 2)
        : f)),
      (p = (c += v += z) * Math.sin(E * x - I)),
      (g += p - p * B * (1 - ((1e9 * (Math.sin(a) + 1)) % 2))),
      (E += p - p * B * (1 - ((1e9 * (Math.sin(a) ** 2 + 1)) % 2))),
      n && ++n > A && ((c += w), (D += w), (n = 0)),
      !l || ++J % l || ((c = D), (v = H), (n = n || 1));
  return Z;
};

// zzfxV - global volume
zzfxV = 0.3;

// zzfxR - global sample rate
zzfxR = 44100;

// prettier-ignore
//! ZzFXM (v2.0.3) | (C) Keith Clark | MIT | https://github.com/keithclark/ZzFXM
zzfxM=(n,f,t,e=125)=>{let l,o,z,r,g,h,x,a,u,c,d,i,m,p,G,M=0,R=[],b=[],j=[],k=0,q=0,s=1,v={},w=zzfxR/e*60>>2;for(;s;k++)R=[s=a=d=m=0],t.map((e,d)=>{for(x=f[e][k]||[0,0,0],s|=!!f[e][k],G=m+(f[e][0].length-2-!a)*w,p=d==t.length-1,o=2,r=m;o<x.length+p;a=++o){for(g=x[o],u=o==x.length+p-1&&p||c!=(x[0]||0)|g|0,z=0;z<w&&a;z++>w-99&&u?i+=(i<1)/99:0)h=(1-i)*R[M++]/2||0,b[r]=(b[r]||0)-h*q+h,j[r]=(j[r++]||0)+h*q+h;g&&(i=g%1,q=x[1]||0,(g|=0)&&(R=v[[c=x[M=0]||0,g]]=v[[c,g]]||(l=[...n[c]],l[2]*=2**((g-12)/12),g>0?zzfxG(...l):[])))}m=G});return[b,j]}

//prettier-ignore
const song = [[[3,0,200],[2,0,360,,,.375,2,3.5]],[[[1,,20,,,,20,,20,,,,20,,20,,,,25,,17,,,,17,,17,,15,,13,,17,,15,,13,,15,,,,,,,,,,,,22,,,,22,,22,,,,22,,22,,,,25,,24,,,,22,,22,,20,,19,,22,,20,,19,,25,,,,,,,,,,,,],[,,13,,,,,,8,,,,,,13,,,,,,8,,,,,,13,,,,,,8,,,,,,15,,,,,,10,,,,8,,6,,,,,,13,,,,,,8,,,,,,15,,,,,,8,,,,,,12,,,,,,13,,,,,,13,,8,,10,,]]],[0],110,{"title":"Wszystkie rybki","instruments":["Instrument 0","Instrument 1"],"patterns":["Pattern 0"]}]

//prettier-ignore
const jingle = [[[1.2,0,490,,.02,.2,,,,,,,.2,,,,,,,.1]],[[[,-1,18]]],[0],,{"title":"jingle","instruments":["Instrument 0"],"patterns":["Pattern 0"]}]

class AudioController {
  src;

  constructor(audio, { loop = false } = {}) {
    const songData = zzfxM(...audio);
    this.loop = loop;
    this.context = new (window.AudioContext || webkitAudioContext)();
    this.buffer = this.context.createBuffer(
      songData.length,
      songData[0].length,
      zzfxR
    );
    songData.map((d, i) => this.buffer.getChannelData(i).set(d));
  }

  start() {
    this.src = this.context.createBufferSource();
    this.src.buffer = this.buffer;
    this.src.loop = this.loop;
    this.src.connect(this.context.destination);
    this.src.start();
  }

  play() {
    const src = this.context.createBufferSource();
    src.buffer = this.buffer;
    src.connect(this.context.destination);
    src.start();

    src.onended = () => {
      src.stop(0);
      src.disconnect(this.context.destination);
    };
  }

  stop() {
    this.src.stop(0);
    this.src.disconnect(this.context.destination);
  }
}

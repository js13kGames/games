"use strict";
let zzfx, zzfxV, zzfxX, zzfxR;
(zzfxV = 0.3),
  (zzfx = (
    z = 1,
    t = 0.05,
    f = 220,
    x = 0,
    a = 0,
    e = 0.1,
    n = 0,
    h = 1,
    M = 0,
    R = 0,
    i = 0,
    r = 0,
    s = 0,
    o = 0,
    u = 0,
    c = 0,
    d = 0,
    X = 1,
    b = 0,
    w = 0
  ) => {
    let l,
      m,
      C = 2 * Math.PI,
      V = (M *= (500 * C) / zzfxR ** 2),
      A = ((0 < u ? 1 : -1) * C) / 4,
      B = (f *= ((1 + 2 * t * Math.random() - t) * C) / zzfxR),
      I = [],
      P = 0,
      g = 0,
      k = 0,
      D = 1,
      S = 0,
      j = 0,
      p = 0;
    for (
      R *= (500 * C) / zzfxR ** 3,
        u *= C / zzfxR,
        i *= C / zzfxR,
        r *= zzfxR,
        s = (zzfxR * s) | 0,
        m =
          ((x = 99 + zzfxR * x) +
            (b *= zzfxR) +
            (a *= zzfxR) +
            (e *= zzfxR) +
            (d *= zzfxR)) |
          0;
      k < m;
      I[k++] = p
    )
      ++j % ((100 * c) | 0) ||
        ((p = n
          ? 1 < n
            ? 2 < n
              ? 3 < n
                ? Math.sin((P % C) ** 3)
                : Math.max(Math.min(Math.tan(P), 1), -1)
              : 1 - (((((2 * P) / C) % 2) + 2) % 2)
            : 1 - 4 * Math.abs(Math.round(P / C) - P / C)
          : Math.sin(P)),
        (p =
          (s ? 1 - w + w * Math.sin((2 * Math.PI * k) / s) : 1) *
          (0 < p ? 1 : -1) *
          Math.abs(p) ** h *
          z *
          zzfxV *
          (k < x
            ? k / x
            : k < x + b
            ? 1 - ((k - x) / b) * (1 - X)
            : k < x + b + a
            ? X
            : k < m - d
            ? ((m - k - d) / e) * X
            : 0)),
        (p = d
          ? p / 2 +
            (d > k ? 0 : ((k < m - d ? 1 : (m - k) / d) * I[(k - d) | 0]) / 2)
          : p)),
        (P +=
          (l = (f += M += R) * Math.sin(g * u - A)) -
          l * o * (1 - ((1e9 * (Math.sin(k) + 1)) % 2))),
        (g += l - l * o * (1 - ((1e9 * (Math.sin(k) ** 2 + 1)) % 2))),
        D && ++D > r && ((f += i), (B += i), (D = 0)),
        !s || ++S % s || ((f = B), (M = V), (D = D || 1));
    return (
      (z = zzfxX.createBuffer(1, m, zzfxR)).getChannelData(0).set(I),
      ((f = zzfxX.createBufferSource()).buffer = z),
      f.connect(zzfxX.destination),
      f.start(),
      f
    );
  }),
  (zzfxX = new (window.AudioContext || webkitAudioContext)()),
  (zzfxR = 44100);

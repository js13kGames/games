let FishSpeed = 0.05,
  FishWidth = 187,
  FishHeight = 41,
  FishScale = 1.5;

// fish colors
const COLORS = {
  grey: {
    body: "#51637d",
    side: "#2a3a3fff",
  },
  red: {
    body: "#cc1414ff",
    side: "#740000ff",
  },
  green: {
    body: "#409920ff",
    side: "#116b04ff",
  },
  gold: {
    body: "#dad712",
    side: "#aca90fff",
  },
};

class Fish extends EventTarget {
  constructor(t) {
    super();

    this.t = t;
    this.s = t === "gold" ? FishSpeed * 3 : FishSpeed;

    const p = getOutsidePosition();
    this.cX = p.x;
    this.cY = p.y;
    this.turn();

    this.cR = this.dR;
    this.cR = Math.PI / 4;

    this.gO = false;
    this.tO = setTimeout(() => {
      this.gO = true;
      this.turn();
      this.addEventListener("reached", () => {
        this.destroy();
      });
    }, 10000);
  }

  evaluate() {
    switch (this.t) {
      case "grey":
        GAME.points += 1;
        break;
      case "green":
        GAME.end += 2000;
        break;
      case "red":
        GAME.end -= 2000;
        break;
      case "gold":
        GAME.points += 10;
        GAME.end += 10000;
        break;
    }
  }

  isHit({ x, y }) {
    const C = Math.cos(this.cR);
    const S = Math.sin(this.cR);

    const X = this.cX - x;
    const Y = this.cY - y;

    const rX = this.cX - C * X - S * Y;
    const rY = this.cY + S * X - C * Y;

    const oX = (FishWidth * FishScale) / 2;
    const oY = (FishHeight * FishScale) / 2;

    return inBox(
      this.cX - oX,
      rX,
      this.cX + oX,
      this.cY - oY,
      rY,
      this.cY + oY
    );
  }

  turn() {
    const p = this.gO ? getOutsidePosition() : getInsidePosition();
    this.dX = p.x;
    this.dY = p.y;
    this.dR = getRadius(this, this.cR);
  }

  move(_shift) {
    const shift = _shift * this.s * SCALE_SQRT;
    const cdR = Math.cos(this.dR);
    const sdR = Math.sin(this.dR);

    this.cX += clampCD(shift * cdR, this.cX, this.dX);
    this.cY += clampCD(shift * sdR, this.cY, this.dY);
    this.cR += clampMM(this.dR - this.cR, -0.03, 0.03);

    const mX = this.cX - this.dX;
    const mY = this.cY - this.dY;

    if (inBox(-5, mX, 5, -5, mY, 5)) {
      const e = new CustomEvent("reached");
      this.dispatchEvent(e);
      this.turn();
    }
  }

  draw() {
    const scale = FishScale;
    const ccR = Math.cos(this.cR);
    const scR = Math.sin(this.cR);
    const m = new DOMMatrix([
      ccR * scale,
      scR * scale,
      -scR * scale,
      ccR * scale,
      this.cX - ((FishWidth * ccR - FishHeight * scR) * scale) / 2,
      this.cY - ((FishWidth * scR + FishHeight * ccR) * scale) / 2,
    ]);

    ctx.fillStyle = COLORS[this.t].body;
    const bP = new Path2D();
    bP.addPath(
      new Path2D(
        "m172.0907,3.7q-47.79,4.11 -95.59,5l-2.47,0.68c-13.71,4.56 -35.35,6.12 -47.33,6.62c-4.44,4.49 -6.56,11.29 -4.16,17c13.15,-3.55 33.3,-2.61 33.3,-2.61c2.08,0.66 4.27,1.25 6.51,1.77c33.49,-2.32 67,-1.59 100.46,5.46c14.75611,-3.10361 24.60123,-10.11623 24.33512,-16.21884c-0.77166,-9.77635 -6.19449,-13.6882 -15.05512,-17.70116z"
      ),
      m
    );
    ctx.fill(bP);

    ctx.fillStyle = COLORS[this.t].side;
    const sP = new Path2D();
    sP.addPath(
      new Path2D(
        "m62.3507,32.14c24.9,5.86 58.2,3.86 58.2,3.86c10.61,7.54 33.17,2.9 33.17,2.9a45.67,45.67 0 0 0 9.09,-1.28c-33.48,-7.07 -66.97,-7.8 -100.46,-5.48z"
      ),
      m
    );
    sP.addPath(
      new Path2D(
        "m120.1407,2.24c-10.89,-2 -35.73,4.3 -43.64,6.42q47.79,-0.88 95.59,-5c-19.85,-7.09 -51.95,-1.42 -51.95,-1.42z"
      ),
      m
    );
    sP.addPath(
      new Path2D(
        "m165.6907,34.17a5.42,5.42 0 0 0 0.67,2.51c3.2,-2.72 6.59,-4.33 9.76,-2.15a7.72,7.72 0 0 0 0.38,-2.86s-6.25,-2.67 -10.81,2.5z"
      ),
      m
    );
    sP.addPath(
      new Path2D(
        "m178.8107,6.69c-3.51,1 -6.46,-0.51 -9.14,-2.64a10.32,10.32 0 0 0 -1.53,2.71s7.61,4.48 11.86,1.58a19.87,19.87 0 0 0 -1.19,-1.65z"
      ),
      m
    );
    ctx.fill(sP);

    ctx.fillStyle = "#ddd";
    const fP = new Path2D();
    fP.addPath(
      new Path2D(
        "m26.7007,16c-11.32541,-4.81957 -18.40282,-8.64667 -26.51131,-12.71754c1.71302,7.44843 6.07904,12.15312 10.89035,17.26659l-5.92617,3.27058l6.08393,4.39625c-5.38635,2.42713 -7.22122,3.34803 -11.2375,11.01494c12.76868,-0.46386 18.9407,-5.24082 22.5207,-6.24082c-2.38,-5.68 -0.26,-12.48 4.18,-16.99z"
      ),
      m
    );
    fP.addPath(
      new Path2D(
        "m120.5507,36s-21.33,5.44 -42.29,4.82l15.23,-5.38s21.44,0.49 27.06,0.56z"
      ),
      m
    );
    fP.addPath(
      new Path2D(
        "m120.1407,2.24s-32.31,-6.34 -43,2.31l12,1s22.67,-5.55 31,-3.31z"
      ),
      m
    );
    fP.addPath(
      new Path2D(
        "m119.1307,18.3s-63.81,-1.1 -87.95,6.36c0,0 52.49,0 87.95,-6.36z"
      ),
      m
    );
    ctx.fill(fP);

    ctx.fillStyle = COLORS[this.t].s;
    const pP = new Path2D();
    pP.addPath(
      new Path2D(
        "m146.0232,14.54285c2.6,-1.61 12.33687,0.26765 14.80687,-1.81235c-3.81,-2 -6.74,-4.07 -11,-4.53c-3.67,-0.4 -7.4401,-0.73853 -10.7601,0.88147c-1.77,0.86 -7.2399,1.42853 -8.8499,2.41853c-1.78,1.1 -4.14,0.86 -6.22,1.09c-6.28,0.61 -0.31,4.26202 5.5,5.12202c6.2,0.91 10.83313,0.34033 16.52313,-3.16967z"
      ),
      m
    );
    pP.addPath(
      new Path2D(
        "m172.39024,24.97528c-5.08,3.1 -14.51922,1.40651 -20.07922,2.66651c-6.95,1.56 -25.37573,4.2401 -29.69573,-6.2099c6.44,-2.61 17.84068,3.27518 24.76068,0.37518c5.36,-2.24 11.17775,0.35518 16.31775,-2.20482c5.41,-2.7 10.32798,-8.29147 15.52,-6.73c3.41945,2.33381 -1.80349,9.03303 -6.82349,12.10303l0.00001,0z"
      ),
      m
    );
    ctx.fill(pP);

    ctx.fillStyle = "#000";
    const eP = new Path2D();
    eP.addPath(
      new Path2D(
        "m166.3607,36.68c0.58,1 1.85,1.16 3.93,1.11c0,0 4.17,-0.25 5.83,-3.26c-3.17,-2.18 -6.56,-0.53 -9.76,2.15z"
      ),
      m
    );
    eP.addPath(
      new Path2D(
        "m178.8107,6.69c-0.56,-3.91 -6,-4.38 -9.14,-2.64c2.68,2.13 5.63,3.65 9.14,2.64z"
      ),
      m
    );
    ctx.fill(eP);
  }

  destroy() {
    clearTimeout(this.tO);
    const idx = GAME.fishes.indexOf(this);
    GAME.fishes.splice(idx, 1);
  }
}

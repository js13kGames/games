class Toggle {
  constructor(on, { x, y }) {
    this.on = on;
    this.x = x;
    this.y = y;
    this.size = 64;
  }

  isHit({ x, y }) {
    return inBox(
      this.x - this.size / 2,
      x,
      this.x + this.size / 2,
      this.y - this.size / 2,
      y,
      this.y + this.size / 2
    );
  }

  toggle() {
    this.on = !this.on;

    this.onToggle(this.on);
  }

  onToggle(on) {}

  draw() {
    ctx.lineWidth = 5;
    ctx.fillStyle = "#222222aa";
    ctx.beginPath();
    ctx.roundRect(
      this.x - this.size / 2,
      this.y - this.size / 2,
      this.size,
      this.size,
      [10]
    );
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.stroke();

    if (!this.on) {
      ctx.strokeStyle = "#fff";
      ctx.moveTo(this.x - this.size / 2 + 10, this.y + this.size / 2 - 10);
      ctx.lineTo(this.x + this.size / 2 - 10, this.y - this.size / 2 + 10);
      ctx.stroke();
    }
  }
}

class JingleToggle extends Toggle {
  constructor(on, pos) {
    super(on, pos);
  }

  draw() {
    super.draw();

    const scale = 2;
    const m = new DOMMatrix([
      1 * scale,
      0,
      0,
      1 * scale,
      this.x - 12 * scale,
      this.y - 12 * scale,
    ]);

    ctx.fillStyle = "#fff";
    const eP = new Path2D();
    eP.addPath(
      new Path2D(
        "M20.59,14.86V10.09A8.6,8.6,0,0,0,12,1.5h0a8.6,8.6,0,0,0-8.59,8.59v4.77L1.5,16.77v1.91h21V16.77Z"
      ),
      m
    );
    eP.addPath(
      new Path2D(
        "M14.69,18.68a2.55,2.55,0,0,1,.17,1,2.86,2.86,0,0,1-5.72,0,2.55,2.55,0,0,1,.17-1"
      ),
      m
    );
    ctx.stroke(eP);
  }
}

class MusicToggle extends Toggle {
  constructor(on, pos) {
    super(on, pos);
  }

  draw() {
    super.draw();

    const scale = 2;
    const m = new DOMMatrix([
      1 * scale,
      0,
      0,
      1 * scale,
      this.x - 12 * scale,
      this.y - 12 * scale,
    ]);

    ctx.strokeStyle = "#fff";
    const eP = new Path2D();
    eP.addPath(
      new Path2D(
        "M11.4,21c-1.68,1.7-4.08,2.06-5.32.8s-.9-3.63.8-5.32,4.07-2,5.32-.8S13.1,19.31,11.4,21Z"
      ),
      m
    );
    eP.addPath(new Path2D("M18.67,11v-1C18.67,5.31,13,6.26,13,.54L13,18"), m);
    ctx.stroke(eP);
  }

  onToggle(on) {
    if (on) {
      GAME.musicController.start();
    } else {
      GAME.musicController.stop();
    }
  }
}

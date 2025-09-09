let WaveSpeed = 0.5;

class Wave {
  constructor({ x, y }) {
    this.x = x;
    this.y = y;
    this.r = 0;
  }

  move(_shift) {
    this.r += _shift * WaveSpeed;

    if (this.r > WIDTH + HEIGHT) {
      this.destroy();
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#fff";
    ctx.stroke();
  }

  destroy() {
    const idx = GAME.waves.indexOf(this);
    GAME.waves.splice(idx, 1);
  }
}

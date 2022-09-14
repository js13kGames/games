let startTime = new Date();
let { canvas, context } = kontra.init();
let sprites = [];
function createAsteroid(x, y, radius) {
  let asteroid = kontra.Sprite({
    type: 'asteroid',  // for collision detection
    x,
    y,
    dx: Math.random() * 4 - 2,
    dy: Math.random() * 4 - 2,
    radius,
    render() {
      this.context.strokeStyle = 'white';
      this.context.beginPath();  // start drawing a shape
      this.context.arc(0, 0, this.radius, 0, Math.PI*2);
      this.context.stroke();     // outline the circle
    }
  });
  sprites.push(asteroid);
}
for (let i = 0; i < 7; i++) {
  createAsteroid(100, 100, 30);
}
kontra.initKeys();
let ship = kontra.Sprite({
  x: 300,
  y: 300,
  radius: 6,  // for collision detection
  render() {
    // draw a right-facing triangle
    this.context.strokeStyle = 'white';
    this.context.beginPath();
    this.context.moveTo(-3, -5);
    this.context.lineTo(12, 0);
    this.context.lineTo(-3, 5);
    this.context.closePath();
    this.context.stroke();
  },
  update() {
    // rotate the ship left or right randomly
    this.rotation += kontra.degToRad(Math.random() * 100 - 50);
    // move the ship forward in the direction it's facing
    const cos = Math.cos(this.rotation);
    const sin = Math.sin(this.rotation);
    if (kontra.keyPressed('space')) {
      this.ddx = cos * 0.1;
      this.ddy = sin * 0.1;
    }
    else {
      this.ddx = this.ddy = 0;
    }
    this.advance();
  }
});
sprites.push(ship);
let loop = kontra.GameLoop({
  update() {
    sprites.map(sprite => {
      sprite.update();
      // sprite is beyond the left edge
      if (sprite.x < -sprite.radius) {
        sprite.x = canvas.width + sprite.radius;
      }
      // sprite is beyond the right edge
      else if (sprite.x > canvas.width + sprite.radius) {
        sprite.x = 0 - sprite.radius;
      }
      // sprite is beyond the top edge
      if (sprite.y < -sprite.radius) {
        sprite.y = canvas.height + sprite.radius;
      }
      // sprite is beyond the bottom edge
      else if (sprite.y > canvas.height + sprite.radius) {
        sprite.y = -sprite.radius;
      }
    });
    // collision detection
    for (let i = 0; i < sprites.length; i++) {
    // only check for collision against asteroids
    if (sprites[i].type === 'asteroid') {
      for (let j = 0; j < sprites.length; j++) {
        // don't check asteroid vs. asteroid collisions
        if (sprites[j].type !== 'asteroid') {
          let asteroid = sprites[i];
          let sprite = sprites[j];
          // circle vs. circle collision detection
          let dx = asteroid.x - sprite.x;
          let dy = asteroid.y - sprite.y;
          if (Math.hypot(dx, dy) < asteroid.radius + sprite.radius) {
            loop.stop();
            let endTime = new Date();
            let time = (endTime - startTime) / 1000;
            alert('GAME OVER! You managed to survived for ' + time + ' seconds');
            window.location = '';
          }
        }
      }
    }
  }     
    sprites = sprites.filter(sprite => sprite.isAlive());
  },
  render() {
    sprites.map(sprite => sprite.render());
  }
});
loop.start();
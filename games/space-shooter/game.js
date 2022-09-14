// game
function sound(src) {
  this.sound = document.createElement('audio');
  this.sound.src = src;
  this.sound.setAttribute('preload', 'auto');
  this.sound.style.display = 'none';
  document.body.appendChild(this.sound);
  this.play = function() {
    this.sound.play();
  };
  this.stop = function() {
    this.sound.pause();
  };
}

function collision() {
  for (let i = 0; i < sprites.length; i++) {
    if (sprites[i].type === 'alien') {
      for (let j = 0; j < sprites.length; j++) {
        if (sprites[j].type !== 'alien' && sprites[j].type !== 'star') {
          let alien = sprites[i];
          let sprite = sprites[j];

          let dx = alien.x - sprite.x;
          let dy = alien.y - sprite.y;

          if (Math.hypot(dx, dy) < alien.radius + sprite.radius) {
            sounds.hit.play();
            alien.ttl = 0;
            sprite.ttl = 0;

            if (alien.radius > pad / 8) {
              createAlien(alien.x, alien.y, alien.radius / 2);
            }

            if (sprite.type === 'ship') {
              gameState.over('Game Over <br /> You Lost :(');
              gameState.isOver = true;
            }
            break;
          }
        }
      }
    }
  }
}

let gameState = {
  isOver: false,
  over: function(txt) {
    let dialog = document.querySelector('.dialog');
    let msg = document.querySelector('.msg');
    dialog.style.display = 'block';
    msg.innerHTML = txt;
  },
};

let sounds = {
  shoot: new sound('shoot.wav'),
  hit: new sound('hit.wav'),
};

let {canvas} = kontra.init();

let isWide = window.innerWidth > 500;
let xunits = isWide ? 500 : window.innerWidth - 20;
let yunits = isWide ? window.innerHeight - 20 : window.innerHeight - 60;

canvas.width = xunits;
canvas.height = yunits;

let sprites = [];

let loop = kontra.GameLoop({
  update() {
    let isGameWon = sprites.filter(s => s.type === 'alien').length === 0;
    if (isGameWon && !gameState.isOver) {
      gameState.over('Game Over <br /> You Won !!');
      gameState.isOver = true;
    }

    sprites.map(sprite => {
      sprite.update();
      if (sprite.x < -sprite.radius) {
        sprite.x = canvas.width + sprite.radius;
      } else if (sprite.x > canvas.width + sprite.radius) {
        sprite.x = 0 - sprite.radius;
      }
      if (sprite.y < -sprite.radius) {
        sprite.y = canvas.height + sprite.radius;
      } else if (sprite.y > canvas.height + sprite.radius) {
        sprite.y = -sprite.radius;
        if (sprite.type === 'alien') {
          gameState.over('Game Over <br / > You Lost :(');
          gameState.isOver = true;
        }
      }
    });

    collision();

    sprites = sprites.filter(sprite => sprite.isAlive());
  },
  render() {
    sprites.map(sprite => sprite.render());
  },
});

loop.start();

let pad = xunits / 6;
let r = pad / 4;

function createAlien(x, y, radius) {
  let alien = kontra.Sprite({
    type: 'alien',
    x,
    y,
    dy: 0.2,
    radius,
    render() {
      this.context.fillStyle = 'purple';
      this.context.beginPath();
      this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      this.context.fill();
    },
  });
  sprites.push(alien);
}

for (let i = 0; i < 15; i++) {
  let {rx, ry, c} = ri(i);
  let xpos = pad + rx * pad;
  let ypos = pad + (ry * pad) / 2;
  createAlien(xpos, ypos, r, c);
}

function ri(i) {
  if (i < 5) {
    return {rx: i, ry: 0};
  } else if (i >= 5 && i < 9) {
    return {rx: i - 4.5, ry: 1};
  } else if (i >= 9 && i < 12) {
    return {rx: i - 8, ry: 2};
  } else if (i >= 12 && i < 14) {
    return {rx: i - 10.5, ry: 3};
  } else {
    return {rx: i - 12, ry: 4};
  }
}

kontra.initKeys();

let ship = kontra.Sprite({
  type: 'ship',
  x: xunits / 2 - 15,
  y: yunits - 20,
  radius: 22,
  dt: 0,
  render() {
    this.context.strokeStyle = 'white';
    this.context.beginPath();
    this.context.moveTo(this.x, this.y);
    this.context.lineTo(this.x + 15, this.y - 22);
    this.context.lineTo(this.x + 30, this.y);
    this.context.closePath();
    this.context.stroke();
  },
  update() {
    if (kontra.keyPressed('left')) {
      this.x -= 5;
    } else if (kontra.keyPressed('right')) {
      this.x += 5;
    }
    this.advance();
    this.dt += 1 / 60;
    if (kontra.keyPressed('down') && this.dt > 0.25) {
      sounds.shoot.play();
      this.dt = 0;
      let bullet = kontra.Sprite({
        color: 'yellow',
        x: this.x + 14,
        y: this.y - 23,
        dy: -12,
        ttl: 45,
        radius: 2,
        width: 2,
        height: 5,
      });
      sprites.push(bullet);
    }
  },
});
sprites.push(ship);

function createStar() {
  let star = kontra.Sprite({
    type: 'star',
    x: Math.random() * xunits,
    y: Math.random() * yunits,
    dx: Math.random() / 10,
    dy: Math.random() / 10,
    radius: 1,
    render() {
      this.context.strokeStyle = 'white';
      this.context.beginPath();
      this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      this.context.stroke();
    },
  });
  sprites.push(star);
}

for (let i = 0; i < 100; i++) {
  createStar();
}

function shootFromDom() {
  if (!gameState.isOver) {
    sounds.shoot.play();
    ship.dt = 0;
    sprites.push(
      kontra.Sprite({
        color: 'yellow',
        x: ship.x + 14,
        y: ship.y - 23,
        dy: -12,
        ttl: 45,
        radius: 2,
        width: 2,
        height: 5,
      }),
    );
  }
}

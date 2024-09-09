const BLOCK_NUM_HEIGHT = 15;
const BLOCK_NUM_WIDTH = 15;
const BACK_GROUND_COLOR = 'white';

// Block per second
const ENEMY_SPEED = 3.0;
const PLAYER_ROTATE_SPEED = 0.8;
const PLAYER_MOVE_SPEED = 4.0;
const BULLET_MOVE_SPEED = 8.0;
const BULLET_SHOT_INTERVAL = 200;  // ms

const GAME_MAP = {
  MAP_HEIGHT : 0,
  MAP_WIDTH : 0,
  BLOCK_SIZE : 0,
};

const DIRECTION = {
  UP : 0,
  RIGHT : 1,
  LEFT : 2,
  DOWN : 3,
  LEFT_UP : 4,
  RIGHT_UP : 5,
};

const KEY_STATUS = {
  UP : false,
  RIGHT : false,
  LEFT : false,
  DOWN : false,
}

// https://www.colordic.org/v
const ENEMY_COLORS = [
  '#ff0000',
  '#ff007f',
  '#ff00ff',
  '#7f00ff',
  '#0000ff',
  '#007fff',
  '#00ffff',
  '#00ff7f',
  '#00ff00',
  '#7fff00',
  '#ffff00',
  '#ff7f00',
];

let map = null;
let player = null;
let bullets = null;
let enemies = null;
let gameStatus = null;
let touchMode = 'ontouchstart' in document;

function now() {
  return new Date().getTime();
}

function drawText(ctx, text, x, y, size, em, v, h, border=false) {
  const lines = text.split('\n');
  if (lines.length === 0) {
    return;
  }

  ctx.font = `${size}px sans-serif`;
  const lineHeight = size * em;
  let sy = y;
  if (v === 'middle') {
    sy -= (lines.length - 1) * lineHeight / 2;
  } else if (v === 'bottom') {
    sy -= (lines.length - 1) * lineHeight;
  }

  const rounder = v === 'bottom' ? Math.floor : Math.ceil;
  ctx.beginPath();
  ctx.textBaseline = v;
  ctx.textAlign = h;
  if (border) {
    lines.forEach((line, i) =>
        ctx.strokeText(line, rounder(x), rounder(sy + size * em * i)));
  }
  lines.forEach((line, i) =>
      ctx.fillText(line, rounder(x), rounder(sy + size * em * i)));
}

class Position {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  static of(x, y) {
    return new Position(x, y);
  }

  slide(l, r) {
    let p = this.slideN(l, r);
    this.x = p.x;
    this.y = p.y;
    return this;
  }

  slideN(l, r) {
    let x = l * Math.cos(r) + this.x;
    let y = l * Math.sin(r) + this.y;
    return Position.of(x, y);
  }

  move(dx, dy) {
    this.x += dx;
    this.y += dy;
    return this;
  }
}

class Player {
  constructor(ctx) {
    this.ctx = ctx;
    this.h = 0;
    this.v = 0;
    this.p = Position.of(GAME_MAP.MAP_WIDTH / 2, GAME_MAP.MAP_HEIGHT / 2);
    this.radian = Math.PI / 2;
    this.radius = GAME_MAP.BLOCK_SIZE / 4;
    this.updatePartsPosition();
    this.lastMovedAt = now();

    // for touch mode
    this.targetRadian = null;
  }

  updateDirection(h, v) {
    this.h = h;
    this.v = v;
  }

  updateTargetRadian(rad) {
    this.targetRadian = rad;
  }

  updatePartsPosition() {
    this.bow = this.p.slideN(GAME_MAP.BLOCK_SIZE / 1.2, this.radian);
    this.stemR = this.p.slideN(GAME_MAP.BLOCK_SIZE / 2.3, this.radian + Math.PI * 2.9 / 4);
    this.stemL = this.p.slideN(GAME_MAP.BLOCK_SIZE / 2.3, this.radian + Math.PI * 5.1 / 4);
  }

  putInBox(width, height) {
    let x = this.p.x;
    let y = this.p.y;
    if (x < this.radius) {
      x = this.radius;
    } else if (x > (width - this.radius)) {
      x = width - this.radius;
    }
    if (y < this.radius) {
      y = this.radius;
    } else if (y > (height - this.radius)) {
      y = height - this.radius;
    }
    this.p.x = x;
    this.p.y = y;
  }

  updatePosition() {
    if (gameStatus.isGameOver) return;
    let cur = now();
    let dt = (cur - this.lastMovedAt) / 1000.0;
    if (touchMode) {
      if (this.targetRadian !== null) {
        let s1 = Math.sin(this.targetRadian - this.radian);
        this.h = s1 > 0 ? 1 : -1;
        this.radian += this.h * 2 * Math.PI * PLAYER_ROTATE_SPEED * dt;
        let s2 = Math.sin(this.targetRadian - this.radian);
        if ((s1 >= 0 && s2 <= 0) || (s1 <= 0 && s2 >= 0)) {
          this.radian = this.targetRadian;
        }
        this.v = 1;
      } else {
        this.h = 0;
        this.v = 0;
      }
    } else {
      this.radian += this.h * 2 * Math.PI * PLAYER_ROTATE_SPEED * dt;
    }
    let dl = this.v * GAME_MAP.BLOCK_SIZE * PLAYER_MOVE_SPEED * dt;
    this.p.slide(dl, this.radian);
    this.putInBox(GAME_MAP.MAP_WIDTH, GAME_MAP.MAP_HEIGHT);
    this.updatePartsPosition();
    const self = this;
    if (enemies.enemies.find(e => e.isCollision(self))) {
      gameStatus.gameOver();
    }
    this.lastMovedAt = cur;
  }

  draw() {
    this.ctx.clearRect(0, 0, GAME_MAP.MAP_WIDTH, GAME_MAP.MAP_HEIGHT);
    if (gameStatus.isGameOver) {
      return;
    }
    this.ctx.beginPath();
    this.ctx.fillStyle = "white";
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 2;
    this.ctx.shadowColor = "black";
    this.ctx.shadowOffsetX = 5;
    this.ctx.shadowOffsetY = 5;
    this.ctx.shadowBlur = 10;
    this.ctx.moveTo(this.bow.x, this.bow.y);
    this.ctx.lineTo(this.stemR.x, this.stemR.y);
    this.ctx.lineTo(this.stemL.x, this.stemL.y);
    this.ctx.closePath();
    this.ctx.stroke();
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.fillStyle = "white";
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.shadowColor = 'rgba(255, 255, 255, 0)';
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;
    this.ctx.shadowBlur = 0;
    this.ctx.arc(
        this.p.x,
        this.p.y,
        this.radius,
        0,
        2 * Math.PI,
        true);
    this.ctx.stroke();
  }
}

class Bullets {
  constructor(ctx) {
    this.ctx = ctx;
    this.bullets = [];
    this.lastMovedAt = now();
    this.timer = null;
  }

  startShouting() {
    const self = this;
    let func = () => {
      self.timer = setTimeout(() => {
        self.addBullet(player.bow.x, player.bow.y, player.radian);
        func();
      }, BULLET_SHOT_INTERVAL);
    };
    this.timer = setTimeout(func, 0);
  }

  addBullet(x, y, radian) {
    this.bullets.push(new Bullet(this.ctx, x, y, radian));
  }

  blastBullet(b) {
    this.bullets = this.bullets.filter(a => a !== b);
  }

  updatePositions() {
    let cur = now();
    let dt = (cur - this.lastMovedAt) / 1000.0;
    this.bullets = this.bullets
        .map(bullet => bullet.updatePosition(dt))
        .filter(bullet => !bullet.isOverBox(GAME_MAP.MAP_WIDTH, GAME_MAP.MAP_HEIGHT));
    this.lastMovedAt = cur;
  }

  draw() {
    this.ctx.clearRect(0, 0, GAME_MAP.MAP_WIDTH, GAME_MAP.MAP_HEIGHT);
    this.bullets.forEach(bullet => bullet.draw());
  }
}

class Bullet {
  constructor(ctx, x, y, radian) {
    this.ctx = ctx;
    this.p = Position.of(x, y);
    this.radian = radian;
    this.radius = GAME_MAP.BLOCK_SIZE / 8;
  }

  isOverBox(width, height) {
    let x = this.p.x;
    let y = this.p.y;
    let r = this.radius;
    return (x < r)
        || (x > (width - r))
        || (y < r)
        || (y > (height - r));
  }

  updatePosition(dt) {
    this.p.slide(GAME_MAP.BLOCK_SIZE * BULLET_MOVE_SPEED * dt, this.radian);
    return this;
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.fillStyle = 'white';
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.shadowColor = "black";
    this.ctx.shadowOffsetX = 5;
    this.ctx.shadowOffsetY = 5;
    this.ctx.shadowBlur = 10;
    this.ctx.arc(
        this.p.x,
        this.p.y,
        this.radius,
        0,
        2 * Math.PI,
        true);
    this.ctx.stroke();
    this.ctx.fill();

    this.ctx.shadowColor = 'rgba(255, 255, 255, 0)';
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;
    this.ctx.shadowBlur = 0;
  }
}

class Vec {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(v) {  // 加算
    return new Vec(this.x + v.x, this.y + v.y);
  }

  mul(x, y) {  // 掛算
    var y = y || x;
    return new Vec(this.x * x, this.y * y);
  }

  dot(v) {  // 内積
    return this.x * v.x + this.y * v.y;
  }

  cross(v) {  // 外積
    return this.x * v.y - v.x * this.y;
  }

  move(dx, dy) {  // 自分を移動
    this.x += dx;
    this.y += dy;
  }
}

class Enemies {
  constructor(ctx) {
    this.ctx = ctx;
    this.enemies = [];
    this.interval = 1000;
    this.enemySpeed = ENEMY_SPEED;
    this.timer = null;
    this.lastMovedAt = now();
  }

  startPropagation() {
    const self = this;
    let func = () => {
      self.timer = setTimeout(() => {
        self.addEnemy();
        func();
      }, self.interval);
    };
    this.timer = setTimeout(func, 0);
  }

  addEnemy() {
    let radius = GAME_MAP.BLOCK_SIZE / 2;
    let x = Math.round(Math.random()) === 0 ? radius : GAME_MAP.MAP_WIDTH - radius;
    let y = Math.round(Math.random()) === 0 ? radius : GAME_MAP.MAP_HEIGHT - radius;
    let radian = 2 * Math.PI * Math.random();
    let vx = GAME_MAP.BLOCK_SIZE * this.enemySpeed * Math.cos(radian);
    let vy = GAME_MAP.BLOCK_SIZE * this.enemySpeed * Math.sin(radian);
    let color = ENEMY_COLORS[Math.floor(ENEMY_COLORS.length * Math.random())];
    let e = new Enemy(
        this.ctx,
        x,
        y,
        radius,
        new Vec(vx, vy),
        color);
    this.enemies.push(e);
  }

  updatePositions() {
    let cur = now();
    let dt = (cur - this.lastMovedAt) / 1000.0;
    let blasted = this.enemies
        .map(enemy => enemy.moveInBox(dt))
        .filter(enemy => enemy.isBlast())
        .map(enemy => {
          map.blastEnemy(enemy);
          return enemy;
        });
    let subjugated = this.enemies.filter(enemy => enemy.isSubjugate());
    this.enemies = this.enemies
        .filter(enemy => !blasted.includes(enemy))
        .filter(enemy => !subjugated.includes(enemy));
    const self = this;
    this.enemies.forEach(e1 =>
        self.enemies
            .filter(e2 => e1 !== e2 && e1.isCollision(e2))
            .forEach(e2 => e1.resolveCollision(e2))
    );
    this.lastMovedAt = cur;
  }

  draw() {
    this.ctx.clearRect(0, 0, GAME_MAP.MAP_WIDTH, GAME_MAP.MAP_HEIGHT);
    this.enemies.forEach(enemy => enemy.draw());
  }
}

class Enemy {
  constructor(ctx, x, y, radius, velocity, color) {
    this.ctx = ctx;
    this.p = Position.of(x, y);
    this.velocity = velocity;
    this.radius = radius;
    this.color = color;
    this.remainingTime = 10.0;
  }

  move(dt) {
    this.p.move(this.velocity.x * dt, this.velocity.y * dt);
    this.remainingTime -= dt;
  }

  moveInBox(dt) {
    this.move(dt);
    this.putInBox();
    return this;
  }

  putInBox() {
    let width = GAME_MAP.MAP_WIDTH;
    let height = GAME_MAP.MAP_HEIGHT;
    let x = this.p.x;
    let y = this.p.y;
    if (x < this.radius) {
      x = this.radius * 2 - x;
      this.velocity.x = Math.abs(this.velocity.x);
    } else if (x > (width - this.radius)) {
      x = (width - this.radius) * 2 - x;
      this.velocity.x = -Math.abs(this.velocity.x);
    }
    if (y < this.radius) {
      y = this.radius * 2 - y;
      this.velocity.y = Math.abs(this.velocity.y);
    } else if (y > (height - this.radius)) {
      y = (width - this.radius) * 2 - y;
      this.velocity.y = -Math.abs(this.velocity.y);
    }
    this.p.x = x;
    this.p.y = y;
  }

  isBlast() {
    return this.remainingTime <= 0
  }

  isSubjugate() {
    const self = this;
    let bullet = bullets.bullets.find(b => self.isCollision(b));
    if (bullet) {
      bullets.blastBullet(bullet);
      return true;
    }
    return false;
  }

  resolveCollision(p2) {
    let p1 = this;

    let distance = Math.sqrt((p2.p.x - p1.p.x) ** 2 + (p2.p.y - p1.p.y) ** 2);
    let overlap = p1.radius + p2.radius - distance;
    let v = new Vec(p1.p.x - p2.p.x, p1.p.y - p2.p.y);
    let aNormUnit = v.mul(1 / distance);  // 法線単位ベクトル1
    let bNormUnit = aNormUnit.mul(-1);  // 法線単位ベクトル2

    p1.p.x += aNormUnit.x * overlap / 2;
    p1.p.y += aNormUnit.y * overlap / 2;
    p2.p.x += bNormUnit.x * overlap / 2;
    p2.p.y += bNormUnit.y * overlap / 2;

    let aTangUnit = new Vec(aNormUnit.y * -1, aNormUnit.x);  // 接線ベクトル１
    let bTangUnit = new Vec(bNormUnit.y * -1, bNormUnit.x);  // 接線ベクトル２

    let aNorm = aNormUnit.mul(aNormUnit.dot(p1.velocity));  // aベクトル法線成分
    let aTang = aTangUnit.mul(aTangUnit.dot(p1.velocity));  // aベクトル接線成分
    let bNorm = bNormUnit.mul(bNormUnit.dot(p2.velocity));  // bベクトル法線成分
    let bTang = bTangUnit.mul(bTangUnit.dot(p2.velocity));  // bベクトル接線成分

    p1.velocity = new Vec(bNorm.x + aTang.x, bNorm.y + aTang.y);
    p2.velocity = new Vec(aNorm.x + bTang.x, aNorm.y + bTang.y);
  }

  isCollision(target) {
    let d = this.radius + target.radius;
    return Math.sqrt((this.p.x - target.p.x) ** 2 + (this.p.y - target.p.y) ** 2) < d;
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.fillStyle = this.color;
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.lineWidth = 1;
    this.ctx.shadowColor = "black";
    this.ctx.shadowOffsetX = 5;
    this.ctx.shadowOffsetY = 5;
    this.ctx.shadowBlur = 10;
    this.ctx.arc(
        this.p.x,
        this.p.y,
        this.radius,
        0,
        2 * Math.PI,
        true);
    this.ctx.stroke();
    this.ctx.fill();

    this.ctx.fillStyle = 'black';
    this.ctx.lineWidth = 2;
    this.ctx.shadowColor = 'rgba(255, 255, 255, 0)';
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;
    this.ctx.shadowBlur = 0;
    drawText(
        this.ctx,
        String(Math.ceil(this.remainingTime)),
        this.p.x,
        this.p.y,
        Math.floor(GAME_MAP.BLOCK_SIZE / 1.5),
        1,
        'middle',
        'center');
  }
}

class GameMap {
  constructor(ctx) {
    this.ctx = ctx;
    this.image = null;
  }

  getWhiteRatio() {
    let whiteCount = 0;
    for (let y = 0; y < GAME_MAP.MAP_HEIGHT; y++) {
      for (let x = 0; x < GAME_MAP.MAP_WIDTH; x++) {
        let pos = (x * 4) + (y * GAME_MAP.MAP_WIDTH * 4);
        if (this.image.data[pos] === 255
          && this.image.data[pos + 1] === 255
          && this.image.data[pos + 2] === 255) {
          whiteCount++;
        }
      }
    }
    return whiteCount / (GAME_MAP.MAP_HEIGHT * GAME_MAP.MAP_WIDTH);
  }

  createMapImage() {
    this.clearMap();
    this.updateMapImage();
  }

  blastEnemy(enemy) {
    this.ctx.beginPath();
    this.ctx.fillStyle = enemy.color;
    this.ctx.arc(
        enemy.p.x,
        enemy.p.y,
        enemy.radius * 1.5,
        0,
        2 * Math.PI,
        true);
    this.ctx.fill();

    this.updateMapImage();
  }

  updateMapImage() {
    this.image = this.ctx.getImageData(0, 0, GAME_MAP.MAP_WIDTH, GAME_MAP.MAP_HEIGHT);
  }

  clearMap() {
    this.ctx.clearRect(0, 0, GAME_MAP.MAP_WIDTH, GAME_MAP.MAP_HEIGHT);
    this.ctx.fillStyle = BACK_GROUND_COLOR;
    this.ctx.fillRect(0, 0, GAME_MAP.MAP_WIDTH, GAME_MAP.MAP_HEIGHT);
  }

  draw() {
    this.ctx.clearRect(0, 0, GAME_MAP.MAP_WIDTH, GAME_MAP.MAP_HEIGHT);
    this.ctx.putImageData(this.image, 0, 0);
  }
}

class GameStatus {
  constructor(ctx) {
    this.ctx = ctx;
    this.startTime = now();
    this.isGameStart = false;
    this.isGameOver = false;
    this.clearTime = null;
    this.whiteRatio = null;
    this.score = null;
    this.levelUpTimer = null;
    this.levelUppedAt = null;
  }

  getTimeStr(dt) {
    let timeMs = `${Math.floor((dt % 1000) / 10)}0`.slice(0, 2);
    let timeS = `0${Math.floor(dt / 1000) % 60}`.slice(-2);
    let timeM = Math.floor(dt / 1000 / 60);
    return `${timeM}:${timeS}.${timeMs}`;
  }

  gameStart() {
    this.isGameStart = true;
    bullets.startShouting();
    enemies.startPropagation();
    this.startLevelUpTimer();
  }

  startLevelUpTimer() {
    const self = this;
    let func = () => {
      self.levelUpTimer = setTimeout(() => {
        self.levelUp();
        func();
      }, 20000);
    };
    this.levelUpTimer = setTimeout(func, 0);
  }

  levelUp() {
    if (enemies.interval > 200 && Math.round(Math.random())) {
      enemies.interval -= 200;
    } else {
      enemies.enemySpeed += 1.0;
    }
    this.levelUppedAt = now();
  }

  updateStatus() {
    let dt = now() - this.startTime;
    this.clearTime = this.getTimeStr(dt);

    let whiteRatio = map.getWhiteRatio();
    this.whiteRatio = Math.round(whiteRatio * 10000) / 100;

    this.score = Math.round(dt * whiteRatio / 10) / 100;
  }

  gameOver() {
    this.isGameOver = true;
    clearTimeout(bullets.timer);
    clearTimeout(this.levelUpTimer);
    this.updateStatus();
  }

  drawTitle() {
    this.ctx.clearRect(0, 0, GAME_MAP.MAP_WIDTH, GAME_MAP.MAP_HEIGHT);
    this.ctx.fillStyle = 'snow';
    this.ctx.lineWidth = 10;
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    drawText(
        this.ctx,
        'Keep white space!!',
        GAME_MAP.MAP_WIDTH / 2,
        GAME_MAP.MAP_HEIGHT / 2 - GAME_MAP.BLOCK_SIZE,
        Math.floor(GAME_MAP.BLOCK_SIZE * 1.5),
        1,
        'bottom',
        'center',
        true);

    this.ctx.fillStyle = 'snow';
    this.ctx.lineWidth = 5;
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    drawText(
        this.ctx,
        touchMode
            ? 'Touch to start\nControl : Swipe'
            : 'Press [SPACE] to start\nControl : Arrow keys',
        GAME_MAP.MAP_WIDTH / 2,
        GAME_MAP.MAP_HEIGHT / 2 + GAME_MAP.BLOCK_SIZE,
        Math.floor(GAME_MAP.BLOCK_SIZE),
        1,
        'top',
        'center',
        true);
  }

  drawCurrentStatus() {
    this.updateStatus();

    this.ctx.clearRect(0, 0, GAME_MAP.MAP_WIDTH, GAME_MAP.MAP_HEIGHT);
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
    drawText(
        this.ctx,
        `Time : ${this.clearTime}\n`
        + `White : ${this.whiteRatio} %\n`
        + `Score : ${this.score}`,
        0,
        0,
        Math.floor(GAME_MAP.BLOCK_SIZE / 2),
        1,
        'top',
        'left',
        true);

    if (this.levelUppedAt && (now() - this.levelUppedAt) < 5000) {
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      this.ctx.lineWidth = 3;
      this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
      drawText(
          this.ctx,
          'LEVEL UP!!',
          GAME_MAP.MAP_WIDTH,
          0,
          Math.floor(GAME_MAP.BLOCK_SIZE),
          1,
          'top',
          'right',
          true);
    }
  }

  drawGameOver() {
    this.ctx.clearRect(0, 0, GAME_MAP.MAP_WIDTH, GAME_MAP.MAP_HEIGHT);
    this.ctx.fillStyle = 'red';
    this.ctx.lineWidth = 10;
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    drawText(
        this.ctx,
        'GAME OVER!!',
        GAME_MAP.MAP_WIDTH / 2,
        GAME_MAP.MAP_HEIGHT / 2,
        Math.floor(GAME_MAP.BLOCK_SIZE * 2),
        1,
        'bottom',
        'center',
        true);

    this.ctx.fillStyle = 'white';
    this.ctx.lineWidth = 5;
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
    drawText(
        this.ctx,
        `Time : ${this.clearTime}\n`
            + `White : ${this.whiteRatio} %\n`
            + `Score : ${this.score}\n`
            + (touchMode ? 'Restart : Double tap' : 'Restart : [SPACE]'),
        GAME_MAP.MAP_WIDTH / 2,
        GAME_MAP.MAP_HEIGHT / 2,
        Math.floor(GAME_MAP.BLOCK_SIZE),
        1,
        'top',
        'center',
        true);
  }

  draw() {
    if (this.isGameOver) {
      this.drawGameOver();
    } else if (this.isGameStart) {
      this.drawCurrentStatus();
    } else {
      this.drawTitle();
    }
  }
}

function init() {
  if (touchMode) {
    window.addEventListener('touchstart', e => touchStart(e));
    window.addEventListener('touchmove', e => touchMove(e));
    window.addEventListener('touchend', e => touchEnd(e));
  } else {
    window.addEventListener('keydown', e => updatePlayerDirection(e, true));
    window.addEventListener('keyup', e => updatePlayerDirection(e, false));
  }

  calcMapSize();

  map = new GameMap(createCanvas());
  map.createMapImage();

  bullets = new Bullets(createCanvas());
  player = new Player(createCanvas());
  enemies = new Enemies(createCanvas());
  gameStatus = new GameStatus(createCanvas());

  requestAnimationFrame(update);
}

window.addEventListener('load', init);

function resizeCanvas(canvas) {
  canvas.style.height = GAME_MAP.MAP_HEIGHT;
  canvas.height = GAME_MAP.MAP_HEIGHT;
  canvas.style.width = GAME_MAP.MAP_WIDTH;
  canvas.width = GAME_MAP.MAP_WIDTH;
}

function calcMapSize() {
  let rw = window.innerWidth;
  let rh = window.innerHeight;
  let sw = rw / BLOCK_NUM_WIDTH;
  let sh = rh / BLOCK_NUM_HEIGHT;
  let blockSize = sw < sh ? sw : sh;

  GAME_MAP.BLOCK_SIZE = blockSize;
  GAME_MAP.MAP_WIDTH = Math.floor(BLOCK_NUM_WIDTH * blockSize);
  GAME_MAP.MAP_HEIGHT = Math.floor(BLOCK_NUM_HEIGHT * blockSize);
}

function createCanvas() {
  const canvas = document.createElement('canvas');
  resizeCanvas(canvas);

  document.getElementById('gamepanel').appendChild(canvas);

  return canvas.getContext('2d');
}

function update() {
  requestAnimationFrame(update);

  render();
}

function render() {
  player.updatePosition();
  bullets.updatePositions();
  enemies.updatePositions();

  map.draw();
  player.draw();
  bullets.draw();
  enemies.draw();
  gameStatus.draw();
}

function updatePlayerDirection(e, isPressed) {
  if (gameStatus.isGameOver && ' ' === e.key) {
    location.href = location.href;
  }
  if (!gameStatus.isGameStart && ' ' === e.key) {
    gameStatus.gameStart();
  }
  switch (e.keyCode) {
    case 37: KEY_STATUS.LEFT = isPressed; break;
    case 38: KEY_STATUS.UP = isPressed; break;
    case 39: KEY_STATUS.RIGHT = isPressed; break;
    case 40: KEY_STATUS.DOWN = isPressed; break;
  }
  let h = (KEY_STATUS.RIGHT ? 1 : 0) + (KEY_STATUS.LEFT ? -1 : 0);
  let v = (KEY_STATUS.UP ? 1 : 0) + (KEY_STATUS.DOWN ? -1 : 0);
  player.updateDirection(h, v);
}

let touchStartX = 0;
let touchStartY = 0;
let isFastTouch = false;
let swipeThreshold = 10;
function touchStart(e) {
  if (gameStatus.isGameOver) {
    if (isFastTouch) {
      location.href = location.href;
    } else {
      isFastTouch = true;
      setTimeout(() => isFastTouch = false, 500);
    }
  } else if (!gameStatus.isGameStart) {
    gameStatus.gameStart();
  }
  touchStartX = e.touches[0].pageX;
  touchStartY = e.touches[0].pageY;
  touchMoveX = touchStartX;
  touchMoveY = touchStartY;
}

let touchMoveX = 0;
let touchMoveY = 0;
function touchMove(e) {
  let currentX = e.changedTouches[0].pageX;
  let currentY = e.changedTouches[0].pageY;
  let dx = currentX - touchStartX;
  let dy = currentY - touchStartY;
  if (Math.abs(dx) <= swipeThreshold
      || Math.abs(dy) <= swipeThreshold) {
    console.log(`dx : ${dx}, dy : ${dy}`);
    player.updateTargetRadian(null);
  } else if (Math.abs(currentX - touchMoveX) > swipeThreshold
      || Math.abs(currentY - touchMoveY) > swipeThreshold) {
    console.log(`x : ${currentX - touchMoveX}, y : ${currentY - touchMoveY}`);
    touchMoveX = currentX;
    touchMoveY = currentY;
    player.updateTargetRadian(Math.atan2(dy, dx));
  }
}

function touchEnd() {
  player.updateTargetRadian(null);
}

const BLOCK_NUM_HEIGHT = 23;
const BLOCK_NUM_WIDTH = 20;
const BACK_GROUND_COLOR = '#404040';

const TOUCH_SPACE_SIZE_MIN = 5;
const EXPLOSION_R_MAX = 2;

// Block per second
const HORIZONTAL_SPEED = 0.2;
const VERTICAL_SPEED = 0.2;
const MAP_MOVE_SPEED = 0.25;
const EXPLOSION_SPEED = 0.2;

var GAME_MAP = {
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

const DUG_STATUS = {
  SKY : 0,
  DUG : 1,
  GROUND : 2,
  CAVITY : 3,
};

const BOMB_STATUS = {
  NONE : 0,
  // Around boms : 1 - 8,
  BOMB : 255,
};
const BOMB_NUM_COLOR = [
  "#FFFFFF",  // 0(not use)
  "#00FFFF",  // 1
  "#00FFBF",  // 2
  "#BFFF00",  // 3
  "#FFFF00",  // 4
  "#FFBF00",  // 5
  "#FF7F00",  // 6
  "#FF3F00",  // 7
  "#FF0000",  // 8
];

var background;
var map;
var player;
var nextMap;
var isGameOver = false;
var isClear = false;
var toNextGame = false;

class Player {
  constructor(x, y, direction, color, ctx, image) {
    this.x = x;
    this.y = y;
    this.rx = x * GAME_MAP.BLOCK_SIZE;
    this.ry = y * GAME_MAP.BLOCK_SIZE;
    this.direction = direction;
    this.preX = this.x;
    this.preY = this.y;
    this.prerX = this.rx;
    this.prerY = this.ry;
    this.preDirection = direction;
    this.color = color;
    this.ctx = ctx;
    this.images = image;
    this.isMoving = false;
    this.lastMoveTime = 0;
  }

  isJumping() {
    return false;
  }

  allowMoved(preX, preY, preDirection) {
    if (isGameOver) return false;
    if (isClear) return false;
    if (toNextGame) return false;
    if (this.isMoving) return false;

    return true;
  }

  preMove(dx, dy, direction) {
    var preX = this.x + dx;
    var preY = this.y + dy;
    if (!this.allowMoved(preX, preY, direction)) return;

    if (preX < 0) preX = 0;
    if (preX >= BLOCK_NUM_WIDTH) preX = BLOCK_NUM_WIDTH - 1;
    if (preY < 0) preY = 0;
    if (preY >= BLOCK_NUM_HEIGHT) preY = BLOCK_NUM_HEIGHT - 1;

    if (map.existsBlock(preX, preY)) {
      this.preDirection = direction;
      this.direction = direction;
      map.dig(preX, preY);
      return;
    }

    if (this.direction == DIRECTION.UP) {
      if (direction == DIRECTION.LEFT) direction = DIRECTION.LEFT_UP;
      if (direction == DIRECTION.RIGHT) direction = DIRECTION.RIGHT_UP;
    }

    this.preX = preX;
    this.preY = preY;
    this.prerX = preX * GAME_MAP.BLOCK_SIZE;
    this.prerY = preY * GAME_MAP.BLOCK_SIZE;
    this.preDirection = direction;
    this.isMoving = true;
    this.lastMoveTime = new Date().getTime();
  }

  updateCurrentCoordinate() {
    if (!this.isMoving) {
      return;
    }

    var currentTime = new Date().getTime();
    var dt = (currentTime - this.lastMoveTime) / 1000.0;

    var dx = GAME_MAP.BLOCK_SIZE * HORIZONTAL_SPEED * dt;
    var dy = GAME_MAP.BLOCK_SIZE * VERTICAL_SPEED * dt;
    if (this.x > this.preX) dx *= -1;
    if (this.y > this.preY) dy *= -1;
    var tmpX = this.x + dx;
    var tmpY = this.y + dy;

    if ((dx > 0 && tmpX > this.preX) || (dx < 0 && tmpX < this.preX)) tmpX = this.preX;
    if ((dy > 0 && tmpY > this.preY) || (dy < 0 && tmpY < this.preY)) tmpY = this.preY;
    this.x = tmpX;
    this.y = tmpY;
    this.rx = tmpX * GAME_MAP.BLOCK_SIZE;
    this.ry = tmpY * GAME_MAP.BLOCK_SIZE;

    if (this.x == this.preX && this.y == this.preY) {
      this.isMoving = false;
      if (this.y >= (BLOCK_NUM_HEIGHT - 2)) {
        isClear = true;
        setTimeout(function() {nextMap.toNext();}, 0);
      }
    }
  }

  resizeCanvas() {
    this.rx = this.x * GAME_MAP.BLOCK_SIZE;
    this.ry = this.y * GAME_MAP.BLOCK_SIZE;
    this.prerX = this.preX * GAME_MAP.BLOCK_SIZE;
    this.prerY = this.preY * GAME_MAP.BLOCK_SIZE;
  }

  draw() {
    this.updateCurrentCoordinate();

    this.ctx.clearRect(0, 0, GAME_MAP.MAP_WIDTH, GAME_MAP.MAP_HEIGHT);

    // Shoulder
    this.ctx.beginPath();
    this.ctx.fillStyle = "whitesmoke";
    this.ctx.arc(
      this.rx + GAME_MAP.BLOCK_SIZE * 5 / 10,
      this.ry + GAME_MAP.BLOCK_SIZE * 6 / 10,
      GAME_MAP.BLOCK_SIZE * 2 / 10,
      0,
      Math.PI,
      true);
    // Body
    this.ctx.fillRect(
      this.rx + GAME_MAP.BLOCK_SIZE * 3 / 10,
      this.ry + GAME_MAP.BLOCK_SIZE * 6 / 10,
      GAME_MAP.BLOCK_SIZE * 4 / 10,
      GAME_MAP.BLOCK_SIZE * 4 / 10);
    this.ctx.fill();
    // Head
    this.ctx.beginPath();
    this.ctx.fillStyle = "chocolate";
    this.ctx.arc(
      this.rx + GAME_MAP.BLOCK_SIZE * 5 / 10,
      this.ry + GAME_MAP.BLOCK_SIZE * 3 / 10,
      GAME_MAP.BLOCK_SIZE * 2 / 10,
      0,
      2 * Math.PI,
      true);
    this.ctx.fill();
    // Pickaxe handle
    this.ctx.beginPath();
    this.ctx.fillStyle = "saddlebrown";
    this.ctx.lineWidth = GAME_MAP.BLOCK_SIZE * 1 / 10;
    this.ctx.moveTo(
      this.rx + GAME_MAP.BLOCK_SIZE * 1 / 10,
      this.ry + GAME_MAP.BLOCK_SIZE * 3 / 10);
    this.ctx.lineTo(
      this.rx + GAME_MAP.BLOCK_SIZE * 8 / 10,
      this.ry + GAME_MAP.BLOCK_SIZE * 8 / 10);
    this.ctx.closePath();
    this.ctx.stroke();
    // Pickaxe
    this.ctx.beginPath();
    this.ctx.fillStyle = "white";
    this.ctx.arc(
      this.rx + GAME_MAP.BLOCK_SIZE * 8 / 10,
      this.ry + GAME_MAP.BLOCK_SIZE * 8 / 10,
      GAME_MAP.BLOCK_SIZE * 7 / 10,
      185 * Math.PI / 180,
      240 * Math.PI / 180,
      false);
    this.ctx.stroke();
  };
}

class BombMap {
  constructor(ctx) {
    this.ctx = ctx;
    this.stageNum = 1;
    this.stageNumString = "";
    this.bombNum = 10;
    this.boms = [];
    this.clearBombs();
    this.bomsNumString = "";
    this.explosionR = 0;
    this.lastTime = 0;
  }

  clearBombs() {
    for (var x = 0; x < BLOCK_NUM_WIDTH; x++) {
      this.boms[x] = [];
      for (var y = 0; y < BLOCK_NUM_HEIGHT; y++) {
        this.boms[x][y] = BOMB_STATUS.NONE;
      }
    }
  }

  rand(min, max) {
    // min <= rand < max
    return Math.floor(Math.random() * (max - min)) + min;
  }

  createBombRandom() {
    this.clearBombs();
    var i = 0;
    while (i < this.bombNum) {
      var bombX = this.rand(0, BLOCK_NUM_WIDTH);
      var bombY = this.rand(2, BLOCK_NUM_HEIGHT - 2);
      if (this.boms[bombX][bombY] == BOMB_STATUS.BOMB) continue;
      this.boms[bombX][bombY] = BOMB_STATUS.BOMB;
      i++;

      for (var y = bombY - 1; y <= bombY + 1; y++) {
        for (var x = bombX - 1; x <= bombX + 1; x++) {
          if (x < 0 || BLOCK_NUM_WIDTH <= x) continue;
          if (y < 0 || BLOCK_NUM_HEIGHT <= y) continue;
          if (this.boms[x][y] == BOMB_STATUS.BOMB) continue;
          this.boms[x][y]++;
        }
      }
    }
    this.stageNumString = `Stage : ${this.stageNum}`;
    this.bomsNumString = `Bombs x ${this.bombNum}`;
  }

  existsBomb(x, y) {
    return this.boms[x][y] == BOMB_STATUS.BOMB;
  }

  updateExplosionR() {
    var currentTime = new Date().getTime();
    var dt = (currentTime - this.lastTime) / 1000.0;

    var dr = GAME_MAP.BLOCK_SIZE * EXPLOSION_SPEED * dt;
    this.explosionR += dr;
    if (this.explosionR > EXPLOSION_R_MAX) {
      this.explosionR = EXPLOSION_R_MAX;
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, GAME_MAP.MAP_WIDTH, GAME_MAP.MAP_HEIGHT);
    this.ctx.textBaseline = 'middle';
    this.ctx.textAlign = 'center';
    this.ctx.font = GAME_MAP.BLOCK_SIZE + "px serif";

    var halfSize = Math.round(GAME_MAP.BLOCK_SIZE / 2);
    for (var x = 0; x < BLOCK_NUM_WIDTH; x++) {
      for (var y = 1; y < BLOCK_NUM_HEIGHT - 2; y++) {
        var s = this.boms[x][y];
        if (s == BOMB_STATUS.NONE) continue;
        if (s == BOMB_STATUS.BOMB) continue;
        if (map.existsBlock(x, y)) continue;

        this.ctx.fillStyle = BOMB_NUM_COLOR[s];

        var rx = x * GAME_MAP.BLOCK_SIZE + halfSize;
        var ry = y * GAME_MAP.BLOCK_SIZE + halfSize;
        this.ctx.fillText(s, rx, ry);
      }
    }

    this.ctx.textBaseline = 'top';
    this.ctx.textAlign = 'left';
    this.ctx.font = GAME_MAP.BLOCK_SIZE + "px serif";
    this.ctx.fillStyle = "tomato";
    this.ctx.fillText(this.stageNumString, 0, 0);

    this.ctx.textBaseline = 'top';
    this.ctx.textAlign = 'left';
    this.ctx.font = GAME_MAP.BLOCK_SIZE + "px serif";
    this.ctx.fillStyle = "tomato";
    this.ctx.fillText(
        this.bomsNumString,
        GAME_MAP.MAP_WIDTH - this.ctx.measureText(this.bomsNumString).width,
        0);

    if (isGameOver) {
      this.updateExplosionR();
      this.ctx.arc(
          (map.endX * GAME_MAP.BLOCK_SIZE) + GAME_MAP.BLOCK_SIZE / 2,
          (map.endY * GAME_MAP.BLOCK_SIZE) + GAME_MAP.BLOCK_SIZE / 2,
          this.explosionR * GAME_MAP.BLOCK_SIZE,
          0 * Math.PI / 180,
          360 * Math.PI / 180,
          false);
      this.ctx.fillStyle = "red";
      this.ctx.fill();
      this.ctx.textBaseline = 'middle';
      this.ctx.textAlign = 'center';
      this.ctx.font = (GAME_MAP.BLOCK_SIZE * 2.5) + "px bold serif";
      this.ctx.fillStyle = "black";
      this.ctx.fillText(
          "GAME OVER !!",
          GAME_MAP.MAP_WIDTH / 2,
          GAME_MAP.MAP_HEIGHT / 2);
    }
  }
}

class GameMap {
  constructor(ctx) {
    this.ctx = ctx;
    this.image = null;
    this.isAdoveGround = true;
    this.dugMap = [];
    this.initDugMap();
    this.endX = 0;
    this.endY = 0;
  }

  initDugMap() {
    for (var x = 0; x < BLOCK_NUM_WIDTH; x++) {
      this.dugMap[x] = [];
      for (var y = 0; y < BLOCK_NUM_HEIGHT; y++) {
        this.dugMap[x][y] = DUG_STATUS.GROUND;
      }
    }
    var topBlockStatus = this.isAdoveGround ? DUG_STATUS.SKY : DUG_STATUS.CAVITY;
    for (var x = 0; x < BLOCK_NUM_WIDTH; x++) {
      this.dugMap[x][0] = topBlockStatus;
      this.dugMap[x][BLOCK_NUM_HEIGHT - 2] = DUG_STATUS.CAVITY;
    }
  }

  drawLine(x1, y1, x2, y2) {
    // this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.strokeStyle = 'silver';
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
  }

  drawGround() {
    var img = document.getElementById('ground_image');
    for (var yOffset = 0; yOffset <= GAME_MAP.MAP_HEIGHT; yOffset += img.height) {
      for (var xOffset = 0; xOffset <= GAME_MAP.MAP_WIDTH; xOffset += img.width) {
        this.ctx.drawImage(img, xOffset, yOffset, img.width, img.height);
      }
    }
  }

  drawGrid() {
    for (var yOffset = GAME_MAP.BLOCK_SIZE; yOffset < GAME_MAP.MAP_HEIGHT - 1; yOffset += GAME_MAP.BLOCK_SIZE) {
      this.drawLine(0, yOffset, GAME_MAP.MAP_WIDTH, yOffset);
    }
    for (var xOffset = GAME_MAP.BLOCK_SIZE; xOffset < GAME_MAP.MAP_WIDTH - 1; xOffset += GAME_MAP.BLOCK_SIZE) {
      this.drawLine(xOffset, 0, xOffset, GAME_MAP.MAP_HEIGHT);
    }
  }

  drawSky() {
    if (this.isAdoveGround) {
      // this.ctx.beginPath();
      this.ctx.fillStyle = 'skyblue';
      this.ctx.fillRect(
        0,
        0,
        GAME_MAP.MAP_WIDTH,
        GAME_MAP.BLOCK_SIZE);
    }
  }

  drawGrass() {
    if (this.isAdoveGround) {
      // this.ctx.beginPath();
      this.ctx.fillStyle = 'green';
      this.ctx.fillRect(
        0,
        GAME_MAP.BLOCK_SIZE,
        GAME_MAP.MAP_WIDTH,
        GAME_MAP.BLOCK_SIZE / 2);
    }
  }

  drawDefaultMapImage() {
    this.ctx.clearRect(0, 0, GAME_MAP.MAP_WIDTH, GAME_MAP.MAP_HEIGHT);

    this.drawGround();
    this.drawGrass();
    this.drawGrid();
    this.drawSky();
  }

  createMapImage() {
    this.initDugMap();
    this.drawDefaultMapImage();
    this.image = this.ctx.getImageData(0, 0, GAME_MAP.MAP_WIDTH, GAME_MAP.MAP_HEIGHT);
  }

  resizeMapImage() {
    this.drawDefaultMapImage();
    this.image = this.ctx.getImageData(0, 0, GAME_MAP.MAP_WIDTH, GAME_MAP.MAP_HEIGHT);
  }

  dig(x, y) {
    this.dugMap[x][y] = DUG_STATUS.DUG;
    if (bombMap.existsBomb(x, y)) {
      isGameOver = true;
      this.endX = x;
      this.endY = y;
      bombMap.lastTime = new Date().getTime();
    }
  }

  existsBlock(x, y) {
    return this.dugMap[x][y] == DUG_STATUS.GROUND;
  }

  clearDugBlocks() {
    for (var x = 0; x < BLOCK_NUM_WIDTH; x++) {
      for (var y = 0; y < BLOCK_NUM_HEIGHT; y++) {
        if (this.dugMap[x][y] == DUG_STATUS.DUG ||
            this.dugMap[x][y] == DUG_STATUS.CAVITY) {
          this.clearDugBlock(x, y);
        }
      }
    }
  }

  clearDugBlock(x, y) {
    this.ctx.fillStyle = BACK_GROUND_COLOR;
    this.ctx.fillRect(
      (x * GAME_MAP.BLOCK_SIZE) + 1,
      (y * GAME_MAP.BLOCK_SIZE) + 1,
      GAME_MAP.BLOCK_SIZE - 2,
      GAME_MAP.BLOCK_SIZE - 2);
  }

  draw() {
    this.ctx.clearRect(0, 0, GAME_MAP.MAP_WIDTH, GAME_MAP.MAP_HEIGHT);
    this.ctx.putImageData(this.image, 0, 0);
    this.clearDugBlocks();
  }
}

class NextGameMap {
  constructor(ctx) {
    this.ctx = ctx;
    this.width = BLOCK_NUM_WIDTH * GAME_MAP.BLOCK_SIZE;
    this.height = (BLOCK_NUM_HEIGHT * 2 - 2) * GAME_MAP.BLOCK_SIZE;
    this.nextMapOffsetY = (BLOCK_NUM_HEIGHT - 2) * GAME_MAP.BLOCK_SIZE;
    this.image = new ImageData(this.width, this.height);
    this.offset = 0;
    this.lastMoveTime = 0;

    var tmpCanvas = document.createElement('canvas');
    tmpCanvas.style.height = this.height;
    tmpCanvas.height = this.height;
    tmpCanvas.style.width = this.width;
    tmpCanvas.width = this.width;
    this.tmpCtx = tmpCanvas.getContext('2d');
    this.tmpCanvas = tmpCanvas;
    this.timeId = null;
  }

  toNext() {
    this.offset = 0;
    this.createImage();
    this.lastMoveTime = new Date().getTime();
    toNextGame = true;
  }

  createImage() {
    this.tmpCtx.clearRect(0, 0, this.width, this.height);
    var nextImage = map.image;
    var offsetPos = this.nextMapOffsetY * GAME_MAP.MAP_WIDTH * 4;
    for (var y = 0; y < GAME_MAP.MAP_HEIGHT; y++) {
      for (var x = 0; x < GAME_MAP.MAP_WIDTH; x++) {
        var pos = (x * 4) + (y * GAME_MAP.MAP_WIDTH * 4);
        var a = nextImage.data[pos + 3];
        if (a == 0) continue;
        var r = nextImage.data[pos];
        var g = nextImage.data[pos + 1];
        var b = nextImage.data[pos + 2];
        this.image.data[offsetPos + pos] = r;
        this.image.data[offsetPos + pos + 1] = g;
        this.image.data[offsetPos + pos + 2] = b;
        this.image.data[offsetPos + pos + 3] = a;
      }
    }
    var curImageArray = [];
    curImageArray.push(map.ctx.getImageData(0, 0, GAME_MAP.MAP_WIDTH, GAME_MAP.MAP_HEIGHT));
    curImageArray.push(bombMap.ctx.getImageData(0, 0, GAME_MAP.MAP_WIDTH, GAME_MAP.MAP_HEIGHT));
    curImageArray.push(player.ctx.getImageData(0, 0, GAME_MAP.MAP_WIDTH, GAME_MAP.MAP_HEIGHT));
    for (var y = 0; y < GAME_MAP.MAP_HEIGHT; y++) {
      for (var x = 0; x < GAME_MAP.MAP_WIDTH; x++) {
        for (var i = 0; i < curImageArray.length; i++) {
          var pos = (x * 4) + (y * GAME_MAP.MAP_WIDTH * 4);
          var a = curImageArray[i].data[pos + 3];
          if (a == 0) continue;
          var r = curImageArray[i].data[pos];
          var g = curImageArray[i].data[pos + 1];
          var b = curImageArray[i].data[pos + 2];
          this.image.data[pos] = r;
          this.image.data[pos + 1] = g;
          this.image.data[pos + 2] = b;
          this.image.data[pos + 3] = a;
        }
      }
    }
    this.tmpCtx.clearRect(0, 0, this.width, this.height);
    this.tmpCtx.putImageData(this.image, 0, 0);
  }

  updateMapOffset() {
    if (!toNextGame) return;
    var currentTime = new Date().getTime();
    var dt = (currentTime - this.lastMoveTime) / 1000.0;
    var dy = GAME_MAP.BLOCK_SIZE * MAP_MOVE_SPEED * dt;
    this.offset -= dy;
    if (this.offset <= -this.nextMapOffsetY) {
      toNextGame = false;
      isClear = false;
      initNextGame();
    }
  }

  draw() {
    this.updateMapOffset();
    this.ctx.clearRect(0, 0, GAME_MAP.MAP_WIDTH, GAME_MAP.MAP_HEIGHT);
    if (toNextGame) {
      this.ctx.putImageData(this.tmpCtx.getImageData(0, Math.floor(-this.offset), GAME_MAP.MAP_WIDTH, GAME_MAP.MAP_HEIGHT), 0, 0);
    }
  }
}

window.addEventListener('load', init);

function init() {
  window.addEventListener('keydown', movePlayer);
  // window.addEventListener('resize', resizeCanvases);

  calcMapSize();

  map = new GameMap(createCanvas());
  map.createMapImage();

  bombMap = new BombMap(createCanvas());
  bombMap.createBombRandom();
  // bombMap.draw();

  player = new Player(Math.floor(BLOCK_NUM_WIDTH / 2), 0, DIRECTION.RIGHT, 'blue', createCanvas());
  // player.draw();

  nextMap = new NextGameMap(createCanvas());
  // nextMap.draw();

  if ('ontouchstart' in document) {
    createTouchControlPads();
  }

  requestAnimationFrame(update);
}

function initNextGame() {
  player.y = 0;
  player.ry = 0;
  player.preY = 0;
  player.prerY = 0;
  bombMap.stageNum++;
  bombMap.bombNum += 5;
  bombMap.createBombRandom();
  map.isAdoveGround = false;
  map.createMapImage();
}

function resizeCanvases() {
  calcMapSize();
  var selects = document.getElementsByTagName('canvas');
  Array.prototype.forEach.call(selects, canvas => {
    resizeCanvas(canvas)
  });
  map.resizeMapImage();
  map.draw();
  bombMap.draw();
  resizeTouchControlPads();
  player.resizeCanvas();
}

function resizeCanvas(canvas) {
  canvas.style.height = GAME_MAP.MAP_HEIGHT;
  canvas.height = GAME_MAP.MAP_HEIGHT;
  canvas.style.width = GAME_MAP.MAP_WIDTH;
  canvas.width = GAME_MAP.MAP_WIDTH;
}

function calcMapSize() {
  var rw = window.innerWidth;
  var rh = window.innerHeight;
  var sw = Math.floor(rw / BLOCK_NUM_WIDTH);
  var sh = Math.floor(rh / BLOCK_NUM_HEIGHT);
  var blockSize = sw < sh ? sw : sh;

  GAME_MAP.BLOCK_SIZE = blockSize;
  GAME_MAP.MAP_WIDTH = BLOCK_NUM_WIDTH * blockSize;
  GAME_MAP.MAP_HEIGHT = BLOCK_NUM_HEIGHT * blockSize;
}

function createCanvas() {
  var canvas = document.createElement('canvas');
  resizeCanvas(canvas);

  document.getElementById('gamepanel').appendChild(canvas);

  return canvas.getContext('2d');
}

function update() {
  requestAnimationFrame(update);

  render();
}

function render() {
  map.draw();
  bombMap.draw();
  player.draw();
  nextMap.draw();
}

function moveLeft() {
  player.preMove(-1, 0, DIRECTION.LEFT);
}

function moveUp() {
  player.preMove(0, -1, DIRECTION.UP);
}

function moveRight() {
  player.preMove(1, 0, DIRECTION.RIGHT);
}

function moveDown() {
  player.preMove(0, 1, DIRECTION.DOWN);
}

function moveLeftUp() {
  player.preMove(-1, -1, DIRECTION.LEFT_UP);
}

function moveRightUp() {
  player.preMove(1, -1, DIRECTION.RIGHT_UP);
}

function movePlayer(e) {
  switch (e.keyCode) {
    case 37: moveLeft(); break;
    case 38: moveUp(); break;
    case 39: moveRight(); break;
    case 40: moveDown(); break;
  }
}

var touchControlPads = [];
function resizeTouchControlPads() {
  touchControlPads.forEach(canvas => this.resizeTouchControlPad(canvas));
}

function resizeTouchControlPad(canvas) {
  var d = canvas.dataset;
  var s = GAME_MAP.BLOCK_SIZE;
  canvas.style.top    = d.y * s;
  canvas.style.left   = d.x * s;
  canvas.style.height = d.h * s;
  canvas.height       = d.h * s;
  canvas.style.width  = d.w * s;
  canvas.width        = d.w * s;
}

function createTouchControlPad(x, y, w, h) {
  var canvas = document.createElement('canvas');

  canvas.dataset.x = x;
  canvas.dataset.y = y;
  canvas.dataset.w = w;
  canvas.dataset.h = h;
  // canvas.style.border = "solid 1px red";
  resizeTouchControlPad(canvas);

  document.getElementById('gamepanel').appendChild(canvas);

  return canvas;
}

function drawTouchPadArrow(canvas, x, y) {
  var ctx = canvas.getContext('2d');

  var x1, x2, x3, y1, y2, y3;
  var width = canvas.width;
  if (x == 0) {
    x1 = width / 2 + width * 1 / 5 * -1;
    x2 = width / 2 + width * 1 / 5 * 0;
    x3 = width / 2 + width * 1 / 5 * 1;
  } else {
    x1 = width / 2 + width * 1 / 5 * -x;
    x2 = width / 2 + width * 1 / 5 * x;
    x3 = width / 2 + width * 1 / 5 * -x;
  }
  var height = canvas.height;
  if (y == 0) {
    y1 = height / 2 + height * 1 / 5 * -1;
    y2 = height / 2 + height * 1 / 5 * 0;
    y3 = height / 2 + height * 1 / 5 * 1;
  } else {
    y1 = height / 2 + height * 1 / 5 * -y;
    y2 = height / 2 + height * 1 / 5 * y;
    y3 = height / 2 + height * 1 / 5 * -y;
  }

  ctx.beginPath();
  ctx.strokeStyle = "rgba(248, 248, 255, 0.5)";
  ctx.lineWidth = GAME_MAP.BLOCK_SIZE / 2;
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.stroke();
}

function createTouchControlPads() {
  var eventName = 'click';
  var up = createTouchControlPad(
    0,
    0,
    BLOCK_NUM_WIDTH,
    TOUCH_SPACE_SIZE_MIN);
  up.addEventListener(eventName, moveUp);

  var left = createTouchControlPad(
    0,
    TOUCH_SPACE_SIZE_MIN,
    TOUCH_SPACE_SIZE_MIN,
    BLOCK_NUM_HEIGHT - (TOUCH_SPACE_SIZE_MIN * 2));
    left.addEventListener(eventName, moveLeft);

  var right = createTouchControlPad(
    BLOCK_NUM_WIDTH - TOUCH_SPACE_SIZE_MIN,
    TOUCH_SPACE_SIZE_MIN,
    TOUCH_SPACE_SIZE_MIN,
    BLOCK_NUM_HEIGHT - (TOUCH_SPACE_SIZE_MIN * 2));
  right.addEventListener(eventName, moveRight);

  var down = createTouchControlPad(
    0,
    BLOCK_NUM_HEIGHT - TOUCH_SPACE_SIZE_MIN,
    BLOCK_NUM_WIDTH,
    TOUCH_SPACE_SIZE_MIN);
  down.addEventListener(eventName, moveDown);

  drawTouchPadArrow(up, 0, -1);
  drawTouchPadArrow(left, -1, 0);
  drawTouchPadArrow(right, 1, 0);
  drawTouchPadArrow(down, 0, 1);

  touchControlPads = [up, left, right, down];
}

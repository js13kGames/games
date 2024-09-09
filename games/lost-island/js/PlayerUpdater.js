function PlayerUpdater (options) {
  this.player = options.player;
  this.keyboard = options.keyboard;
  this.worldMap = options.worldMap;
  this.hpBar = options.hpBar;
  this.hungerTime = 0;
  this.pubSub = options.pubSub;
}

PlayerUpdater.prototype.update = function (deltaTime) {
  var destX;
  var destY;

  if (this.keyboard.keys.up) {
    this.player.velocityY = -1;
  } else if (this.keyboard.keys.down) {
    this.player.velocityY = 1;
  } else {
    this.player.velocityY = 0;
  }
  if (this.keyboard.keys.right) {
    this.player.velocityX = 1;
  } else if (this.keyboard.keys.left) {
    this.player.velocityX = -1;
  } else {
    this.player.velocityX = 0;
  }
  destX = this.player.x + this.player.velocityX * 0.1 * deltaTime;
  destY = this.player.y + this.player.velocityY * 0.1 * deltaTime;
  if (this.validateMove(destX, destY)) {
    this.player.x = destX;
    this.player.y = destY;
  }
  if (this.keyboard.keys.action) {
    this.take();
  }
  this.hunger(deltaTime);
  this.updateHpBar();
};

PlayerUpdater.prototype.validateMove = function (x, y) {
  var isValide = true;
  var tileX;
  var tileY;

  if ((x < 0) || (x > (this.worldMap.width * this.worldMap.tileSize)) ||
      (y < 0) || (y > (this.worldMap.height * this.worldMap.tileSize))) {
    isValide = false;
  } else {
    tileX = Math.floor(x / this.worldMap.tileSize);
    tileY = Math.floor(y / this.worldMap.tileSize);
    if (this.worldMap.tiles[tileX + tileY * this.worldMap.width].height <= 1) {
      isValide = false;
    }
  }
  return isValide;
};

PlayerUpdater.prototype.hunger = function (dt) {
  this.hungerTime += dt;
  if (this.hungerTime > 1000) {
    this.hungerTime -= 1000;
    this.player.hp -= 1;
  }
  if (this.player.hp <= 0) {
    this.pubSub.publish('gameOver');
  }
};

PlayerUpdater.prototype.updateHpBar = function () {
  var heartNb = Math.ceil(this.player.hp);
  var heartStr = '';
  var i;

  for (i = 0; i < heartNb; i++) {
    heartStr += '\u2764';
  }
  this.hpBar.textContent = heartStr;
};

PlayerUpdater.prototype.take = function () {
  var tiles;
  var food;
  var transmitter;
  var antenna;
  var battery;

  tiles = [
    this.worldMap.getTile(this.player.x, this.player.y),
    this.worldMap.getTile(this.player.x - 16, this.player.y - 16),
    this.worldMap.getTile(this.player.x, this.player.y - 16),
    this.worldMap.getTile(this.player.x + 16, this.player.y - 16),
    this.worldMap.getTile(this.player.x - 16, this.player.y),
    this.worldMap.getTile(this.player.x + 16, this.player.y),
    this.worldMap.getTile(this.player.x - 16, this.player.y + 16),
    this.worldMap.getTile(this.player.x, this.player.y + 16),
    this.worldMap.getTile(this.player.x + 16, this.player.y + 16)
  ];
  food = tiles.find(function (tile) {
    return tile.appleTree || tile.berryBush;
  });
  if (food) {
    delete food.appleTree;
    delete food.berryBush;
    this.player.hp += 1.2;
  }
  transmitter = tiles.find(function (tile) { return tile.transmitter; });
  if (transmitter) {
    delete transmitter.transmitter;
    delete worldMap.transmitter;
    this.player.transmitter = true;
    this.checkObjectives();
  }
  antenna = tiles.find(function (tile) { return tile.antenna; });
  if (antenna) {
    delete antenna.antenna;
    delete worldMap.antenna;
    this.player.antenna = true;
    this.checkObjectives();
  }
  battery = tiles.find(function (tile) { return tile.battery; });
  if (battery) {
    delete battery.battery;
    delete worldMap.battery;
    this.player.battery = true;
    this.checkObjectives();
  }
};

PlayerUpdater.prototype.checkObjectives = function () {
  if (this.player.transmitter && this.player.antenna && this.player.battery) {
    this.pubSub.publish('endGame');
  }
};

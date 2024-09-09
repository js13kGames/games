function PlayerRenderer (options) {
  this.player = options.player;
  this.canvas = options.canvas;
  this.sprites = options.sprites;
  this.worldMap = options.worldMap;
}

PlayerRenderer.prototype.render = function () {
  var ctx = this.canvas.getContext('2d');
  var center = {
    x: Math.floor(this.canvas.width / 2),
    y: Math.floor(this.canvas.height / 2)
  };
  var dist;

  if (worldMap.transmitter) {
    dist = Math.sqrt(Math.pow(this.player.x - this.worldMap.transmitter.x, 2) + Math.pow(this.player.y - this.worldMap.transmitter.y, 2));
  } else if (worldMap.antenna) {
    dist = Math.sqrt(Math.pow(this.player.x - this.worldMap.antenna.x, 2) + Math.pow(this.player.y - this.worldMap.antenna.y, 2));
  } else if (worldMap.battery) {
    dist = Math.sqrt(Math.pow(this.player.x - this.worldMap.battery.x, 2) + Math.pow(this.player.y - this.worldMap.battery.y, 2));
  }

  ctx.fillStyle = Colors.grey;
  ctx.fillRect(center.x - 3, center.y - 15, 8, 8);
  ctx.fillRect(center.x - 3, center.y - 7, 3, 2);
  ctx.fillRect(center.x + 2, center.y - 7, 3, 2);
  ctx.fillStyle = Colors.lightBrown;
  ctx.fillRect(center.x - 3, center.y - 5, 3, 5);
  ctx.fillRect(center.x + 2, center.y - 5, 3, 5);
  ctx.fillRect(center.x - 5, center.y - 14, 2, 6);
  ctx.fillRect(center.x + 5, center.y - 14, 2, 6);
  ctx.fillRect(center.x - 1, center.y - 16, 3, 1);
  ctx.fillRect(center.x - 2, center.y - 19, 5, 3);
  ctx.fillStyle = Colors.yellow;
  ctx.fillRect(center.x - 1, center.y - 20, 3, 1);
  if (dist < 500) {
    ctx.fillStyle = Colors.red;
  } else if (dist <  1000) {
    ctx.fillStyle = Colors.orange;
  } else if (dist < 2000) {
    ctx.fillStyle = Colors.yellow;
  } else if (dist < 3000) {
    ctx.fillStyle = Colors.blue;
  } else {
    ctx.fillStyle = Colors.darkBlue;
  }
  ctx.fillRect(center.x - 1, center.y - 13, 3, 2);
  this.renderInventory();
};

PlayerRenderer.prototype.renderInventory = function () {
  var ctx = this.canvas.getContext('2d');
  var offsetY = Math.floor(this.canvas.height / 5);

  ctx.font = '10px sans-serif';
  ctx.fillStyle = Colors.white;
  ctx.fillText(this.player.transmitter ? '1 x' : '0 x', this.canvas.width - 50, offsetY + 10);
  ctx.drawImage(this.sprites.spriteSheet,
      this.sprites.ids.transmitter.offset.x, this.sprites.ids.transmitter.offset.y, 16, 16,
      this.canvas.width - 32, offsetY, 16, 16);
  ctx.fillText(this.player.antenna ? '1 x' : '0 x', this.canvas.width - 50, offsetY + 32 + 10);
  ctx.drawImage(this.sprites.spriteSheet,
      this.sprites.ids.antenna.offset.x, this.sprites.ids.antenna.offset.y, 16, 16,
      this.canvas.width - 32, offsetY + 32, 16, 16);
  ctx.fillText(this.player.battery ? '1 x' : '0 x', this.canvas.width - 50, offsetY + 64 + 10);
  ctx.drawImage(this.sprites.spriteSheet,
      this.sprites.ids.battery.offset.x, this.sprites.ids.battery.offset.y, 16, 16,
      this.canvas.width - 32, offsetY + 64, 16, 16);
}

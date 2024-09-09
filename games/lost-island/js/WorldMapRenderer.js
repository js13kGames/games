function WorldMapRenderer (options) {
  this.worldMap = options.worldMap;
  this.sprites = options.sprites;
  this.player = options.player;
  this.canvas = options.canvas;
  this.topCanvas = options.topCanvas;
}

WorldMapRenderer.prototype.render = function () {
  var ctx = this.canvas.getContext('2d');
  var topCtx = this.topCanvas.getContext('2d');
  var tileWidth = this.canvas.width / 16 + 1;
  var tileHeight = this.canvas.height / 16 + 1;
  var tileOffsetX = Math.floor(this.player.x / 16) - Math.floor(tileWidth / 2);
  var tileOffsetY = Math.floor(this.player.y / 16) - Math.floor(tileHeight / 2);
  var len = tileHeight * tileWidth;
  var tile;
  var tileIndex;
  var tileX;
  var tileY;
  var pixelOffsetX = this.player.x % this.worldMap.tileSize;
  var pixelOffsetY = this.player.y % this.worldMap.tileSize;
  var spriteOffset;
  var i;

  topCtx.clearRect(0, 0, this.topCanvas.width, this.topCanvas.height);
  ctx.fillStyle = Colors.darkBlue;
  ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  for (i = 0; i < len; i++) {
    tileX = i % tileWidth;
    tileY = Math.floor(i / tileWidth);

    if (((tileX + tileOffsetX) >= 0) && ((tileY + tileOffsetY) >= 0)) {
      tileIndex = tileX + tileOffsetX + (tileY + tileOffsetY) * this.worldMap.width;
      if (tileIndex >= 0 && tileIndex < this.worldMap.size) {
        tile = this.worldMap.tiles[tileIndex];
        if (tile.height === 0) {
          spriteOffset = this.sprites.ids.deepOcean.offset;
        } else if (tile.height === 1) {
          spriteOffset = this.sprites.ids.ocean.offset;
        } else if (tile.height === 2) {
          spriteOffset = this.sprites.ids.coast.offset;
        } else if (tile.height === 3) {
          spriteOffset = this.sprites.ids.wetSand.offset;
        } else if (tile.height === 4) {
          spriteOffset = this.sprites.ids.sand.offset;
        } else if (tile.height === 5) {
          spriteOffset = this.sprites.ids.grass.offset;
        } else if (tile.height === 6) {
          spriteOffset = this.sprites.ids.forest.offset;
        } else if (tile.height === 7) {
          spriteOffset = this.sprites.ids.dirtGrass.offset;
        } else if (tile.height === 8) {
          spriteOffset = this.sprites.ids.dirtStone.offset;
        } else if (tile.height === 9) {
          spriteOffset = this.sprites.ids.stone.offset;
        }

        ctx.drawImage(this.sprites.spriteSheet, spriteOffset.x, spriteOffset.y, 16, 16,
            tileX * 16 - pixelOffsetX, tileY * 16 - pixelOffsetY, 16, 16);
        if (tile.bush) {
          ctx.drawImage(this.sprites.spriteSheet,
              this.sprites.ids.bush.offset.x, this.sprites.ids.bush.offset.y, 16, 16,
              tileX * 16 - pixelOffsetX, tileY * 16 - pixelOffsetY, 16, 16);
        } else if (tile.berryBush) {
          ctx.drawImage(this.sprites.spriteSheet,
              this.sprites.ids.berryBush.offset.x, this.sprites.ids.berryBush.offset.y, 16, 16,
              tileX * 16 - pixelOffsetX, tileY * 16 - pixelOffsetY, 16, 16);
        } else if (tile.palmTree) {
          topCtx.drawImage(this.sprites.spriteSheet,
              this.sprites.ids.palmTree.offset.x, this.sprites.ids.palmTree.offset.y, 64, 64,
              tileX * 16 - pixelOffsetX - 24, tileY * 16 - pixelOffsetY - 24, 64, 64);
        } else if (tile.commonTree) {
          topCtx.drawImage(this.sprites.spriteSheet,
              this.sprites.ids.commonTree.offset.x, this.sprites.ids.commonTree.offset.y, 64, 64,
              tileX * 16 - pixelOffsetX - 24, tileY * 16 - pixelOffsetY - 24, 64, 64);
        } else if (tile.appleTree) {
          topCtx.drawImage(this.sprites.spriteSheet,
              this.sprites.ids.appleTree.offset.x, this.sprites.ids.appleTree.offset.y, 64, 64,
              tileX * 16 - pixelOffsetX - 24, tileY * 16 - pixelOffsetY - 24, 64, 64);
        }
        if (tile.transmitter) {
          ctx.drawImage(this.sprites.spriteSheet,
              this.sprites.ids.transmitter.offset.x, this.sprites.ids.transmitter.offset.y, 16, 16,
              tileX * 16 - pixelOffsetX, tileY * 16 - pixelOffsetY, 16, 16);
        } else if (tile.antenna) {
          ctx.drawImage(this.sprites.spriteSheet,
              this.sprites.ids.antenna.offset.x, this.sprites.ids.antenna.offset.y, 16, 16,
              tileX * 16 - pixelOffsetX, tileY * 16 - pixelOffsetY, 16, 16);
        } else if (tile.battery) {
          ctx.drawImage(this.sprites.spriteSheet,
              this.sprites.ids.battery.offset.x, this.sprites.ids.battery.offset.y, 16, 16,
              tileX * 16 - pixelOffsetX, tileY * 16 - pixelOffsetY, 16, 16);
        }
      }
    }
  }
};

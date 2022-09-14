/**
 * A block that prevents
 * @constructor
 * @param {integer} x       - X-coordinate of the block
 * @param {integer} y       - Y-cooridnate of the block
 * @param {integer} width   - Width of the block
 * @param {integer} height  - Height of the block
 */
function Block(x, y, width, height) {

  this.x = x;
  this.y = y;

  this.width = width;
  this.height = height;

  this.leftX = x;
  this.rightX = (x + this.width);

  this.topY = y;
  this.bottomY = (y + this.height);

}

/**
 * Renders the block
 * @param {CanvasRenderingContext2D}  context - 2D rendering context to use when rendering the block
 */
Block.prototype.draw = function(context) {

  context.fillStyle = GameSettings.BlockFillStyle;
  context.fillRect(this.x, this.y, this.width, this.height);

};

/**
 * Determines if a given point is within the block
 * @param {integer} x       - X-coordinate of the point
 * @param {integer} y       - Y-cooridnate of the point
 */
Block.prototype.contains = function(x, y) {

  return (x > this.leftX) && (x < this.rightX) && (y > this.topY) && (y < this.bottomY);

}

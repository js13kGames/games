/**
 * A block that prevents
 * @constructor
 * @param {NodeType}  nodeType  - The node's type
 * @param {integer}   x         - X-coordinate of the block
 * @param {integer}   y         - Y-cooridnate of the block
 * @param {integer}   radius    - Radius of the node
 */
function Node(nodeType, x, y, radius) {

  this.type = nodeType;

  this.x = x;
  this.y = y;

  this.radius = radius;
  this.radiusSquared = (this.radius * this.radius);

  this.isActive = false;

  if(nodeType === NodeType.Start)
  {
    this.isActive = true;
  }

}

/**
 * Renders the node
 * @param {CanvasRenderingContext2D}  context - 2D rendering context to use when rendering the node
 */
Node.prototype.draw = function(context) {

  // Draw: Background
  switch(this.type)
  {
    case NodeType.Start:
      context.fillStyle = (this.isActive) ? GameSettings.NodeStartFillStyle : GameSettings.NodeInactiveFillStyle;
      break;

    case NodeType.End:
      context.fillStyle = (this.isActive) ? GameSettings.NodeEndFillStyle : GameSettings.NodeInactiveFillStyle;
      break;

    case NodeType.Connect:
      context.fillStyle = (this.isActive) ? GameSettings.NodeConnectFillStyle : GameSettings.NodeInactiveFillStyle;
      break;
  }

  context.beginPath();
  context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
  context.fill();

  // Draw: Emblem
  context.strokeStyle = GameSettings.NodeEmblemFillStyle;
  context.lineWidth = this.radius * GameSettings.NodeEmblemLineWidthPercentage;
  context.beginPath();

  if(this.type === NodeType.End)
  {
    var radiusMargin = (this.radius * GameSettings.NodeEndEmblemMarginPercentage);

    context.beginPath();

    context.moveTo(this.x - radiusMargin, this.y - radiusMargin);
    context.lineTo(this.x + radiusMargin, this.y + radiusMargin);

    context.moveTo(this.x + radiusMargin, this.y - radiusMargin);
    context.lineTo(this.x - radiusMargin, this.y + radiusMargin);

    context.stroke();
  }
  else if(this.type === NodeType.Start)
  {
    var radiusMargin = (this.radius * GameSettings.NodeStartEmblemMarginPercentage);

    context.beginPath();
    context.arc(this.x, this.y, this.radius - radiusMargin, 0, 2 * Math.PI);
    context.stroke();
  }
  else if(this.type === NodeType.Connect)
  {
    var radiusMargin = (this.radius * GameSettings.NodeConnectEmblemMarginPercentage);

    context.moveTo(this.x - radiusMargin, this.y);
    context.lineTo(this.x + radiusMargin, this.y);

    context.stroke();
  }

};

/**
 * Determines if a given point is within the node
 * @param {integer} x       - X-coordinate of the point
 * @param {integer} y       - Y-cooridnate of the point
 */
Node.prototype.contains = function(x, y) {

  // Source: http://stackoverflow.com/questions/481144/equation-for-testing-if-a-point-is-inside-a-circle
  return (Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2)) <= this.radiusSquared;

}

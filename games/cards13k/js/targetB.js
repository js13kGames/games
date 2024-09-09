function Target(xLeft, yTop, xRight, yBottom, column, card, cardIndexInColumn)
{ this.xL = xLeft;
  this.yT = yTop;
  this.xR = xRight;
  this.yB = yBottom;
  this.column = column;
  this.card = card;
  this.index = cardIndexInColumn;
}

Target.prototype.contains = function(x, y)
{ return (x >= this.xL && x <= this.xR && y >= this.yT && y <= this.yB); };

function findTarget(x, y, targets)
{ for(const T of targets)
  { if(T.contains (x, y)) return T;
  }
  return null; //(x, y) not in any target
}

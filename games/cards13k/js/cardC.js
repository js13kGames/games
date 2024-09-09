const SUITS = 
{ CLUB:1, DIAMOND:2, HEART:3, SPADE:4,
  getChar:function(suit)
  { switch(suit)
    { case SUITS.CLUB: return "\u2663";
      case SUITS.DIAMOND: return "\u2666";
      case SUITS.HEART: return "\u2665";
      case SUITS.SPADE: return "\u2660";
  } },
  getColour(suit)
  { if(suit === SUITS.SPADE || suit === SUITS.CLUB) return "#000";
    return "#f00";
  }
};

function Card(suit, value)
{ this.suit = suit;
  this.value = value;
  this.faceUp = false;
}

Card.prototype.setColumn = function(column, index)
{ this.column = column;
  this.columnIndex = index;
};

Card.prototype.moveTo = function(column)
{ this.column.removeCard(this); 
  column.addCard(this);
  GAME.game.draw();
};

function setCardWidth(wd)// All cards same size
{ Card.prototype.width = Math.floor(wd);
  Card.prototype.height = Math.floor(wd * 4 / 3);
  // For centring the glyph within the card:
  var wd128 = wd / 128;
  Card.prototype.dx = Math.round(8 * wd128);
  Card.prototype.dy = Math.round(24 * wd128);
};

Card.prototype.reveal = function() { this.faceUp = true; };
Card.prototype.hide = function() { this.faceUp = false; };

Card.prototype.getLabel = function()
{ var s;
  switch(this.value)
  { case 1: s = "A"; break;
    case 11: s = "J"; break;
    case 12: s = "Q"; break;
    default: s = this.value;
  }
  return s + " " + SUITS.getChar(this.suit);
};

Card.prototype.draw = function(xLeft, yTop)
{ if(this.faceUp)
  { GAME.g2.fillStyle = '#fff';
    GAME.g2.fillRect(xLeft, yTop, this.width, this.height);
    GAME.g2.fillStyle = SUITS.getColour(this.suit);
    var s = this.getLabel();
    GAME.g2.font = "24px sans-serif"
    GAME.g2.fillText(s, xLeft + 8, yTop + 24);    
    GAME.g2.font = "36px sans-serif"
    GAME.g2.fillText(s, xLeft + this.width * 0.3, yTop + this.height * 0.5);    
  }
  else
  { GAME.g2.fillStyle = '#963';
    GAME.g2.fillRect(xLeft, yTop, this.width, this.height);
  }
  GAME.g2.strokeStyle = '#000';
  GAME.g2.lineWidth = 2;
  GAME.g2.strokeRect(xLeft, yTop, this.width, this.height);
  GAME.g2.lineWidth = 1;
};
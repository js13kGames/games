function Column(xLeft, yTop)
{ this.XL = Math.floor(xLeft);
  this.YT = Math.floor(yTop);
  this.DY = 30;
  this.CARDS = [];
}

Column.prototype.setXY = function(xLeft, yTop)
{ this.XL = Math.floor(xLeft);
  this.YT = Math.floor(yTop);
};

Column.prototype.empty = function() { this.CARDS = []; };
Column.prototype.isEmpty = function() { return this.CARDS.length === 0; };
Column.prototype.getLength = function() { return this.CARDS.length; };

Column.prototype.addCard = function(card)
{ var len = this.CARDS.length;
  this.CARDS.push(card);
  card.setColumn(this, len);
};

Column.prototype.addColumn = function(col)
{ for(var i = 0; i < col.CARDS.length; i++)
  { this.addCard(col.CARDS [i]); }
};

Column.prototype.endsWithFullSuit = function()
{ const L1 = this.CARDS.length - 1;
  if(L1 < 11) return false;
  const SUIT = this.CARDS[L1].suit;
  for(var i = L1, j = 1; j <= 12; i--, j++)
  { if(this.CARDS[i].suit !== SUIT || this.CARDS[i].value !== j) return false; }
  return true;
};

Column.prototype.removeFullSuit = function()
{ for(var i = 0; i < 12; i++)
  { var card = this.getLastCard();
    if(null === card) { alert("Error in Column.removeFullSuit()"); return; }
    this.removeCard(card);
} };

Column.prototype.removeCard = function(card)
{ this.CARDS.splice(card.columnIndex, 1);
  var card = this.getLastCard();
  if(null !== card) card.reveal();
};

Column.prototype.getCard = function(index)
{ if(this.CARDS.length > index) return this.CARDS[index];
  else return null;
};

Column.prototype.getLastCard = function()
{ if(this.CARDS.length > 0) return this.CARDS[this.CARDS.length - 1];
  else return null;
};

Column.prototype.getSublist = function(startIndex)
{ return this.CARDS.slice(startIndex); 
  //list, not true Column: card.columnIndex is irrelevant
};

Column.prototype.getSubcolumn = function(startIndex)
{ var cards = this.CARDS.slice(startIndex); 
  var sub = new Column(this.XL, this.YT);
  for(var i = 0; i < cards.length; i++)
  { sub.addCard(cards[i]); }
  return sub;
};

// Cards must all be same suit and consecutive descending values
Column.prototype.isMovable = function()
{ if(1 === this.CARDS.length) return true;
  var SUIT = this.CARDS [0].suit;
  var VALUE = this.CARDS [0].value;
  for(var i = 1; i < this.CARDS.length; i++)
  { if(this.CARDS[i].suit !== SUIT) return false;
    if(this.CARDS[i].value !== VALUE - i) return false;
  }
  return true;
}

Column.prototype.draw = function()
{ for(var i = 0, y = this.YT; i < this.CARDS.length; i++, y += this.DY)
  { var card = this.CARDS[i];
    card.draw(this.XL, y);
    var targetHt =(i === this.CARDS.length - 1) ? card.height : this.DY;
    GAME.targets.push(new Target(this.XL, y, this.XL + card.width, y + targetHt, this, card, i));
} };
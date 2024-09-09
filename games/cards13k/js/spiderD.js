function Spider()
{ GAME.deck = new Deck();
  GAME.deck.shuffle();
  GAME.N_COLUMNS = 10;
  this.COL_WIDTH =(GAME.cnv.width - 40) /(GAME.N_COLUMNS + 1);//+1 for remainder
  setCardWidth(0.9 * this.COL_WIDTH);
  for(var i = 0, xL = 0.05 * this.COL_WIDTH; i < GAME.N_COLUMNS; i++, xL += this.COL_WIDTH)
  { var col = new Column(xL, 4);
    col.DY = Math.round(Card.prototype.width / 3.5);
    GAME.COLUMNS.push(col);
  }
  this.nCompleted = 0;
  this.first = true;
  this.N_SUITS = 8;//2 packs
  this.REMAINDER = [];
  this.ACE_COLUMN = new Column(this.COL_WIDTH * 10 + 10, Card.prototype.height + 50);
  GAME.cnv.addEventListener("mousedown", onMousedown);
  GAME.cnv.addEventListener("mousemove", onMousemove);
  GAME.cnv.addEventListener("mouseup", onMouseup);
  document.addEventListener("keydown", onKeydown);
}

Spider.prototype.deal = function()
{ // 3 rows + 6 face down then a row face up
  // 5 deals of 10 remaining
  var colNo = 0;
  for(var i = 0; i < 46; i++)
  { var card = GAME.deck.cards[i];
    if(i > 35) card.reveal();
    GAME.COLUMNS[colNo].addCard(card);
    colNo++;
    if(colNo >= GAME.N_COLUMNS) colNo = 0;
  }
  for(i = 46; i < 96; i++)
  { this.REMAINDER.push(GAME.deck.cards[i]);
} };

Spider.prototype.dealMore = function()
{ if(this.REMAINDER.length < 10) return;
  for(const COL of GAME.COLUMNS)
  { if(COL.isEmpty())
    { alert("You cannot deal when\nthere are empty columns");
      return;
  } }
  GAME.animData = {nDealt:0};
  GAME.uiPaused = true;
  dealMore2();
};

function dealMore2()
{ var ad = GAME.animData;
  if(ad.nDealt < 10)
  { var card = GAME.game.REMAINDER.pop();
    card.reveal();
    GAME.COLUMNS[ad.nDealt].addCard(card);
    ad.nDealt++;
    GAME.game.draw();
    setTimeout(dealMore2, 100);// 1/10 second
  }
  else
  { recordDealInHistory();
    GAME.game.draw();
    GAME.uiPaused = false;
} }

Spider.prototype.draw = function()
{ GAME.g2.putImageData(GAME.cloth, 0, 0);
  GAME.g2.fillStyle = '#777';
  var sideColXLeft = GAME.cnv.width - 20 - this.COL_WIDTH; 
  GAME.g2.fillRect(sideColXLeft, 0, this.COL_WIDTH, GAME.cnv.height);
  GAME.targets = [];
  for(const COLUMN of GAME.COLUMNS) COLUMN.draw();
  GAME.g2.fillStyle = '#ff0';
  GAME.g2.font = "28px sans-serif";
  var w = GAME.cnv.width * 0.4, h = GAME.cnv.height * 0.4;
  if(this.nCompleted < this.N_SUITS)
    GAME.g2.fillText(this.nCompleted + "/8", sideColXLeft + 10, Card.prototype.height + 40);
  else GAME.g2.fillText("YOU WIN!", w, h);
  if(this.REMAINDER.length >= 10)
  { var xL = sideColXLeft + 10, yT = 10;
    new Card(SUITS.CLUB, 1).draw(xL, yT);//face down
    var targetWd = Card.prototype.width, targetHt = Card.prototype.height;
    GAME.targets.push(new Target(xL, yT, 
      xL + targetWd, yT + targetHt, this.REMAINDER, null, null));
    //5th param for remainder pile when clicked:
  }
  this.ACE_COLUMN.draw();
  if(this.first)
  { GAME.g2.fillStyle = '#ff0';
    GAME.g2.fillText("Spider solitaire", w, h - 80);
    GAME.g2.fillText("12 cards per suit, no kings", w, h - 40);
    GAME.g2.fillText("Click, drag, Ctrl+Z to undo", w, h);
  }
  this.first = false;
};

Target.prototype.isRemainder = function() { return this.column === GAME.game.REMAINDER; };

// Array cards must all be same suit and
// consecutive descending values
function isMovable(cards)
{ if(1 === cards.length) return true;
  var SUIT = cards[0].suit;
  var VALUE = cards[0].value;
  for(var i = 1; i < cards.length; i++)
  { if(cards[i].suit !== SUIT) return false;
    if(cards[i].value !== VALUE - i) return false;
  }
  return true;
}

function onMousedown(e)
{ if(GAME.uiPaused) return;
  var xy = getMousePoint(e);
  var target = findTarget(xy.x, xy.y, GAME.targets);
  if(null === target) return;
  if(target.isRemainder())
  { GAME.game.dealMore();
    return;    
  }
  var card = target.card;
  if(!card.faceUp) return;
  var cards = card.column.getSublist(card.columnIndex);
  // array of cards, not a Column
  var nextFaceUp = false, i1 = card.columnIndex - 1;
  if(i1 >= 0 && null !== card.column.getLastCard())
  { nextFaceUp = card.column.getCard(i1).faceUp; }
  if(!isMovable(cards)) return;
  recordHistory();
  // Remove cards from their present column and 
  // put them in a new column that can be moved
  var oldCol = card.column;
  var newCol = new Column(oldCol.XT, oldCol.YT);
  for(var i = cards.length - 1; i >= 0; i--) { oldCol.removeCard(cards[i]); }
  if(!nextFaceUp)
  { var oldLast = oldCol.getLastCard();
    if(null !== oldLast) oldLast.hide();//no peeking
  }
  for(i = 0; i < cards.length; i++) { newCol.addCard(cards[i]); }
  GAME.mouse = {x0:xy.x, y0:xy.y, xL:target.xL, yT:target.yT,
    topCard:card, newCol:newCol, oldCol:oldCol, hasMoved:false}; 
}

function onMousemove(e)
{ if(GAME.uiPaused) return;
  if(null === GAME.mouse) return;
  var xy = getMousePoint(e);
  var dx = Math.floor(xy.x - GAME.mouse.x0);
  var dy = Math.floor(xy.y - GAME.mouse.y0);
  if(Math.abs(dx) > GAME.mouse.topCard.width)
  { GAME.mouse.hasMoved = true; }
  var newCol = GAME.mouse.newCol;
  newCol.setXY(GAME.mouse.xL + dx, GAME.mouse.yT + dy);
  GAME.game.draw();
  newCol.draw();
}

function onMouseup(e)
{ if(GAME.uiPaused) return;
  if(null === GAME.mouse) return;
  var card = GAME.mouse.topCard;
  var oldCol = GAME.mouse.oldCol;
  var newCol = GAME.mouse.newCol;
  if(GAME.mouse.hasMoved)
  { var xy = getMousePoint(e);
    var target = findTarget(xy.x, xy.y, GAME.targets);
    //target suitable for the dragged newCol?
    if(null !== target)
    { var card = target.card;
      if(card.faceUp)//also means not in oldCol
      { if(card.value === newCol.getCard(0).value + 1)
        { moveTo(card.column);
          return;
  } } } }
  for(const COL of GAME.COLUMNS)
  { if(COL !== oldCol)
    { var last = COL.getLastCard();
      if(null !== last)
      { if(last.suit === card.suit && last.value - 1 === card.value)
        { moveTo(COL);
          return;
  } } } }//Not exact match, try value match only(not suit):
  for(const COL of GAME.COLUMNS)
  { if(COL !== oldCol)
    { var last = COL.getLastCard();
      if(null !== last)
      { if(last.value - 1 === card.value)
        { moveTo(COL);
          return;
  } } } }//Is there an empty column to move to?
  for(const COL of GAME.COLUMNS)
  { if(COL !== oldCol)
    { if(null === COL.getLastCard())
      { moveTo(COL);
        return;
  } } }
  // Nowhere to go, put cards back where they were:
  undo();
  GAME.mouse = null;
}

function moveTo(column)
{ column.addColumn(GAME.mouse.newCol);
  if(column.endsWithFullSuit())
  { GAME.uiPaused = true;
    var n = column.getLength();//Must be >= 12
    var cards = column.getSublist(n - 12);
    var targetXL = GAME.game.COL_WIDTH * 10 + 40;
    var targetYT = Card.prototype.height + 50 + column.DY * GAME.game.nCompleted;
    var nSteps = 120;
    for(var i = cards.length - 1; i >= 0; i--)
    { var card = cards[i];
      card.XL = column.XL;
      card.YT = column.YT + card.columnIndex * column.DY;
      card.dx =(targetXL - card.XL) / nSteps;
      card.dy =(targetYT - card.YT) / nSteps;
      column.removeCard(card);
    }
    GAME.animData = {cards:cards, nSteps:nSteps, stepNo:0};
    fly();
  }
  var oldLast = GAME.mouse.oldCol.getLastCard();
  if(null !== oldLast) oldLast.reveal();
  GAME.game.draw();
  GAME.mouse = null;
}

function fly()
{ var ad = GAME.animData;
  if(ad.stepNo < ad.nSteps)
  { GAME.game.draw();
    for(var i = 0; i < ad.cards.length; i++)
    { var card = ad.cards[i];
      card.XL += card.dx;
      card.YT += card.dy;
      card.draw(Math.round(card.XL), Math.round(card.YT));
    }
    ad.stepNo++;
    requestAnimationFrame(fly);
  }
  else
  { GAME.game.ACE_COLUMN.addCard(ad.cards[ad.cards.length - 1]);
    GAME.game.nCompleted++;
    recordSuitInHistory();
    GAME.game.draw();
    GAME.uiPaused = false;
} }

function onKeydown(e)
{ if(GAME.uiPaused) return;
  if(e.key === "z" && e.ctrlKey) undo();
}
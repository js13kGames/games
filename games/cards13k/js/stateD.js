function State()
{ this.columns = [];
  for(var i = 0; i < GAME.N_COLUMNS; i++)
  { var col = [];
    var list = GAME.COLUMNS[i].getSublist(0); // list of cards in the whole column
    for(var j = 0; j < list.length; j++)
    { var card = list[j];
      col.push({card:card, up:card.faceUp}); 
      // faceUp is the only property of card that may change
    }
    this.columns.push(col);
} }

function recordHistory() { GAME.HISTORY.push(new State()); }
function recordDealInHistory() { GAME.HISTORY.push("deal"); }
function recordSuitInHistory() { GAME.HISTORY.push("suit"); }

function undo()
{ if(0 === GAME.HISTORY.length) return;
  var state = GAME.HISTORY.pop();
  if(state === "deal")
  { for(var i = GAME.N_COLUMNS - 1; i >= 0; i--)
    { var col = GAME.COLUMNS[i];
      var card = col.getLastCard();
      col.removeCard(card);
      GAME.game.REMAINDER.push(card);
  } }
  else
  { if(state === "suit")
    { var ace = GAME.game.ACE_COLUMN.getLastCard();
      if(null !== ace) GAME.game.ACE_COLUMN.removeCard(ace);
      GAME.game.nCompleted--;
      state = GAME.HISTORY.pop();
    }
    for(var i = 0; i < state.columns.length; i++)
    { var srcCol = state.columns[i];
      GAME.COLUMNS[i].empty();
      for(var j = 0; j < srcCol.length; j++)
      { var sj = srcCol[j];
        var card = sj.card;
        card.faceUp = sj.up;
        GAME.COLUMNS[i].addCard(card);
  } } }
  GAME.game.draw();
}
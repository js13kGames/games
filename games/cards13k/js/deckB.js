function Deck()
{ this.cards = [];
  const CARDS_PER_SUIT = 12;//No King(13)
  for(var j = 0; j < 2; j++)
  { for(var i = 1; i <= CARDS_PER_SUIT; i++)
    { this.cards.push(new Card(SUITS.CLUB, i));
      this.cards.push(new Card(SUITS.DIAMOND, i));
      this.cards.push(new Card(SUITS.HEART, i));
      this.cards.push(new Card(SUITS.SPADE, i));
} } };

Deck.prototype.shuffle = function()
{ var L = this.cards.length;
  for(var i = 0; i < 3 * L; i++)
  { var a = Math.floor(Math.random() * L);
    var b = Math.floor(Math.random() * L);
    if(a !== b)// Swap a b:
    { var temp = this.cards[a];
      this.cards[a] = this.cards[b];
      this.cards[b] = temp;
} } };
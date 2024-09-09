var io = require('sandbox-io'),//require("socket.io")(),
    tables = [];

var labels = {
  0: "Ace",
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  11: "Jack",
  12: "Queen",
  13: "King",
  14: "Ace"
};

/* get score */
function getScore(hand, board) {

  var cards = hand.concat(board).sort(function(a,b){
    return a.rank - b.rank
  });

  var suits = countSuits(cards);
  var ranks = countRanks(cards);
  var ranksArr = toArr(ranks);

  var isFlush = findVal(suits, 5); // holds "", H, S, C, D
  var isStraight = findSeq(ranksArr); // holds highest card or 0
  var isRoyalFlush = isFlush && isStraight === 14;
  var isStraightFlush = isFlush && isStraight;
  var is4Kind = cards.length >= 4 && findKind(ranksArr, ranks, 4);
  var is3Kind = cards.length >= 3 && findKind(ranksArr, ranks, 3);
  var is2Kind = findKind(ranksArr, ranks, 2, is3Kind, is4Kind);
  var isFullHouse = is2Kind && is3Kind;
  var is2Pair = findKind(ranksArr, ranks, 2, is2Kind);
  var highCard = ranksArr[ranksArr.length - 1];


  /* royal flush */
  if (isRoyalFlush) {
    return {
      text: "Royal Flush",
      score: 10,
      value: 10
    }
  }
  
  /* straight flush */
  if (isStraightFlush) {
    return {
      text: "Straight Flush - " + labels[isStraightFlush - 5] + " to " + labels[isStraightFlush],
      score: 9,
      value: isStraightFlush
    }
  }
  
  /* 4oak */
  if (is4Kind) {
    return {
      text: "Four of a kind - " + labels[is4Kind] + "s",
      score: 8,
      value: is4Kind
    }
  }
  
  /* Full House */
  if (isFullHouse) {
    return {
      text: "Full House - " + labels[is3Kind] + " high",
      score: 7,
      value: is3Kind
    }
  }
  
  /* Flush */
  if (isFlush) {
    var card = findHighSuit(cards, isFlush);
    return {
      text: "Flush - " + labels[card] + " high",
      score: 6,
      value: card
    }
  }
  
  /* Straight */
  if (isStraight) {
    return {
      text: "Straight - " + labels[isStraight - 5] + " to " + labels[isStraight],
      score: 5,
      value: isStraight
    }
  }

  /* 3oak */
  if (is3Kind) {
    return {
      text: "Three of a Kind - " + labels[is3Kind] + "s",
      score: 4,
      value: is3Kind
    }
  }

  /* 2 pairs */
  if (is2Pair) {
    return {
      text: "2 Pairs - " + labels[is2Kind] + "s and " + labels[is2Pair] + "s",
      score: 3,
      value: [ is2Kind, is2Pair ]
    }
  }

  /* Pair */
  if (is2Kind) {
    return {
      text: "A pair of " + labels[is2Kind] + "s",
      score: 2,
      value: is2Kind
    }
  }

  return {
    text: "High Card - " + labels[highCard],
    score: 1,
    value: highCard
  }
}

function findHighSuit(cards, suit) {
  for (var i = cards.length - 1; i >= 0; i--) {
    if (cards[i].suit === suit) {
      return cards[i].rank;
    }
  }
  return 0;
}

function findKind(ranksArr, ranks, n, ex1, ex2) {
  for (var i = ranksArr.length - 1; i >= 0; i--) {
    if (ranks[ranksArr[i]] === n) {
      if (ranksArr[i] !== ex1 && ranksArr[i] !== ex2) {
        return ranksArr[i];
      }
    }
  }
  return 0;
}

function findVal(o, n) {
  for (var p in o) {
    if (o[p] === n) {
      return p;
    }
  }
  return "";
}

function isFlush(cards) {
  for(var prop in list) {
    if (list[prop] === 5) {
      return prop;
    }
  }
  return "";
}

function toArr(o) {
  var a = [];
  for (var n in o) {
    a.push(+n);
  }
  return a.sort(function(a,b) { return a - b })
}

function findSeq(cards) {
  if (cards.length < 5) {
    return 0;
  }

  for (var i = cards.length - 5; i >= 0; i--) {
    if (cards[i] == cards[i+1]-1 && cards[i] == cards[i+2]-2 && cards[i] == cards[i+3]-3 && cards[i] == cards[i+4]-4) {
      return cards[i+4];
    }
  }

  // ace to 5
  if (cards[cards.length - 1] == 14) {
    if (cards[0] == 2 && cards[1] == 3 && cards[2] == 4 && cards[3] == 5) {
      return 5;
    }
  }

  return 0;
}

function countRanks(cards) {
  var list = {};
  for (var i = 0; i < cards.length; i++) {
    list[cards[i].rank] = list[cards[i].rank] || 0;
    list[cards[i].rank]++;
  }
  return list;
}

function countSuits(cards) {
  var list = {};
  for (var i = 0; i < cards.length; i++) {
    list[cards[i].suit] = list[cards[i].suit] || 0;
    list[cards[i].suit]++;
  }
  return list;
}

/* find table with an empty slot */
function findTable() {
  if (tables.length) {
    for (var i = 0; i < tables.length; i++) {
      if (tables[i].players.length < 10) {
        return i;
      }
    }
  }
  tables.push(new Table());
  return tables.length - 1;
}

var time = Date.now();
setInterval(function() {
  var elapsed = Date.now() - time;
  time += elapsed;

  for (var i = tables.length - 1; i >= 0; i--) {
    if (tables[i].currentTimer >= 0) {
      tables[i].currentTimer += elapsed;
      if (tables[i].currentTimer >= 30000) {
        tables[i].currentTimer = -1;
        tables[i].timeout();
      }
    }
  }
}, 16);

/* game table */
function Table() {

  this.players = [];
  this.deck = [];
  this.hands = {};
  this.active = [];
  this.board = [];
  this.round = 0;
  this.dealer = 0;
  this.currentPlayer = 0;
  this.currentTimer = -1;
  this.potSize = 0;
  this.maxBet = 0;
  this.smallBlind = 10;
  this.gameStarted = false;

  /* reset deck */
  this.reset = function() {
    this.deck.length = 0;
    this.hands = {};
    this.board.length = 0;
    this.active.length = 0;
    this.round = 0;
    this.potSize = 0;
    this.maxBet = 0;

    this.currentTimer = -1;
    this.broadcast("reset", 1);

    var suits = [ "D", "H", "C", "S" ];
    for (var j = 0; j < 4; j++) {
      for (var i = 2; i <= 14; i++) {
        this.deck.push({
          rank: i,
          suit: suits[j]
        });
      }
    }

    /* shuffle */
    for(var j, x, i = this.deck.length; i; j = Math.floor(Math.random() * i), x = this.deck[--i], this.deck[i] = this.deck[j], this.deck[j] = x);

    for (var i = 0; i < this.players.length; i++) {
      this.players[i].playerData.bet = 0;
      if (this.players[i].playerData.state > 0) {
        this.players[i].playerData.state = 1;
      }
    }
  }

  this.endGame = function() {
    var scores = [];

    for (var i = 0; i < this.active.length; i++) {
      this.active[i].playerData.bet = 0;
      if (this.active[i].playerData.state === 1) {

        scores.push({
          id: i,
          hand: getScore(this.hands[this.active[i].playerData.id], this.board)
        });
        this.active[i].emit("hands", { id: this.active[i].playerData.id, hand: this.hands[this.active[i].playerData.id] });
      }
    }

    // sort
    var strongest = scores[0];
    for (var i = 1; i < scores.length; i++) {
      if (scores[i].hand.score > strongest.hand.score) {
        strongest = scores[i];
      } else if(scores[i].hand.score === strongest.hand.score) {
        if (scores[i].hand.score === 3) {
          if (scores[i].hand.values[0] > strongest.hand.values[0]) {
            strongest = scores[i];
          } else if (scores[i].hand.values[0] === strongest.hand.values[0]) {
            if (scores[i].hand.values[1] > strongest.hand.values[1]) {
              strongest = scores[i];
            }
          }
        } else if (scores[i].hand.value > strongest.hand.value) {
          strongest = scores[i];
        }
      }
    }

    this.currentTimer = -1;
    setTimeout(function() {
      this.reset();
      this.active[strongest.id].chips += this.potSize;
      this.broadcast("chips", { id: this.active[strongest.id].playerData.id, chips: this.active[strongest.id].chips });
      this.gameStarted = false;
      this.nextRound();
    }.bind(this), 3000);

  }

  this.timeout = function() {
    this.onCall(this.players[this.currentPlayer]);
  }

  /* next round */
  this.nextRound = function () {

    /* still going */
    if (this.gameStarted) {
      return;
    }

    /* count players */
    var count = 0;
    for (var i = 0; i < this.players.length; i++) {
      if (this.players[i].playerData.state > 0 && this.players[i].playerData.chips > 0) {
        count++;
      }
    }

    /* not enough players */
    if (count < 2) {
      return;
    }

    /* reset */
    this.gameStarted = true;
    this.reset();

    /* set actives */
    for (i = 0; i < this.players.length; i++) {
      if (this.players[i].playerData.state > 0 && this.players[i].playerData.chips > 0) {
        this.active.push(this.players[i]);

        var id = this.players[i].playerData.id;
        if (this.players[i].playerData.state > 0 &&  this.players[i].playerData.chips > 0) {
          
          /* init hand */
          this.hands[id] = [
            this.deck.shift(),
            this.deck.shift()
          ];

          /* get score */
          this.players[i].emit("hand", getScore(this.hands[id], []).text);

          /* send cards */
          this.broadcast("hands", { id: id, hand: null });
          this.players[i].emit("hands", { id: id, hand: this.hands[id] });
        }
      }
    }

    /* get flop */
    this.board.push(this.deck.shift());
    this.board.push(this.deck.shift());
    this.board.push(this.deck.shift());

    /* turn */
    this.board.push(this.deck.shift());

    /* river */
    this.board.push(this.deck.shift());

    /* take blinds */
    this.setDealer((this.dealer + 1) % this.players.length);
    for (i = this.dealer + 1, count = 0; count < 2; i++) {
      var id = i % this.players.length;
      if (this.players[id].playerData.state > 0 && this.players[id].playerData.chips > 0) {
        this.setCurrentPlayer(id);
        this.onBet(this.players[id], Math.min((count + 1) * this.smallBlind, this.players[id].playerData.chips));
        count++;
      }
    }

    this.startTimer();
  }

  this.startTimer = function() {
    this.currentTimer = 0;
  }

  this.stopBetting = function() {
    this.round++;
    this.maxBet = 0;
    this.broadcast("maxBet", 0)

    if (this.round > 3) {
      this.endGame();
      return;
    }
    
    var board = this.board.slice(3 - this.round);
    this.broadcast('board', board);

    for (var i = 0; i < this.active.length; i++) {
      this.active[i].playerData.bet = 0;
      if (this.active[i].playerData.state === 1) {
        this.active[i].emit("hand", getScore(this.hands[this.active[i].playerData.id], board).text);
      }
    }
  }

  this.setCurrentPlayer = function(id) {
    this.currentPlayer = id;
    this.startTimer();
    this.broadcast("currentId", id);
  }

  this.setDealer = function(id) {
    this.dealer = id;
    this.broadcast("dealerId", id);
  }

  /* next player */
  this.nextPlayer = function () {
    while (this.players.length) {
      var playerIndex = (this.currentPlayer + 1) % this.players.length;
      var player = this.players[playerIndex];

      if (this.isCurrentPlayer(player)) {
        this.endGame();
        return;
      }

      if (player.playerData.state === 1 && player.playerData.chips > 0 && this.active.indexOf(player) !== -1) {
        this.setCurrentPlayer(playerIndex);
        if (player.playerData.bet === this.maxBet) {
          this.stopBetting();
          break;
        }
        break;
      }
    }
  }

  this.isCurrentPlayer = function (socket) {
    var player = this.players[this.currentPlayer];
    return player && player.playerData.id === socket.playerData.id;
  }

  this.isCurrentDealer = function (socket) {
    return this.players.indexOf(socket) === this.dealer;
  }

  /* on fold */
  this.onFold = function (socket) {
    if (this.isCurrentPlayer(socket)) {
      this.broadcast("fold", socket.playerData.id);
      socket.playerData.state = 2;
      this.nextPlayer();
    }
  }

  /* on bet */
  this.onBet = function (socket, amount) {
    if (this.isCurrentPlayer(socket)) {
      if (amount > 0 && socket.playerData.chips >= amount) {
        this.potSize += amount;
        socket.playerData.chips -= amount;
        socket.playerData.bet += amount;
        this.maxBet = Math.max(this.maxBet, socket.playerData.bet);
        this.broadcast("bet", { id: socket.playerData.id, bet: socket.playerData.bet });
        this.broadcast("chips", { id: socket.playerData.id, chips: socket.playerData.chips });
        this.broadcast("pot", this.potSize);
        this.broadcast("maxBet", this.maxBet)
        this.nextPlayer();
      }
    }
  }

  /* on call */
  this.onCall = function (socket) {
    if (this.isCurrentPlayer(socket)) {
      if (socket.playerData.bet === this.maxBet) {
        this.broadcast("call", socket.playerData.id);
        this.nextPlayer();
      } else if (socket.playerData.chips >= this.maxBet - socket.playerData.bet) {
        socket.playerData.chips -= (this.maxBet - socket.playerData.bet);
        this.broadcast("call", socket.playerData.id);
        this.nextPlayer();
      }
    }
  }


  /* broadcast */
  this.broadcast = function (action, data) {
    for (var i = 0; i < this.players.length; i++) {
      this.players[i].emit(action, data);
    }
  }

  /* join game */
  this.joinGame = function (socket) {

    for (var i = 0; i < this.players.length; i++) {
      this.players[i].emit("welcome", socket.playerData);
      socket.emit("welcome", this.players[i].playerData)
    }

    this.players.push(socket);
    socket.emit("welcome", socket.playerData);

    socket.emit("dealerId", this.dealer);
    socket.emit("currentId", this.currentPlayer);
    socket.emit("pot", this.potSize);

    if (this.active.length) {
      for (var i = 0; i < this.active.length; i++) {
        socket.emit("hands", { id: this.active[i].playerData.id, hand: null });
      }
    }

    if (this.board.length && this.round > 0) {
      socket.emit("board", this.board.slice(3 - this.round));
    }
  }

  /* leave game */
  this.leaveGame = function (socket) {

    /* check if active */
    if (this.active.indexOf(socket) !== -1) {
      this.active.splice(this.active.indexOf(socket), 1);
      if (this.active.length < 2) {
        if (this.active.length === 1) {
          this.active[0].chips += this.potSize;
          this.broadcast("chips", { id: this.active[0].playerData.id, chips: this.active[0].chips });
        }
      }
    }
    
    /* close table */
    if (this.players.length === 1) {
      tables.splice(tables.indexOf(this), 1);
      return;
    }

    if (this.isCurrentDealer(socket)) {
      this.dealer--;
      if (this.dealer === -1) {
        this.dealer = this.players.length - 1;
      }
      this.setDealer(this.dealer);
    }

    if (this.isCurrentPlayer(socket)) {
      this.onFold(socket);
    }
    
    this.players.splice(this.players.indexOf(socket), 1);

    if (this.active.length < 2) {
      this.reset();
      this.gameStarted = false;
      this.nextRound();
    }

    for (var i = 0; i < this.players.length; i++) {
      this.players[i].emit("goodbye", socket.playerData);
    }
  }
  this.reset();
}

var playerId = 0;
io.on("connect", function (socket) {
  
  if (++playerId > 2147483647) {
    playerId = 1;
  }

  /* player data */
  socket.playerData = {
    id: playerId,
    name: "P_" + Math.floor(10000 + Math.random() * 89999),
    chips: 1000,
    bet: 0,
    state: 0,
    connected: true
  };

  /* send player id */
  socket.emit("id", socket.playerData.id)

  /* join table */
  socket.gameTable = tables[findTable()];
  socket.gameTable.joinGame(socket);

  /* set nick and join table */
  socket.on("nick", function (name) {
    socket.playerData.name = name || socket.playerData.name;
    socket.playerData.state = 1;
    socket.gameTable.broadcast("nick", { id: socket.playerData.id, name: socket.playerData.name })
    socket.gameTable.broadcast("state", { id: socket.playerData.id, state: 1 })
    socket.gameTable.nextRound();
  })

  /* chat */
  socket.on("chat", function (message) {
    socket.gameTable.broadcast("chat", { id: socket.playerData.id, message: message })
  })

  /* call */
  socket.on("call", function () {
    socket.gameTable.onCall(socket)
  })

  /* bet */
  socket.on("bet", function (amount) {
    socket.gameTable.onBet(socket, amount)
  })

  /* fold */
  socket.on("fold", function () {
    socket.gameTable.onFold(socket)
  })

  /* disconnect */
  socket.on("disconnect", function () {
    socket.gameTable.leaveGame(socket)
    socket.playerData.connected = false
  });
});
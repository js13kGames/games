var io = require('sandbox-io');

var alonePlayer = null;
var games = {};
var pCounter = 1;

function Game( player1, player2 ) {
  this.id = 'game' + Math.random();
  games[ this.id ] = this;
  this.players = [ player1, player2 ];
  this.map = this.generateMap( 3 );
  log( 'Start game', { id: this.id, players: this.players } );
  player1.joinGame( this );
  player2.joinGame( this );
  io.to( this.id )
    .emit( 'news', { message: 'You found a pair to play' } )
    .emit( 'config', 
    {
      playing: true,
      player1: player1.name,
      player2: player2.name
    });
   setTimeout( this.tic.bind( this ), 1000 );
}

Game.prototype.generateMap = function ( levels ) {
  var map = [ ];

  for ( var i = 0; i < 120; i++ ) {
    map.push( [ ] );
    for ( var j = 0; j < 120; j++ ) {
      map[ i ].push( levels );
    }
  }

  return map;
}

Game.prototype.tic = function () {
  if ( ! games[ this.id ] ) {
    return;
  }

  var p1 = this.players[ 0 ];
  var p2 = this.players[ 1 ];

  var lastP1X = p1.pos[ 0 ];
  var lastP1Y = p1.pos[ 1 ];
  var lastP2X = p2.pos[ 0 ];
  var lastP2Y = p2.pos[ 1 ];

  p1.pos[ 0 ] += p1.direction[ 0 ];
  p1.pos[ 1 ] += p1.direction[ 1 ];

  if ( ! this.map[ p1.pos[ 0 ] ] || ! this.map[ p1.pos[ 0 ] ][ p1.pos[ 1 ] ] ) {
    io.to( this.id ).emit( 'winner', {
      winner: 'player2'
    } );
    return;
  }
  else {
    this.map[ p1.pos[ 0 ] ][ p1.pos[ 1 ] ]--;
  }

  p2.pos[ 0 ] += p2.direction[ 0 ];
  p2.pos[ 1 ] += p2.direction[ 1 ];
    
  if ( ! this.map[ p2.pos[ 0 ] ] || ! this.map[ p2.pos[ 0 ] ][ p2.pos[ 1 ] ] ) {
    io.to( this.id ).emit( 'winner', {
      winner: 'player1'
    } );
    return;
  }
  else {
    this.map[ p2.pos[ 0 ] ][ p2.pos[ 1 ] ]--;
  }

  // How is the game right now
  io.to( this.id ).emit( 'tic', {
    backhoe1: p1.pos,
    backhoe2: p2.pos
  } );

  //Game loooooooping
  setTimeout( this.tic.bind( this ), 20 );
};

Game.prototype.end = function ( ) {
  log( 'End game', { id: this.id, players: this.players } );
  this.players[ 0 ].exit();
  this.players[ 1 ].exit();
  delete games[ this.id ];
};

function Player( socket ) {
  this.socket = socket;
  this.name = 'player' + pCounter++;

  socket.on( 'playerInfo', this.onPlayerInfo.bind( this ) );
  socket.on( 'disconnect', this.onExit.bind( this ) );

  this.speed = 1;

  if ( alonePlayer ) {
    this.pos = [ 60, 25 ];
    this.direction = [ 0, 1 ];
  }
  else {
    this.pos = [ 60, 95 ];
    this.direction = [ 0, -1 ];
  }
};

Player.prototype.joinGame = function ( game ) {
  this.game = game;
  this.socket.join( game.id );
  this.socket.on( 'canIHasChange', this.onMove.bind( this ) );
  this.socket.emit( 'news', { 
    key: this.whoInTheGame().me.key
  } );
};

Player.prototype.onMove = function ( data ) {
  switch ( data ) {
    case 'left':
      if ( this.direction[ 0 ] !== 1 ) {
        this.direction = [ -this.speed, 0 ];
      }
    break;
    case 'right':
      if ( this.direction[ 0 ] !== -1 ) {
        this.direction = [ this.speed, 0 ];
      }
    break;
    case 'up':
      if ( this.direction[ 1 ] !== 1 ) {
        this.direction = [ 0, -this.speed ];
      }
    break;
    case 'down':
      if ( this.direction[ 1 ] !== -1 ) {
        this.direction = [ 0, this.speed ];
      }
    break;
  }

  this.socket.emit( 'youCanChange', [ data ] );
  // keys reading
};

Player.prototype.onPlayerInfo = function ( data ) {
  this.name = data.name;
};

Player.prototype.whoInTheGame = function () {
  if ( ! this.game ) {
    return {};
  }

  var players = this.game.players;

  if ( players[ 0 ] === this ) {
    return {
      me: { obj: players[ 0 ], key: 'player1' },
      other: { obj: players[ 1 ], key: 'player2' }
    };
  }
  else {
    return {
      me: { obj: players[ 0 ], key: 'player2' },
      other: { obj: players[ 1 ], key: 'player1' }
    };
  }
};

Player.prototype.onExit = function () {
  if ( this === alonePlayer ) {
    alonePlayer = null;
  }

  if ( !this.game ) {
    return;
  }

  var otherPlayer = this.whoInTheGame().other.obj;
  otherPlayer.socket.emit( 'news', {
    message: 'Your pair leaves the game',
    kickerId: this.socket.id
  } );

  this.game.end( 'Your pair leaves the game' );
};

Player.prototype.exit = function ( msg ) {
  if ( ! this.game ) {
    return;
  }

  this.socket.emit( 'config', { playing: false, message: msg });
  this.socket.disconnect();
  this.game = null;
};

io.on('connection', function( socket ) {
  log.debug( 'New connection', socket.id );
  var newPlayer = new Player( socket );

  if ( alonePlayer ) {
    socket.emit( 'news', {
      message: 'Entering in a game...' 
    });

    var firstPlayer = alonePlayer;
    alonePlayer = null;

    setTimeout( function ( ) {
      new Game( firstPlayer, newPlayer );
    }, 1500 );
  }
  else {
    socket.emit( 'news', {
      message: 'Waiting for a pair...'
    });
    alonePlayer = newPlayer;
  }
} );
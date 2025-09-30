'use strict';
(function() {
  function isEmpty(obj) {
    for(var i in obj) { return false; }
    return true;
  }
  function room(x,y) {
    return x+","+y;
  }

  function rndInt(mx) {
    return Math.random() * mx | 0;
  }

  function Maze(MAZE_X, MAZE_Y) {
    var unvisitedCells = {},
      maze = [],
      WALL = 0,
      AIR = 1,
      x,y,t,
      stack=[],
      nx,ny,neighborsDup,dir,
      popcell,
      // pairs of (dx,dy)
      // duplicate horizontal to give more chance for horizontal pathes
      neighbors = [0,1, 0,-1, 1,0,1,0,1,0,   -1,0,-1,0,-1,0];


    // TODO: Floyd Marshal for all pairs
    //       https://mgechev.github.io/javascript-algorithms/graphs_shortest-path_floyd-warshall.js.html
    // zeroDist = array of offsets of cells which will have min distance
    // result = maze of distance from the
    // BFS is used to find far away places (eg. to place bulbs and players far apart)
    function BFS(zeroDist) {
      // reset
      for (var y=0; y<MAZE_Y; y++) {
        for (var x=0; x<MAZE_X; x++) {
          var ofs = MAZE_X*y+x;
          if (maze[ofs]) {
            maze[ofs] = 1;
          }
        }
      }
      for (var i=0; i<zeroDist.length; i++) {
        maze[zeroDist[i]] = 10;
      }
      var ofs,
        stack = zeroDist.slice(),
        d,
        fu = function(ofs) {
          if (maze[ofs]==1) {
            maze[ofs]=d;
            stack.push(ofs)
          }
        };

      while (stack.length) {
        ofs = stack.shift();
        d = maze[ofs]+1;
        fu(ofs+1);
        fu(ofs-1);
        fu(ofs+MAZE_X);
        fu(ofs-MAZE_X);
      }
    }

    // GENERATE MAZE:
// maze is 4 times bigger than MAZE_X x MAZE_Y - so do twice each row, and add two cells for each X

    for (y=0; y<MAZE_Y; y++) {
      for (t=0; t<2; t++) {
        for (x=0; x<MAZE_X; x++) {
          unvisitedCells[room(x,y)] = 1;
          maze.push(WALL);
          maze.push(WALL);
        }
      }
    }

    var
      x0=rndInt(MAZE_X),
      y0=rndInt(MAZE_Y);
    x=x0;
    y=y0;

    MAZE_X *= 2;
    MAZE_Y *= 2;

    while (1) {
      // visit x,y (unless we've been here before and this is a backtrack)
      if (unvisitedCells[room(x,y)]) {
        delete unvisitedCells[room(x,y)];
        maze[MAZE_X*y*2+x*2] = AIR;
        if (isEmpty(unvisitedCells)) {
          // all done
          break;
        }
      }
      // look for a direction to move
      neighborsDup = neighbors.slice();
      while (1) {

        if (neighborsDup.length == 0) {
          // reached a deadend - backtrack to someplace not dead
          popcell = stack.pop().split(',');
          x = +popcell[0];
          y = +popcell[1];
          break; // try again from earlier point in the stack
        }
        dir = neighborsDup.splice(2*rndInt(neighborsDup.length/2), 2); // pick a direction

        nx = x + dir[0];
        ny = y + dir[1];
        // check if already visited = not unvisited
        // incidently, this also captures the out of maze edge scenario,
        // since "-1,4" will be undefined so understood as visited already
        if (!unvisitedCells[room(nx,ny)]) {
          continue;
        }
        // found a good direction!
        maze[MAZE_X*(2*y+dir[1])+2*x+dir[0]] = AIR;

        // save this location in case we reach a dead end later and need to backtrack
        stack.push(room(x,y));

        // move to new location
        x = nx;
        y = ny;
        break;
      }
    }

    BFS([MAZE_X*y0+x0]);

    //maze.cycles = []; // TODO remove
    // add a few cycles
    for (var cycles=0; cycles<5; cycles++) {
      var ofs = rndInt(maze.length);
      while(1) {
        var x = ofs%MAZE_X;
        if (x > 1 && x < MAZE_X-1 &&
          !maze[ofs] && maze[ofs+1] && maze[ofs-1] && !maze[ofs-MAZE_X] && !maze[ofs+MAZE_X]) {
          // found a vertical wall, check if the locations on the sides are far away to travel
          // - if so a good place to insert a cycle
          if (Math.abs(maze[ofs+1] - maze[ofs-1]) > 20) {
            // found a good place to add a cycle
            maze[ofs] = AIR;
            BFS([ofs]);
            //  maze.cycles.push(ofs);
            break;
          }
        }
        // not found try next offset
        ofs = (ofs+1)%maze.length;
      }
    }


    function findPlaces() {
      // maybe instead of maps use array and binary search in case need to check contains?
      //  http://oli.me.uk/2013/06/08/searching-javascript-arrays-with-a-binary-search/
      var places = {
        horizDE: [],  // DE = dead end
        // topDE: [],
        // hallway: [],
        // chute: [],
        bottomDE: []
      };

      var ofs =0;
      for (var y=0; y<MAZE_Y; y++ ) {
        for (var x=0; x<MAZE_X; x++ ) {
          if (maze[ofs]) {
            if (maze[ofs+1] && maze[ofs-1]) { // both left and right
              // if (maze[ofs+2] && maze[ofs-2] && !maze[ofs+MAZE_X])
              // places.hallway.push(ofs);
            }
            else if (maze[ofs+1] || maze[ofs-1]) {  // only left or only right
              // check not corner
              if (!maze[ofs+MAZE_X] && !maze[ofs-MAZE_X])
                places.horizDE.push(ofs);
            }
            else if (maze[ofs+MAZE_X] && maze[ofs-MAZE_X]) {
              // places.chute.push(ofs); // both up and down
            }
            else if (maze[ofs-MAZE_X]) {
              places.bottomDE.push(ofs);
            }
            // else if (maze[ofs+MAZE_X]) {
            //   places.topDE.push(ofs);
            // }
          }
          ofs++
        }
      }
      return places;
    }

    maze.BFS = BFS;
    maze.places = findPlaces();
    return maze;
  }



  /*********
   1. player 1 connect - get game state, join game if possible
   - game state:  waiting for more players
   2. player 2..N opens game - join game
   - game state:  can Start
   3. player 1..N change color/name - update server, server updates 1..N
   3. player X starts game
   - game state: started, level created
   4. player 1..N updates server every 33ms
   5. server moves NPCs and updates 1..N players every 33ms
   6. game ends - goes back to waiting for users
   **********/


  var
    WAITING_FOR_GAME_START = 0,
    GAME_STARTING = 1,
    GAME_STARTED = 2,
    ALREADY_STARTED = 3,

    NUM_OF_BULBS=5,

    MAZE_X = 48, // must be divisible by 2
    MAZE_Y = 40,// must be divisible by 2
    players= [],
    bulbs = {},
    sockets={},
    redStart=-1,
    blueStart=-1,
    winTimestamp, winningTeam, winInSec,
    maze= [],
    id = 'g'+Math.random(),  // TODO: support multiple games
    state = WAITING_FOR_GAME_START;

  function findPlayer(player) {
    for (var i=0; i<players.length; i++) {
      if (players[i].id == player.id) {
        return players[i];
      }
    }
  }

  function updatePlayers() {
    var data = {
      state:state,
      players:players,
      bulbs: bulbs
    };
    if (winTimestamp) {
      var winIn = (winTimestamp - new Date()) / 1000 |0;
      if (winIn != winInSec) {
        winInSec = winIn;
        var winMsg = winningTeam == 1 ? "<h2><span class='blue'>Blue</span> " : "<h2><span class='red'>Red</span> ";
        if (winInSec == 0) {
          winMsg +=  " TEAM WON!!!</h2>";
          io.to(id).emit('news', {message: winMsg});
          state = WAITING_FOR_GAME_START;
          data.state = state;
          data.endMsg = winMsg;
        }
        else  {
          io.to(id).emit('news', {message: winMsg+ "team winning in "+winInSec+' !</h2>'});
        }
      }
    }
    io.to(id).emit('state', data);
  }

  function playerStarted(player,data) {
    state = GAME_STARTING;
    winTimestamp = 0;

    io.to(id)
      .emit('news', { message: player.name+' started the game!' })
      .emit('state', { state: state, players: players });

    // repeat "game starting in X seconds, for 'repeat' times, then start the game"
    var repeat = 4;
    var bulbsOfs = [];

    var repeater = function() {
      if (state != GAME_STARTING) {
        return;
      }
      repeat--;
      if (repeat <= 0 && bulbsOfs.length > 5) {
        state = GAME_STARTED;
        var blueInd = Math.random()*2|0;
        redStart = bulbsOfs[1-blueInd];
        blueStart = bulbsOfs[blueInd];
        io.to(id).emit('state', {
          state: state,
          mazeX:MAZE_X, mazeY:MAZE_Y, maze:maze,
          //places: maze.places,
          red: redStart, blue:blueStart,
          bulbs:bulbs });

        // start updating the game state -
        setTimeout(function gameTick() {
          if (state != GAME_STARTED) return;
          updatePlayers();
          setTimeout(gameTick, 33);
        }, 33);

      }
      else {
        io.to(id).emit('news', { message: 'Game starting in '+repeat+'!' });
      }
      setTimeout(repeater, 1000);
    };
    repeater();

    // generate a maze with enough potential places for bulb lights
    var potentials = [];
    while (potentials.length < 11) {
      maze = Maze(MAZE_X/2,MAZE_Y/2);
      potentials = maze.places.bottomDE.concat(maze.places.horizDE);
    }
    // find places for bulb lights - farthest places of the potentials starting with from the first
    var maxOfs= Math.random()*potentials.length|0;
    bulbsOfs.push(potentials.splice(maxOfs,1)[0]);
    while (bulbsOfs.length < NUM_OF_BULBS+2) {
      maze.BFS(bulbsOfs); // calculate distance from bulbs so far
      // find the farthest potential place, add repeat
      var max=0;
      for (var i=0; i<potentials.length; i++) {
        if (maze[potentials[i]] > max) {
          max = maze[potentials[i]];
          maxOfs = i;
        }
      }
      bulbsOfs.push(potentials.splice(maxOfs,1)[0]);
    }
    // found 7 distant places with bulbs - 1st place will be blue team, 2nd place will be red team
    bulbs = {}
    for (var i=2; i<bulbsOfs.length; i++) {
      bulbs[bulbsOfs[i]] = 0; // color white
    }
    // for (var i=0; i<maze.cycles.length; i++) {
    //   bulbs[maze.cycles[i]] = 1;
    // }
  }

  function playerUpdate(player, data) {
    if (state != GAME_STARTED) {
      // expect player updates when game is ongoing
      return;
    }
    for (k in data) {
      player[k] = data[k];
    }
    if (data.instant) {
      updatePlayers();
    }
  }

  function playerInfo(player,data) {
    // if (state == WAITING_FOR_GAME_START) {
    //   // allow changing player name/color only before game start
    //   return;
    // }
    for (k in data) {
      player[k] = data[k];
    }

    var found = findPlayer(player);
    if (!found) {
      players.push(player);
      sockets[player.id].join(id);
      io.to(id).emit('news', { message: player.name+' joined the game', player: player });
    }

    io.to(id)
      .emit('state', { state: state, players: players });

  }

  function onExit(player) {
    var found = findPlayer(player);
    if (found) {
      players.splice(players.indexOf(found),1);
      sockets[player.id].disconnect();
      delete sockets[player.id];
      var msg = '';
      if (players.length < 2) {
        msg = player.name+' left the game,<br> not enough players remained -<br> THE END';
        // log(msg);
        state = WAITING_FOR_GAME_START;
        io.to(id)
          .emit('state', { state: state, players: players, endMsg:msg });
      }
      io.to(id)
        .emit('news', { message: player.name+' left the game'})
    }
  }

  function bulbUpdate(d) {
    // log("bulb "+d.ofs+" updated to "+d.color);
    bulbs[d.ofs] = d.color;
    var counts=[0,0,0];
    for (var b in bulbs) {
      counts[bulbs[b]]++;
    }

    io.to(id).emit('news', {message: "<h3><span class='blue'><span style='font-size:x-large'>"+ counts[1]+
        "</span> blue</span> <span style='font-size:x-large'>"+counts[0]+
        "</span> white <span class='red'><span style='font-size:x-large'>"+counts[2]+"</span> red</span></h3>"});

    if (counts[1] >= NUM_OF_BULBS-2) {
      if (winningTeam != 1) {
        winTimestamp= +new Date() + 30000;
        winningTeam = 1;
      }
    }
    else if (counts[2] >= NUM_OF_BULBS-2) {
      if (winningTeam != 2) {
        winTimestamp= +new Date() + 30000;
        winningTeam = 2;
      }
    }
    else {
      winTimestamp = winInSec =winningTeam= 0;
    }

  }

  var color = 1;
  io.on('connection', function(socket) {
    color = 3-color; // toggle 1,2
    var player = {
      id: 'p'+Math.random(),
      color: color
    };
    sockets[player.id] = socket;
    socket.on('playerInfo', function(d) { playerInfo(player,d)});
    socket.on('startGame', function(d) { playerStarted(player,d)});
    socket.on('update', function(d) { playerUpdate(player,d)});
    socket.on('bulbUpdate', bulbUpdate);
    socket.on('disconnect', onExit.bind(0,player));
    socket.on('wallDestroyed', function(o) {
      maze[o.ofs] = 1;
      io.to(id).emit('onWallDestroyed', {
        wallDestroyed: o.ofs
      });
    });

    socket.emit('yourId', {id: player.id, color: color});

    if (state == GAME_STARTED) {
      socket.emit('news', {message: "Game already started, join or wait?"})
      socket.emit('state', {
        state: ALREADY_STARTED,
        mazeX:MAZE_X, mazeY:MAZE_Y, maze:maze,
        red: redStart, blue:blueStart,
        bulbs:bulbs,
        players:players });
    }
    else {
      socket.emit('state', { state: state, players: players });
    }
  });
})();
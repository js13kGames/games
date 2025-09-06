"use strict";

var NUMBER_OF_TARGETS = 5;
var elementNames = ["Fire", "Water", "Earth", "Air"];

var playerId = 0;

var elementColors = {
  Fire: "rgb(255, 0, 0)",
  Water: "rgb(0, 0, 255)",
  Earth: "rgb(101, 67, 33)",
  Air: "rgb(200, 200, 200)"
};

var Player = function(x, y, name) {
  this.x = x || 0;
  this.y = y || 0;
  this.id = playerId;
  playerId++;
  this.name = name;
  this.color = elementColors[name];
  this.score = 0;
};

Player.SIZE = 0.025;

var targetId = 0;
var Target = function(x, y) {
  this.x = x || 0;
  this.y = y || 0;
  this.id = targetId;
  targetId++;

  this.baseY = this.y;
  this.rand1 = Math.random() * 0.075 + 0.075;
  this.rand2 = Math.random() * 2.5;
  this.progress = 0;
};

Target.prototype.move = function() {
  this.progress += 0.1;

  this.x = 0.02 * this.progress;
  this.y = this.baseY + this.rand1 * Math.sin(this.rand2 * this.progress);
};

Target.prototype.info = function () {
  return {
    id: this.id,
    x: this.x,
    y: this.y
  };
};

Target.SIZE = 0.05;

var roomId = 1;
var Room = function() {
  this.id = id.toString();
  roomId++;
  this.players = {};
  this.targets = [];
  this.hosts = [];
  this.stopped = false;
  this.elementNames = elementNames.slice();

  this.tick();
};

Room.prototype.info = function() {
  return {
    id: this.id,
    targets: this.targets.map(function(target) {
      return target.info();
    }),
    players: this.players,
  };
};

Room.prototype.fill = function() {
  for (var i = 0; i < NUMBER_OF_TARGETS - this.targets.length; i++) {
    var self = this;
    var targets =  this.targets;
    setTimeout(function() {
      // only create new target when this.targets hasn't changed in the meantime (e.g. due to a reset)
      if (self.targets === targets) {
        self.newTarget();
      }
    }, i * 2000);
  }
};

Room.prototype.newTarget = function() {
  this.addTarget(new Target(0, Math.random() * 0.6 + 0.2));
};

Room.prototype.addTarget = function(target) {
  this.targets.push(target);
};

Room.prototype.removeTarget = function(target) {
  var targetIndex = this.targets.indexOf(target);
  if (targetIndex > -1) {
    this.targets.splice(targetIndex, 1);
  }
};

Room.prototype.numberOfPlayers = function() {
  return Object.keys(this.players).length;
};

Room.prototype.newPlayer = function(player) {
  var player = new Player(0, 0, this.elementNames.splice(0, 1)[0]);
  this.addPlayer(player);

  return player;
};

Room.prototype.addPlayer = function(player) {
  this.players[player.id] = player;
};

Room.prototype.removePlayer = function(player) {
  this.elementNames.push(player.name);
  delete this.players[player.id];
};

Room.prototype.updateHosts = function() {
  this.emitToHosts("update", this.info());
};

Room.prototype.emitToHosts = function() {
  var args = arguments;
  this.hosts.forEach(function(hostSocket) {
    hostSocket.emit.apply(hostSocket, args);
  }, this);
};

Room.prototype.removeHost = function(host) {
  var hostIndex = this.hosts.indexOf(host);
  if (hostIndex > -1) {
    this.hosts.splice(hostIndex, 1);
  }
};

Room.prototype.tick = function() {
  if (!this.stopped) {
    this.targets.forEach(function(target) {
      target.move();
      if (target.x > 1) {
        this.removeTarget(target);
        this.newTarget();
      }
    }, this);
    this.updateHosts();
    setTimeout(this.tick.bind(this), 25);
  }
};

Room.prototype.stop = function() {
  this.stopped = true;
};

Room.prototype.reset = function() {
  for (var playerId in this.players) {
    this.players[playerId].score = 0;
  }
  this.targets = [];
  this.fill();
  if (this.stopped) {
    this.stopped = false;
    this.tick();
  }
};

// variables
var rooms = {};
var NUMBER_OF_PLAYERS = 4;

io.on("connection", function(socket) {
	// lobby
	socket.on("requestCurrentRooms", function() {
		var roomsArray = [];

		for (var roomKey in rooms) {
			roomsArray.push(rooms[roomKey].info());
		}

		socket.emit("currentRooms", roomsArray);
	});

	socket.on("requestNewRoom", function() {
		var room = new Room();
		room.fill();
		rooms[room.id] = room;
		socket.emit("newRoom", room.info());
	});

	// player
	socket.on("playerConnect", function(roomId) {
		var room = rooms[roomId];

		if (room === undefined) {
			socket.emit("noSuchRoom");
			return;
		}

		if (room.numberOfPlayers() >= NUMBER_OF_PLAYERS) {
			socket.emit("roomFull");
			return;
		}

		var player = room.newPlayer();

		socket.on("playerMoved", function(diffX, diffY) {
			diffX = player.x - diffX;
			diffY = player.y - diffY;

			// restrict players to game field bounds
			player.x = Math.min(Math.max(0, diffX), 1 - Player.SIZE);
			player.y = Math.min(Math.max(0, diffY), 1 - Player.SIZE);
		});

		socket.on("playerFired", function(id) {
			var player = room.players[id];
			var x = player.x + Player.SIZE / 2;
			var y = player.y + Player.SIZE / 2;

			room.emitToHosts("playerFired", {
				x: x,
				y: y,
				player: player
			});

			room.targets.forEach(function(target) {
				if (Target.SIZE + Math.sqrt(2 * Math.pow(Player.SIZE / 2, 2)) > Math.max(Math.abs(x - target.x), Math.abs(y - target.y))) {
					player.score++;
					if (player.score >= 10) {
						room.updateHosts();
						room.emitToHosts("gameWon", player);
						room.stop();
					}
					room.removeTarget(target);
					setTimeout(room.newTarget.bind(room), 2000);
				}
			});
		});
		socket.on("disconnect", function() {
			room.removePlayer(player);
		});

		socket.emit("playerInfo", player);
	});

	// host
	socket.on("host", function(roomId) {
		var room = rooms[roomId];

		if (room === undefined) {
			return;
		}

		socket.emit("objectSizes", {
			pointSize: Player.SIZE,
			targetRadius: Target.SIZE
		});
		room.hosts.push(socket);

		socket.on("requestReset", function() {
			room.reset();
		});

		socket.on("disconnect", function() {
			room.removeHost(socket);
			if (room.hosts.length === 0) {
				setTimeout(function() {
					if (room.hosts.length === 0) {
						delete rooms[roomId];
					}
				}, 2000);
			}
		});
	});
})
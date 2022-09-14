/* jshint node:true */
"use strict";

// modules
var io = require("sandbox-io");

var Room = require("./room");
var Player = require("./player");
var Target = require("./target");

// variables
var rooms = {};
var NUMBER_OF_PLAYERS = 4;

// socket.io
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
});

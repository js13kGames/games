/* jshint node:true */
"use strict";

var Player = require("./player");
var Target = require("./target");

var NUMBER_OF_TARGETS = 5;
var elementNames = ["Fire", "Water", "Earth", "Air"];

var id = 1;
var Room = function() {
	this.id = id.toString();
	id++;
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
			if (self.targets === targets) {
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

module.exports = Room;
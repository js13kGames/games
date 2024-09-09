/* jshint node:true */
"use strict";

var id = 0;

var elementColors = {
	Fire: "rgb(255, 0, 0)",
	Water: "rgb(0, 0, 255)",
	Earth: "rgb(101, 67, 33)",
	Air: "rgb(200, 200, 200)"
};

var Player = function(x, y, name) {
	this.x = x || 0;
	this.y = y || 0;
	this.id = id;
	id++;
	this.name = name;
	this.color = elementColors[name];
	this.score = 0;
};

Player.SIZE = 0.025;

module.exports = Player;
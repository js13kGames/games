"use strict";

var lastId = 0;
var players = new Set();

var s = 1000;

var digTimeout = 15*s;
var digPause = 3*s;

var hideTimeout = 20*s;
var hidePause = 3*s;

var findTimeout = 20*s;
var findTimeoutPerPlayer = 10*s;
var findPause = 3000;

var scorePause = 10000;

function main() {
	players.forEach(function(player){
		player.socket.emit("digStart", digTimeout);
	});
	setTimeout(function(){
		players.forEach(function(player){
			player.socket.emit("digEnd", digPause);
		});
		setTimeout(function(){
			var dugOut = [];
			players.forEach(function(player){
				if(player.dugOut) {
					player.dugOut.forEach(function(p){
						dugOut.push(p);
					});
					player.dugOut = null;
				}
			});
			players.forEach(function(player){
				player.socket.emit("hideStart", hideTimeout, dugOut);
			});
			setTimeout(function(){
				players.forEach(function(player){
						player.socket.emit("hideEnd", hidePause);
				});
				setTimeout(function(){
					var positions = [];
					players.forEach(function(player){
						if(player.pos) {
							positions.push(player.pos);
							player.pos = null;
						}
					});
					var t = findTimeout + findTimeoutPerPlayer * players.size;
					players.forEach(function(player){
							player.socket.emit("findStart", t, positions);
					});
					setTimeout(function(){
						players.forEach(function(player){
								player.socket.emit("findEnd", findPause);
						});
						setTimeout(function(){
							var score = [];
							players.forEach(function(opponent){
								if(opponent.glitchesFound !== null) {
									score.push([opponent.id, opponent.glitchesFound]);
									opponent.glitchesFound = null;
								}
							});
							score.sort(function(a,b){return b[1]-a[1]});
							players.forEach(function(player){
								player.socket.emit("score", scorePause, player.id, score);
							});
							setTimeout(function(){
								if(players.size>0) {
									main();
								}
							},scorePause);
						},findPause);
					},t);
				},hidePause);
			},hideTimeout);
		},digPause);
	},digTimeout);
}

module.exports = function (socket) {
	var player = {
		socket: socket,
		id: lastId++,
		glitchesFound: null,
		hideAt: null,
		dugOut: null,
	}
	players.add(player);
	socket.on("disconnect", function () {
		players.delete(player);
	});
	socket.on("dugOut", function(dugOut) {
		player.dugOut = dugOut;
	});
	socket.on("hideAt", function(pos) {
		player.pos = pos;
	});
	socket.on("glitchesFound", function(glitchesFound) {
		player.glitchesFound = glitchesFound;
	});
	if(players.size==1) {
		main();
	}
};

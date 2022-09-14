(function() {
	"use strict";

	// helper
	var toArray = function(object) {
		var array = [];
		var keys = Object.keys(object);
		for (var i = 0; i < keys.length; i++) {
			array.push(object[keys[i]]);
		}
		return array;
	};

	// constants
	var FONT_SIZE = 20;

	// set by server
	var POINT_SIZE = null;
	var TARGET_RADIUS = null;

	// variables
	var gameId = decodeURIComponent((new RegExp("[?|&]id=" + "([^&;]+?)(&|#|;|$)").exec(window.location.search)||[,""])[1].replace(/\+/g, "%20")) || null;
	var isGameRunning = true;
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	var players = [];
	var oldPlayers = [];
	var targets = [];
	var fires = [];

	var isPlayerInfoNew = function() {
		var getHash = function(array) {
			return JSON.stringify(array.map(function(el) {
				return el.id + " " + el.score;
			}));
		};

		return getHash(players) !== getHash(oldPlayers);
	};

	// canvas
	var resizeCanvas = function() {
		var size = Math.min(canvas.parentElement.clientWidth, canvas.parentElement.clientHeight) - 20;
		canvas.width = size;
		canvas.height = size;
	};
	resizeCanvas();

	context.font = FONT_SIZE + "pt Arial";
	context.textBaseline = "top";
	context.textAlign = "right";
	var draw = function() {
		if (isGameRunning) {
			context.clearRect(0, 0, canvas.width, canvas.height);

			fires.forEach(function(fire) {
				var radius = (Date.now() - fire.timestamp) / (2 * POINT_SIZE * canvas.width) + POINT_SIZE * canvas.width / 2;
				if (radius < 0) {
					return;
				}
				if (radius > 30) {
					fires.splice(fires.indexOf(fire), 1);
					return;
				}
				context.strokeStyle = fire.player.color;
				context.lineWidth = 5;
				context.beginPath();
	      		context.arc(fire.x * canvas.width, fire.y * canvas.height, radius, 0, 2 * Math.PI, false);
	      		context.stroke();
			});

			context.fillStyle = "rgb(0, 153, 0)";
			targets.forEach(function(target) {
				context.beginPath();
				context.arc(target.x * canvas.width, target.y * canvas.height, TARGET_RADIUS * canvas.width, 0, 2 * Math.PI, false);
				context.fill();
			});
		}

		players.forEach(function(player) {
			context.fillStyle = player.color;
			context.fillRect(player.x * canvas.width, player.y * canvas.height, POINT_SIZE * canvas.width, POINT_SIZE * canvas.width);
		});

		if (isPlayerInfoNew()) {
			oldPlayers = players;

			var sortedPlayers = players.sort(function(player1, player2) {
				return player1.id > player2.id;
			});

			if (players.length === 0) {
				document.getElementById("players").innerHTML = "Waiting for players ...";
			}
			else {
				document.getElementById("players").innerHTML = "";
			}

			sortedPlayers.forEach(function(player) {
				// score
				var html = "<h2 class='player'>" + player.name + "</h2>";
				html += "<div class='scoreBoxContainer'>";
				for (var i=0; i < player.score; i++) {
					html += "<div class='scoreBox' style='background-color: " + player.color + ";'></div>";
				}
				html += "</div>";

				document.getElementById("players").innerHTML += html;
			});
		}

		window.requestAnimationFrame(draw);
	};

	// socket.io
	var socket = window.io();

	socket.on("update", function(room) {
		isGameRunning = true;
		players = toArray(room.players);
		targets = room.targets;
	});

	socket.on("objectSizes", function(sizes) {
		POINT_SIZE = sizes.pointSize;
		TARGET_RADIUS = sizes.targetRadius;
	});

	socket.on("playerFired", function(fire) {
		fire.timestamp = Date.now();
		fires.push(fire);
	});

	socket.on("connect", function() {
		socket.emit("host", gameId);
	});

	socket.on("gameWon", function(player) {
		isGameRunning = false;
		var winnerIndex = players.map(function(player) {
			return player.id;
		}).indexOf(player.id);

		context.clearRect(0, 0, canvas.width, canvas.height);
		context.fillStyle = player.color;
		context.textAlign = "center";
		context.fillText("Congratulation Player " + (winnerIndex + 1) + "!", canvas.width / 2, canvas.height / 2);

	});

	// events
	window.addEventListener("resize", resizeCanvas);

	document.getElementById("reset").addEventListener("click", function() {
		socket.emit("requestReset");
	}, false);

	// initial draw
	document.getElementById("gameId").innerHTML = "Room " + gameId;
	draw();
})();
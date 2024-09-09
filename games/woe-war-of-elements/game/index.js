(function() {
	"use strict";

	var socket = window.io();
	socket.on("newRoom", function(room) {
		window.location.href += "host/host.html?id=" + room.id;
	});

	socket.on("currentRooms", function(rooms) {
		var roomsHTML = "";
		rooms.sort(function(room1, room2) {
			return room1.id > room2.id;
		}).forEach(function(room) {
			var openSlots = 4 - Object.keys(room.players).length;
			roomsHTML += "<a href='player/player.html?id=" + room.id + "'><button " + (openSlots === 0 ? "disabled" : "") + ">Room " + room.id + " (" + openSlots + " open slots) </button></a>";
		});

		document.getElementById("rooms").innerHTML += roomsHTML;
	});

	document.getElementById("newRoom").addEventListener("click", function() {
		socket.emit("requestNewRoom");
	}, false);

	socket.emit("requestCurrentRooms");
})();
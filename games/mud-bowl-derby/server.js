/**
 * Created by jonas on 2015-09-08.
 */

var socketio = require('sandbox-io');
log('Loaded sandbox-io', socketio);

var players = 0;
var highScores = db('highScores') || [];

socketio.on('connection', function(socket){

	players++;

	socketio.emit('players', players);
	socket.emit('leaders', highScores);

	socket.on('disconnect', function(){
		players = Math.max(0, players-1);

		socket.broadcast.emit('players', players);
	});

	socket.on('getScores', function() {
		socket.emit('leaders', highScores);
	});

	socket.on('clearScores', function(){
		highScores = [];
		db('highScores', highScores);
	});

	socket.on('score', function(data){

		for (var i=0; i<highScores.length; i++) {
			if (highScores[i].name === data.name) {
				if (data.score > highScores[i].score) {
					highScores[i] = data;
					return;
				}
				else {
					return;
				}
			}
		}

		highScores.push(data);
		highScores.sort(function(a, b) {
			return b.score - a.score;
		});
		while (highScores.length > 10) {
			highScores.pop();
		}

		db('highScores', highScores);
		socket.broadcast.emit('leaders', highScores);
	});
});
var players = 0;
// var highScores = db('highScores') || [];
var highScores = []

io.on('connection', function(socket){

	players++;

	io.emit('players', players);
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
		// db('highScores', highScores);
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

		// db('highScores', highScores);
		socket.broadcast.emit('leaders', highScores);
	})
})
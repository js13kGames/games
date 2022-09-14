"use strict";
function findGame(user) {
	game.addUser(user);
	user.game = game;
}

function pickRandom(array) {
	return array[Math.floor(Math.random() * array.length)];
}

function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

function randomName() {
	const name = pickRandom('Paprika,Zucchini,Tomate,Zwiebel,Lauch,Aubergine,Avocado,Orange,Apfel,Birne,Erdbeere,Heidelbeere,Blaubeere,Kürbis,Kartoffel,Knoblauch,Gurke'.split(','));
	return `${name} ${randomInt(1, 9)}`;
}

class Game {
	constructor() {
		this.users = [];
		this.racingUsers = [];
		this.firstFinishTime = null;
	}

	addUser(newUser) {
		this.users.forEach((user) => {
			newUser.socket.emit('joined', user.id, user.name);
			user.socket.emit('joined', newUser.id, newUser.name);
		});
		this.users.push(newUser);
	}

	removeUser(user) {
		const pos = this.users.findIndex(u => u === user);
		if (pos !== -1) {
			this.users.splice(pos, 1);
		}
		const pos2 = this.racingUsers.findIndex(u => u === user);
		if (pos2 !== -1) {
			this.racingUsers.splice(pos2, 1);
		}
		this.users.forEach(u => {
			u.socket.emit('left', user.id);
		});
	}

	populateMovement(user, movement) {
		console.log(movement);
		this.users.filter(u => u.id !== user.id).forEach((u) => {
			u.socket.emit('movement', user.id, movement);
		});
	}

	start() {
		this.startDate = Date.now();
		this.racingUsers = [...this.users];
		this.racingUsers.forEach((user) => {
			user.start(404);
		});
	}

	end() {
		console.log('Sending the highscores!');
		const highscore = this.racingUsers.map(u => ({
			id: u.id,
			name: u.name,
			finishTime: u.finishTime,
		})).sort((a, b) => a.finishTime < b.finishTime);
		this.users.forEach(u => {
			u.socket.emit('highscore', highscore);
		});
	}
}

class User {
	/**
	 * @param {Socket} socket
	 */
	constructor(socket) {
		this.socket = socket;
		this.id = socket.id;
		this.game = null;
		this.name = randomName();
		this.movements = [];
		this.finishTime = null;
		this.skinId = 0;
	}

	addMovementEvent(event) {
		this.movements.push(event);
		this.game.populateMovement(this, event);
	}

	start(length) {
		this.movements = [];
		this.finishTime = null;
		this.socket.emit('start', length);
	}

	finish(time) {
		this.finishTime = time;
		this.game.users.forEach(u => {
			u.socket.emit('userFinished', this.id, time);
		});
	}

	changeSkin(skinId) {
		this.skinId = skinId;
		this.game.users.forEach(u => {
			u.socket.emit('userSkin', this.id, skinId);
		});
	}
}

/**
 * Socket.IO on connect event
 * @param {Socket} socket
 */
module.exports = {

	io: (socket) => {
		const user = new User(socket);
		findGame(user);

		socket.on("disconnect", () => {
			game.removeUser(user);
			console.log("Disconnected: " + socket.id);
		});

		socket.on("restart", () => {
			console.log("Restarted: " + socket.id);
			user.game.start();
		});

		socket.on("movement", (event) => {
			console.log("Movement: " + socket.id);
			user.addMovementEvent(event);
		});

		socket.on("changeSkin", (skinId) => {
			console.log("Change skin: " + socket.id);
			user.changeSkin(skinId);
		});

		socket.on("finish", (time) => {
			console.log("Finished: " + socket.id);
			user.finish(time);
			if (game.racingUsers.every(u => !!u.finishTime)) {
				user.game.end();
			}
		});

		console.log("Connected: " + socket.id);
		socket.emit('you', socket.id, user.name);
	},

	stat: (req, res) => {
		storage.get('games', 0).then(games => {
			res.send(`<h1>Games played: ${games}</h1>`);
		});
	}

};

const game = new Game();

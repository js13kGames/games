"use strict";

/**
 * User sessions
 * @param {Array} users
 */
const users = [];

/**
 * Find opponent for a user
 * @param {User} user
 */
function findOpponent(user) {
	for (let i = 0; i < users.length; i++) {
		if (
			user !== users[i] &&
			users[i].opponent === null
		) {
			new Game(user, users[i]).start();
		}
	}
}

/**
 * Remove user session
 * @param {User} user
 */
function removeUser(user) {
	users.splice(users.indexOf(user), 1);
}

/**
 *
 * @returns {{emoji: *, key: *}[]}
 */
function generateCardGrid() {
	return [...EMOJIS]
		.sort(() => Math.random() - 0.5)
		.map((emoji, idx) => ({key: idx, emoji}));
}

/**
 * Game class
 */
class Game {

	/**
	 * @param {User} user1
	 * @param {User} user2
	 */
	constructor(user1, user2) {
		this.user1 = user1;
		this.user2 = user2;
		this.user1.player = PLAYER_1
		this.user2.player = PLAYER_2
		this.turn = Math.floor(Math.random() * 2);
	}

	/**
	 * Start new game
	 */
	start() {
		this.user1.start(this, this.user2);
		this.user2.start(this, this.user1);
	}

	/**
	 * Is game ended
	 * @return {boolean}
	 */
	ended() {
		// return this.user1.guess !== GUESS_NO && this.user2.guess !== GUESS_NO;
	}

	doTurn() {
		this.turn = (this.turn + 1) % 2;
		this.user1.socket.emit("turn", {turn: this.turn});
		this.user2.socket.emit("turn", {turn: this.turn});
	}

	endRound() {
		this.user1.setGuessed(null);
		this.user2.setGuessed(null);
		this.user1.socket.emit("newRound");
		this.user2.socket.emit("newRound");
	}

	/**
	 * Final score
	 */
	score() {
		if (this.user1.hand[this.user1.guessed].emoji === this.user2.hand[this.user2.guessed].emoji) {
			this.doTurn();
			if (this.turn === this.user1.player) {
				const result = {
					score: this.user1.player,
					user1: this.user1.guessed,
					user2: this.user2.guessed
				}
				this.user1.score++
				console.log(this.user1.player, this.user1.score)

				this.user1.matched({...result});
				this.user2.matched({...result});
			} else if (this.turn === this.user2.player) {
				const result = {
					score: this.user2.player,
					user1: this.user1.guessed,
					user2: this.user2.guessed
				}
				this.user2.score++
				console.log(this.user2.player, this.user2.score)

				this.user1.matched({...result});
				this.user2.matched({...result});
			}

			if (this.user1.score + this.user2.score >= EMOJIS.length) {
				if (this.user1.score > this.user2.score) {
					this.user1.win()
					this.user2.lose();
				} else if (this.user1.score < this.user2.score) {
					this.user1.lose()
					this.user2.win();
				} else {
					this.user1.draw();
					this.user2.draw();
				}
			}
		}
	}
}

/**
 * User session class
 */
class User {

	/**
	 * @param {Socket} socket
	 */
	constructor(socket) {
		this.socket = socket;
		this.game = null;
		this.opponent = null;
		this.hand = [];
		this.guessed = null;
		this.score = 0;
	}

	/**
	 * Set guessed value
	 * @param {number} guessed
	 */
	setGuessed(guessed) {
		this.guessed = guessed;
	}

	/**
	 * Start new game
	 * @param {Game} game
	 * @param {User} opponent
	 */
	start(game, opponent) {
		this.game = game;
		this.opponent = opponent;
		this.socket.emit("start", {playerNo: this.player, turn: this.game.turn});
		this.hand = generateCardGrid();
	}

	revealCard(props) {
		this.socket.emit("revealCard", {...props})
		this.opponent.socket.emit("revealCard", {...props})
	}

	/**
	 * Terminate game
	 */
	end() {
		this.game = null;
		this.opponent = null;
		this.socket.emit("end");
	}

	matched(props) {
		this.socket.emit("matchCard", {...props})
		this.opponent.socket.emit("matchCard", {...props})
	}

	/**
	 * Trigger win event
	 */
	win() {
		this.socket.emit("win", {player: this.player, score: this.score});
	}

	/**
	 * Trigger lose event
	 */
	lose() {
		this.socket.emit("lose", {player: this.player, score: this.score});
	}

	/**
	 * Trigger draw event
	 */
	draw() {
		this.socket.emit("draw", {player: this.player, score: this.score});
	}
}


/**
 * Socket.IO on connect event
 * @param {Socket} socket
 */
module.exports = {

	io: (socket) => {
		const user = new User(socket);
		users.push(user);
		findOpponent(user);

		socket.on("disconnect", () => {
			console.log("Disconnected: " + socket.id);
			removeUser(user);
			if (user.opponent) {
				user.opponent.end();
				findOpponent(user.opponent);
			}
		});

		socket.on("flip", (props) => {
			if (user.game.turn === user.player &&
				props.player === user.player) {
				// Set guess
				user.setGuessed(props.guess);
				user.revealCard({
					val: props.guess,
					emoji: user.hand[props.guess].emoji,
					player: user.player});

				user.game.doTurn();

				if (user.guessed !== null && user.opponent.guessed !== null ) {
					user.game.score();
					user.game.doTurn();
					user.game.endRound();
				}
			}

		});
		console.log("Connected: " + socket.id);
	},

	stat: (req, res) => {
		storage.get('games', 0).then(games => {
			res.send(`<h1>Games played: ${games}</h1>`);
		});
	}

};

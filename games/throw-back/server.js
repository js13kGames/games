const users = [];

function findOpponent(user) {
  for (let i = 0; i < users.length; i++) {
    if (user !== users[i] && users[i].opponent === null) {
      new Game(user, users[i]).start();
    }
  }
}

function removeUser(user) {
  users.splice(users.indexOf(user), 1);
}

class Game {
  constructor(user1, user2) {
    this.u1 = user1;
    this.u2 = user2;
    this.owner = null;
    this.rTime = 10;
    this.tTime = 3;
    this.playing = false;
  }

  start() {
    this.u1.start(this, this.u2);
    this.u2.start(this, this.u1);
  }

  ready(id) {
    if (!this.owner) {
      this.owner = id;
    }
    if (this.u1.id === id) {
      this.u1.ready(this.u2, this.owner === this.u1.id);
    }
    if (this.u2.id === id) {
      this.u2.ready(this.u1, this.owner === this.u2.id);
    }

    if (this.u1.isReady && this.u2.isReady) {
      this.startMainCountdown();
      this.startLocalCountdown();
    }
  }

  ended() {
    return this.u1.dead || this.u2.dead;
  }

  setBombOwner() {
    clearInterval(this.countdownLocal);
    if (this.owner === this.u1.id) {
      this.owner = this.u2.id;
      this.u1.tick("");
    } else {
      this.owner = this.u1.id;
      this.u2.tick("");
    }
    this.u1.update(this.owner === this.u1.id);
    this.u2.update(this.owner === this.u2.id);
    this.tTime = 3;
    this.startLocalCountdown();
  }

  startMainCountdown() {
    this.playing = true;
    this.countdown = setInterval(() => {
      this.u1.tick(this.rTime);
      this.u2.tick(this.rTime);
      this.rTime--;
      if (this.rTime < 0) {
        if (this.playing) {
          clearInterval(this.countdownLocal);
          clearInterval(this.countdown);
          this.roundOver();
          this.start();
          storage.get("games", 0).then(games => {
            storage.set("games", games + 1);
          });
          this.playing = false;
        }
      }
    }, 1000);
  }

  startLocalCountdown() {
    this.countdownLocal = setInterval(() => {
      this.u1.tickLocal(this.tTime);
      this.u2.tickLocal(this.tTime);

      this.tTime--;
      if (this.tTime < 0) {
        if (this.playing) {
          clearInterval(this.countdownLocal);
          clearInterval(this.countdown);
          this.roundOver();
          this.start();
          storage.get("games", 0).then(games => {
            storage.set("games", games + 1);
          });
          this.playing = false;
        }
      }
    }, 1000);
  }

  roundOver() {
    if (this.owner === this.u2.id) {
      this.u1.win();
      this.u2.lose();
    } else {
      this.u1.lose();
      this.u2.win();
    }
    this.owner = null;
    this.rTime = 10;
    this.tTime = 3;
  }
}

class User {
  constructor(socket) {
    this.socket = socket;
    this.game = null;
    this.opponent = null;
    this.isReady = false;
  }

  start(game, opponent) {
    this.game = game;
    this.opponent = opponent;
    this.socket.emit("start");
  }

  ready(opponent, bombOwner) {
    this.isReady = true;
    this.socket.emit("ready", bombOwner);
    opponent.socket.emit("opponentReady");
  }

  update(bombOwner) {
    this.socket.emit("update", bombOwner);
  }

  end() {
    this.game = null;
    this.opponent = null;
    this.hasBomb = null;
    this.socket.emit("end");
  }

  tick(time) {
    this.socket.emit("tick", time);
  }

  tickLocal(time) {
    this.socket.emit("tickLocal", time);
  }

  win() {
    this.isReady = false;
    this.socket.emit("win");
  }

  lose() {
    this.isReady = false;
    this.socket.emit("lose");
  }
}

module.exports = {
  io: socket => {
    const user = new User(socket);
    user.id = socket.id;
    users.push(user);
    findOpponent(user);
    socket.on("disconnect", () => {
      removeUser(user);
      if (user.opponent) {
        user.opponent.end();
        findOpponent(user.opponent);
      }
    });
    socket.on("throw", () => {
      user.game.setBombOwner();
    });
    socket.on("ready", () => {
      user.game.ready(user.id);
    });
  }
};

"use strict";

const users = [];

function findOpponent(user) {
  for (let i = 0; i < users.length; i++) {
    if (user !== users[i] && users[i].opponent === null) {
      new Game(user, users[i]).match();
    }
  }
}

function removeUser(user) {
  users.splice(users.indexOf(user), 1);
}

class Game {
  constructor(user1, user2) {
    this.user1 = user1;
    this.user2 = user2;
  }

  match() {
    this.user1.match(this, this.user2);
    this.user2.match(this, this.user1);
  }

  count() {
    this.user1.count(this, this.user2);
    this.user2.count(this, this.user1);
  }
}

class User {
  constructor(socket) {
    this.socket = socket;
    this.game = null;
    this.opponent = null;
  }

  match(game, opponent) {
    this.game = game;
    this.opponent = opponent;
    this.socket.emit("match");
  }

  end() {
    this.game = null;
    this.opponent = null;
    this.socket.emit("end");
  }
}

module.exports = {
  io: (socket) => {
    const user = new User(socket);
    users.push(user);
    findOpponent(user);

    socket.on("mov", (ev, pos)=> {
      if (user.opponent) user.opponent.socket.emit("mov", ev, pos);
    });
    socket.on("dmg", (q)=> {
      if (user.opponent) user.opponent.socket.emit("dmg", q);
    });

    socket.on("disconnect", () => {
      removeUser(user);
      if (user.opponent) {
        user.opponent.end();
      }
    });
  }
}
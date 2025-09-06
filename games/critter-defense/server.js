var GC = 0,
  UC = 0,
  srvr = {};
srvr.deltaT = new Date().getTime();
srvr.tickAr = [];
srvr.games = [];
srvr.searchingForGame = {
  size: 0
};

srvr.matchPlayers = function() {
  if ((this.searchingForGame.size) >= 2) {
    this.newGame();
  }
}

srvr.newGame = function(cl1,cl2) {
  var game = new Game(),
    k, cl, clc = cl1;
  this.tickAr.push(game);

  if ( !cl1 ) {
    for (k in this.searchingForGame) {
      cl = this.searchingForGame[k];
      if (!cl || !cl.emit) continue;
      game.addClient(cl);
      this.searchingForGame.size--;
      delete this.searchingForGame[k];
      if (game.clients.length >= 2) break;
    }
  } else {
    game.addClient(cl1);
    game.addClient(cl2);
  }

  game.start();
  this.matchPlayers();
}

srvr.getClientById = function(id) {
  var c,l,cls=io.of('/').sockets;
  for (c=0,l=cls.length;c<l;c++) {
    if ( cls[c].id == id ) return cls[c];
  }
  return null;
}

io.on('connection', function(client) {
  client.emit('connected', {});

  client.on('setName', function(data) {
    client.userName = data.name.substr(0,12);
    sendLobbyList();
  });

  client.on('requestGame', function(id) {
    if ( client.cClgned ) {
      var c;
      (c=srvr.getClientById(client.cClgned)) && c.emit && c.emit('challengeOff',client.id);
      client.cClgned = srvr.searchingForGame[client.id+'_'+client.cClgned] = undefined;
    }
    if ( (c&&c.id == id) || client.id == id ) return;
    if ( id == 'randomGame') {
      if (!srvr.searchingForGame[client.id]) {
        srvr.searchingForGame[client.id] = client;
        srvr.searchingForGame.size++;
      } else {
        srvr.searchingForGame[client.id] = undefined;
        srvr.searchingForGame.size--;
      }
    } else {
      var ci2;
      client.cClgned = id;
      srvr.searchingForGame[client.id+'_'+id] = client;
      if ( (ci2=srvr.searchingForGame[id]) || (ci2=srvr.searchingForGame[id+'_'+client.id]) ) {
        srvr.newGame(client,ci2);
        srvr.searchingForGame[id+'_'+client.id] = srvr.searchingForGame[client.id+'_'+id] = undefined;
      } else {
        srvr.getClientById(client.cClgned).emit('challengeOn',client.id);
      }
    }

    srvr.matchPlayers();
  });

  client.on('clicked', function(data) {
    client.currentGame && client.currentGame.deployUnit(client, data);
  });

  client.on('disconnect', function() {
    client.disconnected = true;
    sendLobbyList();
    var cg;
    if ((cg = client.currentGame)) {
      client.dead = true;
      io.to(cg.id).emit('playerLeft', {
        id: client.id
      });
    }
    if (srvr.searchingForGame[client.id]) {
      srvr.searchingForGame.size--;
      delete srvr.searchingForGame[client.id];
    }
  });
});

var sendLobbyList = function() {
  var clients = io.of('/').sockets,cts=[],c,l,cl;
  for ( c = 0, l = clients.length; c<l; c++) {
    cl = clients[c];
    if ( !cl.currentGame && !cl.disconnected ) {
      cts.push({id:cl.id,name:cl.userName});
    }
  }
  cts.unshift({id:'randomGame',name:'Random Game'});
  io.emit('lobbyList',{clients:cts});
};

var tick = function() {
  var delta = -(srvr.deltaT - (srvr.deltaT = new Date().getTime())),
    deltaFactor = (delta / 1000);

  for (var c = 0, l = srvr.tickAr.length; c < l; c++) {
    srvr.tickAr[c] && srvr.tickAr[c].tick(deltaFactor);
  }
}

setInterval(tick, 30);

(function(scope) {
  function Game() {
    this.id = 'game_' + Math.random() + '_' + (GC++);
    this.unitsOfUser = {};
    this.units = {};
    this.unitsToKill = [];
    this.unitsToDeploy = [];
    this.clients = [];
    this.clientIds = [];
    this.lanes = {};
  }
  var p = Game.prototype;

  p.addClient = function(client) {
    if (client.currentGame) {
      client.currentGame.removeClient(client);
    }
    client.currentGame = this;
    this.unitsOfUser[client.id] = [];
    this.clientIds.push(client.id);
    this.clients.push(client);

    client.join(this.id);
    client.emit('joinedGame', this.id);
    io.to(this.id).emit('clientList', this.clientIds);
  }

  p.removeClient = function(client) {
    this.killAllUnitsOf(client);
    this.unitsOfUser[client.id] && (this.unitsOfUser[client.id] = null);
    if (!this.started) {
      this.clientIds.splice(this.clientIds.indexOf(client.id), 1);
      this.clients.splice(this.clients.indexOf(client), 1);
    }
    client.leave(client.currentGame.id);
    io.to(this.id).emit('clientList', this.clientIds);
  }

  p.start = function() {
    var cl, c, l, id;
    for (c = 0, l = this.clientIds.length; c < l; c++) {
      id = this.clientIds[c];
      this.lanes[id] = [];

      (cl = this.clients[c]).currentGame = this;
      cl.money = {
        balance: 0,
        income: 30
      };
      cl.dead = false;
      cl.lives = 50;
    }
    this.started = true;
    this.incomeCd = 0;
    io.to(this.id).emit('gameStart', {
      units: []
    });
    sendLobbyList();
  }

  p.deployUnit = function(cl, data) {
    data.fY = Math.floor(data.y / 20) * 20;
    var i = Math.floor(data.fY / 100),
      laneid
    sl = this.clientIds[i] == cl.id,
      lane = this.lanes[(laneid = Math.floor(data.fY / 20))] = this.lanes[laneid] || [];
    if (cl.money.balance < CREEPS[data.type].cost) return;
    cl.money.balance -= CREEPS[data.type].cost;
    var u = new Runner(UC++, data.type);
    u.owner = cl.id;
    u._owner = cl;
    u.speed = sl ? (u.type.bullet ? 80 : 0) : -45;
    u.x = sl ? data.x : 500;
    u.y = data.fY;
    u.lane = lane;
    u.attack = data._att;
    lane.push(u);
    u.game = this;
    this.units[u.id] = u;
    this.unitsToDeploy.push({
      id: u.id,
      type: u.type.id,
      name: u.name,
      owner: u.owner,
      speed: u.speed,
      x: u.x,
      y: u.y,
      lane: laneid
    });
    if (!sl) cl.money.income += u.type.income;
  }

  p.killAllUnitsOf = function(client, by) {
    var units = this.unitsOfUser[client.id];
    for (var c = 0, l = units.length; c < l; c++) {
      var uid = units[c],
        u = this.units[uid];
      u.hp = 0;
      u.killedBy = by.id;
      this.unitsToKill.push(u);
    }
  }

  p.tick = function(dF) {
    var c, l, r, u, k, dc = 0,
      cl, sendUpdate = false;
    if (!this.started) return;
    this.incomeCd -= dF * 1000;

    for (c = 0, l = (r = this.clients).length; c < l; c++) {
      u = r[c];
      if (u.dead) {
        dc++;
      } else if (this.incomeCd <= 0) {
        u.money.balance += u.money.income;
        sendUpdate = true;
      }
    }

    if (dc >= l - 1) {
      for (c = 0, l = (r = this.clients).length; c < l; c++) {
        u = r[c];
        if (!u.dead) {
          io.to(this.id).emit('playerWon', {
            id: u.id
          });
        }
        delete u.currentGame;
        sendLobbyList();
      }
      this.started = false;
      srvr.tickAr.splice(srvr.tickAr.indexOf(this));
    }

    if (this.incomeCd <= 0) {
      this.incomeCd = 15000;
    }

    for (k in this.units) {
      u = this.units[k];
      if (!u.tick(dF)) {
        this.unitsToKill.push(u);
      }
    }

    //killing units
    for (c = 0, l = this.unitsToKill.length; c < l; c++) {
      u = this.unitsToKill[c];
      this.unitsToKill[c] = {
        id: u.id,
        x: u.x,
        killedBy: u.killedBy,
        income: u.type.income
      };
      this.unitsOfUser[u.owner].splice(this.unitsOfUser[u.owner].indexOf(u.id), 1);
      u.lane.splice(u.lane.indexOf(u), 1);
      delete this.units[u.id];
    }
    if (this.unitsToKill.length || this.unitsToDeploy.length || sendUpdate) {
      for (c = 0, l = this.clients.length; c < l; c++) {
        cl = this.clients[c];
        cl.emit('update', {
          killedUnits: this.unitsToKill,
          deployedUnits: this.unitsToDeploy,
          money: cl.money,
          lives: cl.lives,
          nextIncomeIn: this.incomeCd
        });
      }
      this.unitsToKill = [];
      this.unitsToDeploy = [];
    }
  }

  scope.Game = Game;
}(global));

//RUNNER / UNIT
(function(scope) {
  scope.CREEPS = {
    butterfly: {
      id: 'butterfly',
      hp: 30,
      attack: 16,
      cost: 5,
      income: 2,
      coolDown: 750,
      shoots: true
    },
    sheep: {
      id: 'sheep',
      hp: 140,
      attack: 60,
      cost: 25,
      income: 9,
      coolDown: 750,
      shoots: true
    },
    dsheep: {
      id: 'dsheep',
      hp: 610,
      attack: 300,
      cost: 125,
      income: 40,
      coolDown: 650
    },
    panda: {
      id: 'panda',
      hp: 3000,
      attack: 1400,
      cost: 625,
      income: 180,
      coolDown: 500
    },
    bullet: {
      id: 'bullet',
      hp: 1,
      cost: 0,
      income: 0,
      bullet: true
    }
  };

  function Runner(id, type) {
    this.name = 'Runner';
    this.type = CREEPS[type];
    this.id = id;
    this.hp = this.type.hp;
    this.x = this.y = this.coolDown = 0;
  }
  var p = Runner.prototype;

  p.damage = function(dmg) {
    this.hp -= dmg;
  }

  p.tick = function(dF) {
    var r, c, l, i, homeFactor, possibleTargets = [];
    this.coolDown -= dF * 1000;
    this.hitting = false;

    if (this.coolDown <= 0) {
      i = Math.floor(this.y / 100);
      homeFactor = this.owner == this.game.clientIds[i] ? 1.25 : 1;

      for (c = 0, l = this.lane.length; c < l; c++) {
        r = this.lane[c];
        if (!r || r.owner == this.owner || r.type.bullet) continue;
        if ((Math.abs(r.x - this.x) < 12 && !this.type.bullet) || (this.type.bullet && Math.abs(r.x - this.x) < 3) || (this.type.shoots && homeFactor == 1.25)) {
          possibleTargets.push(r);
        }
      }

      if (possibleTargets.length) {
        r = possibleTargets[Math.round(Math.random() * (possibleTargets.length - 0.098) - 0.49)];
        this.hitting = true;
        if (this.type.shoots && homeFactor == 1.25) {
          this.game.deployUnit(this._owner, {
            x: this.x,
            y: this.y,
            type: 'bullet',
            _att: this.type.attack
          });
          this.coolDown = this.type.coolDown * 2.25;
        } else {
          r.damage((this.type.attack || this.attack) * homeFactor);
          if (r.hp <= 0) {
            this._owner.money.balance += r.type.income;
            r.killedBy = this.owner;
          }
          this.coolDown = this.type.coolDown;
        }
        if (this.type.bullet) this.hp = 0;
      }
    }

    if (!this.hitting) {
      this.x += this.speed * dF;

      if (this.speed < 0 && this.x < -10) {
        var i = Math.floor(this.y / 100),
          cl = this.game.clients[i];
        cl.lives--;
        if (cl.lives == 0) {
          io.to(this.id).emit('playerDied', {
            id: cl.id
          });
          cl.dead = true;
        }
        if (cl.lives >= 0) {
          this._owner.lives++;
        }
        this.hp = 0;
      } else if (this.speed > 0 && this.x > 500) {
        this.hp = 0;
      }
    }

    if (this.hp <= 0) return false;
    return true;
  }

  scope.Runner = Runner;
}(global));
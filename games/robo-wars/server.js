(function () {"use strict"
/* Shared variables and global js variables (better here than global so they can be minified */
// global variable
var g = {};
var MOVEMENTS = ['ArrowRight', 'ArrowUp', 'ArrowLeft', 'ArrowDown'];
function clone(object) {
  return JSON.parse(JSON.stringify(object));
}
// Half PI 
var P = Math.PI / 2;
g.Actions = {
  init: function () {
    return {
      players: []
    };
  },
  types: {
    player: 'player',
    laser: 'laser',
    death: 'death',
    win: 'win'
  }
};
// Use complex to rotate, move on the plane
function Complex(x, y) {
  if (Array.isArray(x)) {
    return Complex(x[0], x[1]);
  }
  return { x: x, y: y };
}

// No method overloadin :(
Complex.add = function (c1, c2) {
  return new Complex(c1.x + c2.x, c1.y + c2.y);
};

Complex.multiply = function (c1, c2) {
  return new Complex(c1.x * c2.x - c1.y * c2.y, c1.x * c2.y + c1.y * c2.x);
};

//This only works 1, -1, i -i we should not need more than that
Complex.getTheta = function (complex) {
  if (complex.x === 0) {
    if (complex.y === 1) {
      return 1 * P;
    }
    return 3 * P;
  }
  if (complex.x === 1) {
    return 0;
  }
  return 2 * P;
};
g.Game = {
  get sx() {
    return 20;
  },
  get sy() {
    return 15;
  },
  init: function () {
    return {
      // TODO move this to client
      h: g.Game.sy * 40,
      w: g.Game.sx * 40,
      sx: g.Game.sx,
      sy: g.Game.sy,
      np: g.Game.np
    };
  },
  get np() {
    return 4;
  },
  prepareGame: function (game, np) {
    var i,
        j,
        types = ['floor', 'wall'],
        type,
        tiles = [],
        players = [],
        distorsionsx = [0, 0.99, 1 / 2, 1 / 2],
        distorsionsy = [1 / 2, 1 / 2, 0, 0.99],
        distorsionst = [[1, 0], [0, 1], [-1, 0], [0, -1]],
        xs = [],
        ys = [];
    for (i = 0; i < np; i++) {
      let x = ~~(distorsionsx[i] * game.sx);
      let y = ~~(distorsionsy[i] * game.sy);
      xs.push(x);
      ys.push(y);
      players.push(g.Player.init(Complex(x, y), 'player' + i, Complex(distorsionst[i]), 1, g.Player.statuses.alive));
    }
    for (i = 0; i < game.sx; i++) {
      for (j = 0; j < game.sy; j++) {
        type = types[Math.random() < 0.85 ? 0 : 1];
        for (let k = 0; k < xs.length; k++) {
          if (Math.abs(i - xs[k]) + Math.abs(j - ys[k]) < 2.5) {
            type = types[0];
          }
        }
        tiles.push(g.Tile.init(i, j, type));
      }
    }
    return { game: game, players: players, tiles: tiles, remainingActions: [], postActions: [] };
  },
  computeMovements(state, movements) {
    // We compute the resulting positions and actions and that is what we pass to the users, as the tiles they already know
    var newState = clone(state),
        processedActions = [],
        players = newState.players,
        laserAction;
    for (let movement of movements) {
      console.log('src/shared/Game.js:41:18:\'computeMovements\',movement', 'computeMovements', movement);
      // ohh my old node without json destructuring
      let position = movement.position;
      // dead are not allowed to move
      if (players[position].s === g.Player.statuses.dead) continue;
      let result = g.Player.handleAction(players[position], movement);
      console.log('src/shared/Game.js:47:18:\'computeMovements\',result', 'computeMovements', result);
      let playerMoved = { player: result.player, position: position };
      // Let's do all the pushing (in case we don't stumble to a wall)
      let playersToMove = [playerMoved];
      let direction = result.direction;
      if (direction) {
        while (playerMoved = g.Game.computePlayerCollision(playerMoved.player, players, direction)) {
          playersToMove.push(playerMoved);
        }
        // Compute if the movement is possible, if not we abort all movements
        if (g.Game.computeMovementObstruction(playersToMove[playersToMove.length - 1].player, newState)) {
          // No movements so the player stays in the same place
          playersToMove = [{ player: players[position], position: position }];
        } else {
          // TODO compute holes
        }
      }
      console.log('src/shared/Game.js:64:18:playersToMove.length', playersToMove.length);
      for (let pl of playersToMove) {
        players[pl.position] = pl.player;
      }
      let postActions = [];
      let originalPlayer = players[position];
      if (laserAction = g.Game.computeLasers(originalPlayer, players, newState)) {
        let weakenedPlayer = g.Player.decreaseHealth(laserAction.oplayer);
        let dieNow = players[laserAction.oposition].s === g.Player.statuses.alive && weakenedPlayer.s === g.Player.statuses.dead;
        players[laserAction.oposition] = weakenedPlayer;
        postActions.push(Object.assign(laserAction, { oplayer: weakenedPlayer }));
        if (dieNow) {
          postActions.push({ type: g.Actions.types.death, oposition: laserAction.oposition });
          let numberOfDeath = 0;
          let alivePlayer = -1;
          for (let i = 0; i < players.length; i++) {
            if (players[i].s === g.Player.statuses.dead) {
              numberOfDeath++;
            } else {
              alivePlayer = i;
            }
          }
          if (numberOfDeath = players.length - 1) postActions.push({ type: g.Actions.types.win, position: alivePlayer });
        }
      }
      // TODO handle shooting
      // TODO add postActions
      processedActions.push({ movements: playersToMove, postActions: postActions });
    }
    return { state: newState, actions: processedActions };
  },
  computePlayerCollision(player, players, direction) {
    for (let i = 0; i < players.length; i++) {
      if (g.Player.collide(player, players[i])) {
        return { position: i, player: g.Player.move(players[i], direction) };
      }
    }
  },
  computeMovementObstruction(player, state) {
    // TODO check for blocks
    var c = player.c,
        game = state.game;
    if (c.x < 0 || c.y < 0 || c.x >= game.sx || c.y >= game.sy) {
      return true;
    }
    if (state.tiles[game.sy * c.x + c.y].type === 'wall') {
      return true;
    }
  },
  computeLasers(player, players, state) {
    var playerProjection = player;
    // Laser blasts up to four
    for (let i = 0; i < 4; i++) {
      playerProjection = g.Player.handleAction(playerProjection, { subtype: 'ArrowUp' }).player;
      // Nothing to shoot
      if (g.Game.computeMovementObstruction(playerProjection, state)) return false;
      for (let i = 0; i < players.length; i++) {
        if (g.Player.collide(playerProjection, players[i])) {
          console.log('src/shared/Game.js:122:22:\'colliding\',playerProjection,i,players[i]', 'colliding', playerProjection, i, players[i]);
          return { type: 'laser', player: player, oplayer: players[i], oposition: i };
        }
      }
    }
  }
};
g.Player = {
  init: function (complex, playerType, orientation, health, status) {

    var tile = g.PlayerTile.init(complex.x, complex.y, playerType, Complex.getTheta(orientation));
    return {
      t: tile,
      o: orientation,
      c: complex,
      type: playerType,
      h: health,
      s: status
    };
  },
  handleAction(player, action) {
    var subtype = action.subtype;
    if (subtype === 'ArrowUp') {
      // Need movement in case we push another player
      return { player: g.Player.move(player, player.o), direction: player.o };
    }
    if (subtype === 'ArrowLeft') {
      return { player: g.Player.init(player.c, player.type, Complex.multiply(player.o, { x: 0, y: -1 }), player.h, player.s) };
    }
    if (subtype === 'ArrowRight') {
      // Canvas coordinates grow from top to bottom so orientation is the other sign as usual
      return { player: g.Player.init(player.c, player.type, Complex.multiply(player.o, { x: 0, y: 1 }), player.h, player.s) };
    }
    if (subtype === 'ArrowDown') {
      return { player: g.Player.move(player, Complex.multiply({ x: -1, y: 0 }, player.o)), direction: Complex.multiply({ x: -1, y: 0 }, player.o) };
    }
  },
  move(player, vector) {
    return g.Player.init(Complex.add(player.c, vector), player.type, player.o, player.h, player.s);
  },
  collide(pl1, pl2) {
    return pl1.c.x === pl2.c.x && pl1.c.y === pl2.c.y;
  },
  decreaseHealth(player) {
    var newHealth = player.h * 0.93;
    return g.Player.init(player.c, player.type, player.o, newHealth, newHealth < 0.5 ? g.Player.statuses.dead : g.Player.statuses.alive);
  },
  statuses: {
    dead: 'dead',
    alive: 'alive'
  }
};
g.PlayerTile = {
  init: function (x, y, playerType, theta) {
    return {
      x: x,
      y: y,
      type: playerType,
      t: theta
    };
  },
  changeState: function (player, dx, dy, dt) {
    return {
      x: player.x + dx,
      y: player.y + dy,
      type: player.type,
      t: player.t + dt
    };
  }
};
g.store = {};
g.Tile = {
  init: function (x, y, tileType) {
    return {
      x: x,
      y: y,
      type: tileType
    };
  },
  render: function (game, oldTile, newTile) {
    if (!newTile) {
      return;
    }
    if (oldTile) {
      // Already drawn
      return;
    }
    var realCoordinates = g.Game.getRealCoordinates(game, newTile.x, newTile.y);
    var c = g.bgc;
    var floor = new Image();
    floor.src = g.Tiles[newTile.type];
    c.drawImage(floor, realCoordinates.x, realCoordinates.y, realCoordinates.w, realCoordinates.h);
  }
};
if (typeof window !== 'undefined') {(function (){var socket;
var getById = document.getElementById.bind(document);
Object.assign(g.Game, {
  // No need for this on the server
  getRealCoordinates: function (game, x, y) {
    return {
      x: x * game.w / game.sx,
      y: y * game.h / game.sy,
      w: game.w / game.sx,
      h: game.h / game.sy
    };
  }
});
g.Input = {
  init: function () {
    return {
      time: new Date(),
      actions: []
    };
  },
  size: {
    w: 800,
    h: 40
  },
  max: 4,
  renderRobot: function (state) {
    var h = g.Input.size.h,
        w = g.Input.size.w,
        c = g.ic,
        position = state.position,
        img = g.images['player' + position];
    c.clearRect(0, h, w, w);
    c.drawImage(img, 0, h, h * g.Input.max, h * g.Input.max);
  },
  render: function (input, fraction) {
    var h = g.Input.size.h,
        w = g.Input.size.w,
        c = g.ic,
        d = ~~(h / 30),
        imgLoaded = 0,
        cx = h * g.Input.max + h / 2,
        cy = h / 2;
    // For some reason circle does not disappear without c.beginPath?¿
    c.beginPath();
    c.clearRect(0, 0, w, h);
    for (let i = 0; i < g.Input.max; i++) {
      c.strokeStyle = 'black';
      c.strokeRect(h * i + d, d, h - 2 * d, h - 2 * d);
      let action = input.actions[i];
      if (action) {
        c.save();
        let image = g.images['arrow'];
        c.translate(h * i + h / 2, h / 2);
        c.rotate(-g.Input.subtypeToTheta(action.subtype));
        c.drawImage(image, -(h - 2 * d) / 2, -(h - 2 * d) / 2, h - 2 * d, h - 2 * d);
        c.restore();
      }
    }
    fraction = Math.max(Math.min(fraction, 1), 0);

    if (fraction > 0) {
      c.beginPath();
      c.fillStyle = 'red';
      c.moveTo(cx, cy);
      c.arc(cx, cy, cy - 2 * d, 0, fraction * 4 * P);
      c.lineTo(cx, cy);
      c.closePath();
      c.fill();
    }
    c.stroke();
  },
  clear: function () {
    var h = g.Input.size.h,
        w = g.Input.size.w,
        c = g.ic;
    c.clearRect(0, 0, w, h);
  },
  subtypeToTheta(subtype) {
    var subtypes = MOVEMENTS,
        i = subtypes.indexOf(subtype);
    if (i > -1) {
      return P * i;
    }
  },
  // health goes from 0 to 1 1 is healthy, remainingTime so we can prioritize
  acceptAction(input, code, health, remainingTime) {
    var right = Math.random() < health,
        newInput = clone(input);
    if (input.actions.length >= g.Input.max) {
      return input;
    }
    if (right) {
      g.Sounds.play('right');
      newInput.actions.push({ type: g.Actions.types.player, subtype: code, remainingTime: remainingTime });
    } else {
      if (health > 0.1) g.Sounds.play('failed');
      newInput.actions.push({ type: g.Actions.types.player, subtype: MOVEMENTS[~~(Math.random() * 4)], remainingTime: remainingTime });
    }
    return newInput;
  },
  // Fill input to the total
  fillInput(input) {
    var newInput = clone(input),
        i;
    for (i = input.actions.length; i < g.Input.max; i++) {
      newInput.actions.push({ type: g.Actions.types.player, subtype: MOVEMENTS[~~(Math.random() * 4)], remainingTime: 0 });
    }
    return newInput;
  }
};
g.Laser = {
  render(game, player, oplayer, time) {
    time = Math.min(Math.max(time, 0), g.store.laserMovement) / g.store.laserMovement;
    var initialCoordinates = g.Game.getRealCoordinates(game, player.c.x, player.c.y);
    var finalCoordinates = g.Game.getRealCoordinates(game, oplayer.c.x, oplayer.c.y);
    var c = g.lc;
    c.clearRect(0, 0, game.w, game.h);
    c.strokeStyle = 'red';
    c.beginPath();
    var ix = initialCoordinates.x + game.w / game.sx / 2;
    var iy = initialCoordinates.y + game.h / game.sy / 2;
    var fx = finalCoordinates.x + game.w / game.sx / 2;
    var fy = finalCoordinates.y + game.h / game.sy / 2;
    //c.moveTo(ix * (1 - time) + fx * time, iy * (1- time) + fy * time )
    //c.lineTo(ix * (1 - time) + fx * (time + 0.1), iy * (1- time) + fy * (time + 0.1))
    c.moveTo(ix, iy);
    c.lineTo(fx, fy);
    c.stroke();
  },
  showLaser(game, player, oplayer) {
    var animating = g.Laser.animating,
        elapsedTime = new Date() - g.Laser.time;
    if (animating) {
      if (elapsedTime > g.store.laserMovement) {
        g.Laser.animating = false;
        var c = g.lc;
        c.clearRect(0, 0, game.w, game.h);
      } else {
        window.requestAnimationFrame(() => g.Laser.showLaser(game, player, oplayer));
        g.Laser.render(game, player, oplayer, elapsedTime);
      }
      return;
    }
    g.Laser.time = new Date();
    g.Laser.animating = true;
    window.requestAnimationFrame(() => g.Laser.showLaser(game, player, oplayer));
  }
};
Object.assign(g.PlayerTile, {
  render: function (game, oldState, newState, time) {
    if (!newState) {
      return;
    }
    var finalCoordinates = g.Game.getRealCoordinates(game, newState.x, newState.y);
    var newX, newY, theta, oldT;
    time = Math.min(Math.max(time, 0), g.store.movement) / g.store.movement;
    if (!oldState) {
      newX = finalCoordinates.x;
      newY = finalCoordinates.y;
      theta = newState.t;
    } else {
      var initialCoordinates = g.Game.getRealCoordinates(game, oldState.x, oldState.y);
      newX = (1 - time) * initialCoordinates.x + time * finalCoordinates.x;
      newY = (1 - time) * initialCoordinates.y + time * finalCoordinates.y;
      oldT = Math.abs(oldState.t - newState.t) < 2 * P ? oldState.t : Math.abs(oldState.t - 4 * P - newState.t) < Math.abs(oldState.t + 4 * P - newState.t) ? oldState.t - 4 * P : oldState.t + 4 * P;
      //if (oldT !== oldState.t) debugger
      theta = (1 - time) * oldT + time * newState.t;
    }
    var c = g.c;
    g.c.save();
    var halfImageWidth = finalCoordinates.w / 2;
    var halfImageHeight = finalCoordinates.h / 2;
    g.c.translate(newX + halfImageWidth, newY + halfImageHeight);
    g.c.rotate(theta);
    var player = g.images[newState.type];
    c.drawImage(player, -halfImageHeight, -halfImageWidth, halfImageWidth * 2, halfImageHeight * 2);
    g.c.restore();
  }
});
g.Sounds = {
  types: {
    shoot: [3, 0.0948, 0.0129, 0.3671, 0.3266, 0.5,,, -0.0095,, 0.0367, -0.5561, 0.2962,, 0.0279, 0.661, 0.0342, 0.6563, 0.9997, 0.2854,, 0.1397, -0.0457, 0.5],
    failed: [3,, 0.6665, 0.3981, 0.468, 0.5321,, 0.0299, -0.9171,, 0.1315, 0.1741,,, -0.0362,, -0.7438, -0.0077, 0.9986,, 0.2791, 0.3116, 0.2152, 0.5],
    right: [2,, 0.5642, 0.1458, 0.9778, 0.5008,, -0.002, 0.8448, 0.0123,, 0.6281,,, -0.2081,, -0.2477, -0.0012, 0.974, -0.6453, 0.9891, 0.8115, 0.1889, 0.5],
    death: [3, 0.0011, 0.396, 0.4339, 0.2223, 0.5037,, 0.0302, 0.8244, 0.0029, 0.5527, 0.6106, 0.0088,, -0.103,, 0.048, -0.2334, 0.9933, 0.0696, 0.3596, 0.0001, 0.0033, 0.5]
  },
  play(type) {
    var sound;
    if (sound = g.Sounds.types[type]) {
      var audio = new Audio();
      audio.src = jsfxr(sound);
      audio.play();
    }
  }
};
/*	https://github.com/mneubrand/jsfxr Minified version from https://github.com/eoinmcg/roboflip/blob/master/js/lib/jsfxr.min.js
*/
(function () {
  function SfxrParams() {
    this.setSettings = function (e) {
      for (var f = 0; 24 > f; f++) this[String.fromCharCode(97 + f)] = e[f] || 0;.01 > this.c && (this.c = .01);e = this.b + this.c + this.e;.18 > e && (e = .18 / e, this.b *= e, this.c *= e, this.e *= e);
    };
  }
  function SfxrSynth() {
    this._params = new SfxrParams();var e, f, d, h, l, A, K, L, M, B, m, N;this.reset = function () {
      var b = this._params;h = 100 / (b.f * b.f + .001);l = 100 / (b.g * b.g + .001);A = 1 - b.h * b.h * b.h * .01;K = -b.i * b.i * b.i * 1E-6;b.a || (m = .5 - b.n / 2, N = 5E-5 * -b.o);L = 1 + b.l * b.l * (0 < b.l ? -.9 : 10);M = 0;B = 1 == b.m ? 0 : (1 - b.m) * (1 - b.m) * 2E4 + 32;
    };this.totalReset = function () {
      this.reset();var b = this._params;e = b.b * b.b * 1E5;f = b.c * b.c * 1E5;d = b.e * b.e * 1E5 + 12;return 3 * ((e + f + d) / 3 | 0);
    };this.synthWave = function (b, O) {
      var a = this._params,
          P = 1 != a.s || a.v,
          r = a.v * a.v * .1,
          Q = 1 + 3E-4 * a.w,
          n = a.s * a.s * a.s * .1,
          W = 1 + 1E-4 * a.t,
          X = 1 != a.s,
          Y = a.x * a.x,
          Z = a.g,
          R = a.q || a.r,
          aa = a.r * a.r * a.r * .2,
          E = a.q * a.q * (0 > a.q ? -1020 : 1020),
          S = a.p ? ((1 - a.p) * (1 - a.p) * 2E4 | 0) + 32 : 0,
          ba = a.d,
          T = a.j / 2,
          ca = a.k * a.k * .01,
          F = a.a,
          G = e,
          da = 1 / e,
          ea = 1 / f,
          fa = 1 / d,
          a = 5 / (1 + a.u * a.u * 20) * (.01 + n);.8 < a && (a = .8);for (var a = 1 - a, H = !1, U = 0, w = 0, x = 0, C = 0, u = 0, y, v = 0, g, p = 0, t, I = 0, c, V = 0, q, J = 0, D = Array(1024), z = Array(32), k = D.length; k--;) D[k] = 0;for (k = z.length; k--;) z[k] = 2 * Math.random() - 1;for (k = 0; k < O; k++) {
        if (H) return k;S && ++V >= S && (V = 0, this.reset());B && ++M >= B && (B = 0, h *= L);A += K;h *= A;h > l && (h = l, 0 < Z && (H = !0));g = h;0 < T && (J += ca, g *= 1 + Math.sin(J) * T);g |= 0;8 > g && (g = 8);F || (m += N, 0 > m ? m = 0 : .5 < m && (m = .5));if (++w > G) switch (w = 0, ++U) {case 1:
            G = f;break;case 2:
            G = d;}switch (U) {case 0:
            x = w * da;break;case 1:
            x = 1 + 2 * (1 - w * ea) * ba;break;case 2:
            x = 1 - w * fa;break;case 3:
            x = 0, H = !0;}R && (E += aa, t = E | 0, 0 > t ? t = -t : 1023 < t && (t = 1023));P && Q && (r *= Q, 1E-5 > r ? r = 1E-5 : .1 < r && (r = .1));q = 0;for (var ga = 8; ga--;) {
          p++;if (p >= g && (p %= g, 3 == F)) for (y = z.length; y--;) z[y] = 2 * Math.random() - 1;switch (F) {case 0:
              c = p / g < m ? .5 : -.5;break;case 1:
              c = 1 - p / g * 2;
              break;case 2:
              c = p / g;c = 6.28318531 * (.5 < c ? c - 1 : c);c = 1.27323954 * c + .405284735 * c * c * (0 > c ? 1 : -1);c = .225 * ((0 > c ? -1 : 1) * c * c - c) + c;break;case 3:
              c = z[Math.abs(32 * p / g | 0)];}P && (y = v, n *= W, 0 > n ? n = 0 : .1 < n && (n = .1), X ? (u += (c - v) * n, u *= a) : (v = c, u = 0), v += u, C += v - y, c = C *= 1 - r);R && (D[I % 1024] = c, c += D[(I - t + 1024) % 1024], I++);q += c;
        }q = .125 * q * x * Y;b[k] = 1 <= q ? 32767 : -1 >= q ? -32768 : 32767 * q | 0;
      }return O;
    };
  }
  var synth = new SfxrSynth();
  window.jsfxr = function (e) {
    synth._params.setSettings(e);var f = synth.totalReset();e = new Uint8Array(4 * ((f + 1) / 2 | 0) + 44);var f = 2 * synth.synthWave(new Uint16Array(e.buffer, 44), f),
        d = new Uint32Array(e.buffer, 0, 44);d[0] = 1179011410;d[1] = f + 36;d[2] = 1163280727;d[3] = 544501094;d[4] = 16;d[5] = 65537;d[6] = 44100;d[7] = 88200;d[8] = 1048578;d[9] = 1635017060;d[10] = f;for (var f = f + 44, d = 0, h = "data:audio/wav;base64,"; d < f; d += 3) var l = e[d] << 16 | e[d + 1] << 8 | e[d + 2], h = h + ("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[l >> 18] + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[l >> 12 & 63] + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[l >> 6 & 63] + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[l & 63]);return h;
  };
})();
g.store = {
  init: function () {
    return {
      game: g.Game.init(),
      tiles: [],
      players: [],
      remainingActions: [],
      postActions: []
    };
  },
  movement: 1000,
  laserMovement: 50,
  inputActions: 4,
  inputTime: 2000,
  listenInput: false,
  // tick depends movement so we need this wizardy
  get tick() {
    return this.movement / 60;
  },
  startGame(state) {
    var oldState = g.store.state;
    g.store.oldState = oldState;
    g.store.state = state;
    g.store.render(oldState, state);
    g.Input.renderRobot(state);
    g.store.renderHealth(state.players);
    g.message.textContent = null;
    getById('help').textContent = null;
    g.store.acceptInput();
  },
  acceptInput() {
    if (g.store.dead || g.won) return;
    if (!g.store.input) {
      g.store.input = g.Input.init();
      document.addEventListener('keydown', g.store.handleKeyDown, false);
      return window.requestAnimationFrame(g.store.acceptInput);
    }
    // TODO only send necessary actions
    var remainingTime = (g.store.inputTime - (new Date() - new Date(g.store.input.time))) / g.store.inputTime;
    if (remainingTime < 0) {
      document.removeEventListener('keydown', g.store.handleKeyDown);
      console.log('src/client/Store.js:40:18:\'Remaining time is over\'', 'Remaining time is over');
      g.store.input = g.Input.fillInput(g.store.input);
      g.Input.render(g.store.input, -1);
      g.store.sendMovements(g.store.input.actions);
      g.store.input = false;
      // TODO tell the server we are ready to go
      return;
    }
    g.Input.render(g.store.input, remainingTime);
    window.requestAnimationFrame(g.store.acceptInput);
  },
  acceptActions(actions) {
    var state = g.store.state,
        newState = clone(state);
    newState.remainingActions = actions;
    g.store.oldState = state;
    g.store.state = newState;
    g.store.displayMovement();
  },
  prepareGame() {
    var state = g.store.state,
        newState = clone(state),
        game = state.game;
    var result = g.Game.prepareGame(game);
    newState.tiles = result.tiles;
    newState.players = result.players;
    g.store.state = newState;
    g.store.oldState = state;
    g.store.render(state, newState);
  },
  sendMovements(actions) {
    console.log('src/client/Store.js:69:16:\'Moving\',actions,{actions: g.store.input.actions}', 'Moving', actions, { actions: g.store.input.actions });
    socket.emit('move', actions);
  },
  render(oldState, newState, time) {
    g.c.clearRect(0, 0, newState.game.w, newState.game.h);
    var oldTiles = oldState.tiles;
    var newTiles = newState.tiles;
    var game = newState.game;
    var i;
    // First go the tiles
    for (i = 0; i < Math.max(oldTiles.length, newTiles.length); i++) {
      g.Tile.render(game, oldTiles[i], newTiles[i]);
    }
    var oldPlayers = oldState.players;
    var newPlayers = newState.players;
    for (i = 0; i < Math.max(oldPlayers.length, newPlayers.length); i++) {
      g.PlayerTile.render(game, (oldPlayers[i] || {}).t, (newPlayers[i] || {}).t, time);
    }
  },
  displayMovement() {
    var oldState = g.store.oldState,
        state = g.store.state,
        game = state.game,
        animating = g.store.animating,
        elapsedTime = new Date() - g.store.time;
    // we need to do post Actions
    if (animating) {
      // Leave one tick to make sure we draw the end of it
      if (elapsedTime > g.store.movement) {
        g.store.animating = false;
      }
      window.requestAnimationFrame(g.store.displayMovement);
      // Render one just time to make sure we render correctly
      return g.store.render(oldState, state, elapsedTime);
    }
    var newState = clone(state),
        remainingActions = newState.remainingActions,
        postActions = newState.postActions,
        nextActions;
    // Handle post actions from previous movement
    if (postActions.length) {
      for (let postAction of postActions) {
        console.log('src/client/Store.js:105:20:postAction', postAction);
        g.store.handleAction(newState, postAction);
      }
      newState.postActions = [];

      // TODO laser, holes, lives...
    } else {
      // Handle actions
      if (!remainingActions.length) {
        console.log('src/client/Store.js:114:20:\'acceptInput\'', 'acceptInput');
        g.store.acceptInput();
        return;
      }
      // Prepare the actions
      nextActions = remainingActions.shift();
      for (let movement of nextActions.movements) {
        Object.assign(newState.players[movement.position], movement.player);
      }
      newState.postActions = nextActions.postActions;
    }
    // TODO handle postactions
    g.store.oldState = state;
    g.store.state = newState;
    g.store.animating = true;
    g.store.time = new Date();
    window.requestAnimationFrame(g.store.displayMovement);
    //g.store.render(state, newState, g.store.time)
  },
  handleAction(state, action) {
    if (action.type === g.Actions.types.laser) {
      Object.assign(state.players[action.oposition], action.oplayer);
      console.log('src/client/Store.js:136:18:action.oplayer.h,state.players[action.oposition].h', action.oplayer.h, state.players[action.oposition].h);
      g.store.renderHealth(state.players);
      g.Laser.showLaser(state.game, action.player, action.oplayer);
      g.Sounds.play('shoot');
      return;
    }
    if (action.type === g.Actions.types.death) {
      console.log('src/client/Store.js:143:18:\'death\'', 'death');
      g.store.handleDeath(action.oposition, state);
      return;
    }
    if (action.type === g.Actions.types.win) {
      g.store.handleWin(action.position, state);
    }
  },
  handleKeyDown(e) {
    var code = e.key || e.code,
        input = g.store.input,
        newInput = clone(input),
        remainingTime = (g.store.inputTime - (new Date() - new Date(g.store.input.time))) / g.store.inputTime;
    if (MOVEMENTS.indexOf(code) !== -1) {
      // TOOD pass health
      g.store.input = g.Input.acceptAction(input, code, g.store.state.players[g.store.state.position].h, remainingTime);
    }
  },
  renderHealth(players) {
    var health = [],
        player;
    for (let i = 0; i < players.length; i++) {
      player = players[i];
      health.push(`Player ${ i } health: ${ parseInt(2 * (Math.max(player.h, 0.5) - 0.5) * 100) } %`);
    }
    g.health.textContent = health.join(' ');
  },
  handleDeath(position, state) {
    g.Sounds.play('death');
    if (position === state.position) {
      console.log('src/client/Store.js:169:18:\'You are dead\'', 'You are dead');
      g.store.dead = true;
      g.message.textContent = 'You are dead';
    } else {
      console.log('src/client/Store.js:173:18:`Player ${position} is dead`', `Player ${ position } is dead`);
    }
  },
  handleWin(position, state) {
    if (position === state.position) {
      g.won = true;
      g.message.textContent = 'You WON';
      console.log('src/client/Store.js:180:18:\'You won\'', 'You won');
    }
  }
};
Object.assign(g.Tile, { render: function (game, oldTile, newTile) {
    if (!newTile) {
      return;
    }
    if (oldTile) {
      // Already drawn
      return;
    }
    var realCoordinates = g.Game.getRealCoordinates(game, newTile.x, newTile.y);
    var c = g.bgc;
    var floor = g.images[newTile.type];
    c.drawImage(floor, realCoordinates.x, realCoordinates.y, realCoordinates.w, realCoordinates.h);
  }
});
g.Tiles = {};
g.Tiles = {
  floor: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AkLCTo0C01FEQAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAABQSURBVBjTpVBBDgAgCCr/Wr0pe0r1tw6txhJPcVNAHHGOHg6a1pRLMIgo8iAe0bS+IlxtYK7YlTWQOGsQ7w80COXI4/c+Lem7J8zlPeGYclkeyCQcEkGchAAAAABJRU5ErkJggg==',
  wall: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AkLChMusC+d2QAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAABLSURBVBjTY7S1tWUgBJjQ+GqqqjgVweVu3b6NqY2RHOvQDIYwmLA6BW4phMEEUQEXRTMDYRKyY9HMQHcTXCtmKBDtO2TrsRpGlEkAsuEcUVru56YAAAAASUVORK5CYII=',
  player0: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wAAAAAzJ3zzAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AkLCykj6vVVKgAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAACrSURBVEjHY8yOD2WgJWBioDEY+hawwBhTF67+T6lh2fGhjMMviBjRk+mNj1v+MzAwMGio/GS4cYcdqyZkOQ1+H0ayfIBuuIbKT5xyZFmAbCA+35BtAbKB5BqOkkzx+QTZAhh/74bvDAwMDAx7GRDJm6xkiu56Un3DQqzL0YFzACflqQgW0RoqP1EinWoZDeaDG3fYMeKBpjmZlHiguLCjOBUNvcJutMqkuwUAklJFrPsWPH0AAAAASUVORK5CYII=',
  player1: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QAawBfAFVrQDHVAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AkLCyYCIQRZuwAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAACwSURBVEjHY7S3tWGgJWBioDFgQWL/x6OOEYsYUerp6gOCQEdJEs6+cu85yRYwMjAwMHz69PE/ruA4duEjToP4+PgZCfrg06ePZAfFp08fGawMNDB8yEKqQciG4Il0+kUyVS2YsnA1w5SFqwcuo1EMcuJDR4OIuCBCzuWDzwfHLtzAlQEZaRpExy7cYODj4x/gCgebC6AFGSOW0vM/MWURUUGEy+JBVyczkqiXcVD4AAAU0DA4nLYhlQAAAABJRU5ErkJggg==',
  player2: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AkLEQITq+2+SQAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAC8SURBVEjHzVXJEYAwCBTGEtOEFdlEOrMI/KiTY0nAm5l8EtjlCpCIDE/KaFUkosMTESGzXSuCFFSTHhkksABbifgO8JZdFoGmFGOs7kIIpki45xkCb92rKULe90DQe4nDXs9VvXk7Wg1S5hIc5bvSWTadKa/DeKVzMpnyNO0kPDws9xEoNWDvbPH+alhkTxehJkgJ2Gp0Vo9bw6pnjN7do0IjsUZYjesrfwJlgb0LxLsPvtlor+3kf40KRVYGyn7QjXEhqwAAAABJRU5ErkJggg==',
  player3: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AkLEC0oCTgFNwAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAADnSURBVEjH7ZUxEoIwEEX/RsYTeAUbr2KjlZWdx7KjogIKOQpNruAFLGQtIBgQFmLI2LgzzBaQ/2aX3R9iZoQMhcARHBD5HCaitr/MTN4AW7AX69Ez0k8+HvajL7O8UACqqQo+AJLoACQCQABWzPyYBLiIm0izG4ltNQBbPL1f39DNxQsyOKZGdEg8iXWdS90+UuXOe3A6b+u86+ZJgF2maZHdqkUXTep7Euu2CiermDtBRjwpdSfPXrSlR9Xb7LK8ICIKA2jsQrHgN8p1M3vfVQCeggnKZjfXTceMzhnwzX1A/zv554AXJGZ3EDgQafoAAAAASUVORK5CYII=',
  arrow: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AkLCiA4sJBNuAAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAABXSURBVDjLxZNBDoBACAPb/f+fZw+6hsNqBBLl3iGlxYA6M9ScdwAb2dQB4AtUtnADqd0gQIxUjwHcA3wX46OFTBNjAmcqo7o5b2FtD+JclTfiowd/f+METjMlD4iLdKcAAAAASUVORK5CYII='
};
/* init variables here */
g.canvas = document.getElementById('c');
g.c = g.canvas.getContext('2d');
g.bgcanvas = document.getElementById('bgc');
g.bgc = g.bgcanvas.getContext('2d');
g.icanvas = document.getElementById('ic');
g.ic = g.icanvas.getContext('2d');
g.lcanvas = document.getElementById('lc');
g.lc = g.lcanvas.getContext('2d');
g.health = getById('health');
g.message = getById('message');
g.images = {};
// Nasty trick to cache imgs and make loading sync
for (let img in g.Tiles) {
  let image = new Image();
  image.src = g.Tiles[img];
  g.images[img] = image;
}
/**
 * Bind Socket.IO and button events
 */
function bind() {

  socket.on('actions', function (actions) {
    g.store.acceptActions(actions);
    console.log('src/client/init.js:26:16:actions', actions);
  });
  socket.on('start', function (state) {
    console.log('src/client/init.js:29:16:\'starting\'', 'starting');
    g.store.startGame(JSON.parse(state));
    //console.log(state, position)
  });
  socket.on("end", function () {
    console.log('src/client/init.js:34:16:"Waiting for opponent..."', "Waiting for opponent...");
  });

  socket.on("connect", function () {
    console.log('src/client/init.js:38:16:"Waiting for opponent..."', "Waiting for opponent...");
  });

  socket.on("disconnect", function () {
    console.error('src/client/init.js:42:18:"Connection lost!"', "Connection lost!");
  });
  socket.on('winner', function (position) {
    g.store.handleWin(position, g.store.state);
  });

  socket.on("error", function () {
    console.error('src/client/init.js:49:18:"Connection error!"', "Connection error!");
  });
}
function init() {
  socket = io({ upgrade: false, transports: ["websocket"] });
  bind();
}

window.addEventListener("load", init, false);

g.store.state = g.store.init();

/*	https://github.com/mneubrand/jsfxr Minified version from https://github.com/eoinmcg/roboflip/blob/master/js/lib/jsfxr.min.js
*/
(function () {
  function SfxrParams() {
    this.setSettings = function (e) {
      for (var f = 0; 24 > f; f++) this[String.fromCharCode(97 + f)] = e[f] || 0;.01 > this.c && (this.c = .01);e = this.b + this.c + this.e;.18 > e && (e = .18 / e, this.b *= e, this.c *= e, this.e *= e);
    };
  }
  function SfxrSynth() {
    this._params = new SfxrParams();var e, f, d, h, l, A, K, L, M, B, m, N;this.reset = function () {
      var b = this._params;h = 100 / (b.f * b.f + .001);l = 100 / (b.g * b.g + .001);A = 1 - b.h * b.h * b.h * .01;K = -b.i * b.i * b.i * 1E-6;b.a || (m = .5 - b.n / 2, N = 5E-5 * -b.o);L = 1 + b.l * b.l * (0 < b.l ? -.9 : 10);M = 0;B = 1 == b.m ? 0 : (1 - b.m) * (1 - b.m) * 2E4 + 32;
    };this.totalReset = function () {
      this.reset();var b = this._params;e = b.b * b.b * 1E5;f = b.c * b.c * 1E5;d = b.e * b.e * 1E5 + 12;return 3 * ((e + f + d) / 3 | 0);
    };this.synthWave = function (b, O) {
      var a = this._params,
          P = 1 != a.s || a.v,
          r = a.v * a.v * .1,
          Q = 1 + 3E-4 * a.w,
          n = a.s * a.s * a.s * .1,
          W = 1 + 1E-4 * a.t,
          X = 1 != a.s,
          Y = a.x * a.x,
          Z = a.g,
          R = a.q || a.r,
          aa = a.r * a.r * a.r * .2,
          E = a.q * a.q * (0 > a.q ? -1020 : 1020),
          S = a.p ? ((1 - a.p) * (1 - a.p) * 2E4 | 0) + 32 : 0,
          ba = a.d,
          T = a.j / 2,
          ca = a.k * a.k * .01,
          F = a.a,
          G = e,
          da = 1 / e,
          ea = 1 / f,
          fa = 1 / d,
          a = 5 / (1 + a.u * a.u * 20) * (.01 + n);.8 < a && (a = .8);for (var a = 1 - a, H = !1, U = 0, w = 0, x = 0, C = 0, u = 0, y, v = 0, g, p = 0, t, I = 0, c, V = 0, q, J = 0, D = Array(1024), z = Array(32), k = D.length; k--;) D[k] = 0;for (k = z.length; k--;) z[k] = 2 * Math.random() - 1;for (k = 0; k < O; k++) {
        if (H) return k;S && ++V >= S && (V = 0, this.reset());B && ++M >= B && (B = 0, h *= L);A += K;h *= A;h > l && (h = l, 0 < Z && (H = !0));g = h;0 < T && (J += ca, g *= 1 + Math.sin(J) * T);g |= 0;8 > g && (g = 8);F || (m += N, 0 > m ? m = 0 : .5 < m && (m = .5));if (++w > G) switch (w = 0, ++U) {case 1:
            G = f;break;case 2:
            G = d;}switch (U) {case 0:
            x = w * da;break;case 1:
            x = 1 + 2 * (1 - w * ea) * ba;break;case 2:
            x = 1 - w * fa;break;case 3:
            x = 0, H = !0;}R && (E += aa, t = E | 0, 0 > t ? t = -t : 1023 < t && (t = 1023));P && Q && (r *= Q, 1E-5 > r ? r = 1E-5 : .1 < r && (r = .1));q = 0;for (var ga = 8; ga--;) {
          p++;if (p >= g && (p %= g, 3 == F)) for (y = z.length; y--;) z[y] = 2 * Math.random() - 1;switch (F) {case 0:
              c = p / g < m ? .5 : -.5;break;case 1:
              c = 1 - p / g * 2;
              break;case 2:
              c = p / g;c = 6.28318531 * (.5 < c ? c - 1 : c);c = 1.27323954 * c + .405284735 * c * c * (0 > c ? 1 : -1);c = .225 * ((0 > c ? -1 : 1) * c * c - c) + c;break;case 3:
              c = z[Math.abs(32 * p / g | 0)];}P && (y = v, n *= W, 0 > n ? n = 0 : .1 < n && (n = .1), X ? (u += (c - v) * n, u *= a) : (v = c, u = 0), v += u, C += v - y, c = C *= 1 - r);R && (D[I % 1024] = c, c += D[(I - t + 1024) % 1024], I++);q += c;
        }q = .125 * q * x * Y;b[k] = 1 <= q ? 32767 : -1 >= q ? -32768 : 32767 * q | 0;
      }return O;
    };
  }
  var synth = new SfxrSynth();
  window.jsfxr = function (e) {
    synth._params.setSettings(e);var f = synth.totalReset();e = new Uint8Array(4 * ((f + 1) / 2 | 0) + 44);var f = 2 * synth.synthWave(new Uint16Array(e.buffer, 44), f),
        d = new Uint32Array(e.buffer, 0, 44);d[0] = 1179011410;d[1] = f + 36;d[2] = 1163280727;d[3] = 544501094;d[4] = 16;d[5] = 65537;d[6] = 44100;d[7] = 88200;d[8] = 1048578;d[9] = 1635017060;d[10] = f;for (var f = f + 44, d = 0, h = "data:audio/wav;base64,"; d < f; d += 3) var l = e[d] << 16 | e[d + 1] << 8 | e[d + 2], h = h + ("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[l >> 18] + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[l >> 12 & 63] + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[l >> 6 & 63] + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[l & 63]);return h;
  };
})();})()}
if (typeof window === 'undefined') {(function (){
var users = [];

function findOpponent(user) {
	for (let loggedUser of users) {
		// This actually does not work for g.Game.np === 1. But who wants to play alone?
		if (user !== loggedUser &&
		// loggedUser counts for the total number
		loggedUser.opponents.length < g.Game.np - 1 && !loggedUser.started) {
			for (let opponent of loggedUser.opponents) {
				user.opponents.push(opponent);
				opponent.opponents.push(user);
				opponent.removeCount();
			}
			loggedUser.opponents.push(user);
			user.opponents.push(loggedUser);
			if (loggedUser.opponents.length === g.Game.np - 1) {
				new Game([loggedUser].concat(loggedUser.opponents)).start();
			} else {
				user.startCount();
			}
			return;
		}
	}
}

function removeUser(user) {
	if (user.game) {
		user.game.removeUser(user);
	} else {
		for (let opponent of user.opponents) {
			opponent.removeOpponent(user);
		}
	}
	users.splice(users.indexOf(user), 1);
}

function Game(users) {
	this.users = users;
}

Game.prototype.start = function () {
	var game = g.Game.init(),
	    users = this.users;
	// TODO get type of player from users
	this.state = g.Game.prepareGame(game, this.users.length);
	this.alive = this.users.length;
	this.played = 0;
	this.movements = [];
	for (let i = 0; i < users.length; i++) {
		users[i].start(this, i);
	}
};

Game.prototype.acceptMove = function (actions, position) {
	this.played = this.played + 1;
	for (let action of actions) {
		this.movements.push(Object.assign({ position: position }, action));
	}
	console.log('src/server/server.js:66:13:this.alive', this.alive);
	if (this.played === this.alive) {
		this.played = 0;
		console.log('src/server/server.js:69:14:this.movements', this.movements);
		this.move();
	}
};

Game.prototype.move = function () {
	var movements = this.movements.sort((m1, m2) => m2.remainingTime - m1.remainingTime);
	console.log('src/server/server.js:76:13:\'Start moving\'', 'Start moving');
	var stateAndActions = g.Game.computeMovements(this.state, movements);
	this.state = stateAndActions.state;
	this.movements = [];
	for (let user of this.users) {
		if (user.alive && this.state.players[user.position].s === g.Player.statuses.dead) {
			this.alive = this.alive - 1;
			user.die();
		}
		console.log('src/server/server.js:85:14:\'sendActions\'', 'sendActions');
		user.sendActions(stateAndActions.actions);
	}
};
Game.prototype.removeUser = function (user) {
	console.log('src/server/server.js:90:13:user.alive', user.alive);
	// When reconnecting the same socket is used and this can lead to weird errors
	if (user.alive) {
		user.alive = false;
		this.alive = this.alive - 1;
		this.state.players[user.position].s = g.Player.statuses.dead;
		this.users.splice(this.users.indexOf(user), 1);
		var aliveUser;
		for (let otherUser of this.users) {
			otherUser.announceDeath(user.position);
			otherUser.removeOpponent(user);
			if (otherUser.alive) aliveUser = otherUser;
		}
		if (this.alive === 1) {
			for (let otherUser of this.users) {
				otherUser.announceWinner(aliveUser.position);
			}
		}
	}
};

function User(socket) {
	this.socket = socket;
	this.game = null;
	this.alive = true;
	this.opponents = [];
}

User.prototype.start = function (game, position) {
	this.game = game;
	this.started = true;
	this.position = position;
	console.log('src/server/server.js:125:13:\'Starting\'', 'Starting');
	this.socket.emit("start", JSON.stringify(Object.assign(game.state, { position: position })));
};

User.prototype.die = function () {
	this.alive = false;
	// TODO, maybe close connection
};
User.prototype.move = function (actions) {
	if (this.alive && this.game) this.game.acceptMove(actions, this.position);
};
User.prototype.announceDeath = function () {
	// Not interested for now
};

User.prototype.announceWinner = function (position) {
	console.log('src/server/server.js:141:13:\'We have a winner\'', 'We have a winner');
	this.socket.emit('winner', position);
};
// In case there are not a lot of users we take what we have
User.prototype.startCount = function () {
	var user = this;
	this.timeout = setTimeout(function () {
		console.log('src/server/server.js:148:14:\'start game without enough players\'', 'start game without enough players');
		new Game([user].concat(user.opponents)).start();
	}, 30000);
};
User.prototype.removeCount = function () {
	console.log('src/server/server.js:153:13:\'removeCount\',this.timeout', 'removeCount', this.timeout);
	clearTimeout(this.timeout);
};
User.prototype.sendActions = function (actions) {
	this.socket.emit('actions', actions);
};
User.prototype.removeOpponent = function (user) {
	this.opponents.splice(users.indexOf(user), 1);
};

/**
 * Socket.IO on connect event
 * @param {Socket} socket
 */
module.exports = function (socket) {
	var user = new User(socket);
	users.push(user);
	console.log('src/server/server.js:170:13:users.length', users.length);
	findOpponent(user);

	socket.on("disconnect", function () {
		console.log('src/server/server.js:174:14:"Disconnected: " + socket.id', "Disconnected: " + socket.id);
		removeUser(user);
	});
	socket.on("move", function (input) {
		console.log('src/server/server.js:178:14:\'user move\'', 'user move');
		// TODO check input
		user.move(input);
	});

	console.log('src/server/server.js:183:13:"Connected: " + socket.id', "Connected: " + socket.id);
};})()}})()
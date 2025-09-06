var taken = []
var dead = []
io.on('connection', function (socket) {
  var p;

  // on socket connect, start streaming game data to them
  socket.emit('highScores', highScores.slice(0, 10))
  socket.emit('setState', arena)

  // socket join game (gives name), adds them to arena
  socket.on('join', function (name) {
    name = name.substr(0, 17)
    //debug
    if (!/^[a-zA-Z]+$/.test(name) || taken.indexOf(name) != -1 || dead.indexOf(name) != -1) {
      socket.emit('taken', {
        dead: dead.indexOf(name) != -1,
        name: name
      })
      return
    }

    taken.push(name)

    p = new Player(name, socket.id)
    arena.players.push(p)
    diff[0].push(p)
    // socket.emit('name', name)
    socket.emit('name', name)
  })

  // on socket disconnect, kill them
  socket.on('disconnect', function () {
    if (p) p.h = 0
  })

  // on socket command (movement/attack), update game state
  socket.on('keydown', function (key) {
    if (!p) return

    if (key == 32 || key == 90) return p.a = 1
    if (key > 36 && key < 41) {

      // remove key if was in list before
      if (p.k.indexOf(key) != -1) p.k.splice(p.k.indexOf(key), 1)

      // set key to first position
      p.k.unshift(key)
    }
  })
  socket.on('keyup', function (key) {
    if (!p) return
    p.k.splice(p.k.indexOf(key), 1)
  })

  // chat
  socket.on('chat', function (msg) {
    io.emit('chat', (p && p.n || '☠') + ': ' + msg)
  })
});


//game
var random = (function rng() {
  var x = 123456789,
    y = 362436069,
    z = 521288629,
    w = 88675123,
    t;
  return function rand() {
    t = x ^ (x << 11)
    x = y;
    y = z;
    z = w;
    w = w ^ (w >> 19) ^ (t ^ (t >> 8));
    return (w * 2.3283064365386963e-10) * 2;
  }
})()

var map = (function generateMap() {
  var m = []
  for (var y = -600 / 2; y < 600 / 2; y += 14) {
    var temp = []
    for (var x = -800 / 2; x < 800 / 2; x += 14) {
      var rand = random()
      if (rand > 0.99) {
        temp.push(3)
      } else if (rand > 0.98) {
        // non-traversable stump
        temp.push(4)
      } else if (rand > 0.92) {
        temp.push(2)
      } else if (rand > 0.82) {
        temp.push(6)
      } else if (rand > 0.72) {
        temp.push(5)
      } else if (rand > 0.62) {
        temp.push(1)
      } else {
        temp.push(0)
      }
    }
    m.push(temp)
  }
  return m
})();

var items = (function generateMap() {
  var m = []
  random()
  random()
  random()
  for (var y = -600 / 2; y < 600 / 2; y += 14) {
    for (var x = -800 / 2; x < 800 / 2; x += 14) {
      var rand = random()
      if (rand > 0.9996) {
        m.push({
          n: 2,
          x: x,
          y: y
        })
      } else if (rand > 0.943 && rand < 0.945) {
        m.push({
          n: 1,
          x: x,
          y: y
        })
      } else if (rand > 0.930 && rand < 0.935) {
        m.push({
          n: 0,
          x: x,
          y: y
        })
      }
    }
  }
  return m
})();

var arena = {
  players: [],
  bullets: [],
  items: items
};
var highScores = [];

// stub 10 high scores
for (var i = 0; i < 10; i++) {
  highScores.push({
    name: '',
    score: ''
  })
}

function Player(name) {
  // name
  this.n = name
  this.x = Math.floor(Math.random() * 600) - 300
  this.y = Math.floor(Math.random() * 400) - 200

  // health
  this.h = 100

  // kills
  this.s = 0

  // weapons: fists, machete, bow, gun - [-1, 0, 1, 2]
  this.w = -1

  // directions:
  // left, up/left, up, up/right, right, right/down, down, down/left
  // 0,    1,       2,  3,        4,     5,          6,     7
  this.d = 6

  // animation frame
  this.f = 1

  // keys
  this.k = []

  // attacking - bool
  this.a = 0

  while (collide(this, arena.players) || collideMap(this.x, this.y)) {
    this.x = Math.floor(Math.random() * 600) - 300
    this.y = Math.floor(Math.random() * 400) - 200
  }
}

function Bullet(type, x, y, dir, n) {
  // types: arrow, bullet - [0, 1]
  this.t = type
  this.n = n
  this.x = x
  this.y = y
  this.d = dir
}

// This diff will be sent and applied by the client to sync their arena
// diff[0-2] = players
// diff[0] = new players (append to end)
// diff[1] = del players indicies (splice, starting in reverse order)
// diff[2] = player updates (i:index, updated attrs)
// diff[3-5] = bullets
// diff[6-8] = items
var diff = Array.apply([], new Array(9)).map(function () {
  return []
});

function clone(o) {
  return JSON.parse(JSON.stringify(o))
}

function physics(frame) {
  var players = arena.players
  var bullets = arena.bullets
  var items = arena.items
  var arenaClone = clone(arena)

  // dir: [delta x, delta y]
  var sqrt2 = Math.sqrt(2)
  var keymap = {
    0: [-2, 0], // left
    1: [-sqrt2, -sqrt2], // up/left
    2: [0, -2], // up
    3: [sqrt2, -sqrt2], // up/right
    4: [2, 0], // right
    5: [sqrt2, sqrt2], // down/right
    6: [0, 2], // down
    7: [-sqrt2, sqrt2] // down/left
  }

  // player movement
  for (var i = 0; i < players.length; i++) {
    var player = players[i]
    var key;
    var key1 = (player.k[0] || -1) - 37
    var key2 = (player.k[1] || -1) - 37
    if (!keymap[key2]) key = key1 * 2
    else {
      // adding works for up/left, up/right, down/right
      // does not work for opposite or down/left

      // opposite
      if ((key1 - key2) % 2 == 0) {
        key = -1
      } else if (key1 == 0 && key2 == 3 || key1 == 3 && key2 == 0) {
        // down/left
        key = 7
      } else {
        key = key1 + key2
      }
    }

    if (player.a) {
      if (frame % 3 == 0) {
        // maybe remove an attack frame
        if (player.f == 3) {
          player.f++;
          player.a = (player.a + 1) % 5
        } else if (player.f == 4) {
          // here is where we check for hit (if melee weapon)
          if (player.w < 1) {
            var weapon = {
              x: player.x + keymap[player.d][0] * 5,
              y: player.y + keymap[player.d][1] * 5
            }
            var hit = collide(weapon, players.slice(0, i).concat(players.slice(i + 1)))
            if (hit) {
              hit.h -= 10
              if (hit.h <= 0) {
                player.s++
              }
            }
          } else {
            var bullet = new Bullet(player.w - 1, player.x, player.y, player.d, player.n)
            arena.bullets.push(bullet)
            diff[3].push(bullet)
            arenaClone.bullets.push(bullet)
          }
          player.f++;
          player.a = (player.a + 1) % 5
        } else {
          player.f = 3
          player.a = (player.a + 1) % 5
        }
      }
    } else if (keymap[key]) {
      if (frame % 6 == 0) {
        player.f = (player.f + 1) % 4
      }
      player.x += keymap[key][0]
      player.y += keymap[key][1]
      var outsideMap = player.x < -400 || player.x > (400 - 16) || player.y < -300 || player.y > (300 - 18)
      var collidePlayer = collide(player, players.slice(0, i).concat(players.slice(i + 1)))
      var collideTerrain = collideMap(player.x, player.y)
      if (outsideMap || collidePlayer || collideTerrain) {
        player.x -= keymap[key][0]
        player.y -= keymap[key][1]
      }
      player.d = key;
    } else {
      player.f = 1
    }
  }

  // bullet movement/collision
  for (var i = bullets.length - 1; i >= 0; i--) {
    var bullet = bullets[i]
    bullet.x += keymap[bullet.d][0] * 2
    bullet.y += keymap[bullet.d][1] * 2
    var player = collide(bullet, players)
    if (player && bullet.n != player.n) {
      // arrow does 10 dmg, bullet does 20
      player.h -= bullet.t == 0 ? 10 : 20
      if (player.h <= 0) {
        var id = bullet.n
        for (var i = 0; i < players.length; i++) {
          if (players[i].n == id) {
            players[i].s++
            break
          }
        }
      }

      diff[4].push(i)
      bullets.splice(i, 1)
      arenaClone.bullets.splice(i, 1)
    } else if (bullet.x < -400 || bullet.x > 400 || bullet.y < -300 || bullet.y > 300) {
      diff[4].push(i)
      bullets.splice(i, 1)
      arenaClone.bullets.splice(i, 1)
    }
  }

  // player pickup items
  for (var i = items.length - 1; i >= 0; i--) {
    var item = items[i]
    var player = collide(item, players)

    // if colliding with item, pick it up
    if (player) {

      // item is better than current
      if (player.w < item.n) {
        var weapon = item.n

        // pick up the item
        if (player.w != -1) {

          // drop current weapon
          item.n = player.w
        } else {

          // remove the item
          items.splice(i, 1)
          diff[7].push(i)
          arenaClone.items.splice(i, 1)
        }

        player.w = weapon
      }
    }
  }

  // player deaths
  for (var i = players.length - 1; i >= 0; i--) {
    var player = players[i]
    if (player.h <= 0) {
      // drop weapon
      if (player.w != -1) {
        var item = {
          n: player.w,
          x: player.x,
          y: player.y
        }
        items.push(item)
        arenaClone.items.push(item)
        diff[6].push(item)
      }
      // anounce death
      io.emit('alert', player.n + ' has been killed')

      // update high scores
      // TODO - only send if top 10 change
      highScores.push({
        name: player.n,
        score: player.s * 1000
      })

      highScores.sort(function (a, b) {
        return -a.score + b.score
      })

      // send high score list
      io.emit('highScores', highScores.slice(0, 10))

      taken.splice(taken.indexOf(player.n), 1)
      dead.push(player.n)
      players.splice(i, 1)
      diff[1].push(i)
      arenaClone.players.splice(i, 1)
    }
  }


  // calculate update diffs
  // players
  var pDiffs = differ(players, arenaClone.players)
  // bullets
  var bDiffs = differ(bullets, arenaClone.bullets)
  // items
  var iDiffs = differ(items, arenaClone.items)

  diff[2] = pDiffs
  diff[5] = bDiffs
  diff[8] = iDiffs

  var t = diff
  diff = Array.apply([], new Array(9)).map(function () {
    return []
  })

  return t
}

function collideMap(x, y) {
  return map[Math.round((y + 2 + 300) / 14)][Math.round((x + 2 + 400) / 14)] == 4 ? true : false
}

function differ(current, clone) {
  var diffs = []
  for (var i = 0; i < current.length; i++) {
    var update = {
      i: i
    }
    var obj = current[i]
    var cloned = clone[i]
    for (var key in obj) {
      if (key == 'k') continue
      if (obj[key] != cloned[key]) update[key] = +obj[key].toFixed(2)
    }
    if (Object.keys(update).length > 1) diffs.push(update)
  }
  return diffs
}

var pHeight = 18
var pWidth = 12;

function collide(a, bs) {
  for (var i = 0; i < bs.length; i++) {
    var b = bs[i]
    if (!(a.y + pHeight < b.y || a.y > b.y + pHeight || a.x + pWidth < b.x || a.x > b.x + pWidth)) return b
  }
  return false
}

var frame = 0
setInterval(function () {
  // update game state
  var diff = physics(++frame)

  // don't send if empty
  if (!diff.reduce(function (total, x) {
    return total + x.length
  }, 0)) return

  var found = false
  var i = diff.length - 1
  while (diff[i] && diff[i].length == 0) {
    diff.splice(i, 1)
  }

  io.emit('message', diff)
}, 1000 / 30)
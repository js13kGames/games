const utils = {
  extend: function(obj, extension, filter) {
    var result = {}
      , self   = this

    Object.keys(obj).forEach(function(key) {
      result[key] = obj[key]
    })

    Object.keys(extension).forEach(function(key) {
      if (!filter || (filter.indexOf(key) !== -1)) {
        if ((extension[key] === Object(extension[key])) && !Array.isArray(extension[key])) {
          result[key] = self.extend(result[key], extension[key])
        } else {
          result[key] = extension[key]
        }
      }
    })

    return result
  },

  log: function(s) {
    console.log(new Date().toISOString() + ":", s)
  },

  generateIdentifier: function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    })
  },

  lzw_encode: function(s) {
    var dict = {};
    var data = (s + "").split("");
    var out = [];
    var currChar;
    var phrase = data[0];
    var code = 256;
    for (var i=1; i<data.length; i++) {
      currChar=data[i];
      if (dict[phrase + currChar] != null) {
        phrase += currChar;
      }
      else {
        out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
        dict[phrase + currChar] = code;
        code++;
        phrase=currChar;
      }
    }
    out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
    for (var i=0; i<out.length; i++) {
      out[i] = String.fromCharCode(out[i]);
    }
    return out.join("");
  },

  // Decompress an LZW-encoded string
  lzw_decode: function(s) {
    var dict = {};
    var data = (s + "").split("");
    var currChar = data[0];
    var oldPhrase = currChar;
    var out = [currChar];
    var code = 256;
    var phrase;
    for (var i=1; i<data.length; i++) {
      var currCode = data[i].charCodeAt(0);

      if (currCode < 256) {
        phrase = data[i];
      } else {
        phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
      }

      out.push(phrase);
      currChar = phrase.charAt(0);
      dict[code] = oldPhrase + currChar;
      code++;
      oldPhrase = phrase;
    }
    return out.join("");
  }
}

var Monster = function() {
  var weight = 30 + (Math.random() * 30)
  weight     = weight - (weight % 6)

  var hp = (Math.pow(weight,2) / Math.pow(60,2)) * 100

  this.id        = utils.generateIdentifier()
  this.className = 'Monster'

  this.options = {
    id:         this.id,
    x:          Math.random() * 1000,
    y:          220 + Math.random() * 600,
    difficulty: weight,
    damage:     ~~(weight / 30),
    height:     weight,
    width:      weight,
    color:      '#' + Monster.getRandomColor(),
    target:     null,
    walkSpeed:  (Math.pow(60,2) / Math.pow(weight,2)) * 10,
    hp:         hp,
    originalHp: hp,
    attackedOptions: {
      attacked:  false,
      diff:      0,
      direction: 'left'
    },
    renderOptions: {
      pixelSize: 6,
      feet: {
        offset: 0,
        direction: "up"
      },
      face: {
        toothX: null
      },
      damages: []
    }
  }

  var toothX = ~~(Math.random() * (this.options.width - 5 * this.options.renderOptions.pixelSize))
  this.options.renderOptions.face.toothX = toothX
}

Monster.COLORS = {
  '1abc9c': 'turquoise',
  'f39c12': 'orange',
  '2ecc71': 'green',
  'd35400': 'red',
  '3498db': 'blue',
  '9b59b6': 'purple',
  'bdc3c7': 'silver',
  '2c3e50': 'grey'
}

Monster.getRandomColor = function() {
  var codes = Object.keys(Monster.COLORS)
  return codes[~~(Math.random() * (codes.length - 1))]
}

Monster.prototype.iterate = function() {
  if (this.options.attackedOptions.attacked) {
    if (this.options.attackedOptions.diff < 31) {
      var distance = 5

      this.options.x = this.options.x + ((this.options.attackedOptions.direction === 'left' ? -1 : 1) * distance)
      this.options.attackedOptions.diff = this.options.attackedOptions.diff + distance
    } else {
      this.options.attackedOptions.attacked = false
      this.options.attackedOptions.diff = 0
      this.options.target = null
    }
  } else {
    this.animateFeet()
    this.walk()
  }

  this.options.renderOptions.damages = this.options.renderOptions.damages.filter(function(damage) {
    damage.step = damage.step + 0.2
    return damage.step < 10
  })

  return this
}

Monster.prototype.hit = function(strength, direction) {
  this.options.hp = Math.max.call(this, 0, this.options.hp - strength)
  this.options.attackedOptions.attacked = true
  this.options.attackedOptions.direction = direction

  this.options.renderOptions.damages.push({
    x: this.options.x + 20 + (Math.random() * this.options.width),
    y: this.options.y,
    damage: strength,
    step: 0
  })
}

Monster.prototype.alive = function() {
  return this.options.hp > 0
}

Monster.prototype.getTarget = function() {
  if (this.options.target) {
    return this.options.target
  } else {
    this.options.target = {
      x:      Math.random() * 1000,
      y:      220 + Math.random() * 600,
      startX: this.options.x,
      startY: this.options.y
    }

    this.options.target.distance = Math.sqrt(
      Math.pow(this.options.target.x - this.options.x, 2) +
      Math.pow(this.options.target.y - this.options.y, 2)
    )

    this.options.target.directionX = (this.options.target.x - this.options.x) / this.options.target.distance
    this.options.target.directionY = (this.options.target.y - this.options.y) / this.options.target.distance

    return this.options.target
  }
}

Monster.prototype.walk = function() {
  var target  = this.getTarget()
    , elapsed = 0.01

  this.options.x += this.options.target.directionX * this.options.walkSpeed * elapsed
  this.options.y += this.options.target.directionY * this.options.walkSpeed * elapsed

  if (Math.sqrt(Math.pow(this.options.x - this.options.target.startX, 2) + Math.pow(this.options.y - this.options.target.startY, 2)) >= this.options.target.distance) {
    this.options.x      = this.options.target.x
    this.options.y      = this.options.target.y
    this.options.target = null
  }
}

Monster.prototype.animateFeet = function() {
  var px = this.options.renderOptions.pixelSize

  if (this.options.renderOptions.feet.direction === 'up') {
    this.options.renderOptions.feet.offset = this.options.renderOptions.feet.offset + 0.15
  } else {
    this.options.renderOptions.feet.offset = this.options.renderOptions.feet.offset - 0.15
  }

  if (this.options.renderOptions.feet.offset >= 2 * px) {
    this.options.renderOptions.feet.direction = 'down'
  } else if (this.options.renderOptions.feet.offset <= 0) {
    this.options.renderOptions.feet.direction = 'up'
  }

  return this
}

Monster.prototype.inAttackRange = function(player) {
  var playerTop     = player.options.y
    , playerBottom  = playerTop + player.options.renderOptions.height
    , playerLeft    = player.options.x
    , playerRight   = playerLeft + player.options.renderOptions.width
    , monsterTop    = this.options.y
    , monsterBottom = monsterTop + this.options.height
    , monsterLeft   = this.options.x
    , monsterRight  = monsterLeft + this.options.width

  return (
    (playerRight > monsterLeft) &&
    (playerLeft < monsterRight) &&
    (playerBottom > monsterTop) &&
    (playerTop < monsterBottom)
  )
}

var Player = function(id) {
  this.id        = id
  this.className = 'Player'
  this.updatedAt = +new Date()
  this.options   = this.getDefaults()
}

Player.prototype.getDefaults = function() {
  return {
    x:             40,
    y:             280,
    movementDelay: 50,
    stepSize:      5,
    online:        true,
    offlineSince:  null,
    strength:      2,
    attacking:     false,
    originalHp:    20,
    hp:            20,
    experience: {
      level: 1,
      current: 0,
      total: 0,
      neededForLevelUp: 400
    },
    achievements: {
      current: generateAchievement(),
      done: []
    },
    renderOptions: {
      colors: {
        outline: "#2c3e50",
        face:    "#FFFFFF",
        opacity: 1
      },
      width: 21,
      height: 14,
      pixelSize: 3,
      feet: {
        direction: 'down',
        offset: 0,
        delta: 0.25
      },
      weapon: {
        side: 'right',
        direction: 'up',
        angle: 0
      },
      experience: [],
      levelUp: {
        levelUp: false,
        step:    0
      },
      damages: [],
      death: {
        dead:     false,
        step:     0,
        callback: null
      }
    }
  }
}

Player.prototype.resurrect = function() {
  this.options = this.getDefaults()
}

Player.prototype.update = function(data) {
  var self = this

  Object.keys(data).forEach(function(key) {
    self.options[key] = data[key]
  })

  return this
}

Player.prototype.killedMonster = function(monster) {
  return {
    experience: increaseExperience.call(this, monster.options.difficulty * 20),
    levelUp: checkForLevelUp.call(this),
    achievement: checkForAchiements.call(this, monster)
  }
}

Player.prototype.checkForAttacks = function(monsters) {
  var self         = this
    , hasBeenHitBy = null

  monsters.forEach(function(monster) {
    if (!hasBeenHitBy && monster.inAttackRange(self)) {
      hasBeenHitBy = monster
      self.hit(monster)
    }
  })

  return hasBeenHitBy
}

Player.prototype.hit = function(monster) {
  var xDiff = (this.options.x + (this.options.renderOptions.width / 2)) - (monster.options.x + (monster.options.width / 2))
    , yDiff = (this.options.y + (this.options.renderOptions.height / 2)) - (monster.options.y + (monster.options.height / 2))

  this.options.x = this.options.x + xDiff * 2
  this.options.y = this.options.y + yDiff * 2
  this.options.hp = this.options.hp - monster.options.damage
  this.options.renderOptions.hit
}

/////////////
// private //
/////////////

var increaseExperience = function(experience) {
  this.options.experience.current = this.options.experience.current + experience
  this.options.experience.total   = this.options.experience.total + experience

  return experience
}

var checkForLevelUp = function() {
  if (this.options.experience.current >= this.options.experience.neededForLevelUp) {
    this.options.experience.current = this.options.experience.current - this.options.experience.neededForLevelUp
    this.options.experience.neededForLevelUp = this.options.experience.neededForLevelUp * 2

    // increase strength
    this.options.strength = this.options.strength + 2

    // increase speed
    this.options.stepSize = Math.min(this.options.stepSize + 1, 10)

    // increase health points
    this.options.originalHp = this.options.originalHp + 2
    this.options.hp = this.options.originalHp

    // increate the level
    this.options.experience.level++

    return this.options.renderOptions.levelUp.levelUp = true
  } else {
    return false
  }
}

var checkForAchiements = function(monster) {
  if (monster.options.color === '#' + this.options.achievements.current.color) {
    this.options.achievements.current.achieved++
  }

  if (this.options.achievements.current.achieved === this.options.achievements.current.needed) {
    var result = {
      done: true,
      experience: this.options.achievements.current.experience
    }

    increaseExperience.call(this, result.experience)

    this.options.achievements.done.push(this.options.achievements.current)
    this.options.achievements.current = generateAchievement()

    return result
  } else {
    return {
      done: false
    }
  }
}

var generateAchievement = function() {
  var needed = 1 + ~~(Math.random() * 10)
    , color  = Monster.getRandomColor()

  return {
    color:      color,
    colorName:  Monster.COLORS[color],
    achieved:   0,
    needed:     needed,
    experience: needed * 15 * (31 + ~~(Math.random() * 20))
  }
}

var World = function() {
  var self = this

  this.players = {}
  this.monsters = {}

  setInterval(function() {
    if (self.getMonsters({ alive: true }).length < 10) {
      self.spawnMonsters()
    }
  }, 1000)
}

World.prototype.getPlayer = function(id, options) {
  var result = this.players[id]

  if (!result && (options || {}).create) {
    result = this.createPlayer(id)
  }

  return result
}

World.prototype.removePlayer = function(id) {
  delete this.players[id]
}

World.prototype.setPlayer = function(id, data) {
  this.players[id] = data
}

World.prototype.createPlayer = function(id) {
  var player = new Player(id)
  this.setPlayer(id, player)
  return player
}

World.prototype.updatePlayer = function(id, data) {
  var player = this.getPlayer(id)

  Object.keys(data).forEach(function(key) {
    player[key] = data[key]
  })

  this.setPlayer(id, player)
}

World.prototype.getMonster = function(id) {
  return this.monsters[id]
}

World.prototype.getMonsters = function(options) {
  var self = this

  options = options || {}

  return Object.keys(this.monsters).map(function(id) {
    return self.monsters[id]
  }).filter(function(monster) {
    return (options.alive) ? monster.alive() : !!monster
  })
}

World.prototype.iterate = function() {
  this.getMonsters({ alive: true }).forEach(function(monster) {
    monster.iterate()
  })
}

World.prototype.findAttackableMonsters = function(player) {
  var maxRange = 30

  if (player.options.renderOptions.weapon.side === 'left') {
    // the player walks to the left
    return this.getMonsters().filter(function(monster) {
      var rightX = monster.options.x + monster.options.width + monster.options.renderOptions.pixelSize * 2

      return (
        // left side of the player is on the right of monster
        ((player.options.x - maxRange) < rightX) &&

        // right side of the player is on the right of the monster
        (rightX < (player.options.x + player.options.renderOptions.width)) &&

        // player is on the same height as the monster
        (monster.options.y < player.options.y) &&
        (monster.options.y + monster.options.height > player.options.y)
      )
    })
  } else {
    // the player walks to the right
    return this.getMonsters().filter(function(monster) {
      var rightX = player.options.x + player.options.renderOptions.width + player.options.renderOptions.pixelSize * 3

      return (
        // left side of the monster is on the right of player
        ((monster.options.x - maxRange) < (player.options.x + maxRange)) &&

        // right side of the monster is on the right of the player
        (rightX < (monster.options.x + monster.options.width)) &&

        // player is on the same height as the monster
        (monster.options.y < player.options.y) &&
        (monster.options.y + monster.options.height > player.options.y)
      )
    })
  }
}

World.prototype.spawnMonsters = function() {
  var monster = new Monster()
  this.monsters[monster.id] = monster
}

World.prototype.getOtherPlayers = function(id) {
  var self = this

  return Object.keys(this.players).map(function(playerId) {
    var player = self.getPlayer(playerId)

    if ((player.id != id) && player.options.online) {
      return player
    }
  }).filter(function(player) {
    return !!player
  })
}

World.prototype.getSyncData = function(playerIdOfSocket) {
  return {
    Player:  this.getOtherPlayers(playerIdOfSocket),
    Monster: this.getMonsters({ alive: true })
  }
}

var WebSocket = function() {
  this.io      = io
  this.sockets = {}
  this.world   = new World()
  this.listen()
}

WebSocket.prototype.listen = function() {
  var self = this

  this.io.on('connection', function (socket) {
    var uuid = Utils.generateIdentifier()

    Utils.log("Generated uuid " + uuid)
    socket.emit('uuid', Utils.lzw_encode(uuid))
    self.observeEvents(uuid, socket)
  })
  this.io.set('log level', 1)

  setInterval(function() {
    self.checkForDisconnectedClients()
    self.world.iterate()
    self.syncWorld()
  }, 10)
}

WebSocket.prototype.observeEvents = function(uuid, socket) {
  var self = this

  socket.playerId    = uuid
  this.sockets[uuid] = socket

  this.events = {
    'player#update': function(data) {
      data = JSON.parse(Utils.lzw_decode(data))
      var player = this.world.getPlayer(data.id)

      if (!!player) {
        delete data.options.renderOptions.experience
        delete data.options.renderOptions.damages
        delete data.options.renderOptions.levelUp
        delete data.options.online

        player.updatedAt = +new Date()
        player.options = Utils.extend(player.options, data.options, ['x', 'y', 'attacking', 'renderOptions'])
      }
    },

    'player#join': function(playerId) {
      playerId = Utils.lzw_decode(playerId)

      var player = self.world.getPlayer(playerId, { create: true })

      player.options = Utils.extend(player.options, {
        online:       true,
        offlineSince: null
      })

      Utils.log('Player joined '+ uuid)
      this.sockets[playerId].emit('player#joined', Utils.lzw_encode(JSON.stringify(player)))
    },

    'player#resurrect': function(playerId) {
      playerId = Utils.lzw_decode(playerId)

      var player = this.world.getPlayer(playerId)

      if (!!player) {
        player.resurrect()

        socket.emit('player#update', Utils.lzw_encode(JSON.stringify(player)))
        socket.emit('player#reset', Utils.lzw_encode(playerId))
      }
    },

    'player#attack': function(playerId) {
      playerId = Utils.lzw_decode(playerId)

      var player = this.world.getPlayer(playerId)

      if (player) {
        this.world.findAttackableMonsters(player).forEach(function(monster) {
          if (monster.alive()) {
            monster.hit(player.options.strength, player.options.renderOptions.weapon.side)

            if (!monster.alive()) {
              var stats = player.killedMonster(monster)

              self.broadcast('monster#killed', Utils.lzw_encode(JSON.stringify(monster)))
              self.broadcast(
                'player#experience',
                Utils.lzw_encode(JSON.stringify(player)),
                Utils.lzw_encode(stats.experience)
              )

              if (stats.achievement.done) {
                self.broadcast(
                  'player#experience',
                  Utils.lzw_encode(JSON.stringify(player)),
                  Utils.lzw_encode(stats.achievement.experience)
                )
              }

              if (stats.levelUp) {
                self.broadcast('player#levelUp', Utils.lzw_encode(JSON.stringify(player)))
              }

              socket.emit('player#update', Utils.lzw_encode(JSON.stringify(player)))
            }
          }
        })
      }
    }
  }

  Object.keys(this.events).forEach(function(eventName) {
    self.sockets[uuid].on(eventName, function() {
      // console.log('Received event', eventName, 'with the following arguments', arguments)
      self.events[eventName].apply(self, arguments)
    })
  })
}

WebSocket.prototype.broadcast = function() {
  var args = [].slice.call(arguments)
    , self = this

  Object.keys(this.sockets).forEach(function(playerIdOfSocket) {
    var socket = self.sockets[playerIdOfSocket]
    socket.emit.apply(socket, args)
  })
}


WebSocket.prototype.checkForDisconnectedClients = function() {
  var self = this

  Object.keys(this.world.players).forEach(function(playerId) {
    var player = self.world.getPlayer(playerId)

    if (player.options.online && (Math.abs(+new Date() - player.updatedAt) > 10000)) {
      Utils.log('Player ' + playerId + ' just quit the game.')

      player.options.online = false
      self.broadcast('player#quit', Utils.lzw_encode(player.id))
      self.world.removePlayer(playerId)
    }
  })
}

WebSocket.prototype.syncWorld = function() {
  var self = this

  Object.keys(this.sockets).forEach(function(playerIdOfSocket) {
    var player = self.world.getPlayer(playerIdOfSocket)
      , socket = self.sockets[playerIdOfSocket]
      , data   = self.world.getSyncData(playerIdOfSocket)

    if (player && player.options.hp > 0) {
      var hitBy  = player.checkForAttacks(data.Monster)

      if (!!hitBy) {
        // the player has been hit and needs an update
        socket.emit('player#update', Utils.lzw_encode(JSON.stringify(player)))

        if (player.options.hp <= 0) {
          socket.emit('player#died', Utils.lzw_encode(player.id))
        } else {
          socket.emit('player#hit', Utils.lzw_encode(player.id), Utils.lzw_encode(hitBy.options.damage))
        }
      }
    }

    // console.log('Emitting world#sync with the following arguments', players)

    Object.keys(data).forEach(function(klass) {
      socket.emit('world#sync', Utils.lzw_encode(klass), Utils.lzw_encode(JSON.stringify(data[klass])))
    })
  })
}

new WebSocket
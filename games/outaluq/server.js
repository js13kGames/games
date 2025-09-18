var players = {};
var mapItems = new Array();
var itemSpawnInterval = 2;
var itemConstructors = [
  {
    name: 'Pulse',
    area: true,
    threshold: 'mid',
    use: {
      success: {
        temp: ''
      },
      failure: {
        temp: '' //do nothing
      }
    }
  },
  {
    name: 'Speed',
    threshold: 'low',
    use: {
      success: {
        moveSteps: 10
      },
      failure: {
        moveSteps: 1
      }
    },
    duration: 3
  }
];

var Inventory = function () {
  function cls() {
    var self = this;

    self.items = [];
    self.inventorySize = 9;

    this.addItem = function (item) {
      if (self.isNotFull()) {
        self.items.push(item);
      }
    }

    this.useItem = function (slot) {
      if (typeof self.items[slot] != 'undefined') {
        var item = self.items.splice(slot, 1);
        return {
          riskLevel: item[0].riskLevel,
          effect: item[0].useItem(),
          duration: item[0].duration
        };
      }
      return false;
    }

    this.isNotFull = function () {
      return (self.items.length < self.inventorySize);
    }

    this.get = function () {
      var toReturn = new Array();
      self.items.forEach(function (item) {
        toReturn.push(item.get());
      });
      return toReturn;
    }
  }
  return cls;
} ();

var Item = function () {

  function cls(params) {
    var self = this;

    this.use = params.use;
    this.lowestLuck = 0;
    this.range = params.range ? params.range : false;
    this.area = params.area ? params.area : false;
    this.duration = params.duration || 0;
    this.name = params.name;
    this.x = 0;
    this.y = 0;
    this.width = params.width || 20;
    this.height = params.height || 20;
    this.riskLevel = 0;
    this.colour = '';

    switch (params.threshold) {
      case 'low':
        self.highestLuck = 30; //Highest luck value needed to use an item
        self.colour = '#2B2';
        break;
      case 'mid':
        self.highestLuck = 60;
        self.colour = '#BB2';
        break;
      case 'high':
      default:
        self.highestLuck = 90;
        self.colour = '#B22';
        break;
    }

    this.init = function () {
      return this.generateRisk().generateLocation();
    }

    this.useItem = function () {
      return self.use;
    };

    this.generateRisk = function () {
      self.riskLevel = random(self.lowestLuck, self.highestLuck);
      return this;
    };

    this.generateLocation = function () {
      var x, y;
      do {
        x = random(0, Map.rows);
        y = random(0, Map.cols);
      } while (Map.check(x, y) || checkMapItems(x * Map.cellSize, y * Map.cellSize));

      self.x = x * Map.cellSize + (random(0, Map.cellSize - self.width));
      self.y = y * Map.cellSize + (random(0, Map.cellSize - self.width)); //Increment to scaled map size, and randomise the position within the cell
      return this;
    }

    this.checkCoordinates = function (x, y) {
      var toleranceX = self.width * 0.25;
      var toleranceY = self.height * 0.25;
      return (
        (x > self.x - toleranceX && x < self.x + self.width + toleranceX) &&
        (y > self.y - toleranceY && y < self.y + self.height + toleranceY)
      );
    }

    this.get = function () {
      return {
        area: self.area,
        range: self.range,
        name: self.name,
        colour: self.colour
      }
    }
  }

  function checkMapItems(x, y) {
    mapItems.forEach(function (item) {
      if (item.x == x && item.y == y) {
        return true;
      }
    });
    return false;
  }

  return cls;
} ();

var Map = function () {
  var map = new Array(),
    subMap = new Array(),
    wallChance = 10;

  function cls() {
    var self = this;

    this.colour = "rgb(255, 255, 255)";
    this.width = 5000;
    this.height = 5000;
    this.cellSize = 50;

    this.rows = this.width / this.cellSize;
    this.cols = this.height / this.cellSize;

    /**
     * Generate the map
     */
    this.generate = function () {
      map = new Array();
      self.unoccupied = 0;
      for (var i = 0; i < self.cols; i++) {
        subMap = new Array();
        for (var j = 0; j < self.rows; j++) {
          if (i == 0 || i == self.cols - 1 || j == 0 || j == self.rows - 1) {
            //if it's a border, draw a wall
            subMap[j] = 1;
          } else if (Math.random() > ((100 - wallChance) / 100)) {
            //otherwise, draw at random
            subMap[j] = 1;
          } else {
            //or don't
            subMap[j] = 0;
            self.unoccupied++;
          }
        }
        map[i] = subMap;
      }
    };

    this.check = function (x, y) {
      return !!map[y][x]; //Reversed as Y is rows, X is cols
    }

    this.getMap = function () {
      return {
        map: map,
        colour: self.colour,
        width: self.cellSize
      };
    }
  }
  return cls;
} ();

var Player = function () {
  function cls(username, socket) {
    var self = this,
      luckTimer;

    this.coords = {
      x: 1000,
      y: 1000,
      vpx: -750,
      vpy: -750
    };
    this.username = htmlEntities(username);
    this.direction = 0;
    this.luck = 100;
    this.colour = get_random_color();
    this.socketId = socket.id;
    this.inventory = new Inventory();

    this.initialise = function () {
      // Start to drain luck
      self.drainLuck();
      self.updatePlayer('initialise', players);
      self.updatePlayer('map', Map.getMap());
      self.updateOtherPlayers('playerJoined', self);
    };

    this.drainLuck = function () {
      luckTimer = setInterval(function () {
        self.luck--;
        if (self.luck <= 0) {
          self.updatePlayer('dead', true);
          self.updateOtherPlayers('dead', true);
          clearInterval(luckTimer);
        } else {
          self.updatePlayer('luckUpdate', self.luck);
          self.updateOtherPlayers('luckUpdate', self.luck);
        }
      }, 5000);
    };

    this.updatePlayer = function (type, data) {
      socket.emit('updatePlayer', {
        socketId: self.socketId,
        type: type,
        data: data
      });
    };

    this.updateOtherPlayers = function (type, data) {
      socket.broadcast.emit('updateOtherPlayers', {
        socketId: self.socketId,
        type: type,
        data: data
      });
    };

    this.deletePlayer = function () {
      // Stop luck drain
      clearInterval(luckTimer);
      // Delete from list of players;
      delete players[self.socketId];
    };

    this.checkForItems = function () {
      if (self.inventory.isNotFull()) {
        mapItems.forEach(function (item) {
          if (item.checkCoordinates(self.coords.x, self.coords.y)) {
            self.inventory.addItem(item);
            mapItems.splice(mapItems.indexOf(item), 1);
            self.updatePlayer('updateInventory', self.inventory.get());
            broadcastItems();
          }
        });
      }
    };

    socket.on('disconnect', function () {
      self.updateOtherPlayers('disconnected', true);
      self.deletePlayer();
    });

    socket.on('playerMoved', function (data) {
      self.coords.x = data.coords.x;
      self.coords.y = data.coords.y;
      self.coords.vpx = data.coords.vpx;
      self.coords.vpy = data.coords.vpy;
      self.direction = data.direction;

      self.updateOtherPlayers('moved', {
        coords: self.coords, direction: self.direction
      });

      self.checkForItems();
    });

    var shouldHit = [];
    socket.on('worldEvent', function (data) {
      switch (data.type) {
        case 'hit':
          var colour = data.data.colour.toString();
          if (shouldHit.indexOf(colour) === -1) {
            shouldHit.push(colour);
            self.luck -= 5;
            self.updatePlayer('luckUpdate', self.luck);
            self.updateOtherPlayers('luckUpdate', self.luck);
            if (self.luck <= 0) {
              self.updatePlayer('dead', true);
              self.updateOtherPlayers('dead', true);
              clearInterval(luckTimer);
            }

            setTimeout(function () {
              shouldHit.splice(shouldHit.indexOf(colour), 1);
            }, 500);
          }

          break;

        case 'pulse':
          socket.broadcast.emit('worldEvents', { type: data.type, data: data.data });
          break;
      }
    });

    socket.on('useItem', function (data) {
      var item = self.inventory.useItem(data.slot);

      if (item !== false) {
        self.updatePlayer('itemUsed', {
          effect: (item.riskLevel <= self.luck ? item.effect.success : item.effect.failure),
          duration: item.duration
        });
      }
    });
  }

  function get_random_color() {
    var colors = [];
    for (var i = 0; i < 3; i++) {
      colors.push(Math.round(Math.random() * 255));
    }
    return colors.join(',');
  }

  function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  return cls
} ()

function generate_random_item() {
  return new Item(itemConstructors[random(0, itemConstructors.length)]).init();
}

function spawn_map_items(interval) {
  setTimeout(function () {
    //generate an item and broadcast it
    if (mapItems.length <= 30) {
      mapItems.push(generate_random_item());
      broadcastItems();
    }
    //loop
    spawn_map_items(itemSpawnInterval);
  }, 1 / (io.sockets.size || 1) * (interval * 1000)); //Every {interval} seconds per connected player
}

function broadcastItems() {
  io.sockets.emit('updateItems', mapItems);
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

io.on('connection', function (socket) {
  socket.on('playerConnect', function (data) {
    var player;
    if (data.socketId && typeof players[data.socketId] !== 'undefined') {
      player = players[data.socketId];
    } else {
      player = new Player(data.username, socket);
      players[socket.id] = player;
    }

    player.initialise()
    broadcastItems()
  });
});

spawn_map_items(itemSpawnInterval)
var Map = new Map()
Map.generate()
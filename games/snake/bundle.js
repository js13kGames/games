(function(){var require = function (file, cwd) {
    var resolved = require.resolve(file, cwd || '/');
    var mod = require.modules[resolved];
    if (!mod) throw new Error(
        'Failed to resolve module ' + file + ', tried ' + resolved
    );
    var cached = require.cache[resolved];
    var res = cached? cached.exports : mod();
    return res;
};

require.paths = [];
require.modules = {};
require.cache = {};
require.extensions = [".js",".coffee",".json"];

require._core = {
    'assert': true,
    'events': true,
    'fs': true,
    'path': true,
    'vm': true
};

require.resolve = (function () {
    return function (x, cwd) {
        if (!cwd) cwd = '/';
        
        if (require._core[x]) return x;
        var path = require.modules.path();
        cwd = path.resolve('/', cwd);
        var y = cwd || '/';
        
        if (x.match(/^(?:\.\.?\/|\/)/)) {
            var m = loadAsFileSync(path.resolve(y, x))
                || loadAsDirectorySync(path.resolve(y, x));
            if (m) return m;
        }
        
        var n = loadNodeModulesSync(x, y);
        if (n) return n;
        
        throw new Error("Cannot find module '" + x + "'");
        
        function loadAsFileSync (x) {
            x = path.normalize(x);
            if (require.modules[x]) {
                return x;
            }
            
            for (var i = 0; i < require.extensions.length; i++) {
                var ext = require.extensions[i];
                if (require.modules[x + ext]) return x + ext;
            }
        }
        
        function loadAsDirectorySync (x) {
            x = x.replace(/\/+$/, '');
            var pkgfile = path.normalize(x + '/package.json');
            if (require.modules[pkgfile]) {
                var pkg = require.modules[pkgfile]();
                var b = pkg.browserify;
                if (typeof b === 'object' && b.main) {
                    var m = loadAsFileSync(path.resolve(x, b.main));
                    if (m) return m;
                }
                else if (typeof b === 'string') {
                    var m = loadAsFileSync(path.resolve(x, b));
                    if (m) return m;
                }
                else if (pkg.main) {
                    var m = loadAsFileSync(path.resolve(x, pkg.main));
                    if (m) return m;
                }
            }
            
            return loadAsFileSync(x + '/index');
        }
        
        function loadNodeModulesSync (x, start) {
            var dirs = nodeModulesPathsSync(start);
            for (var i = 0; i < dirs.length; i++) {
                var dir = dirs[i];
                var m = loadAsFileSync(dir + '/' + x);
                if (m) return m;
                var n = loadAsDirectorySync(dir + '/' + x);
                if (n) return n;
            }
            
            var m = loadAsFileSync(x);
            if (m) return m;
        }
        
        function nodeModulesPathsSync (start) {
            var parts;
            if (start === '/') parts = [ '' ];
            else parts = path.normalize(start).split('/');
            
            var dirs = [];
            for (var i = parts.length - 1; i >= 0; i--) {
                if (parts[i] === 'node_modules') continue;
                var dir = parts.slice(0, i + 1).join('/') + '/node_modules';
                dirs.push(dir);
            }
            
            return dirs;
        }
    };
})();

require.alias = function (from, to) {
    var path = require.modules.path();
    var res = null;
    try {
        res = require.resolve(from + '/package.json', '/');
    }
    catch (err) {
        res = require.resolve(from, '/');
    }
    var basedir = path.dirname(res);
    
    var keys = (Object.keys || function (obj) {
        var res = [];
        for (var key in obj) res.push(key);
        return res;
    })(require.modules);
    
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (key.slice(0, basedir.length + 1) === basedir + '/') {
            var f = key.slice(basedir.length);
            require.modules[to + f] = require.modules[basedir + f];
        }
        else if (key === basedir) {
            require.modules[to] = require.modules[basedir];
        }
    }
};

(function () {
    var process = {};
    
    require.define = function (filename, fn) {
        if (require.modules.__browserify_process) {
            process = require.modules.__browserify_process();
        }
        
        var dirname = require._core[filename]
            ? ''
            : require.modules.path().dirname(filename)
        ;
        
        var require_ = function (file) {
            var requiredModule = require(file, dirname);
            var cached = require.cache[require.resolve(file, dirname)];

            if (cached && cached.parent === null) {
                cached.parent = module_;
            }

            return requiredModule;
        };
        require_.resolve = function (name) {
            return require.resolve(name, dirname);
        };
        require_.modules = require.modules;
        require_.define = require.define;
        require_.cache = require.cache;
        var module_ = {
            id : filename,
            filename: filename,
            exports : {},
            loaded : false,
            parent: null
        };
        
        require.modules[filename] = function () {
            require.cache[filename] = module_;
            fn.call(
                module_.exports,
                require_,
                module_,
                module_.exports,
                dirname,
                filename,
                process
            );
            module_.loaded = true;
            return module_.exports;
        };
    };
})();


require.define("path",function(require,module,exports,__dirname,__filename,process){function filter (xs, fn) {
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (fn(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length; i >= 0; i--) {
    var last = parts[i];
    if (last == '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Regex to split a filename into [*, dir, basename, ext]
// posix version
var splitPathRe = /^(.+\/(?!$)|\/)?((?:.+?)?(\.[^.]*)?)$/;

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
var resolvedPath = '',
    resolvedAbsolute = false;

for (var i = arguments.length; i >= -1 && !resolvedAbsolute; i--) {
  var path = (i >= 0)
      ? arguments[i]
      : process.cwd();

  // Skip empty and invalid entries
  if (typeof path !== 'string' || !path) {
    continue;
  }

  resolvedPath = path + '/' + resolvedPath;
  resolvedAbsolute = path.charAt(0) === '/';
}

// At this point the path should be resolved to a full absolute path, but
// handle relative paths to be safe (might happen when process.cwd() fails)

// Normalize the path
resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
var isAbsolute = path.charAt(0) === '/',
    trailingSlash = path.slice(-1) === '/';

// Normalize the path
path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }
  
  return (isAbsolute ? '/' : '') + path;
};


// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    return p && typeof p === 'string';
  }).join('/'));
};


exports.dirname = function(path) {
  var dir = splitPathRe.exec(path)[1] || '';
  var isWindows = false;
  if (!dir) {
    // No dirname
    return '.';
  } else if (dir.length === 1 ||
      (isWindows && dir.length <= 3 && dir.charAt(1) === ':')) {
    // It is just a slash or a drive letter with a slash
    return dir;
  } else {
    // It is a full dirname, strip trailing slash
    return dir.substring(0, dir.length - 1);
  }
};


exports.basename = function(path, ext) {
  var f = splitPathRe.exec(path)[2] || '';
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPathRe.exec(path)[3] || '';
};

});

require.define("__browserify_process",function(require,module,exports,__dirname,__filename,process){var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
        && window.setImmediate;
    var canPost = typeof window !== 'undefined'
        && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return window.setImmediate;
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            if (ev.source === window && ev.data === 'browserify-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('browserify-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    if (name === 'evals') return (require)('vm')
    else throw new Error('No such module. (Possibly not yet loaded)')
};

(function () {
    var cwd = '/';
    var path;
    process.cwd = function () { return cwd };
    process.chdir = function (dir) {
        if (!path) path = require('path');
        cwd = path.resolve(dir, cwd);
    };
})();

});

require.define("/Game.js",function(require,module,exports,__dirname,__filename,process){"use strict";

var Snake = require( './Snake.js' ),
    Food = require( './Food.js' ),
    that;

function Game( ctx ) {
    this.score = 0;
    this.ctx = ctx;
    this.thickness = 5;
}

Game.prototype = {
    constructor: Game,

    start: function() {
        that = this;

        // Create an event object
        var EventEmitter = require( 'events' ).EventEmitter;
        this.evt = new EventEmitter;

        // Have a mapping object and pass the correct string
        // to the snake
        this.keyCodes = {
            '37': 'left',
            '38': 'top',
            '39': 'right',
            '40': 'bottom'
        };

        // Spawn a new food
        this.food = new Food( this.ctx, this );

        // Spawn a new snake
        this.snake = new Snake( this.ctx, this );

        // Listen for when a snake eats a food
        this.evt.on( 'I ate some food', function() {
            // Increase the score
            that.score++;

            // Clear the current food
            that.food.clear();

            // And spawn a new one
            that.food = new Food( that.ctx, that );
        });

        // Add the event listener on the arrow keys
        this.keyEvt = window.addEventListener( 'keydown', this.handleKeys );
    },

    stop: function( reqID ) {
        var cvs = this.ctx.canvas;
        window.cancelAnimationFrame( reqID );
        window.removeEventListener( this.keyEvt );
        this.ctx.clearRect( 0, 0, cvs.width, cvs.height );
        alert( 'Game over! You got ' + this.score + ' points!' );
        this.restart();
    },

    restart: function() {
        var button = document.createElement( 'button' );
        button.textContent = 'Restart the game';
        button.addEventListener( 'click', function() {
            this.parentNode.removeChild( this );
            that.start();
        }, false );
        document.body.appendChild( button );
    },

    handleKeys: function( e ) {
        if ( that.keyCodes[ e.keyCode ] ) {
            that.snake.move( that.keyCodes[ e.keyCode ] );
        }
    }
};


module.exports = Game;


});

require.define("/Snake.js",function(require,module,exports,__dirname,__filename,process){"use strict";

function Snake( ctx, game ) {
    this.ctx = ctx;
    this.length = 30;
    this.speed = 1;
    this.direction = 'right';
    this.game = game;
    this.pos = this.build();
    this.drawFirst();
    this.draw();
}

Snake.prototype = {
    constructor: Snake,

    build: function() {
        var pos = [];
        for ( var i = 0; i < this.length; i++ ) {
            pos.push( {
                x: ( this.ctx.canvas.width / 2 ) + i,
                y: ( this.ctx.canvas.height / 2 ),
                dir: this.direction
            });
        }
        return pos;
    },

    drawFirst: function() {
        var pos = this.pos,
            ctx = this.ctx,
            thickness = this.game.thickness;

        pos.forEach( function( p ) {
            ctx.fillRect( p.x, p.y, thickness, thickness );
        }, this );
    },

    move: function( direction ) {
        // Check for errors
        if (
            ( this.direction === 'left' && direction === 'right' ) ||
            ( this.direction === 'right' && direction === 'left' ) ||
            ( this.direction === 'top' && direction === 'bottom' ) ||
            ( this.direction === 'bottom' && direction === 'top' )
        ) {
            this.game.stop( this.reqID );
        }
        this.direction = direction;
    },

    draw: function() {
        var ctx = this.ctx,
            board = this.game.board,
            dir = this.direction,
            thickness = this.game.thickness,
            pos = this.pos,
            food = this.game.food,
            lastX,
            lastY;

        this.reqID = window.requestAnimationFrame(
            this.draw.bind( this )
        );

        // Add the next position
        var mapDir = {
            'top': function() {
                lastX = pos[ pos.length - 1 ].x,
                lastY = pos[ pos.length - 1 ].y - this.speed;
            },
            'right': function() {
                lastX = pos[ pos.length - 1 ].x + this.speed,
                lastY = pos[ pos.length - 1 ].y;
            },
            'bottom': function() {
                lastX = pos[ pos.length - 1 ].x,
                lastY = pos[ pos.length - 1 ].y + this.speed;
            },
            'left': function() {
                lastX = pos[ pos.length - 1 ].x - this.speed,
                lastY = pos[ pos.length - 1 ].y;
            }
        };

        mapDir[ dir ].call( this );//{{{

        // Add the last element to the position array
        pos.push( {
            x: lastX,
            y: lastY,
            dir: dir
        });

        // Draw the last element
        var lastElem = pos[ pos.length - 1 ];
        ctx.fillRect( lastElem.x, lastElem.y, thickness, thickness );

        // Remove the first element and clear it from the canvas
        var firstElem = pos.shift();
        ctx.clearRect( firstElem.x - this.speed, firstElem.y - this.speed, thickness + this.speed + 1, thickness + this.speed + 1 );

        // Check if we're eating a food
        this.detectFood();

        // Check if we're eating our own tail

        // Check if we're out of bounds
        if (
            ( lastElem.x < 1 || lastElem.x > ctx.canvas.width - 1 ) ||
            ( lastElem.y < 1 || lastElem.y > ctx.canvas.height - 1 )
        ) {
            this.game.stop( this.reqID );
        }
    },

    detectFood: function() {
        var pos = this.pos,
            lastElem = pos[ pos.length - 1 ],
            food = this.game.food,
            evt = this.game.evt;

        // Check if we're eating a food
        if (
            // Allow 3 pixels of error
            ( lastElem.x >= food.x - 3 && lastElem.x <= food.x + 8 ) &&
            ( lastElem.y >= food.y - 3 && lastElem.y <= food.y + 8 )
        ) {
            evt.emit( 'I ate some food' );

            // We need to add 10 to the length
            this.length += 10;

            // And 0.2 to its speed
            this.speed += 0.2;

            // And also to the pos array
            for ( var i = 0; i < 10; i++ ) {
                switch( pos[ 0 ].dir ) {
                case 'top':
                    pos.unshift( {
                        x: pos[ 0 ].x,
                        y: pos[ 0 ].y + i + this.speed,
                        dir: 'top'
                    });
                    break;
                case 'right':
                    pos.unshift( {
                        x: pos[ 0 ] - i - this.speed,
                        y: pos[ 0 ],
                        dir: 'right'
                    });
                    break;
                case 'bottom':
                    pos.unshift( {
                        x: pos[ 0 ],
                        y: pos[ 0 ] - i - this.speed,
                        dir: 'right'
                    });
                    break;
                case 'left':
                    pos.unshift( {
                        x: pos[ 0 ] + i + this.speed,
                        y: pos[ 0 ],
                        dir: 'right'
                    });
                    break;
                }
            }
        }
    }
};

module.exports = Snake;


});

require.define("/Food.js",function(require,module,exports,__dirname,__filename,process){"use strict";

function Food( ctx, game ) {
    this.ctx = ctx;
    this.game = game;
    this.draw();
}

Food.prototype = {
    constructor: Food,

    draw: function() {
        var ctx = this.ctx,
            cvs = ctx.canvas,
            thickness = this.game.thickness;

        // Randomly get a position
        this.x = Math.random() * ( cvs.width - 5 ) + 1;
        this.y = Math.random() * ( cvs.height - 5 ) + 1;

        // And add the food to this position
        ctx.fillRect( this.x, this.y, thickness, thickness );
    },

    clear: function() {
        var ctx = this.ctx,
            thickness = this.game.thickness;

        ctx.clearRect( this.x - 1, this.y - 1, thickness + 3, thickness + 3 );
    }
};

module.exports = Food;


});

require.define("events",function(require,module,exports,__dirname,__filename,process){if (!process.EventEmitter) process.EventEmitter = function () {};

var EventEmitter = exports.EventEmitter = process.EventEmitter;
var isArray = typeof Array.isArray === 'function'
    ? Array.isArray
    : function (xs) {
        return Object.prototype.toString.call(xs) === '[object Array]'
    }
;

// By default EventEmitters will print a warning if more than
// 10 listeners are added to it. This is a useful default which
// helps finding memory leaks.
//
// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
var defaultMaxListeners = 10;
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!this._events) this._events = {};
  this._events.maxListeners = n;
};


EventEmitter.prototype.emit = function(type) {
  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events || !this._events.error ||
        (isArray(this._events.error) && !this._events.error.length))
    {
      if (arguments[1] instanceof Error) {
        throw arguments[1]; // Unhandled 'error' event
      } else {
        throw new Error("Uncaught, unspecified 'error' event.");
      }
      return false;
    }
  }

  if (!this._events) return false;
  var handler = this._events[type];
  if (!handler) return false;

  if (typeof handler == 'function') {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        var args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
    return true;

  } else if (isArray(handler)) {
    var args = Array.prototype.slice.call(arguments, 1);

    var listeners = handler.slice();
    for (var i = 0, l = listeners.length; i < l; i++) {
      listeners[i].apply(this, args);
    }
    return true;

  } else {
    return false;
  }
};

// EventEmitter is defined in src/node_events.cc
// EventEmitter.prototype.emit() is also defined there.
EventEmitter.prototype.addListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('addListener only takes instances of Function');
  }

  if (!this._events) this._events = {};

  // To avoid recursion in the case that type == "newListeners"! Before
  // adding it to the listeners, first emit "newListeners".
  this.emit('newListener', type, listener);

  if (!this._events[type]) {
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  } else if (isArray(this._events[type])) {

    // Check for listener leak
    if (!this._events[type].warned) {
      var m;
      if (this._events.maxListeners !== undefined) {
        m = this._events.maxListeners;
      } else {
        m = defaultMaxListeners;
      }

      if (m && m > 0 && this._events[type].length > m) {
        this._events[type].warned = true;
        console.error('(node) warning: possible EventEmitter memory ' +
                      'leak detected. %d listeners added. ' +
                      'Use emitter.setMaxListeners() to increase limit.',
                      this._events[type].length);
        console.trace();
      }
    }

    // If we've already got an array, just append.
    this._events[type].push(listener);
  } else {
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  var self = this;
  self.on(type, function g() {
    self.removeListener(type, g);
    listener.apply(this, arguments);
  });

  return this;
};

EventEmitter.prototype.removeListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('removeListener only takes instances of Function');
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (!this._events || !this._events[type]) return this;

  var list = this._events[type];

  if (isArray(list)) {
    var i = list.indexOf(listener);
    if (i < 0) return this;
    list.splice(i, 1);
    if (list.length == 0)
      delete this._events[type];
  } else if (this._events[type] === listener) {
    delete this._events[type];
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  // does not use listeners(), so no side effect of creating _events[type]
  if (type && this._events && this._events[type]) this._events[type] = null;
  return this;
};

EventEmitter.prototype.listeners = function(type) {
  if (!this._events) this._events = {};
  if (!this._events[type]) this._events[type] = [];
  if (!isArray(this._events[type])) {
    this._events[type] = [this._events[type]];
  }
  return this._events[type];
};

});

require.define("/main.js",function(require,module,exports,__dirname,__filename,process){"use strict";

var cvs = document.getElementById( 'cvs' ),
    ctx = cvs.getContext( '2d' );

var width = 300,
    height = 300;

// Set the properties of the canvas
cvs.width = width;
cvs.height = height;

var Game = require( './Game.js' );

// Spawn a new game
var game = new Game( ctx );

// And start the game
game.start();


});
require("/main.js");
})();

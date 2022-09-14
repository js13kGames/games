var app = require('http').createServer(handler),
    io = require('socket.io').listen(app),
    fs = require('fs');

io.set('log level', 1);

function handler (req, res) {
    fs.readFile(__dirname + '/index.html',
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }
            res.writeHead(200);
            res.end(data);
        }
    );
}

var players = [],
    updateInterval = 1000/4,
    commands = {
        READY: 'ready'
    },
    readyCount = 0;

app.listen(8000);

io.sockets.on('connection', function (socket) {
    socket.emit('welcome', {msg: 'Hi, there! Welcome.', id: socket.id});

    socket.on('disconnect', function () {
        if (socket.data) {
            socket.broadcast.emit('remove-player', {
                name: socket.data.name,
                id: socket.data.id,
            });
        }

        for (var i = 0; len = players.length; i++) {
            if (players[i] === socket) {
                players.splice(i, 1);
                break;
            }
        }
        // check if only 1 player left, he won!
        if (players.length === 1) {
            var p = players[0];
            p.data.won = (p.data.won || 0) + 1;
            p.emit('won', {won: p.data.won});
            stopGame();
        }
    });
    socket.on('msg', function (msg) {
        if (commands[msg ? msg.toUpperCase() : '']) {
            // we got a predefined command
            return;
        }

        socket.broadcast.emit('msg', '<b>' + socket.data.name + '</b>: ' + msg);
    });
    
    socket.on('set-data', function (data) {
        data.score = 0;
        socket.data =  data;
        socket.emit('insert-players', getAllPlayers());
        
        // save player in list
        players.push(socket);
        if (players.length === 2) {
            startNewGame();
        }

        socket.broadcast.emit('insert-player', data);
    });
    
    socket.on('update-data', function (data) {
        if (!socket.data) return;
        delete data.id;
        _.extend(socket.data, data);
    });
});

function getAllPlayers () {
    return players.map(function (p) {
        return p.data;
    });
}

function startNewGame () {
    level = 1;
    startLevel();
}

function stopGame () {
    clearTimeout(levelTimeout);
}

var targetNum = 0,
    level = 0,
    currentLevelData = null,
    levelTimeout,
    levelTime = 4000;

function startLevel () {
    reset();
    currentLevelData = generateLevel();
    io.sockets.emit('level-start', {
        level: level,
        data: currentLevelData.splits
    });
    levelTimeout = setTimeout(endLevel, levelTime);
}

function endLevel () {
    // reset level if nobody left
    level = resolveLevel() ? (level + 1) : 1;
    // levelup after sometime
    setTimeout(startLevel, 2000);
}

function resolveLevel () {
    var fall = currentLevelData.fall[0],
        splits = [0].concat(currentLevelData.splits.concat(1)),
        wonCount = 0,
        w = 450,
        start_x = splits[fall] * w,
        end_x = splits[fall + 1] * w,
        loose;
        console.log('=========', level, start_x, end_x);

    players.forEach(function (socket) {
        console.log(socket.data.x, socket.data.y);
        // check if the player is gonna die or not
        (loose = (socket.data.x >= start_x) && (socket.data.x <= end_x)) || ++wonCount && ++socket.data.score;
        socket.data.loose = loose;
    });

    var all_players = getAllPlayers().sort(function (a, b) {
        return b.score - a.score;
    });;

    players.forEach(function (socket) {
        socket.emit('level-end', {
            won: !socket.data.loose,
            fall: currentLevelData.fall,
            players: all_players
        });
        delete socket.data.loose;
    });
    return wonCount;
}

function generateLevel (c) {
    var num_splits = Math.max(4 - level, 2) + ~~(Math.random() * 2),
        splits = Array.apply(null, new Array(num_splits)).map(function (i, j) {
            return (j + 1) * (1/(num_splits + 1));
        });
    return {
        fall: [~~(Math.random() * (num_splits + 1))],
        splits: splits
    };
}

function reset () {
    if (levelTimeout) {
        clearTimeout(levelTimeout);
        levelTimeout = null;
    }
    readyCount = 0;
}

function sendUpdates () {
    players.forEach(function (socket) {
        socket.emit('update-players', players.map(function (p) {
            return p.data;
        }));
    });
}

setInterval(sendUpdates, updateInterval);

function save () {
    fs.exists('scores.json', function (exists) {
    });

    fs.writeFile('scores.json', JSON.stringify(getAllPlayers()), function () {
        console.log('saving done...............');
    });
}

_ = {};
_.extend = function (obj) {
    [].slice.call(arguments, 1).forEach (function (source) {
        if (source) {
            for (var prop in source) {
                obj[prop] = source[prop];
            }
        }
    });
    return obj;
};

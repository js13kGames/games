let BoardAnalizer = {
    isTree: function (board) {
        let visited = new Matrix(board.width, board.height, false);
        let result = true;
        board.forEach(function (element, position) {
            if (result === false || visited.get(position))
                return;
            if (visit(board, visited, position))
                result = false;
        });
        return result;

        function visit(board, visited, position, previous) {
            if (visited.get(position))
                return true;
            visited.set(position, true);

            for (let i = 0; i < Vector2.directions.length; i++) {
                let next = position.add(Vector2.directions[i]);
                if (!next.equals(previous) && board.has(next) && BoardAnalizer.areNeighbours(board, position, next)) {
                    if (visit(board, visited, next, position))
                        return true;
                }
            }
            return false;
        }
    },
    findCycles: function (data) {
        let cycles = data.board.clone(),
            hasCycles = false;

        smooth(cycles);
        removeBridges(cycles);

        cycles.forEach(function (element, position) {
            let partOfCycle = !element.isEmpty();
            if (partOfCycle)
                hasCycles = true;
            data.board.get(position).setCycle(element);
        });

        return hasCycles;

        function smooth(board) {
            board.forEach(function (element, position) {
                for (let i = 0; i < Vector2.directions.length; i++) {
                    let next = position.add(Vector2.directions[i]);
                    if (!board.has(next) || !BoardAnalizer.areNeighbours(board, position, next)) {
                        board.get(position).set(next.sub(position), false);
                    }
                }
            });
        }

        function removeBridges(board) {
            let bridges = findBridges(board);

            bridges.forEach(function (bridge) {
                let posA = new Vector2(Math.floor(bridge[0] / board.size), bridge[0] % board.size),
                    posB = new Vector2(Math.floor(bridge[1] / board.size), bridge[1] % board.size),
                    tileA = board.get(posA),
                    tileB = board.get(posB);

                tileA.set(posB.sub(posA), false);
                tileB.set(posA.sub(posB), false);
            });
        }

        function findBridges(board) {
            let visited = [],
                disc = [],
                low = [],
                parent = [],
                time = 0;
                bridges = [];

            for (let i = 0; i < board.size * board.size; i++) {
                if (!visited[i])
                    bridgeUtil(i);
            }

            return bridges;

            function bridgeUtil(u) {
                visited[u] = true;
                disc[u] = low[u] = ++time;

                let neighbours = getNeighbours(u);
                for (let i = 0; i < neighbours.length; i++) {
                    let v = neighbours[i];

                    if (!visited[v]) {
                        parent[v] = u;
                        bridgeUtil(v);

                        low[u] = Math.min(low[u], low[v]);
                        if (low[v] > disc[u])
                            bridges.push([u, v]);

                    } else if (v != parent[u])
                        low[u] = Math.min(low[u], disc[v]);
                }
            }

            function getNeighbours(u) {
                let neighbours = [];
                x = Math.floor(u / board.size);
                y = u % board.size;

                if (board.hasXY(x + 1, y) && board.getXY(x, y).has('e') && board.getXY(x + 1, y).has('w'))
                    neighbours.push((x + 1) * board.size + y);
                if (board.hasXY(x - 1, y) && board.getXY(x, y).has('w') && board.getXY(x - 1, y).has('e'))
                    neighbours.push((x - 1) * board.size + y);
                if (board.hasXY(x, y + 1) && board.getXY(x, y).has('s') && board.getXY(x, y + 1).has('n'))
                    neighbours.push(x * board.size + y + 1);
                if (board.hasXY(x, y - 1) && board.getXY(x, y).has('n') && board.getXY(x, y - 1).has('s'))
                    neighbours.push(x * board.size + y - 1);

                return neighbours;
            }
        }
    },
    shouldDeleteArray: function (board) {
        let shouldDelete = [],
            fill;

        initArray();
        board.forEachXY(function (element, x, y) {
            if (!shouldDelete[x][y].hasOwnProperty('delete')) {
                fill = {
                    delete: true
                };
                if (element.isPartOfCycle()) {
                    shouldDelete[x][y] = fill;
                } else {
                    floodFillDelete(x, y, fill)
                }
            }
        });
        fixArray();
        return shouldDelete;

        function initArray() {
            let fill = {};
            for (let i = 0; i < board.size; i++) {
                let column = [];
                for (let j = 0; j < board.size; j++) {
                    column.push(fill);
                }
                shouldDelete.push(column);
            };
        }

        function floodFillDelete(x, y, fill) {
            if (!board.hasXY(x, y)) {
                fill.delete = false;
                return;
            } else if (shouldDelete[x][y].hasOwnProperty('delete') || board.getXY(x, y).isPartOfCycle()) {
                return;
            } else {
                shouldDelete[x][y] = fill;
                floodFillDelete(x + 1, y, fill);
                floodFillDelete(x - 1, y, fill);
                floodFillDelete(x, y + 1, fill);
                floodFillDelete(x, y - 1, fill);
            }
        }

        function fixArray() {
            for (let i = 0; i < board.size; i++) {
                for (let j = 0; j < board.size; j++) {
                    shouldDelete[i][j] = shouldDelete[i][j].delete;
                };
            };
        }
    },
    areNeighbours: function (board, a, b) {
        return board.get(a).has(b.sub(a)) && board.get(b).has(a.sub(b));
    }
}

let BoardCreator = {
    create: function (level) {
        let board = new Matrix(Game.BOARD_SIZE, Game.BOARD_SIZE, new Tile());
        this.spiralFill(board);
        this.levelFill(board, level);
        return board;
    },
    spiralFill: function (board) {
        let position = new Vector2(3, 3);
        let steps = 1;
        let times = 2;
        let direction = 0;
        while (true) {
            for (let i = 0; i < steps; i++) {
                if (!fill(board, position))
                    return;
                position = position.add(Vector2.directions[direction]);
            }
            direction = (direction + 1) % 4;
            if (--times === 0) {
                steps++;
                times = 2;
            }
        }

        function fill(board, position) {
            if (board.has(position)) {
                let tiles = shuffle(Tile.tileset.slice());
                while (true) {
                    board.set(position, tiles.pop().clone());
                    if (BoardAnalizer.isTree(board))
                        break;
                }
                return true;
            }
            return false;
        }
    },
    levelFill: function (board, level) {
        board.forEach(function (element, position) {
            if (level.isEmpty(position)) {
                board.set(position, new Tile());
            }
            if (level.hasOwnProperty('isBlocker') && level.isBlocker(position)) {
                board.get(position).setBlocker(true);
            }
        });
    }
}

let ComboAnnouncer = {
    good: ['Nice', 'Cool', 'Combo', 'Good'],
    great: ['Wow', 'Great', 'Super', 'Stylish'],
    amazing: ['Amazing', 'Astounding', 'Skillful', 'Master'],
    incredible: ['Incredible', 'Inconcievable', 'Extreme', 'Illusive'],
    best: ['Insanity', 'Godlike', 'Madness', 'Arcane'],
    announce: function(data) {
        if (data.combo.current === 2 || data.combo.current === 3) {
            data.message = new Message(randomText('good'), 1);
        } else if (data.combo.current >= 4 && data.combo.current < 7) {
            data.message = new Message(randomText('great'), 1.2);
        } else if (data.combo.current >= 7 && data.combo.current < 10) {
            data.message = new Message(randomText('amazing'), 1.35);
        } else if (data.combo.current >= 10 && data.combo.current < 13) {
            data.message = new Message(randomText('incredible'), 1.5);
        } else if (data.combo.current >= 13) {
            data.message = new Message(randomText('best'), 2);
        }

        function randomText(tier) {
            return ComboAnnouncer[tier][Math.floor(Math.random() * 4)];
        }
    }
}

function Game(view) {
    let graphics = new Graphics(view);
    let data = {};
    let logic = new Logic();
    let input = new Input(view, data);

    this.start = function () {
        logic.init(data);
        input.listen();
        gameLoop();
    }

    function gameLoop() {
        window.requestAnimationFrame(gameLoop);
        updateTime();
        logic.update(data);
        graphics.update(data);
    };

    function updateTime() {
        data.time.now = Date.now();

        data.time.delta = (data.time.now - data.time.last) / 1000;
        data.time.last = data.time.now;
    }
}

Game.BOARD_SIZE = 7;

window.onload = function () {
    let view = setupView();
    let game = new Game(view);
    game.start();
}

function setupView() {
    let size = {
        top: 2,
        mid: 7,
        bot: 2
    }
    size.sum = size.top + size.mid + size.bot;
    let ratio = size.mid / size.sum;
    let canvas = {
        top: document.getElementById('a'),
        mid: document.getElementById('b'),
        bot: document.getElementById('c'),
        back: document.getElementById('d')
    }

    updateOnResize();
    window.addEventListener('resize', updateOnResize);

    return canvas;

    function updateOnResize() {
        let unit;
        let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        let height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

        if (height * ratio <= width) {
            unit = height / size.sum;
        } else {
            unit = width / size.mid;
        }

        canvas.top.width = size.mid * unit;
        canvas.mid.width = size.mid * unit * 0.95;
        canvas.back.width = size.mid * unit;
        canvas.bot.width = size.mid * unit;

        canvas.top.height = size.top * unit;
        canvas.mid.height = size.mid * unit * 0.95;
        canvas.back.height = size.mid * unit;
        canvas.bot.height = size.bot * unit;
    }
}

function Input(view, data) {
    let inputProcessor = new InputProcessor(data);
    let ignoreMousePress = false;
    let handledTouch = false;

    this.listen = function () {
        data.offset = {};

        document.body.addEventListener('mousedown', onMouseDown, false);
        document.body.addEventListener('mousemove', onMouseMove, false);
        document.body.addEventListener('mouseup', onMouseUp, false);
        document.body.addEventListener('mouseleave', onMouseLeave, false);

        document.body.addEventListener("touchstart", onTouchStart, false);
        document.body.addEventListener("touchmove", onTouchMove, false);
        document.body.addEventListener("touchend", onTouchEnd, false);
        document.body.addEventListener("touchcancel", onTouchCancel, false);
    };

    function onMouseDown(event) {
        if (data.ignoreInput || ignoreMousePress)
            return;
        if (contained(event, view.mid.getBoundingClientRect())) {
            ignoreMousePress = true;
            inputProcessor.onpress(eventBoardLocation(event));
        } else if (contained(event, view.bot.getBoundingClientRect())) {
            reactIfButtonPressed(event);
        }
    }

    function reactIfButtonPressed(event) {
        let rect = view.bot.getBoundingClientRect(),
            x = event.clientX - rect.left,
            y = event.clientY - rect.top;
        if (y > rect.height * 0.40 && y < rect.height * 0.75) {
            if (x < rect.height * 0.75 && x > rect.height * 0.20) {
                inputProcessor.restartLevelPressed();
            } else if (x > rect.width - rect.height * 0.75 && x < rect.width - rect.height * 0.20) {
                inputProcessor.wipeSavePressed();
            }
        }
    }

    function onMouseMove(event) {
        if (data.ignoreInput || !ignoreMousePress)
            return;
        inputProcessor.onmove(eventBoardLocation(event));
    }

    function onMouseUp(event) {
        ignoreMousePress = false;
        inputProcessor.onrelease();
    }

    function onMouseLeave(event) {
        ignoreMousePress = false;
        inputProcessor.oncancel();
    }

    function eventBoardLocation(event) {
        let board = view.mid.getBoundingClientRect();
        let size = view.mid.width / data.board.size;
        return {
            x: (event.clientX - board.left) / size,
            y: (event.clientY - board.top) / size
        }
    }

    function contained(event, rectangle) {
        return event.clientX >= rectangle.left && event.clientX < rectangle.right && event.clientY >= rectangle.top && event.clientY < rectangle.bottom;
    }

    function onTouchStart(event) {
        event.preventDefault();
        if (data.ignoreInput || handledTouch !== false)
            return;
        let touch = event.changedTouches[0];
        if (contained(touch, view.mid.getBoundingClientRect())) {
            inputProcessor.onpress(eventBoardLocation(touch));
            handledTouch = touch.identifier;
        } else if (contained(touch, view.bot.getBoundingClientRect())) {
            reactIfButtonPressed(touch);
        }
    };

    function onTouchMove(event) {
        event.preventDefault();
        if (data.ignoreInput || handledTouch === false)
            return;
        for (let i = 0; i < event.changedTouches.length; i++) {
            if (event.changedTouches[i].identifier === handledTouch) {
                inputProcessor.onmove(eventBoardLocation(event.changedTouches[i]));
            }
        };
    };

    function onTouchEnd(event) {
        if (handledTouch === false)
            return;
        for (let i = 0; i < event.changedTouches.length; i++) {
            if (event.changedTouches[i].identifier === handledTouch) {
                handledTouch = false;
                inputProcessor.onrelease();
            }
        };
    };

    function onTouchCancel() {
        if (handledTouch === false)
            return;
        for (let i = 0; i < event.changedTouches.length; i++) {
            if (event.changedTouches[i].identifier === handledTouch) {
                handledTouch = false;
                inputProcessor.oncancel();
            }
        };
    };
}

function InputProcessor(data) {
    let tileSelected;
    let offset = {};

    this.onpress = function (location) {
        if (data.ignoreBoardInput === true)
            return;
        tileSelected = location;
    }

    this.onmove = function (location) {
        if (data.ignoreBoardInput === true)
            return;
        offset = {
            x: location.x - tileSelected.x,
            y: location.y - tileSelected.y
        }
        processOffset();
    }

    function processOffset() {
        if (!data.offset.invalid && (Math.abs(offset.x) > 0.3 || Math.abs(offset.y) > 0.3) && data.offset.value === undefined) {
            if (Math.abs(offset.x) > Math.abs(offset.y)) {
                data.offset.row = Math.floor(tileSelected.y);
                data.offset.invalid = false;
                for (let i = 0; i < data.board.size; i++) {
                    if (data.board.getXY(i, data.offset.row).isBlocker()) {
                        data.offset.invalid = true;
                        break;
                    }
                }
            } else {
                data.offset.column = Math.floor(tileSelected.x);
                data.offset.invalid = false;
                for (let i = 0; i < data.board.size; i++) {
                    if (data.board.getXY(data.offset.column, i).isBlocker()) {
                        data.offset.invalid = true;
                        break;
                    }
                }
            }
            updateDataOffsetValue();
        }
        if (data.offset.value !== undefined) {
            updateDataOffsetValue();
        }
    }

    function updateDataOffsetValue() {
        let limit = data.board.width - 1;
        if (data.offset.invalid === true) {
            data.offset.value = 0;
        } else if (data.offset.row !== undefined) {
            data.offset.value = clamp(offset.x, -limit, limit);
        } else {
            data.offset.value = clamp(offset.y, -limit, limit);
        }
    }

    function clamp(number, min, max) {
        return Math.min(Math.max(number, min), max);
    }

    this.onrelease = function () {
        if (data.ignoreBoardInput === true)
            return;

        data.offset.value = Math.round(-data.offset.value) || 0;
        if (data.offset.value < 0)
            data.offset.value += data.board.width;
        if (data.offset.value !== 0) {
            updateBoardAfterShift();
            data.ignoreInput = true;
            data.boardChanged = true;
        }

        data.offset = {};
    }

    function updateBoardAfterShift() {
        let shifted = [];
        if (data.offset.row !== undefined) {
            for (let i = 0; i < data.board.size; i++) {
                shifted[i] = data.board.getXY((i + data.offset.value) % data.board.size, data.offset.row);
            }
            for (let i = 0; i < data.board.size; i++) {
                data.board.setXY(i, data.offset.row, shifted[i]);
            }
        } else {
            for (let i = 0; i < data.board.size; i++) {
                shifted[i] = data.board.getXY(data.offset.column, (i + data.offset.value) % data.board.size);
            }
            for (let i = 0; i < data.board.size; i++) {
                data.board.setXY(data.offset.column, i, shifted[i]);
            }
        }
    }

    this.oncancel = function () {
        data.offset = {};
    }

    this.restartLevelPressed = function () {
        data.restart = true;
    }

    this.wipeSavePressed = function () {
        if (window.confirm('Erase all saved data?')) {
            localStorage.removeItem(Logic.LEVEL_KEY);
            location.reload();
        }
    }
}

let Levels = [{
    isEmpty: function(position) {
        return false;
    },
    text: 'Drag the tiles to create cycles',
    objectiveMet: function(data) {
        return data.score > 0;
    }
}, {
    isEmpty: function(position) {
        return false;
    },
    text: 'Create cycles in a row to combo',
    objectiveMet: function(data) {
        return data.combo.current > 1;
    }
}, {
    isEmpty: function(position) {
        return position.x === 3 && position.y === 3;
    },
    text: 'Destroy the glitch tile!',
    objectiveMet: noGlitch
}, {
    isEmpty: function(position) {
        return (position.x === position.y) && (position.x === 2 || position.x === 4);
    },
    text: 'The glitch is spreading, stop it!',
    time: 240,
    objectiveMet: noGlitch
}, {
    isEmpty: function(position) {
        return (position.x === 2 || position.x === 4) && (position.y === 2 || position.y === 4);
    },
    turns: 100,
    text: 'Get 3,000 points',
    objectiveMet: highscore(3000)
}, {
    isEmpty: function(position) {
        switch (position.x) {
            case 1:
                return position.y === 5;
            case 2:
            case 3:
            case 4:
                return position.x === position.y;
            case 5:
                return position.y === 1;
            default:
                return false;
        }
    },
    isBlocker: function(position) {
        return position.x === 3 && position.y === 3;
    },
    time: 200,
    text: 'Destroy all the glitch tiles',
    objectiveMet: noGlitch
}, {
    isEmpty: function(position) {
        return (position.x === 1 || position.x === 5) && (position.y === 1 || position.y === 5);
    },
    isBlocker: function(position) {
        return (position.x === 1 || position.x === 5) && (position.y === 1 || position.y === 5);
    },
    time: 200,
    text: 'Get a x5 combo',
    objectiveMet: function(data) {
        return data.combo.current >= 5;
    }
}, {
    isEmpty: function(position) {
        return position.x % 3 === 0;
    },
    time: 300,
    text: 'Score 10,000 points in one turn',
    objectiveMet: function(data) {
        this.lastScore = this.lastScore || 0;
        return data.score - this.lastScore >= 10000;
    }
}, {
    isEmpty: function(position) {
        return false;
    },
    isBlocker: function(position) {
        return (position.x === 2 || position.x === 4) && (position.y === 2 || position.y === 4);
    },
    turns: 20,
    text: 'Destroy all blockers',
    objectiveMet: function(data) {
        let result = true;
        data.board.forEach(function(element) {
            if (element.isBlocker())
                result = false;
        });
        return result;
    }
}, {
    isEmpty: function(position) {
        switch (position.x) {
            case 3:
                return position.y === 3;
            case 0:
            case 6:
                return position.y === 0 || position.y === 6;
            case 1:
            case 5:
                return position.y === 1 || position.y === 5;
            default:
                return false;
        }
    },
    isBlocker: function(position) {
        switch (position.x) {
            case 0:
            case 6:
                return position.y === 0 || position.y === 6;
            case 1:
            case 5:
                return position.y === 1 || position.y === 5;
            default:
                return false;
        }
    },
    turns: 20,
    text: 'Destroy the glitch tile',
    objectiveMet: noGlitch
}, {
    isEmpty: function(position) {
        return Math.random() < 0.3;
    },
    time: 300,
    text: 'Score 15,000 points',
    objectiveMet: highscore(15000)
}, {
    isEmpty: function(position) {
        switch (position.x) {
            case 0:
            case 6:
                return true;
            case 3:
                return position.y === 3;
            default:
                return false;
        }
    },
    isBlocker: function(position) {
        switch (position.x) {
            case 0:
            case 6:
                return !(position.y === 0 || position.y === 6);
            default:
                return false;
        }
    },
    turns: 70,
    text: 'Destroy all glitch tiles',
    objectiveMet: noGlitch
}, {
    isEmpty: function(position) {
        switch (position.x) {
            case 2:
            case 4:
                return position.y === 3;
            case 3:
                return position.y === 2 || position.y === 4;
            default:
                return false;
        }
    },
    isBlocker: function(position) {
        switch (position.x) {
            case 0:
            case 6:
                return position.y === 0 || position.y === 6;
            case 1:
            case 5:
                return position.y === 1 || position.y === 5;
            default:
                return false;
        }
    },
    text: 'Get a x13 combo',
    objectiveMet: function(data) {
        return data.combo.current >= 13;
    }
}, {
    isEmpty: function(position) {
        switch (position.y) {
            case 0:
                return !(position.x % 3 === 0);
            case 1:
                return position.x % 3 === 0;
            case 2:
            case 3:
                return position.x === 0 || position.x === 6;
            case 4:
                return position.x === 1 || position.x === 5;
            case 5:
                return position.x === 2 || position.x === 4;
            case 6:
                return position.x === 3;
        }
    },
    text: 'Free Play',
    objectiveMet: function(data) {
        return false;
    }
}]

function noGlitch(data) {
    let result = true;
    data.board.forEach(function(element) {
        if (element.isGlitch())
            result = false;
    });
    return result;
}

function highscore(score) {
    return function(data) {
        return data.score >= score;
    }
}

Logic.LEVEL_KEY = 'pl.szpiotr.cycles.level';

function Logic() {
    let FALL_SPEED = 6,
        levelCompleted;

    this.init = function(data) {
        let level = localStorage.getItem(Logic.LEVEL_KEY) || 0;
        initLevel(data, level);
    }

    function initLevel(data, number) {
        clearData();
        data.offset = {};
        initTime();
        initScore();

        localStorage.setItem(Logic.LEVEL_KEY, number);
        initLevelProperties();

        function clearData() {
            for (let prop in data) {
                if (data.hasOwnProperty(prop))
                    delete data[prop];
            }
        }

        function initTime() {
            data.time = {
                last: Date.now(),
                now: Date.now()
            }
        }

        function initScore() {
            data.score = 0;
            data.combo = {
                current: 0,
                previous: 0,
                color: 'white'
            };
        }

        function initLevelProperties() {
            let level = Levels[number];
            levelCompleted = level.objectiveMet;

            data.message = new Message('Level ' + number, 2);
            data.level = {};
            data.level.current = number;
            data.level.text = level.text;
            if (level.hasOwnProperty('turns')) {
                data.level.turnsLeft = level.turns;
            } else if (level.hasOwnProperty('time')) {
                data.level.startTime = Date.now();
                data.level.timeTotal = level.time;
                data.level.timeLeft = level.time;
            }
            data.board = BoardCreator.create(level);
        }
    }

    this.update = function(data) {
        if (data.restart === true) {
            initLevel(data, data.level.current);
            return;
        }
        data.message.update(data);
        updateTimeLeft(data);
        processPlayerActions(data);
        removeTilesIfNeeded(data);
        updateTiles(data);
        endLevelIfNecessary(data);
    }

    function updateTimeLeft(data) {
        if (data.level.hasOwnProperty('timeLeft')) {
            data.level.timeLeft = Math.ceil((data.level.timeTotal * 1000 + data.level.startTime - Date.now()) / 1000);
            if (data.level.timeLeft < 0)
                data.level.timeLeft = 0;
        }
    }

    function processPlayerActions(data) {
        if (data.boardChanged === true) {
            data.boardChanged = false;
            analyzeBoard();
            handleEndOfTurn();
        }

        function analyzeBoard() {
            if (BoardAnalizer.findCycles(data)) {
                Graphics.cycleColor = Graphics.getRainbow();
                data.timeUntilTileRemove = 0.7;
            } else {
                data.ignoreInput = false;
                data.turnPassed = true;
            }
        }

        function handleEndOfTurn() {
            if (data.turnPassed === true) {
                data.turnPassed = false;

                if (data.level.hasOwnProperty('turnsLeft'))
                    data.level.turnsLeft--;

                if (data.combo.current === data.combo.previous) {
                    data.combo.current = data.combo.previous = 0;
                } else {
                    data.combo.previous = data.combo.current;
                }
            }
        }
    }

    function removeTilesIfNeeded(data) {
        if (data.timeUntilTileRemove > 0) {
            data.timeUntilTileRemove -= data.time.delta;
            if (data.timeUntilTileRemove < 0) {
                let shouldDelete = BoardAnalizer.shouldDeleteArray(data.board);
                updateScore(data, shouldDelete);
                removeTiles(data, shouldDelete);
            }
        }
    }

    function updateScore(data, shouldDelete) {
        let updateCombo = false;
        let counter = 0;
        data.board.forEachXY(function(element, x, y) {
            if (shouldDelete[x][y]) {
                updateCombo = true;
                data.score += ++counter * (data.combo.current + 1) * 10;
                if (element.isGlitch())
                    data.score += 500 * (data.combo.current + 1);
            }
        });
        if (updateCombo) {
            data.combo.color = Graphics.getRainbow();
            data.combo.current++;
            ComboAnnouncer.announce(data);
        }
    }

    function removeTiles(data, shouldDelete) {
        for (let i = 0; i < data.board.size; i++) {
            let ceiling = 1;
            for (let j = data.board.size - 1; j >= 0; j--) {
                if (shouldDelete[i][j]) {
                    for (var k = j - 1; k >= 0; k--) {
                        if (!shouldDelete[i][k])
                            break;
                    }
                    if (k >= 0) {
                        shouldDelete[i][k] = true;
                        let tile = data.board.getXY(i, k);
                        tile.offset = j - k;
                        data.board.setXY(i, j, tile);
                    } else {
                        let tile = Tile.tileset[Math.floor(Math.random() * Tile.tileset.length)].clone();
                        tile.offset = j + ceiling;
                        data.board.setXY(i, j, tile);
                        ceiling++;
                    }
                }
            }
        }
    }

    function updateTiles(data) {
        let positionChanged = false;
        data.board.forEach(function(tile) {
            updateHue(tile);
            if (updatePosition(tile, data.time.delta)) {
                positionChanged = true;
            }
        });
        if (data.timeUntilTileRemove < 0 && !positionChanged) {
            data.timeUntilTileRemove = 0;
            data.boardChanged = true;
        }

        function updateHue(tile) {
            if (tile.isGlitch()) {
                if (!tile.hasOwnProperty('nextChange') || tile.nextChange <= 0) {
                    tile.hue = Math.random() * 360;
                    tile.nextChange = Math.random() * 1.5;
                }
                tile.nextChange -= data.time.delta;
            }
        }

        function updatePosition(tile) {
            if (tile.offset === 0)
                return false;

            tile.offset -= data.time.delta * FALL_SPEED;
            if (tile.offset <= 0) {
                tile.offset = 0;
            }

            return true;
        }
    }

    function endLevelIfNecessary(data) {
        if (!data.ignoreInput) {
            if (noTurnsLeft() || noTimeLeft()) {
                if (data.ignoreBoardInput != true) {
                    data.message = new Message('Level failed', 1, true);
                    data.ignoreBoardInput = true;
                }
            } else if (levelCompleted(data)) {
                initLevel(data, ++data.level.current);
            }
        }

        function noTurnsLeft() {
            return data.level.hasOwnProperty('turnsLeft') && data.level.turnsLeft <= 0;
        }

        function noTimeLeft() {
            return data.level.hasOwnProperty('timeLeft') && data.level.timeLeft <= 0;
        }
    }
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
    return a;
}

function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function BoardPainter(ctx, view) {
    let tilePainter = new TilePainter();

    this.paint = function (data) {
        tilePainter.recalculate(view.width);
        drawBoard(data.board, data.offset);
        drawMessage(data.message);
    }

    function drawBoard(board, offset) {
        board.forEach(function (element, pos) {
            if (pos.y === offset.row) {
                tilePainter.paintTile(ctx, pos.x + offset.value, pos.y, element);
                tilePainter.paintTile(ctx, pos.x + offset.value - board.size, pos.y, element);
                tilePainter.paintTile(ctx, pos.x + offset.value + board.size, pos.y, element);
            } else if (pos.x === offset.column) {
                tilePainter.paintTile(ctx, pos.x, pos.y + offset.value, element);
                tilePainter.paintTile(ctx, pos.x, pos.y + offset.value - board.size, element);
                tilePainter.paintTile(ctx, pos.x, pos.y + offset.value + board.size, element);
            } else {
                tilePainter.paintTile(ctx, pos.x, pos.y - element.offset, element);
            }
        });
    };

    function drawMessage(message) {
        if(message.visible) {
            ctx.textBaseline = 'middle';
            ctx.textAlign = "center";
            ctx.fillStyle = message.color;
            ctx.font = 'bold ' + message.size * view.height / 10  + 'px sans-serif';
            ctx.strokeStyle = 'black';
            ctx.lineJoin = "miter";
            ctx.miterLimit = 2;
            ctx.lineWidth = view.height / 30;
            ctx.strokeText(message.text, view.width / 2, view.height / 2);
            ctx.fillText(message.text, view.width /2, view.height / 2);
        }
    }
}

function Graphics(view) {
    let ctx = {
            top: view.top.getContext('2d'),
            mid: view.mid.getContext('2d'),
            bot: view.bot.getContext('2d')
        },

        boardPainter = new BoardPainter(ctx.mid, view.mid),
        scorePainter = new ScorePainter(ctx.top, view.top),
        infoPainter = new InfoPainter(ctx.bot, view.bot);

    this.update = function (data) {
        clearAll();
        boardPainter.paint(data);
        scorePainter.paint(data);
        infoPainter.paint(data);
    };

    function clearAll() {
        clear('mid');
        clear('bot');
        clear('top');
    }

    function clear(location) {
        ctx[location].fillStyle = '#333';
        ctx[location].fillRect(0, 0, view[location].width, view[location].height);
    };
}

Graphics.getRainbow = function () {
    return 'hsl(' + Math.random() * 360 + ', 100%, 60%)';
}

Graphics.roundRect = function (ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
}

function InfoPainter(ctx, view) {

    this.paint = function (data) {
        let metrics = setup();
        initStroke();
        drawDescription(metrics, data.level.text);
        if (data.level.hasOwnProperty('timeLeft')) {
            drawNumber(metrics, data.level.timeLeft, 'TIME LEFT');
        } else if (data.level.hasOwnProperty('turnsLeft')) {
            drawNumber(metrics, data.level.turnsLeft, 'TURNS LEFT');
        }
        drawRestartButton();
        drawEraseProgressButton();
    }

    function drawRestartButton() {
        let size = view.height / 2.5,
            x = view.height / 5 + size / 2,
            y = view.height - x;
        ctx.fillStyle = '#888';
        ctx.font = 'bold ' + size + 'px sans-serif';
        ctx.fillText(String.fromCharCode(8634), x, y);
    }

    function drawEraseProgressButton() {
        let size = view.height / 2.5,
            offset = view.height / 5 + size / 2,
            x = view.width - offset,
            y = view.height - offset;
        ctx.fillStyle = '#888';
        ctx.font = 'bold ' + size + 'px sans-serif';
        ctx.fillText('x', x, y);
    }

    function drawStroked(text, x, y) {
        ctx.strokeText(text, x, y);
        ctx.fillText(text, x, y);
    }

    function initStroke() {
        ctx.strokeStyle = 'black';
        ctx.lineJoin = "miter";
        ctx.miterLimit = 2;
        ctx.lineWidth = view.height / 15;
    }

    function drawDescription(metrics, text) {
        ctx.font = 'bold ' + metrics.descriptionSize + 'px sans-serif';
        drawStroked(text, view.width / 2, metrics.descriptionOffset);
    }

    function drawNumber(metrics, number, type) {
        ctx.font = 'bold ' + metrics.numberSize + 'px sans-serif';
        ctx.fillText(number, view.width / 2, metrics.numberOffset);
        ctx.font = 'bold ' + metrics.typeSize + 'px sans-serif';
        ctx.fillText(type, view.width / 2, metrics.typeOffset);
    }

    function setup() {
        ctx.fillStyle = 'white';
        ctx.textBaseline = 'middle';
        ctx.textAlign = "center";
        return {
            descriptionSize: view.height / 5,
            descriptionOffset: view.height / 5,
            numberSize: view.height * 2 / 5,
            numberOffset: view.height * 3 / 5,
            typeSize: view.height / 10,
            typeOffset: view.height * 85 / 100
        }
    }
}

function ScorePainter(ctx, view) {

    this.paint = function (data) {
        let scoreSize = view.height / 2;
        let comboSize = view.height / 5;
        initStroke();

        ctx.textBaseline = 'middle';
        ctx.textAlign = "center";

        ctx.fillStyle = 'white';
        ctx.font = 'bold ' + scoreSize + 'px monospace';
        drawStroked(scoreText(data.score), view.width / 2, view.height * 4 / 10);
        ctx.fillStyle = data.combo.color;
        ctx.font = 'bold ' + comboSize + 'px sans-serif';
        drawStroked(comboText(data.combo.current), view.width / 2, view.height * 4 / 5);
    }

    function drawStroked(text, x, y) {
        ctx.strokeText(text, x, y);
        ctx.fillText(text, x, y);
    }

    function initStroke() {
        ctx.strokeStyle = 'black';
        ctx.lineJoin = "miter";
        ctx.miterLimit = 2;
        ctx.lineWidth = view.height / 15;
    }

    function scoreText(score) {
        return score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function comboText(combo) {
        if(combo < 2)
            return '';

        return 'COMBO X' + combo;
    }
}

function TilePainter() {
    let size,
        outline,
        width,
        height,
        shadow,
        radius,
        line = {
            horizontal: {},
            vertical: {}
        };

    this.recalculate = function (canvasSize) {
        size = canvasSize / Game.BOARD_SIZE;
        outline = size / 20;
        width = size - outline * 2;
        height = width * 6 / 7;
        shadow = width / 7;
        radius = size / 8;

        let xThickness = width / 6,
            yThickness = xThickness * 6 / 7;

        line.horizontal.x = width / 2;
        line.horizontal.y = 0;
        line.horizontal.thickness = yThickness;

        line.vertical.x = 0;
        line.vertical.y = height / 2;
        line.vertical.thickness = xThickness;
    };

    this.paintTile = function (ctx, x, y, tile) {
        x *= size;
        y *= size;
        if (isVisible(x, y)) {
            paintOutline(ctx, x, y);
            x += outline;
            y += outline;
            paintBase(ctx, x, y, tile);
            paintBlocker(ctx, x, y, tile);
            paintPattern(ctx, x, y, tile);
        }
    };

    function isVisible(x, y) {
        let min = -size,
            max = size * 7;
        return (x >= min) && (x <= max) && (y >= min) && (y <= max);
    }

    function paintOutline(ctx, x, y) {
        ctx.fillStyle = '#181818';
        Graphics.roundRect(ctx, x, y, size, size, radius);
    }

    function paintBase(ctx, x, y, tile) {
        ctx.fillStyle = getSecondaryColor(tile);
        Graphics.roundRect(ctx, x, y + shadow, width, height, radius);
        ctx.fillStyle = getPrimaryColor(tile);
        Graphics.roundRect(ctx, x, y, width, height, radius);
    }

    function getPrimaryColor(tile) {
        if (tile.isBlocker()) {
            return '#444';
        } else if (tile.isGlitch()) {
            return 'hsl(' + tile.hue + ', 80%, 50%)';
        } else {
            return '#F9ECC0';
        }
    }

    function getSecondaryColor(tile) {
        if (tile.isBlocker()) {
            return '#333';
        } else if (tile.isGlitch()) {
            return 'hsl(' + tile.hue + ', 100%, 35%)';
        } else {
            return '#B0A274';
        }
    }

    function paintPattern(ctx, x, y, tile) {
        if (tile.isEmpty())
            return;

        if (tile.has('n')) {
            drawLine(line.horizontal.x, 0, 'vertical', tile.hasCycle('n'));
        }
        if (tile.has('w')) {
            drawLine(0, line.vertical.y, 'horizontal', tile.hasCycle('w'));
        }
        if (tile.has('s')) {
            drawLine(line.horizontal.x, line.vertical.y + line.horizontal.y, 'vertical', tile.hasCycle('s'));
        }
        if (tile.has('e')) {
            drawLine(line.horizontal.x + line.vertical.x, line.vertical.y, 'horizontal', tile.hasCycle('e'));
        }
        drawCenterPin(x + width / 2, y + height / 2, tile.isPartOfCycle());

        function drawLine(x0, y0, direction, isCycle) {
            ctx.strokeStyle = getLineColor(tile, isCycle);
            ctx.lineWidth = isCycle ? line[direction].thickness * 1.5 : line[direction].thickness;

            ctx.beginPath();
            ctx.moveTo(x + x0, y + y0);
            ctx.lineTo(x + x0 + line[direction].x, y + y0 + line[direction].y);
            ctx.stroke();
        }

        function drawCenterPin(x, y, isCycle) {
            let width = isCycle ? line.vertical.thickness * 1.5 : line.vertical.thickness;
            let height = isCycle ? line.horizontal.thickness * 1.5 : line.horizontal.thickness;
            ctx.fillStyle = getLineColor(tile, isCycle);

            ctx.beginPath();
            ctx.ellipse(x, y, width / Math.sqrt(2), height / Math.sqrt(2), 0, 0, 2 * Math.PI);
            ctx.fill();
        }

        function getLineColor(tile, isCycle) {
            if(isCycle)
                return Graphics.cycleColor;
            if(tile.isBlocker())
                return 'white';
            return 'black';
        }
    }

    function paintBlocker(ctx, x, y, tile) {
        if(!tile.isBlocker())
            return;

        ctx.strokeStyle = '#e00';
        ctx.lineWidth = line.vertical.thickness * 1.2;

        ctx.beginPath();
        ctx.moveTo(x + width / 5, y + height / 5);
        ctx.lineTo(x + width * 4 / 5, y + + height * 4 / 5);
        ctx.moveTo(x + width * 4 / 5, y + height / 5);
        ctx.lineTo(x + width / 5, y + + height * 4 / 5);
        ctx.stroke();
    }
}

function Matrix(width, height, fill) {
    let matrix = [];
    for (let i = 0; i < width; i++) {
        let column = [];
        for (let j = 0; j < height; j++) {
            column.push(fill);
        }
        matrix.push(column);
    }

    this.getXY = function (x, y) {
        if (inBounds(x, y))
            return matrix[x][y];
    }

    this.get = function (position) {
        return this.getXY(position.x, position.y);
    }

    this.setXY = function (x, y, value) {
        if (inBounds(x, y))
            matrix[x][y] = value;
    }

    this.set = function (position, value) {
        this.setXY(position.x, position.y, value);
    }

    this.hasXY = inBounds;

    this.has = function (position) {
        return this.hasXY(position.x, position.y);
    };

    function inBounds(x, y) {
        return x >= 0 && x < width && y >= 0 && y < height;
    }

    this.forEach = function (callback) {
        for (let i = 0; i < width; i++)
            for (let j = 0; j < height; j++)
                callback(matrix[i][j], new Vector2(i, j));
    }

    this.forEachXY = function (callback) {
        for (let i = 0; i < width; i++)
            for (let j = 0; j < height; j++)
                callback(matrix[i][j], i, j);
    }

    this.clone = function () {
        let clone = new Matrix(width, height);
        clone.forEach(function (element, position) {
            let original = matrix[position.x][position.y];
            let copy = original.clone ? original.clone() : deepCopy(original);
            clone.set(position, copy);
        });
        return clone;
    }

    Object.defineProperties(this, {
        "width": {
            value: width,
            writable: false
        },
        "height": {
            value: height,
            writable: false
        },
        "size": {
            value: width,
            writable: false
        }
    });
}

function Message(text, size, persistent) {
    this.color = Graphics.getRainbow();
    this.text = text;
    this.size = size;
    this.visible = true;

    let created = persistent === true ? Infinity : Date.now();
    this.update = function(data) {
        if (data.time.now - created > 1000)
            this.visible = false;
    }
}

function Tile(n, e, s, w) {
    let tile = {
            n: Boolean(n),
            e: Boolean(e),
            s: Boolean(s),
            w: Boolean(w)
        },
        cycle = {},
        blocker = false;

    this.has = function (direction) {
        return tile[Tile.resolve(direction)];
    };

    this.set = function (direction, value) {
        tile[Tile.resolve(direction)] = Boolean(value);
    };

    this.isEmpty = function () {
        return !(tile.n || tile.e || tile.s || tile.w);
    }

    this.isGlitch = function() {
        return !(tile.n || tile.e || tile.s || tile.w) && !blocker;
    };

    this.isPartOfCycle = function () {
        return cycle.n || cycle.e || cycle.s || cycle.w || false;
    }

    this.hasCycle = function (direction) {
        return cycle[Tile.resolve(direction)];
    }

    this.isBlocker = function () {
        return blocker;
    }

    this.setBlocker = function (value) {
        blocker = Boolean(value);
    }

    this.setCycle = function (tile) {
        if (tile === false) {
            cycle = {};
        } else {
            cycle.n = tile.has('n');
            cycle.e = tile.has('e');
            cycle.s = tile.has('s');
            cycle.w = tile.has('w');
        }
    }

    this.clone = function () {
        return new Tile(tile.n, tile.e, tile.s, tile.w);
    };

    this.offset = 0;
}

Tile.resolve = function (direction) {
    if (typeof direction === 'string')
        return direction;
    if (direction.y < 0) {
        return 'n';
    } else if (direction.y > 0) {
        return 's';
    } else if (direction.x < 0) {
        return 'w';
    } else if (direction.x > 0) {
        return 'e';
    }
}

Tile.tileset = [
    new Tile(0, 0, 1, 1),
    new Tile(0, 1, 0, 1),
    new Tile(0, 1, 1, 0),
    new Tile(0, 1, 1, 1),
    new Tile(1, 0, 0, 1),
    new Tile(1, 0, 1, 0),
    new Tile(1, 0, 1, 1),
    new Tile(1, 1, 0, 0),
    new Tile(1, 1, 0, 1),
    new Tile(1, 1, 1, 0),
    new Tile(1, 1, 1, 1)
];

function Vector2(x, y) {
    Object.defineProperties(this, {
        "x": {
            value: x,
            writable: false
        },
        "y": {
            value: y,
            writable: false
        }
    });

    this.add = function (vector) {
        return new Vector2(x + vector.x, y + vector.y);
    }

    this.sub = function (vector) {
        return new Vector2(x - vector.x, y - vector.y);
    }

    this.mul = function (scalar) {
        return new Vector2(x * scalar, y * scalar);
    }

    this.equals = function (other) {
        if (!(other instanceof Vector2))
            return false;
        return x === other.x && y === other.y;
    }
}

Vector2.directions = [
    new Vector2(0, -1),
    new Vector2(1, 0),
    new Vector2(0, 1),
    new Vector2(-1, 0)
]

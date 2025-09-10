function noOfLevel() {
    return _levels.length;
}

function generateLevel(levelIndex) {
    let lvl = _levels[levelIndex];

    _level = { 
        g : svgGroup(), 
        game: svgGroup(),
        maze : svgGroup(), 
        index: levelIndex,
        width: lvl.width, 
        height: lvl.height,
        portals: [],
        badLucks: [],
        goodLucks: [],
        cats: [] 
    };

    _level.maze.appendChild(svgRect(0, 0, lvl.width * side, lvl.height * side, "#36332d"));
    _level.game.appendChild(_level.maze);
    _level.g.appendChild(_level.game);
    
    let openings = _generateMaze();
    for (let y = 0; y < lvl.height; y++) {
        for (let x = 0; x < lvl.width; x++) {
            _level[c(x, y)] = _generateCell(x, y, _level.maze, openings);
        }
    }

    _occupiedCells = [];
    _level.avatar = _addObject(() => svgUse("head1", 0, 0),  lvl.width, lvl.height);
    _level.avatar.head1 = _level.avatar.element;
    _level.avatar.head2 = svgUse("head2",0, 0);
    _level.game.appendChild(_level.avatar.head2);
    _level.avatar.head2.style.display = "none";
    _level.avatar.head3 = svgUse("head3",0, 0);
    _level.game.appendChild(_level.avatar.head3);
    _level.avatar.head3.style.display = "none";
    _level.avatar.head4 = svgUse("head4",0, 0);
    _level.game.appendChild(_level.avatar.head4);
    _level.avatar.head4.style.display = "none";

    for(let i = 0; i < lvl.cats; i++) {
        _level.cats.push(_addObject(svgCat, lvl.width, lvl.height));
    }
    for(let i = 0; i < lvl.portals; i++) {
        _level.portals.push(_addObject(svgPortal, lvl.width, lvl.height));
    }
    for(let i = 0; i < lvl.badLucks; i++) {
        _level.badLucks.push(_addObject(svgBadLuck, lvl.width, lvl.height));
    }
    for(let i = 0; i < lvl.goodLucks; i++) {
        _level.goodLucks.push(_addObject(svgGoodLuck, lvl.width, lvl.height));
    }
    _level.horseshoe = _addObject(svgHorseshoe, lvl.width, lvl.height);
    _level.floor = svgRect(0, 0, 100, 50, "yellow");
    _level.tower = svgTower(0, 0, levelIndex, 0.5);
    _level.g.appendChild(_level.tower)

    _level.lives = svgGroup();
    for (let i = 0; i < lives; i++) {
        _level.lives.appendChild(svgUse("head1", -100, i * 50));
    }
    _level.lives.setAttribute("opacity", 0.5);
    _level.g.appendChild(_level.lives)
    return _level;
}

function catAt(x, y) {
    return _objectAt(x, y, _level.cats);
}

function portalAt(x, y) {
    return _objectAt(x, y, _level.portals);
}

function goodLuckAt(x, y) {
    return _objectAt(x, y, _level.goodLucks);
}

function badLuckAt(x, y) {
    return _objectAt(x, y, _level.badLucks);
}

function consumeObjectAt(x, y, list, set) {
    let obj = _objectAt(x, y, list);
    if (obj) {
        set(list.filter(o => o != obj));
        _level.game.removeChild(obj.element);
    }
    return obj;
}

function getFreeCell() {
    let cellX;
    let cellY;
    freeCellFound = false;
    while (!freeCellFound) {
        cellX = Math.floor(Math.random() * _level.width);
        cellY = Math.floor(Math.random() * _level.height);
        if (!_occupiedCells.find(c => c.x == cellX && c.y == cellY)) {
            return ({ x: cellX, y: cellY })
        }
    }
}

function _objectAt(x, y, list) {
    return list.find(o => o.cellX == x && o.cellY == y);
}

let _levels = [
    { width : 10, height: 10, cats: 5, portals: 8, badLucks: 8, goodLucks: 8},
    { width : 10, height: 10, cats: 5, portals: 8, badLucks: 8, goodLucks: 8},
    { width : 12, height: 12, cats: 5, portals: 8, badLucks: 8, goodLucks: 8},
    { width : 12, height: 12, cats: 5, portals: 8, badLucks: 8, goodLucks: 8},
    { width : 14, height: 14, cats: 7, portals: 8, badLucks: 8, goodLucks: 8},
    { width : 14, height: 14, cats: 7, portals: 8, badLucks: 8, goodLucks: 8},
    { width : 16, height: 8, cats: 8, portals: 8, badLucks: 8, goodLucks: 10},
    { width : 16, height: 8, cats: 8, portals: 8, badLucks: 8, goodLucks: 10},
    { width : 8, height: 20, cats: 12, portals: 10, badLucks: 12, goodLucks: 10},
    { width : 8, height: 20, cats: 12, portals: 10, badLucks: 12, goodLucks: 10},
    { width : 15, height: 15, cats: 12, portals: 10, badLucks: 12, goodLucks: 10},
    { width : 15, height: 15, cats: 12, portals: 10, badLucks: 12, goodLucks: 10},
    { width : 15, height: 15, cats: 15, portals: 10, badLucks: 14, goodLucks: 10},
    { width : 15, height: 15, cats: 15, portals: 10, badLucks: 14, goodLucks: 10},
    { width : 17, height: 17, cats: 17, portals: 10, badLucks: 18, goodLucks: 12},
    { width : 17, height: 17, cats: 17, portals: 10, badLucks: 18, goodLucks: 12},
    { width : 18, height: 18, cats: 20, portals: 12, badLucks: 22, goodLucks: 12},
    { width : 18, height: 18, cats: 20, portals: 12, badLucks: 22, goodLucks: 12},
    { width : 20, height: 20, cats: 25, portals: 15, badLucks: 25, goodLucks: 15},
    { width : 20, height: 20, cats: 25, portals: 15, badLucks: 25, goodLucks: 15},
];

function _generateCell(x, y, g, openings) {
    let cell = { x: x, y : y };
    if (!_openingExists(x, y, x + 1, y, openings)) { // Add right edge
        cell.r = svgLine((x + 1) * side, y * side, (x + 1) * side, (y + 1) * side, wallColor, wallThickness);
        g.appendChild(cell.r);
    }
    if (!_openingExists(x, y, x, y + 1, openings)) { // Add bottom edge
        cell.b = svgLine(x * side, (y + 1) * side, (x + 1) * side, (y + 1) * side, wallColor, wallThickness);
        g.appendChild(cell.b);
    }
    if (!_openingExists(x, y, x - 1, y, openings)) { // Add left edge
        cell.l = svgLine(x * side, y * side, x * side, (y + 1) * side, wallColor, wallThickness);
        g.appendChild(cell.l);
    }
    if (!_openingExists(x, y, x, y - 1, openings)) { // Add top edge
        cell.t = svgLine(x * side, y * side, (x + 1) * side, y * side, wallColor, wallThickness);
        g.appendChild(cell.t);
    }
    return cell;
}

function _generateMaze() {
    const stack = [];
    const openings = new Set();
    const visited = new Set();

    let x = Math.floor(Math.random() * _level.width);
    let y = Math.floor(Math.random() * _level.height);
    visited.add(_s2(x, y));

    while (true) {
        const neighbors = [];
        if (x > 0 && !visited.has(_s2(x-1, y))) {
            neighbors.push([x - 1, y]);
        }
        if (x < _level.width - 1 && !visited.has(_s2(x+1, y))) {
            neighbors.push([x + 1, y]); 
        }
        if (y > 0 && !visited.has(_s2(x, y-1))) {
            neighbors.push([x, y-1]); 
        }
        if (y < _level.height-1 && !visited.has(_s2(x, y+1))) {
            neighbors.push([x, y+1]); 
        }
        if (neighbors.length > 0) {
            const [nextX, nextY] = neighbors[Math.floor(Math.random() * neighbors.length)];
            openings.add(_s4(x, y, nextX, nextY));
            visited.add(_s2(nextX, nextY));
            stack.push([x, y]);
            x = nextX;
            y = nextY;
        } else if (stack.length > 0) {
            [x, y] = stack.pop();
        } else {
            break;
        }
    }
    return openings;
}

function _openingExists(x1, y1, x2, y2, openings) {
    return openings.has(_s4(x1, y1, x2, y2)) || openings.has(_s4(x2, y2, x1, y1));
}

function _addObject(svgFunction) {
    let cell = getFreeCell();
    _occupiedCells.push({ x: cell.x, y: cell.y });
    let displayX = side * (cell.x + 0.5);
    let displayY = side * (cell.y + 0.5);
    let element = svgFunction(displayX, displayY);
    _level.game.appendChild(element);
    return { 
        cellX: cell.x, 
        cellY: cell.y,
        displayX: displayX, 
        displayY: displayY, 
        element: element
    };
}

function _s2(x, y) {
    return `${x},${y}`;
}

function _s4(x1, y1, x2, y2) {
    return `${x1},${y1},${x2},${y2}`;
}

let _occupiedCells = [];
let _level = undefined;
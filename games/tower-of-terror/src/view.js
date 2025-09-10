let w = 1500;
let h = 1500;
let svg = document.getElementById("svg");
let zoom = 0;
let zoomTarget = 0;
let visibleCells = [];
let visibleCellsSvg = [];
let wallThickness = 30;
let wallColor = "#1a1815";
let heartAttack = 0;

let targetDir = undefined;

function winnable() {
    let stack = [];
    let visited = new Set();
    stack.push([level.avatar.cellX, level.avatar.cellY]);
    visited.add(`${level.avatar.cellX},${level.avatar.cellY}`);
    while (stack.length > 0) {
        let [x, y] = stack.pop();
        if ((x == level.horseshoe.cellX && y == level.horseshoe.cellY) || portalAt(x, y) || goodLuckAt(x, y)) {
            return true;
        }
        let cell = level[c(x, y)];
        if (!cell.r && !visited.has(`${x+1},${y}`)) {
            visited.add(`${x+1},${y}`);
            stack.push([x+1, y]);
        }
        if (!cell.b && !visited.has(`${x},${y+1}`)) {
            visited.add(`${x},${y+1}`);
            stack.push([x, y+1]);
        }
        if (!cell.l && !visited.has(`${x-1},${y}`)) {
            visited.add(`${x-1},${y}`);
            stack.push([x-1, y]);
        }
        if (!cell.t && !visited.has(`${x},${y-1}`)) {
            visited.add(`${x},${y-1}`);
            stack.push([x, y-1]);
        }
    }
    return false;
}

function startLevel(levelIndex) {
    level = generateLevel(levelIndex);
    svg.appendChild(level.g);
    zoom = 0;
    zoomTarget = 0;
    level.floor.setAttribute("transform", `translate(0 ${levelIndex * 50})`);
}

function c(x, y) {
    return `x${x}y${y}`;
}

function visibleFrom(x, y) {
    let cells = new Set();

    var i = 0;
    while(!level[c(x + i, y)].r) {
        cells.add({ x : x + i + 1, y : y });
        i++;
    } 

    i = 0;
    while(!level[c(x - i, y)].l) {
        cells.add({ x : x - i - 1, y : y });
        i++;
    } 

    i = 0;
    while(!level[c(x, y + i)].b) {
        cells.add({ x : x, y : y + i + 1 });
        i++;
    } 

    i = 0;
    while(!level[c(x, y - i)].t) {
        cells.add({ x : x, y : y - i - 1 });
        i++;
    } 

    return cells;
}

function noOfVisibleOpponents() {
    let count = 0;
    for (let opponent of level.cats) {
        for (let cell of visibleCells) {
            if (opponent.cellX == cell.x && opponent.cellY == cell.y) {
                count++;
            }
        }
    }
    return count;
}

function updateVisibleCells() {
    visibleCells = visibleFrom(level.avatar.cellX, level.avatar.cellY);
}

function consumeObjectAtAvatarPosition(list, set) {
    return consumeObjectAt(level.avatar.cellX, level.avatar.cellY, list, set);
}

function checkCollision() {
    if (consumeObjectAtAvatarPosition(level.portals, l => level.portals = l)) {
        play(portalSound);
        var {x, y} = getFreeCell();
        level.avatar.cellX = x;
        level.avatar.cellY = y;
        left = false;
        right = false;
        up = false;
        down = false;
        if (!winnable()) {
            _endMaze(GSLEVELLOST);
        }
    }

    if (consumeObjectAtAvatarPosition(level.goodLucks, l => level.goodLucks = l)) {
        play(goodLuckSound);
        for (let i = 0; i < 5; i++) {
            var x = Math.floor(Math.random() * (level.width - 2)) + 1;
            var y = Math.floor(Math.random() * (level.height - 2)) + 1;
            let cell = level[c(x, y)];
            if (cell.r) {
                level.maze.removeChild(cell.r);
                cell.r = undefined;
                let cell2 = level[c(x + 1, y)];
                level.maze.removeChild(cell2.l);
                cell2.l = undefined;
            }
            if (cell.b) {
                level.maze.removeChild(cell.b);
                cell.b = undefined;
                let cell2 = level[c(x, y + 1)];
                level.maze.removeChild(cell2.t);
                cell2.t = undefined;
            }
            if (cell.l) {
                level.maze.removeChild(cell.l);
                cell.l = undefined;
                let cell2 = level[c(x - 1, y)];
                level.maze.removeChild(cell2.r);
                cell2.r = undefined;
            }
            if (cell.t) {
                level.maze.removeChild(cell.t);
                cell.t = undefined;
                let cell2 = level[c(x, y - 1)];
                level.maze.removeChild(cell2.b);
                cell2.b = undefined;
            }
        }
        if (!winnable()) {
            _endMaze(GSLEVELLOST);
        }
    }

    if (consumeObjectAtAvatarPosition(level.badLucks, l => level.badLucks = l)) {
        play(badLuckSound);
        for (let i = 0; i < 5; i++) {
            var x = Math.floor(Math.random() * (level.width - 2)) + 1;
            var y = Math.floor(Math.random() * (level.height - 2)) + 1;
            let cell = level[c(x, y)];
            if (!cell.r) {
                cell.r = svgLine((x + 1) * side, y * side, (x + 1) * side, (y + 1) * side, wallColor, wallThickness);
                level.maze.appendChild(cell.r);
                let cell2 = level[c(x + 1, y)];
                cell2.l = svgLine((x + 1) * side, y * side, (x + 1) * side, (y + 1) * side, wallColor, wallThickness);
                level.maze.appendChild(cell2.l);
            }
            else if (!cell.b) {
                cell.b = svgLine(x * side, (y + 1) * side, (x + 1) * side, (y + 1) * side, wallColor, wallThickness);
                level.maze.appendChild(cell.b);
                let cell2 = level[c(x, y + 1)];
                cell2.t = svgLine(x * side, (y + 1) * side, (x + 1) * side, (y + 1) * side, wallColor, wallThickness);
                level.maze.appendChild(cell2.t);
            }
            else if (!cell.l) {
                cell.l = svgLine(x * side, y * side, x * side, (y + 1) * side, wallColor, wallThickness);
                level.maze.appendChild(cell.l);
                let cell2 = level[c(x - 1, y)];
                cell2.r = svgLine(x * side, y * side, x * side, (y + 1) * side, wallColor, wallThickness);
                level.maze.appendChild(cell2.r);
            }
            else if (!cell.t) {
                cell.t = svgLine(x * side, y * side, (x + 1) * side, y * side, wallColor, wallThickness);
                level.maze.appendChild(cell.t);
                let cell2 = level[c(x, y - 1)];
                cell2.b = svgLine(x * side, y * side, (x + 1) * side, y * side, wallColor, wallThickness);
                level.maze.appendChild(cell2.b);
            }
        }
        if (!winnable()) {
            _endMaze(GSLEVELLOST);
        }
    }

    if (level.horseshoe.cellX == level.avatar.cellX && level.horseshoe.cellY == level.avatar.cellY) {
        if (level.index == _levels.length - 1) {
            play(escapedSound);
            _endGame();
        }
        else {
            _endMaze(GSLEVELWON);
        }
    }
}

function _endMaze(newGameState) {
    let message;
    if (newGameState == GSLEVELWON) {
        play(levelWonSound);
        lives++;
        message = `one maze closer to freedom... you now have ${lives} ${lives == 1 ? "life" : "lives"}`;
    }
    else {
        if (lives < 1) {
            message = "you failed...";
            newGameState = GSGAMELOST;
        }
        else {
            lives--;
            let reason = heartAttack > 100 ? "your heart collapsed from the stress" : "you got stuck in the maze";
            let youHave = lives == 1 ? "you have 1 life left" : `you have ${lives} lives left`;
            if (lives == 0) {
                youHave = "";
            }
            message = `${reason}... but you get another attempt... ${youHave}`;
        }
        play(levelLostSound);
    }
    zoomTarget = 0;
    gameState = newGameState;
    popupText = svgText(message, 0, 0, "white");
    svg.appendChild(popupText);
}

function _endGame() {
    zoomTarget = 0;
    gameState = GSGAMEWON;
    popupText = svgText("you have escaped!", 0, 0, "white");
    svg.appendChild(popupText);
}

function updateView(dt) {

    if (gameState == GSMENU) {
        return;
    }

    if (gameState == GSGAMEWON && mazeOpacity > 0) {
        mazeOpacity -= dt * 0.0005;
        if (mazeOpacity < 0) {
            mazeOpacity = 0;
            svg.appendChild(svgText("finally, the night's torment is over", x - 150, y - 100, "white"));
            svg.appendChild(svgText("no more mazes...", x - 90, y - 40, "white"));
            svg.appendChild(svgText("no more 13s...", x - 75, y, "white"));
            svg.appendChild(svgText("AND NO MORE BLACK CATS!", x - 145, y + 60, "white"));
        }
        level.game.setAttribute("opacity", `${mazeOpacity}`);
    }

    if (gameState == GSPLAYING) {
        if (!targetDir) {
            let cell = level[c(level.avatar.cellX, level.avatar.cellY)];
            if (right && !cell.r) {
                targetDir = { x : 1, y : 0 };
            }
            else if (down && !cell.b) {
                targetDir = { x : 0, y : 1 };
            }
            else if (left && !cell.l) {
                targetDir = { x : -1, y : 0 };
            }
            else if (up && !cell.t) {
                targetDir = { x : 0, y : -1 };
            }
        }

        if (targetDir) {
            if (targetDir.x == 1) {
                x += dt * 0.5;
                if (x >= side * (level.avatar.cellX + 1.5)) {
                    x = side * (level.avatar.cellX + 1.5);
                    level.avatar.cellX++;
                    checkCollision();
                    updateVisibleCells();
                    targetDir = undefined;
                }
            }
            else if (targetDir.y == 1) {
                y += dt * 0.5;
                if (y >= side * (level.avatar.cellY + 1.5)) {
                    y = side * (level.avatar.cellY + 1.5);
                    level.avatar.cellY++;
                    checkCollision();
                    updateVisibleCells();
                    targetDir = undefined;
                }
            }
            else if (targetDir.x == -1) {
                x -= dt * 0.5;
                if (x <= side * (level.avatar.cellX - 0.5)) {
                    x = side * (level.avatar.cellX - 0.5);
                    level.avatar.cellX--;
                    checkCollision();
                    updateVisibleCells();
                    targetDir = undefined;
                }
            }
            else if (targetDir.y == -1) {
                y -= dt * 0.5;
                if (y <= side * (level.avatar.cellY - 0.5)) {
                    y = side * (level.avatar.cellY - 0.5);
                    level.avatar.cellY--;
                    checkCollision();
                    updateVisibleCells();
                    targetDir = undefined;
                }
            }
        }
        else {
            x = side * (level.avatar.cellX + 0.5);
            y = side * (level.avatar.cellY + 0.5);
        }

        for (let i = 0; i < level.cats.length; i++) {
            let opponent = level.cats[i];
            if (!opponent.dir) {
                let cell = level[c(opponent.cellX, opponent.cellY)];
                let rnd = Math.floor(Math.random() * 4);
                if (rnd == 0 && !cell.r) {
                    opponent.dir = { x : 1, y : 0 };
                }
                else if (rnd == 1 && !cell.b) {
                    opponent.dir = { x : 0, y : 1 };
                }
                else if (rnd == 2 && !cell.l) {
                    opponent.dir = { x : -1, y : 0 };
                }
                else if (rnd == 3 && !cell.t) {
                    opponent.dir = { x : 0, y : -1 };
                }
            }

            if (opponent.dir) {
                if (opponent.dir.x == 1) {
                    opponent.displayX += dt * 0.5;
                    if (opponent.displayX >= side * (opponent.cellX + 1.5)) {
                        opponent.displayX = side * (opponent.cellX + 1.5);
                        opponent.cellX++;
                        if (level[c(opponent.cellX, opponent.cellY)].r) {
                            opponent.dir = undefined;
                        }
                    }
                }
                else if (opponent.dir.y == 1) {
                    opponent.displayY += dt * 0.5;
                    if (opponent.displayY >= side * (opponent.cellY + 1.5)) {
                        opponent.displayY = side * (opponent.cellY + 1.5);
                        opponent.cellY++;
                        if (level[c(opponent.cellX, opponent.cellY)].b) {
                            opponent.dir = undefined;
                        }
                    }
                }
                else if (opponent.dir.x == -1) {
                    opponent.displayX -= dt * 0.5;
                    if (opponent.displayX <= side * (opponent.cellX - 0.5)) {
                        opponent.displayX = side * (opponent.cellX - 0.5);
                        opponent.cellX--;
                        if (level[c(opponent.cellX, opponent.cellY)].l) {
                            opponent.dir = undefined;
                        }
                    }
                }
                else if (opponent.dir.y == -1) {
                    opponent.displayY -= dt * 0.5;
                    if (opponent.displayY <= side * (opponent.cellY - 0.5)) {
                        opponent.displayY = side * (opponent.cellY - 0.5);
                        opponent.cellY--;
                        if (level[c(opponent.cellX, opponent.cellY)].t) {
                            opponent.dir = undefined;
                        }
                    }
                }
            }
            else {
                opponent.displayX = side * (opponent.cellX + 0.5);
                opponent.displayY = side * (opponent.cellY + 0.5);
            }
        }
    }

    if (zoom > zoomTarget) {
        zoom -= dt * 0.1;
    }
    if (zoom < zoomTarget) {
        zoom += dt * 0.1;
    }

    if (gameState == GSPLAYING) {
        let visible = noOfVisibleOpponents();
        if (visible == 0) {
            zoomTarget -= 5;
        }
        else {
            zoomTarget += visible * 20;
        }
    }

    if (zoomTarget < 0) {
        zoomTarget = 0;
    }
    if (zoomTarget > 700) {
        zoomTarget = 700;
    }

    level.avatar.head1.setAttribute("transform", `translate(${x} ${y}) scale(1, 1)`);
    level.avatar.head1.style.display = zoom < 10 && gameState == GSPLAYING ? "" : "none";
    level.avatar.head2.setAttribute("transform", `translate(${x} ${y}) scale(1.2, 1.2)`);
    level.avatar.head2.style.display = zoom >= 10 && zoom < 200 && gameState == GSPLAYING ? "" : "none";
    level.avatar.head3.setAttribute("transform", `translate(${x} ${y}) scale(1.4, 1.4)`);
    level.avatar.head3.style.display = zoom >= 200 && zoom < 500 && gameState == GSPLAYING ? "" : "none";
    level.avatar.head4.setAttribute("transform", `translate(${x} ${y}) scale(1.6, 1.6)`);
    level.avatar.head4.style.display = zoom > 500 && gameState == GSPLAYING ? "" : "none";

    if (level.avatar.head4.style.display == "") { // biggest zoom, increased risk of heart attack
        heartAttack += dt * 0.03;
        if (heartAttack > 100) {
            _endMaze(GSLEVELLOST);
        }
        else if (Math.floor(Math.random() * 100) < heartAttack) {
            let red = svgRect(0, 0, w, h, "red");
            red.setAttribute("opacity", "0.5");
            svg.appendChild(red);
            setTimeout(() => {
                svg.removeChild(red);
            }, 50);
        }
    } 
    else { // not biggest zoom, decreased risk of heart attack
        heartAttack -= dt * 0.2;
        if (heartAttack < 0) {
            heartAttack = 0;
        }
    }

    level.tower.setAttribute("transform", `translate(${x + 300} ${y - 780}) scale(2.5)`);
    if (popupText) {
        popupText.setAttribute("x", x - 100);
        popupText.setAttribute("y", y - 200);
    }
    for (let i = 0; i < level.cats.length; i++) {
        let cat = level.cats[i];
        cat.element.setAttribute("transform", `translate(${cat.displayX} ${cat.displayY}) scale(2)`);
    }
    svg.setAttribute("viewBox", `${x+zoom-750} ${y+zoom-750} ${w-zoom-zoom} ${h-zoom-zoom}`);

    if (popupText && gameState != GSGAMEWON && (zoom < 10) && !timeOutSet) {
        timeOutSet = true;
        setTimeout(() => {
            svg.removeChild(popupText);
            svg.removeChild(level.g);
            popupText = undefined;
            if (gameState == GSGAMELOST) {
                gameState = GSMENU;
                displayMenu();    
            }
            else {
                startLevel(gameState == GSLEVELWON ? level.index + 1 : level.index);
                gameState = GSPLAYING;
            }
            timeOutSet = false;
        }, 1500);
    }
}

let popupText = undefined;
let timeOutSet = false;
let mazeOpacity = 1;
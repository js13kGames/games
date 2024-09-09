/**
 * Created by Hoffs-Laptop on 2017-09-11.
 */

var cv;
var ctx;
var isStarted = 0;
var shouldContinue = 1;

var middleX;
var middleY;

var menuButtonRects = [];
var gameButtonRects = [];
var obstacleRects = [];
var bonusPointRects = [];

var userRect = [];

function adjustCanvasToScreen() {
    cv.setAttribute("width",  (window.innerWidth - 50).toString());
    cv.setAttribute("height", (window.innerHeight - 25).toString());
    middleX = cv.getAttribute("width") / 2;
    middleY = cv.getAttribute("height") / 2;
}

function addMenuButtons() {
    menuButtonRects = [];
    width = window.innerWidth / 100 * 20;
    height = 40;

    x = middleX - (width / 2);
    y = middleY - (height / 2);

    var obj = {
        x: x,
        y: y,
        w: width,
        h: height,
        isButton: true,
        buttonText: "Start"
    };

    menuButtonRects.push(obj);
}

function onLoadProcedure() {
    cv = document.getElementById("mainCanvas");
    ctx = cv.getContext("2d");
    adjustCanvasToScreen();
    addMenuButtons();
    drawRectangles(menuButtonRects);
}

function addGameButtons() {
    gameButtonRects = [];
    width = window.innerWidth / 100 * 7;
    height = 30;

    var x = 16;
    var y = 6 + 24 + (height / 2);

    var obj = {
        x: x,
        y: y,
        w: width,
        h: height,
        isButton: true,
        buttonText: "Exit"
    };

    gameButtonRects.push(obj);
}

function drawRectangles(rects) {
    for (var i = 0; i < rects.length; i++) {
        currentRect = rects[i];
        if (currentRect.isButton) {
            ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
            ctx.fillRect(currentRect.x, currentRect.y, currentRect.w, currentRect.h);
            ctx.fillStyle = "#fff";
            ctx.font = (currentRect.h - 6) + "px Helvetica";
            ctx.textAlign = "center";
            ctx.fillText(currentRect.buttonText, (currentRect.x + (currentRect.w/2)), (currentRect.y + (currentRect.h-6)));
        }
        if (currentRect.isObstacle) {
            ctx.fillStyle = "rgba(220, 20, 60, 0.6)";
            ctx.fillRect(currentRect.x, currentRect.y, currentRect.w, currentRect.h);
        }
        if (currentRect.isUser) {
            ctx.fillStyle = "rgba(220, 255, 255, 0.7)";
            ctx.fillRect(currentRect.x, currentRect.y, currentRect.w, currentRect.h);
        }
        if (currentRect.isBonusPoints) {
            ctx.fillStyle = "rgba(0, 255, 0, 0.3)";
            ctx.fillRect(currentRect.x, currentRect.y, currentRect.w, currentRect.h);
        }
    }
}

function fixCanvasSizeOnResize() {
    if (isStarted) return;

    adjustCanvasToScreen();
    addMenuButtons();
    drawRectangles(menuButtonRects);
}

function clickEvent(event) {
    var coords = cv.relMouseCoords(event);
    console.log(coords);
    if (!isStarted && isCollision(menuButtonRects, coords.x, coords.y) !== false) {
        gameLoop();
    }
    if (isStarted && isCollision(gameButtonRects, coords.x, coords.y) !== false) {
        shouldContinue = 0;
    }
}

function isCollision(rects, x, y) {
    var isCollision = false;
    for (var i = 0, len = rects.length; i < len; i++) {
        var left = rects[i].x, right = rects[i].x+rects[i].w;
        var top = rects[i].y, bottom = rects[i].y+rects[i].h;
        if (right >= x
            && left <= x
            && bottom >= y
            && top <= y) {
            isCollision = i;
        }
    }
    return isCollision;
}

function relMouseCoords(event){
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var currentElement = this;

    do {
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    } while (currentElement = currentElement.offsetParent)

    var canvasX = event.pageX - totalOffsetX;
    var canvasY = event.pageY - totalOffsetY;

    return {x:canvasX, y:canvasY}
}

HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;
window.addEventListener('load', onLoadProcedure);
window.addEventListener('resize', fixCanvasSizeOnResize);
window.addEventListener('click', clickEvent);

// Game logic

var score = 0;
var gameSpeed = 1;
var lastIncrease = null;
var userDirection = "n"; // n - north, s - south, w - west, e - east
var lastKeyCode;
var isUserMoving = false;
var scoreInterval;

var keyUpTimeout;

function gameLoop() {
    if (!isStarted) {
        setupUser();
        addGameButtons();
        scoreInterval = setInterval(() => {
            score += gameSpeed;
        }, 1000);
    }
    if (!shouldContinue || isUserCollided(obstacleRects)) {
        clearInterval(scoreInterval);
        return;
    }

    if (isUserCollided(bonusPointRects) !== false) {
        bonusPointRects.splice(isUserCollided(bonusPointRects), 1);
        score += 10;
    }

    if (lastIncrease == null) lastIncrease = Date.now();
    if (lastIncrease != null && (Date.now() - lastIncrease > (10 * 1000))) {
        lastIncrease = Date.now();
        gameSpeed++;
    }

    isStarted = true;
    ctx.clearRect(0, 0, cv.getAttribute("width"), cv.getAttribute("height"));
    drawScore();
    // drawDebug();
    if (Math.random() < (0.5 * gameSpeed) && (bonusPointRects.length < (1 * gameSpeed))) addNewBonusPointsObstacle();
    if (Math.random() < (0.015 * gameSpeed) && (obstacleRects.length < (5 * gameSpeed))) addNewObstacle();
    moveUser();
    moveObstacles(obstacleRects);
    moveObstacles(bonusPointRects);

    drawRectangles(obstacleRects);
    drawRectangles(gameButtonRects);
    drawRectangles(bonusPointRects);
    drawRectangles(userRect);

    requestAnimationFrame(gameLoop);
}

function setupUser() {
    user = {
        x: middleX,
        y: middleY,
        w: 20,
        h: 20,
        speed: 5,
        isUser: true
    };

    userRect.push(user);

    addEventListener('keyup', keyUpHandler);
    addEventListener('keydown', keyDownHandler);
}

function isUserCollided(rects) {
    user = userRect[0];
    x = user.x;
    y = user.y; // Top left
    if (isCollision(rects, x, y) !== false) return isCollision(rects, x, y);

    y = user.y + user.h; // Bottom left
    if (isCollision(rects, x, y) !== false) return isCollision(rects, x, y);

    x = user.x + user.w; // Bottom right
    if (isCollision(rects, x, y) !== false) return isCollision(rects, x, y);

    y = user.y; // Top right
    if (isCollision(rects, x, y) !== false) return isCollision(rects, x, y);

    return false;
}

function keyDownHandler(event) {
    clearTimeout(keyUpTimeout);
    switch (event.code) {
        case "KeyW":
            lastKeyCode = event.code;
            isUserMoving = true;
            userDirection = "n";
            break;
        case "KeyS":
            lastKeyCode = event.code;
            isUserMoving = true;
            userDirection = "s";
            break;
        case "KeyA":
            lastKeyCode = event.code;
            isUserMoving = true;
            userDirection = "w";
            break;
        case "KeyD":
            lastKeyCode = event.code;
            isUserMoving = true;
            userDirection = "e";
            break;
        default:
            break;
    }
}

function keyUpHandler(event) {
    keyUpTimeout = setTimeout(() => {
        if (event.code == lastKeyCode) isUserMoving = false;
    }, 10);
}

function moveUser() {
    var user = userRect[0];
    if (isUserMoving) {
        switch (userDirection) {
            case "n":
                if (user.y - user.speed > 0)
                    user.y -= user.speed;
                break;
            case "s":
                if (user.y + user.speed < cv.getAttribute("height") - 20)
                    user.y += user.speed;
                break;
            case "w":
                if (user.x - user.speed > 0)
                    user.x -= user.speed;
                break;
            case "e":
                if (user.x + user.speed < cv.getAttribute("width") - 20)
                    user.x += user.speed;
                break;
        }
    }
}

function drawScore() {
    var text = "Score: " + score;
    var x = (5 * text.length) + 24;
    var y = 6 + 24;
    ctx.font = "24px Helvetica";
    ctx.fillStyle = "#fff";
    ctx.fillText(text, x, y);
}

function drawDebug() {
    var x = middleX + 24;
    var y = 6 + 24;
    ctx.font = "24px Helvetica";
    ctx.fillStyle = "#fff";
    ctx.fillText("Game speed: " + gameSpeed + " | Obstacle count: " + obstacleRects.length, x, y);
}

function addNewObstacle() {
    var maxHeight = cv.getAttribute("height") / 10;
    var maxWidth = cv.getAttribute("width") / 10;
    var height = (Math.random() * maxHeight) + 16;
    var width = (Math.random() * maxWidth) + 16;

    var positionX = (Math.random() * cv.getAttribute("width"));
    var positionY = (cv.getAttribute("height") / 10) + (cv.getAttribute("height") - (Math.random() * cv.getAttribute("height") / 10));
    var speed = (Math.random() * (height / 16)) + (0.25 * gameSpeed);

    var obj = {
        x: positionX,
        y: positionY,
        w: width,
        h: height,
        isObstacle: true,
        speed: speed
    }

    obstacleRects.push(obj);
}

function addNewBonusPointsObstacle() {
    var height = 15;
    var width = 15;

    var positionX = (Math.random() * cv.getAttribute("width"));
    var positionY = (cv.getAttribute("height") / 10) + (cv.getAttribute("height") - (Math.random() * cv.getAttribute("height") / 10));
    var speed = (Math.random() * (height / 16)) + (0.25 * gameSpeed);

    var obj = {
        x: positionX,
        y: positionY,
        w: width,
        h: height,
        isBonusPoints: true,
        speed: speed
    }

    bonusPointRects.push(obj);
}

function moveObstacles(rects) {
    for (var i = 0; i < rects.length; i++) {
        var obstacle = rects[i];
        if (obstacle.y < -1 * (cv.getAttribute("width") / 10)) rects.splice(i, 1);
        obstacle.y -= obstacle.speed;
    }
}
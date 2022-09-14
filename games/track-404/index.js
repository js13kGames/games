const CHEAT = false;
const DEBUG = false;

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

let degToRad = deg => deg * Math.PI / 180;

let topRowHeight = 100;
let bottomRowHeight = 0;
let scrollMargin = 395;

var dimensions = {
    minX: scrollMargin,
    minY: scrollMargin,
    maxX: 0,
    maxY: 0,
    cx: 0,

    update(w, h) {
        this.w = w,
        this.h = h,
        this.maxX = w - scrollMargin;
        this.maxY = h - scrollMargin;
        this.cx = w / 2;
    }
}

let lastTime = Date.now();
var gameStateToResumeAfterResize;

gameLoop = () => {
    let now = Date.now();
    let dt = (now - lastTime);

    gameContext.update(dt);

    fillRect(0, 0, dimensions.w, dimensions.h, "green", context);
    gameContext.render();
    drawOverlay(gameContext, context);
    if (DEBUG) {
        drawDebugInfo();
    }

    requestAnimationFrame(gameLoop);
    lastTime = now;
}

handleResize = (w, h) => {
    canvas.width = w;
    canvas.height = h;
    var cw = canvas.clientWidth;
    var ch = canvas.clientHeight;
    dimensions.update(cw, ch);
    if (!canvasIsLargeEnough()) {
        if (gameContext.gameState == GameState.PLAYING) {
            gameStateToResumeAfterResize = GameState.CONTINUING;
        }
        else if (gameContext.gameState != GameState.PAUSED_FOR_RESIZE) {
            gameStateToResumeAfterResize = gameContext.gameState;
        }
        gameContext.setGameState(GameState.PAUSED_FOR_RESIZE);
    }
}

initialize = () => {
    window.addEventListener('resize', () => {
        handleResize(window.innerWidth, window.innerHeight);
    });
    canvas.addEventListener('click', () => {
        if (canvasIsLargeEnough()) {
            if (gameContext.gameState == GameState.IDLE) {
                gameContext.setGameState(GameState.PRESENTLEVEL);
            }
            else if (gameContext.gameState == GameState.PAUSED) {
                gameContext.setGameState(GameState.CONTINUING);
            }
            else if (gameContext.gameState == GameState.PAUSED_FOR_RESIZE) {
                gameContext.setGameState(gameStateToResumeAfterResize);
            }
        }
    });
    gameContext.setGameState(GameState.IDLE);
    handleResize(window.innerWidth, window.innerHeight);
    initInput(document);
    gameLoop();
}

getCanvasSize = () => {
    return { w: canvas.clientWidth, h: canvas.clientHeight };
}

canvasIsLargeEnough = () => {
    var { w, h } = getCanvasSize();
    return w >= 800 && h >= 800;
}

window.addEventListener('load', () => initialize()); 

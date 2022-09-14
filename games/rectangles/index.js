let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

let rightPressed = false;
let leftPressed = false;
let enterPressed = false;

let pause = false;
let isGameStarted = false;

let gameSpeed = 2;

let score = 0;
/*********************
 *      START        *
 ********************/

initGame();
gameLoop();

/*********************
 *  GAME FUNCTIONS   *
 ********************/

function initGame() {
    board.init(canvas);
    player.init();

    pause = false;
    score = 0;
}

function gameLoop() {
    if (!isGameStarted) {
        if (enterPressed) {
            isGameStarted = true;
            enterPressed = false;
            initGame();
        } else {
            if (!isGameOver()) {
                board.draw();
                menu.intro();
            }
        }
        requestAnimationFrame(gameLoop);
        return;
    }
    if (pause) {
        menu.drawPause();
        requestAnimationFrame(gameLoop);
        return;
    }

    if (isGameOver()) {
        requestAnimationFrame(gameLoop);
        return;
    }

    if (rightPressed) {
        player.goRight();
        score++;
        rightPressed = false;
    } else if (leftPressed) {
        score++;
        player.goLeft();
        leftPressed = false;
    }

    board.update();
    player.update();

    clearCanvas();

    board.draw();
    player.draw();

    menu.drawScore();
    menu.drawLife();

    requestAnimationFrame(gameLoop);
}

function isGameOver() {
    if (player.isPlayerDead()) {
        if (player.life > 0 && player.cellY < board.cells.length && !player.isPlayerGoOut()) {
            board.cells[player.cellY][player.cellX].empty = false;
            board.cells[player.cellY][player.cellX].color = '#999999';

            player.life--;
            return false;
        }
        menu.drawGameOver();
        isGameStarted = false;
        pause = true;
        return true;
    }
}

function keyDownHandler(event) {
    if (event.keyCode === 39) {
        rightPressed = true;
    } else if (event.keyCode === 37) {
        leftPressed = true;
    } else if (event.keyCode === 32) {
        pause = !pause;
    } else if (event.keyCode === 13) {
        enterPressed = true;
    }
}

document.addEventListener('keydown', keyDownHandler, false);

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
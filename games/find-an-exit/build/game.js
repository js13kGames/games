import { clr, } from './common.js';
import { GRAVITY, TILE_SIZE } from './constants.js';
import { keyPressed } from './controller.js';
import Player from './player.js';
import StartScreen from './start_screen.js';
import getLevels from './levels.js';
import WinScreen from './win_screen.js';
let newLevelStarted = false;
let gameStarted = false;
let playerWon = false;
let currentLevelNumber = 0;
let player;
let Levels = getLevels();
let startScreen = new StartScreen();
let winScreen = new WinScreen();
function update(timeStep = 1) {
    if (gameStarted) {
        if (!newLevelStarted) {
            const playerStartingPoint = { x: Levels[currentLevelNumber].start[0] * TILE_SIZE, y: Levels[currentLevelNumber].start[1] * TILE_SIZE };
            player = new Player(playerStartingPoint);
            newLevelStarted = true;
            return player;
        }
        else {
            if (player) {
                let lastPlayerState = player;
                // Add gravity to player
                player.dy += GRAVITY;
                Levels[currentLevelNumber].handleVerticalCollision(player);
                player.jump(timeStep);
                Levels[currentLevelNumber].handleHorizontalCollision(player);
                player.move(timeStep);
                player.adjustBoundingBox();
                if (Levels[currentLevelNumber].reachedFakeExit(player)) {
                    player.loseLife();
                }
                if (Levels[currentLevelNumber].reachedExit(player) || player.health === 0) {
                    gameStarted = false;
                    newLevelStarted = false;
                    Levels = getLevels();
                    if (Levels[currentLevelNumber].reachedExit(player))
                        playerWon = true;
                }
                return lastPlayerState;
            }
        }
    }
    else {
        if (keyPressed[0 /* Enter */]) {
            gameStarted = true;
        }
    }
}
function render(player) {
    clr();
    if (playerWon) {
        winScreen.render();
        setTimeout(() => {
            playerWon = false;
        }, 2000);
    }
    else if (gameStarted) {
        Levels[currentLevelNumber].render(player);
        player?.render();
    }
    else if (!gameStarted) {
        startScreen.render();
    }
}
const fps = 60;
const timeStep = 1000 / fps;
let currentTime = performance.now();
let timeAccumulator = 0.0;
let currentTimeState = 0;
let previousTimeState = 0;
function loop(timestamp) {
    if (timestamp < currentTimeState + timeStep) {
        requestAnimationFrame(loop);
        return;
    }
    let newTime = timestamp;
    let frameTime = newTime - currentTime;
    // if (frameTime > 0.25) frameTime = 0.25;
    currentTime = newTime;
    timeAccumulator += frameTime;
    let lastPlayerState;
    while (timeAccumulator >= timeStep) {
        previousTimeState = currentTimeState;
        lastPlayerState = update();
        timeAccumulator -= timeStep;
    }
    const alpha = timeAccumulator / timeStep;
    currentTimeState = currentTimeState * alpha + previousTimeState * (1.0 - alpha);
    render(lastPlayerState);
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
